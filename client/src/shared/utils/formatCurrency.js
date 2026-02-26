/**
 * Format a number as USD currency string.
 * @param {number} amount
 * @param {string} [currency='USD']
 * @returns {string} e.g. "$19.99"
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (typeof amount !== "number" || isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
