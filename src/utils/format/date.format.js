/**
 * Format a date string or Date object for display.
 */
export function formatDate(date, locale = 'en-US', options = {}) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format salary range for job listings.
 */
export function formatSalaryRange(min, max, currency = 'USD') {
  if (min == null && max == null) return 'Competitive';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min != null && max != null) {
    return `${formatter.format(min)} – ${formatter.format(max)}`;
  }

  return formatter.format(min ?? max);
}
