import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useGetBlogsQuery,
  useGetBlogCategoriesQuery,
} from "@/modules/blog/api/blog.api";

// ── Category config ──────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
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

// ── Sub-components ────────────────────────────────────────────────────────────
const BlogCard = ({ post, featured = false }) => {
  const cat = CATEGORY_META[post.category] || {
    label: post.category,
    emoji: "📝",
  };
  const color = getCategoryColor(post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{ display: "block", textDecoration: "none" }}
    >
      <article
        className="glass-card"
        style={{
          overflow: "hidden",
          borderRadius: "12px",
          transition: "transform 0.25s, box-shadow 0.25s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${color}22`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        {/* Cover image */}
        <div
          style={{
            height: featured ? "240px" : "180px",
            background: post.coverImage
              ? `url(${post.coverImage}) center/cover`
              : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.4) 100%)`,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {!post.coverImage && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: featured ? "4rem" : "3rem",
                opacity: 0.4,
              }}
            >
              {cat.emoji}
            </div>
          )}
          {/* Category badge */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
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
            }}
          >
            {cat.emoji} {cat.label}
          </span>
          {post.isFeatured && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "3px 10px",
                borderRadius: "99px",
                fontSize: "0.66rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "rgba(255, 204, 0, 0.15)",
                color: "#ffcc00",
                border: "1px solid rgba(255,204,0,0.35)",
                backdropFilter: "blur(8px)",
              }}
            >
              ⭐ Featured
            </span>
          )}
          {post.rating && (
            <span
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                padding: "4px 12px",
                borderRadius: "99px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                background: "rgba(0,0,0,0.7)",
                color: "#ffcc00",
                backdropFilter: "blur(8px)",
              }}
            >
              {post.rating}/10
            </span>
          )}
        </div>

        {/* Body */}
        <div
          style={{
            padding: "1.1rem 1.25rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: featured ? "1.1rem" : "0.95rem",
              fontWeight: 800,
              color: "#e8e8ff",
              lineHeight: 1.4,
              marginBottom: "0.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.82rem",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.3rem",
                marginTop: "0.6rem",
              }}
            >
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontSize: "0.65rem",
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--color-text-muted)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "0.8rem",
              paddingTop: "0.6rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: `${color}22`,
                  border: `1px solid ${color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  color,
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                }}
              >
                {(post.author?.name || "K")[0].toUpperCase()}
              </div>
              <span
                style={{ fontSize: "0.72rem", color: "var(--color-text-dim)" }}
              >
                {post.author?.name || "KeyCrafter"}
              </span>
            </div>
            <div
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
            >
              {post.readTime && (
                <span
                  style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}
                >
                  ⏱ {post.readTime} min
                </span>
              )}
              <span
                style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}
              >
                {post.viewCount || 0} 👁
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const FilterChip = ({ active, onClick, children, color }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "5px 14px",
      borderRadius: "99px",
      fontSize: "0.76rem",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      border: active
        ? `1px solid ${color || "var(--color-neon-cyan)"}`
        : "1px solid rgba(255,255,255,0.12)",
      background: active
        ? `${color || "var(--color-neon-cyan)"}18`
        : "transparent",
      color: active
        ? color || "var(--color-neon-cyan)"
        : "var(--color-text-muted)",
    }}
  >
    {children}
  </button>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const BlogListPage = () => {
  const [params, setParams] = useState({ page: 1, limit: 9, sort: "latest" });
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const queryParams = useMemo(() => {
    const p = { ...params };
    if (activeCategory) p.category = activeCategory;
    if (search) p.search = search;
    return p;
  }, [params, activeCategory, search]);

  const { data, isLoading, isFetching } = useGetBlogsQuery(queryParams);
  const { data: catData } = useGetBlogCategoriesQuery();

  const posts = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const categories = catData?.data ?? [];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setParams((p) => ({ ...p, page: 1 }));
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat === activeCategory ? "" : cat);
    setParams((p) => ({ ...p, page: 1 }));
  };

  const handleSort = (s) => setParams((p) => ({ ...p, sort: s, page: 1 }));

  const handlePage = (p) => {
    setParams((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "6rem 1rem 4rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p
          style={{
            color: "var(--color-neon-cyan)",
            fontSize: "0.75rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          ⌨️ KeyCrafter Blog
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: "1rem",
          }}
        >
          Reviews &amp; Knowledge
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--color-neon-cyan), var(--color-neon-purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mechanical Keyboards
          </span>
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          Reviews, comparisons, guides and latest news about switches, keycaps &
          custom keyboards
        </p>
      </header>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{
          maxWidth: "520px",
          margin: "0 auto 2rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search articles..."
          style={{
            flex: 1,
            padding: "0.65rem 1rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontSize: "0.88rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.65rem 1.2rem",
            background: "var(--color-neon-cyan)",
            border: "none",
            borderRadius: "8px",
            color: "#000",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "0.82rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchInput("");
            }}
            style={{
              padding: "0.65rem 0.9rem",
              background: "rgba(255,50,50,0.1)",
              border: "1px solid rgba(255,50,50,0.2)",
              borderRadius: "8px",
              color: "#ff5555",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.78rem",
              cursor: "pointer",
            }}
          >
            ✕ Clear
          </button>
        )}
      </form>

      {/* Filters row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "2rem",
          justifyContent: "center",
        }}
      >
        <FilterChip active={!activeCategory} onClick={() => handleCategory("")}>
          All {pagination && !activeCategory && `(${pagination.total})`}
        </FilterChip>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const stat = categories.find((c) => c._id === key);
          if (!stat && categories.length > 0) return null;
          return (
            <FilterChip
              key={key}
              active={activeCategory === key}
              onClick={() => handleCategory(key)}
              color={getCategoryColor(key)}
            >
              {meta.emoji} {meta.label} {stat ? `(${stat.count})` : ""}
            </FilterChip>
          );
        })}
      </div>

      {/* Sort */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        {["latest", "popular", "oldest"].map((s) => (
          <FilterChip
            key={s}
            active={params.sort === s}
            onClick={() => handleSort(s)}
          >
            {s === "latest"
              ? "🕒 Latest"
              : s === "popular"
                ? "🔥 Popular"
                : "📅 Oldest"}
          </FilterChip>
        ))}
      </div>

      {/* Grid */}
      {isLoading || isFetching ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass-card"
              style={{ height: "340px", borderRadius: "12px", opacity: 0.4 }}
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "4rem", textAlign: "center" }}
        >
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
            No posts found. Please check back later!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {posts.map((post, i) => (
            <BlogCard
              key={post._id}
              post={post}
              featured={i === 0 && params.page === 1}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "3rem",
          }}
        >
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePage(p)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border:
                    p === params.page
                      ? "1px solid var(--color-neon-cyan)"
                      : "1px solid rgba(255,255,255,0.12)",
                  background:
                    p === params.page ? "rgba(0,245,255,0.1)" : "transparent",
                  color:
                    p === params.page
                      ? "var(--color-neon-cyan)"
                      : "var(--color-text-muted)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
