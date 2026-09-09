import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Boxes,
  Zap,
  Building2,
  Lock,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { searchQuery, setSearchQuery, navigateTo } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('/search/results');
  };

  const handleExampleClick = (mpn: string) => {
    setSearchQuery(mpn);
    navigateTo('/search/results');
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800 pt-12 pb-16 lg:py-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-800 text-cyan-300 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              India's Electronic Component Inventory & Sourcing Network
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Find. Source. Compare. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-sky-300 to-teal-300">
                Buy Electronic Components.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Direct access to ready inventory held by verified Indian stockists, authorized distributors, and Tier-1 EMS excess lots. Streamlined RFQ matching and landed-cost procurement.
            </p>

            {/* Central Search Form */}
            <div className="bg-white/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl max-w-2xl mx-auto mb-6">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search MPN, Manufacturer, Description (e.g., LM358DR)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-slate-900 placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-cyan-500 shadow-inner"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  Search Inventory
                </button>
              </form>
            </div>

            {/* Search Examples */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-8">
              <span className="text-slate-500">Popular Queries:</span>
              {['LM358DR', 'STM32F103C8T6', 'TPS54360D', 'MUR460', 'Automotive MOSFET 40V'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleExampleClick(term)}
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-[11px] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('/bom/upload')}
                className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Complete BOM (.xlsx / .csv)
              </button>
              <button
                onClick={() => navigateTo('/rfq/new')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Create Custom RFQ
              </button>
              <button
                onClick={() => navigateTo('/for-suppliers')}
                className="px-5 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/60 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <Boxes className="w-4 h-4 text-amber-400" />
                List Your Inventory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Indian Inventory Aggregation</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Centralizing ready warehouse lots from franchised stockists, verified traders, and OEM excess across Bangalore, Pune, Delhi NCR, and Chennai. Real-time lot quantities, factory date codes, and packaging condition.
            </p>
            <div className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
              <span>Lot-level traceability</span> • <span>GST compliant</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">BOM Sourcing & AI Field Mapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Upload customer engineering Bill of Materials. Automatic header detection parses MPN, manufacturer, target quantity, and reference designators. Instant coverage audit against live Indian stock.
            </p>
            <div className="text-[11px] font-medium text-teal-600 flex items-center gap-1">
              <span>95%+ column match</span> • <span>Shortage resolution</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">RFQ & Procurement Automation</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Submit your project requirement once. Algorithmic dispatch sends vendor RFQs, normalizes incoming quotes, calculates landed cost with customs and freight, and produces approved customer quotations.
            </p>
            <div className="text-[11px] font-medium text-indigo-600 flex items-center gap-1">
              <span>Split-source quoting</span> • <span>No hidden markup</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - End to End Technical Workflow */}
      <section className="py-14 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">How OEMInventory Works</h2>
            <p className="text-xs text-slate-600 mt-2">
              From inventory ingestion to incoming optical QC and dispatch, every step is built for electronics engineering rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-white p-5 rounded-xl border border-slate-200 relative shadow-xs">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <h4 className="font-semibold text-sm text-slate-900 mb-1">Search & Inquire</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search exact MPN or upload Excel BOM. Review verified warehouse lots, date codes, and packaging condition.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 relative shadow-xs">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <h4 className="font-semibold text-sm text-slate-900 mb-1">Request & Match RFQ</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit delivery locations and target dates. The platform matches qualified stockists and issues structured RFQs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 relative shadow-xs">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <h4 className="font-semibold text-sm text-slate-900 mb-1">Compare & Landed Cost</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engine compares supplier prices, lead times, and quality scores. Full landed cost breakdown with 18% GST and freight.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 relative shadow-xs">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-3">
                4
              </div>
              <h4 className="font-semibold text-sm text-slate-900 mb-1">QC & Dispatch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Physical optical inspection, barcode and packaging verification at our hub before tracked express dispatch to your plant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Personas Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Tailored For Electronics Industry Stakeholders</h2>
          <p className="text-xs text-slate-600 mt-1">
            Built specifically to solve India’s component procurement fragmentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                For OEMs & EMS Companies
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Eliminate Production Stoppages</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Immediate Indian ready stock for unexpected line shortages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verified date codes and full traceability documents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Monetize dead or excess inventory via our private liquidation desk.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigateTo('/for-oem-ems')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Explore OEM Solutions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                For Procurement Teams
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Automate Quotation & Landed Cost</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Single RFQ broadcasted to all verified domestic stockists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Multi-quote side-by-side commercial and quality comparison.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Audit-logged price negotiations and configurable approval rules.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigateTo('/rfq/new')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Start New RFQ <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                For Stockists & Suppliers
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Monetize Warehouse Inventory</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Upload existing Excel lists with smart column mapping.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Receive high-intent RFQs directly from vetted Indian manufacturers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Keep pricing strictly confidential; sell under anonymous or verified profiles.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigateTo('/for-suppliers')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Supplier Onboarding <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Technical Capabilities Matrix */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="text-2xl font-mono font-bold text-cyan-400 mb-1">100%</div>
              <div className="text-xs font-semibold text-slate-200">Exact MPN Normalization</div>
              <div className="text-[11px] text-slate-400 mt-1">Package suffixes parsed accurately</div>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">4-Tier</div>
              <div className="text-xs font-semibold text-slate-200">Inventory Confidence</div>
              <div className="text-[11px] text-slate-400 mt-1">Verified stock vs reported lots</div>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="text-2xl font-mono font-bold text-teal-400 mb-1">0 - 100</div>
              <div className="text-xs font-semibold text-slate-200">Supplier Scoring</div>
              <div className="text-[11px] text-slate-400 mt-1">On-time delivery & quality rating</div>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="text-2xl font-mono font-bold text-indigo-400 mb-1">13-Step</div>
              <div className="text-xs font-semibold text-slate-200">Landed Cost Engine</div>
              <div className="text-[11px] text-slate-400 mt-1">Customs, SWS, Freight, Insurance & GST</div>
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="text-2xl font-mono font-bold text-amber-400 mb-1">Complete</div>
              <div className="text-xs font-semibold text-slate-200">BOM Coverage Audit</div>
              <div className="text-[11px] text-slate-400 mt-1">Cross-matched with live domestic stock</div>
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Acquisition CTA */}
      <section className="py-14 bg-linear-to-r from-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Hold Stock in Bangalore, Pune, Delhi NCR or Gujarat?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Upload your existing inventory spreadsheet in minutes. Start receiving high-intent RFQs directly from Indian OEMs and EMS manufacturers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('/supplier/inventory/upload')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors shadow-md"
            >
              Upload Excel Inventory (.xlsx)
            </button>
            <button
              onClick={() => navigateTo('/for-suppliers')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm border border-slate-700 transition-colors"
            >
              Learn Supplier Benefits
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
