import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  UploadCloud,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';

export const ExcessInventoryPage: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Valuation Request Logged', 'Our surplus procurement team will generate an indicative valuation within 24 hours.', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
            OEM & EMS Asset Recovery
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-3">
            Monetize Your Excess Electronic Inventory
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Turn surplus components, project cancellation stock, and slow-moving reels into working capital. Connect with thousands of verified Indian OEMs through our confidential liquidation desk.
          </p>
        </div>

        {/* 4 Inventory Situations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-blue-600 font-mono font-bold text-xs uppercase mb-1">Surplus Inventory</div>
            <p className="text-[11px] text-slate-500">Over-ordered line items from high-volume runs</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-indigo-600 font-mono font-bold text-xs uppercase mb-1">Project Cancellations</div>
            <p className="text-[11px] text-slate-500">Factory-sealed reels from discontinued revisions</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-amber-600 font-mono font-bold text-xs uppercase mb-1">Slow-Moving Lots</div>
            <p className="text-[11px] text-slate-500">Stock tied up in warehouse bins over 180 days</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-emerald-600 font-mono font-bold text-xs uppercase mb-1">Obsolete / Last-Time Buy</div>
            <p className="text-[11px] text-slate-500">Components with active legacy market demand</p>
          </div>
        </div>

        {/* Valuation & Upload Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Request Excess Inventory Valuation</h2>
          <p className="text-xs text-slate-600 mb-6">
            Upload your surplus spreadsheet. You may list items under strict confidentiality or as an anonymous Tier-1 EMS partner.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-sm">Surplus List Submitted for Analysis</div>
              <p className="mt-1 text-emerald-700">
                Our materials team will evaluate current Indian spot market demand and deliver a lot-level valuation proposal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat EMS Technologies Ltd"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">GSTIN (Optional for Valuation)</label>
                  <input
                    type="text"
                    placeholder="29AAABC1234F1Z5"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@company.in"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estimated Inventory Book Value (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,00,000"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Privacy & Listing Preference</label>
                <select className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white">
                  <option value="anon">Anonymous Listing (Marketed as "Verified Tier-1 EMS Partner - India")</option>
                  <option value="public">Public Company Name on Approved Quotations</option>
                  <option value="private">Private Direct Sale Only to OEMInventory Desk</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
                <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-800">Upload Excess Excel (.xlsx or .csv)</div>
                <div className="text-[11px] text-slate-400 mt-1">Columns: MPN, Manufacturer, Qty, Date Code, Package, Target Price</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
              >
                Submit Excess List for Confidential Valuation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
