import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  PortalType,
  AdminRole,
  ElectronicComponent,
  CustomerRfq,
  CustomerQuotation,
  CustomerOrder,
  PartAlert,
  ToastMessage,
  RfqLineItem,
} from '../types';
import {
  MOCK_COMPONENTS,
  MOCK_CUSTOMER_RFQS,
  MOCK_CUSTOMER_QUOTATION,
  MOCK_ORDERS,
  MOCK_PART_ALERTS,
} from '../data/mockData';

interface AppContextType {
  portal: PortalType;
  setPortal: (p: PortalType) => void;
  currentRoute: string;
  routeParams: Record<string, string>;
  navigateTo: (route: string, params?: Record<string, string>) => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  components: ElectronicComponent[];
  rfqs: CustomerRfq[];
  activeQuotation: CustomerQuotation;
  orders: CustomerOrder[];
  partAlerts: PartAlert[];
  savedParts: string[];
  toggleSavePart: (mpn: string) => void;
  compareList: string[];
  toggleComparePart: (mpn: string) => void;
  clearCompare: () => void;
  draftRfqItems: Partial<RfqLineItem>[];
  addPartToDraftRfq: (part: { mpn: string; manufacturer: string; requiredQuantity?: number }) => void;
  removeDraftRfqItem: (mpn: string) => void;
  submitNewRfq: (rfqData: Partial<CustomerRfq>) => string;
  submitNegotiation: (note: string, type: 'Price Counter' | 'Alternate Requested' | 'Quantity Revision') => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  hasPermission: (action: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portal, setPortal] = useState<PortalType>('public');
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({ mpn: 'LM358DR', id: 'rfq-101' });
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [searchQuery, setSearchQuery] = useState<string>('LM358DR');

  const [components, setComponents] = useState<ElectronicComponent[]>(MOCK_COMPONENTS);
  const [rfqs, setRfqs] = useState<CustomerRfq[]>(MOCK_CUSTOMER_RFQS);
  const [activeQuotation, setActiveQuotation] = useState<CustomerQuotation>(MOCK_CUSTOMER_QUOTATION);
  const [orders] = useState<CustomerOrder[]>(MOCK_ORDERS);
  const [partAlerts, setPartAlerts] = useState<PartAlert[]>(MOCK_PART_ALERTS);

