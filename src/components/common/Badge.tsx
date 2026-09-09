import React from 'react';
import { InventoryConfidence, RfqStatus, OrderStatus, QcStatus } from '../../types';
import { CheckCircle2, AlertTriangle, Clock, XCircle, ShieldCheck } from 'lucide-react';

export const ConfidenceBadge: React.FC<{ confidence: InventoryConfidence; className?: string }> = ({
  confidence,
  className = '',
}) => {
  switch (confidence) {
    case 'Verified Stock':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Verified Stock
        </span>
      );
    case 'Supplier Reported':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        >
          <Clock className="w-3 h-3 text-amber-600" />
          Supplier Reported
        </span>
      );
    case 'Verification Required':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-800 border border-orange-200 ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-orange-600" />
          Verification Required
        </span>
      );
    case 'Inactive / Expired':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
        >
          <XCircle className="w-3 h-3 text-rose-500" />
          Inactive / Expired
        </span>
      );
  }
};

export const RfqStatusBadge: React.FC<{ status: RfqStatus; className?: string }> = ({ status, className = '' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Submitted':
      case 'Supplier Matching':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Vendor RFQ Sent':
      case 'Supplier Response':
      case 'Under Evaluation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Customer Quotation':
        return 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
      case 'Negotiation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Accepted':
      case 'PO Received':
      case 'Purchase':
      case 'QC':
      case 'Dispatch':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
      case 'Rejected':
      case 'Expired':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()} ${className}`}>
      {status}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; className?: string }> = ({ status, className = '' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Accepted':
      case 'Purchase':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'QC':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Warehouse':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Dispatch':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold animate-pulse';
      case 'Invoice':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()} ${className}`}>
      {status}
    </span>
  );
};

export const QcStatusBadge: React.FC<{ status: QcStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'Passed':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          QC Passed
        </span>
      );
    case 'Conditional':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Conditional Approval
        </span>
      );
    case 'Failed':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300 ${className}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          QC Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Pending Inspection
        </span>
      );
  }
};

export const SupplierScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 95) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 90) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 80) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] font-mono font-medium ${getColor()}`}>
      <ShieldCheck className="w-3 h-3" />
      Score: {score}/100
    </span>
  );
};
