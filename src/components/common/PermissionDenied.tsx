import React from 'react';
import { ShieldX, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PermissionDenied: React.FC<{
  requiredRole?: string;
  actionName?: string;
  onBack?: () => void;
}> = ({ requiredRole = 'Finance Manager or Super Admin', actionName = 'access this financial configuration module', onBack }) => {
  const { adminRole, setAdminRole, navigateTo } = useApp();

  return (
    <div className="bg-white border border-rose-200 rounded-xl p-8 max-w-xl mx-auto my-12 text-center shadow-xs">
      <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
        <ShieldX className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Permission Restricted</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Your current active role <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">[{adminRole}]</span> does not have authorization to {actionName}.
        In accordance with OEMInventory financial security protocols, this action requires <span className="font-semibold text-slate-800">{requiredRole}</span> privilege.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left mb-6 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Prototype Role Simulator:</span> You can switch your active admin role right now using the selector in the top bar, or click below to simulate {requiredRole} rights.
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            if (onBack) onBack();
            else navigateTo('/admin/dashboard');
          }}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        <button
          onClick={() => setAdminRole('Super Admin')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
        >
          Switch to Super Admin (Simulate)
        </button>
      </div>
    </div>
  );
};
