/**
 * Build a URL query string from a params object,
 * stripping out undefined / null / empty-string values.
 *
 * @param {Record<string, unknown>} params
 * @returns {string}  e.g. "page=1&limit=20"
 */
export const buildQueryString = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
  return new URLSearchParams(clean).toString();
};
