import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Bookmark,
  History,
  SlidersHorizontal,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'single' | 'multi' | 'natural'>('single');
  const [multiMpnInput, setMultiMpnInput] = useState('LM358DR\nSTM32F103C8T6\nTPS54360D\nMUR460');
  const [naturalQuery, setNaturalQuery] = useState(
    'Find 20,000 pieces of an automotive-grade 40V N-channel MOSFET under ₹15, available in India.'
  );

  const recentSearches = ['LM358DR', 'STM32F103C8T6', 'ESP32-WROOM-32E', 'TPS54360D', 'IRFZ44NPBF'];
  const savedSearches = [
    { title: 'TI Op-Amps Ready in Bangalore (Date Code 24+)', count: 3 },
    { title: 'ST Microcontrollers LQFP-48 Factory Trays', count: 2 },
  ];

  const handleSearch = (queryToUse?: string) => {
    if (queryToUse) {
      setSearchQuery(queryToUse);
    }
    navigateTo('/search/results');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Discovery Engine</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Search Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Electronic Component Search</h1>
          <p className="text-xs text-slate-600 mt-1">
            Query across verified Indian distributor warehouses, stockists, and EMS excess inventory lots.
          </p>
        </div>

        {/* Search Mode Tabs */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-8">
          <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-5 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'single'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Exact MPN & Description Search
            </button>
            <button
              onClick={() => setActiveTab('multi')}
              className={`px-5 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'multi'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Multiple MPN Batch Search (up to 20)
            </button>
            <button
              onClick={() => setActiveTab('natural')}
              className={`px-5 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'natural'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Natural Language Spec Search
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'single' && (
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter full or partial MPN, manufacturer, or description (e.g. LM358DR, TI, Dual Op-Amp)..."
                      className="w-full pl-11 pr-28 py-3.5 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-xs"
                    >
                      Search
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Manufacturer</label>
                      <select className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800">
                        <option value="">All Manufacturers</option>
                        <option value="ti">Texas Instruments</option>
                        <option value="st">STMicroelectronics</option>
                        <option value="onsemi">onsemi</option>
                        <option value="infineon">Infineon</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Availability</label>
                      <select className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800">
                        <option value="">All Inventory</option>
                        <option value="ready">Ready Stock (India)</option>
                        <option value="verified">Verified Stock Only</option>
                        <option value="excess">OEM Excess Lots</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Packaging</label>
                      <select className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800">
                        <option value="">Any Packaging</option>
                        <option value="reel">Tape & Reel (Original)</option>
                        <option value="tube">Tube / Rail</option>
                        <option value="tray">Factory Trays</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Location</label>
                      <select className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800">
                        <option value="">All India Hubs</option>
                        <option value="blr">Bangalore (Peenya / E-City)</option>
                        <option value="pun">Pune (Chakan / Bhosari)</option>
                        <option value="del">Delhi NCR / Noida</option>
                        <option value="chn">Chennai (Sriperumbudur)</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'multi' && (
              <div>
                <p className="text-xs text-slate-600 mb-2">
                  Paste up to 20 MPNs (one per line). Ideal for quick BOM checks:
                </p>
                <textarea
                  value={multiMpnInput}
                  onChange={(e) => setMultiMpnInput(e.target.value)}
                  rows={5}
                  className="w-full border border-slate-300 rounded-lg p-3 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 mb-3"
                  placeholder="LM358DR&#10;STM32F103C8T6&#10;TPS54360D"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">4 MPNs detected</span>
                  <button
                    onClick={() => handleSearch('LM358DR')}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    Run Multi-MPN Batch Query <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'natural' && (
              <div>
                <div className="bg-cyan-50/60 border border-cyan-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-cyan-950">AI Parametric Intent Parser (Design Prototype)</h4>
                      <p className="text-[11px] text-cyan-900 mt-0.5">
                        Translates plain technical requirement descriptions into structured parametric filters.
                      </p>
                    </div>
                  </div>
                  <textarea
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-cyan-300 rounded-md p-2.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-cyan-500 mb-3"
                  />
                  <div className="bg-white border border-cyan-200 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                      Structured Filter Suggestions:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Category</span>
                        <span className="font-semibold text-slate-800">MOSFET (Power)</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Drain-Source (Vds)</span>
                        <span className="font-semibold text-slate-800">40 V</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Target Qty</span>
                        <span className="font-semibold text-slate-800 font-mono">20,000 pcs</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Quality Grade</span>
                        <span className="font-semibold text-slate-800">Automotive (AEC-Q101)</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Max Target Price</span>
                        <span className="font-semibold text-slate-800 font-mono">≤ ₹15.00</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Location</span>
                        <span className="font-semibold text-slate-800">India Hubs Only</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSearch('Automotive MOSFET 40V')}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  Apply Structured Filters & Search <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Discovery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
              <History className="w-4 h-4 text-slate-500" />
              Recent Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>{term}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Saved Searches */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
              <Bookmark className="w-4 h-4 text-blue-600" />
              Saved Search Presets
            </div>
            <div className="space-y-2">
              {savedSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch('LM358DR')}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs flex items-center justify-between transition-colors"
                >
                  <span className="font-medium text-slate-800">{s.title}</span>
                  <span className="text-[11px] text-blue-600 font-mono font-semibold">{s.count} lots</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
