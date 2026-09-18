import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  Boxes,
  Layers,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Lock,
  Cpu,
  FileText,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
            Company Mission & Integrity
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">
            About OEMInventory
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Building India’s reliable, algorithmic, and transparent electronic component inventory & sourcing network.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">The Problem We Solve</h2>
          <p>
            India’s electronics manufacturing sector (EMS, automotive, industrial IoT, aerospace, and consumer appliances) is growing exponentially. Yet component procurement remains fractured across offline WhatsApp groups, unverified stockist claims, volatile spot markups, and long lead times for imported reels.
          </p>
          <p>
            OEMInventory aggregates verified physical inventory from franchised distributors, independent stockists, and Tier-1 EMS surplus warehouses across Bangalore, Pune, Delhi NCR, and Chennai into a single transparent B2B network.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4 border-t border-slate-100">
            Our Four Engineering Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">1. Anti-Counterfeit Verification</span>
              <p className="text-slate-600">
                Every component lot passes 40x optical microscope inspection, label OCR barcode check, and manufacturer Certificate of Conformance (CoC) validation before release.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">2. Transparent Landed Cost</span>
              <p className="text-slate-600">
                No hidden brokerage. Complete clarity on customs duty (BCD), SWS, freight, insurance, and 18% GST with audit-logged negotiation.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">3. Confidential Privacy Protocol</span>
              <p className="text-slate-600">
                Supplier buy costs and customer target prices are never leaked or made publicly accessible to competing vendors.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">4. Zero Unauthorized Substitution</span>
              <p className="text-slate-600">
                Pin-compatible equivalents are suggested for engineering review only. No component is ever swapped without formal customer sign-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HowItWorksPage: React.FC = () => {
  const [roleFlow, setRoleFlow] = useState<'customer' | 'supplier' | 'oem' | 'internal'>('customer');

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">End-to-End Procurement Workflow</h1>
          <p className="text-xs text-slate-600 mt-1">
            Choose your stakeholder role to see how data, verification, and procurement flow through OEMInventory.
          </p>
        </div>

        {/* Stakeholder Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-200 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button
              onClick={() => setRoleFlow('customer')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                roleFlow === 'customer' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Customer (Buyer)
            </button>
            <button
              onClick={() => setRoleFlow('supplier')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                roleFlow === 'supplier' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Supplier (Stockist)
            </button>
            <button
              onClick={() => setRoleFlow('oem')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                roleFlow === 'oem' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              OEM Excess Owner
            </button>
            <button
              onClick={() => setRoleFlow('internal')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                roleFlow === 'internal' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Internal Operations
            </button>
          </div>
        </div>

        {/* Dynamic Workflow Stages */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          {roleFlow === 'customer' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Search MPN or Upload Engineering BOM</h4>
                  <p className="text-slate-600 mt-0.5">Explore ready domestic inventory lots across verified Indian warehouses with exact date codes.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Submit RFQ with Target Quantities & Dates</h4>
                  <p className="text-slate-600 mt-0.5">One RFQ automatically matches qualified distributors and stockists in our network.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Review Quotation & Negotiate Online</h4>
                  <p className="text-slate-600 mt-0.5">Transparent landed cost with GST. Request price counters or alternate parts with full audit logs.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Order Tracking, QC Passed & Dispatch</h4>
                  <p className="text-slate-600 mt-0.5">Follow 7-stage order progression from PO to warehouse QC inspection and courier tracking.</p>
                </div>
              </div>
            </div>
          )}

          {roleFlow === 'supplier' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Upload Inventory Spreadsheet (.xlsx)</h4>
                  <p className="text-slate-600 mt-0.5">Smart AI mapping detects your MPN, quantity, date code, and packaging columns automatically.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Normalization & Stock Verification</h4>
                  <p className="text-slate-600 mt-0.5">Inventory is normalized, assigned confidence badges, and indexed across our search network.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Receive High-Intent Vendor RFQs</h4>
                  <p className="text-slate-600 mt-0.5">Respond with full quotation, partial supply, or custom delivery timelines directly in your portal.</p>
                </div>
              </div>
            </div>
          )}

          {roleFlow === 'oem' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Submit Surplus & Project Cancellation Lots</h4>
                  <p className="text-slate-600 mt-0.5">Choose between public listing, anonymous EMS hub branding, or direct lot liquidation.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Market Valuation & Demand Matching</h4>
                  <p className="text-slate-600 mt-0.5">Our algorithms match your dead stock with active Indian OEM build requirements.</p>
                </div>
              </div>
            </div>
          )}

          {roleFlow === 'internal' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">RFQ Ingestion & Algorithmic Vendor Matching</h4>
                  <p className="text-slate-600 mt-0.5">System clusters suppliers holding relevant parts and dispatches automated vendor RFQs.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Landed Cost Engine & Approval Matrix</h4>
                  <p className="text-slate-600 mt-0.5">Calculation of BCD, SWS, freight, insurance, and margins, routed for Sales Manager or Director approval.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Laboratory QC Inspection & Delivery Challan Dispatch</h4>
                  <p className="text-slate-600 mt-0.5">Goods receipt, 7-point optical QC checklist, packing list generation, and logistics partner handoff.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ForSuppliersPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Supplier & Stockist Network
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">
            List Your Electronic Component Inventory
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Gain immediate exposure to thousands of Indian OEMs, automotive Tier-1s, and EMS companies searching for ready stock.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs mb-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Boxes className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-sm text-slate-900">Upload Excel</div>
              <div className="text-slate-500 mt-1">Any format with smart column matching</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Lock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-sm text-slate-900">Confidential Pricing</div>
              <div className="text-slate-500 mt-1">Buy prices never exposed to competitors</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="font-bold text-sm text-slate-900">Direct RFQs</div>
              <div className="text-slate-500 mt-1">Respond with unit prices in your portal</div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Ready to upload your component stock list?</h4>
              <p className="text-slate-500">Preview the supplier inventory ingestion flow right now.</p>
            </div>
            <button
              onClick={() => navigateTo('/supplier/inventory/upload')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-xs"
            >
              Start Inventory Upload Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForOemEmsPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
            OEM & EMS Enterprise Procurement
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">
            Accelerate Component Sourcing for Indian Manufacturing
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Eliminate assembly line shutdowns with verified domestic inventory and automated multi-line BOM matching.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs mb-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-1">BOM Line Item Sourcing</h4>
              <p className="text-slate-600">
                Upload 100+ line BOMs. Get instantaneous coverage reports cross-referenced against domestic ready reels and tubes.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Audited Traceability</h4>
              <p className="text-slate-600">
                All lots shipped with CoC, date-code confirmation, moisture barrier seal integrity, and high-resolution optical inspection records.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Have a production BOM ready for quotation?</h4>
              <p className="text-slate-500">Run our automated BOM matching engine.</p>
            </div>
            <button
              onClick={() => navigateTo('/bom/upload')}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-xs shadow-xs"
            >
              Upload BOM Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Message Dispatched', 'OEMInventory procurement support has received your requirement.', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contact Procurement Support</h1>
          <p className="text-xs text-slate-600 mt-1">
            Connect directly with our semiconductor materials desk, quality lab, or logistics hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm mb-4">Logistics & Lab Hub</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Plot 88, Peenya Industrial Area, Phase II, Bangalore, Karnataka - 560058</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>procurement@oeminventory.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-mono">+91 80 4912 8800</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Hours: Mon - Sat, 09:00 - 18:30 IST
            </div>
          </div>

          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            {submitted ? (
              <div className="text-center py-10 text-xs text-emerald-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-base text-slate-900">Inquiry Received</h4>
                <p className="text-slate-600 mt-1">An assigned technical procurement specialist will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                    <input type="text" required className="w-full border border-slate-300 rounded-lg p-2.5" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Company / Organization *</label>
                    <input type="text" required className="w-full border border-slate-300 rounded-lg p-2.5" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Business Email *</label>
                    <input type="email" required className="w-full border border-slate-300 rounded-lg p-2.5" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Mobile / WhatsApp *</label>
                    <input type="tel" required className="w-full border border-slate-300 rounded-lg p-2.5 font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Specific Part or Sourcing Requirement *</label>
                  <textarea rows={3} required placeholder="MPNs required, target volume, lead time constraints..." className="w-full border border-slate-300 rounded-lg p-2.5" />
                </div>

                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold">
                  Send Requirement to Sourcing Desk
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthDemoPage: React.FC = () => {
  const { setPortal, navigateTo, addToast } = useApp();
  const [accountType, setAccountType] = useState<'Customer' | 'Supplier' | 'OEM' | 'Enterprise'>('Customer');

  const handleSimulateLogin = (portalTarget: 'customer' | 'supplier' | 'admin') => {
    setPortal(portalTarget);
    if (portalTarget === 'customer') navigateTo('/customer/dashboard');
    else if (portalTarget === 'supplier') navigateTo('/supplier/dashboard');
    else navigateTo('/admin/dashboard');
    addToast('Authentication Simulated', `Logged in as demo ${portalTarget.toUpperCase()} user.`, 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg text-white font-bold font-mono flex items-center justify-center mx-auto mb-2">
              OE
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign In to OEMInventory</h2>
            <p className="text-xs text-slate-500 mt-0.5">Technical Procurement & Inventory Network</p>
          </div>

          <div className="space-y-3 mb-6 text-xs">
            <label className="block text-slate-700 font-medium">Quick Portal Switch (Prototype Simulator):</label>
            <button
              onClick={() => handleSimulateLogin('customer')}
              className="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-blue-900">Sign in as Customer (OEM/EMS)</div>
                <div className="text-[11px] text-blue-700">Demo User A • Demo Electronics Pvt Ltd</div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={() => handleSimulateLogin('supplier')}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-emerald-900">Sign in as Supplier / Stockist</div>
                <div className="text-[11px] text-emerald-700">Rajesh Kumar • Apex Microelectronics</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() => handleSimulateLogin('admin')}
              className="w-full p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-left flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900">Sign in as Internal Operations / Admin</div>
                <div className="text-[11px] text-slate-600">Demo Staff A • Operations & Landed Cost</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Auth Pages ───────────────────────────────────────────────────────────────

export const RegisterPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join OEMInventory as a buyer or supplier</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input type="text" placeholder="Rahul" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input type="text" placeholder="Sharma" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <input type="email" placeholder="you@company.com" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input type="text" placeholder="Acme Electronics Pvt Ltd" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Buyer / OEM / EMS</option>
                <option>Supplier / Stockist / Trader</option>
                <option>Distributor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input type="password" placeholder="Min 8 characters" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button
            onClick={() => navigateTo('/auth/login')}
            className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold"
          >
            Create Account (Demo — No Data Saved)
          </button>
          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{' '}
            <button onClick={() => navigateTo('/auth/login')} className="text-blue-600 hover:underline font-semibold">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your email to receive a reset link</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
            <input type="email" placeholder="you@company.com" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold">
            Send Reset Link (Demo — No Email Sent)
          </button>
          <p className="text-center text-xs text-slate-500">
            <button onClick={() => navigateTo('/auth/login')} className="text-blue-600 hover:underline">Back to Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-sm text-slate-500 mt-1">Enter a new password for your account</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <input type="password" placeholder="Min 8 characters" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
            <input type="password" placeholder="Repeat new password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={() => navigateTo('/auth/login')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold">
            Reset Password (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Directory Detail Pages ───────────────────────────────────────────────────

export const ManufacturerDetailPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigateTo('/manufacturers')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← All Manufacturers</button>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-bold text-xl font-mono">TI</div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Texas Instruments</h1>
          <p className="text-sm text-slate-500">Semiconductors • Dallas, TX, USA • Founded 1951</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 mb-3">About</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Texas Instruments is a global semiconductor company that designs, manufactures, tests and sells analog ICs and embedded processors. Key product lines include operational amplifiers, power management ICs, microcontrollers, and DSPs.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[['Op Amps', '1,200+'], ['MCUs', '800+'], ['Power ICs', '2,000+']].map(([cat, count]) => (
              <div key={cat} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <div className="text-xs text-slate-500">{cat}</div>
                <div className="font-bold text-slate-900 font-mono mt-0.5">{count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h4 className="font-bold text-sm text-slate-800 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button onClick={() => navigateTo('/search/results')} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500">Search TI Parts</button>
            <button onClick={() => navigateTo('/rfq/new')} className="w-full py-2 border border-blue-400 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50">Request Quote</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryDetailPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigateTo('/categories')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← All Categories</button>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Operational Amplifiers (Op Amps)</h1>
      <p className="text-sm text-slate-500 mb-6">Integrated Circuits → Analog ICs → Op Amps</p>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-5">
        <h3 className="font-bold text-sm text-slate-800 mb-3">About this Category</h3>
        <p className="text-xs text-slate-600 leading-relaxed">Operational amplifiers are voltage amplifying devices with two inputs (inverting and non-inverting) and a single output. They are fundamental building blocks in analog circuit design for amplification, filtering, signal conditioning, and comparison applications.</p>
      </div>
      <button onClick={() => navigateTo('/search/results')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500">
        Browse Op Amp Parts →
      </button>
    </div>
  );
};

export const SupplierDirectoryDetailPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigateTo('/suppliers')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← All Suppliers</button>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-sm font-mono">AMI</div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Apex Microelectronics India Pvt Ltd</h1>
          <p className="text-sm text-slate-500">Franchised Stockist • Peenya Hub, Bangalore • GST Verified</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 mb-3">Supplier Profile</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Apex Microelectronics is a franchised stockist of Texas Instruments, STMicroelectronics, and Espressif products with a verified inventory hub at Peenya Industrial Area, Bangalore. Specializes in high-volume OEM/EMS supply with same-day dispatch capability.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {[['Supplier Score', '98/100'], ['Response Time', '1.8 Hours'], ['On-Time Rate', '99.1%'], ['GST Status', 'Verified']].map(([k, v]) => (
              <div key={k} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-slate-500">{k}</div>
                <div className="font-bold text-slate-900 font-mono mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h4 className="font-bold text-sm text-slate-800 mb-3">Request Quote</h4>
          <p className="text-xs text-slate-500 mb-3">This supplier responds to RFQs via OEMInventory platform only. Direct contact details are not shared.</p>
          <button onClick={() => navigateTo('/rfq/new')} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500">Create RFQ</button>
        </div>
      </div>
    </div>
  );
};

// ─── Content Pages ────────────────────────────────────────────────────────────

export const ResourcesPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-bold text-slate-900 mb-2">Resources</h1>
    <p className="text-sm text-slate-500 mb-8">Guides, documentation, and tools for electronics procurement.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: 'Supplier Onboarding Guide', desc: 'How to upload inventory, map columns, and start receiving RFQs.', tag: 'Guide' },
        { title: 'BOM Upload Template', desc: 'Download the standard BOM template compatible with our AI mapper.', tag: 'Template' },
        { title: 'Understanding Landed Cost', desc: 'Learn how OEMInventory calculates landed cost for import components.', tag: 'Article' },
        { title: 'RFQ Best Practices', desc: 'How to write effective RFQs that get faster supplier responses.', tag: 'Guide' },
        { title: 'Component Lifecycle Guide', desc: 'Understanding Active, NRND, End-of-Life, and Obsolete status.', tag: 'Article' },
        { title: 'API Documentation', desc: 'REST API reference for ERP integration and automated RFQ submission.', tag: 'Docs', comingSoon: true },
      ].map(item => (
        <div key={item.title} className={`bg-white border rounded-xl p-5 shadow-xs ${item.comingSoon ? 'border-dashed border-slate-300 opacity-60' : 'border-slate-200 hover:border-blue-300 cursor-pointer'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">{item.tag}</span>
            {item.comingSoon && <span className="text-[10px] text-slate-400 font-semibold">Coming Soon</span>}
          </div>
          <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export const BlogPage: React.FC = () => {
  const { navigateTo } = useApp();
  const posts = [
    { slug: 'india-electronics-sourcing-2026', title: 'India Electronics Component Sourcing Trends 2026', date: 'Sep 10, 2026', tag: 'Market Intelligence' },
    { slug: 'excess-inventory-management', title: 'How OEMs Can Monetize Excess Inventory', date: 'Sep 5, 2026', tag: 'Supply Chain' },
    { slug: 'mpn-normalization', title: 'Why MPN Normalization Matters in B2B Procurement', date: 'Aug 28, 2026', tag: 'Technology' },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Blog</h1>
      <p className="text-sm text-slate-500 mb-8">Electronics procurement insights, supply chain intelligence, and industry news.</p>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.slug} onClick={() => navigateTo(`/blog/${post.slug}`)}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs cursor-pointer hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-700 rounded font-bold">{post.tag}</span>
              <span className="text-xs text-slate-400">{post.date}</span>
            </div>
            <h2 className="font-bold text-slate-900">{post.title}</h2>
            <p className="text-xs text-blue-600 mt-2 hover:underline">Read more →</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BlogPostPage: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigateTo('/blog')} className="text-blue-600 text-xs hover:underline flex items-center gap-1 mb-4">← Back to Blog</button>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] px-2 py-0.5 bg-teal-100 text-teal-700 rounded font-bold">Market Intelligence</span>
        <span className="text-xs text-slate-400">Sep 10, 2026</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">India Electronics Component Sourcing Trends 2026</h1>
      <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
        <p>The Indian electronics manufacturing sector is experiencing unprecedented growth driven by PLI schemes, China+1 supply chain diversification, and increased domestic EV and telecom deployments.</p>
        <p>Key sourcing challenges in 2026 include lead time volatility for passives, counterfeit risk in spot-market procurement, and currency fluctuation impact on landed cost for USD-denominated components.</p>
        <p className="text-slate-400 italic">This is a demo blog post. In production, full content would be published here with rich text formatting, images, and related part recommendations.</p>
      </div>
    </div>
  );
};
