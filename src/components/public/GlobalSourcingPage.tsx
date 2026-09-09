import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Plane,
  FileText,
  DollarSign,
  Building,
  Sparkles,
} from 'lucide-react';

export const GlobalSourcingPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Strategic Sourcing Protocol • India First, Global Ready
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Global Component Sourcing & Landed Procurement
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            When a critical semiconductor or passive component is exhausted across Indian domestic warehouses, OEMInventory automatically taps audited franchised partners in Singapore, Europe, and the US.
          </p>
        </div>

        {/* 6-Stage Sourcing Pipeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            End-to-End International Sourcing Architecture
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 1: Domestic India Search First</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Priority check across 100+ vetted Indian distributor warehouses in Bangalore, Pune, and Delhi to achieve same-day dispatch and zero customs duty overhead.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 2: International Stockist Inquiry</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  If domestic stock is unavailable, vendor RFQs are dispatched to authorized global partners in Singapore, Japan, Germany, and North America.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 3: Algorithmic Landed Cost Calculation</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  System calculates FX conversion, Basic Customs Duty (BCD), Social Welfare Surcharge (SWS), air freight, insurance, and 18% GST into a single predictable Indian Rupee (INR) unit rate.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 4: Centralized QC & Customs Clearance</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  OEMInventory handles all import documentation, customs clearance at Bangalore / Mumbai air cargo, and performs lab authenticity inspection before dispatch.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-800">Version 2 & 3 Integration Ready:</span> High-speed API connectors for international authorized catalogs.
            </div>
            <button
              onClick={() => navigateTo('/rfq/new')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Submit Global Sourcing RFQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