  const [savedParts, setSavedParts] = useState<string[]>(['LM358DR', 'STM32F103C8T6']);
  const [compareList, setCompareList] = useState<string[]>(['LM358DR']);
  const [draftRfqItems, setDraftRfqItems] = useState<Partial<RfqLineItem>[]>([
    {
      mpn: 'LM358DR',
      manufacturer: 'Texas Instruments',
      requiredQuantity: 10000,
      targetPriceInr: 4.50,
      packagingRequirement: 'Tape & Reel',
    },
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'welcome-toast',
      type: 'info',
      title: 'Prototype Environment Active',
      message: 'All inventory lots, quotations, and landed-costs are mock demo data for technical procurement review.',
    },
  ]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (route: string, params?: Record<string, string>) => {
    setCurrentRoute(route);
    if (params) {
      setRouteParams((prev) => ({ ...prev, ...params }));
    }
    // Auto sync portal if route begins with a portal prefix
    if (route.startsWith('/customer')) {
      setPortal('customer');
    } else if (route.startsWith('/supplier')) {
      setPortal('supplier');
    } else if (route.startsWith('/admin')) {
      setPortal('admin');
    } else {
      // Check if switching to a public route
      if (!['customer', 'supplier', 'admin'].includes(portal)) {
        setPortal('public');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSavePart = (mpn: string) => {
    setSavedParts((prev) => {
      if (prev.includes(mpn)) {
        addToast('Part Removed', `${mpn} removed from your saved list.`, 'info');
        return prev.filter((p) => p !== mpn);
      } else {
        addToast('Part Saved', `${mpn} added to your saved watchlist.`, 'success');
        return [...prev, mpn];
      }
    });
  };

  const toggleComparePart = (mpn: string) => {
    setCompareList((prev) => {
      if (prev.includes(mpn)) {
        return prev.filter((p) => p !== mpn);
      } else {
        if (prev.length >= 4) {
          addToast('Compare Limit', 'You can compare up to 4 components simultaneously.', 'warning');
          return prev;
        }
        addToast('Added to Compare', `${mpn} added to comparison drawer.`, 'info');
        return [...prev, mpn];
      }
    });
  };

  const clearCompare = () => setCompareList([]);

  const addPartToDraftRfq = (part: { mpn: string; manufacturer: string; requiredQuantity?: number }) => {
    setDraftRfqItems((prev) => {
      if (prev.some((item) => item.mpn?.toUpperCase() === part.mpn.toUpperCase())) {
        addToast('Already in Draft RFQ', `${part.mpn} is already present in your draft RFQ items.`, 'warning');
        return prev;
      }
      addToast('Added to RFQ', `${part.mpn} added to draft RFQ line items.`, 'success');
      return [
        ...prev,
        {
          id: 'li-' + Date.now(),
          mpn: part.mpn,
          manufacturer: part.manufacturer,
          requiredQuantity: part.requiredQuantity || 1000,
          status: 'Pending',
        },
      ];
    });
  };

  const removeDraftRfqItem = (mpn: string) => {
    setDraftRfqItems((prev) => prev.filter((i) => i.mpn !== mpn));
    addToast('Item Removed', `${mpn} removed from draft RFQ.`, 'info');
  };

  const submitNewRfq = (rfqData: Partial<CustomerRfq>): string => {
    const newId = `rfq-${Date.now()}`;
    const newNumber = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: CustomerRfq = {
      id: newId,
      rfqNumber: newNumber,
      customerName: rfqData.customerName || 'Priya Sharma (Procurement Head)',
      companyName: rfqData.companyName || 'Bharat IoT & Telematics Pvt Ltd',
      email: rfqData.email || 'priya.s@bharatiot.co.in',
      phone: rfqData.phone || '+91 98450 11223',
      createdAt: 'Just now',
      requiredDate: rfqData.requiredDate || '2026-10-01',
      deliveryLocation: rfqData.deliveryLocation || 'Bangalore, Karnataka',
      currency: 'INR',
      paymentTerms: rfqData.paymentTerms || '30 Days Net',
      remarks: rfqData.remarks || 'Standard production requirement',
      status: 'Submitted',
      lineItems: (draftRfqItems as RfqLineItem[]).map((li, idx) => ({
        ...li,
        id: `li-${Date.now()}-${idx}`,
        status: 'Pending',
      })),
      matchedSuppliersCount: 3,
      receivedQuotesCount: 0,
      historyTimeline: [
        {
          timestamp: 'Just now',
          stage: 'RFQ Submitted',
          description: `Customer submitted RFQ with ${draftRfqItems.length} line items. Matching engine activated.`,
          actor: rfqData.customerName || 'Customer Portal',
        },
      ],
    };

    setRfqs((prev) => [newRfq, ...prev]);
    setDraftRfqItems([]);
    addToast('RFQ Submitted Successfully', `${newNumber} has been logged and sent to verified suppliers.`, 'success');
    return newId;
  };

  const submitNegotiation = (note: string, type: 'Price Counter' | 'Alternate Requested' | 'Quantity Revision') => {
    setActiveQuotation((prev) => ({
      ...prev,
      approvalStatus: 'Pending Sales Manager',
      negotiationLog: [
        {
          id: `neg-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'Priya Sharma (Customer)',
          type,
          note,
          status: 'Pending Review',
        },
        ...prev.negotiationLog,
      ],
    }));
    addToast('Negotiation Request Sent', `Your ${type.toLowerCase()} request was logged in quotation Q-2026-0914.`, 'info');
  };

  const hasPermission = (action: string): boolean => {
    if (adminRole === 'Super Admin') return true;
    if (action === 'edit_margins' || action === 'director_approval') {
      return adminRole === 'Finance Manager' || adminRole === 'Super Admin';
    }
    if (action === 'sales_approval') {
      return ['Super Admin', 'Sales Manager', 'Finance Manager'].includes(adminRole);
    }
    if (action === 'purchase_order_create') {
      return ['Super Admin', 'Purchase Manager', 'Purchase Executive'].includes(adminRole);
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        portal,
        setPortal,
        currentRoute,
        routeParams,
        navigateTo,
        adminRole,
        setAdminRole,
        searchQuery,
        setSearchQuery,
        components,
        rfqs,
        activeQuotation,
        orders,
        partAlerts,
        savedParts,
        toggleSavePart,
        compareList,
        toggleComparePart,
        clearCompare,
        draftRfqItems,
        addPartToDraftRfq,
        removeDraftRfqItem,
        submitNewRfq,
        submitNegotiation,
        toasts,
        addToast,
        removeToast,
        hasPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
