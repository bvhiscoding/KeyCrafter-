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

// ── Shared UI Components ──────────────────────────────────────────────────────

const SectionHeader = ({ title, viewAllLink }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "4rem 0 2rem",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      paddingBottom: "1rem",
    }}
  >
    <h2
      style={{
        fontSize: "1.5rem",
        fontWeight: 800,
        color: "#fff",
        textTransform: "uppercase",
        letterSpacing: "1px",
        position: "relative",
      }}
    >
      {title}
      <span
        style={{
          position: "absolute",
          bottom: "-17px",
          left: 0,
          width: "100%",
          height: "2px",
          backgroundColor: "var(--color-neon-cyan)",
        }}
      />
    </h2>
    {viewAllLink && (
      <Link
        to={viewAllLink}
        style={{
          fontSize: "0.9rem",
          color: "var(--color-neon-cyan)",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        All {title}
      </Link>
    )}
  </div>
);

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

// ── Specific Layout Components ─────────────────────────────────────────────────

const HeroPost = ({ post }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass-card"
      style={{
        display: "block",
        position: "relative",
        height: "480px",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: post.coverImage
            ? `url(${post.coverImage}) center/cover`
            : `linear-gradient(135deg, ${color}44 0%, rgba(0,0,0,0.8) 100%)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "5%",
          transform: "translateY(-50%)",
          background: "rgba(10, 10, 15, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "2.5rem",
          borderRadius: "12px",
          maxWidth: "560px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <CategoryBadge category={post.category} />
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.3,
            margin: "1rem 0",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "var(--color-text-dim)",
          }}
        >
          <span>{formatDate(post.createdAt)}</span>
          <span style={{ color: "var(--color-neon-cyan)", fontWeight: 600 }}>
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
};

const TrendCard = ({ post, large = false }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass-card"
      style={{
        display: "block",
        position: "relative",
        height: "380px",
        borderRadius: "12px",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: post.coverImage
            ? `url(${post.coverImage}) center/cover`
            : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.6) 100%)`,
          opacity: 0.7,
          transition: "transform 0.5s",
        }}
        className="hover-scale-img"
      />
      <div
        style={{
          position: "absolute",
          bottom: large ? "24px" : "16px",
          left: large ? "24px" : "16px",
          right: large ? "24px" : "16px",
          background: "rgba(20, 20, 25, 0.85)",
          backdropFilter: "blur(10px)",
          padding: large ? "1.5rem" : "1.2rem",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CategoryBadge category={post.category} />
        <h3
          style={{
            fontSize: large ? "1.2rem" : "1rem",
            color: "#fff",
            margin: "0.75rem 0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>
        {large && (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8rem",
            color: "var(--color-text-dim)",
          }}
        >
          <span>{formatDate(post.createdAt)}</span>
          <span style={{ color: "var(--color-neon-cyan)", fontWeight: 600 }}>
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
};

const FYMain = ({ post }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        textDecoration: "none",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: post.coverImage
              ? `url(${post.coverImage}) center/cover`
              : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.6) 100%)`,
          }}
        />
      </div>
      <div>
        <CategoryBadge category={post.category} />
        <h3
          style={{
            fontSize: "1.4rem",
            color: "#fff",
            margin: "0.5rem 0",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
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

const FYList = ({ post }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        textDecoration: "none",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: post.coverImage
              ? `url(${post.coverImage}) center/cover`
              : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.6) 100%)`,
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <CategoryBadge category={post.category} />
        <h3
          style={{
            fontSize: "1.1rem",
            color: "#fff",
            margin: "0.5rem 0",
            lineHeight: 1.3,
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
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
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

const LatestCard = ({ post, tall = false }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass-card"
      style={{
        display: "block",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        height: tall ? "100%" : "260px",
        minHeight: tall ? "540px" : "auto",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: post.coverImage
            ? `url(${post.coverImage}) center/cover`
            : `linear-gradient(135deg, ${color}22 0%, rgba(0,0,0,0.6) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: tall ? "2rem" : "1.5rem",
        }}
      >
        <CategoryBadge
          category={post.category}
          style={{ alignSelf: "flex-start" }}
        />
        <h3
          style={{
            fontSize: tall ? "1.4rem" : "1.1rem",
            color: "#fff",
            fontWeight: 700,
            margin: "0.5rem 0",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
          {formatDate(post.createdAt)}
        </span>
      </div>
    </Link>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const BlogListPage = () => {
  const [params, setParams] = useState({ page: 1, limit: 20, sort: "latest" });

  const { data, isLoading } = useGetBlogsQuery(params);

  const posts = data?.data?.items ?? [];

  // Distribute posts based on the template layout
  const heroPost = posts[0];
  const trendingLarge = posts[1];
  const trendingSmall = posts[2];

  const fyMain = posts[3];
  const fyList1 = posts[4];
  const fyList2 = posts[5];

  const latestTall = posts[6];
  const latestCards = posts.slice(7, 11);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "6rem 1rem 4rem",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Page Header omitted to match template which jumps straight into Hero, but let's keep a subtle title */}
      <h1 style={{ display: "none" }}>KeyCrafter Blogs</h1>

      {isLoading ? (
        <div style={{ textAlign: "center", color: "#fff", padding: "4rem" }}>
          Loading awesome content...
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            padding: "4rem",
          }}
        >
          No posts found.
        </div>
      ) : (
        <>
          {/* Hero Section */}
          {heroPost && <HeroPost post={heroPost} />}

          {/* Trending Section */}
          <SectionHeader title="Trending" viewAllLink="#" />
          <div className="trending-grid" style={{ display: "flex", gap: "2rem", flexDirection: "row" }}>
            <div className="trend-large" style={{ flex: "0 0 65%" }}>
              <TrendCard post={trendingLarge || posts[0]} large={true} />
            </div>
            <div className="trend-small" style={{ flex: "0 0 calc(35% - 2rem)" }}>
              <TrendCard post={trendingSmall || posts[0]} large={false} />
            </div>
          </div>

          {/* For You Section */}
          <SectionHeader title="For You" />
          <div className="foryou-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
            <FYMain post={fyMain || posts[0]} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <FYList post={fyList1 || posts[0]} />
              <FYList post={fyList2 || posts[0]} />
            </div>
          </div>

          {/* Latest Blogs Section */}
          <SectionHeader title="Latest Blogs" />
          <div className="latest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {latestTall && (
              <div className="latest-tall" style={{ gridRow: "span 2" }}>
                <LatestCard post={latestTall} tall={true} />
              </div>
            )}
            {latestCards.map((p, idx) => (
              <LatestCard key={idx} post={p} />
            ))}
          </div>
        </>
      )}

      {/* Global CSS for responsiveness and hover effects */}
      <style>{`
        .hover-scale-img:hover {
          transform: scale(1.05);
        }
        @media (max-width: 1024px) {
          .foryou-grid {
            grid-template-columns: 1fr !important;
          }
          .latest-tall {
            grid-row: auto !important;
          }
        }
        @media (max-width: 768px) {
          .trending-grid {
            flex-direction: column !important;
          }
          .trend-large, .trend-small {
            flex: 1 1 auto !important;
          }
          .latest-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogListPage;
