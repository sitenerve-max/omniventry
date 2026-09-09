import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRight, Layers } from 'lucide-react';

export const CompareDrawer: React.FC = () => {
  const { compareList, toggleComparePart, clearCompare, components, addPartToDraftRfq, navigateTo } = useApp();

  if (compareList.length === 0) return null;

  const comparedParts = components.filter((c) => compareList.includes(c.mpn));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-700 text-white shadow-2xl transition-transform animate-in slide-in-from-bottom duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm">Part Comparison Tray ({compareList.length}/4)</span>
            <span className="text-xs text-slate-400 hidden sm:inline">Compare technical parameters, stock availability and packaging</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {comparedParts.map((part) => (
            <div
              key={part.id}
              className="bg-slate-800/90 border border-slate-700 rounded p-2.5 flex flex-col justify-between relative"
            >
              <button
                onClick={() => toggleComparePart(part.mpn)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div>
                <div className="font-mono text-cyan-400 font-semibold text-xs truncate pr-4">{part.mpn}</div>
                <div className="text-[11px] text-slate-300 truncate">{part.manufacturer}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Pkg: <span className="text-slate-200">{part.package}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Stock: <span className="font-mono text-emerald-400 font-medium">{part.totalAvailableQuantity.toLocaleString()} pcs</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  MOQ: <span className="font-mono text-slate-200">{part.moq}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1">
                <button
                  onClick={() => navigateTo(`/part/${part.mpn}`, { mpn: part.mpn })}
                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  Details <ArrowRight className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => addPartToDraftRfq({ mpn: part.mpn, manufacturer: part.manufacturer })}
                  className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-medium"
                >
                  + RFQ
                </button>
              </div>
            </div>
          ))}

          {/* Placeholder slots up to 4 */}
          {Array.from({ length: Math.max(0, 4 - comparedParts.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border border-dashed border-slate-800 rounded p-3 flex items-center justify-center text-xs text-slate-500 text-center"
            >
              + Select another part to compare
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
