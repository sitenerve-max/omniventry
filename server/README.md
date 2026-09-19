# OEMInventory API (MVP backend)

NestJS + Prisma + PostgreSQL backend for the RFQ -> Vendor RFQ -> Supplier Quote -> Customer
Quotation -> Purchase Order loop, plus product search and auth. See the root
[README](../README.md) for how this fits alongside the Vite frontend.

## What's implemented in this pass

- Auth: register (customer/supplier), login, logout, refresh (httpOnly cookie), `/me`, JWT + RBAC guards for all 11 roles
- Product search (`GET /api/products/search`) — public, allowlisted response, no cost/margin/private-supplier leakage
- RFQ CRUD + submit/cancel, customer-scoped
- Admin vendor-RFQ creation via a **deterministic** (not AI) supplier-matching service, admin list/detail/status
- Supplier vendor-RFQ list/detail + quote / cannot-supply / partial-supply submission, ownership-enforced
- Admin supplier-quote list/detail/comparison with required/quoted/remaining quantity + coverage % math
- Admin customer-quotation creation via a typed `PricingService` (currently `DemoFlatMarginPricingService` — flat 12% margin + 18% GST, explicitly flagged `isDemoCalculation: true`, never silently final)
- Customer quotation view/accept/reject/negotiate; accept auto-creates a Purchase Order
- Full Prisma schema for all 30 MVP entities (many — e.g. inventory upload, BOM matching — have tables but no API routes yet; see "Not yet built")

## Not yet built (by design, this pass)

Inventory upload endpoints, admin master-data list endpoints (customers/suppliers/manufacturers/
categories/products/inventory), reports, audit-log writes beyond what's implicit, and
negotiation-log persistence.

## Frontend wiring status

Wired to this backend (needs the API running + seeded, `VITE_API_BASE_URL` optional):
real login/register/logout with session persistence (in-memory access token + httpOnly refresh
cookie), customer RFQ creation (`/rfq/new`), admin Vendor RFQs (incl. running supplier matching),
Supplier Quotations + comparison, Customer Quotations (create, approval workflow), and the supplier
"My Quotations" page (quote / partial supply / cannot supply).

Still on the frontend's own mock data (resets on refresh): search & part pages, customer portal
pages (RFQ list, quotations, orders), BOM upload, inventory upload, supplier inventory pages, and
every other admin page. The customer-side accept/reject/negotiate endpoints exist and are
verified via API, but the customer portal UI does not call them yet.

## Local setup

```bash
cd server
npm install
cp .env.example .env          # fill in DATABASE_URL / secrets for local dev
docker compose up -d          # from the repo root — starts Postgres on :5432
npx prisma migrate dev        # applies the schema
npx prisma db seed            # demo accounts + demo catalog/RFQ (password: Demo@12345)
npm run start:dev             # http://localhost:4000, Swagger at /api/docs
```

### Demo accounts — DEVELOPMENT ONLY

`npx prisma db seed` creates demo accounts with a well-known password. **This is a development
convenience and must never exist in staging/production.** The seed script refuses to run unless
`NODE_ENV` is `development` or `test`, and the login page only shows its "Quick Sign-In" buttons in
Vite dev builds (the demo password and emails are not present in production bundles).

| Role | Email | Password (dev only) |
|---|---|---|
| Super admin | `admin@demo.oeminventory.local` | `Demo@12345` |
| Customer | `buyer@demo.oeminventory.local` | `Demo@12345` |
| Supplier | `supplier-a@demo.oeminventory.local` | `Demo@12345` |

Do not reuse these credentials anywhere, and never seed them into a shared or production database.

## Security behaviour worth knowing

- **Refresh tokens** rotate on every use (atomic: a token can be consumed once) and are stored hashed. A
  deactivated user (`isActive = false`) cannot refresh; all of their refresh tokens are revoked.
- **Access tokens** are also checked against the database on every authenticated request (one primary-key
  lookup in `JwtStrategy.validate`), so deactivating a user takes effect immediately instead of after the
  15-minute token lifetime. Trade-off: one extra query per request — add a short cache if that ever
  becomes hot. (Role changes are still read from the token until it expires.)
- **Login rate limit — DEVELOPMENT / SINGLE-INSTANCE ONLY.** After 5 failed attempts for one (IP, email)
  pair, or 50 from one IP, in 15 minutes, login returns `429` with a generic message — identical for
  existing and non-existing emails. Tunable via `LOGIN_MAX_FAILURES_PER_EMAIL`,
  `LOGIN_MAX_FAILURES_PER_IP`, `LOGIN_FAILURE_WINDOW_SECONDS`. The counters live **in process memory**:
  they reset on restart and are not shared between instances, so behind more than one instance an
  attacker gets N× the budget. **A production deployment must move this to a shared store (Redis or
  similar) — not implemented yet, by design.**
- **Client IP / proxies.** By default (`TRUST_PROXY` unset) `req.ip` is the socket address and
  `X-Forwarded-For` is **ignored**, so clients cannot spoof their IP to dodge IP-based limits (the login
  limiter and the global throttler). Behind a reverse proxy/load balancer, set `TRUST_PROXY` to the
  number of trusted proxy hops (e.g. `1`) or to the proxy addresses/CIDRs/names (e.g. `loopback`,
  `10.0.0.0/8`); otherwise every user appears to share the proxy's IP and one attacker can lock everyone
  out. `TRUST_PROXY=true` is deliberately rejected at startup because it trusts every client-supplied
  header. **Production requirement:** configure this to match your real network path.

## Tests

- `npm test` — unit tests (MPN normalization, demo pricing, deterministic matching, login limiter,
  refresh/login regression tests with a mocked database).
- `npm run test:e2e` — end-to-end check of the whole primary loop (auth, RFQ, matching, supplier
  quotes, admin review, customer quotation, privacy and state guards, race conditions).

### Running the E2E check locally

```bash
docker compose up -d            # from the repo root
npx prisma migrate dev          # database up to date
npm run test:e2e                # builds, starts a private API instance, runs the checks, cleans up
```

The script is self-contained and safe to repeat: it creates its **own** admin, suppliers, products and
customers named with a unique run id (`e2e<id>-*@e2e.invalid`), never touches the demo seed accounts or
any existing business data, generates a random password each run (no credentials are stored in the
file), deletes only the rows it created and verifies none are left. It refuses to run against a
non-local API/database or with `NODE_ENV=production`. Exit code `0` = all checks passed, `1` = a check
failed or the run errored, `2` = a precondition was not met.

**Isolation from your dev server:** by default the script launches the compiled API as its own child
process on a random port, so its failed-login checks use a separate in-memory limiter and never add to
the failed-login counters of a `npm run start:dev` server you have running. (Set `E2E_API_BASE_URL` to
test an already-running local API instead; that server's limiter is then used.)

## Production requirements (known limitations of this MVP)

- Shared store (Redis or similar) for the login limiter and any future session/revocation state.
- `TRUST_PROXY` set correctly for your proxy topology (see above).
- Never run the demo seed; provision real users through registration/admin tooling.
- Real secrets via a secret manager (`JWT_*_SECRET`), `NODE_ENV=production` (secure cookies), HTTPS, and a
  CORS `FRONTEND_ORIGIN` for the real frontend origin.
- Customer quotation pricing is still the flat-margin **Demo Calculation** (not the Landed Cost Engine).
