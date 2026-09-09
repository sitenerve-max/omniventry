export type PortalType = 'public' | 'customer' | 'supplier' | 'admin';

export type AdminRole =
  | 'Super Admin'
  | 'Sales Manager'
  | 'Sales Executive'
  | 'Purchase Manager'
  | 'Purchase Executive'
  | 'Inventory Manager'
  | 'Finance Manager';

export type InventoryConfidence = 'Verified Stock' | 'Supplier Reported' | 'Verification Required' | 'Inactive / Expired';

export type PartCondition = 'New & Original' | 'Factory Sealed' | 'Refurbished' | 'Excess Stock';

export type RfqStatus =
  | 'Draft'
  | 'Submitted'
  | 'Supplier Matching'
  | 'Vendor RFQ Sent'
  | 'Supplier Response'
  | 'Under Evaluation'
  | 'Customer Quotation'
  | 'Negotiation'
  | 'Accepted'
  | 'PO Received'
  | 'Purchase'
  | 'QC'
  | 'Dispatch'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'
  | 'Expired';

export type OrderStatus =
  | 'Accepted'
  | 'Purchase'
  | 'QC'
  | 'Warehouse'
  | 'Dispatch'
  | 'Invoice'
  | 'Completed'
  | 'On Hold';

export type QcStatus = 'Passed' | 'Failed' | 'Conditional' | 'Pending';

export interface ComponentLot {
  id: string;
  lotNumber: string;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  dateCode: string;
  packaging: string; // e.g., Tape & Reel, Tube, Tray, Bulk
  condition: PartCondition;
  location: string; // e.g., Bangalore, Pune, Delhi NCR, Singapore
  countryOfOrigin: string;
  leadTime: string; // e.g., Ready Stock (Same Day), 3-5 Days
  confidence: InventoryConfidence;
  supplierId: string;
  supplierName: string;
  supplierType: string;
  isAnonymousSupplier: boolean;
  gstVerified: boolean;
  supplierScore: number; // 0-100
  unitPriceEstimateInr?: number; // Internal or indicative range
  rohs: boolean;
  reach: boolean;
  certificateAvailable: boolean;
}

export interface ElectronicComponent {
  id: string;
  mpn: string;
  normalizedMpn: string;
  manufacturer: string;
  description: string;
  category: string;
  subcategory: string;
  package: string;
  mountingType: string;
  lifecycle: 'Active' | 'NRND' | 'Obsolete' | 'End of Life';
  rohsCompliant: boolean;
  reachCompliant: boolean;
  datasheetUrl?: string;
  totalAvailableQuantity: number;
  moq: number;
  matchType?: 'Exact Match' | 'Manufacturer Alternative' | 'Equivalent Part' | 'Similar Specification';
  lots: ComponentLot[];
  specifications: Record<string, string>;
  applications?: string[];
  suggestedAlternatives?: string[];
}

export interface RfqLineItem {
  id: string;
  mpn: string;
  manufacturer: string;
  requiredQuantity: number;
  targetDate?: string;
  targetPriceInr?: number;
  preferredSupplier?: string;
  dateCodeRequirement?: string;
  packagingRequirement?: string;
  qualityRequirement?: string;
  notes?: string;
  status: 'Pending' | 'Quoted' | 'Negotiating' | 'Accepted' | 'Declined';
  quotedPriceInr?: number;
}

export interface CustomerRfq {
  id: string;
  rfqNumber: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  requiredDate: string;
  deliveryLocation: string;
  currency: 'INR' | 'USD';
  paymentTerms: string;
  remarks: string;
  status: RfqStatus;
  lineItems: RfqLineItem[];
  matchedSuppliersCount: number;
  receivedQuotesCount: number;
  attachments?: string[];
  historyTimeline: {
    timestamp: string;
    stage: string;
    description: string;
    actor: string;
  }[];
}

export interface SupplierQuotationItem {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierScore: number;
  gstVerified: boolean;
  country: string;
  mpn: string;
  availableQuantity: number;
  unitPrice: number;
  currency: 'INR' | 'USD';
  moq: number;
  dateCode: string;
  leadTime: string;
  packaging: string;
  condition: PartCondition;
  qualityScore: number;
  warranty: string;
  notes?: string;
  categoryTag?: 'Best Commercial' | 'Best Quality' | 'Best Lead Time' | 'Best Overall' | 'Alternative';
}

export interface LandedCostBreakdown {
  purchaseCost: number;
  currency: 'INR' | 'USD';
  exchangeRate: number; // e.g., 86.5
  bankCharges: number;
  freightCost: number;
  insuranceCost: number;
  customsDutyPercent: number; // BCD %
  customsDutyAmount: number;
  swsPercent: number; // Social Welfare Surcharge (10% of BCD)
  swsAmount: number;
  otherImportCharges: number;
  localTransport: number;
  inspectionQcCost: number;
  financingCost: number;
  riskMarginPercent: number;
  riskMarginAmount: number;
  platformMarginPercent: number;
  platformMarginAmount: number;
  totalLandedCost: number;
  gstPercent: number; // 18%
  gstAmount: number;
  finalCustomerPrice: number;
}

export interface CustomerQuotation {
  id: string;
  quoteNumber: string;
  rfqId: string;
  rfqNumber: string;
  customerName: string;
  customerGst: string;
  validUntil: string;
  currency: 'INR' | 'USD';
  items: {
    mpn: string;
    manufacturer: string;
    description: string;
    quantity: number;
    unitPriceInr: number;
    totalPriceInr: number;
    dateCode: string;
    countryOfOrigin: string;
    leadTime: string;
    warranty: string;
  }[];
  subtotalInr: number;
  freightInr: number;
  gstInr: number;
  totalInr: number;
  paymentTerms: string;
  approvalStatus: 'Draft' | 'Pending Sales Manager' | 'Pending Director' | 'Approved' | 'Rejected';
  negotiationLog: {
    id: string;
    timestamp: string;
    actor: string;
    type: 'Price Counter' | 'Alternate Requested' | 'Quantity Revision' | 'Terms Update';
    note: string;
    status: 'Pending Review' | 'Accepted' | 'Declined';
  }[];
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerPoNumber: string;
  rfqNumber: string;
  quoteNumber: string;
  customerName: string;
  totalAmountInr: number;
  orderDate: string;
  expectedDelivery: string;
  status: OrderStatus;
  currentStepIndex: number; // 0 to 6
  deliveryAddress: string;
  carrier: string;
  trackingNumber: string;
  items: {
    mpn: string;
    manufacturer: string;
    quantity: number;
    unitPriceInr: number;
  }[];
}

export interface QcInspectionRecord {
  id: string;
  orderId: string;
  mpn: string;
  lotNumber: string;
  inspector: string;
  inspectionDate: string;
  status: QcStatus;
  checklists: {
    name: string;
    passed: boolean;
    notes: string;
  }[];
  notes: string;
}

export interface AuditLogRow {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  reason: string;
  ipAddress: string;
}

export interface PartAlert {
  id: string;
  mpn: string;
  targetQuantity: number;
  preferredManufacturer?: string;
  preferredLocation?: string;
  channels: ('Email' | 'WhatsApp' | 'Portal' | 'SMS')[];
  status: 'Active' | 'Paused';
  createdAt: string;
  lastTriggered?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
