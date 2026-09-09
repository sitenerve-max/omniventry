import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  Pause,
  Play,
  Mail,
  Phone,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { PartAlert } from '../../types';

export const PartAlertsPage: React.FC = () => {
  const { partAlerts, addToast } = useApp();
  const [alerts, setAlerts] = useState<PartAlert[]>(partAlerts);

  const [newMpn, setNewMpn] = useState('');
  const [targetQty, setTargetQty] = useState('2500');
  const [selectedMfg, setSelectedMfg] = useState('');
  const [emailAlert, setEmailAlert] = useState(true);
  const [whatsappAlert, setWhatsappAlert] = useState(true);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMpn.trim()) return;

    const newAlert: PartAlert = {
      id: 'alt-' + Date.now(),
      mpn: newMpn.trim().toUpperCase(),
      targetQuantity: parseInt(targetQty) || 1000,
      preferredManufacturer: selectedMfg || 'Any Verified Mfg',
      channels: [
        ...(emailAlert ? ['Email' as const] : []),
        ...(whatsappAlert ? ['WhatsApp' as const] : []),
        'Portal' as const,
      ],
      status: 'Active',
      createdAt: 'Just now',
    };

    setAlerts([newAlert, ...alerts]);
    setNewMpn('');
    addToast('Shortage Alert Activated', `Monitoring Indian stockists for ${newAlert.mpn}.`, 'success');
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    addToast('Alert Removed', 'Part alert deleted from your profile.', 'info');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Customer Tools</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Part Shortage & Restock Alerts</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Component Restock & Shortage Alerts</h1>
          <p className="text-xs text-slate-600 mt-1">
            Receive automated real-time notifications via WhatsApp, Email, and Customer Portal the instant verified stock arrives at any Indian warehouse.
          </p>
        </div>

        {/* Create Alert Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            Set New Component Alert
          </h3>

          <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">MPN *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STM32F103C8T6"
                  value={newMpn}
                  onChange={(e) => setNewMpn(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Minimum Quantity</label>
                <input
                  type="number"
                  value={targetQty}
                  onChange={(e) => setTargetQty(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. STMicroelectronics"
                  value={selectedMfg}
                  onChange={(e) => setSelectedMfg(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                />
              </div>
            </div>

            {/* Notification Channels */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">Notification Channels</label>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlert}
                    onChange={(e) => setEmailAlert(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Email Notification</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappAlert}
                    onChange={(e) => setWhatsappAlert(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <span>WhatsApp Alert (Priority Instant)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" checked disabled className="rounded border-slate-300 text-blue-600" />
                  <span>Customer Portal Feed (Always On)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Activate Part Alert
            </button>
          </form>
        </div>

        {/* Existing Alerts List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center justify-between">
            <span>Your Active Component Alerts ({alerts.length})</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div key={alert.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{alert.mpn}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        alert.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    Target Volume: <strong className="font-mono text-slate-800">{alert.targetQuantity.toLocaleString()} pcs</strong> • Channels: {alert.channels.join(', ')}
                  </div>
                  {alert.lastTriggered && (
                    <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Last Trigger: {alert.lastTriggered}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlertStatus(alert.id)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-xs flex items-center gap-1"
                  >
                    {alert.status === 'Active' ? (
                      <>
                        <Pause className="w-3 h-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Resume
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
