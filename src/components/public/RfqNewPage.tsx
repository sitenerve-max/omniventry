import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  Upload,
  ArrowRight,
  Info,
} from 'lucide-react';
import { RfqLineItem } from '../../types';

export const RfqNewPage: React.FC = () => {
  const { draftRfqItems, addPartToDraftRfq, removeDraftRfqItem, submitNewRfq, navigateTo } = useApp();

  const [companyName, setCompanyName] = useState('Bharat IoT & Telematics Pvt Ltd');
  const [customerName, setCustomerName] = useState('Priya Sharma (Procurement Head)');
  const [email, setEmail] = useState('priya.s@bharatiot.co.in');
  const [phone, setPhone] = useState('+91 98450 11223');
  const [deliveryLocation, setDeliveryLocation] = useState('Electronic City, Bangalore, Karnataka - 560100');
  const [requiredDate, setRequiredDate] = useState('2026-09-25');
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net on Approved Credit');
  const [remarks, setRemarks] = useState('EV Telematics production batch. Date code 23+ in original sealed reels only.');

  // Manual line item add state
  const [newMpn, setNewMpn] = useState('');
  const [newMfg, setNewMfg] = useState('');
  const [newQty, setNewQty] = useState('1000');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRfqNumber, setSubmittedRfqNumber] = useState('');

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMpn.trim()) return;
    addPartToDraftRfq({
      mpn: newMpn.trim().toUpperCase(),
      manufacturer: newMfg.trim() || 'Specified in BOM',
      requiredQuantity: parseInt(newQty) || 1000,
    });
    setNewMpn('');
    setNewMfg('');
    setNewQty('1000');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftRfqItems.length === 0) return;
    const newId = submitNewRfq({
      companyName,
      customerName,
      email,
      phone,
      deliveryLocation,
      requiredDate,
      paymentTerms,
      remarks,
    });
    setSubmittedRfqNumber('RFQ-2026-0841');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-xl mx-auto px-4 text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            RFQ Logged Successfully
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-1">Request for Quotation Registered</h2>
          <p className="text-xs text-slate-500 mb-6">
            Reference Identifier: <strong className="font-mono text-slate-800">{submittedRfqNumber}</strong>
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Destination Hub:</span>
              <span className="font-medium text-slate-900">{deliveryLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Required By:</span>
              <span className="font-medium text-slate-900">{requiredDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Matching Status:</span>
              <span className="text-blue-600 font-semibold">Broadcasting to Verified Domestic Stockists</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigateTo('/customer/rfqs/rfq-101', { id: 'rfq-101' })}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              Track RFQ in Customer Portal
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                navigateTo('/search');
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Search More Components
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Procurement Desk</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Create Custom RFQ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Request for Quotation (RFQ)</h1>
          <p className="text-xs text-slate-600 mt-1">
            Send structured electronic component requirements to verified Indian franchised distributors and stocking partners.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company & Delivery Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              Company & Delivery Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Contact Name & Title *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Delivery Destination / Warehouse Address *</label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Delivery Date</label>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Desired Credit & Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                >
                  <option value="30 Days Net on Approved Credit">30 Days Net on Approved Credit</option>
                  <option value="45 Days Net">45 Days Net</option>
                  <option value="Advance Payment Against PI">Advance Payment Against PI</option>
                  <option value="Letter of Credit (LC)">Letter of Credit (LC)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">General Production Notes</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Factory sealed packaging only, no loose tubes"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Line Items Builder */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
                  Line Items ({draftRfqItems.length})
                </h3>
                <p className="text-xs text-slate-500">Provide exact part numbers, desired quantities, and target prices</p>
              </div>
            </div>

            {/* Existing Draft Items Table */}
            {draftRfqItems.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">MPN</th>
                      <th className="py-2.5 px-3">Manufacturer</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Target Price (₹)</th>
                      <th className="py-2.5 px-3">Packaging Requirement</th>
                      <th className="py-2.5 px-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {draftRfqItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.mpn}</td>
                        <td className="py-3 px-3 text-slate-600">{item.manufacturer}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                          {item.requiredQuantity?.toLocaleString()} pcs
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {item.targetPriceInr ? `₹${item.targetPriceInr.toFixed(2)}` : 'Open'}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{item.packagingRequirement || 'Factory Standard'}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeDraftRfqItem(item.mpn || '')}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 mb-6">
                No items added yet. Add a component below or upload an Excel BOM.
              </div>
            )}

            {/* Quick Add Form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block mb-2">+ Add Individual Component Line Item</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="MPN (e.g. TPS54360D)"
                  value={newMpn}
                  onChange={(e) => setNewMpn(e.target.value)}
                  className="p-2 border border-slate-300 rounded bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Manufacturer (e.g. TI)"
                  value={newMfg}
                  onChange={(e) => setNewMfg(e.target.value)}
                  className="p-2 border border-slate-300 rounded bg-white"
                />
                <input
                  type="number"
                  placeholder="Required Qty"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="p-2 border border-slate-300 rounded bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddManualItem}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Part
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Target prices are kept confidential and used solely for algorithmic matching evaluation.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => navigateTo('/search')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Continue Search
              </button>
              <button
                type="submit"
                disabled={draftRfqItems.length === 0}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs flex items-center gap-2 transition-all ${
                  draftRfqItems.length === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                Submit RFQ to Indian Network <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
