import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetBlogsQuery } from "@/modules/blog/api/blog.api";

// ── Shared Config & Helpers ──────────────────────────────────────────────────
const CATEGORY_META = {
  review: { label: "Review", emoji: "⭐" },
  comparison: { label: "Comparison", emoji: "⚖️" },
  guide: { label: "Guide", emoji: "📖" },
  news: { label: "News", emoji: "📰" },
  keycap: { label: "Keycap", emoji: "🔤" },
  switch: { label: "Switch", emoji: "🔴" },
  keyboard: { label: "Keyboard", emoji: "⌨️" },
  custom: { label: "Custom Build", emoji: "🛠️" },
  other: { label: "Other", emoji: "📝" },
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const getCategoryColor = (cat) => {
  const map = {
    review: "#00f5ff",
    comparison: "#a855f7",
    guide: "#39ff14",
    news: "#ffcc00",
    keycap: "#ff6b35",
    switch: "#ff5555",
    keyboard: "#00f5ff",
    custom: "#a855f7",
    other: "#888",
  };
  return map[cat] || "#888";
};

// ── UI Components ─────────────────────────────────────────────────────────────

const CategoryBadge = ({ category, absolute = false, style = {} }) => {
  const cat = CATEGORY_META[category] || { label: category, emoji: "📝" };
  const color = getCategoryColor(category);
  return (
    <span
      style={{
        ...(absolute
          ? { position: "absolute", top: "16px", left: "16px", zIndex: 10 }
          : { marginBottom: "8px", display: "inline-block" }),
        padding: "3px 10px",
        borderRadius: "99px",
        fontSize: "0.68rem",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        backdropFilter: "blur(8px)",
        ...style,
      }}
    >
      {cat.emoji} {cat.label}
    </span>
  );
};

const GridCard = ({ post }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        textDecoration: "none",
        height: "100%",
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(20, 20, 25, 0.4)",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
      }}
    >
      <div
        style={{ position: "relative", height: "180px", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: post.coverImage
              ? `url(${post.coverImage}) center/cover`
              : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.6) 100%)`,
            transition: "transform 0.5s ease",
          }}
          className="card-image-bg"
        />
        <CategoryBadge category={post.category} absolute />
      </div>
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            color: "#fff",
            fontWeight: 700,
            margin: "0 0 0.5rem 0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            marginBottom: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {post.excerpt}
        </p>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
          {formatDate(post.createdAt)}
        </span>
      </div>
    </Link>
  );
};

const ListCard = ({ post }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(20, 20, 25, 0.4)",
        gap: "1.5rem",
        transition: "all 0.3s ease",
        height: "180px",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
      }}
    >
      <div
        style={{
          position: "relative",
          width: "240px",
          height: "100%",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: post.coverImage
              ? `url(${post.coverImage}) center/cover`
              : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.6) 100%)`,
            transition: "transform 0.5s ease",
          }}
          className="card-image-bg"
        />
        <CategoryBadge category={post.category} absolute />
      </div>
      <div
        style={{
          padding: "1.25rem",
          paddingLeft: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            color: "#fff",
            fontWeight: 700,
            margin: "0 0 0.5rem 0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.5,
            marginBottom: "0.8rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxWidth: "800px",
          }}
        >
          {post.excerpt}
        </p>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
          {formatDate(post.createdAt)}
        </span>
      </div>
    </Link>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const BlogAllPage = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 6,
    sort: "latest",
    category: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const { data, isLoading } = useGetBlogsQuery(params);

  const posts = useMemo(
    () => data?.data?.items ?? data?.data?.blogs ?? data?.data ?? [],
    [data],
  );
  const localPagination = !data?.data?.pagination?.totalPages;

  const totalPages =
    data?.data?.pagination?.totalPages ??
    Math.max(1, Math.ceil(posts.length / params.limit));

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (params.page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (params.page >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }

    return [
      params.page - 2,
      params.page - 1,
      params.page,
      params.page + 1,
      params.page + 2,
    ];
  }, [params.page, totalPages]);

  const displayedPosts = useMemo(() => {
    if (!localPagination) return posts;
    const startIndex = (params.page - 1) * params.limit;
    return posts.slice(startIndex, startIndex + params.limit);
  }, [posts, params.limit, params.page, localPagination]);

  // Render Skeleton for loading
  const renderSkeletons = () => (
    <div
      style={{
        display: viewMode === "grid" ? "grid" : "flex",
        gridTemplateColumns:
          viewMode === "grid"
            ? "repeat(auto-fill, minmax(300px, 1fr))"
            : undefined,
        flexDirection: viewMode === "list" ? "column" : undefined,
        gap: "2rem",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="glass-card animate-pulse"
          style={{
            height: "180px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem 1rem 4rem",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Breadcrumb / Title */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--color-text-dim)",
        }}
      >
        <Link
          to="/blog"
          style={{
            color: "var(--color-neon-cyan)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Blog
        </Link>
        <span>/</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>All Articles</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            All{" "}
            <span
              style={{
                color: "var(--color-neon-cyan)",
                textShadow: "0 0 20px rgba(0,245,255,0.5)",
              }}
            >
              Articles
            </span>
          </h1>
          <p
            className="muted"
            style={{
              marginTop: "0.5rem",
              fontSize: "0.95rem",
              color: "var(--color-text-muted)",
            }}
          >
            {posts?.length > 0
              ? "Showing latest articles"
              : "No articles found"}
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
          <label
            style={{
              display: "grid",
              gap: "0.3rem",
              color: "var(--color-text-muted)",
              fontSize: "0.68rem",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Items Per Page
            <select
              value={params.limit}
              onChange={(e) =>
                setParams({ ...params, limit: Number(e.target.value), page: 1 })
              }
              style={{
                minWidth: "140px",
                background: "rgba(13, 13, 40, 0.85)",
                border: "1px solid rgba(0,245,255,0.16)",
                borderRadius: "10px",
                padding: "0.65rem 0.85rem",
                color: "#fff",
                fontSize: "0.82rem",
                outline: "none",
                boxShadow: "inset 0 0 16px rgba(0,245,255,0.04)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {[3, 6, 9, 12, 15].map((value) => (
                <option key={value} value={value}>
                  {value} items
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              display: "grid",
              gap: "0.3rem",
              color: "var(--color-text-muted)",
              fontSize: "0.68rem",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Sort By
            <select
              value={params.sort}
              onChange={(e) =>
                setParams({ ...params, sort: e.target.value, page: 1 })
              }
              style={{
                minWidth: "160px",
                background: "rgba(13, 13, 40, 0.85)",
                border: "1px solid rgba(0,245,255,0.16)",
                borderRadius: "10px",
                padding: "0.65rem 0.85rem",
                color: "#fff",
                fontSize: "0.82rem",
                outline: "none",
                boxShadow: "inset 0 0 16px rgba(0,245,255,0.04)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </label>

          {/* View Mode Toggles */}
          <div
            style={{
              display: "flex",
              background: "rgba(13, 13, 40, 0.85)",
              borderRadius: "10px",
              border: "1px solid rgba(0,245,255,0.16)",
              padding: "0.25rem",
              boxShadow: "inset 0 0 16px rgba(0,245,255,0.04)",
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              style={{
                background:
                  viewMode === "grid" ? "rgba(0,245,255,0.15)" : "transparent",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem",
                color: viewMode === "grid" ? "#fff" : "var(--color-text-dim)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              title="Grid View"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                background:
                  viewMode === "list" ? "rgba(0,245,255,0.15)" : "transparent",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem",
                color: viewMode === "list" ? "#fff" : "var(--color-text-dim)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              title="List View"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "3rem",
        }}
        role="group"
        aria-label="Filter by category"
      >
        <button
          onClick={() => setParams({ ...params, category: "", page: 1 })}
          aria-pressed={params.category === ""}
          className={`button ${params.category === "" ? "button-primary" : "button-secondary"}`}
          style={{ padding: "0.4rem 1rem", fontSize: "0.78rem" }}
        >
          All
        </button>
        {Object.keys(CATEGORY_META).map((key) => (
          <button
            key={key}
            onClick={() => setParams({ ...params, category: key, page: 1 })}
            aria-pressed={params.category === key}
            className={`button ${params.category === key ? "button-primary" : "button-secondary"}`}
            style={{ padding: "0.4rem 1rem", fontSize: "0.78rem" }}
          >
            {CATEGORY_META[key].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        renderSkeletons()
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "12px",
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>
            No articles found for the selected criteria.
          </p>
          <button
            onClick={() =>
              setParams({ page: 1, limit: 6, sort: "latest", category: "" })
            }
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "rgba(0,245,255,0.1)",
              color: "var(--color-neon-cyan)",
              border: "1px solid rgba(0,245,255,0.3)",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div
            className={`blog-grid ${viewMode}`}
            style={{
              display: viewMode === "grid" ? "grid" : "flex",
              gridTemplateColumns:
                viewMode === "grid"
                  ? "repeat(auto-fill, minmax(320px, 1fr))"
                  : undefined,
              flexDirection: viewMode === "list" ? "column" : undefined,
              gap: "2rem",
            }}
          >
            {displayedPosts.map((post) =>
              viewMode === "grid" ? (
                <GridCard key={post._id} post={post} />
              ) : (
                <ListCard key={post._id} post={post} />
              ),
            )}
          </div>

          {/* Pagination */}
          {totalPages >= 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "4rem",
              }}
            >
              <button
                type="button"
                disabled={params.page === 1}
                onClick={() =>
                  setParams((p) => ({ ...p, page: Math.max(p.page - 1, 1) }))
                }
                className="button button-secondary"
                style={{
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.76rem",
                  opacity: params.page === 1 ? 0.45 : 1,
                  cursor: params.page === 1 ? "not-allowed" : "pointer",
                }}
              >
                Prev
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, page }))}
                  className={`button ${page === params.page ? "button-primary" : "button-secondary"}`}
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
                disabled={params.page === totalPages}
                onClick={() =>
                  setParams((p) => ({
                    ...p,
                    page: Math.min(p.page + 1, totalPages),
                  }))
                }
                className="button button-secondary"
                style={{
                  padding: "0.45rem 0.9rem",
                  fontSize: "0.76rem",
                  opacity: params.page === totalPages ? 0.45 : 1,
                  cursor:
                    params.page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Global CSS for hover effects */}
      <style>{`
        .glass-card:hover .card-image-bg {
          transform: scale(1.05);
        }
        select option {
          background-color: #1a1a20;
          color: #fff;
        }
        @media (max-width: 768px) {
          .blog-grid.list {
            gap: 1.5rem !important;
          }
          .blog-grid.list a {
            flex-direction: column !important;
            height: auto !important;
          }
          .blog-grid.list a > div:first-child {
            width: 100% !important;
            height: 200px !important;
          }
          .blog-grid.list a > div:last-child {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogAllPage;
