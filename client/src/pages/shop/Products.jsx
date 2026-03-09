import { useEffect, useMemo, useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import ProductGrid from "@/components/product/ProductGrid";
import { useGetCategoriesQuery } from "@/features/catalog/catalog.api";
import { useGetProductsQuery } from "@/features/products/products.api";
import useDebounce from "@/hooks/useDebounce";

const DEFAULT_ITEMS_PER_PAGE = 8;

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [sortBy, setSortBy] = useState("featured");
  const debouncedKeyword = useDebounce(keyword, 300);

  const { data: apiData, isLoading } = useGetProductsQuery({ limit: 100 });
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

  const allProducts = extractArray(apiData, [
    "data.items",
    "data.products",
    "products",
    "data",
  ]);
  const categoryItems = extractArray(categoriesData, [
    "data.items",
    "data.categories",
    "categories",
    "items",
    "data",
  ]);

  const categories = useMemo(() => {
    if (!Array.isArray(categoryItems) || categoryItems.length === 0) {
      return ["All", "Keyboard", "Switch", "Keycap", "Accessory"];
    }

    const fromApi = categoryItems
      .map((c) => c?.name)
      .filter((name) => typeof name === "string" && name.trim().length > 0)
      .map((name) => name.trim());

    return ["All", ...Array.from(new Set(fromApi))];
  }, [categoryItems]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [categories, activeCategory]);

  const filteredProducts = useMemo(() => {
    let result = allProducts ?? [];

    const getCategoryText = (p) => {
      const c = p?.category;

      if (typeof c === "string") return c;
      if (c && typeof c === "object") return c.name ?? c.title ?? "";

      return "";
    };

    const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

    if (activeCategory && activeCategory !== "All") {
      const ac = norm(activeCategory);
      result = result.filter((p) => norm(getCategoryText(p)).includes(ac));
    }

    const normalized = norm(debouncedKeyword);
    if (normalized) {
      result = result.filter((p) => {
        const name = norm(p?.name);
        const brand = norm(
          typeof p?.brand === "string" ? p.brand : p?.brand?.name,
        );
        const category = norm(getCategoryText(p));

        return (
          name.includes(normalized) ||
          brand.includes(normalized) ||
          category.includes(normalized)
        );
      });
    }

    return result;
  }, [debouncedKeyword, activeCategory, allProducts]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    const getPrice = (product) => Number(product?.price ?? 0);
    const getName = (product) => String(product?.name ?? "").toLowerCase();
    const getDate = (product) => {
      const value = product?.createdAt || product?.updatedAt || 0;
      return new Date(value).getTime() || 0;
    };

    switch (sortBy) {
      case "newest":
        return products.sort((a, b) => getDate(b) - getDate(a));
      case "price-asc":
        return products.sort((a, b) => getPrice(a) - getPrice(b));
      case "price-desc":
        return products.sort((a, b) => getPrice(b) - getPrice(a));
      case "name-asc":
        return products.sort((a, b) => getName(a).localeCompare(getName(b)));
      case "name-desc":
        return products.sort((a, b) => getName(b).localeCompare(getName(a)));
      case "featured":
      default:
        return products;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, activeCategory, itemsPerPage, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedProducts]);

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
            {sortedProducts.length} items found
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
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
              onChange={(e) => setSortBy(e.target.value)}
              style={selectStyles}
              aria-label="Select product sort order"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
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
            onChange={(e) => setKeyword(e.target.value)}
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`button ${activeCategory === cat ? "button-primary" : "button-secondary"}`}
              style={{ padding: "0.4rem 1rem", fontSize: "0.78rem" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loader message="Loading products..." />
      ) : sortedProducts.length > 0 ? (
        <div className="stack-md">
          <ProductGrid products={paginatedProducts} />

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
