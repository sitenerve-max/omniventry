/**
 * Normalizes an MPN for search comparison only (uppercase, strip spaces/hyphens/underscores).
 * This is a comparison key, not an identity claim: "LM358DR" and "LM358-DR" normalize to the
 * same key and should surface as an Exact Match, but callers must still return the original
 * MPN string for display and must never silently substitute one product for another based on
 * normalization alone (package/temp-grade/automotive-grade/packaging-suffix variants are
 * distinct products in the catalog, not merged by this function).
 */
export function normalizeMpn(mpn: string): string {
  return mpn.trim().toUpperCase().replace(/[\s\-_]/g, '');
}
