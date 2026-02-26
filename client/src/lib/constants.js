/**
 * @deprecated
 * Constants have been moved to @/shared/constants/
 * This file re-exports for backward compatibility.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Re-export from shared constants
export { ORDER_STATUS, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, CANCELLABLE_STATUSES } from '@/shared/constants/orderStatus';
export { ROUTES } from '@/shared/constants/routes';
