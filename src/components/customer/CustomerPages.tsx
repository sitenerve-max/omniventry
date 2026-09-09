import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RfqStatusBadge, OrderStatusBadge, QcStatusBadge } from '../common/Badge';
import {
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Download,
  MessageSquare,
  DollarSign,
  Package,
  Layers,
  Send,
  Building,
  RefreshCw,
  Eye,
  FileText,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { rfqs, quotations, orders, navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">Customer Procurement Hub</div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bharat IoT & Telematics Pvt Ltd</h1>
            <p className="text-xs text-slate-600 mt-0.5">Procurement Manager: Priya Sharma • Bangalore Hub</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/bom/upload')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Upload New BOM
            </button>
            <button
              onClick={() => navigateTo('/rfq/new')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              + Create Custom RFQ
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => navigateTo('/customer/rfqs')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Active RFQs</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">{rfqs.length}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">2 In Sourcing Review</div>
          </div>

          <div
            onClick={() => navigateTo('/customer/quotations')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Quotations Received</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">{quotations.length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">1 Action Required</div>
          </div>

          <div
            onClick={() => navigateTo('/customer/orders')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="text-slate-500 text-xs font-medium">Orders in Transit</div>
            <div className="text-2xl font-extrabold font-mono text-indigo-600 mt-1">{orders.length}</div>
            <div className="text-[11px] text-indigo-700 font-semibold mt-1">QC Passed Bangalore Hub</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-medium">Approved Credit Line</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">₹50,00,000</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">30 Days Net Terms Active</div>
          </div>
        </div>

        {/* Two-Column Section: Active Quotations & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Quotations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Pending Quotations ({quotations.length})
              </h3>
              <button
                onClick={() => navigateTo('/customer/quotations')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {quotations.map((q) => (
                <div
                  key={q.id}
                  onClick={() => navigateTo(`/customer/quotations/${q.id}`, { id: q.id })}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-all cursor-pointer bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{q.quotationNumber}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                        {q.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {q.lineItems.length} Components • Valid until {q.validUntil}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-extrabold text-sm text-slate-900">
                      ₹{q.totalAmountInr.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 sm:justify-end">
                      Review & Negotiate <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders & Shipments */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Orders & Shipments ({orders.length})
              </h3>
              <button
                onClick={() => navigateTo('/customer/orders')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigateTo(`/customer/orders/${order.id}`, { id: order.id })}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-all cursor-pointer bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Carrier: {order.shippingCarrier} • Waybill: <span className="font-mono">{order.trackingNumber}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-extrabold text-sm text-slate-900">
                      ₹{order.totalAmountInr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500">Est. Arrival: {order.estimatedDelivery}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomerRfqsList: React.FC = () => {
  const { rfqs, navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Requests for Quotation (RFQs)</h1>
            <p className="text-xs text-slate-600 mt-0.5">Track real-time distributor matching and quotation status</p>
          </div>
          <button
            onClick={() => navigateTo('/rfq/new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            + Create New RFQ
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">RFQ Number</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Components</th>
                  <th className="py-3 px-4">Destination Hub</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rfq.rfqNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600">{rfq.createdAt}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{rfq.requiredDate}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {rfq.lineItems.map((i) => i.mpn).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">{rfq.deliveryLocation}</td>
                    <td className="py-3.5 px-4">
                      <RfqStatusBadge status={rfq.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigateTo(`/customer/rfqs/${rfq.id}`, { id: rfq.id })}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-800 rounded font-medium text-xs border border-slate-200"
                      >
                        View Details
                      </button>
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

export const CustomerRfqDetail: React.FC = () => {
  const { routeParams, rfqs, navigateTo } = useApp();
  const rfq = rfqs.find((r) => r.id === routeParams.id) || rfqs[0];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigateTo('/customer/rfqs')}
              className="text-xs text-slate-500 hover:text-slate-800 mb-2 block"
            >
              ← Back to RFQs
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-slate-900">{rfq.rfqNumber}</h1>
              <RfqStatusBadge status={rfq.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Logged on {rfq.createdAt} • Target Delivery: {rfq.requiredDate}</p>
          </div>
          <button
            onClick={() => navigateTo('/customer/quotations/quot-201', { id: 'quot-201' })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            Check Quotation
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
            Component Line Items Requested
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">MPN</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Required Qty</th>
                  <th className="py-2.5 px-3">Target Price</th>
                  <th className="py-2.5 px-3">Packaging Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rfq.lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.mpn}</td>
                    <td className="py-3 px-3 text-slate-600">{item.manufacturer}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      {item.requiredQuantity.toLocaleString()} pcs
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {item.targetPriceInr ? `₹${item.targetPriceInr.toFixed(2)}` : 'Open Market'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.packagingRequirement || 'Factory Sealed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-xs space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-800 mb-2">Delivery & Commercial Terms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 block">Warehouse Destination:</span>
              <span className="font-medium text-slate-900">{rfq.deliveryLocation}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment / Credit Terms:</span>
              <span className="font-medium text-slate-900">{rfq.paymentTerms}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">Special Engineering Remarks:</span>
              <span className="font-medium text-slate-900">{rfq.remarks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomerQuotationDetail: React.FC = () => {
  const { routeParams, quotations, navigateTo, addToast, respondToQuotation } = useApp();
  const quotation = quotations.find((q) => q.id === routeParams.id) || quotations[0];

  const [counterPrice, setCounterPrice] = useState<string>('12.50');
  const [negotiationNotes, setNegotiationNotes] = useState<string>('');
  const [showCounterModal, setShowCounterModal] = useState<boolean>(false);

  const handleAccept = () => {
    respondToQuotation(quotation.id, 'accept');
    navigateTo('/customer/orders/ord-301', { id: 'ord-301' });
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    respondToQuotation(quotation.id, 'counter', {
      targetPrice: parseFloat(counterPrice),
      notes: negotiationNotes,
    });
    setShowCounterModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigateTo('/customer/dashboard')}
              className="text-xs text-slate-500 hover:text-slate-800 mb-2 block"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-slate-900">{quotation.quotationNumber}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                {quotation.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Validity: until {quotation.validUntil} • Linked RFQ: <strong className="font-mono">{quotation.rfqNumber}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCounterModal(true)}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-xs"
            >
              Request Price Counter / Split
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              Accept & Generate Purchase Order
            </button>
          </div>
        </div>

        {/* Breakdown of Component Line Items */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
            Quoted Line Items (Transparent Landed Unit Pricing)
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-lg mb-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">MPN</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Quoted Qty</th>
                  <th className="py-2.5 px-3">Unit Price (₹)</th>
                  <th className="py-2.5 px-3">GST Rate</th>
                  <th className="py-2.5 px-3">Lead Time</th>
                  <th className="py-2.5 px-3">Date Code</th>
                  <th className="py-2.5 px-3 text-right">Line Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.lineItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.mpn}</td>
                    <td className="py-3 px-3 text-slate-600">{item.manufacturer}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      {item.quotedQuantity.toLocaleString()} pcs
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      ₹{item.unitPriceInr.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.gstPercentage}%</td>
                    <td className="py-3 px-3 text-slate-700">{item.leadTime}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{item.dateCode}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right">
                      ₹{(item.quotedQuantity * item.unitPriceInr).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Landed Cost & Tax Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="text-xs text-slate-600 space-y-1">
              <div>Payment Terms: <strong className="text-slate-900">{quotation.paymentTerms}</strong></div>
              <div>Dispatch Hub: <strong className="text-slate-900">{quotation.deliveryLocation}</strong></div>
              <div>QC Protocol: <strong className="text-slate-900">100% Optical Inspection Passed</strong></div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono">₹1,32,000.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%) + SGST (9%):</span>
                <span className="font-mono">₹23,760.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Insured Freight (Bluedart Air):</span>
                <span className="font-mono">₹0.00 (Free)</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Payable (INR):</span>
                <span className="font-mono text-emerald-700 text-base">₹1,55,760.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit & Negotiation History Log */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Negotiation & Engineering Audit Trail
          </h3>

          <div className="space-y-3">
            {quotation.negotiationHistory.map((entry) => (
              <div key={entry.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">
                    {entry.actor} ({entry.role.toUpperCase()})
                  </span>
                  <span className="text-[11px] text-slate-500">{entry.timestamp}</span>
                </div>
                <div className="text-slate-700">{entry.action}</div>
                {entry.notes && (
                  <div className="text-slate-500 italic mt-1 bg-white p-2 rounded border border-slate-100">
                    "{entry.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Counter Modal */}
        {showCounterModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">Submit Counter Negotiation</h3>
              <p className="text-xs text-slate-500 mb-4">
                Propose a target unit price or request quantity split for engineering approval.
              </p>

              <form onSubmit={handleCounterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Unit Price (INR ₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Justification / Competitive Note</label>
                  <textarea
                    rows={3}
                    value={negotiationNotes}
                    onChange={(e) => setNegotiationNotes(e.target.value)}
                    placeholder="e.g. Budget allowance based on 25k production volume contract"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                  >
                    Submit Counter Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomerOrderDetail: React.FC = () => {
  const { routeParams, orders, navigateTo } = useApp();
  const order = orders.find((o) => o.id === routeParams.id) || orders[0];

  const stages = [
    'PO Issued',
    'Payment Confirmed',
    'Supplier Inwarded',
    'Quality Inspection Passed',
    'Packed & Dispatched',
    'In Transit',
    'Delivered',
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigateTo('/customer/orders')}
              className="text-xs text-slate-500 hover:text-slate-800 mb-2 block"
            >
              ← Back to Orders
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-slate-900">{order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">PO Date: {order.createdAt} • Expected Arrival: {order.estimatedDelivery}</p>
          </div>

          <button
            onClick={() => alert('Downloading Verified Delivery Challan & CoC PDF (Demo)')}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Download Tax Invoice & CoC
          </button>
        </div>

        {/* 7-Stage Stepper */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-6">
            7-Stage Order Fulfillment Tracker
          </h3>

          <div className="relative">
            <div className="hidden sm:block absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-4 relative z-10 text-center text-xs">
              {stages.map((stage, idx) => {
                const isPassed = idx <= 4;
                const isCurrent = idx === 4;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] leading-tight ${
                        isCurrent
                          ? 'font-bold text-blue-700'
                          : isPassed
                          ? 'font-medium text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tracking & Courier Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-xs space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              Domestic Express Logistics
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Carrier Partner:</span>
              <span className="font-semibold text-slate-900">{order.shippingCarrier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Air Waybill / Docket:</span>
              <span className="font-mono font-bold text-blue-600">{order.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Origin Logistics Center:</span>
              <span className="text-slate-800">Peenya Phase II Hub, Bangalore</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-xs space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Incoming Lab Quality Status
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Lab Inspection Result:</span>
              <QcStatusBadge status={order.qcStatus} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Optical Check:</span>
              <span className="font-semibold text-emerald-700">40x Solder Lead Integrity Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Moisture Barrier Bag:</span>
              <span className="text-slate-800">Factory Vacuum Sealed with Desiccant</span>
            </div>
          </div>
        </div>

        {/* Order Line Items */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
            Component Items in This Shipment
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">MPN</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">Dispatched Qty</th>
                  <th className="py-2.5 px-3">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.mpn}</td>
                    <td className="py-3 px-3 text-slate-600">{item.manufacturer}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      {item.quantity.toLocaleString()} pcs
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right">
                      ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
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
