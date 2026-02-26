/**
 * Normalise a list response coming from the API.
 * The server sometimes wraps data in { data: { items, total, page, pages } }
 * or just returns an array.  This helper always returns a consistent shape.
 *
 * @param {unknown} response
 * @returns {{ items: unknown[], total: number, page: number, pages: number }}
 */
export const normalizeApiList = (response) => {
  if (!response) return { items: [], total: 0, page: 1, pages: 1 };

  // Already an array
  if (Array.isArray(response)) {
    return { items: response, total: response.length, page: 1, pages: 1 };
  }

  const inner = response?.data ?? response;

  if (Array.isArray(inner)) {
    return { items: inner, total: inner.length, page: 1, pages: 1 };
  }

  return {
    items: inner?.items ?? inner?.data ?? [],
    total: inner?.total ?? inner?.totalCount ?? 0,
    page: inner?.page ?? inner?.currentPage ?? 1,
    pages: inner?.pages ?? inner?.totalPages ?? 1,
  };
};
