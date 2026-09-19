#!/usr/bin/env node
/**
 * End-to-end check of the primary loop against a RUNNING local backend + local Postgres:
 *   auth -> RFQ -> supplier matching -> supplier quotes (full / partial / cannot-supply)
 *   -> admin review -> customer quotation -> accept/reject guards -> privacy checks.
 *
 * Safety:
 *  - Self-contained: it creates its OWN admin, suppliers, products, stock and customers, all named with
 *    a unique run id (emails `<runId>-*@e2e.invalid`). It never logs in as, or reads/writes, the demo seed
 *    accounts or any other existing business record.
 *  - Cleanup removes only rows reachable from the users/products it created in THIS run, then verifies
 *    that nothing carrying this run id is left.
 *  - No credentials are stored here: a random password is generated on every run.
 *  - Refuses to run against a non-local API/DB or when NODE_ENV=production.
 *  - Exit code: 0 = all checks passed, 1 = a check failed (or the run errored), 2 = precondition not met.
 *
 * Usage (from server/):   npm run test:e2e   # builds, starts a private API instance, runs, cleans up, stops it
 * Needs: local Postgres up and migrated (DATABASE_URL from server/.env).
 * Isolation: by default the script runs the compiled API as its own child process on a random port, so its
 * failed-login checks hit a separate in-memory limiter and never add to the counters of a dev server you have
 * running. Set E2E_API_BASE_URL to test an already-running local API instead (that server's limiter is then used).
 */
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
try {
  require('dotenv').config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
} catch {
  /* dotenv optional: DATABASE_URL may already be in the environment */
}
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const SERVER_DIR = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const EXTERNAL_API = Boolean(process.env.E2E_API_BASE_URL);
let BASE = process.env.E2E_API_BASE_URL ?? '';
let apiProcess = null;
process.on('exit', () => apiProcess?.kill());
const RUN = `e2e${Date.now().toString(36)}${crypto.randomBytes(2).toString('hex')}`;
const PW = `E2e!${crypto.randomBytes(9).toString('base64url')}`;
// The API lowercases emails on login/register, so provisioned users must be lowercase too.
const email = (tag) => `${RUN}-${tag}@e2e.invalid`.toLowerCase();

// ── preconditions ──────────────────────────────────────────────────────
const isLocal = (host) => ['localhost', '127.0.0.1', '::1', '[::1]', 'postgres'].includes(host);
if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run E2E with NODE_ENV=production.');
  process.exit(2);
}
if (EXTERNAL_API && !isLocal(new URL(BASE).hostname)) {
  console.error(`Refusing to run against non-local API: ${BASE}`);
  process.exit(2);
}
try {
  if (!isLocal(new URL(process.env.DATABASE_URL ?? '').hostname)) throw new Error('non-local');
} catch {
  console.error('Refusing to run: DATABASE_URL is missing or not a local database.');
  process.exit(2);
}

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

