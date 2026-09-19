import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { useApiData } from '../../lib/useApiData';
import { ConfidenceBadge, SupplierScoreBadge } from '../common/Badge';
import {
  Boxes,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Clock,
  Send,
  AlertCircle,
  Building,
  DollarSign,
  Layers,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  Truck,
  FileText,
  Settings,
  Bell,
  BarChart3,
  X,
  Menu,
  LogOut,
  Plus,
  Eye,
  MapPin,
  Download,
} from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">Authorized Stockist Portal</div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Apex Microelectronics Pvt Ltd</h1>
            <p className="text-xs text-slate-600 mt-0.5">Contact: Rajesh Kumar • Peenya Industrial Hub, Bangalore</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/supplier/inventory/upload')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" /> + Upload Stock Spreadsheet
            </button>
          </div>
        </div>

        {/* 4 Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => navigateTo('/supplier/inventory')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Active Stock Lines</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">12,450</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Inward Audit Passed</div>
          </div>

          <div
            onClick={() => navigateTo('/supplier/rfqs')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Open Buyer RFQs</div>
            <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">4</div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">2 Urgent (High Intent)</div>
          </div>

          <div
            onClick={() => navigateTo('/supplier/performance')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Quality & Delivery Score</div>
            <div className="text-2xl font-extrabold font-mono text-indigo-600 mt-1">98.4 / 100</div>
            <div className="text-[11px] text-indigo-700 font-semibold mt-1">Tier-1 Preferred Vendor</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-medium">Pending Payouts (INR)</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">₹4,25,000</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Settlement on Schedule</div>
          </div>
        </div>

        {/* Open Buyer RFQs Awaiting Response */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              High-Intent Buyer RFQs Matched to Your Stock
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">RFQ-2026-0841</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                    Response Needed (Due in 4h)
                  </span>
                </div>
                <div className="text-slate-600 mt-1">
                  Requested: <strong className="font-mono text-slate-900">LM358DR</strong> (10,000 pcs) • TI • SOIC-8
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Buyer: Tier-1 Automotive & Telematics EMS • Destination: Bangalore
                </div>
              </div>

              <button
                onClick={() => navigateTo('/supplier/rfqs')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-xs whitespace-nowrap"
              >
                Submit Quote
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">RFQ-2026-0842</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                    Normal Priority
                  </span>
                </div>
                <div className="text-slate-600 mt-1">
                  Requested: <strong className="font-mono text-slate-900">STM32F103C8T6</strong> (2,500 pcs) • ST • LQFP-48
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Buyer: Industrial IoT Manufacturer • Destination: Pune
                </div>
              </div>

              <button
                onClick={() => navigateTo('/supplier/rfqs')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-xs whitespace-nowrap"
              >
                Submit Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SupplierInventoryUpload: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [step, setStep] = useState<number>(1);
  const [uploadedFileName, setUploadedFileName] = useState<string>('Apex_Stock_Peenya_Sept2026.xlsx');

  const handleFinish = () => {
    addToast('Inventory Ingested', '1,240 line items processed and added to active search index.', 'success');
    navigateTo('/supplier/inventory');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Supplier Desk</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Bulk Inventory Upload</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock List Ingestion & Indexing</h1>
          <p className="text-xs text-slate-600 mt-1">
            Upload Excel or CSV files. Automatically map MPN, brand, package, quantity, date code, and warehouse location.
          </p>
        </div>

        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 bg-slate-50">
              <UploadCloud className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Upload Component Inventory Spreadsheet</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto mt-1">
                Drag and drop your weekly stock dump (.xlsx, .csv).
              </p>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Select File & Proceed to Column Mapping
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Step 2: Map Inventory Columns</h3>
            <p className="text-xs text-slate-500 mb-6">File: {uploadedFileName}</p>

            <div className="space-y-3 text-xs mb-6">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 items-center">
                <span className="font-semibold text-slate-800">Part Number (MPN) *</span>
                <span className="font-mono text-blue-600 font-medium">Mapped to Column A: "ITEM_CODE"</span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 items-center">
                <span className="font-semibold text-slate-800">Available Stock Qty *</span>
                <span className="font-mono text-blue-600 font-medium">Mapped to Column D: "AVAILABLE_PCS"</span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 items-center">
                <span className="font-semibold text-slate-800">Date Code (DC)</span>
                <span className="font-mono text-blue-600 font-medium">Mapped to Column E: "LOT_DC"</span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 items-center">
                <span className="font-semibold text-slate-800">Minimum Order Qty (MOQ)</span>
                <span className="font-mono text-blue-600 font-medium">Mapped to Column F: "MOQ"</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button onClick={() => setStep(1)} className="text-xs text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Process & Activate 1,240 Stock Records
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SupplierRfqs: React.FC = () => {
  const { addToast } = useApp();
  const [quotedPrice, setQuotedPrice] = useState('11.80');
  const [leadTime, setLeadTime] = useState('Immediate / Ready Stock');

  const handleSendQuote = () => {
    addToast('Quotation Dispatched', 'Buyer RFQ updated with your landed unit price of ₹' + quotedPrice, 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Incoming Buyer RFQ Quotation Desk</h1>
        <p className="text-xs text-slate-600 mb-6">Respond with your best net unit price in Indian Rupees (INR).</p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-slate-900">RFQ-2026-0841</span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">LM358DR • Texas Instruments • SOIC-8</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Awaiting Quotation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Requested Volume</span>
              <span className="font-mono font-bold text-base text-slate-900">10,000 pcs</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Required Delivery</span>
              <span className="font-mono font-bold text-base text-slate-900">Before Sept 25, 2026</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Buyer Location</span>
              <span className="font-medium text-slate-900">Electronic City, Bangalore</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">Your Net Quote Submission</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Net Unit Price (INR ₹ Excl. GST) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Dispatch Lead Time</label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleSendQuote}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-xs"
            >
              Submit Official Quotation to Buyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SupplierPerformance: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Supplier Performance & Scorecard</h1>
        <p className="text-xs text-slate-600 mb-6">
          Audited metrics determining your inventory search ranking and buyer confidence badges.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-lg font-bold text-slate-900">Overall Trust Score: 98.4 / 100</div>
              <span className="text-emerald-700 font-semibold">Tier-1 Elite Indian Stockist</span>
            </div>
            <SupplierScoreBadge score={98} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">RFQ Response Turnaround</span>
              <span className="text-lg font-bold font-mono text-slate-900">1.8 Hours (Top 5%)</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">On-Time Dispatch Rate</span>
              <span className="text-lg font-bold font-mono text-slate-900">99.1%</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Quality Lab Rejection Rate</span>
              <span className="text-lg font-bold font-mono text-emerald-700">0.00% (Zero Counterfeits)</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Stock Accuracy Verification</span>
              <span className="text-lg font-bold font-mono text-slate-900">99.6% Physical Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SupplierLayout ─────────────────────────────────────────────────────────

const SUPPLIER_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/supplier/dashboard' },
  { label: 'Inventory', icon: Boxes, route: '/supplier/inventory' },
  { label: 'Upload Stock', icon: UploadCloud, route: '/supplier/inventory/upload' },
  { label: 'Lots', icon: Layers, route: '/supplier/lots' },
  { label: 'RFQ Desk', icon: FileSpreadsheet, route: '/supplier/rfqs' },
  { label: 'My Quotations', icon: ClipboardList, route: '/supplier/quotations' },
  { label: 'Orders', icon: Truck, route: '/supplier/orders' },
  { label: 'Documents', icon: FileText, route: '/supplier/documents' },
  { label: 'Analytics', icon: BarChart3, route: '/supplier/analytics' },
  { label: 'Profile', icon: Building, route: '/supplier/profile' },
  { label: 'Settings', icon: Settings, route: '/supplier/settings' },
  { label: 'Notifications', icon: Bell, route: '/supplier/notifications' },
];

interface SupplierLayoutProps { children: React.ReactNode; title: string; }

const SupplierLayout: React.FC<SupplierLayoutProps> = ({ children, title }) => {
  const { currentRoute, navigateTo } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-slate-900 text-white z-40 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:flex lg:z-auto`}>
        <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Supplier Portal</div>
            <div className="text-sm font-bold text-white mt-0.5">Apex Microelectronics</div>
            <div className="text-[10px] text-slate-400">Peenya Hub, Bangalore</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mx-3 mt-3 px-2 py-1 rounded bg-amber-900/40 border border-amber-700/50 text-amber-300 text-[10px] font-mono text-center">
          ⚠ Demo Environment
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {SUPPLIER_NAV.map(item => {
            const active = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
            return (
              <button key={item.route} onClick={() => { navigateTo(item.route); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors ${active ? 'bg-emerald-700/30 text-emerald-300 border-r-2 border-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <item.icon className="w-4 h-4 shrink-0" />
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
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('/supplier/notifications')} className="relative p-1.5 rounded-lg hover:bg-slate-100">
              <Bell className="w-4 h-4 text-slate-500" />
            </button>
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">S</div>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── SupplierInventoryList ──────────────────────────────────────────────────

const MOCK_SUPPLIER_INVENTORY = [
  { id: 'inv-1', mpn: 'LM358DR', manufacturer: 'Texas Instruments', qty: 45000, moq: 2500, dateCode: '2418+', pkg: 'Tape & Reel', condition: 'New & Original', location: 'Bangalore', confidence: 'Verified Stock', rohs: true, status: 'Active' },
  { id: 'inv-2', mpn: 'STM32F103C8T6', manufacturer: 'STMicroelectronics', qty: 1200, moq: 100, dateCode: '2345+', pkg: 'Tray', condition: 'New & Original', location: 'Bangalore', confidence: 'Verified Stock', rohs: true, status: 'Active' },
  { id: 'inv-3', mpn: 'TPS54360D', manufacturer: 'Texas Instruments', qty: 8000, moq: 500, dateCode: '2401+', pkg: 'Tape & Reel', condition: 'Factory Sealed', location: 'Bangalore', confidence: 'Verified Stock', rohs: true, status: 'Active' },
  { id: 'inv-4', mpn: 'MUR460', manufacturer: 'ON Semiconductor', qty: 20000, moq: 1000, dateCode: '2218+', pkg: 'Bulk', condition: 'Excess Stock', location: 'Pune', confidence: 'Supplier Reported', rohs: false, status: 'Active' },
  { id: 'inv-5', mpn: 'ESP32-WROOM-32E', manufacturer: 'Espressif Systems', qty: 500, moq: 50, dateCode: '2322+', pkg: 'Tray', condition: 'New & Original', location: 'Bangalore', confidence: 'Verification Required', rohs: true, status: 'Pending Verification' },
];

export const SupplierInventoryList: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? MOCK_SUPPLIER_INVENTORY : MOCK_SUPPLIER_INVENTORY.filter(i => i.status === filter || i.confidence === filter);

  return (
    <SupplierLayout title="My Inventory">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="text-sm text-slate-500">{filtered.length} stock line{filtered.length !== 1 ? 's' : ''}</div>
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="all">All Lines</option>
            <option value="Active">Active</option>
            <option value="Verified Stock">Verified Stock</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>
          <button onClick={() => navigateTo('/supplier/inventory/upload')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5" /> Upload Stock
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-200">
              {['MPN', 'Manufacturer', 'Qty Available', 'MOQ', 'Date Code', 'Package', 'Condition', 'Location', 'Confidence', 'RoHS', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="text-center py-12 text-slate-400">
                  <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium">No inventory lines found</p>
                  <p className="text-[11px] mt-1">Upload your stock list to get started.</p>
                </td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">{item.mpn}</td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{item.manufacturer}</td>
                  <td className="px-3 py-3 font-mono font-bold text-slate-900">{item.qty.toLocaleString()}</td>
                  <td className="px-3 py-3 font-mono text-slate-600">{item.moq.toLocaleString()}</td>
                  <td className="px-3 py-3 font-mono text-slate-500">{item.dateCode}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{item.pkg}</td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{item.condition}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{item.location}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      item.confidence === 'Verified Stock' ? 'bg-emerald-100 text-emerald-800' :
                      item.confidence === 'Verification Required' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>{item.confidence}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.rohs ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.rohs ? 'RoHS' : 'Non-RoHS'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 flex gap-1">
                    <button onClick={() => navigateTo(`/supplier/inventory/${item.id}`)} className="px-2 py-1 border border-slate-300 text-slate-600 rounded text-[10px] hover:bg-slate-50 flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" /> View
                    </button>
                    <button onClick={() => addToast('Edit Coming Soon', 'Inline editing will be available in v2.', 'info')} className="px-2 py-1 border border-blue-300 text-blue-600 rounded text-[10px] hover:bg-blue-50">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span><strong>Demo Data:</strong> Inventory lines shown are representative mock data. In production, this reflects your actual uploaded stock.</span>
      </div>
    </SupplierLayout>
  );
};

// ─── SupplierInventoryDetail ────────────────────────────────────────────────

export const SupplierInventoryDetail: React.FC = () => {
  const { navigateTo } = useApp();
  const item = MOCK_SUPPLIER_INVENTORY[0];
  return (
    <SupplierLayout title={`Inventory — ${item.mpn}`}>
      <button onClick={() => navigateTo('/supplier/inventory')} className="text-emerald-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Inventory</button>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono font-bold text-xl text-slate-900">{item.mpn}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{item.confidence}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[['Manufacturer', item.manufacturer], ['Qty Available', item.qty.toLocaleString()], ['MOQ', item.moq.toLocaleString()], ['Date Code', item.dateCode], ['Package', item.pkg], ['Condition', item.condition], ['Location', item.location], ['RoHS', item.rohs ? 'Yes' : 'No']].map(([k, v]) => (
            <div key={k} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500">{k}</div>
              <div className="font-semibold text-slate-900 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </SupplierLayout>
  );
};

// ─── Supplier Stub Pages ─────────────────────────────────────────────────────

const SupplierStub: React.FC<{ title: string; icon: React.ReactNode; description: string; version?: string }> = ({ title, icon, description, version = 'v2' }) => (
  <SupplierLayout title={title}>
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">{icon}</div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Coming Soon — {version}</span>
    </div>
  </SupplierLayout>
);

export const SupplierOnboarding: React.FC = () => (
  <SupplierStub title="Supplier Onboarding" icon={<Building className="w-8 h-8" />} description="Complete your supplier profile, upload certificates, and get verified to start receiving RFQs." version="v1.1" />
);

export const SupplierKYC: React.FC = () => (
  <SupplierStub title="KYC Verification" icon={<CheckCircle2 className="w-8 h-8" />} description="Submit GST certificate, bank details, and trade documents for KYC approval." version="v1.1" />
);

export const SupplierLots: React.FC = () => (
  <SupplierStub title="My Lots" icon={<Layers className="w-8 h-8" />} description="View all inventory lots with expiry tracking, reservation status, and lot-level analytics." version="v2" />
);

interface SupplierRfqItem { id: string; mpn: string; manufacturer: string; requiredQuantity: number; packagingRequirement: string | null; dateCodeRequirement: string | null }
interface SupplierQuoteRow { id: string; status: string; createdAt: string; items: { id: string; mpn: string; availableQuantity: number; unitPrice: string; leadTime: string }[] }
interface SupplierVendorRfq {
  id: string; status: string; sentAt: string;
  rfq: { id: string; rfqNumber: string; deliveryLocation: string; requiredDate: string | null; items: SupplierRfqItem[] };
  quotes: SupplierQuoteRow[];
}
interface LineDraft { include: boolean; availableQuantity: string; unitPrice: string; moq: string; dateCode: string; packaging: string; leadTime: string; condition: string; countryOfOrigin: string }

const newLineDraft = (item: SupplierRfqItem): LineDraft => ({
  include: true,
  availableQuantity: String(item.requiredQuantity),
  unitPrice: '',
  moq: '1',
  dateCode: item.dateCodeRequirement ?? '',
  packaging: item.packagingRequirement ?? 'Tape & Reel',
  leadTime: 'Same Day Dispatch',
  condition: 'New & Original',
  countryOfOrigin: 'India',
});

const humanizeStatus = (s: string): string => s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const VendorRfqCard: React.FC<{ vendorRfq: SupplierVendorRfq; onChanged: () => void }> = ({ vendorRfq, onChanged }) => {
  const { addToast } = useApp();
  const [drafts, setDrafts] = useState<Record<string, LineDraft>>(() =>
    Object.fromEntries(vendorRfq.rfq.items.map((item) => [item.id, newLineDraft(item)])),
  );
  const [busy, setBusy] = useState(false);
  const open = vendorRfq.status === 'SENT';

  const patch = (itemId: string, change: Partial<LineDraft>) =>
    setDrafts((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...change } }));

  const buildItems = () =>
    vendorRfq.rfq.items
      .filter((item) => drafts[item.id].include)
      .map((item) => {
        const d = drafts[item.id];
        return {
          rfqItemId: item.id,
          mpn: item.mpn,
          availableQuantity: parseInt(d.availableQuantity, 10),
          unitPrice: parseFloat(d.unitPrice),
          moq: parseInt(d.moq, 10),
          dateCode: d.dateCode,
          packaging: d.packaging,
          leadTime: d.leadTime,
          condition: d.condition,
          countryOfOrigin: d.countryOfOrigin || undefined,
        };
      });

  const submit = async (kind: 'quote' | 'partial-supply' | 'cannot-supply') => {
    setBusy(true);
    try {
      if (kind === 'cannot-supply') {
        await api.post(`/api/supplier/vendor-rfqs/${vendorRfq.id}/cannot-supply`, {});
      } else {
        const items = buildItems();
        if (items.length === 0 || items.some((i) => !(i.unitPrice > 0) || !(i.availableQuantity > 0) || !(i.moq > 0) || !i.dateCode || !i.packaging || !i.leadTime)) {
          addToast('Incomplete Quote', 'Fill unit price, quantity, MOQ, date code, packaging and lead time for every included line.', 'warning');
          return;
        }
        await api.post(`/api/supplier/vendor-rfqs/${vendorRfq.id}/${kind}`, { items });
      }
      addToast('Response Saved', 'Your response was recorded in the database.', 'success');
      onChanged();
    } catch (err) {
      addToast('Submission Failed', err instanceof Error ? err.message : 'Request failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const field = 'w-full p-1.5 border border-slate-300 rounded bg-white text-xs';
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-5">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <span className="font-mono font-bold text-sm text-slate-900">{vendorRfq.rfq.rfqNumber}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">{humanizeStatus(vendorRfq.status)}</span>
      </div>
      <p className="text-[11px] text-slate-500 mb-4">
        Deliver to {vendorRfq.rfq.deliveryLocation}
        {vendorRfq.rfq.requiredDate ? ` • needed by ${new Date(vendorRfq.rfq.requiredDate).toLocaleDateString()}` : ''}
      </p>

      {open && (
        <div className="space-y-3 mb-4">
          {vendorRfq.rfq.items.map((item) => {
            const d = drafts[item.id];
            return (
              <div key={item.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
                <label className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                  <input type="checkbox" checked={d.include} onChange={(e) => patch(item.id, { include: e.target.checked })} />
                  <span className="font-mono">{item.mpn}</span>
                  <span className="text-slate-500 font-normal">{item.manufacturer} • required {item.requiredQuantity.toLocaleString()} pcs</span>
                </label>
                {d.include && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div><span className="text-slate-500">Available Qty</span><input className={field} type="number" value={d.availableQuantity} onChange={(e) => patch(item.id, { availableQuantity: e.target.value })} /></div>
                    <div><span className="text-slate-500">Unit Price (INR)</span><input className={field} type="number" step="0.01" value={d.unitPrice} onChange={(e) => patch(item.id, { unitPrice: e.target.value })} /></div>
                    <div><span className="text-slate-500">MOQ</span><input className={field} type="number" value={d.moq} onChange={(e) => patch(item.id, { moq: e.target.value })} /></div>
                    <div><span className="text-slate-500">Date Code</span><input className={field} value={d.dateCode} onChange={(e) => patch(item.id, { dateCode: e.target.value })} /></div>
                    <div><span className="text-slate-500">Packaging</span><input className={field} value={d.packaging} onChange={(e) => patch(item.id, { packaging: e.target.value })} /></div>
                    <div><span className="text-slate-500">Lead Time</span><input className={field} value={d.leadTime} onChange={(e) => patch(item.id, { leadTime: e.target.value })} /></div>
                    <div><span className="text-slate-500">Condition</span><input className={field} value={d.condition} onChange={(e) => patch(item.id, { condition: e.target.value })} /></div>
                    <div><span className="text-slate-500">Country of Origin</span><input className={field} value={d.countryOfOrigin} onChange={(e) => patch(item.id, { countryOfOrigin: e.target.value })} /></div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex flex-wrap gap-2">
            <button disabled={busy} onClick={() => submit('quote')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold">Submit Quote</button>
            <button disabled={busy} onClick={() => submit('partial-supply')} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold">Submit Partial Supply</button>
            <button disabled={busy} onClick={() => submit('cannot-supply')} className="px-4 py-2 border border-rose-400 text-rose-700 hover:bg-rose-50 disabled:opacity-50 rounded-lg text-xs font-bold">Cannot Supply</button>
          </div>
        </div>
      )}

      {vendorRfq.quotes.length > 0 && (
        <div className="border-t border-slate-100 pt-3 text-xs">
          <h4 className="font-bold text-slate-800 mb-2">Your submitted responses</h4>
          {vendorRfq.quotes.map((q) => (
            <div key={q.id} className="mb-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-800">{humanizeStatus(q.status)} <span className="text-slate-400 font-normal">• {new Date(q.createdAt).toLocaleString()}</span></div>
              {q.items.map((i) => (
                <div key={i.id} className="text-slate-600 font-mono">{i.mpn}: {i.availableQuantity.toLocaleString()} pcs @ ₹{Number(i.unitPrice).toFixed(2)} • {i.leadTime}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SupplierQuotations: React.FC = () => {
  const { authUser, authLoading, navigateTo } = useApp();
  const canUse = !!authUser?.supplierId;
  const { data, loading, error, reload } = useApiData<SupplierVendorRfq[]>(canUse ? '/api/supplier/vendor-rfqs' : null);

  return (
    <SupplierLayout title="My Quotations">
      {authLoading ? (
        <p className="text-sm text-slate-500">Checking session…</p>
      ) : !canUse ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto">
          <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-800">Supplier sign-in required</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Sign in with a supplier account to see the vendor RFQs assigned to you.</p>
          <button onClick={() => navigateTo('/auth/login')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold">Go to Sign In</button>
        </div>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading your vendor RFQs…</p>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-center justify-between gap-3">
          <span>Could not load vendor RFQs: {error}</span>
          <button onClick={reload} className="px-3 py-1.5 bg-rose-600 text-white rounded font-semibold">Retry</button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-[10px] font-mono uppercase tracking-wider text-emerald-700">Live data — persisted in PostgreSQL via backend API</div>
          {(data ?? []).length === 0 && <p className="text-sm text-slate-400">No vendor RFQs have been assigned to you yet.</p>}
          {(data ?? []).map((v) => <VendorRfqCard key={v.id} vendorRfq={v} onChanged={reload} />)}
        </>
      )}
    </SupplierLayout>
  );
};

export const SupplierOrders: React.FC = () => (
  <SupplierStub title="My Orders" icon={<Truck className="w-8 h-8" />} description="Track confirmed purchase orders, dispatch status, and payment settlements from OEMInventory." version="v2" />
);

export const SupplierDocuments: React.FC = () => (
  <SupplierStub title="Documents" icon={<FileText className="w-8 h-8" />} description="Manage trade certificates, test reports, datasheets, and compliance documents." version="v2" />
);

export const SupplierAnalytics: React.FC = () => (
  <SupplierStub title="Analytics" icon={<BarChart3 className="w-8 h-8" />} description="View RFQ match rates, quotation win rates, inventory turnover, and revenue trends." version="v2" />
);

export const SupplierProfile: React.FC = () => (
  <SupplierStub title="Company Profile" icon={<Building className="w-8 h-8" />} description="Update your company information, capabilities, certifications, and contact details." version="v1.1" />
);

export const SupplierSettings: React.FC = () => (
  <SupplierStub title="Settings" icon={<Settings className="w-8 h-8" />} description="Configure notification preferences, quote templates, and account settings." version="v2" />
);

export const SupplierNotifications: React.FC = () => (
  <SupplierStub title="Notifications" icon={<Bell className="w-8 h-8" />} description="View RFQ alerts, order updates, payment notifications, and system messages." version="v2" />
);

export const SupplierInventoryMapping: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <SupplierLayout title="Column Mapping">
      <button onClick={() => navigateTo('/supplier/inventory/upload')} className="text-emerald-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Upload</button>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-center">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">Column mapping is part of the upload flow.</p>
        <p className="text-xs text-slate-500 mt-1">Start a new upload to access the column mapping step.</p>
        <button onClick={() => navigateTo('/supplier/inventory/upload')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500">
          Start Upload
        </button>
      </div>
    </SupplierLayout>
  );
};

export const SupplierInventoryPreview: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <SupplierLayout title="Import Preview">
      <button onClick={() => navigateTo('/supplier/inventory/upload')} className="text-emerald-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Upload</button>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-center">
        <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">No active import in progress.</p>
        <p className="text-xs text-slate-500 mt-1">Upload a file first to see the import preview.</p>
        <button onClick={() => navigateTo('/supplier/inventory/upload')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500">
          Start Upload
        </button>
      </div>
    </SupplierLayout>
  );
};
