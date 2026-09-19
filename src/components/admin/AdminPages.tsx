import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { useApiData } from '../../lib/useApiData';
import { MOCK_AUDIT_LOGS, MOCK_QC_RECORDS } from '../../data/mockData';
import { QcStatusBadge, RfqStatusBadge, SupplierScoreBadge } from '../common/Badge';
import {
  ShieldAlert,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Truck,
  Eye,
  SlidersHorizontal,
  LayoutDashboard,
  Users,
  Building,
  Package,
  Tag,
  Boxes,
  ClipboardList,
  DollarSign,
  Settings,
  Bell,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  MapPin,
  Shield,
  XCircle,
  Clock,
  Award,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { rfqs, orders, navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Operations & Sourcing Control Tower
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Platform Operations</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Logged in: Demo Staff A (Procurement & QC Lead) • Pan-India Logistics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/admin/landed-cost')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" /> Open Landed Cost Engine
            </button>
          </div>
        </div>

        {/* 4 Operations KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => navigateTo('/admin/rfqs')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Pending RFQs Matching</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">{rfqs.length}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">100% Algorithmic Match</div>
          </div>

          <div
            onClick={() => navigateTo('/admin/qc')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">QC Queue (Bangalore Lab)</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">14 Lots</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">40x Optical Check Active</div>
          </div>

          <div
            onClick={() => navigateTo('/admin/landed-cost')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Margin Approval Needed</div>
            <div className="text-2xl font-extrabold font-mono text-indigo-600 mt-1">2</div>
            <div className="text-[11px] text-indigo-700 font-semibold mt-1">Target Margin: 12.0%</div>
          </div>

          <div
            onClick={() => navigateTo('/admin/audit')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Audit Events Today</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">142</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Immutable Logged</div>
          </div>
        </div>

        {/* Quick Review Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active RFQ Pipeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-4">
              Buyer RFQ Ingestion Queue
            </h3>
            <div className="space-y-3 text-xs">
              {rfqs.map((r) => (
                <div key={r.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{r.rfqNumber}</span>
                    <div className="text-slate-600 mt-0.5">{r.customerName} ({r.companyName})</div>
                    <div className="text-[11px] text-slate-500">Line items: {r.lineItems.map(i => i.mpn).join(', ')}</div>
                  </div>
                  <button
                    onClick={() => navigateTo('/admin/landed-cost')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-xs shadow-xs"
                  >
                    Build Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* QC Inspection Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-4">
              Bangalore Warehouse QC Inspection Queue
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-slate-900">LOT-TI-2026-089</span>
                  <div className="text-slate-700 mt-0.5">LM358DR • 10,000 pcs (Texas Instruments)</div>
                  <span className="text-[11px] text-emerald-800 font-semibold">QC Passed • Lead Coplanarity 100% OK</span>
                </div>
                <button
                  onClick={() => navigateTo('/admin/qc')}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded font-semibold text-xs"
                >
                  View Inspection
                </button>
              </div>

              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-slate-900">LOT-ST-2026-041</span>
                  <div className="text-slate-700 mt-0.5">STM32F103C8T6 • 2,500 pcs (STMicroelectronics)</div>
                  <span className="text-[11px] text-amber-800 font-semibold">Optical Check in Progress</span>
                </div>
                <button
                  onClick={() => navigateTo('/admin/qc')}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded font-semibold text-xs"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminLandedCostEngine: React.FC = () => {
  const { addToast } = useApp();
  const [basePrice, setBasePrice] = useState<number>(10.0);
  const [exchangeRate, setExchangeRate] = useState<number>(86.5);
  const [bcdPercent, setBcdPercent] = useState<number>(7.5);
  const [swsPercent, setSwsPercent] = useState<number>(10.0);
  const [freightInr, setFreightInr] = useState<number>(0.8);
  const [marginPercent, setMarginPercent] = useState<number>(12.0);
  const [gstPercent, setGstPercent] = useState<number>(18.0);

  // Calculations
  const baseCostInr = basePrice * 1.0; // Assume domestic or converted
  const bcdAmount = (baseCostInr * bcdPercent) / 100;
  const swsAmount = (bcdAmount * swsPercent) / 100;
  const costBeforeMargin = baseCostInr + bcdAmount + swsAmount + freightInr;
  const marginAmount = (costBeforeMargin * marginPercent) / 100;
  const unitNetPrice = costBeforeMargin + marginAmount;
  const gstAmount = (unitNetPrice * gstPercent) / 100;
  const finalLandedPrice = unitNetPrice + gstAmount;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Landed-Cost Calculation & Margin Approval Engine
        </h1>
        <p className="text-xs text-slate-600 mb-6">
          Simulate Indian customs tariffs (BCD, SWS), freight allocation, and margin governance.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Component Cost Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Base Component Cost (INR ₹) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={baseCostInr}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Basic Customs Duty (BCD %)</label>
                <input
                  type="number"
                  step="0.5"
                  value={bcdPercent}
                  onChange={(e) => setBcdPercent(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Social Welfare Surcharge (SWS % of BCD)</label>
                <input
                  type="number"
                  value={swsPercent}
                  onChange={(e) => setSwsPercent(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Freight & Insurance (Per Unit ₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={freightInr}
                  onChange={(e) => setFreightInr(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Gross Margin (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">GST Tariff (%)</label>
                <input
                  type="number"
                  value={gstPercent}
                  disabled
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono bg-slate-100 text-slate-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">
                HSN Code 8542.31.00 (Processors & Controllers) • BCD Verified
              </span>
              <button
                onClick={() => addToast('Quote Approved', 'Landed cost configuration saved and published to quotation.', 'success')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-xs"
              >
                Approve & Issue Quotation
              </button>
            </div>
          </div>

          {/* Landed Cost Breakdown Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between text-xs">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold mb-4">
                Unit Landed-Cost Waterfall
              </h4>

              <div className="space-y-2.5">
                <div className="flex justify-between text-slate-300">
                  <span>Base Purchase Cost:</span>
                  <span className="font-mono font-bold text-white">₹{baseCostInr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Customs Duty (BCD {bcdPercent}%):</span>
                  <span className="font-mono text-white">₹{bcdAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>SWS ({swsPercent}% on BCD):</span>
                  <span className="font-mono text-white">₹{swsAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Inbound Freight & Lab Handling:</span>
                  <span className="font-mono text-white">₹{freightInr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2 font-semibold">
                  <span>Effective Landed Cost:</span>
                  <span className="font-mono text-white">₹{costBeforeMargin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cyan-400 font-semibold">
                  <span>Operating Margin ({marginPercent}%):</span>
                  <span className="font-mono">₹{marginAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-2">
                  <span>Net Customer Unit Price:</span>
                  <span className="font-mono text-cyan-300">₹{unitNetPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>18% GST (Input Tax Credit):</span>
                  <span className="font-mono">₹{gstAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">Total Invoice Amount (Per Unit):</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
                ₹{finalLandedPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminAuditLogs: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Compliance & Traceability Audit Logs
        </h1>
        <p className="text-xs text-slate-600 mb-6">
          Tamper-evident system log tracking RFQ updates, quote modifications, margin overrides, and QC approvals.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-sans">{log.action}</td>
                    <td className="py-3 px-4 text-slate-700 font-sans">
                      {log.user} ({log.role})
                    </td>
                    <td className="py-3 px-4 text-slate-600">{log.entity}</td>
                    <td className="py-3 px-4 text-blue-600">{log.entityId}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {log.reason || `${log.oldValue} -> ${log.newValue}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AdminLayout ─────────────────────────────────────────────────────────────

const Send = ArrowRight;

const ADMIN_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' },
  { label: 'RFQs', icon: FileSpreadsheet, route: '/admin/rfqs' },
  { label: 'Vendor RFQs', icon: Send, route: '/admin/vendor-rfqs' },
  { label: 'Supplier Quotes', icon: DollarSign, route: '/admin/supplier-quotations' },
  { label: 'Customer Quotes', icon: ClipboardList, route: '/admin/customer-quotations' },
  { label: 'Sales Orders', icon: FileText, route: '/admin/sales-orders' },
  { label: 'Purchase Orders', icon: Package, route: '/admin/purchase-orders' },
  { label: 'QC', icon: ShieldAlert, route: '/admin/qc' },
  { label: 'Warehouse', icon: Boxes, route: '/admin/warehouse' },
  { label: 'Dispatch', icon: Truck, route: '/admin/dispatch' },
  { label: 'Landed Cost', icon: Calculator, route: '/admin/landed-cost' },
  { label: 'Invoices', icon: FileText, route: '/admin/invoices' },
  { label: 'Customers', icon: Users, route: '/admin/customers' },
  { label: 'Suppliers', icon: Building, route: '/admin/suppliers' },
  { label: 'Inventory', icon: Layers, route: '/admin/inventory' },
  { label: 'Products', icon: Cpu, route: '/admin/products' },
  { label: 'Reports', icon: BarChart3, route: '/admin/reports' },
  { label: 'Audit Logs', icon: Shield, route: '/admin/audit' },
  { label: 'Settings', icon: Settings, route: '/admin/settings' },
];

interface AdminLayoutProps { children: React.ReactNode; title: string; }

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { currentRoute, navigateTo, adminRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-slate-950 text-white z-40 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:flex lg:z-auto`}>
        <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">Admin Portal</div>
            <div className="text-sm font-bold text-white mt-0.5">OEMInventory Ops</div>
            <div className="text-[10px] text-slate-400">{adminRole}</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mx-3 mt-3 px-2 py-1 rounded bg-amber-900/40 border border-amber-700/50 text-amber-300 text-[10px] font-mono text-center">
          ⚠ Demo Environment
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {ADMIN_NAV.map(item => {
            const active = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
            return (
              <button key={item.route} onClick={() => { navigateTo(item.route); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium transition-colors ${active ? 'bg-blue-700/30 text-blue-300 border-r-2 border-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 px-4 py-3">
          <button onClick={() => navigateTo('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs">
            <LogOut className="w-3.5 h-3.5" /><span>Back to Public Site</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-slate-900 flex-1">{title}</h1>
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">A</div>
        </div>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── AdminRfqsList ────────────────────────────────────────────────────────────

export const AdminRfqsList: React.FC = () => {
  const { rfqs, navigateTo } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all' ? rfqs : rfqs.filter(r => r.status === statusFilter);

  return (
    <AdminLayout title="RFQ Management">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="text-sm text-slate-500">{filtered.length} RFQ{filtered.length !== 1 ? 's' : ''}</div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            {['Submitted', 'Supplier Matching', 'Vendor RFQ Sent', 'Supplier Response', 'Under Evaluation', 'Customer Quotation', 'Negotiation', 'Accepted'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-200">
              {['RFQ #', 'Customer / Company', 'Line Items', 'Status', 'Required Date', 'Delivery', 'Suppliers', 'Quotes', 'Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-slate-400">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium">No RFQs found</p>
                </td></tr>
              )}
              {filtered.map(rfq => (
                <tr key={rfq.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-3 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">{rfq.rfqNumber}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-800">{rfq.companyName}</div>
                    <div className="text-[11px] text-slate-400">{rfq.customerName}</div>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-700">{rfq.lineItems.length}</td>
                  <td className="px-3 py-3"><RfqStatusBadge status={rfq.status} /></td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{rfq.requiredDate}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{rfq.deliveryLocation.split(',')[0]}</span>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-700">{rfq.matchedSuppliersCount}</td>
                  <td className="px-3 py-3">
                    <span className={`font-bold font-mono ${rfq.receivedQuotesCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {rfq.receivedQuotesCount}/{rfq.matchedSuppliersCount}
                    </span>
                  </td>
                  <td className="px-3 py-3 flex gap-1">
                    <button onClick={() => navigateTo(`/admin/rfqs/${rfq.id}`)} className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-500 flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" /> View
                    </button>
                    <button onClick={() => navigateTo('/admin/landed-cost')} className="px-2 py-1 border border-indigo-400 text-indigo-600 rounded text-[10px] hover:bg-indigo-50">
                      Quote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

// ─── AdminRfqDetail ───────────────────────────────────────────────────────────

export const AdminRfqDetail: React.FC = () => {
  const { rfqs, navigateTo } = useApp();
  const rfq = rfqs[0];
  if (!rfq) return null;

  return (
    <AdminLayout title={`RFQ — ${rfq.rfqNumber}`}>
      <button onClick={() => navigateTo('/admin/rfqs')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to RFQs</button>
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono font-bold text-xl text-slate-900">{rfq.rfqNumber}</span>
        <RfqStatusBadge status={rfq.status} />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-sm">Line Items</h3></div>
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              {['MPN', 'Manufacturer', 'Qty Required', 'Target Date', 'Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rfq.lineItems.map(li => (
                <tr key={li.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{li.mpn}</td>
                  <td className="px-4 py-3 text-slate-600">{li.manufacturer}</td>
                  <td className="px-4 py-3 font-mono">{li.requiredQuantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500">{li.targetDate || rfq.requiredDate}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">{li.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-sm text-slate-800">RFQ Info</h4>
            {[['Customer', rfq.companyName], ['Contact', rfq.customerName], ['Delivery', rfq.deliveryLocation], ['Required By', rfq.requiredDate], ['Currency', rfq.currency], ['Payment', rfq.paymentTerms]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-800 text-right">{v}</span></div>
            ))}
          </div>
          <button onClick={() => navigateTo('/admin/landed-cost')} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 flex items-center justify-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" /> Build Quotation
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

// ─── AdminQCPage ──────────────────────────────────────────────────────────────

export const AdminQCPage: React.FC = () => {
  const { addToast, navigateTo } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const record = MOCK_QC_RECORDS[0];

  return (
    <AdminLayout title="QC Inspection Queue">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Queue list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Pending Inspection ({MOCK_QC_RECORDS.length})</div>
          {MOCK_QC_RECORDS.map(rec => (
            <div key={rec.id} onClick={() => setSelected(rec.id)}
              className={`bg-white border rounded-xl p-4 cursor-pointer shadow-xs text-xs transition-colors ${selected === rec.id ? 'border-blue-400 ring-1 ring-blue-300' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="font-mono font-bold text-slate-900">{rec.mpn}</div>
              <div className="text-slate-600 mt-0.5">Lot: {rec.lotNumber}</div>
              <div className="flex items-center gap-2 mt-2">
                <QcStatusBadge status={rec.status} />
                <span className="text-slate-400">{rec.inspectionDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Inspection detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-slate-900">{record.mpn} — {record.lotNumber}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Inspector: {record.inspector} • {record.inspectionDate}</div>
                </div>
                <QcStatusBadge status={record.status} />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">QC Checklist</h4>
                <div className="space-y-2">
                  {record.checklists.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border text-xs ${item.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${item.passed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {item.passed ? '✓' : '✗'}
                        </span>
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                      {item.notes && <span className="text-slate-500 italic">{item.notes}</span>}
                    </div>
                  ))}
                </div>
                {record.notes && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <strong>Notes:</strong> {record.notes}
                  </div>
                )}
                <div className="mt-5 flex gap-3">
                  <button onClick={() => { addToast('QC Passed', `${record.mpn} lot marked as passed. Proceeding to warehouse.`, 'success'); navigateTo('/admin/warehouse'); }}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500">✓ Mark QC Passed</button>
                  <button onClick={() => addToast('QC Failed', `${record.mpn} lot marked as failed. Supplier notified.`, 'error')}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500">✗ Mark QC Failed</button>
                  <button onClick={() => addToast('Conditional Pass', `${record.mpn} marked with conditions. Review required.`, 'warning')}
                    className="flex-1 py-2 border border-amber-400 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-50">Conditional</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
              <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">Select a lot to inspect</p>
              <p className="text-xs mt-1">Click on any item from the queue on the left.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span><strong>Demo Data:</strong> QC records shown are representative mock data. Actions trigger toast confirmations only.</span>
      </div>
    </AdminLayout>
  );
};

// ─── Admin Stub Pages ─────────────────────────────────────────────────────────

const AdminStub: React.FC<{ title: string; icon: React.ReactNode; description: string; version?: string }> = ({ title, icon, description, version = 'v2' }) => (
  <AdminLayout title={title}>
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">{icon}</div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Coming Soon — {version}</span>
    </div>
  </AdminLayout>
);

export const AdminCustomers: React.FC = () => (
  <AdminStub title="Customer Management" icon={<Users className="w-8 h-8" />} description="Manage customer accounts, company profiles, contacts, and procurement history." version="v1.1" />
);
export const AdminCustomerDetail: React.FC = () => (
  <AdminStub title="Customer Detail" icon={<Users className="w-8 h-8" />} description="View full customer profile, RFQ history, quotations, and orders." version="v1.1" />
);
export const AdminSuppliers: React.FC = () => (
  <AdminStub title="Supplier Management" icon={<Building className="w-8 h-8" />} description="Manage supplier profiles, KYC status, scoring, and performance metrics." version="v1.1" />
);
export const AdminSupplierDetail: React.FC = () => (
  <AdminStub title="Supplier Detail" icon={<Building className="w-8 h-8" />} description="View supplier profile, inventory, quotation history, and performance." version="v1.1" />
);
export const AdminManufacturers: React.FC = () => (
  <AdminStub title="Manufacturers" icon={<Cpu className="w-8 h-8" />} description="Manage manufacturer records, aliases, and MPN normalization rules." version="v2" />
);
export const AdminProducts: React.FC = () => (
  <AdminStub title="Product Catalog" icon={<Package className="w-8 h-8" />} description="Manage component master data, parametric attributes, and lifecycle status." version="v2" />
);
export const AdminProductDetail: React.FC = () => (
  <AdminStub title="Product Detail" icon={<Package className="w-8 h-8" />} description="View and edit component master data, alternatives, and specifications." version="v2" />
);
export const AdminCategories: React.FC = () => (
  <AdminStub title="Categories" icon={<Tag className="w-8 h-8" />} description="Manage component taxonomy, category hierarchies, and parametric filters." version="v2" />
);
export const AdminInventory: React.FC = () => (
  <AdminStub title="Inventory Management" icon={<Boxes className="w-8 h-8" />} description="View all supplier inventory lots, verification status, and ageing reports." version="v1.1" />
);
export const AdminInventoryDetail: React.FC = () => (
  <AdminStub title="Inventory Detail" icon={<Boxes className="w-8 h-8" />} description="View lot details, verification history, and supplier information." version="v1.1" />
);
export const AdminBom: React.FC = () => (
  <AdminStub title="BOM Management" icon={<FileSpreadsheet className="w-8 h-8" />} description="Review customer-uploaded BOMs, coverage analysis, and sourcing assignments." version="v2" />
);
export const AdminBomDetail: React.FC = () => (
  <AdminStub title="BOM Detail" icon={<FileSpreadsheet className="w-8 h-8" />} description="View BOM line items, coverage status, and RFQ conversion." version="v2" />
);
// ─── Live (backend-backed) admin pages: Vendor RFQs, Supplier Quotations, Customer Quotations ───

const ADMIN_ROLE_NAMES = [
  'SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE',
  'PURCHASE_MANAGER', 'PURCHASE_EXECUTIVE', 'INVENTORY_MANAGER', 'FINANCE_MANAGER',
];

interface ApiSupplier { id: string; companyName: string; city: string | null; state: string | null; isVerified: boolean; supplierScore: number }
interface ApiVendorRfq { id: string; rfqId: string; status: string; sentAt: string; respondedAt: string | null; rfq: { id: string; rfqNumber: string }; supplier: ApiSupplier }
interface ApiQuoteItem {
  id: string; rfqItemId: string; mpn: string; availableQuantity: number; unitPrice: string; moq: number; dateCode: string;
  packaging: string; leadTime: string; warranty: string | null; countryOfOrigin: string | null; condition: string;
  qualityScore: number | null; notes: string | null;
}
interface ApiSupplierQuote {
  id: string; status: string; currency: string; remarks: string | null; createdAt: string;
  supplier: ApiSupplier; items: ApiQuoteItem[]; vendorRfq?: { rfq: { id: string; rfqNumber: string } };
}
interface ApiCustomerQuotation {
  id: string; quoteNumber: string; status: string; currency: string; subtotal: string; freight: string; gst: string; total: string;
  paymentTerms: string | null; validUntil: string | null; isDemoCalculation: boolean; calculationLabel: string | null;
  customer?: { companyName: string }; rfq?: { id: string; rfqNumber: string };
  items: { id: string; mpn: string; manufacturer: string; description: string; quantity: number; unitPrice: string; totalPrice: string; dateCode: string | null; leadTime: string | null }[];
}
interface ApiRfqSummary { id: string; rfqNumber: string; status: string; deliveryLocation: string; items: { id: string }[] }

const inr = (v: string | number): string => '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const humanize = (s: string): string => s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/** Wraps an admin page: gates on a real admin session, loads live data from the backend, and labels it as such. */
function LiveAdminPage<T>({ title, path, children }: { title: string; path: string; children: (data: T, reload: () => void) => React.ReactNode }) {
  const { authUser, authLoading, navigateTo } = useApp();
  const isAdmin = !!authUser?.roles.some((r) => ADMIN_ROLE_NAMES.includes(r));
  const { data, loading, error, reload } = useApiData<T>(isAdmin ? path : null);

  return (
    <AdminLayout title={title}>
      {authLoading ? (
        <p className="text-sm text-slate-500">Checking session…</p>
      ) : !isAdmin ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto">
          <Shield className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-800">Admin sign-in required</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">This page shows live data from the backend and is only available to signed-in admin/staff accounts.</p>
          <button onClick={() => navigateTo('/auth/login')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">Go to Sign In</button>
        </div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading live data…</p>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-center justify-between gap-3">
          <span>Could not load data: {error}</span>
          <button onClick={reload} className="px-3 py-1.5 bg-rose-600 text-white rounded font-semibold">Retry</button>
        </div>
      ) : data !== null ? (
        <>
          <div className="mb-4 text-[10px] font-mono uppercase tracking-wider text-emerald-700">Live data — persisted in PostgreSQL via backend API</div>
          {children(data, reload)}
        </>
      ) : null}
    </AdminLayout>
  );
}

// ─── Vendor RFQs ────────────────────────────────────────────────────────────

const VENDOR_STATUS_STYLE: Record<string, string> = {
  RESPONDED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SENT: 'bg-blue-50 text-blue-700 border-blue-200',
  DECLINED: 'bg-rose-50 text-rose-700 border-rose-200',
  NO_RESPONSE: 'bg-slate-100 text-slate-500 border-slate-200',
};

const VendorStatusPill: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${VENDOR_STATUS_STYLE[status] || VENDOR_STATUS_STYLE.NO_RESPONSE}`}>
    {status === 'RESPONDED' && <CheckCircle2 className="w-3 h-3" />}
    {status === 'SENT' && <Clock className="w-3 h-3" />}
    {status === 'DECLINED' && <XCircle className="w-3 h-3" />}
    {humanize(status)}
  </span>
);

const SupplierMatchingPanel: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { addToast } = useApp();
  const { data, loading } = useApiData<ApiRfqSummary[]>('/api/rfqs');
  const [busyId, setBusyId] = useState<string | null>(null);
  const pending = (data ?? []).filter((r) => r.status === 'SUBMITTED');

  const run = async (rfq: ApiRfqSummary) => {
    setBusyId(rfq.id);
    try {
      const created = await api.post<unknown[]>(`/api/admin/rfqs/${rfq.id}/vendor-rfqs`);
      addToast('Supplier Matching Complete', `${rfq.rfqNumber}: ${created.length} supplier(s) matched by the deterministic (rule-based, not AI) matcher.`, 'success');
      onDone();
    } catch (err) {
      addToast('Matching Failed', err instanceof Error ? err.message : 'Request failed', 'error');
    } finally {
      setBusyId(null);
    }
  };

  if (loading || pending.length === 0) return null;
  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4 mb-6">
      <h3 className="font-bold text-sm text-slate-900 mb-1">Submitted RFQs awaiting supplier matching</h3>
      <p className="text-[11px] text-slate-500 mb-3">Matching is rule-based: exact MPN, stock quantity, verification, location and supplier score.</p>
      <div className="space-y-2">
        {pending.map((rfq) => (
          <div key={rfq.id} className="flex items-center justify-between gap-3 text-xs border border-slate-200 rounded-lg p-2.5">
            <span><span className="font-mono font-bold">{rfq.rfqNumber}</span> <span className="text-slate-500">• {rfq.items.length} line item(s) • {rfq.deliveryLocation}</span></span>
            <button disabled={busyId === rfq.id} onClick={() => run(rfq)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded font-semibold">
              {busyId === rfq.id ? 'Matching…' : 'Match Suppliers & Send Vendor RFQs'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminVendorRfqs: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <LiveAdminPage<ApiVendorRfq[]> title="Vendor RFQs" path="/api/admin/vendor-rfqs">
      {(rows, reload) => {
        const grouped: Record<string, ApiVendorRfq[]> = {};
        rows.forEach((v) => { (grouped[v.rfqId] ||= []).push(v); });
        return (
          <>
            <SupplierMatchingPanel onDone={reload} />
            <p className="text-xs text-slate-500 mb-4">RFQs dispatched to matched suppliers, grouped by customer RFQ.</p>
            {rows.length === 0 && <p className="text-sm text-slate-400">No vendor RFQs yet.</p>}
            <div className="space-y-4">
              {Object.entries(grouped).map(([rfqId, records]) => {
                const responded = records.filter((r) => r.status === 'RESPONDED').length;
                return (
                  <div key={rfqId} className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-slate-900">{records[0].rfq.rfqNumber}</span>
                        <span className="ml-2 text-[11px] text-slate-500">{records.length} supplier{records.length !== 1 ? 's' : ''} contacted • {responded} responded</span>
                      </div>
                      <button onClick={() => navigateTo(`/admin/vendor-rfqs/${rfqId}`)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {records.map((r) => (
                        <span key={r.id} className="text-slate-700 text-[11px] flex items-center gap-1.5">{r.supplier.companyName} <VendorStatusPill status={r.status} /></span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
    </LiveAdminPage>
  );
};

export const AdminVendorRfqDetail: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();
  const rfqId = currentRoute.split('/').pop() || '';
  return (
    <LiveAdminPage<ApiVendorRfq[]> title="Vendor RFQ Detail" path="/api/admin/vendor-rfqs">
      {(rows) => {
        const records = rows.filter((v) => v.rfqId === rfqId);
        return (
          <>
            <button onClick={() => navigateTo('/admin/vendor-rfqs')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Vendor RFQs</button>
            {records.length === 0 ? (
              <p className="text-sm text-slate-500">No vendor RFQ records found for this RFQ.</p>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 font-mono font-bold text-sm">{records[0].rfq.rfqNumber}</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-slate-50 border-b border-slate-200">
                      {['Supplier', 'Sent At', 'Status', 'Responded At', 'Action'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {records.map((r) => (
                        <tr key={r.id} className="border-b border-slate-50 hover:bg-blue-50/30">
                          <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.supplier.companyName}</td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(r.sentAt).toLocaleString()}</td>
                          <td className="px-4 py-3"><VendorStatusPill status={r.status} /></td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.respondedAt ? new Date(r.respondedAt).toLocaleString() : '—'}</td>
                          <td className="px-4 py-3">
                            {r.status === 'RESPONDED' && (
                              <button onClick={() => navigateTo('/admin/supplier-quotations')} className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-semibold hover:bg-indigo-500">View Quote</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        );
      }}
    </LiveAdminPage>
  );
};

// ─── Supplier Quotations & Comparison ───────────────────────────────────────

const LEAD_TIME_RANK = (text: string): number => {
  const t = text.toLowerCase();
  if (t.includes('same day')) return 0;
  if (t.includes('24')) return 1;
  if (t.includes('1-2') || t.includes('2-3')) return 2;
  if (t.includes('3-4')) return 3;
  return 4;
};

interface FlatQuoteRow { item: ApiQuoteItem; quote: ApiSupplierQuote; price: number; quality: number }

const flattenQuotes = (quotes: ApiSupplierQuote[]): FlatQuoteRow[] =>
  quotes
    .filter((q) => q.status !== 'CANNOT_SUPPLY')
    .flatMap((quote) => quote.items.map((item) => ({ item, quote, price: Number(item.unitPrice), quality: item.qualityScore ?? quote.supplier.supplierScore })));

const pickBest = (rows: FlatQuoteRow[]) => ({
  bestCommercial: rows.reduce((a, b) => (b.price < a.price ? b : a)),
  bestQuality: rows.reduce((a, b) => (b.quality > a.quality ? b : a)),
  bestLeadTime: rows.reduce((a, b) => (LEAD_TIME_RANK(b.item.leadTime) < LEAD_TIME_RANK(a.item.leadTime) ? b : a)),
  bestOverall: rows.reduce((a, b) => (b.quality * 2 - b.price / 100 > a.quality * 2 - a.price / 100 ? b : a)),
});

export const AdminSupplierQuotations: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <LiveAdminPage<ApiSupplierQuote[]> title="Supplier Quotations" path="/api/admin/supplier-quotes">
      {(quotes) => {
        const grouped: Record<string, FlatQuoteRow[]> = {};
        flattenQuotes(quotes).forEach((row) => { (grouped[row.item.mpn] ||= []).push(row); });
        return (
          <>
            <p className="text-xs text-slate-500 mb-4">Compare supplier responses per part. Internal purchase pricing shown here is admin-only and is never exposed to customers or other suppliers.</p>
            {Object.keys(grouped).length === 0 && <p className="text-sm text-slate-400">No supplier quotations submitted yet.</p>}
            <div className="space-y-6">
              {Object.entries(grouped).map(([mpn, rows]) => {
                const { bestCommercial, bestQuality, bestLeadTime, bestOverall } = pickBest(rows);
                return (
                  <div key={mpn} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono font-bold text-sm text-blue-700">{mpn}</span>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">Best Commercial: {bestCommercial.quote.supplier.companyName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">Best Quality: {bestQuality.quote.supplier.companyName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Best Lead Time: {bestLeadTime.quote.supplier.companyName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center gap-1"><Award className="w-3 h-3" />Best Overall: {bestOverall.quote.supplier.companyName}</span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="bg-slate-50 border-b border-slate-100">
                          {['Supplier', 'Score', 'Qty Available', 'Unit Price', 'MOQ', 'Date Code', 'Lead Time', 'Condition', 'Country', 'Status', ''].map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {rows.map(({ item, quote }) => (
                            <tr key={item.id} className="border-b border-slate-50 hover:bg-blue-50/30">
                              <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{quote.supplier.companyName}</td>
                              <td className="px-3 py-2.5"><SupplierScoreBadge score={quote.supplier.supplierScore} /></td>
                              <td className="px-3 py-2.5 font-mono">{item.availableQuantity.toLocaleString()}</td>
                              <td className="px-3 py-2.5 font-mono font-bold text-slate-900">{inr(item.unitPrice)}</td>
                              <td className="px-3 py-2.5 font-mono">{item.moq.toLocaleString()}</td>
                              <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{item.dateCode}</td>
                              <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{item.leadTime}</td>
                              <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{item.condition}</td>
                              <td className="px-3 py-2.5 text-slate-600">{item.countryOfOrigin ?? '—'}</td>
                              <td className="px-3 py-2.5 text-slate-600">{humanize(quote.status)}</td>
                              <td className="px-3 py-2.5">
                                <button onClick={() => navigateTo(`/admin/supplier-quotations/${quote.id}`)} className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-500">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
    </LiveAdminPage>
  );
};

export const AdminSupplierQuotationDetail: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();
  const id = currentRoute.split('/').pop() || '';
  return (
    <LiveAdminPage<ApiSupplierQuote> title="Supplier Quote Detail" path={`/api/admin/supplier-quotes/${encodeURIComponent(id)}`}>
      {(quote) => (
        <>
          <button onClick={() => navigateTo('/admin/supplier-quotations')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Supplier Quotations</button>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              {quote.items.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 text-xs">
                  <div className="font-mono font-bold text-lg text-blue-700 mb-3">{item.mpn}</div>
                  <div className="space-y-2">
                    {([
                      ['Available Quantity', item.availableQuantity.toLocaleString()],
                      ['Unit Price', `${inr(item.unitPrice)} ${quote.currency}`],
                      ['MOQ', item.moq.toLocaleString()],
                      ['Date Code', item.dateCode],
                      ['Packaging', item.packaging],
                      ['Condition', item.condition],
                      ['Lead Time', item.leadTime],
                      ['Country of Origin', item.countryOfOrigin ?? '—'],
                      ['Warranty', item.warranty ?? '—'],
                    ] as [string, string][]).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-800 text-right">{v}</span></div>
                    ))}
                  </div>
                  {item.notes && <p className="text-slate-500 italic pt-3">"{item.notes}"</p>}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
                <h4 className="font-bold text-sm text-slate-800 mb-1">Supplier Profile</h4>
                <div className="flex justify-between"><span className="text-slate-500">Company</span><span className="font-medium text-slate-800 text-right">{quote.supplier.companyName}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Score</span><SupplierScoreBadge score={quote.supplier.supplierScore} /></div>
                <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium text-slate-800">{[quote.supplier.city, quote.supplier.state].filter(Boolean).join(', ') || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Verified</span><span className="font-medium text-emerald-600">{quote.supplier.isVerified ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Quote Status</span><span className="font-medium text-slate-800">{humanize(quote.status)}</span></div>
              </div>
              <button onClick={() => navigateTo('/admin/customer-quotations')} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 flex items-center justify-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" /> Use in Customer Quotation
              </button>
            </div>
          </div>
        </>
      )}
    </LiveAdminPage>
  );
};

// ─── Customer Quotations ─────────────────────────────────────────────────────

const ApprovalStatusPill: React.FC<{ status: string }> = ({ status }) => {
  const style = status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : status === 'REJECTED' || status === 'EXPIRED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style}`}>{humanize(status)}</span>;
};

const DemoCalcWarning: React.FC<{ label?: string | null; creating?: boolean }> = ({ label, creating }) => (
  <div className="mb-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
    <span>
      <strong>{label || 'Demo Calculation'}.</strong>{' '}
      {creating
        ? 'The backend prices quotations with a flat 12% margin + 18% GST, not the Landed Cost Engine (exchange rate, customs duty, SWS, insurance, financing and risk margin are not applied). Do not treat the result as final.'
        : 'This pricing did not go through the Landed Cost Engine and should not be treated as final.'}
    </span>
  </div>
);

const CreateQuotationPanel: React.FC<{ onCreated: (id: string) => void }> = ({ onCreated }) => {
  const { addToast } = useApp();
  const { data, loading } = useApiData<ApiSupplierQuote[]>('/api/admin/supplier-quotes');
  const [rfqId, setRfqId] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const usable = (data ?? []).filter((q) => q.status !== 'CANNOT_SUPPLY' && q.vendorRfq);
  const rfqs = Array.from(new Map(usable.map((q) => [q.vendorRfq!.rfq.id, q.vendorRfq!.rfq.rfqNumber])).entries());
  const options = usable.filter((q) => q.vendorRfq!.rfq.id === rfqId).flatMap((q) => q.items.map((item) => ({ item, quote: q })));

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const generate = async () => {
    setBusy(true);
    try {
      const created = await api.post<{ id: string; quoteNumber: string }>('/api/admin/customer-quotations', { rfqId, supplierQuoteItemIds: selected });
      addToast('Customer Quotation Created (Demo Calculation)', `${created.quoteNumber} saved to the database as DRAFT.`, 'warning');
      onCreated(created.id);
    } catch (err) {
      addToast('Quotation Creation Failed', err instanceof Error ? err.message : 'Request failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-6">
      <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5"><Plus className="w-4 h-4" /> Create Quotation from RFQ</h3>
      <DemoCalcWarning creating />
      {loading ? <p className="text-xs text-slate-500">Loading supplier quotes…</p> : (
        <>
          <select value={rfqId} onChange={(e) => { setRfqId(e.target.value); setSelected([]); }} className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white w-full mb-3">
            <option value="">Select an RFQ with supplier responses…</option>
            {rfqs.map(([id, number]) => <option key={id} value={id}>{number}</option>)}
          </select>
          {rfqId && (
            <div className="space-y-2 mb-3">
              {options.map(({ item, quote }) => (
                <label key={item.id} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
                  <span className="font-mono font-bold text-blue-700">{item.mpn}</span>
                  <span className="text-slate-600">{quote.supplier.companyName}</span>
                  <span className="ml-auto font-mono font-bold">{inr(item.unitPrice)}</span>
                </label>
              ))}
            </div>
          )}
          <button onClick={generate} disabled={!rfqId || selected.length === 0 || busy} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" /> {busy ? 'Generating…' : 'Generate Quotation (Demo Calculation)'}
          </button>
        </>
      )}
    </div>
  );
};

export const AdminCustomerQuotations: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <LiveAdminPage<ApiCustomerQuotation[]> title="Customer Quotations" path="/api/admin/customer-quotations">
      {(quotations) => (
        <>
          <CreateQuotationPanel onCreated={(id) => navigateTo(`/admin/customer-quotations/${id}`)} />
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-slate-50 border-b border-slate-200">
                  {['Quote #', 'RFQ #', 'Customer', 'Items', 'Total (INR)', 'Valid Until', 'Status', 'Pricing', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {quotations.length === 0 && <tr><td colSpan={9} className="text-center py-10 text-slate-400">No customer quotations yet.</td></tr>}
                  {quotations.map((q) => (
                    <tr key={q.id} className="border-b border-slate-50 hover:bg-blue-50/30">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">{q.quoteNumber}</td>
                      <td className="px-4 py-3 font-mono text-blue-600 whitespace-nowrap">{q.rfq?.rfqNumber ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-700">{q.customer?.companyName ?? '—'}</td>
                      <td className="px-4 py-3 font-mono">{q.items.length}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">{inr(q.total)}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{q.validUntil ? new Date(q.validUntil).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3"><ApprovalStatusPill status={q.status} /></td>
                      <td className="px-4 py-3">{q.isDemoCalculation && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold whitespace-nowrap">Demo Calc</span>}</td>
                      <td className="px-4 py-3"><button onClick={() => navigateTo(`/admin/customer-quotations/${q.id}`)} className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-500">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </LiveAdminPage>
  );
};

export const AdminCustomerQuotationDetail: React.FC = () => {
  const { currentRoute, navigateTo, addToast } = useApp();
  const id = currentRoute.split('/').pop() || '';

  const setStatus = async (status: string, reload: () => void) => {
    try {
      await api.patch(`/api/admin/customer-quotations/${id}`, { status });
      addToast('Status Updated', `Quotation moved to ${humanize(status)}.`, 'success');
      reload();
    } catch (err) {
      addToast('Update Failed', err instanceof Error ? err.message : 'Request failed', 'error');
    }
  };

  return (
    <LiveAdminPage<ApiCustomerQuotation> title="Customer Quotation Detail" path={`/api/admin/customer-quotations/${encodeURIComponent(id)}`}>
      {(quote, reload) => (
        <>
          <button onClick={() => navigateTo('/admin/customer-quotations')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Customer Quotations</button>
          {quote.isDemoCalculation && <DemoCalcWarning label={quote.calculationLabel} />}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-sm">{quote.quoteNumber}{quote.rfq ? ` — RFQ ${quote.rfq.rfqNumber}` : ''}</h3>
                <ApprovalStatusPill status={quote.status} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-50 border-b border-slate-100">
                    {['MPN', 'Description', 'Qty', 'Unit Price', 'Total', 'Date Code', 'Lead Time'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {quote.items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">{item.mpn}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[220px] truncate" title={item.description}>{item.description}</td>
                        <td className="px-4 py-3 font-mono">{item.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono whitespace-nowrap">{inr(item.unitPrice)}</td>
                        <td className="px-4 py-3 font-mono font-bold whitespace-nowrap">{inr(item.totalPrice)}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{item.dateCode ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{item.leadTime ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
                <div className="space-y-1.5 text-xs w-full max-w-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-mono">{inr(quote.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Freight</span><span className="font-mono">{inr(quote.freight)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">GST</span><span className="font-mono">{inr(quote.gst)}</span></div>
                  <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-slate-100"><span>Total</span><span className="font-mono">{inr(quote.total)}</span></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
                <h4 className="font-bold text-sm text-slate-800">Quotation Info</h4>
                {([
                  ['Customer', quote.customer?.companyName ?? '—'],
                  ['Valid Until', quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : '—'],
                  ['Currency', quote.currency],
                  ['Payment Terms', quote.paymentTerms ?? '—'],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-800 text-right">{v}</span></div>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
                <h4 className="font-bold text-sm text-slate-800">Approval Workflow</h4>
                {quote.status === 'DRAFT' && <button onClick={() => setStatus('PENDING_APPROVAL', reload)} className="w-full py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-500">Submit for Approval</button>}
                {quote.status === 'PENDING_APPROVAL' && <button onClick={() => setStatus('SENT', reload)} className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500">Approve &amp; Send to Customer</button>}
                {!['DRAFT', 'PENDING_APPROVAL'].includes(quote.status) && <p className="text-slate-500">Current status: {humanize(quote.status)}.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </LiveAdminPage>
  );
};


export const AdminNegotiations: React.FC = () => (
  <AdminStub title="Negotiations" icon={<DollarSign className="w-8 h-8" />} description="Manage active price negotiations, counter-offers, and approval escalations." version="v2" />
);
export const AdminSalesOrders: React.FC = () => (
  <AdminStub title="Sales Orders" icon={<FileText className="w-8 h-8" />} description="View confirmed sales orders, payment status, and delivery tracking." version="v1.1" />
);
export const AdminSalesOrderDetail: React.FC = () => (
  <AdminStub title="Sales Order Detail" icon={<FileText className="w-8 h-8" />} description="View sales order line items, delivery schedule, and invoice details." version="v1.1" />
);
export const AdminPurchaseOrders: React.FC = () => (
  <AdminStub title="Purchase Orders" icon={<Package className="w-8 h-8" />} description="Manage purchase orders issued to suppliers, GRN, and payment tracking." version="v1.1" />
);
export const AdminPurchaseOrderDetail: React.FC = () => (
  <AdminStub title="Purchase Order Detail" icon={<Package className="w-8 h-8" />} description="View PO details, GRN status, and supplier invoice reconciliation." version="v1.1" />
);
export const AdminWarehouse: React.FC = () => (
  <AdminStub title="Warehouse" icon={<Boxes className="w-8 h-8" />} description="Manage warehouse locations, stock movements, and putaway records." version="v2" />
);
export const AdminDispatch: React.FC = () => (
  <AdminStub title="Dispatch" icon={<Truck className="w-8 h-8" />} description="Create dispatch notes, assign couriers, generate packing lists, and track shipments." version="v2" />
);
export const AdminInvoices: React.FC = () => (
  <AdminStub title="Invoices" icon={<FileText className="w-8 h-8" />} description="Generate and manage customer and supplier invoices with GST compliance." version="v2" />
);
export const AdminPayments: React.FC = () => (
  <AdminStub title="Payments" icon={<DollarSign className="w-8 h-8" />} description="Track customer payments received and supplier payments made." version="v2" />
);
export const AdminCrm: React.FC = () => (
  <AdminStub title="CRM" icon={<Users className="w-8 h-8" />} description="Manage customer relationships, follow-up tasks, and deal pipeline." version="v3" />
);
export const AdminTasks: React.FC = () => (
  <AdminStub title="Tasks" icon={<ClipboardList className="w-8 h-8" />} description="Manage internal team tasks, assignments, and SLA tracking." version="v2" />
);
export const AdminMarketing: React.FC = () => (
  <AdminStub title="Marketing" icon={<TrendingUp className="w-8 h-8" />} description="Manage email campaigns, supplier outreach, and customer acquisition funnels." version="v3" />
);
export const AdminPartAlerts: React.FC = () => (
  <AdminStub title="Part Alerts" icon={<Bell className="w-8 h-8" />} description="View and manage customer part alerts, notification triggers, and match events." version="v2" />
);
export const AdminReports: React.FC = () => (
  <AdminStub title="Reports" icon={<BarChart3 className="w-8 h-8" />} description="Business intelligence reports: revenue, margins, inventory turnover, and supplier performance." version="v2" />
);
export const AdminDocuments: React.FC = () => (
  <AdminStub title="Documents" icon={<FileText className="w-8 h-8" />} description="Central document repository for quotations, POs, invoices, and compliance certificates." version="v2" />
);
export const AdminUsersRoles: React.FC = () => (
  <AdminStub title="Users & Roles" icon={<Users className="w-8 h-8" />} description="Manage internal team accounts, role assignments, and permission matrix." version="v1.1" />
);
export const AdminSettings: React.FC = () => (
  <AdminStub title="Settings" icon={<Settings className="w-8 h-8" />} description="Configure platform settings: approval thresholds, notification rules, and integration keys." version="v1.1" />
);
