import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
          }
        };

        const getBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white shadow-lg shadow-emerald-950/5';
            case 'error':
              return 'border-rose-200 bg-white shadow-lg shadow-rose-950/5';
            case 'warning':
              return 'border-amber-200 bg-white shadow-lg shadow-amber-950/5';
            case 'info':
            default:
              return 'border-blue-200 bg-white shadow-lg shadow-blue-950/5';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border text-slate-800 transition-all ${getBorder()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
