import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { QcStatusBadge } from '../common/Badge';
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
              Logged in: Vikram Malhotra (Procurement & QC Lead) • Pan-India Logistics
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
