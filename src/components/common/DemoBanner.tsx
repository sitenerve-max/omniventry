import React from 'react';
import { ShieldAlert, Users, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PortalType, AdminRole } from '../../types';

export const DemoBanner: React.FC = () => {
  const { portal, setPortal, adminRole, setAdminRole, navigateTo } = useApp();

  const portals: { id: PortalType; label: string; defaultRoute: string; icon: string }[] = [
    { id: 'public', label: 'Public Portal', defaultRoute: '/', icon: '🌐' },
    { id: 'customer', label: 'Customer Portal (OEM/EMS)', defaultRoute: '/customer/dashboard', icon: '🏢' },
    { id: 'supplier', label: 'Supplier Portal (Stockist)', defaultRoute: '/supplier/dashboard', icon: '📦' },
    { id: 'admin', label: 'Admin & Operations', defaultRoute: '/admin/dashboard', icon: '⚙️' },
  ];

  const adminRoles: AdminRole[] = [
    'Super Admin',
    'Sales Manager',
    'Sales Executive',
    'Purchase Manager',
    'Purchase Executive',
    'Inventory Manager',
    'Finance Manager',
  ];

  return (
    <aside aria-label="Prototype environment notice" className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700/60 text-blue-300 font-mono font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          PROTOTYPE DEMO MODE
        </span>
        <span className="hidden md:inline text-slate-400">
          Realistic mock component records (<span className="font-mono text-slate-200">LM358DR</span>, <span className="font-mono text-slate-200">STM32F103C8T6</span>, <span className="font-mono text-slate-200">TPS54360D</span>, <span className="font-mono text-slate-200">MUR460</span>) for B2B procurement simulation.
        </span>
      </div>

      {/* Switcher Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center bg-slate-800/90 rounded-md p-0.5 border border-slate-700">
          {portals.map((p) => {
            const isActive = portal === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPortal(p.id);
                  navigateTo(p.defaultRoute);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {portal === 'admin' && (
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <Users className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] text-slate-400">Role:</span>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as AdminRole)}
              className="bg-slate-900 text-cyan-300 text-[11px] rounded px-1.5 py-0.5 border border-slate-700 focus:outline-hidden focus:border-cyan-500 font-medium"
            >
              {adminRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => navigateTo('/how-it-works')}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 underline decoration-slate-600 ml-1"
        >
          Workflow Guide <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>
    </aside>
  );
};
