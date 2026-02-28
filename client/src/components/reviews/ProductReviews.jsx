import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/features/reviews/reviews.api";
import { API_BASE_URL } from "@/lib/constants";

/** Ensure image URL is absolute.
 *  Stored value might be:
 *   - full URL:  "http://localhost:3000/uploads/review-xxx.jpg"
 *   - relative:  "/uploads/review-xxx.jpg"
 */
const resolveImageUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  // relative path → prepend server origin
  const origin = API_BASE_URL.replace("/api", "");
  return `${origin}${src.startsWith("/") ? "" : "/"}${src}`;
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const StarIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#ffd700" : "none"}
    stroke="#ffd700"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating = ({ value }) => (
  <span style={{ display: "inline-flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i} filled={i <= Math.round(value)} />
    ))}
  </span>
);

const InteractiveStars = ({ value, onChange }) => (
  <span style={{ display: "inline-flex", gap: "4px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          transition: "transform 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        aria-label={`${s} stars`}
      >
        <StarIcon filled={s <= value} />
      </button>
    ))}
  </span>
);

/* ═══════════════════════════════════════════════════════════════
   LIGHTBOX PORTAL — renders at <body> level so position:fixed works
   regardless of parent CSS transforms / will-change / overflow
═══════════════════════════════════════════════════════════════ */
const LightboxPortal = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    // Prevent body scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.93)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Main image */}
      <img
        src={resolveImageUrl(images[index])}
        alt={`Review photo ${index + 1} of ${images.length}`}
        style={{
          maxWidth: "min(90vw, 720px)",
          maxHeight: "72vh",
          objectFit: "contain",
          borderRadius: "12px",
          border: "1px solid rgba(0,245,255,0.2)",
          boxShadow: "0 0 48px rgba(0,245,255,0.12)",
          display: "block",
        }}
      />

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "6px",
                overflow: "hidden",
                border: `2px solid ${i === index ? "var(--color-neon-cyan, #00f5ff)" : "rgba(255,255,255,0.15)"}`,
                cursor: "pointer",
                padding: 0,
                background: "transparent",
                flexShrink: 0,
                transition: "border-color 0.15s",
              }}
              aria-label={`Go to photo ${i + 1}`}
            >
              <img
                src={resolveImageUrl(src)}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Left arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={prev}
          style={{
            position: "fixed",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(0,245,255,0.3)",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#00f5ff",
            fontSize: "1.5rem",
            lineHeight: 1,
            zIndex: 100000,
          }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Right arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={next}
          style={{
            position: "fixed",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(0,245,255,0.3)",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#00f5ff",
            fontSize: "1.5rem",
            lineHeight: 1,
            zIndex: 100000,
          }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}

      {/* Counter */}
      <span
        style={{
          position: "fixed",
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-display, sans-serif)",
          fontWeight: 600,
          letterSpacing: "0.06em",
          zIndex: 100000,
        }}
      >
        {index + 1} / {images.length}
      </span>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: "1.3rem",
          lineHeight: 1,
          zIndex: 100000,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
        }
        aria-label="Close photo viewer"
      >
        ×
      </button>
    </div>,
    document.body,
  );
};

