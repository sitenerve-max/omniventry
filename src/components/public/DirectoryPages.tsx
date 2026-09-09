import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MANUFACTURERS, MOCK_CATEGORIES, MOCK_SUPPLIERS } from '../../data/mockData';
import { SupplierScoreBadge } from '../common/Badge';
import {
  Search,
  Building,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const ManufacturersPage: React.FC = () => {
  const { navigateTo, setSearchQuery } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = MOCK_MANUFACTURERS.filter((m) =>
    m.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.country.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Electronic Component Manufacturers</h1>
            <p className="text-xs text-slate-600 mt-1">
              Browse semiconductor and discrete component lines actively stocked by verified Indian distributors.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search manufacturers (e.g. TI, ST)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-lg border border-slate-300 text-slate-900"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mfg) => (
            <div
              key={mfg.slug}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                    {mfg.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {mfg.country}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">{mfg.name}</h3>
                <div className="text-xs text-slate-500 mb-3 font-mono">
                  ~{mfg.productCount.toLocaleString()} SKUs listed in Indian inventory
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {mfg.categories.map((cat, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchQuery(mfg.name);
                  navigateTo('/search/results');
                }}
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                View Stocked Parts <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CategoriesPage: React.FC = () => {
  const { navigateTo, setSearchQuery } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Electronic Component Categories</h1>
          <p className="text-xs text-slate-600 mt-1">
            Browse high-demand semiconductor, passive, electromechanical, and wireless module categories across India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => {
                setSearchQuery(cat.name);
                navigateTo('/search/results');
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{cat.count.toLocaleString()} parts available</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                <span>Browse Inventory</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SuppliersPage: React.FC = () => {
  const { navigateTo, addToast } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verified Indian Stockists & Sourcing Partners
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Franchised distributors, independent stockists, and vetted Tier-1 EMS excess hubs audited by OEMInventory.
            </p>
          </div>
          <button
            onClick={() => navigateTo('/for-suppliers')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            + Register as Verified Supplier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_SUPPLIERS.map((sup) => (
            <div key={sup.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      {sup.name}
                      {sup.gstVerified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">
                          GST Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {sup.city}, {sup.state}, {sup.country} • {sup.businessType}
                    </p>
                  </div>
                  <SupplierScoreBadge score={sup.supplierScore} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">{sup.about}</p>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Response Rate</span>
                    <span className="font-mono font-bold text-xs text-slate-900">{sup.responseRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Avg Turnaround</span>
                    <span className="font-mono font-bold text-xs text-slate-900">{sup.avgResponseTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">On-Time Dispatch</span>
                    <span className="font-mono font-bold text-xs text-slate-900">{sup.onTimeDelivery}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  {sup.inventoryCount.toLocaleString()} Ready Lines
                </span>
                <button
                  onClick={() => {
                    addToast('RFQ Initiated', `Opening RFQ form targeting ${sup.name}`, 'info');
                    navigateTo('/rfq/new');
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Request Direct RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
