import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MapPin, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Trust & Supply Chain Infrastructure Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-700/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs">Verified Stock & QC Audited</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Optical inspection, manufacturer label verification, and CoC validation before dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-900/50 border border-teal-700/60 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs">Pan-India Logistics Hubs</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Ready stock staging in Bangalore, Pune, Delhi NCR, Chennai, Hyderabad & Ahmedabad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs">Transparent Landed Cost</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Itemized Basic Customs Duty, SWS, Freight, Insurance, and 18% GST with full audit clarity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-900/50 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs">Strict Data Privacy</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Supplier buy prices, internal margins, and customer target prices are never publicly exposed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white font-mono text-sm">
                OE
              </div>
              <span className="font-bold text-white text-base tracking-tight">OEMInventory</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              India’s B2B electronic component inventory and sourcing network connecting OEMs, EMS companies, and authorized stockists with algorithmic RFQ matching and landed-cost procurement.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Logistics HQ: Peenya Industrial Area, Bangalore 560058</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>procurement@oeminventory.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Discovery */}
          <div>
            <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Discovery</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('/search')} className="hover:text-cyan-300 transition-colors">
                  Search Inventory
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/bom/upload')} className="hover:text-cyan-300 transition-colors">
                  BOM Upload & Matching
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/rfq/new')} className="hover:text-cyan-300 transition-colors">
                  Request RFQ
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/manufacturers')} className="hover:text-cyan-300 transition-colors">
                  Manufacturer Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/categories')} className="hover:text-cyan-300 transition-colors">
                  Component Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div>
            <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Solutions</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('/for-oem-ems')} className="hover:text-cyan-300 transition-colors">
                  For OEM & EMS
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/for-suppliers')} className="hover:text-cyan-300 transition-colors">
                  For Stockists & Suppliers
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/excess-inventory')} className="hover:text-cyan-300 transition-colors">
                  Excess Inventory Liquidation
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/global-sourcing')} className="hover:text-cyan-300 transition-colors">
                  Global Component Sourcing
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/alerts')} className="hover:text-cyan-300 transition-colors">
                  Part Shortage Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Governance */}
          <div>
            <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Enterprise Portals</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('/customer/dashboard')} className="hover:text-cyan-300 transition-colors">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/supplier/dashboard')} className="hover:text-cyan-300 transition-colors">
                  Supplier Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/admin/dashboard')} className="hover:text-cyan-300 transition-colors">
                  Admin & Operations
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/how-it-works')} className="hover:text-cyan-300 transition-colors">
                  Procurement Workflow
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/about')} className="hover:text-cyan-300 transition-colors">
                  About OEMInventory
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} OEMInventory India Technologies Pvt Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-500/80 font-mono">Demo Prototype Environment</span>
            <span>•</span>
            <button onClick={() => navigateTo('/about')} className="hover:underline">
              Compliance & Anti-Counterfeit Policy
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('/contact')} className="hover:underline">
              Support & Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