/* ═══════════════════════════════════════════════════════════════
   IMAGE GALLERY  (max 2 thumbnails + "+N" overflow button)
═══════════════════════════════════════════════════════════════ */
const ImageGallery = ({ images }) => {
  const [lightboxStart, setLightboxStart] = useState(null);

  if (!images || images.length === 0) return null;

  const MAX_VISIBLE = 2;
  const visible = images.slice(0, MAX_VISIBLE);
  const overflow = images.length - MAX_VISIBLE;

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "0.45rem",
          flexWrap: "wrap",
          marginTop: "0.5rem",
        }}
      >
        {visible.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxStart(i)}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid rgba(0,245,255,0.2)",
              cursor: "pointer",
              padding: 0,
              background: "rgba(0,0,0,0.2)",
              flexShrink: 0,
              transition: "border-color 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.6)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label={`View photo ${i + 1}`}
          >
            <img
              src={resolveImageUrl(src)}
              alt={`Review photo ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </button>
        ))}

        {/* "+N" overflow button */}
        {overflow > 0 && (
          <button
            type="button"
            onClick={() => setLightboxStart(MAX_VISIBLE)}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "8px",
              border: "1px solid rgba(0,245,255,0.25)",
              cursor: "pointer",
              background: "rgba(0,245,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,245,255,0.14)";
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,245,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.25)";
            }}
            aria-label={`Show ${overflow} more photo${overflow > 1 ? "s" : ""}`}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "1rem",
                color: "var(--color-neon-cyan)",
              }}
            >
              +{overflow}
            </span>
          </button>
        )}
      </div>

      {/* Lightbox — rendered via Portal at <body> */}
      {lightboxStart !== null && (
        <LightboxPortal
          images={images}
          startIndex={lightboxStart}
          onClose={() => setLightboxStart(null)}
        />
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   IMAGE UPLOAD PICKER  (used inside ReviewForm)
═══════════════════════════════════════════════════════════════ */
const ImageUploadPicker = ({ previews, onAdd, onRemove, uploading }) => {
  const fileRef = useRef(null);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "0.5rem",
        }}
      >
        Photos{" "}
        <span
          style={{
            fontSize: "0.68rem",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          (max 3, 5 MB each)
        </span>
      </label>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {/* Preview thumbnails */}
        {previews.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: "72px",
              height: "72px",
              borderRadius: "8px",
              overflow: "visible",
            }}
          >
            <img
              src={src}
              alt={`Preview ${i + 1}`}
              style={{
                width: "72px",
                height: "72px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid rgba(0,245,255,0.3)",
                display: "block",
              }}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "rgba(255,50,50,0.9)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.85rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
              aria-label={`Remove photo ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}

        {/* Add button */}
        {previews.length < 3 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "8px",
              border: "2px dashed rgba(0,245,255,0.3)",
              background: "rgba(0,245,255,0.03)",
              cursor: uploading ? "not-allowed" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              color: "var(--color-neon-cyan)",
              transition: "all 0.2s",
              opacity: uploading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!uploading)
                e.currentTarget.style.borderColor = "rgba(0,245,255,0.65)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)";
            }}
            aria-label="Add photo"
          >
            {uploading ? (
              <span style={{ fontSize: "0.65rem", textAlign: "center" }}>
                Uploading…
              </span>
            ) : (
              <>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                  }}
                >
                  ADD
                </span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={onAdd}
          id="review-image-input"
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   REVIEW FORM
═══════════════════════════════════════════════════════════════ */
const ReviewForm = ({
  productId,
  orderId,
  isEdit = false,
  reviewId = null,
  initialData = null,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [imagePreviews, setImagePreviews] = useState(
    initialData?.images?.map(resolveImageUrl) || [],
  ); // local blob URLs
  const [uploadedUrls, setUploadedUrls] = useState(initialData?.images || []); // server URLs after upload
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const token = useSelector((s) => s.auth?.token);
  const [createReview, { isLoading: creating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();
  const submitting = creating || updating;

  /* ── Handle file selection → upload immediately ── */
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 3 - imagePreviews.length;
    const selected = files.slice(0, remaining);

    // Show local previews immediately
    const blobs = selected.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...blobs]);
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      selected.forEach((f) => formData.append("images", f));

      const res = await fetch(
        `${API_BASE_URL.replace("/api", "")}/api/upload/review-image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      const urls = json.data?.urls || [];
      setUploadedUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      // Rollback previews on error
      setImagePreviews((prev) => prev.slice(0, prev.length - selected.length));
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
      // Reset file input so same files can be reselected
      e.target.value = "";
    }
  };

  /* ── Remove a preview + its uploaded URL ── */
  const handleRemove = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Submit review ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEdit) {
        await updateReview({
          id: reviewId,
          rating,
          comment,
          images: uploadedUrls,
        }).unwrap();
      } else {
        await createReview({
          productId,
          rating,
          comment,
          orderId,
          images: uploadedUrls,
        }).unwrap();
      }
      // cleanup blob URLs
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err?.data?.message || "Failed to submit review.");
    }
  };

  const canSubmit = !submitting && !uploading && comment.length >= 10;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "rgba(0,245,255,0.03)",
        border: "1px solid rgba(0,245,255,0.15)",
        borderRadius: "12px",
        padding: "1.5rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "#e8e8ff",
          margin: 0,
        }}
      >
        {isEdit ? "Edit Review" : "Write a Review"}
      </h4>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Your Rating
        </span>
        <InteractiveStars value={rating} onChange={setRating} />
        <span style={{ fontSize: "0.8rem", color: "#ffd700", fontWeight: 700 }}>
          {rating}/5
        </span>
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="review-comment"
          style={{
            display: "block",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.5rem",
          }}
        >
          Comment <span style={{ color: "#ff5555" }}>*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder="Share your experience with this product (min. 10 characters)…"
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(0,245,255,0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            color: "#e8e8ff",
            fontSize: "0.87rem",
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.2)")}
        />
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--color-text-dim)",
            marginTop: "0.25rem",
            textAlign: "right",
          }}
        >
          {comment.length}/1000
        </p>
      </div>

      {/* Image upload */}
      <ImageUploadPicker
        previews={imagePreviews}
        onAdd={handleFileChange}
        onRemove={handleRemove}
        uploading={uploading}
      />

      {/* Error */}
      {error && (
        <p
          style={{
            background: "rgba(255,50,50,0.1)",
            border: "1px solid rgba(255,50,50,0.25)",
            borderRadius: "6px",
            padding: "0.5rem 0.75rem",
            color: "#ff7070",
            fontSize: "0.82rem",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div
        style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.55rem 1.2rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: "0.55rem 1.5rem",
            background: canSubmit
              ? "rgba(0,245,255,0.15)"
              : "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.4)",
            borderRadius: "8px",
            color: "var(--color-neon-cyan)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontSize: "0.82rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            opacity: canSubmit ? 1 : 0.5,
            transition: "all 0.2s",
          }}
        >
          {submitting
            ? isEdit
              ? "Saving…"
              : "Submitting…"
            : uploading
              ? "Uploading…"
              : isEdit
                ? "Save Changes"
                : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SINGLE REVIEW CARD
═══════════════════════════════════════════════════════════════ */
const ReviewCard = ({ review, currentUserId }) => {
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const isOwner = currentUserId && review.user?._id === currentUserId;
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(review._id).unwrap();
    } catch {
      /* silent */
    }
  };

  if (isEditing) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "10px",
          border: "1px solid rgba(0,245,255,0.15)",
        }}
      >
        <ReviewForm
          isEdit={true}
          reviewId={review._id}
          initialData={{
            rating: review.rating,
            comment: review.comment,
            images: review.images,
          }}
          onClose={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(0,245,255,0.08)",
        borderRadius: "10px",
        display: "grid",
        gap: "0.5rem",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.25rem",
        }}
      >
        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(0,245,255,0.15)",
              border: "1px solid rgba(0,245,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--color-neon-cyan)",
              fontFamily: "var(--font-display)",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {review.user?.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              (review.user?.name || "U")[0].toUpperCase()
            )}
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#e8e8ff",
                margin: 0,
              }}
            >
              {review.user?.name || "User"}
            </p>
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--color-text-dim)",
                margin: 0,
              }}
            >
              {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Rating + delete */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <StarRating value={review.rating} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#ffd700",
              fontFamily: "var(--font-display)",
            }}
          >
            {review.rating}.0
          </span>
          {isOwner && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={deleting}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-neon-cyan)",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "4px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
                title="Edit your review"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff5555",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "4px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  opacity: deleting ? 0.5 : 1,
                }}
                title="Delete your review"
              >
                {deleting ? "…" : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comment */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--color-text)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {review.comment}
      </p>

      {/* Images — max 2 visible + "+N" */}
      <ImageGallery images={review.images} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
const ProductReviews = ({ productId, orderId, canReview = false }) => {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isFetching } = useGetProductReviewsQuery(
    { productId, limit: 20 },
    { skip: !productId },
  );
  const currentUser = useSelector((s) => s.auth?.user);

  const reviews = data?.data?.items || data?.items || [];
  const total =
    data?.data?.pagination?.total ?? data?.pagination?.total ?? reviews.length;
  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const userAlreadyReviewed =
    currentUser && reviews.some((r) => r.user?._id === currentUser._id);

  return (
    <div id="product-reviews" style={{ display: "grid", gap: "1.25rem" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
            }}
          >
            Customer Reviews
          </h2>
          {avg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.3rem",
              }}
            >
              <StarRating value={parseFloat(avg)} />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#ffd700",
                }}
              >
                {avg}
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-text-muted)",
                }}
              >
                ({total} {total === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {canReview && currentUser && !userAlreadyReviewed && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            style={{
              padding: "0.5rem 1.2rem",
              background: "rgba(0,245,255,0.1)",
              border: "1px solid rgba(0,245,255,0.35)",
              borderRadius: "8px",
              color: "var(--color-neon-cyan)",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,245,255,0.18)";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(0,245,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,245,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ✦ Write a Review
          </button>
        )}

        {userAlreadyReviewed && (
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--color-neon-cyan)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            ✓ You reviewed this product
          </span>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          orderId={orderId}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* List */}
      {isLoading || isFetching ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--color-text-muted)",
            fontSize: "0.85rem",
          }}
        >
          Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 1rem",
            background: "rgba(0,245,255,0.02)",
            border: "1px dashed rgba(0,245,255,0.12)",
            borderRadius: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💬</p>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            No reviews yet.{" "}
            {canReview && currentUser && !userAlreadyReviewed
              ? "Be the first to review this product!"
              : "Purchase and receive this product to leave a review."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUser?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
