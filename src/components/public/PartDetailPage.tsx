import React from 'react';
import { useApp } from '../../context/AppContext';
import { ConfidenceBadge, SupplierScoreBadge } from '../common/Badge';
import {
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Layers,
  Heart,
  Bell,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const PartDetailPage: React.FC = () => {
  const {
    routeParams,
    components,
    navigateTo,
    addPartToDraftRfq,
    compareList,
    toggleComparePart,
    savedParts,
    toggleSavePart,
    addToast,
  } = useApp();

  const currentMpn = routeParams.mpn || 'LM358DR';
  const component =
    components.find((c) => c.mpn.toUpperCase() === currentMpn.toUpperCase()) || components[0];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigateTo('/search/results')}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Results
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavePart(component.mpn)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                savedParts.includes(component.mpn)
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              {savedParts.includes(component.mpn) ? 'Saved' : 'Save Part'}
            </button>
            <button
              onClick={() => toggleComparePart(component.mpn)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Compare
            </button>
            <button
              onClick={() => navigateTo('/alerts')}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              Set Alert
            </button>
          </div>
        </div>

        {/* Component Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {component.mpn}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {component.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {component.lifecycle}
                </span>
                {component.rohsCompliant && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    RoHS Compliant
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Manufacturer: <span className="text-blue-600">{component.manufacturer}</span>
              </div>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                {component.description}
              </p>
            </div>

            {/* Quick Procurement Action Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:w-80 shrink-0 text-center space-y-3">
              <div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Aggregated Ready Stock (India)
                </div>
                <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-0.5">
                  {component.totalAvailableQuantity.toLocaleString()} pcs
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Minimum Order Qty: {component.moq} pcs</div>
              </div>

              <button
                onClick={() => {
                  addPartToDraftRfq({
                    mpn: component.mpn,
                    manufacturer: component.manufacturer,
                    requiredQuantity: component.moq * 2,
                  });
                  navigateTo('/rfq/new');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Request Custom RFQ
              </button>

              <button
                onClick={() =>
                  addPartToDraftRfq({
                    mpn: component.mpn,
                    manufacturer: component.manufacturer,
                    requiredQuantity: component.moq,
                  })
                }
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                + Add to Draft RFQ Cart
              </button>

              {component.datasheetUrl && (
                <a
                  href={component.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline pt-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Manufacturer Datasheet (PDF)
                </a>
              )}
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="pt-6">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Parametric Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase tracking-wide block">Package / Case</span>
                <span className="font-mono font-semibold text-slate-900">{component.package}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase tracking-wide block">Mounting Style</span>
                <span className="font-semibold text-slate-900">{component.mountingType}</span>
              </div>
              {Object.entries(component.specifications).map(([key, value]) => (
                <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wide block truncate">{key}</span>
                  <span className="font-mono font-semibold text-slate-900 truncate block">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Inventory Lots in India */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Verified Domestic Inventory Lots ({component.lots.length})
              </h2>
              <p className="text-xs text-slate-600">
                Inspect warehouse location, date codes, factory packaging, and audited supplier metrics.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {component.lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-slate-900">{lot.lotNumber}</span>
                        <ConfidenceBadge confidence={lot.confidence} />
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {lot.condition}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {lot.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Lead Time: <strong className="text-slate-700">{lot.leadTime}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:text-right">
                    <div>
                      <div className="text-[11px] text-slate-500">Available Lot Quantity</div>
                      <div className="font-mono text-lg font-extrabold text-emerald-700">
                        {lot.availableQuantity.toLocaleString()} pcs
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        addPartToDraftRfq({
                          mpn: component.mpn,
                          manufacturer: component.manufacturer,
                          requiredQuantity: lot.quantity > 10000 ? 5000 : 1000,
                        })
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>

                {/* Lot Detail Specifications & Supplier Privacy Info */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Packaging & Date Code</span>
                    <span className="font-medium text-slate-900">{lot.packaging}</span>
                    <div className="text-[11px] font-mono text-slate-600 mt-0.5">Date Code: {lot.dateCode}</div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Supplier Visibility & Rating</span>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {lot.supplierName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <SupplierScoreBadge score={lot.supplierScore} />
                      {lot.gstVerified && (
                        <span className="text-[10px] text-emerald-700 font-medium">GSTIN Verified</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Origin & Certificates</span>
                    <span className="text-slate-800">Origin: {lot.countryOfOrigin}</span>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {lot.certificateAvailable ? 'CoC / Traceability Available' : 'Supplier Standard Warranty'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Counterfeit Verification Protocol */}
        <div className="bg-blue-950 text-white border border-blue-900 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/60 border border-blue-700 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Incoming Optical & Authenticity Inspection</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Before any part is dispatched from OEMInventory logistics hubs, our quality lab performs 40x optical inspection, lead coplanarity verification, date-code confirmation, and manufacturer CoC archiving.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('/how-it-works')}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
          >
            Review QC Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