async function waitForApi(base, timeoutMs = 45_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try {
      if ((await fetch(`${base}/api/docs`)).ok) return true;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/**
 * Default mode: run the compiled API as a private child process on a random port. It has its own
 * in-memory login limiter, so this run never touches the failed-login counters of a dev server you
 * may have running, and the production limiter code stays unchanged.
 */
async function ensureApi() {
  if (EXTERNAL_API) {
    if (!(await waitForApi(BASE, 5000))) {
      console.error(`Backend not reachable at ${BASE}.`);
      process.exit(2);
    }
    console.warn(`NOTE: using external API ${BASE}; failed-login checks will count against that server's limiter.`);
    return;
  }
  if (!fs.existsSync(path.join(SERVER_DIR, 'dist', 'main.js'))) {
    console.error('dist/main.js not found. Run `npm run build` first (or use `npm run test:e2e`, which builds).');
    process.exit(2);
  }
  const port = await freePort();
  BASE = `http://127.0.0.1:${port}`;
  let stderr = '';
  apiProcess = spawn(process.execPath, ['dist/main.js'], {
    cwd: SERVER_DIR,
    // TRUST_PROXY is pinned empty so the run is deterministic: forwarded headers are never trusted.
    env: { ...process.env, NODE_ENV: 'test', PORT: String(port), TRUST_PROXY: '' },
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  apiProcess.stderr.on('data', (chunk) => { stderr = (stderr + chunk).slice(-2000); });
  if (!(await waitForApi(BASE))) {
    console.error(`Isolated API failed to start on ${BASE}.\n${stderr}`);
    apiProcess.kill();
    process.exit(2);
  }
}

const prisma = new PrismaClient();
const results = [];
const jars = {};

function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -> ' + detail : ''}`);
}

async function call(method, urlPath, { token, body, jar = 'default', headers: extraHeaders = {} } = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (jars[jar]) headers.Cookie = jars[jar];
  const res = await fetch(BASE + urlPath, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const sc = (res.headers.getSetCookie?.() ?? []).find((c) => c.startsWith('oeminventory_refresh_token='));
  if (sc) {
    const v = sc.split(';')[0];
    jars[jar] = v.endsWith('=') ? '' : v;
  }
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: res.status, json, text, data: json?.data };
}
const login = async (em, jar) => (await call('POST', '/api/auth/login', { body: { email: em, password: PW }, jar })).data?.accessToken;

// ── fixtures (all owned by this run) ────────────────────────────────────
const normalize = (m) => m.trim().toUpperCase().replace(/[\s\-_]/g, '');
const MPN_OP = `${RUN}-OPAMP`;
const MPN_MCU = `${RUN}-MCU`;

async function createRoleUser(tag, roleName, extra = {}) {
  const role = await prisma.role.upsert({ where: { name: roleName }, create: { name: roleName }, update: {} });
  return prisma.user.create({
    data: { email: email(tag), passwordHash: bcrypt.hashSync(PW, 10), name: `E2E ${tag}`, roles: { create: { roleId: role.id } }, ...extra },
  });
}

async function provision() {
  await createRoleUser('admin', 'ADMIN');
  const mfg = await prisma.manufacturer.create({ data: { name: `E2E Mfg ${RUN}` } });
  const products = {};
  for (const mpn of [MPN_OP, MPN_MCU]) {
    products[mpn] = await prisma.product.create({
      data: { mpn, normalizedMpn: normalize(mpn), manufacturerId: mfg.id, description: `E2E synthetic part ${mpn}`, rohsCompliant: true, reachCompliant: true },
    });
  }
  const suppliers = {};
  for (const [tag, city, state, score] of [['supA', 'Bangalore', 'Karnataka', 98], ['supB', 'Pune', 'Maharashtra', 94]]) {
    const supplier = await prisma.supplier.create({ data: { companyName: `E2E Supplier ${tag} ${RUN}`, city, state, country: 'India', isVerified: true, supplierScore: score } });
    await createRoleUser(tag, 'SUPPLIER', { supplierUser: { create: { supplierId: supplier.id } } });
    for (const mpn of [MPN_OP, MPN_MCU]) {
      await prisma.inventory.create({
        data: {
          productId: products[mpn].id, supplierId: supplier.id, quantity: 50000, unitPrice: 1, condition: 'New & Original', status: 'ACTIVE', location: city,
          lots: { create: { lotNumber: `${RUN}-${tag}-${mpn}`.slice(0, 60), quantity: 50000, availableQuantity: 50000, dateCode: '2418+', packaging: 'Tape & Reel' } },
        },
      });
    }
    suppliers[tag] = supplier;
  }
  return { suppliers };
}

/** Removes only rows reachable from users/products created by THIS run, then verifies nothing is left. */
async function cleanup() {
  const users = await prisma.user.findMany({ where: { email: { startsWith: `${RUN}-` } }, include: { customerUser: true, supplierUser: true } });
  const userIds = users.map((u) => u.id);
  const customerIds = users.map((u) => u.customerUser?.customerId).filter(Boolean);
  const supplierIds = users.map((u) => u.supplierUser?.supplierId).filter(Boolean);
  const rfqIds = (await prisma.rfq.findMany({ where: { customerId: { in: customerIds } }, select: { id: true } })).map((r) => r.id);
  await prisma.$transaction([
    prisma.purchaseOrder.deleteMany({ where: { customerId: { in: customerIds } } }),
    prisma.customerQuotation.deleteMany({ where: { customerId: { in: customerIds } } }),
    prisma.supplierQuote.deleteMany({ where: { OR: [{ supplierId: { in: supplierIds } }, { vendorRfq: { rfqId: { in: rfqIds } } }] } }),
    prisma.vendorRfq.deleteMany({ where: { rfqId: { in: rfqIds } } }),
    prisma.rfq.deleteMany({ where: { id: { in: rfqIds } } }),
    prisma.inventory.deleteMany({ where: { supplierId: { in: supplierIds } } }),
    prisma.product.deleteMany({ where: { mpn: { startsWith: RUN } } }),
    prisma.manufacturer.deleteMany({ where: { name: `E2E Mfg ${RUN}` } }),
    prisma.supplier.deleteMany({ where: { id: { in: supplierIds } } }),
    prisma.customer.deleteMany({ where: { id: { in: customerIds } } }),
    prisma.user.deleteMany({ where: { id: { in: userIds } } }),
  ]);
  const leftover = {
    users: await prisma.user.count({ where: { email: { startsWith: `${RUN}-` } } }),
    products: await prisma.product.count({ where: { mpn: { startsWith: RUN } } }),
    suppliers: await prisma.supplier.count({ where: { companyName: { contains: RUN } } }),
    customers: await prisma.customer.count({ where: { companyName: { contains: RUN } } }),
    rfqs: await prisma.rfq.count({ where: { id: { in: rfqIds } } }),
  };
  const clean = Object.values(leftover).every((n) => n === 0);
  console.log(`\nCLEANUP: removed ${userIds.length} users, ${customerIds.length} customers, ${supplierIds.length} suppliers, ${rfqIds.length} RFQs (+ dependent rows) for run ${RUN}; leftover ${JSON.stringify(leftover)}`);
  return clean;
}

const registerCustomer = (tag) =>
  call('POST', '/api/auth/register/customer', { jar: tag, body: { email: email(tag), password: PW, name: `E2E ${tag}`, companyName: `E2E Customer ${tag} ${RUN}` } });

async function runChecks({ suppliers }) {
  // ── 1. AUTH ──────────────────────────────────────────────────────────
  console.log('\n== 1. AUTH ==');
  const reg = await registerCustomer('cust');
  check('register customer -> 201 + accessToken', reg.status === 201 && !!reg.data?.accessToken, `status ${reg.status}`);
  check('register sets httpOnly refresh cookie', !!jars.cust);
  check('duplicate email -> 409', (await call('POST', '/api/auth/register/customer', { body: { email: email('cust'), password: PW, name: 'x', companyName: 'x' } })).status === 409);
  check('short password -> 400', (await call('POST', '/api/auth/register/customer', { body: { email: email('weak'), password: 'short', name: 'x', companyName: 'x' } })).status === 400);
  check('wrong password -> 401', (await call('POST', '/api/auth/login', { body: { email: email('cust'), password: 'wrong-password' } })).status === 401);
  let custTok = await login(email('cust'), 'cust');
  const me = await call('GET', '/api/auth/me', { token: custTok });
  check('/me returns CUSTOMER role + customerId', me.status === 200 && me.data.roles.includes('CUSTOMER') && !!me.data.customerId);
  check('/me leaks no passwordHash', !/passwordHash/.test(me.text));
  check('no token -> 401', (await call('GET', '/api/auth/me')).status === 401);
  check('garbage token -> 401', (await call('GET', '/api/auth/me', { token: 'abc.def.ghi' })).status === 401);
  const oldCookie = jars.cust;
  const ref = await call('POST', '/api/auth/refresh', { jar: 'cust' });
  check('refresh with cookie -> new accessToken', ref.status === 200 && !!ref.data?.accessToken);
  check('refresh rotates the cookie', jars.cust !== oldCookie);
  jars.replay = oldCookie;
  check('replaying the rotated (old) refresh token -> 401', (await call('POST', '/api/auth/refresh', { jar: 'replay' })).status === 401);
  custTok = ref.data.accessToken;
  check('/me works with the refreshed token', (await call('GET', '/api/auth/me', { token: custTok })).status === 200);
  check('logout -> 200', (await call('POST', '/api/auth/logout', { jar: 'cust' })).status === 200);
  check('refresh after logout -> 401', (await call('POST', '/api/auth/refresh', { jar: 'cust' })).status === 401);
  custTok = await login(email('cust'), 'cust');

  // the same refresh cookie used 4x in parallel: atomic rotation lets at most one succeed
  jars.race = jars.cust;
  const refRace = await Promise.all([1, 2, 3, 4].map(async () => (await call('POST', '/api/auth/refresh', { jar: 'race' })).status));
  check('4 parallel refreshes with one token -> exactly one succeeds', refRace.filter((s) => s === 200).length === 1, refRace.join(','));
  custTok = await login(email('cust'), 'cust');

  await registerCustomer('cust2');
  const cust2Tok = await login(email('cust2'), 'cust2');
  const adminTok = await login(email('admin'), 'admin');
  const supATok = await login(email('supA'), 'supA');
  const supBTok = await login(email('supB'), 'supB');
  await call('POST', '/api/auth/register/supplier', { jar: 'supE', body: { email: email('supE'), password: PW, name: 'E2E supE', companyName: `E2E Supplier supE ${RUN}` } });
  const supETok = await login(email('supE'), 'supE');

  // ── 1b. deactivated user cannot refresh (regression) ──────────────────
  console.log('\n== 1b. DEACTIVATED USER ==');
  await registerCustomer('gone');
  const goneTok = await login(email('gone'), 'gone');
  check('user can use the session before deactivation', (await call('GET', '/api/auth/me', { token: goneTok })).status === 200);
  await prisma.user.update({ where: { email: email('gone') }, data: { isActive: false } });
  check('deactivated user: an already-issued access token is rejected immediately', (await call('GET', '/api/auth/me', { token: goneTok })).status === 401);
  check('deactivated user: refresh -> 401', (await call('POST', '/api/auth/refresh', { jar: 'gone' })).status === 401);
  const goneUser = await prisma.user.findUnique({ where: { email: email('gone') } });
  check('deactivated user: all refresh tokens revoked', (await prisma.refreshToken.count({ where: { userId: goneUser.id, revokedAt: null } })) === 0);
  const goneLogin = await call('POST', '/api/auth/login', { body: { email: email('gone'), password: PW } });
  check('deactivated user: login -> generic 401', goneLogin.status === 401 && /Invalid email or password/.test(goneLogin.text));

  // ── 1c. login rate limit, no account enumeration ──────────────────────
  console.log('\n== 1c. LOGIN RATE LIMIT ==');
  await registerCustomer('locked');
  const attemptsUntilBlocked = async (em) => {
    let last;
    for (let i = 1; i <= 12; i++) {
      last = await call('POST', '/api/auth/login', { body: { email: em, password: 'definitely-wrong' } });
      if (last.status === 429) return { attempts: i, res: last };
    }
    return { attempts: 12, res: last };
  };
  const real = await attemptsUntilBlocked(email('locked'));
  const ghost = await attemptsUntilBlocked(email('ghost'));
  check('existing email is rate-limited (429) after repeated failures', real.res.status === 429, `after ${real.attempts} attempts`);
  check('non-existing email is rate-limited identically', ghost.res.status === 429 && ghost.attempts === real.attempts, `after ${ghost.attempts} attempts`);
  check('429 body is identical for existing and non-existing emails (no enumeration)', JSON.stringify(real.res.json?.error?.message) === JSON.stringify(ghost.res.json?.error?.message));
  check('correct password is still refused while locked out', (await call('POST', '/api/auth/login', { body: { email: email('locked'), password: PW } })).status === 429);
  check('a spoofed X-Forwarded-For does not bypass the lockout (proxy headers are not trusted by default)', (await call('POST', '/api/auth/login', { body: { email: email('locked'), password: PW }, headers: { 'X-Forwarded-For': '203.0.113.77' } })).status === 429);
  check('an unrelated account can still log in during the lockout', (await call('POST', '/api/auth/login', { body: { email: email('cust2'), password: PW } })).status === 200);

  // ── 2. CUSTOMER RFQ ──────────────────────────────────────────────────
  console.log('\n== 2. CUSTOMER RFQ ==');
  const mkRfq = async (tok, lines) => {
    const c = await call('POST', '/api/rfqs', { token: tok, body: { deliveryLocation: 'Electronic City, Bangalore, Karnataka', currency: 'INR', paymentTerms: '30 Days Net', lineItems: lines } });
    if (c.status !== 201) return { c };
    const s = await call('POST', `/api/rfqs/${c.data.id}/submit`, { token: tok });
    return { c, s, rfq: s.data };
  };
  const r1 = await mkRfq(custTok, [
    { mpn: MPN_OP, manufacturer: `E2E Mfg ${RUN}`, requiredQuantity: 10000, targetPriceInr: 4.5 },
    { mpn: MPN_MCU, manufacturer: `E2E Mfg ${RUN}`, requiredQuantity: 2500, targetPriceInr: 140 },
  ]);
  check('create RFQ -> 201', r1.c.status === 201, `status ${r1.c.status}`);
  check('submit RFQ -> SUBMITTED', r1.rfq?.status === 'SUBMITTED');
  const rfq1 = r1.rfq;
  const list = await call('GET', '/api/rfqs', { token: custTok });
  check('customer lists own RFQ', list.data.length === 1 && list.data[0].id === rfq1.id);
  check('other customer sees none', (await call('GET', '/api/rfqs', { token: cust2Tok })).data.length === 0);
  check('other customer GET by id -> 403', (await call('GET', `/api/rfqs/${rfq1.id}`, { token: cust2Tok })).status === 403);
  check('supplier cannot create RFQ -> 403', (await call('POST', '/api/rfqs', { token: supATok, body: { deliveryLocation: 'x', lineItems: [{ mpn: 'A', manufacturer: 'B', requiredQuantity: 1 }] } })).status === 403);
  check('RFQ with 0 lines -> 400', (await call('POST', '/api/rfqs', { token: custTok, body: { deliveryLocation: 'x', lineItems: [] } })).status === 400);
  check('RFQ negative qty -> 400', (await call('POST', '/api/rfqs', { token: custTok, body: { deliveryLocation: 'x', lineItems: [{ mpn: 'A', manufacturer: 'B', requiredQuantity: -5 }] } })).status === 400);
  const draft = (await call('POST', '/api/rfqs', { token: custTok, body: { deliveryLocation: 'x', lineItems: [{ mpn: MPN_OP, manufacturer: 'M', requiredQuantity: 5 }] } })).data;
  check('re-submitting a submitted RFQ -> 400', (await call('POST', `/api/rfqs/${rfq1.id}/submit`, { token: custTok })).status === 400);
  check('editing a submitted RFQ -> 400', (await call('PATCH', `/api/rfqs/${rfq1.id}`, { token: custTok, body: { remarks: 'x' } })).status === 400);
  check('cancel draft RFQ works', (await call('POST', `/api/rfqs/${draft.id}/cancel`, { token: custTok })).status === 201);
  check('cancelled RFQ cannot be cancelled again', (await call('POST', `/api/rfqs/${draft.id}/cancel`, { token: custTok })).status === 400);

  // ── 3. ADMIN VENDOR RFQ + MATCHING ───────────────────────────────────
  console.log('\n== 3. ADMIN VENDOR RFQ + MATCHING ==');
  check('customer cannot list vendor RFQs -> 403', (await call('GET', '/api/admin/vendor-rfqs', { token: custTok })).status === 403);
  check('supplier cannot list admin vendor RFQs -> 403', (await call('GET', '/api/admin/vendor-rfqs', { token: supATok })).status === 403);
  const match = await call('POST', `/api/admin/rfqs/${rfq1.id}/vendor-rfqs`, { token: adminTok });
  const wanted = [suppliers.supA.id, suppliers.supB.id].sort();
  check('matching -> exactly the two stocked test suppliers (not the stockless one)', match.status === 201 && JSON.stringify(match.data.map((v) => v.supplierId).sort()) === JSON.stringify(wanted));
  const match2 = await call('POST', `/api/admin/rfqs/${rfq1.id}/vendor-rfqs`, { token: adminTok });
  check('re-running matching is idempotent', match2.data.length === match.data.length);
  const vlist = await call('GET', '/api/admin/vendor-rfqs', { token: adminTok });
  check('admin vendor RFQ list includes them', match.data.every((m) => vlist.data.some((v) => v.id === m.id)));
  check('admin vendor RFQ detail -> 200', (await call('GET', `/api/admin/vendor-rfqs/${match.data[0].id}`, { token: adminTok })).status === 200);
  const vA = match.data.find((v) => v.supplierId === suppliers.supA.id);
  const vB = match.data.find((v) => v.supplierId === suppliers.supB.id);
  const rfq1Full = (await call('GET', `/api/rfqs/${rfq1.id}`, { token: custTok })).data;
  const opItem = rfq1Full.items.find((i) => i.mpn === MPN_OP);
  const mcuItem = rfq1Full.items.find((i) => i.mpn === MPN_MCU);

  // ── 4. SUPPLIER QUOTES + PRIVACY ─────────────────────────────────────
  console.log('\n== 4. SUPPLIER QUOTES ==');
  const sList = await call('GET', '/api/supplier/vendor-rfqs', { token: supATok });
  check("supplier A sees own vendor RFQ, not supplier B's", sList.data.some((v) => v.id === vA.id) && !sList.data.some((v) => v.id === vB.id));
  check('supplier payload has NO targetPrice (list)', !/targetPrice/i.test(sList.text));
  const sDet = await call('GET', `/api/supplier/vendor-rfqs/${vA.id}`, { token: supATok });
  check('supplier payload has NO targetPrice (detail)', sDet.status === 200 && !/targetPrice/i.test(sDet.text));
  check('supplier payload has NO customerId / createdByUserId', !/customerId|createdByUserId/.test(sDet.text));
  check('supplier A cannot read supplier B vendor RFQ -> 403', (await call('GET', `/api/supplier/vendor-rfqs/${vB.id}`, { token: supATok })).status === 403);
  check('unassigned supplier cannot read a vendor RFQ -> 403', (await call('GET', `/api/supplier/vendor-rfqs/${vA.id}`, { token: supETok })).status === 403);
  check('customer cannot use supplier endpoint -> 403', (await call('GET', '/api/supplier/vendor-rfqs', { token: custTok })).status === 403);
  const line = (item, over = {}) => ({ rfqItemId: item.id, mpn: item.mpn, availableQuantity: item.requiredQuantity, unitPrice: 4.85, moq: 100, dateCode: '2418+', packaging: 'Tape & Reel', leadTime: 'Same Day Dispatch', condition: 'New & Original', ...over });
  check('quote with price 0 -> 400', (await call('POST', `/api/supplier/vendor-rfqs/${vA.id}/quote`, { token: supATok, body: { items: [line(opItem, { unitPrice: 0 })] } })).status === 400);
  check('quote with unknown field -> 400', (await call('POST', `/api/supplier/vendor-rfqs/${vA.id}/quote`, { token: supATok, body: { items: [line(opItem)], hackedField: 1 } })).status === 400);
  const r2 = await mkRfq(custTok, [{ mpn: MPN_OP, manufacturer: 'M', requiredQuantity: 500, targetPriceInr: 4 }]);
  const rfq2 = r2.rfq;
  const rfq2Items = (await call('GET', `/api/rfqs/${rfq2.id}`, { token: custTok })).data.items;
  check('quoting an item from a different RFQ -> 400', (await call('POST', `/api/supplier/vendor-rfqs/${vA.id}/quote`, { token: supATok, body: { items: [line(rfq2Items[0])] } })).status === 400);
  const fullQ = await call('POST', `/api/supplier/vendor-rfqs/${vA.id}/quote`, { token: supATok, body: { items: [line(opItem), line(mcuItem, { availableQuantity: 2500, unitPrice: 145 })] } });
  check('FULL quote -> 201 SUBMITTED', fullQ.status === 201 && fullQ.data.status === 'SUBMITTED', `status ${fullQ.status}`);
  check('vendor RFQ becomes RESPONDED', (await call('GET', `/api/admin/vendor-rfqs/${vA.id}`, { token: adminTok })).data.status === 'RESPONDED');
  check('second quote on a RESPONDED vendor RFQ is refused', (await call('POST', `/api/supplier/vendor-rfqs/${vA.id}/quote`, { token: supATok, body: { items: [line(opItem)] } })).status === 400);
  check("supplier A cannot post to supplier B's vendor RFQ -> 403", (await call('POST', `/api/supplier/vendor-rfqs/${vB.id}/quote`, { token: supATok, body: { items: [line(opItem)] } })).status === 403);
  const raceQ = await Promise.all([1, 2, 3].map(() => call('POST', `/api/supplier/vendor-rfqs/${vB.id}/quote`, { token: supBTok, body: { items: [line(opItem, { unitPrice: 4.6 })] } })));
  check('3 parallel quotes on one vendor RFQ -> exactly one succeeds', raceQ.filter((r) => r.status === 201).length === 1, raceQ.map((r) => r.status).join(','));
  check('database holds exactly one quote for that vendor RFQ', (await prisma.supplierQuote.count({ where: { vendorRfqId: vB.id } })) === 1);
  const m2 = await call('POST', `/api/admin/rfqs/${rfq2.id}/vendor-rfqs`, { token: adminTok });
  const vA2 = m2.data.find((v) => v.supplierId === suppliers.supA.id);
  const partial = await call('POST', `/api/supplier/vendor-rfqs/${vA2.id}/partial-supply`, { token: supATok, body: { items: [line(rfq2Items[0], { availableQuantity: 200, unitPrice: 4.7 })] } });
  check('PARTIAL supply -> 201 PARTIAL_SUPPLY', partial.status === 201 && partial.data.status === 'PARTIAL_SUPPLY', `status ${partial.status}`);
  const r3 = await mkRfq(custTok, [{ mpn: MPN_MCU, manufacturer: 'M', requiredQuantity: 100, targetPriceInr: 130 }]);
  const m3 = await call('POST', `/api/admin/rfqs/${r3.rfq.id}/vendor-rfqs`, { token: adminTok });
  const vA3 = m3.data.find((v) => v.supplierId === suppliers.supA.id);
  const cannot = await call('POST', `/api/supplier/vendor-rfqs/${vA3.id}/cannot-supply`, { token: supATok, body: { remarks: 'Out of stock' } });
  check('CANNOT SUPPLY -> 201 CANNOT_SUPPLY', cannot.status === 201 && cannot.data.status === 'CANNOT_SUPPLY');
  check('vendor RFQ becomes DECLINED', (await call('GET', `/api/admin/vendor-rfqs/${vA3.id}`, { token: adminTok })).data.status === 'DECLINED');
  const r3Items = (await call('GET', `/api/rfqs/${r3.rfq.id}`, { token: custTok })).data.items;
  check('cannot quote after declining -> 400', (await call('POST', `/api/supplier/vendor-rfqs/${vA3.id}/quote`, { token: supATok, body: { items: [line(r3Items[0])] } })).status === 400);

  // ── 5. ADMIN REVIEW ──────────────────────────────────────────────────
  console.log('\n== 5. ADMIN SUPPLIER QUOTE REVIEW ==');
  const cmp = await call('GET', `/api/admin/rfqs/${rfq1.id}/supplier-quotes`, { token: adminTok });
  check('admin comparison returns quotes + coverage', cmp.status === 200 && cmp.data.quotes.length === 2 && cmp.data.coverage.length === 2);
  const cov = cmp.data.coverage.find((c) => c.mpn === MPN_OP);
  check('coverage: required 10000, quoted 20000 (two suppliers), remaining 0', cov.requiredQuantity === 10000 && cov.totalQuotedQuantity === 20000 && cov.remainingQuantity === 0, JSON.stringify(cov));
  const cov2 = (await call('GET', `/api/admin/rfqs/${rfq2.id}/supplier-quotes`, { token: adminTok })).data.coverage[0];
  check('partial coverage: required 500, quoted 200, remaining 300, 40%', cov2.totalQuotedQuantity === 200 && cov2.remainingQuantity === 300 && cov2.coveragePercent === 40, JSON.stringify(cov2));
  check('admin supplier-quote list/detail work', (await call('GET', '/api/admin/supplier-quotes', { token: adminTok })).status === 200 && (await call('GET', `/api/admin/supplier-quotes/${fullQ.data.id}`, { token: adminTok })).status === 200);
  check('supplier cannot read admin supplier-quotes -> 403', (await call('GET', '/api/admin/supplier-quotes', { token: supATok })).status === 403);

  // ── 6/7. CUSTOMER QUOTATION + STATE GUARDS ───────────────────────────
  console.log('\n== 6/7. CUSTOMER QUOTATION + STATE GUARDS ==');
  const qItemIds = fullQ.data.items.map((i) => i.id);
  check('customer cannot create quotation -> 403', (await call('POST', '/api/admin/customer-quotations', { token: custTok, body: { rfqId: rfq1.id, supplierQuoteItemIds: qItemIds } })).status === 403);
  const quo = await call('POST', '/api/admin/customer-quotations', { token: adminTok, body: { rfqId: rfq1.id, supplierQuoteItemIds: qItemIds } });
  check('admin creates quotation -> 201 DRAFT, demo-flagged internally', quo.status === 201 && quo.data.status === 'DRAFT' && quo.data.isDemoCalculation === true);
  const Q = quo.data;
  check('quantities follow the RFQ (10000 / 2500), not supplier stock', Q.items.find((i) => i.mpn === MPN_OP).quantity === 10000 && Q.items.find((i) => i.mpn === MPN_MCU).quantity === 2500);
  check('demo math: 4.85 -> 5.43', Number(Q.items.find((i) => i.mpn === MPN_OP).unitPrice) === 5.43);
  check('customer does NOT see DRAFT in list', (await call('GET', '/api/customer/quotations', { token: custTok })).data.length === 0);
  check('customer GET DRAFT by id -> 404', (await call('GET', `/api/customer/quotations/${Q.id}`, { token: custTok })).status === 404);
  for (const action of ['accept', 'reject', 'negotiate']) {
    check(`customer ${action} DRAFT refused`, [400, 404].includes((await call('POST', `/api/customer/quotations/${Q.id}/${action}`, { token: custTok, body: {} })).status));
  }
  await call('PATCH', `/api/admin/customer-quotations/${Q.id}`, { token: adminTok, body: { status: 'PENDING_APPROVAL' } });
  check('PENDING_APPROVAL still hidden from customer', (await call('GET', '/api/customer/quotations', { token: custTok })).data.length === 0);
  check('customer accept PENDING_APPROVAL refused', [400, 404].includes((await call('POST', `/api/customer/quotations/${Q.id}/accept`, { token: custTok })).status));
  check('invalid status value -> 400', (await call('PATCH', `/api/admin/customer-quotations/${Q.id}`, { token: adminTok, body: { status: 'BOGUS' } })).status === 400);
  await call('PATCH', `/api/admin/customer-quotations/${Q.id}`, { token: adminTok, body: { status: 'SENT' } });
  const cl = await call('GET', '/api/customer/quotations', { token: custTok });
  check('customer sees the SENT quotation', cl.data.length === 1);
  const internal = /calculationLabel|isDemoCalculation|createdByUserId|margin|supplierUnitPrice/i;
  check('customer list has NO margin/demo/internal metadata', !internal.test(cl.text));
  const cd = await call('GET', `/api/customer/quotations/${Q.id}`, { token: custTok });
  check('customer detail has NO margin/demo/internal metadata', cd.status === 200 && !internal.test(cd.text));
  check('customer detail exposes no supplier cost (raw 4.85 / 145)', !/"unitPrice":"4\.85"|"unitPrice":"145"/.test(cd.text));
  check('customer detail exposes no supplier identity', !/E2E Supplier|supplierId/.test(cd.text));
  check('other customer cannot GET / accept the quotation -> 403', (await call('GET', `/api/customer/quotations/${Q.id}`, { token: cust2Tok })).status === 403 && (await call('POST', `/api/customer/quotations/${Q.id}/accept`, { token: cust2Tok })).status === 403);
  check('supplier cannot use the customer quotation endpoint -> 403', (await call('GET', '/api/customer/quotations', { token: supATok })).status === 403);
  const race = await Promise.all([1, 2, 3, 4, 5].map(() => call('POST', `/api/customer/quotations/${Q.id}/accept`, { token: custTok })));
  check('5 parallel accepts -> exactly ONE succeeds', race.filter((r) => r.status === 201).length === 1, race.map((r) => r.status).join(','));
  check('database holds exactly ONE purchase order for the quotation', (await prisma.purchaseOrder.count({ where: { customerQuotationId: Q.id } })) === 1);
  check('accept again -> 400', (await call('POST', `/api/customer/quotations/${Q.id}/accept`, { token: custTok })).status === 400);
  check('reject after accept -> 400', (await call('POST', `/api/customer/quotations/${Q.id}/reject`, { token: custTok })).status === 400);
  check('negotiate after accept -> 400', (await call('POST', `/api/customer/quotations/${Q.id}/negotiate`, { token: custTok, body: {} })).status === 400);
  const accepted = race.find((r) => r.status === 201);
  check('accept response has no margin/demo metadata', !!accepted && !internal.test(JSON.stringify(accepted.data.quotation)));
  check('RFQ moved to PO_RECEIVED', (await call('GET', `/api/rfqs/${rfq1.id}`, { token: custTok })).data.status === 'PO_RECEIVED');
}

// ── main ──────────────────────────────────────────────────────────────
let crashed = false;
try {
  await ensureApi();
  console.log(`E2E run ${RUN} against ${BASE}${EXTERNAL_API ? ' (external API)' : ' (isolated private API instance)'}`);
  await runChecks(await provision());
} catch (err) {
  crashed = true;
  console.error('\nE2E aborted with an error:', err);
} finally {
  let clean = false;
  try {
    clean = await cleanup();
  } catch (err) {
    console.error('CLEANUP FAILED:', err);
  }
  check('cleanup left no rows from this run behind', clean);
  apiProcess?.kill();
  await prisma.$disconnect();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) console.log('FAILED:\n' + failed.map((f) => ' - ' + f.name).join('\n'));
process.exit(crashed || failed.length ? 1 : 0);
