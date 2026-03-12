import { useMemo, useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import ProductGrid from "@/components/product/ProductGrid";
import { useGetCategoriesQuery } from "@/features/catalog/catalog.api";
import { useGetProductsQuery } from "@/features/products/products.api";
import useDebounce from "@/hooks/useDebounce";

const DEFAULT_ITEMS_PER_PAGE = 8;

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating_desc" },
  { label: "Best Selling", value: "best_selling" },
];

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const selectStyles = {
  minWidth: "160px",
  background: "rgba(13, 13, 40, 0.85)",
  border: "1px solid rgba(0,245,255,0.16)",
  borderRadius: "10px",
  padding: "0.65rem 0.85rem",
  color: "var(--color-text)",
  fontSize: "0.82rem",
  outline: "none",
  boxShadow: "inset 0 0 16px rgba(0,245,255,0.04)",
};

const optionLabelStyles = {
  display: "grid",
  gap: "0.3rem",
  color: "var(--color-text-muted)",
  fontSize: "0.68rem",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const Products = () => {
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [sortBy, setSortBy] = useState("featured");
  const debouncedKeyword = useDebounce(keyword, 300);

  const { data: categoriesData } = useGetCategoriesQuery({ limit: 50 });

  const extractArray = (payload, keys = []) => {
    for (const key of keys) {
      const value = key
        .split(".")
        .reduce((acc, part) => (acc == null ? acc : acc[part]), payload);
      if (Array.isArray(value)) return value;
    }
    return [];
  };

  const categoryItems = extractArray(categoriesData, [
    "data.items",
    "data.categories",
    "categories",
    "items",
    "data",
  ]);

  const categories = useMemo(() => {
    if (!Array.isArray(categoryItems) || categoryItems.length === 0) {
      return [
        { label: "All", value: "" },
        { label: "Keyboard", value: "keyboard" },
        { label: "Switch", value: "switch" },
        { label: "Keycap", value: "keycap" },
        { label: "Accessory", value: "accessory" },
      ];
    }

    const fromApi = categoryItems
      .map((category) => {
        const label = category?.name?.trim();
        const value = category?.slug?.trim();

        if (!label || !value) {
          return null;
        }

        return { label, value };
      })
      .filter(Boolean);

    const uniqueCategories = Array.from(
      new Map(fromApi.map((category) => [category.value, category])).values(),
    );

    return [{ label: "All", value: "" }, ...uniqueCategories];
  }, [categoryItems]);

  const selectedCategory = useMemo(
    () =>
      categories.some((category) => category.value === activeCategory)
        ? activeCategory
        : "",
    [activeCategory, categories],
  );

  const productQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      sort: sortBy,
      ...(debouncedKeyword ? { search: debouncedKeyword } : {}),
      ...(selectedCategory ? { category: selectedCategory } : {}),
    }),
    [currentPage, debouncedKeyword, itemsPerPage, selectedCategory, sortBy],
  );

  const { data: apiData, isLoading, isFetching } =
    useGetProductsQuery(productQueryParams);
  const products = extractArray(apiData, [
    "data.items",
    "data.products",
    "products",
    "data",
  ]);

  const pagination = apiData?.data?.pagination ?? {};
  const totalItems = pagination.total ?? products.length;
  const totalPages = Math.max(1, pagination.totalPages ?? 1);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [currentPage, totalPages]);

  return (
    <section className="stack-lg">
      <div
        style={{
          paddingTop: "0.5rem",
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="badge badge-cyan" style={{ marginBottom: "0.75rem" }}>
            Catalog
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            All{" "}
            <span
              style={{
                color: "var(--color-neon-cyan)",
                textShadow: "0 0 20px rgba(0,245,255,0.5)",
              }}
            >
              Products
            </span>
          </h1>
          <p
            className="muted"
            style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}
          >
            {totalItems} items found
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "end",
          }}
        >
          <label style={optionLabelStyles}>
            Items Per Page
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={selectStyles}
              aria-label="Select items per page"
            >
              {[8, 12, 16, 24].map((value) => (
                <option key={value} value={value}>
                  {value} items
                </option>
              ))}
            </select>
          </label>

          <label style={optionLabelStyles}>
            Sort By
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              style={selectStyles}
              aria-label="Select product sort order"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          >
            <SearchIcon />
          </div>
          <input
            type="search"
            id="product-search"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search keyboards, switches, keycaps..."
            aria-label="Search products"
            style={{ paddingLeft: "2.8rem" }}
          />
        </div>

        <div
          style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((category) => (
            <button
              key={category.value || "all"}
              onClick={() => {
                setActiveCategory(category.value);
                setCurrentPage(1);
              }}
              aria-pressed={selectedCategory === category.value}
              className={`button ${selectedCategory === category.value ? "button-primary" : "button-secondary"}`}
              style={{ padding: "0.4rem 1rem", fontSize: "0.78rem" }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || isFetching ? (
        <Loader message="Loading products..." />
      ) : products.length > 0 ? (
        <div className="stack-md">
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="button button-secondary"
                style={{
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.76rem",
                  opacity: currentPage === 1 ? 0.45 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Prev
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`button ${page === currentPage ? "button-primary" : "button-secondary"}`}
                  style={{
                    minWidth: "42px",
                    padding: "0.45rem 0.75rem",
                    fontSize: "0.76rem",
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="button button-secondary"
                style={{
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.76rem",
                  opacity: currentPage === totalPages ? 0.45 : 1,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filter to find what you're looking for."
        />
      )}
    </section>
  );
};

export default Products;
