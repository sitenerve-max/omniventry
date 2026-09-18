import { CustomerRfq, ElectronicComponent, SupplierQuotationItem } from '../types';

/**
 * Typed seam for customer-quotation pricing. The demo implementation below applies a
 * flat margin; a future implementation can satisfy the same interface using the
 * configurable inputs already modeled in the Landed Cost Engine (purchase cost,
 * freight, insurance, customs duty, SWS, other import costs, local transport,
 * QC cost, financing cost, risk margin, platform margin, tax) without changing
 * any caller.
 */
export interface PricedQuotationItem {
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
}

export interface QuotationPricingResult {
  items: PricedQuotationItem[];
  subtotalInr: number;
  freightInr: number;
  gstInr: number;
  totalInr: number;
  /** True when this result came from the flat-margin demo calculation rather than the real Landed Cost Engine. */
  isDemoCalculation: boolean;
  calculationLabel: string;
}

export interface QuotationPricingService {
  priceQuotation(
    rfq: CustomerRfq,
    selectedSupplierQuotes: SupplierQuotationItem[],
    components: ElectronicComponent[]
  ): QuotationPricingResult;
}

const DEMO_MARGIN_PERCENT = 12;
const DEMO_GST_PERCENT = 18;
const DEMO_FREIGHT_INR = 2800;

/**
 * ponytail: flat margin + flat GST, not the real Landed Cost Engine (exchange rate,
 * customs duty, SWS, insurance, financing cost, risk margin are all ignored here).
 * Swap this export for a `landedCostPricingService` implementing the same interface
 * once quotation creation should read AdminLandedCostEngine's per-item inputs.
 */
export const demoFlatMarginPricingService: QuotationPricingService = {
  priceQuotation(rfq, selectedSupplierQuotes, components) {
    const items: PricedQuotationItem[] = selectedSupplierQuotes.map((q) => {
      const component = components.find((c) => c.mpn === q.mpn);
      const lineItem = rfq.lineItems.find((li) => li.mpn === q.mpn);
      const quantity = lineItem?.requiredQuantity || q.moq;
      const unitPriceInr = Math.round(q.unitPrice * (1 + DEMO_MARGIN_PERCENT / 100) * 100) / 100;
      return {
        mpn: q.mpn,
        manufacturer: component?.manufacturer || q.mpn,
        description: component?.description || '',
        quantity,
        unitPriceInr,
        totalPriceInr: Math.round(unitPriceInr * quantity),
        dateCode: q.dateCode,
        countryOfOrigin: q.country,
        leadTime: q.leadTime,
        warranty: q.warranty,
      };
    });

    const subtotalInr = items.reduce((sum, i) => sum + i.totalPriceInr, 0);
    const gstInr = Math.round((subtotalInr + DEMO_FREIGHT_INR) * (DEMO_GST_PERCENT / 100));
    const totalInr = subtotalInr + DEMO_FREIGHT_INR + gstInr;

    return {
      items,
      subtotalInr,
      freightInr: DEMO_FREIGHT_INR,
      gstInr,
      totalInr,
      isDemoCalculation: true,
      calculationLabel: `Demo Calculation — flat ${DEMO_MARGIN_PERCENT}% margin + ${DEMO_GST_PERCENT}% GST (not the Landed Cost Engine)`,
    };
  },
};
