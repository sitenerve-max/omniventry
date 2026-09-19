export interface MatchCandidateSupplier {
  supplierId: string;
  companyName: string;
  isVerified: boolean;
  city: string | null;
  state: string | null;
  supplierScore: number;
  /** Total quantity this supplier currently has listed across matching inventory rows. */
  availableQuantity: number;
}

export interface MatchingInput {
  mpn: string;
  requiredQuantity: number;
  deliveryLocation: string;
  candidates: MatchCandidateSupplier[];
}

export interface MatchingResult {
  supplierId: string;
  reason: string;
}

/**
 * Typed seam for supplier matching. `DeterministicMatchingService` is explicitly rule-based
 * (exact MPN + available quantity + verification + location + score) — it is NOT an AI/ML
 * matcher, and callers must not present it as one. A future `AiMatchingService` implementing
 * the same interface could replace it without touching callers.
 */
export interface MatchingService {
  findCandidateSuppliers(input: MatchingInput): MatchingResult[];
}

export class DeterministicMatchingService implements MatchingService {
  findCandidateSuppliers(input: MatchingInput): MatchingResult[] {
    return input.candidates
      .filter((c) => c.availableQuantity > 0)
      .sort((a, b) => {
        // 1. verified suppliers first, 2. same-state/location match, 3. higher score, 4. more available stock
        if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
        const aLocal = isLocationMatch(a, input.deliveryLocation);
        const bLocal = isLocationMatch(b, input.deliveryLocation);
        if (aLocal !== bLocal) return aLocal ? -1 : 1;
        if (a.supplierScore !== b.supplierScore) return b.supplierScore - a.supplierScore;
        return b.availableQuantity - a.availableQuantity;
      })
      .map((c) => ({
        supplierId: c.supplierId,
        reason: buildReason(c, input),
      }));
  }
}

function isLocationMatch(supplier: MatchCandidateSupplier, deliveryLocation: string): boolean {
  const location = deliveryLocation.toLowerCase();
  return Boolean(
    (supplier.city && location.includes(supplier.city.toLowerCase())) ||
      (supplier.state && location.includes(supplier.state.toLowerCase())),
  );
}

function buildReason(candidate: MatchCandidateSupplier, input: MatchingInput): string {
  const parts = [`Exact MPN match on ${input.mpn}`, `${candidate.availableQuantity} pcs available`];
  if (candidate.isVerified) parts.push('verified supplier');
  if (isLocationMatch(candidate, input.deliveryLocation)) parts.push('location match');
  return parts.join(', ');
}
