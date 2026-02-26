/** Ordered list of possible order statuses */
export const ORDER_STATUS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

/** Human-readable label for each status */
export const ORDER_STATUS_LABEL = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};

/** CSS color token (or hex) for each status badge */
export const ORDER_STATUS_COLOR = {
  pending:    '#f59e0b',
  confirmed:  'var(--color-neon-cyan)',
  processing: '#8b5cf6',
  shipped:    '#3b82f6',
  delivered:  'var(--color-neon-green)',
  cancelled:  '#ef4444',
};

/** Statuses that can still be cancelled by the customer */
export const CANCELLABLE_STATUSES = ['pending', 'confirmed'];
