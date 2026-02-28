import { useEffect, useMemo, useState } from "react";

import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import useDebounce from "@/hooks/useDebounce";
import { useGetProductsQuery } from "@/features/products/products.api";
import { useGetCategoriesQuery } from "@/features/catalog/catalog.api";

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

const Products = () => {
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
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

    // helper: lấy category text (string) từ nhiều dạng dữ liệu
    const getCategoryText = (p) => {
      const c = p?.category;

      // category là string: "keycap"
      if (typeof c === "string") return c;

      // category là object: { name: "keycap" } hoặc { title: "keycap" } (fallback)
      if (c && typeof c === "object") return c.name ?? c.title ?? "";

      return "";
    };

    // helper: normalize text
    const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

    if (activeCategory && activeCategory !== "All") {
      const ac = norm(activeCategory);
      result = result.filter((p) => norm(getCategoryText(p)).includes(ac));
    }

    const normalized = norm(debouncedKeyword);
    if (normalized) {
      result = result.filter((p) => {
        const name = norm(p?.name);
        const brand = norm(p?.brand);
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

  return (
    <section className="stack-lg">
      {/* Page header */}
      <div style={{ paddingTop: "0.5rem" }}>
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
          {filteredProducts.length} items found
        </p>
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {/* Search */}
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

        {/* Category filters */}
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

      {/* Grid */}
      {isLoading ? (
        <Loader message="Loading products..." />
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
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
