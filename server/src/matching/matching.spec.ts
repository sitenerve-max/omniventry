import { DeterministicMatchingService } from './matching.service';

describe('DeterministicMatchingService', () => {
  it('ranks verified, local, higher-scored suppliers first and drops out-of-stock candidates', () => {
    const service = new DeterministicMatchingService();
    const results = service.findCandidateSuppliers({
      mpn: 'LM358DR',
      requiredQuantity: 10000,
      deliveryLocation: 'Bangalore, Karnataka',
      candidates: [
        { supplierId: 'unverified', companyName: 'X', isVerified: false, city: 'Bangalore', state: 'Karnataka', supplierScore: 99, availableQuantity: 50000 },
        { supplierId: 'verified-local', companyName: 'Y', isVerified: true, city: 'Bangalore', state: 'Karnataka', supplierScore: 90, availableQuantity: 20000 },
        { supplierId: 'verified-remote', companyName: 'Z', isVerified: true, city: 'Chennai', state: 'Tamil Nadu', supplierScore: 95, availableQuantity: 30000 },
        { supplierId: 'out-of-stock', companyName: 'W', isVerified: true, city: 'Bangalore', state: 'Karnataka', supplierScore: 100, availableQuantity: 0 },
      ],
    });

    expect(results.map((r) => r.supplierId)).toEqual(['verified-local', 'verified-remote', 'unverified']);
  });
});
