import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
