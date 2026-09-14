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
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ManufacturerDetailPage,
  CategoryDetailPage,
  SupplierDirectoryDetailPage,
  ResourcesPage,
  BlogPage,
  BlogPostPage,
} from './components/public/InfoPages';

// Customer Portal Pages
import {
  CustomerDashboard,
  CustomerRfqsList,
  CustomerRfqDetail,
  CustomerQuotationsList,
  CustomerQuotationDetail,
  CustomerOrdersList,
  CustomerOrderDetail,
  CustomerSavedParts,
  CustomerAlerts,
  CustomerPurchaseHistory,
  CustomerDocuments,
  CustomerCompanyUsers,
  CustomerSettings,
  CustomerNotifications,
} from './components/customer/CustomerPages';

// Supplier Portal Pages
import {
  SupplierDashboard,
  SupplierInventoryList,
  SupplierInventoryDetail,
  SupplierInventoryUpload,
  SupplierLots,
  SupplierQuotations,
  SupplierOrders,
  SupplierDocuments,
  SupplierAnalytics,
  SupplierProfile,
  SupplierSettings,
  SupplierNotifications,
  SupplierOnboarding,
  SupplierKYC,
} from './components/supplier/SupplierPages';

// Admin Portal Pages
import {
  AdminDashboard,
  AdminLandedCostEngine,
  AdminAuditLogs,
  AdminRfqsList,
  AdminRfqDetail,
  AdminQCPage,
  AdminCustomers,
  AdminCustomerDetail,
  AdminSuppliers,
  AdminSupplierDetail,
  AdminProducts,
  AdminProductDetail,
  AdminCategories,
  AdminInventory,
  AdminInventoryDetail,
  AdminBom,
  AdminVendorRfqs,
  AdminVendorRfqDetail,
  AdminSupplierQuotations,
  AdminSupplierQuotationDetail,
  AdminCustomerQuotations,
  AdminCustomerQuotationDetail,
  AdminSalesOrders,
  AdminSalesOrderDetail,
  AdminPurchaseOrders,
  AdminPurchaseOrderDetail,
  AdminWarehouse,
  AdminDispatch,
  AdminInvoices,
  AdminPayments,
  AdminReports,
  AdminDocuments,
  AdminUsersRoles,
  AdminSettings,
} from './components/admin/AdminPages';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderRoute = () => {
    // ── Public Routes ──────────────────────────────────────────────────────────
    if (currentRoute === '/' || currentRoute === '') return <HomePage />;
    if (currentRoute === '/search') return <SearchPage />;
    if (currentRoute === '/search/results') return <SearchResultsPage />;
    if (currentRoute.startsWith('/part/')) return <PartDetailPage />;
    if (currentRoute === '/bom/upload') return <BomUploadPage />;
    if (currentRoute === '/rfq/new') return <RfqNewPage />;
    if (currentRoute === '/manufacturers') return <ManufacturersPage />;
    if (currentRoute.startsWith('/manufacturer/')) return <ManufacturerDetailPage />;
    if (currentRoute === '/categories') return <CategoriesPage />;
    if (currentRoute.startsWith('/category/')) return <CategoryDetailPage />;
    if (currentRoute === '/suppliers') return <SuppliersPage />;
    if (currentRoute.startsWith('/supplier/dir/')) return <SupplierDirectoryDetailPage />;
    if (currentRoute === '/excess-inventory') return <ExcessInventoryPage />;
    if (currentRoute === '/global-sourcing') return <GlobalSourcingPage />;
    if (currentRoute === '/alerts') return <PartAlertsPage />;
    if (currentRoute === '/resources') return <ResourcesPage />;
    if (currentRoute === '/blog') return <BlogPage />;
    if (currentRoute.startsWith('/blog/')) return <BlogPostPage />;
    if (currentRoute === '/about') return <AboutPage />;
    if (currentRoute === '/how-it-works') return <HowItWorksPage />;
    if (currentRoute === '/for-suppliers') return <ForSuppliersPage />;
    if (currentRoute === '/for-oem-ems') return <ForOemEmsPage />;
    if (currentRoute === '/contact') return <ContactPage />;

    // ── Auth Routes ────────────────────────────────────────────────────────────
    if (currentRoute === '/auth/login') return <AuthDemoPage />;
    if (currentRoute === '/auth/register') return <RegisterPage />;
    if (currentRoute === '/auth/forgot-password') return <ForgotPasswordPage />;
    if (currentRoute === '/auth/reset-password') return <ResetPasswordPage />;

    // ── Customer Portal Routes ─────────────────────────────────────────────────
    if (currentRoute === '/customer/dashboard') return <CustomerDashboard />;
    if (currentRoute === '/customer/rfqs') return <CustomerRfqsList />;
    if (currentRoute.startsWith('/customer/rfqs/')) return <CustomerRfqDetail />;
    if (currentRoute === '/customer/quotations') return <CustomerQuotationsList />;
    if (currentRoute.startsWith('/customer/quotations/')) return <CustomerQuotationDetail />;
    if (currentRoute === '/customer/orders') return <CustomerOrdersList />;
    if (currentRoute.startsWith('/customer/orders/')) return <CustomerOrderDetail />;
    if (currentRoute === '/customer/boms') return <BomUploadPage />;
    if (currentRoute === '/customer/saved-parts') return <CustomerSavedParts />;
    if (currentRoute === '/customer/alerts') return <CustomerAlerts />;
    if (currentRoute === '/customer/history') return <CustomerPurchaseHistory />;
    if (currentRoute === '/customer/documents') return <CustomerDocuments />;
    if (currentRoute === '/customer/users') return <CustomerCompanyUsers />;
    if (currentRoute === '/customer/settings') return <CustomerSettings />;
    if (currentRoute === '/customer/notifications') return <CustomerNotifications />;

    // ── Supplier Portal Routes ─────────────────────────────────────────────────
    if (currentRoute === '/supplier/dashboard') return <SupplierDashboard />;
    if (currentRoute === '/supplier/onboarding') return <SupplierOnboarding />;
    if (currentRoute === '/supplier/kyc') return <SupplierKYC />;
    if (currentRoute === '/supplier/inventory') return <SupplierInventoryList />;
    if (currentRoute.startsWith('/supplier/inventory/')) return <SupplierInventoryDetail />;
    if (currentRoute === '/supplier/inventory/upload') return <SupplierInventoryUpload />;
    if (currentRoute === '/supplier/lots') return <SupplierLots />;
    if (currentRoute === '/supplier/quotations') return <SupplierQuotations />;
    if (currentRoute === '/supplier/orders') return <SupplierOrders />;
    if (currentRoute === '/supplier/documents') return <SupplierDocuments />;
    if (currentRoute === '/supplier/analytics') return <SupplierAnalytics />;
    if (currentRoute === '/supplier/profile') return <SupplierProfile />;
    if (currentRoute === '/supplier/settings') return <SupplierSettings />;
    if (currentRoute === '/supplier/notifications') return <SupplierNotifications />;

    // ── Admin / Operations Portal Routes ──────────────────────────────────────
    if (currentRoute === '/admin/dashboard') return <AdminDashboard />;
    if (currentRoute === '/admin/rfqs') return <AdminRfqsList />;
    if (currentRoute.startsWith('/admin/rfqs/')) return <AdminRfqDetail />;
    if (currentRoute === '/admin/vendor-rfqs') return <AdminVendorRfqs />;
    if (currentRoute.startsWith('/admin/vendor-rfqs/')) return <AdminVendorRfqDetail />;
    if (currentRoute === '/admin/supplier-quotations') return <AdminSupplierQuotations />;
    if (currentRoute.startsWith('/admin/supplier-quotations/')) return <AdminSupplierQuotationDetail />;
    if (currentRoute === '/admin/customer-quotations') return <AdminCustomerQuotations />;
    if (currentRoute.startsWith('/admin/customer-quotations/')) return <AdminCustomerQuotationDetail />;
    if (currentRoute === '/admin/sales-orders') return <AdminSalesOrders />;
    if (currentRoute.startsWith('/admin/sales-orders/')) return <AdminSalesOrderDetail />;
    if (currentRoute === '/admin/purchase-orders') return <AdminPurchaseOrders />;
    if (currentRoute.startsWith('/admin/purchase-orders/')) return <AdminPurchaseOrderDetail />;
    if (currentRoute === '/admin/qc') return <AdminQCPage />;
    if (currentRoute === '/admin/warehouse') return <AdminWarehouse />;
    if (currentRoute === '/admin/dispatch') return <AdminDispatch />;
    if (currentRoute === '/admin/landed-cost') return <AdminLandedCostEngine />;
    if (currentRoute === '/admin/invoices') return <AdminInvoices />;
    if (currentRoute === '/admin/payments') return <AdminPayments />;
    if (currentRoute === '/admin/customers') return <AdminCustomers />;
    if (currentRoute.startsWith('/admin/customers/')) return <AdminCustomerDetail />;
    if (currentRoute === '/admin/suppliers') return <AdminSuppliers />;
    if (currentRoute.startsWith('/admin/suppliers/')) return <AdminSupplierDetail />;
    if (currentRoute === '/admin/inventory') return <AdminInventory />;
    if (currentRoute.startsWith('/admin/inventory/')) return <AdminInventoryDetail />;
    if (currentRoute === '/admin/bom') return <AdminBom />;
    if (currentRoute === '/admin/products') return <AdminProducts />;
    if (currentRoute.startsWith('/admin/products/')) return <AdminProductDetail />;
    if (currentRoute === '/admin/categories') return <AdminCategories />;
    if (currentRoute === '/admin/reports') return <AdminReports />;
    if (currentRoute === '/admin/documents') return <AdminDocuments />;
    if (currentRoute === '/admin/users') return <AdminUsersRoles />;
    if (currentRoute === '/admin/settings') return <AdminSettings />;
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
