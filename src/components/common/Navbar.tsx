import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  UploadCloud,
  FileSpreadsheet,
  Globe,
  Layers,
  Menu,
  X,
  FileText,
  User,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    searchQuery,
    setSearchQuery,
    draftRfqItems,
    setPortal,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rfqDrawerOpen, setRfqDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('/search/results');
    }
  };

  const navItems = [
    { label: 'Search Components', route: '/search' },
    { label: 'Upload BOM', route: '/bom/upload', badge: 'AI Mapping' },
    { label: 'Request RFQ', route: '/rfq/new' },
    { label: 'Suppliers', route: '/suppliers' },
    { label: 'Manufacturers', route: '/manufacturers' },
    { label: 'Categories', route: '/categories' },
    { label: 'Global Sourcing', route: '/global-sourcing' },
    { label: 'Excess Inventory', route: '/excess-inventory' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-9 z-40">
      {/* Primary Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setPortal('public');
                navigateTo('/');
              }}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md">
                <span className="font-mono">OE</span>
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                  OEMInventory
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-cyan-400 font-mono font-normal border border-blue-800">
                    IN
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                  India’s Electronic Component Inventory & Sourcing Network
                </div>
              </div>
            </button>
          </div>

          {/* Quick Header Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search MPN, e.g. LM358DR, STM32, MOSFET 40V..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-24 py-1.5 rounded-lg border border-slate-700 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Icons & Auth / RFQ Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Draft RFQ Quick Button */}
            <button
              onClick={() => setRfqDrawerOpen(!rfqDrawerOpen)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="View Draft RFQ Line Items"
            >
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">RFQ Cart</span>
              {draftRfqItems.length > 0 && (
                <span className="bg-cyan-500 text-slate-950 font-bold font-mono px-1.5 py-0.2 rounded-full text-[10px]">
                  {draftRfqItems.length}
                </span>
              )}
            </button>

            {/* Upload BOM Direct CTA */}
            <button
              onClick={() => navigateTo('/bom/upload')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload BOM
            </button>

            {/* Portal & Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs text-slate-300"
              >
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                  P
                </div>
                <div className="text-left hidden md:block leading-tight">
                  <div className="font-semibold text-slate-100">Priya Sharma</div>
                  <div className="text-[10px] text-slate-400">Bharat IoT (Customer)</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-slate-200">Switch Workspace / Role</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Explore each dedicated stakeholder portal</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setPortal('customer');
                        navigateTo('/customer/dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white"
                    >
                      <div>
                        <div className="font-medium text-cyan-400">Customer (OEM/EMS) Portal</div>
                        <div className="text-[10px] text-slate-400">Manage RFQs, compare quotes & POs</div>
                      </div>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Active</span>
                    </button>
                    <button
                      onClick={() => {
                        setPortal('supplier');
                        navigateTo('/supplier/dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white"
                    >
                      <div>
                        <div className="font-medium text-emerald-400">Supplier / Stockist Portal</div>
                        <div className="text-[10px] text-slate-400">Upload inventory & reply to RFQs</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setPortal('admin');
                        navigateTo('/admin/dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white"
                    >
                      <div>
                        <div className="font-medium text-amber-400">Admin Operations & Landed Cost</div>
                        <div className="text-[10px] text-slate-400">Margin formulas, QC & approval matrix</div>
                      </div>
                    </button>
                  </div>
                  <div className="border-t border-slate-800 px-4 py-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigateTo('/alerts');
                        setUserDropdownOpen(false);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      Part Alerts
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('/login');
                        setUserDropdownOpen(false);
                      }}
                      className="text-cyan-400 hover:underline"
                    >
                      Auth Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar */}
      <nav aria-label="Main Navigation" className="hidden md:block bg-slate-950/80 border-t border-slate-800/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 py-1.5">
            {navItems.map((item) => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateTo(item.route)}
                  className={`px-3 py-1 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-900/60 text-cyan-300 border border-blue-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] bg-teal-950 text-teal-300 border border-teal-700 px-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 py-1.5 text-slate-400 text-[11px] shrink-0">
            <button
              onClick={() => navigateTo('/for-suppliers')}
              className="hover:text-cyan-300 transition-colors"
            >
              List Inventory
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => navigateTo('/for-oem-ems')}
              className="hover:text-cyan-300 transition-colors"
            >
              For OEM/EMS
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => navigateTo('/alerts')}
              className="hover:text-cyan-300 transition-colors"
            >
              Part Alerts
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-2">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search MPN (e.g. LM358DR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white pl-8 pr-3 py-2 rounded-lg border border-slate-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </form>
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                navigateTo(item.route);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                navigateTo('/bom/upload');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs bg-teal-600 text-white rounded-lg font-medium"
            >
              Upload BOM
            </button>
            <button
              onClick={() => {
                navigateTo('/rfq/new');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs bg-blue-600 text-white rounded-lg font-medium"
            >
              Request RFQ
            </button>
          </div>
        </div>
      )}

      {/* RFQ Quick Drawer / Modal */}
      {rfqDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white text-slate-900 h-full shadow-2xl flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-semibold text-sm">Draft RFQ Line Items</h3>
                  <p className="text-xs text-slate-400">{draftRfqItems.length} parts ready for RFQ submission</p>
                </div>
              </div>
              <button onClick={() => setRfqDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {draftRfqItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium text-sm">No parts in your RFQ cart yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Search components like <span className="font-mono text-slate-700 font-semibold">LM358DR</span> or <span className="font-mono text-slate-700 font-semibold">STM32F103C8T6</span> and click "+ RFQ".
                  </p>
                  <button
                    onClick={() => {
                      setRfqDrawerOpen(false);
                      navigateTo('/search');
                    }}
                    className="mt-4 px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium"
                  >
                    Browse Inventory
                  </button>
                </div>
              ) : (
                draftRfqItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-sm text-slate-900">{item.mpn}</div>
                      <div className="text-xs text-slate-500">{item.manufacturer}</div>
                      <div className="text-xs text-slate-700 mt-1">
                        Qty Req: <span className="font-mono font-semibold">{item.requiredQuantity?.toLocaleString()}</span> pcs
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (item.mpn) {
                          // remove
                        }
                      }}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {draftRfqItems.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                <button
                  onClick={() => {
                    setRfqDrawerOpen(false);
                    navigateTo('/rfq/new');
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Proceed to Full RFQ Form & Delivery Details
                </button>
                <button
                  onClick={() => setRfqDrawerOpen(false)}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  Continue Browsing Components
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
