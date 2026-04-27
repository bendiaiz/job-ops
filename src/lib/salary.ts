/**
 * Salary utility functions for job-ops
 * Handles formatting, parsing, and range calculations for salary data
 */

export interface SalaryRange {
  min: number;
  max: number;
  currency?: string;
  period?: 'hourly' | 'monthly' | 'yearly';
}

export interface FormattedSalary {
  display: string;
  min: number;
  max: number;
  currency: string;
  period: string;
}

// Changed default currency to GBP for UK-based job searching
const DEFAULT_CURRENCY = 'GBP';
const DEFAULT_PERIOD = 'yearly';

/**
 * Formats a salary value or range into a human-readable string
 * @param salary - A single number or a SalaryRange object
 * @param currency - Currency code (defaults to GBP)
 * @param period - Pay period (defaults to yearly)
 * @returns Formatted salary string
 */
export function formatSalary(
  salary: number | SalaryRange,
  currency: string = DEFAULT_CURRENCY,
  period: string = DEFAULT_PERIOD
): string {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (typeof salary === 'number') {
    return `${formatter.format(salary)} / ${period}`;
  }

  const { min, max, currency: salaryCurrency, period: salaryPeriod } = salary;
  const curr = salaryCurrency ?? currency;
  const per = salaryPeriod ?? period;

  const currencyFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 0,
  });

  if (min === max) {
    return `${currencyFormatter.format(min)} / ${per}`;
  }

  return `${currencyFormatter.format(min)} – ${currencyFormatter.format(max)} / ${per}`;
}

/**
 * Parses a salary string into a SalaryRange object
 * Supports formats like "$50,000", "$50k", "$50k - $80k"
 * @param salaryStr - Raw salary string from job posting
 * @returns Parsed SalaryRange or null if unable to parse
 */
export function parseSalary(salaryStr: string): SalaryRange | null {
  if (!salaryStr || typeof salaryStr !== 'string') return null;

  const normalized = salaryStr.replace(/,/g, '').toLowerCase().trim();

  // Match patterns like $50k, $50,000, 50000
  const singlePattern = /\$?(\d[\d.]*)(k)?/;
  // Match range patterns like $50k - $80k or $50,000 – $80,000
  const rangePattern = /[£$]?([\d.]+)(k)?\s*[-–]\s*[£$]?([\d.]+)(k)?/;

  const rangeMatch = normalized.match(rangePattern);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]) * (rangeMatch[2] === 'k' ? 1000 : 1);
    const max = parseFloat(rangeMatch[3]) * (rangeMatch[4] === 'k' ? 1000 : 1);
    return { min, max, currency: DEFAULT_CURRENCY, period: DEFAULT_PERIOD };
  }

  const singleMatch = normalized.match(singlePattern);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]) * (singleMatch[2] === 'k' ? 1000 : 1);
    return { min: value, max: value, currency: DEFAULT_CURRENCY, period: DEFAULT_PERIOD };
  }

  return null;
}

/**
 * Converts a salary to a yearly equivalent for comparison purposes
 * @param salary - SalaryRange to normalize
 * @returns SalaryRange with yearly period
 */
export function normalizeToYearl