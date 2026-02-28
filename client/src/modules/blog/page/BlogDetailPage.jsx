import { useParams, Link } from "react-router-dom";
import { useGetBlogBySlugQuery } from "@/modules/blog/api/blog.api";
import Loader from "@/components/common/Loader";

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

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

// ── Rating display block (for review posts) ───────────────────────────────────
const RatingBar = ({ score }) => {
  const pct = (score / 10) * 100;
  const color =
    score >= 9
      ? "#39ff14"
      : score >= 7
        ? "#00f5ff"
        : score >= 5
          ? "#ffcc00"
          : "#ff5555";

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        borderRadius: "12px",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      {/* Score circle */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: `3px solid ${color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: `${color}10`,
          boxShadow: `0 0 20px ${color}33`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 900,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: "0.6rem", color: "var(--color-text-dim)" }}>
          /10
        </span>
      </div>

      {/* Bar */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.4rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#e8e8ff",
            }}
          >
            Overall Score
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            {score >= 9
              ? "Excellent"
              : score >= 7
                ? "Great"
                : score >= 5
                  ? "Good"
                  : "Average"}
          </span>
        </div>
        <div
          style={{
            height: "8px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              borderRadius: "4px",
              transition: "width 0.8s ease",
              boxShadow: `0 0 8px ${color}55`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Related product card ───────────────────────────────────────────────────────
const RelatedProductCard = ({ product }) => {
  const displayPrice = product.salePrice || product.price;

  return (
    <Link to={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
      <div
        className="glass-card"
        style={{
          padding: "0.85rem",
          borderRadius: "10px",
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          transition: "transform 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateX(4px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateX(0)")
        }
      >
        {product.thumbnail && (
          <img
            src={product.thumbnail}
            alt={product.name}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "8px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#e8e8ff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.name}
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--color-neon-cyan)",
              fontWeight: 700,
            }}
          >
            {displayPrice?.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <span style={{ color: "var(--color-text-dim)", fontSize: "0.8rem" }}>
          →
        </span>
      </div>
    </Link>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetBlogBySlugQuery(slug);
  const post = data?.data;

  if (isLoading) return <Loader message="Loading article..." />;

  if (isError || !post) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "3rem" }}>😕</p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            color: "#e8e8ff",
            fontSize: "1.3rem",
          }}
        >
          Article not found
        </h2>
        <Link
          to="/blog"
          style={{
            color: "var(--color-neon-cyan)",
            textDecoration: "none",
            fontSize: "0.88rem",
          }}
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const cat = CATEGORY_META[post.category] || {
    label: post.category,
    emoji: "📝",
  };
  const color = getCategoryColor(post.category);

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 1rem 4rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            gap: "0.4rem",
            alignItems: "center",
          }}
        >
          <Link
            to="/blog"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.8rem",
              textDecoration: "none",
            }}
          >
            Blog
          </Link>
          <span style={{ color: "var(--color-text-dim)", fontSize: "0.8rem" }}>
            /
          </span>
          <span
            style={{
              color,
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
        </nav>

        {/* Cover image */}
        {post.coverImage && (
          <div
            style={{
              width: "100%",
              height: "380px",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Meta badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1.2rem",
          }}
        >
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "0.72rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: `${color}18`,
              color,
              border: `1px solid ${color}33`,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
          {post.isFeatured && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "99px",
                fontSize: "0.72rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "rgba(255,204,0,0.1)",
                color: "#ffcc00",
                border: "1px solid rgba(255,204,0,0.3)",
              }}
            >
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.25,
            marginBottom: "1rem",
          }}
        >
          {post.title}
        </h1>

        {/* Author + date + stats */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: `${color}18`,
                border: `1px solid ${color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color,
                fontSize: "0.8rem",
              }}
            >
              {(post.author?.name || "K")[0].toUpperCase()}
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#e8e8ff",
              }}
            >
              {post.author?.name || "KeyCrafter"}
            </span>
          </div>
          <span style={{ color: "var(--color-text-dim)", fontSize: "0.78rem" }}>
            📅 {formatDate(post.publishedAt || post.createdAt)}
          </span>
          {post.readTime && (
            <span
              style={{ color: "var(--color-text-dim)", fontSize: "0.78rem" }}
            >
              ⏱ {post.readTime} min read
            </span>
          )}
          <span style={{ color: "var(--color-text-dim)", fontSize: "0.78rem" }}>
            👁 {post.viewCount || 0} views
          </span>
        </div>

        {/* Rating widget (review type) */}
        {post.rating && <RatingBar score={post.rating} />}

        {/* Content */}
        <div
          className="blog-content"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1rem",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
          }}
          dangerouslySetInnerHTML={{
            __html: post.content.replace(/\n/g, "<br />"),
          }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                color: "var(--color-text-dim)",
                fontSize: "0.78rem",
                alignSelf: "center",
              }}
            >
              Tags:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                style={{
                  padding: "3px 10px",
                  borderRadius: "99px",
                  fontSize: "0.72rem",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--color-text-muted)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-neon-cyan)";
                  e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-muted)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Related products */}
        {post.relatedProducts?.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 800,
                color: "#e8e8ff",
                marginBottom: "1rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              🛒 Related Products
            </h3>
            <div
              style={{
                display: "grid",
                gap: "0.6rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              }}
            >
              {post.relatedProducts.map((product) => (
                <RelatedProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.2rem",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "var(--color-text-muted)",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-neon-cyan)";
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
