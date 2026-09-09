import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CompareDrawer } from './components/common/CompareDrawer';
import { ToastContainer } from './components/common/ToastContainer';

// Public Pages
import { HomePage } from './components/public/HomePage';
import { SearchPage } from './components/public/SearchPage';
import { SearchResultsPage } from './components/public/SearchResultsPage';
import { PartDetailPage } from './components/public/PartDetailPage';
import { BomUploadPage } from './components/public/BomUploadPage';
import { RfqNewPage } from './components/public/RfqNewPage';
import {
  ManufacturersPage,
  CategoriesPage,
  SuppliersPage,
} from './components/public/DirectoryPages';
import { ExcessInventoryPage } from './components/public/ExcessInventoryPage';
import { GlobalSourcingPage } from './components/public/GlobalSourcingPage';
import { PartAlertsPage } from './components/public/PartAlertsPage';
import {
  AboutPage,
  HowItWorksPage,
  ForSuppliersPage,
  ForOemEmsPage,
  ContactPage,
  AuthDemoPage,
} from './components/public/InfoPages';

// Customer Portal Pages
import {
  CustomerDashboard,
  CustomerRfqsList,
  CustomerRfqDetail,
  CustomerQuotationDetail,
  CustomerOrderDetail,
} from './components/customer/CustomerPages';

// Supplier Portal Pages
import {
  SupplierDashboard,
  SupplierInventoryUpload,
  SupplierRfqs,
  SupplierPerformance,
} from './components/supplier/SupplierPages';

// Admin Portal Pages
import {
  AdminDashboard,
  AdminLandedCostEngine,
  AdminAuditLogs,
} from './components/admin/AdminPages';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderRoute = () => {
    // Exact & Dynamic Route Matching
    if (currentRoute === '/' || currentRoute === '') return <HomePage />;
    if (currentRoute === '/search') return <SearchPage />;
    if (currentRoute === '/search/results') return <SearchResultsPage />;
    if (currentRoute.startsWith('/part/')) return <PartDetailPage />;
    if (currentRoute === '/bom/upload') return <BomUploadPage />;
    if (currentRoute === '/rfq/new') return <RfqNewPage />;
    if (currentRoute === '/manufacturers') return <ManufacturersPage />;
    if (currentRoute === '/categories') return <CategoriesPage />;
    if (currentRoute === '/suppliers') return <SuppliersPage />;
    if (currentRoute === '/excess-inventory') return <ExcessInventoryPage />;
    if (currentRoute === '/global-sourcing') return <GlobalSourcingPage />;
    if (currentRoute === '/alerts') return <PartAlertsPage />;
    if (currentRoute === '/about') return <AboutPage />;
    if (currentRoute === '/how-it-works') return <HowItWorksPage />;
    if (currentRoute === '/for-suppliers') return <ForSuppliersPage />;
    if (currentRoute === '/for-oem-ems') return <ForOemEmsPage />;
    if (currentRoute === '/contact') return <ContactPage />;
    if (currentRoute === '/auth/login') return <AuthDemoPage />;

    // Customer Portal Routes
    if (currentRoute === '/customer/dashboard') return <CustomerDashboard />;
    if (currentRoute === '/customer/rfqs') return <CustomerRfqsList />;
    if (currentRoute.startsWith('/customer/rfqs/')) return <CustomerRfqDetail />;
    if (currentRoute === '/customer/quotations') return <CustomerDashboard />;
    if (currentRoute.startsWith('/customer/quotations/')) return <CustomerQuotationDetail />;
    if (currentRoute === '/customer/orders') return <CustomerDashboard />;
    if (currentRoute.startsWith('/customer/orders/')) return <CustomerOrderDetail />;
    if (currentRoute === '/customer/boms') return <BomUploadPage />;

    // Supplier Portal Routes
    if (currentRoute === '/supplier/dashboard') return <SupplierDashboard />;
    if (currentRoute === '/supplier/inventory') return <SupplierDashboard />;
    if (currentRoute === '/supplier/inventory/upload') return <SupplierInventoryUpload />;
    if (currentRoute === '/supplier/rfqs') return <SupplierRfqs />;
    if (currentRoute === '/supplier/performance') return <SupplierPerformance />;

    // Admin / Operations Portal Routes
    if (currentRoute === '/admin/dashboard') return <AdminDashboard />;
    if (currentRoute === '/admin/landed-cost') return <AdminLandedCostEngine />;
    if (currentRoute === '/admin/rfqs') return <AdminDashboard />;
    if (currentRoute === '/admin/qc') return <AdminDashboard />;
    if (currentRoute === '/admin/audit') return <AdminAuditLogs />;

    // Default Fallback
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">{renderRoute()}</main>
      <Footer />
      <CompareDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
