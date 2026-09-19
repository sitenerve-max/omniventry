import { DemoFlatMarginPricingService } from './pricing.service';

describe('DemoFlatMarginPricingService', () => {
  it('applies a flat 12% margin and 18% GST, and flags the result as a demo calculation', async () => {
    const service = new DemoFlatMarginPricingService();
    const result = await service.calculateCustomerQuotation({
      currency: 'INR',
      lines: [
        {
          mpn: 'LM358DR',
          manufacturer: 'Texas Instruments',
          description: 'Dual Op-Amp',
          quantity: 10000,
          supplierUnitPrice: 4.85,
          dateCode: '2418+',
          countryOfOrigin: 'India',
          leadTime: 'Same Day Dispatch',
        },
      ],
    });

    expect(result.items[0].unitPrice).toBeCloseTo(5.43, 2);
    expect(result.items[0].totalPrice).toBeCloseTo(54300, 0);
    expect(result.isDemoCalculation).toBe(true);
    expect(result.calculationLabel).toMatch(/Demo Calculation/);
  });
});
