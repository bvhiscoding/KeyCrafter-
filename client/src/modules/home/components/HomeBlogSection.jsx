import { Link } from "react-router-dom";
import { useGetBlogsQuery } from "@/modules/blog/api/blog.api";

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
        month: "short",
        day: "numeric",
      })
    : "";

const CategoryBadge = ({ category }) => {
  const cat = CATEGORY_META[category] || { label: category, emoji: "📝" };
  const color = getCategoryColor(category);
  return (
    <span
      style={{
        marginBottom: "8px",
        display: "inline-block",
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
  );
};

const BlogCard = ({ post }) => {
  if (!post) return null;
  const color = getCategoryColor(post.category);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass-card"
      style={{
        display: "block",
        position: "relative",
        height: "320px",
        borderRadius: "12px",
        overflow: "hidden",
        textDecoration: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.5), 0 0 15px ${color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: post.coverImage
            ? `url(${post.coverImage}) center/cover`
            : `linear-gradient(135deg, ${color}33 0%, rgba(0,0,0,0.8) 100%)`,
          opacity: 0.8,
        }}
        className="blog-card-bg"
      />
      <div
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "inherit",
          background:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.5rem",
          zIndex: 10,
        }}
      >
        <CategoryBadge category={post.category} />
        <h3
          style={{
            fontSize: "1.2rem",
            color: "#fff",
            margin: "0.5rem 0",
            lineHeight: 1.4,
            fontWeight: 800,
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
          }}
        >
          {post.excerpt}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "var(--color-text-dim)",
          }}
        >
          <span>{formatDate(post.createdAt)}</span>
          <span style={{ color: color, fontWeight: 700 }}>Read →</span>
        </div>
      </div>
    </Link>
  );
};

const HomeBlogSection = () => {
  const { data, isLoading } = useGetBlogsQuery({
    page: 1,
    limit: 3,
    sort: "latest",
  });
  const posts = data?.data?.items ?? [];

  if (!isLoading && posts.length === 0) return null;

  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              className="badge badge-purple"
              style={{ marginBottom: "0.75rem" }}
            >
              Keyboard Culture
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 900,
                color: "#fff",
              }}
            >
              Latest from the{" "}
              <span
                style={{
                  color: "#bf00ff",
                  textShadow: "0 0 15px rgba(191,0,255,0.5)",
                }}
              >
                Blog
              </span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="button button-secondary"
            id="view-all-blogs"
          >
            Read More →
          </Link>
        </div>

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--color-text-muted)",
            }}
          >
            Loading blogs...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {posts.map((post) => (
              <BlogCard key={post._id || post.id || post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .blog-card-bg {
          transition: transform 0.5s ease;
        }
        .glass-card:hover .blog-card-bg {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

export default HomeBlogSection;
