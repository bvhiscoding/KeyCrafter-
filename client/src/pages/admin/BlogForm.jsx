import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetAdminBlogByIdQuery,
} from "@/modules/blog/api/blog.api";
import Loader from "@/components/common/Loader";

const CATEGORIES = [
  { value: "review", label: "⭐ Review" },
  { value: "comparison", label: "⚖️ Comparison" },
  { value: "guide", label: "📖 Guide" },
  { value: "news", label: "📰 News" },
  { value: "keycap", label: "🔤 Keycap" },
  { value: "switch", label: "🔴 Switch" },
  { value: "keyboard", label: "⌨️ Keyboard" },
  { value: "custom", label: "🛠️ Custom Build" },
  { value: "other", label: "📝 Other" },
];

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const DEFAULT_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "other",
  tags: "",
  rating: "",
  status: "draft",
  isFeatured: false,
  seo: { metaTitle: "", metaDescription: "" },
};

// ── Styled input helper ───────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.9rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "var(--font-display)",
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontFamily: "var(--font-display)",
  fontSize: "0.73rem",
  fontWeight: 700,
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "0.4rem",
};

const Field = ({ label, hint, children }) => (
  <div style={{ display: "grid", gap: "0.1rem" }}>
    <label style={labelStyle}>{label}</label>
    {children}
    {hint && (
      <p
        style={{
          fontSize: "0.68rem",
          color: "var(--color-text-dim)",
          marginTop: "0.2rem",
        }}
      >
        {hint}
      </p>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existingData, isLoading: loadingExisting } =
    useGetAdminBlogByIdQuery(id, {
      skip: !isEdit,
    });

  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("content"); // content | seo | preview

  // Populate form when editing
  useEffect(() => {
    if (existingData?.data) {
      const b = existingData.data;
      setForm({
        title: b.title || "",
        excerpt: b.excerpt || "",
        content: b.content || "",
        coverImage: b.coverImage || "",
        category: b.category || "other",
        tags: (b.tags || []).join(", "),
        rating: b.rating ?? "",
        status: b.status || "draft",
        isFeatured: b.isFeatured || false,
        seo: {
          metaTitle: b.seo?.metaTitle || "",
          metaDescription: b.seo?.metaDescription || "",
        },
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("seo.")) {
      const key = name.replace("seo.", "");
      setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const tagsArr = form.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      ...form,
      tags: tagsArr,
      rating: form.rating !== "" ? Number(form.rating) : null,
      seo: {
        metaTitle: form.seo.metaTitle || undefined,
        metaDescription: form.seo.metaDescription || undefined,
      },
    };

    try {
      if (isEdit) {
        await updateBlog({ id, ...payload }).unwrap();
      } else {
        await createBlog(payload).unwrap();
      }
      navigate("/admin/blog");
    } catch (err) {
      setError(err?.data?.message || "An error occurred, please try again");
    }
  };

  if (isEdit && loadingExisting) return <Loader message="Loading article..." />;

  const isSaving = creating || updating;
  const wordCount = form.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const tabBtnStyle = (active) => ({
    padding: "0.45rem 1rem",
    borderRadius: "8px 8px 0 0",
    border: active
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid transparent",
    borderBottom: active ? "1px solid transparent" : "none",
    background: active ? "rgba(255,255,255,0.04)" : "transparent",
    color: active ? "#e8e8ff" : "var(--color-text-muted)",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "0.78rem",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.2rem",
          }}
        >
          {isEdit ? "✏️ Edit Post" : "📝 Create New Post"}
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
          {wordCount} words · ~{readTime} min read
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "1.25rem",
            alignItems: "start",
          }}
        >
          {/* ── Left: main content ── */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* Title */}
            <div
              className="glass-card"
              style={{ padding: "1.25rem", borderRadius: "12px" }}
            >
              <Field label="Post Title *">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Gateron Yellow Review – Best budget switch"
                  style={{
                    ...inputStyle,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                  }}
                  required
                />
              </Field>
              <div style={{ marginTop: "0.75rem" }}>
                <Field
                  label="Excerpt"
                  hint="Displayed in list view, max 500 characters"
                >
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="Short description of the post..."
                    rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </Field>
              </div>
            </div>

            {/* Tabs: Content / SEO / Preview */}
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "0.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "-1px",
                }}
              >
                {["content", "seo", "preview"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={tabBtnStyle(activeTab === tab)}
                  >
                    {tab === "content"
                      ? "📝 Content"
                      : tab === "seo"
                        ? "🔍 SEO"
                        : "👁 Preview"}
                  </button>
                ))}
              </div>

              <div
                className="glass-card"
                style={{ padding: "1.25rem", borderRadius: "0 12px 12px 12px" }}
              >
                {activeTab === "content" && (
                  <Field
                    label="Content *"
                    hint="Basic HTML supported. Line breaks are mapped to <br>"
                  >
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Write your post content here..."
                      rows={20}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        lineHeight: 1.7,
                        fontFamily: "monospace",
                      }}
                      required
                    />
                  </Field>
                )}

                {activeTab === "seo" && (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <Field
                      label="Meta Title"
                      hint={`${form.seo.metaTitle.length}/70 characters`}
                    >
                      <input
                        name="seo.metaTitle"
                        value={form.seo.metaTitle}
                        onChange={handleChange}
                        placeholder="SEO Title (if different from post title)"
                        style={inputStyle}
                        maxLength={70}
                      />
                    </Field>
                    <Field
                      label="Meta Description"
                      hint={`${form.seo.metaDescription.length}/160 characters`}
                    >
                      <textarea
                        name="seo.metaDescription"
                        value={form.seo.metaDescription}
                        onChange={handleChange}
                        placeholder="SEO description for search engines..."
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                        maxLength={160}
                      />
                    </Field>
                  </div>
                )}

                {activeTab === "preview" && (
                  <div>
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        background: "rgba(0,245,255,0.04)",
                        border: "1px solid rgba(0,245,255,0.15)",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        fontSize: "0.75rem",
                        color: "var(--color-neon-cyan)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      Preview is an estimation · Render may vary slightly when
                      published
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        color: "#fff",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {form.title || "Post Title"}
                    </h2>
                    {form.excerpt && (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          marginBottom: "1.5rem",
                          fontStyle: "italic",
                        }}
                      >
                        {form.excerpt}
                      </p>
                    )}
                    <div
                      style={{
                        color: "var(--color-text-muted)",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          form.content.replace(/\n/g, "<br />") ||
                          "<em>No content</em>",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: settings sidebar ── */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* Publish settings */}
            <div
              className="glass-card"
              style={{ padding: "1.1rem", borderRadius: "12px" }}
            >
              <p style={{ ...labelStyle, marginBottom: "0.85rem" }}>
                Publish Settings
              </p>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                <Field label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Category">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Featured toggle */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    cursor: "pointer",
                    padding: "0.5rem 0",
                  }}
                >
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      accentColor: "#ffcc00",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: form.isFeatured
                        ? "#ffcc00"
                        : "var(--color-text-muted)",
                    }}
                  >
                    ⭐ Featured post
                  </span>
                </label>
              </div>
            </div>

            {/* Review rating */}
            {(form.category === "review" || form.category === "comparison") && (
              <div
                className="glass-card"
                style={{ padding: "1.1rem", borderRadius: "12px" }}
              >
                <Field
                  label="Rating (1-10)"
                  hint="For review/comparison categories only"
                >
                  <input
                    name="rating"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="e.g. 8.5"
                    style={inputStyle}
                  />
                </Field>
                {form.rating && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      height: "6px",
                      borderRadius: "3px",
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(Number(form.rating) / 10) * 100}%`,
                        background:
                          Number(form.rating) >= 8
                            ? "#39ff14"
                            : Number(form.rating) >= 6
                              ? "#00f5ff"
                              : "#ffcc00",
                        borderRadius: "3px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tags & image */}
            <div
              className="glass-card"
              style={{ padding: "1.1rem", borderRadius: "12px" }}
            >
              <div style={{ display: "grid", gap: "0.85rem" }}>
                <Field
                  label="Tags"
                  hint="Comma separated. e.g. cherry mx, switch, tactile"
                >
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="cherry mx, switch, 65%..."
                    style={inputStyle}
                  />
                </Field>

                <Field
                  label="Cover Image (URL)"
                  hint="Paste image URL (Cloudinary or other)"
                >
                  <input
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </Field>

                {/* Cover preview */}
                {form.coverImage && (
                  <div
                    style={{
                      height: "120px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255,50,50,0.08)",
                  border: "1px solid rgba(255,50,50,0.2)",
                  borderRadius: "8px",
                  color: "#ff5555",
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-display)",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: "0.7rem",
                  background: isSaving
                    ? "rgba(0,245,255,0.05)"
                    : "rgba(0,245,255,0.12)",
                  border: "1px solid rgba(0,245,255,0.3)",
                  borderRadius: "9px",
                  color: "var(--color-neon-cyan)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  letterSpacing: "0.06em",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.6 : 1,
                  textTransform: "uppercase",
                }}
              >
                {isSaving
                  ? "Saving..."
                  : isEdit
                    ? "💾 Save Changes"
                    : "🚀 Create Post"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/blog")}
                style={{
                  padding: "0.6rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "9px",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default BlogForm;
