import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfidenceBadge, SupplierScoreBadge } from '../common/Badge';
import {
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  Grid as GridIcon,
  Download,
  Bookmark,
  Share2,
  FileSpreadsheet,
  Layers,
  ArrowUpDown,
  Check,
  AlertCircle,
  Eye,
  Bell,
  Heart,
  ExternalLink,
  ShieldCheck,
  X,
  Filter,
} from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    components,
    navigateTo,
    addPartToDraftRfq,
    compareList,
    toggleComparePart,
    savedParts,
    toggleSavePart,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('all');
  const [onlyReadyStock, setOnlyReadyStock] = useState(true);

  // Filter components by query
  const effectiveQuery = searchQuery.trim().toLowerCase();
  const matchedComponents = components.filter((c) => {
    if (!effectiveQuery) return true;
    return (
      c.mpn.toLowerCase().includes(effectiveQuery) ||
      c.manufacturer.toLowerCase().includes(effectiveQuery) ||
      c.description.toLowerCase().includes(effectiveQuery) ||
      c.category.toLowerCase().includes(effectiveQuery)
    );
  });

  const mainComponent = matchedComponents[0] || components[0];

  const handleAddAllToRfq = () => {
    matchedComponents.forEach((c) => {
      addPartToDraftRfq({ mpn: c.mpn, manufacturer: c.manufacturer, requiredQuantity: c.moq * 2 });
    });
    addToast('Batch RFQ Added', `Added ${matchedComponents.length} parts to draft RFQ line items.`, 'success');
  };

  const handleExportCsv = () => {
    addToast('Export Generated', 'Exporting current technical inventory results (Demo CSV).', 'info');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={() => navigateTo('/')} className="hover:text-slate-800">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigateTo('/search')} className="hover:text-slate-800">
              Search
            </button>
            <span>/</span>
            <span className="text-slate-900 font-mono font-semibold">{searchQuery || 'LM358DR'}</span>
          </div>
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
            Displaying mock inventory lots for engineering evaluation (Demo Data)
          </div>
        </div>

        {/* Search Header Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1 max-w-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter or search another MPN..."
                  className="w-full bg-slate-50 text-slate-900 font-mono text-sm pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded text-xs ${
                    viewMode === 'table' ? 'bg-white shadow-xs text-blue-600 font-medium' : 'text-slate-600'
                  }`}
                  title="Technical Table View"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded text-xs ${
                    viewMode === 'cards' ? 'bg-white shadow-xs text-blue-600 font-medium' : 'text-slate-600'
                  }`}
                  title="Card View"
                >
                  <GridIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddAllToRfq}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Add All to RFQ
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Active Filters:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
              Query: <strong className="font-mono">{searchQuery || 'LM358DR'}</strong>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
              India Stock Only
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
              Ready Dispatch
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedConfidence('all');
                setSelectedLocation('all');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-2"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Left Filter Sidebar */}
          <div className="hidden md:block col-span-1 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  Parametric Filters
                </span>
              </div>

              {/* Ready Stock Toggle */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyReadyStock}
                    onChange={(e) => setOnlyReadyStock(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ready Stock in India Only</span>
                </label>
              </div>

              {/* Inventory Confidence */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Inventory Confidence
                </label>
                <div className="space-y-1.5 text-xs">
                  {['all', 'Verified Stock', 'Supplier Reported', 'Verification Required'].map((conf) => (
                    <label key={conf} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="conf"
                        checked={selectedConfidence === conf}
                        onChange={() => setSelectedConfidence(conf)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{conf === 'all' ? 'All Confidence Levels' : conf}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Logistics Hub / Location */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Logistics Cluster
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800"
                >
                  <option value="all">All Hubs (Pan-India)</option>
                  <option value="Bangalore">Bangalore (Peenya / E-City)</option>
                  <option value="Pune">Pune (Chakan / Bhosari)</option>
                  <option value="Delhi">Delhi NCR / Noida</option>
                  <option value="Chennai">Chennai (Sriperumbudur)</option>
                  <option value="Ahmedabad">Ahmedabad (Sanand)</option>
                </select>
              </div>

              {/* Packaging */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Packaging Type
                </label>
                <div className="space-y-1 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                    <span>Tape & Reel (Original)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                    <span>Factory Tray / Tubes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                    <span>Excess Reel / Bulk</span>
                  </label>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Compliance
                </label>
                <div className="flex gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    RoHS Compliant
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    REACH
                  </span>
                </div>
              </div>
            </div>

            {/* Substitution Policy Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-amber-950 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Zero Unauthorized Substitution Policy
              </div>
              OEMInventory never automatically substitutes alternative or cross-reference parts without formal customer engineering approval.
            </div>
          </div>

          {/* Results Column */}
          <div className="col-span-1 md:col-span-3 space-y-6">
            {/* Primary Matched Component Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xl font-extrabold text-slate-900">
                      {mainComponent.mpn}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      Exact Match
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      by {mainComponent.manufacturer}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed mb-3">
                    {mainComponent.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div>
                      Package: <span className="font-mono text-slate-800 font-semibold">{mainComponent.package}</span>
                    </div>
                    <span>•</span>
                    <div>
                      Lifecycle: <span className="text-emerald-700 font-semibold">{mainComponent.lifecycle}</span>
                    </div>
                    <span>•</span>
                    <div>
                      Total Ready Stock: <span className="font-mono font-bold text-emerald-600">{mainComponent.totalAvailableQuantity.toLocaleString()} pcs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <button
                    onClick={() => navigateTo(`/part/${mainComponent.mpn}`, { mpn: mainComponent.mpn })}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs whitespace-nowrap"
                  >
                    View Part Details <Eye className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleComparePart(mainComponent.mpn)}
                      className={`p-1.5 rounded border text-xs ${
                        compareList.includes(mainComponent.mpn)
                          ? 'bg-cyan-50 border-cyan-300 text-cyan-700 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title="Compare Part"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleSavePart(mainComponent.mpn)}
                      className={`p-1.5 rounded border text-xs ${
                        savedParts.includes(mainComponent.mpn)
                          ? 'bg-rose-50 border-rose-300 text-rose-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title="Watchlist"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Lots Table View */}
            {viewMode === 'table' ? (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Available Verified Inventory Lots ({mainComponent.lots.length} Lots in India)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Real-time domestic stock</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Lot Identifier</th>
                        <th className="py-2.5 px-3">Available Qty</th>
                        <th className="py-2.5 px-3">MOQ</th>
                        <th className="py-2.5 px-3">Date Code</th>
                        <th className="py-2.5 px-3">Packaging / Condition</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Supplier Visibility</th>
                        <th className="py-2.5 px-3">Confidence</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {mainComponent.lots.map((lot) => (
                        <tr key={lot.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-slate-900">
                            {lot.lotNumber}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                            {lot.availableQuantity.toLocaleString()} pcs
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700">
                            {lot.quantity > 10000 ? '2,500' : '250'}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-800">
                            {lot.dateCode}
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-slate-900 font-medium">{lot.packaging}</div>
                            <div className="text-[10px] text-slate-500">{lot.condition}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            {lot.location}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-900 truncate max-w-[140px]">
                              {lot.supplierName}
                            </div>
                            <SupplierScoreBadge score={lot.supplierScore} />
                          </td>
                          <td className="py-3 px-3">
                            <ConfidenceBadge confidence={lot.confidence} />
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() =>
                                addPartToDraftRfq({
                                  mpn: mainComponent.mpn,
                                  manufacturer: mainComponent.manufacturer,
                                  requiredQuantity: 2500,
                                })
                              }
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-[11px] shadow-xs"
                            >
                              + RFQ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mainComponent.lots.map((lot) => (
                  <div key={lot.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{lot.lotNumber}</span>
                        <ConfidenceBadge confidence={lot.confidence} />
                      </div>
                      <div className="text-sm font-mono font-extrabold text-emerald-600 mb-1">
                        {lot.availableQuantity.toLocaleString()} pcs available
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 mb-3">
                        <div>Date Code: <strong className="font-mono text-slate-800">{lot.dateCode}</strong></div>
                        <div>Packaging: <span className="text-slate-800">{lot.packaging}</span></div>
                        <div>Location: <span className="text-slate-800">{lot.location}</span></div>
                        <div>Supplier: <span className="font-medium text-slate-800">{lot.supplierName}</span></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <SupplierScoreBadge score={lot.supplierScore} />
                      <button
                        onClick={() =>
                          addPartToDraftRfq({
                            mpn: mainComponent.mpn,
                            manufacturer: mainComponent.manufacturer,
                            requiredQuantity: 2500,
                          })
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                      >
                        + Request RFQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cross-Reference & Alternatives Section */}
            <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    Suggested Manufacturer Cross-References & Pin-Compatible Equivalents
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    For engineering evaluation only. Substitutions require customer sign-off.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mainComponent.suggestedAlternatives?.map((alt, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        Equivalent Part
                      </span>
                      <div className="font-mono font-bold text-slate-900 mt-1.5">{alt}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">SOIC-8 Pin-Compatible</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSearchQuery(alt.split(' ')[0]);
                          navigateTo('/search/results');
                        }}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        Check Stock <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => addPartToDraftRfq({ mpn: alt.split(' ')[0], manufacturer: 'Cross-Reference' })}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium"
                      >
                        + RFQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
