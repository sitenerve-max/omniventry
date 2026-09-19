export interface PricingLineInput {
  mpn: string;
  manufacturer: string;
  description: string;
  quantity: number;
  supplierUnitPrice: number;
  dateCode: string;
  countryOfOrigin: string;
  leadTime: string;
  warranty?: string;
}

export interface PricingInput {
  currency: string;
  lines: PricingLineInput[];
}

export interface PricingLineResult {
  mpn: string;
  manufacturer: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  dateCode: string;
  countryOfOrigin: string;
  leadTime: string;
  warranty?: string;
}

export interface PricingResult {
  items: PricingLineResult[];
  subtotal: number;
  freight: number;
  gst: number;
  total: number;
  isDemoCalculation: boolean;
  calculationLabel: string;
}

/**
 * Typed seam between RFQ/quotation flows and pricing logic. `DemoFlatMarginPricingService`
 * mirrors the frontend's clearly-labelled Demo Calculation (flat margin + flat GST). A future
 * `LandedCostPricingService` implementing the same interface (purchase cost, exchange rate,
 * freight, insurance, customs duty, SWS, other import costs, local transport, QC cost,
 * financing cost, risk margin, platform margin, tax) can replace it without touching callers.
 */
export interface PricingService {
  calculateCustomerQuotation(input: PricingInput): Promise<PricingResult>;
}

const DEMO_MARGIN_PERCENT = 12;
const DEMO_GST_PERCENT = 18;
const DEMO_FREIGHT = 2800;

export class DemoFlatMarginPricingService implements PricingService {
  async calculateCustomerQuotation(input: PricingInput): Promise<PricingResult> {
    const items = input.lines.map((line): PricingLineResult => {
      const unitPrice = round2(line.supplierUnitPrice * (1 + DEMO_MARGIN_PERCENT / 100));
      return {
        mpn: line.mpn,
        manufacturer: line.manufacturer,
        description: line.description,
        quantity: line.quantity,
        unitPrice,
        totalPrice: round2(unitPrice * line.quantity),
        dateCode: line.dateCode,
        countryOfOrigin: line.countryOfOrigin,
        leadTime: line.leadTime,
        warranty: line.warranty,
      };
    });

    const subtotal = round2(items.reduce((sum, item) => sum + item.totalPrice, 0));
    const gst = round2((subtotal + DEMO_FREIGHT) * (DEMO_GST_PERCENT / 100));
    const total = round2(subtotal + DEMO_FREIGHT + gst);

    return {
      items,
      subtotal,
      freight: DEMO_FREIGHT,
      gst,
      total,
      isDemoCalculation: true,
      calculationLabel: `Demo Calculation — flat ${DEMO_MARGIN_PERCENT}% margin + ${DEMO_GST_PERCENT}% GST (not a Landed Cost Engine calculation)`,
    };
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
