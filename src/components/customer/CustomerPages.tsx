import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RfqStatusBadge, OrderStatusBadge } from '../common/Badge';
import {
  FileSpreadsheet, Clock, CheckCircle2, AlertCircle, Truck, ArrowRight,
  Download, MessageSquare, DollarSign, Package, Layers, Send, Building,
  RefreshCw, Eye, FileText, LayoutDashboard, Search, ShoppingCart,
  Star, Bell, BookOpen, Users, Settings, ChevronRight, Plus, X,
  Filter, Upload, Shield, ClipboardList, AlertTriangle, TrendingUp,
  BarChart3, Calendar, MapPin, Inbox, Hash, Tag, ExternalLink,
  MoreHorizontal, LogOut, Menu,
} from 'lucide-react';

// ─── Shared Customer Layout (sidebar + header) ─────────────────────────────

interface CustomerLayoutProps { children: React.ReactNode; title: string; }

const CUSTOMER_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/customer/dashboard' },
  { label: 'Search Parts', icon: Search, route: '/search' },
  { label: 'My RFQs', icon: FileSpreadsheet, route: '/customer/rfqs' },
  { label: 'Quotations', icon: ClipboardList, route: '/customer/quotations' },
  { label: 'Orders', icon: Truck, route: '/customer/orders' },
  { label: 'Purchase History', icon: BarChart3, route: '/customer/purchase-history' },
  { label: 'Saved Parts', icon: Star, route: '/customer/saved-parts' },
  { label: 'BOMs', icon: Layers, route: '/customer/boms' },
  { label: 'Part Alerts', icon: Bell, route: '/customer/alerts' },
  { label: 'Documents', icon: FileText, route: '/customer/documents' },
  { label: 'Company Users', icon: Users, route: '/customer/company-users' },
  { label: 'Settings', icon: Settings, route: '/customer/settings' },
  { label: 'Notifications', icon: Inbox, route: '/customer/notifications' },
];

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, title }) => {
  const { currentRoute, navigateTo } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-slate-900 text-white z-40 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:flex lg:z-auto`}>
        {/* Sidebar brand */}
        <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Customer Portal</div>
            <div className="text-sm font-bold text-white mt-0.5">Demo Company A</div>
            <div className="text-[10px] text-slate-400">buyer@democompany-a.example</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo badge */}
        <div className="mx-3 mt-3 px-2 py-1 rounded bg-amber-900/40 border border-amber-700/50 text-amber-300 text-[10px] font-mono text-center">
          ⚠ Demo Environment
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {CUSTOMER_NAV.map(item => {
            const active = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
            return (
              <button
                key={item.route}
                onClick={() => { navigateTo(item.route); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors ${active ? 'bg-blue-700/30 text-cyan-300 border-r-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 px-4 py-3">
          <button onClick={() => navigateTo('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs">
            <LogOut className="w-3.5 h-3.5" /><span>Back to Public Site</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-slate-900 flex-1">{title}</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('/customer/notifications')} className="relative p-1.5 rounded-lg hover:bg-slate-100">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">D</div>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── CustomerDashboard ──────────────────────────────────────────────────────

export const CustomerDashboard: React.FC = () => {
  const { rfqs, orders, navigateTo } = useApp();

  return (
    <CustomerLayout title="Procurement Dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500">Welcome back, Demo User A</p>
          <h2 className="text-xl font-bold text-slate-900">Demo Company A — Procurement Hub</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigateTo('/bom/upload')} className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 shadow-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Upload BOM
          </button>
          <button onClick={() => navigateTo('/rfq/new')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New RFQ
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active RFQs', value: rfqs.length, sub: '2 In Sourcing', color: 'blue', route: '/customer/rfqs' },
          { label: 'Quotations', value: 1, sub: '1 Action Required', color: 'emerald', route: '/customer/quotations' },
          { label: 'Open Orders', value: orders.length, sub: 'QC Passed', color: 'indigo', route: '/customer/orders' },
          { label: 'Saved Parts', value: 4, sub: '2 Alerts Active', color: 'amber', route: '/customer/saved-parts' },
        ].map(k => (
          <div key={k.label} onClick={() => navigateTo(k.route)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-colors">
            <div className="text-slate-500 text-xs font-medium">{k.label}</div>
            <div className={`text-2xl font-extrabold font-mono text-${k.color}-600 mt-1`}>{k.value}</div>
            <div className={`text-[11px] text-${k.color}-700 font-semibold mt-1`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent RFQs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800">Recent RFQs</h3>
          <button onClick={() => navigateTo('/customer/rfqs')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              {['RFQ #', 'Parts', 'Status', 'Created', 'Required Date', 'Action'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rfqs.map(rfq => (
                <tr key={rfq.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{rfq.rfqNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{rfq.lineItems.length} line item{rfq.lineItems.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3"><RfqStatusBadge status={rfq.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{rfq.createdAt}</td>
                  <td className="px-4 py-3 text-slate-500">{rfq.requiredDate}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => navigateTo(`/customer/rfqs/${rfq.id}`)} className="text-blue-600 hover:underline flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Upload, label: 'Upload New BOM', sub: 'AI column mapping + RFQ', color: 'teal', route: '/bom/upload' },
          { icon: Search, label: 'Search Components', sub: 'Find MPN, Category or Manufacturer', color: 'blue', route: '/search' },
          { icon: Bell, label: 'Manage Part Alerts', sub: 'Get notified on stock / price', color: 'amber', route: '/customer/alerts' },
        ].map(a => (
          <div key={a.label} onClick={() => navigateTo(a.route)}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-blue-300 shadow-xs transition-colors">
            <div className={`w-9 h-9 rounded-lg bg-${a.color}-100 flex items-center justify-center text-${a.color}-600`}>
              <a.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-800">{a.label}</div>
              <div className="text-[11px] text-slate-500">{a.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerRfqsList ───────────────────────────────────────────────────────

export const CustomerRfqsList: React.FC = () => {
  const { rfqs, navigateTo } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? rfqs : rfqs.filter(r => r.status === statusFilter);

  return (
    <CustomerLayout title="My RFQs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="text-sm text-slate-500">{filtered.length} RFQ{filtered.length !== 1 ? 's' : ''} found</div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            {['Draft', 'Submitted', 'Supplier Matching', 'Customer Quotation', 'Negotiation', 'Accepted'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => navigateTo('/rfq/new')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New RFQ
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            {['RFQ #', 'Company / Delivery', 'Line Items', 'Status', 'Required Date', 'Quotes', 'Action'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">No RFQs found</p>
                <p className="text-[11px] mt-1">Submit your first RFQ to start sourcing.</p>
              </td></tr>
            )}
            {filtered.map(rfq => (
              <tr key={rfq.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">{rfq.rfqNumber}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{rfq.companyName}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{rfq.deliveryLocation.substring(0, 30)}…</div>
                </td>
                <td className="px-4 py-3 font-mono text-slate-700">{rfq.lineItems.length}</td>
                <td className="px-4 py-3"><RfqStatusBadge status={rfq.status} /></td>
                <td className="px-4 py-3 text-slate-500">{rfq.requiredDate}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold font-mono ${rfq.receivedQuotesCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {rfq.receivedQuotesCount}/{rfq.matchedSuppliersCount}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => navigateTo(`/customer/rfqs/${rfq.id}`)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerRfqDetail ──────────────────────────────────────────────────────

export const CustomerRfqDetail: React.FC = () => {
  const { rfqs, navigateTo } = useApp();
  const rfq = rfqs[0];
  if (!rfq) return null;

  const stages = ['Draft', 'Submitted', 'Supplier Matching', 'Vendor RFQ Sent', 'Supplier Response', 'Under Evaluation', 'Customer Quotation', 'Negotiation', 'Accepted', 'PO Received', 'Purchase', 'QC', 'Dispatch', 'Completed'];
  const currentIdx = stages.indexOf(rfq.status);

  return (
    <CustomerLayout title={`RFQ Detail — ${rfq.rfqNumber}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={() => navigateTo('/customer/rfqs')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-2">
            ← Back to RFQs
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xl text-slate-900">{rfq.rfqNumber}</span>
            <RfqStatusBadge status={rfq.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">Created {rfq.createdAt} • {rfq.currency} • {rfq.paymentTerms}</p>
        </div>
        {rfq.status === 'Customer Quotation' && (
          <button onClick={() => navigateTo('/customer/quotations')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Customer Quotation
          </button>
        )}
      </div>

      {/* Workflow Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-xs overflow-x-auto">
        <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-4">Procurement Workflow</h3>
        <div className="flex gap-0 min-w-max">
          {stages.map((stage, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={stage} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${done ? (active ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-emerald-500 text-white') : 'bg-slate-200 text-slate-400'
                    }`}>
                    {done && !active ? '✓' : i + 1}
                  </div>
                  <div className={`text-[9px] font-medium mt-1 text-center max-w-[60px] leading-tight ${done ? 'text-slate-700' : 'text-slate-400'}`}>
                    {stage}
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <div className={`h-0.5 w-8 mx-1 ${i < currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Line Items */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800">Line Items ({rfq.lineItems.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['MPN', 'Manufacturer', 'Qty Req', 'Quoted Price', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {rfq.lineItems.map(li => (
                  <tr key={li.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{li.mpn}</td>
                    <td className="px-4 py-3 text-slate-600">{li.manufacturer}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">{li.requiredQuantity.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-emerald-700">
                      {li.quotedPriceInr ? `₹${li.quotedPriceInr.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${li.status === 'Quoted' ? 'bg-emerald-100 text-emerald-800' :
                          li.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                        }`}>{li.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info + Timeline */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-sm mb-3">RFQ Details</h4>
            {[
              ['Customer', rfq.companyName],
              ['Contact', rfq.customerName],
              ['Delivery', rfq.deliveryLocation],
              ['Required By', rfq.requiredDate],
              ['Payment', rfq.paymentTerms],
              ['Suppliers Matched', `${rfq.matchedSuppliersCount}`],
              ['Quotes Received', `${rfq.receivedQuotesCount}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-800 text-right max-w-[60%]">{v}</span>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Activity Timeline</h4>
            <div className="space-y-3">
              {rfq.historyTimeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 bg-blue-200 rounded relative"><div className="w-2 h-2 bg-blue-500 rounded-full absolute -left-0.5 top-1" /></div>
                  <div className="flex-1 pb-2">
                    <div className="font-semibold text-xs text-slate-800">{item.stage}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{item.timestamp} • {item.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerQuotationsList ─────────────────────────────────────────────────

const MOCK_QUOTATIONS_LIST = [
  { id: 'Q-2026-0914', rfqNumber: 'RFQ-2026-0841', items: 3, totalInr: 176250, validUntil: '2026-09-20', status: 'Pending Review', created: '2026-09-09' },
  { id: 'Q-2026-0901', rfqNumber: 'RFQ-2026-0828', items: 2, totalInr: 84500, validUntil: '2026-09-15', status: 'Accepted', created: '2026-09-05' },
  { id: 'Q-2026-0872', rfqNumber: 'RFQ-2026-0810', items: 5, totalInr: 312000, validUntil: '2026-09-01', status: 'Expired', created: '2026-08-28' },
];

export const CustomerQuotationsList: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <CustomerLayout title="My Quotations">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{MOCK_QUOTATIONS_LIST.length} quotations received</p>
        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold">1 Action Required</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6">
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            {['Quote #', 'RFQ #', 'Items', 'Total (INR)', 'Valid Until', 'Status', 'Action'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_QUOTATIONS_LIST.map(q => (
              <tr key={q.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">{q.id}</td>
                <td className="px-4 py-3 font-mono text-blue-600">{q.rfqNumber}</td>
                <td className="px-4 py-3 text-slate-600">{q.items}</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">₹{q.totalInr.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500">{q.validUntil}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${q.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      q.status === 'Expired' ? 'bg-slate-100 text-slate-500' :
                        'bg-amber-100 text-amber-800'
                    }`}>{q.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => navigateTo(`/customer/quotations/${q.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-500">View</button>
                  {q.status === 'Pending Review' && (
                    <button className="px-3 py-1 border border-emerald-500 text-emerald-600 rounded text-[11px] font-semibold hover:bg-emerald-50">Accept</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending action card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-900">Action Required — Q-2026-0914</h4>
          <p className="text-xs text-amber-700 mt-1">This quotation expires on 20 Sep 2026. Please review and accept, reject, or request negotiation before the validity date.</p>
          <button onClick={() => navigateTo('/customer/quotations/Q-2026-0914')} className="mt-2 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold">
            Review Quotation →
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerQuotationDetail ────────────────────────────────────────────────

export const CustomerQuotationDetail: React.FC = () => {
  const { activeQuotation, submitNegotiation, addToast, navigateTo } = useApp();
  const q = activeQuotation;
  const [showNegModal, setShowNegModal] = useState(false);
  const [negType, setNegType] = useState<'Price Counter' | 'Alternate Requested' | 'Quantity Revision'>('Price Counter');
  const [negNote, setNegNote] = useState('');

  const handleNeg = () => {
    if (!negNote.trim()) return;
    submitNegotiation(negNote, negType);
    setShowNegModal(false); setNegNote('');
  };

  return (
    <CustomerLayout title={`Quotation — ${q.quoteNumber}`}>
      <button onClick={() => navigateTo('/customer/quotations')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Quotations</button>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xl text-slate-900">{q.quoteNumber}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${q.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                  q.approvalStatus.includes('Pending') ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-600'
                }`}>{q.approvalStatus}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Valid until {q.validUntil} • {q.currency} • {q.paymentTerms}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => addToast('PDF Generated', 'Quotation PDF is being prepared for download.', 'info')} className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button onClick={() => setShowNegModal(true)} className="px-3 py-2 border border-blue-500 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-50">
              <MessageSquare className="w-3.5 h-3.5" /> Negotiate
            </button>
            <button onClick={() => addToast('Quotation Accepted', `${q.quoteNumber} has been accepted. PO generation initiated.`, 'success')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accept Quote
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Line Items */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800">Quoted Line Items</h3>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['MPN', 'Manufacturer', 'Qty', 'Unit Price', 'Total', 'Date Code', 'Lead Time'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {q.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-3 py-3 font-mono font-bold text-blue-700">{item.mpn}</td>
                    <td className="px-3 py-3 text-slate-600">{item.manufacturer}</td>
                    <td className="px-3 py-3 font-mono text-slate-800">{item.quantity.toLocaleString()}</td>
                    <td className="px-3 py-3 font-mono text-slate-900 font-bold">₹{item.unitPriceInr.toFixed(2)}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">₹{item.totalPriceInr.toLocaleString()}</td>
                    <td className="px-3 py-3 font-mono text-slate-500">{item.dateCode}</td>
                    <td className="px-3 py-3 text-slate-500">{item.leadTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-col items-end gap-1 text-xs">
              <div className="flex justify-between w-48"><span className="text-slate-500">Subtotal</span><span className="font-mono font-bold">₹{q.subtotalInr.toLocaleString()}</span></div>
              <div className="flex justify-between w-48"><span className="text-slate-500">Freight</span><span className="font-mono">₹{q.freightInr.toLocaleString()}</span></div>
              <div className="flex justify-between w-48"><span className="text-slate-500">GST (18%)</span><span className="font-mono">₹{q.gstInr.toLocaleString()}</span></div>
              <div className="flex justify-between w-48 pt-2 border-t border-slate-200"><span className="font-bold text-slate-800">Total</span><span className="font-mono font-extrabold text-slate-900 text-sm">₹{q.totalInr.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Negotiation Log */}
          {q.negotiationLog.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
              <h3 className="font-bold text-sm text-slate-800 mb-4">Negotiation Log</h3>
              <div className="space-y-3">
                {q.negotiationLog.map(n => (
                  <div key={n.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{n.actor}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${n.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                          n.status === 'Declined' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                        }`}>{n.status}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">{n.type}</span>
                    <p className="text-slate-600 mt-1">{n.note}</p>
                    <p className="text-slate-400 mt-1">{n.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Quotation Info</h4>
            {[
              ['Quote #', q.quoteNumber],
              ['RFQ #', q.rfqNumber],
              ['Customer', q.customerName],
              ['Valid Until', q.validUntil],
              ['Currency', q.currency],
              ['Payment', q.paymentTerms],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-800">{v}</span></div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Actions</h4>
            <div className="space-y-2">
              <button onClick={() => addToast('Accepted', 'Quote accepted. PO generation initiated.', 'success')} className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500">✓ Accept Quote</button>
              <button onClick={() => setShowNegModal(true)} className="w-full py-2 border border-blue-400 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50">Negotiate Price</button>
              <button onClick={() => addToast('Rejected', 'Quote rejection noted.', 'error')} className="w-full py-2 border border-red-400 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50">Reject Quote</button>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation Modal */}
      {showNegModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Submit Negotiation Request</h3>
              <button onClick={() => setShowNegModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Negotiation Type</label>
                <select value={negType} onChange={e => setNegType(e.target.value as typeof negType)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Price Counter">Price Counter Offer</option>
                  <option value="Alternate Requested">Request Alternate Part</option>
                  <option value="Quantity Revision">Quantity Revision</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note to Sales Team</label>
                <textarea value={negNote} onChange={e => setNegNote(e.target.value)} rows={4}
                  placeholder="Describe your requirement or counter-offer in detail..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button onClick={() => setShowNegModal(false)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleNeg} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

// ─── CustomerOrdersList ─────────────────────────────────────────────────────

const ORDER_STEPS = ['Accepted', 'Purchase', 'QC', 'Warehouse', 'Dispatch', 'Invoice', 'Completed'];

export const CustomerOrdersList: React.FC = () => {
  const { orders, navigateTo } = useApp();

  return (
    <CustomerLayout title="My Orders">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{orders.length} order{orders.length !== 1 ? 's' : ''} in progress</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No orders yet</p>
            <p className="text-xs mt-1">Accept a quotation to create your first order.</p>
          </div>
        )}
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  PO: <span className="font-mono">{order.customerPoNumber}</span> •
                  Expected: {order.expectedDelivery} •
                  Total: <span className="font-mono font-bold text-slate-800">₹{order.totalAmountInr.toLocaleString()}</span>
                </p>
              </div>
              <button onClick={() => navigateTo(`/customer/orders/${order.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500">Track Order</button>
            </div>

            {/* Step tracker */}
            <div className="px-5 py-4 overflow-x-auto">
              <div className="flex gap-0 min-w-max">
                {ORDER_STEPS.map((step, i) => {
                  const done = i <= order.currentStepIndex;
                  const active = i === order.currentStepIndex;
                  return (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${active ? 'bg-blue-600 text-white ring-2 ring-blue-200' :
                            done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                          }`}>{done && !active ? '✓' : i + 1}</div>
                        <div className={`text-[9px] font-medium mt-1 ${done ? 'text-slate-700' : 'text-slate-400'}`}>{step}</div>
                      </div>
                      {i < ORDER_STEPS.length - 1 && (
                        <div className={`h-0.5 w-8 mx-1 ${i < order.currentStepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="px-5 pb-4">
              <div className="text-xs text-slate-500 mb-2">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded font-mono text-[11px] font-bold">{item.mpn} ×{item.quantity.toLocaleString()}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerOrderDetail ────────────────────────────────────────────────────

export const CustomerOrderDetail: React.FC = () => {
  const { orders, navigateTo } = useApp();
  const order = orders[0];
  if (!order) return null;

  return (
    <CustomerLayout title={`Order — ${order.orderNumber}`}>
      <button onClick={() => navigateTo('/customer/orders')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Orders</button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xl text-slate-900">{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">PO: {order.customerPoNumber} • Ordered: {order.orderDate} • Delivery: {order.expectedDelivery}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Invoice</button>
          <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Track Shipment</button>
        </div>
      </div>

      {/* Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-5 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {ORDER_STEPS.map((step, i) => {
            const done = i <= order.currentStepIndex;
            const active = i === order.currentStepIndex;
            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                      done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>{done && !active ? '✓' : i + 1}</div>
                  <div className={`text-[10px] font-medium mt-1.5 text-center ${done ? 'text-slate-800' : 'text-slate-400'}`}>{step}</div>
                </div>
                {i < ORDER_STEPS.length - 1 && (
                  <div className={`h-0.5 w-12 mx-1 ${i < order.currentStepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100"><h3 className="font-bold text-sm text-slate-800">Order Items</h3></div>
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              {['MPN', 'Manufacturer', 'Quantity', 'Unit Price', 'Total'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{item.mpn}</td>
                  <td className="px-4 py-3 text-slate-600">{item.manufacturer}</td>
                  <td className="px-4 py-3 font-mono">{item.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">₹{item.unitPriceInr.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono font-bold">₹{(item.quantity * item.unitPriceInr).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs space-y-2">
          <h4 className="font-bold text-slate-800 text-sm">Delivery Info</h4>
          {[
            ['Carrier', order.carrier || 'To be assigned'],
            ['Tracking', order.trackingNumber || 'Pending dispatch'],
            ['Address', order.deliveryAddress],
            ['Total', `₹${order.totalAmountInr.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-slate-500">{k}</div>
              <div className="font-medium text-slate-800">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerSavedParts ─────────────────────────────────────────────────────

export const CustomerSavedParts: React.FC = () => {
  const { savedParts, toggleSavePart, addPartToDraftRfq, navigateTo } = useApp();
  const { components } = useApp();
  const saved = components.filter(c => savedParts.includes(c.mpn));

  return (
    <CustomerLayout title="Saved Parts">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{saved.length} saved component{saved.length !== 1 ? 's' : ''}</p>
        <button onClick={() => navigateTo('/search')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" /> Search & Save More
        </button>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          <Star className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No saved parts yet</p>
          <p className="text-xs mt-1">Save components from search results or part detail pages.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(comp => (
            <div key={comp.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-mono font-bold text-blue-700">{comp.mpn}</div>
                  <div className="text-xs text-slate-500">{comp.manufacturer}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${comp.lifecycle === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{comp.lifecycle}</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 mb-3">{comp.description}</p>
              <div className="flex gap-1 flex-wrap mb-3">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{comp.package}</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{comp.category}</span>
                {comp.rohsCompliant && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">RoHS</span>}
              </div>
              <div className="text-[11px] text-slate-500 mb-3">
                Stock: <span className="font-mono font-bold text-slate-800">{comp.totalAvailableQuantity.toLocaleString()}</span> pcs
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigateTo(`/part/${comp.mpn}`)} className="flex-1 py-1.5 border border-slate-300 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-50">View</button>
                <button onClick={() => addPartToDraftRfq({ mpn: comp.mpn, manufacturer: comp.manufacturer })} className="flex-1 py-1.5 bg-blue-600 text-white rounded text-[11px] font-bold hover:bg-blue-500">+ RFQ</button>
                <button onClick={() => toggleSavePart(comp.mpn)} className="py-1.5 px-2 border border-red-300 text-red-600 rounded text-[11px] hover:bg-red-50">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
};

// ─── CustomerAlerts ─────────────────────────────────────────────────────────

export const CustomerAlerts: React.FC = () => {
  const { partAlerts, addToast } = useApp();

  return (
    <CustomerLayout title="Part Alerts">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{partAlerts.length} alert{partAlerts.length !== 1 ? 's' : ''} configured</p>
        <button onClick={() => addToast('Coming Soon', 'Alert creation will be available in v2.', 'info')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Alert
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            {['MPN', 'Target Qty', 'Channels', 'Created', 'Last Triggered', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {partAlerts.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No alerts configured yet</p>
              </td></tr>
            )}
            {partAlerts.map(alert => (
              <tr key={alert.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-blue-700">{alert.mpn}</td>
                <td className="px-4 py-3 font-mono">{alert.targetQuantity.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {alert.channels.map(c => (
                      <span key={c} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{alert.createdAt}</td>
                <td className="px-4 py-3 text-slate-500">{alert.lastTriggered || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${alert.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>{alert.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => addToast('Alert Toggled', `Alert for ${alert.mpn} has been paused.`, 'info')} className="text-slate-500 hover:text-blue-600 text-[11px]">Pause</button>
                  <button onClick={() => addToast('Alert Deleted', `Alert for ${alert.mpn} removed.`, 'warning')} className="text-red-500 hover:text-red-700 text-[11px]">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerPurchaseHistory ────────────────────────────────────────────────

export const CustomerPurchaseHistory: React.FC = () => {
  const { orders } = useApp();
  const total = orders.reduce((sum, o) => sum + o.totalAmountInr, 0);

  return (
    <CustomerLayout title="Purchase History">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length.toString(), color: 'blue' },
          { label: 'Total Spend', value: `₹${total.toLocaleString()}`, color: 'emerald' },
          { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length.toString(), color: 'teal' },
          { label: 'Avg Order Value', value: orders.length ? `₹${Math.round(total / orders.length).toLocaleString()}` : '₹0', color: 'indigo' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs text-slate-500">{k.label}</div>
            <div className={`text-xl font-extrabold font-mono text-${k.color}-600 mt-1`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800">Order History</h3>
        </div>
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 border-b border-slate-100">
            {['Order #', 'Date', 'Items', 'Total', 'Status', 'Invoice'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">{order.orderNumber}</td>
                <td className="px-4 py-3 text-slate-500">{order.orderDate}</td>
                <td className="px-4 py-3">{order.items.length} items</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">₹{order.totalAmountInr.toLocaleString()}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline text-[11px] flex items-center gap-1"><Download className="w-3 h-3" /> Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerDocuments ──────────────────────────────────────────────────────

const DEMO_DOCS = [
  { name: 'Q-2026-0914.pdf', type: 'Customer Quotation', transaction: 'Q-2026-0914', date: '2026-09-09', status: 'Approved' },
  { name: 'RFQ-2026-0841.pdf', type: 'RFQ Confirmation', transaction: 'RFQ-2026-0841', date: '2026-09-08', status: 'Submitted' },
  { name: 'INV-2026-0301.pdf', type: 'Invoice', transaction: 'ORD-2026-1001', date: '2026-08-15', status: 'Paid' },
  { name: 'PO-2026-0145.pdf', type: 'Purchase Order', transaction: 'ORD-2026-0980', date: '2026-08-10', status: 'Completed' },
  { name: 'COC-LM358DR.pdf', type: 'Certificate of Conformance', transaction: 'ORD-2026-0980', date: '2026-08-12', status: 'Verified' },
];

export const CustomerDocuments: React.FC = () => {
  return (
    <CustomerLayout title="Documents">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{DEMO_DOCS.length} documents</p>
        <select className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Types</option>
          {['Customer Quotation', 'RFQ Confirmation', 'Invoice', 'Purchase Order', 'Certificate of Conformance'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            {['Document', 'Type', 'Transaction', 'Date', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {DEMO_DOCS.map((doc, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2 font-semibold text-slate-800"><FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />{doc.name}</td>
                <td className="px-4 py-3 text-slate-600">{doc.type}</td>
                <td className="px-4 py-3 font-mono text-blue-600">{doc.transaction}</td>
                <td className="px-4 py-3 text-slate-500">{doc.date}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">{doc.status}</span></td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-blue-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> View</button>
                  <button className="text-slate-500 hover:text-slate-700 flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerCompanyUsers ───────────────────────────────────────────────────

const DEMO_USERS = [
  { name: 'Demo User A', email: 'buyer@democompany-a.example', role: 'Procurement Manager', status: 'Active', joined: '2025-03-01' },
  { name: 'Demo User C', email: 'design@democompany-a.example', role: 'Design Engineer', status: 'Active', joined: '2025-06-15' },
  { name: 'Demo User D', email: 'finance@democompany-a.example', role: 'Finance Approver', status: 'Inactive', joined: '2025-01-10' },
];

export const CustomerCompanyUsers: React.FC = () => {
  const { addToast } = useApp();

  return (
    <CustomerLayout title="Company Users">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{DEMO_USERS.length} team member{DEMO_USERS.length !== 1 ? 's' : ''}</p>
        <button onClick={() => addToast('Invite Sent', 'User invitation feature coming in v2.', 'info')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Invite User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {DEMO_USERS.map((u, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{u.joined}</td>
                <td className="px-4 py-3">
                  <button onClick={() => addToast('Role Changed', 'Role management coming in v2.', 'info')} className="text-blue-600 hover:underline text-[11px]">Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerSettings ───────────────────────────────────────────────────────

export const CustomerSettings: React.FC = () => {
  const { addToast } = useApp();

  return (
    <CustomerLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 mb-4">Profile Information</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[['Full Name', 'Demo User A'], ['Company', 'Demo Company A (IoT & Telematics)'], ['Email', 'buyer@democompany-a.example'], ['Phone', '+91 90000 00001'], ['City', 'Bangalore'], ['GST Number', 'XXAAAAA0000X1ZX']].map(([l, v]) => (
              <div key={l}>
                <label className="block text-xs text-slate-500 mb-1">{l}</label>
                <input defaultValue={v} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
          <button onClick={() => addToast('Saved', 'Profile updated (demo — no changes persisted).', 'success')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500">Save Changes</button>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {['New quotation received', 'RFQ status update', 'Order shipment update', 'Part alert triggered', 'Quote expiry reminder'].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{item}</span>
                <div className="flex gap-2">
                  {['Email', 'Portal', 'WhatsApp'].map(ch => (
                    <label key={ch} className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" defaultChecked={ch !== 'WhatsApp'} className="rounded" />
                      <span className="text-xs text-slate-500">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 mb-4">Security</h3>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="text-sm font-semibold text-slate-800">Password</div>
              <div className="text-xs text-slate-500">Last changed 60 days ago</div>
            </div>
            <button onClick={() => addToast('Email Sent', 'Password reset link sent to your email.', 'info')} className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white">Change</button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

// ─── CustomerNotifications ──────────────────────────────────────────────────

const DEMO_NOTIFICATIONS = [
  { id: 'n1', type: 'quotation', title: 'Quotation Q-2026-0914 received', body: 'Your quotation for RFQ-2026-0841 is ready for review. Valid until 20 Sep 2026.', time: '2h ago', read: false },
  { id: 'n2', type: 'rfq', title: 'RFQ-2026-0841: Supplier Matching Complete', body: '4 suppliers matched. Vendor RFQs dispatched automatically.', time: '6h ago', read: false },
  { id: 'n3', type: 'order', title: 'Order ORD-2026-1001 QC Passed', body: 'Quality check passed at Bangalore hub. Ready for dispatch.', time: '1d ago', read: true },
  { id: 'n4', type: 'alert', title: 'Part Alert: LM358DR Stock Update', body: 'New stock of 45,000 pcs added by a verified supplier in Bangalore.', time: '2d ago', read: true },
];

export const CustomerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const unread = notifications.filter(n => !n.read).length;

  return (
    <CustomerLayout title="Notifications">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{unread} unread</p>
        <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
      </div>

      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} onClick={() => setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className={`bg-white border rounded-xl p-4 cursor-pointer transition-colors ${n.read ? 'border-slate-200' : 'border-blue-300 bg-blue-50/30'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{n.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CustomerLayout>
  );
};
