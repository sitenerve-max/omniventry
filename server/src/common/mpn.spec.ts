import { normalizeMpn } from './mpn';

describe('normalizeMpn', () => {
  it('normalizes case, hyphens, underscores, and whitespace to the same key', () => {
    expect(normalizeMpn('LM358DR')).toBe('LM358DR');
    expect(normalizeMpn('lm358dr')).toBe('LM358DR');
    expect(normalizeMpn('LM358-DR')).toBe('LM358DR');
    expect(normalizeMpn(' LM358_DR ')).toBe('LM358DR');
  });

  it('does not merge genuinely different MPNs', () => {
    expect(normalizeMpn('LM358DR')).not.toBe(normalizeMpn('LM358DT'));
  });
});
