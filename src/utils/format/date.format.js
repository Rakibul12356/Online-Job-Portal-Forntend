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
 * Format a timestamp or ISO string into a human-readable relative time.
 * e.g., "Just now", "5 mins ago", "2 hours ago", "3 days ago", "1 week ago", "Aug 25, 2026"
 */
export function formatTimeAgo(date) {
  if (!date) return 'Recently';

  // If already a human-readable string like "2 days ago" or "Posted 2 days ago"
  if (
    typeof date === 'string' &&
    (date.includes('ago') ||
      date.includes('Recently') ||
      date.includes('today') ||
      date.includes('yesterday'))
  ) {
    return date.replace(/^Posted\s+/i, '');
  }

  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    return String(date);
  }

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 5) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  return formatDate(d);
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
