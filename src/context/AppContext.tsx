import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PortalType,
  AdminRole,
  AuthUser,
  ElectronicComponent,
  CustomerRfq,
  CustomerQuotation,
  CustomerOrder,
  PartAlert,
  ToastMessage,
  RfqLineItem,
} from '../types';
import { api, refreshSession, setAccessToken } from '../lib/api';
import {
  MOCK_COMPONENTS,
  MOCK_CUSTOMER_RFQS,
  MOCK_CUSTOMER_QUOTATION,
  MOCK_CUSTOMER_QUOTATIONS,
  MOCK_ORDERS,
  MOCK_PART_ALERTS,
  MOCK_SUPPLIER_QUOTES,
} from '../data/mockData';
import { demoFlatMarginPricingService } from '../services/quotationPricing';

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
  customerQuotations: CustomerQuotation[];
  createCustomerQuotationFromRfq: (rfqId: string, quoteIds: string[]) => string;
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
  authUser: AuthUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  registerCustomer: (input: RegisterCustomerInput) => Promise<AuthUser>;
  registerSupplier: (input: RegisterSupplierInput) => Promise<AuthUser>;
}

interface RegisterCustomerInput {
  email: string;
  password: string;
  name: string;
  companyName: string;
  phone?: string;
  gstNumber?: string;
}

interface RegisterSupplierInput extends RegisterCustomerInput {
  city?: string;
  state?: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portal, setPortal] = useState<PortalType>('public');
  const [currentRoute, setCurrentRoute] = useState<string>(() => window.location.pathname || '/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({ mpn: 'LM358DR', id: 'rfq-101' });
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [searchQuery, setSearchQuery] = useState<string>('LM358DR');

  const [components, setComponents] = useState<ElectronicComponent[]>(MOCK_COMPONENTS);
  const [rfqs, setRfqs] = useState<CustomerRfq[]>(MOCK_CUSTOMER_RFQS);
  const [activeQuotation, setActiveQuotation] = useState<CustomerQuotation>(MOCK_CUSTOMER_QUOTATION);
  const [customerQuotations, setCustomerQuotations] = useState<CustomerQuotation[]>(MOCK_CUSTOMER_QUOTATIONS);
  const [orders] = useState<CustomerOrder[]>(MOCK_ORDERS);
  const [partAlerts, setPartAlerts] = useState<PartAlert[]>(MOCK_PART_ALERTS);

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [savedParts, setSavedParts] = useState<string[]>(['LM358DR', 'STM32F103C8T6']);
  const [compareList, setCompareList] = useState<string[]>(['LM358DR']);
  const [draftRfqItems, setDraftRfqItems] = useState<Partial<RfqLineItem>[]>([
    {
      id: 'li-' + Date.now(),
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

  // On mount, silently exchange the httpOnly refresh cookie (if any) for a fresh access
  // token — this is what lets a real backend session survive a browser refresh even though
  // the access token itself is kept in memory only (see src/lib/api.ts).
  useEffect(() => {
    (async () => {
      const refreshed = await refreshSession();
      if (refreshed) {
        try {
          const me = await api.get<AuthUser>('/api/auth/me');
          setAuthUser(me);
        } catch {
          setAuthUser(null);
        }
      }
      setAuthLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const { accessToken } = await api.post<{ accessToken: string }>('/api/auth/login', { email, password });
    setAccessToken(accessToken);
    const me = await api.get<AuthUser>('/api/auth/me');
    setAuthUser(me);
    addToast('Signed In', `Welcome back, ${me.name}.`, 'success');
    return me;
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Best-effort: clear local session state regardless of whether the network call succeeded.
    }
    setAccessToken(null);
    setAuthUser(null);
    addToast('Signed Out', 'Your session has been ended.', 'info');
  };

  const registerCustomer = async (input: RegisterCustomerInput): Promise<AuthUser> => {
    const { accessToken } = await api.post<{ accessToken: string }>('/api/auth/register/customer', input);
    setAccessToken(accessToken);
    const me = await api.get<AuthUser>('/api/auth/me');
    setAuthUser(me);
    addToast('Account Created', `Welcome to OEMInventory, ${me.name}.`, 'success');
    return me;
  };

  const registerSupplier = async (input: RegisterSupplierInput): Promise<AuthUser> => {
    const { accessToken } = await api.post<{ accessToken: string }>('/api/auth/register/supplier', input);
    setAccessToken(accessToken);
    const me = await api.get<AuthUser>('/api/auth/me');
    setAuthUser(me);
    addToast('Supplier Account Created', `Welcome to OEMInventory, ${me.name}.`, 'success');
    return me;
  };

  useEffect(() => {
    const onPop = () => setCurrentRoute(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigateTo = (route: string, params?: Record<string, string>) => {
    history.pushState(null, '', route);
    setCurrentRoute(route);
    if (params) {
      setRouteParams((prev) => ({ ...prev, ...params }));
    }
    if (route.startsWith('/customer')) {
      setPortal('customer');
    } else if (route.startsWith('/supplier')) {
      setPortal('supplier');
    } else if (route.startsWith('/admin')) {
      setPortal('admin');
    } else {
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
      customerName: rfqData.customerName || 'Demo User A (Procurement)',
      companyName: rfqData.companyName || 'Demo Company A (IoT & Telematics)',
      email: rfqData.email || 'buyer@democompany-a.example',
      phone: rfqData.phone || '+91 90000 00001',
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

  const createCustomerQuotationFromRfq = (rfqId: string, quoteIds: string[]): string => {
    const rfq = rfqs.find((r) => r.id === rfqId);
    if (!rfq) return '';

    const selectedQuotes = MOCK_SUPPLIER_QUOTES.filter((q) => quoteIds.includes(q.id));
    const priced = demoFlatMarginPricingService.priceQuotation(rfq, selectedQuotes, MOCK_COMPONENTS);

    const newId = `quote-${Date.now()}`;
    const newNumber = `Q-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuotation: CustomerQuotation = {
      id: newId,
      quoteNumber: newNumber,
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      customerName: rfq.companyName,
      customerGst: 'XXDEMO00000X1ZX',
      validUntil: rfq.requiredDate,
      currency: rfq.currency,
      items: priced.items,
      subtotalInr: priced.subtotalInr,
      freightInr: priced.freightInr,
      gstInr: priced.gstInr,
      totalInr: priced.totalInr,
      paymentTerms: rfq.paymentTerms,
      approvalStatus: 'Draft',
      isDemoCalculation: priced.isDemoCalculation,
      calculationLabel: priced.calculationLabel,
      negotiationLog: [],
    };

    setCustomerQuotations((prev) => [newQuotation, ...prev]);
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status: 'Customer Quotation' } : r))
    );
    addToast('Customer Quotation Created (Demo Calculation)', `${newNumber} generated from ${rfq.rfqNumber} with ${priced.items.length} line item(s). Flat margin applied — not the Landed Cost Engine.`, 'warning');
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
          actor: 'Demo User A (Customer)',
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
        customerQuotations,
        createCustomerQuotationFromRfq,
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
        authUser,
        authLoading,
        login,
        logout,
        registerCustomer,
        registerSupplier,
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
