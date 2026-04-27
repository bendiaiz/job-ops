import { describe, it, expect } from 'vitest';
import { formatSalary, parseSalary, normalizeToYearly } from './salary';

describe('formatSalary', () => {
  it('formats a yearly salary with default currency', () => {
    expect(formatSalary(60000)).toBe('$60,000/yr');
  });

  it('formats a monthly salary', () => {
    expect(formatSalary(5000, { period: 'monthly' })).toBe('$5,000/mo');
  });

  it('formats a hourly salary', () => {
    expect(formatSalary(25, { period: 'hourly' })).toBe('$25/hr');
  });

  it('formats with a different currency', () => {
    expect(formatSalary(50000, { currency: 'GBP' })).toBe('£50,000/yr');
  });

  it('formats a salary range', () => {
    expect(formatSalary([60000, 80000])).toBe('$60,000 – $80,000/yr');
  });

  it('returns empty string for undefined input', () => {
    expect(formatSalary(undefined as any)).toBe('');
  });

  it('handles zero salary', () => {
    expect(formatSalary(0)).toBe('$0/yr');
  });
});

describe('parseSalary', () => {
  it('parses a plain yearly salary string', () => {
    expect(parseSalary('$60,000/yr')).toEqual({ amount: 60000, period: 'yearly', currency: 'USD' });
  });

  it('parses a monthly salary string', () => {
    expect(parseSalary('$5,000/mo')).toEqual({ amount: 5000, period: 'monthly', currency: 'USD' });
  });

  it('parses an hourly salary string', () => {
    expect(parseSalary('$25/hr')).toEqual({ amount: 25, period: 'hourly', currency: 'USD' });
  });

  it('parses a GBP salary string', () => {
    expect(parseSalary('£50,000/yr')).toEqual({ amount: 50000, period: 'yearly', currency: 'GBP' });
  });

  it('returns null for an unparseable string', () => {
    expect(parseSalary('negotiable')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseSalary('')).toBeNull();
  });
});

describe('normalizeToYearly', () => {
  it('returns yearly amount unchanged', () => {
    expect(normalizeToYearly(60000, 'yearly')).toBe(60000);
  });

  it('converts monthly to yearly', () => {
    expect(normalizeToYearly(5000, 'monthly')).toBe(60000);
  });

  it('converts hourly to yearly assuming 40hr week, 52 weeks', () => {
    expect(normalizeToYearly(25, 'hourly')).toBe(52000);
  });

  it('handles zero amount', () => {
    expect(normalizeToYearly(0, 'monthly')).toBe(0);
  });

  it('handles decimal hourly rates', () => {
    expect(normalizeToYearly(12.5, 'hourly')).toBe(26000);
  });
});
