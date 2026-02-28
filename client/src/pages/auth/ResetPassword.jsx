import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useResetPasswordMutation } from "@/features/auth/auth.api";

const KeyIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FieldLabel = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: "block",
      marginBottom: "0.4rem",
      fontSize: "0.75rem",
      fontFamily: "var(--font-display)",
      letterSpacing: "0.1em",
      color: "var(--color-text-muted)",
      textTransform: "uppercase",
    }}
  >
    {children}
  </label>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token: tokenFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || tokenFromPath;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/.test(
      password,
    );
    if (!isStrongPassword) {
      setError(
        "Password must be 8-30 chars and include uppercase, lowercase, and a number.",
      );
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await resetPassword({ token, newPassword: password }).unwrap();
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err?.data?.details?.[0] ||
          err?.data?.message ||
          "Reset failed. The link may have expired.",
      );
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(0,245,255,0.15)",
    borderRadius: "8px",
    padding: "0.7rem 0.9rem",
    color: "var(--color-text)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {done ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                background: "rgba(57,255,20,0.1)",
                border: "2px solid rgba(57,255,20,0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "#39ff14",
                boxShadow: "0 0 25px rgba(57,255,20,0.2)",
              }}
            >
              <CheckIcon />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "0.5rem",
              }}
            >
              Password Updated
            </h1>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.88rem",
                marginBottom: "1.5rem",
              }}
            >
              Your password has been reset. Redirecting to login...
            </p>
            <div
              style={{
                height: "3px",
                background: "rgba(57,255,20,0.15)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#39ff14",
                  borderRadius: "99px",
                  animation: "progress 3s linear forwards",
                }}
              />
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  background: "rgba(0,245,255,0.1)",
                  border: "1px solid rgba(0,245,255,0.3)",
                  borderRadius: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.2rem",
                  color: "var(--color-neon-cyan)",
                  boxShadow: "0 0 20px rgba(0,245,255,0.2)",
                }}
              >
                <KeyIcon />
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#fff",
                  marginBottom: "0.4rem",
                }}
              >
                Set New Password
              </h1>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                Choose a strong password for your account
              </p>
            </div>

            {!token && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255,200,0,0.08)",
                  border: "1px solid rgba(255,200,0,0.25)",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ color: "#ffcc00", fontSize: "0.82rem" }}>
                  ⚠ No reset token found. Please use the link sent to your
                  email.
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: "1rem" }}
            >
              <div>
                <FieldLabel htmlFor="rp-password">New Password</FieldLabel>
                <input
                  id="rp-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-neon-cyan)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,245,255,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,245,255,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <FieldLabel htmlFor="rp-confirm">Confirm Password</FieldLabel>
                <input
                  id="rp-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-neon-cyan)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,245,255,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0,245,255,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  style={{
                    padding: "0.6rem 0.85rem",
                    background: "rgba(255,50,50,0.08)",
                    border: "1px solid rgba(255,50,50,0.25)",
                    borderRadius: "8px",
                    color: "#ff5555",
                    fontSize: "0.82rem",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="button button-primary button-block"
                style={{
                  padding: "0.85rem",
                  fontSize: "0.88rem",
                  marginTop: "0.25rem",
                  justifyContent: "center",
                }}
                disabled={isLoading || !token}
              >
                {isLoading ? "Updating..." : "Update Password →"}
              </button>
            </form>

            <div className="neon-divider" style={{ margin: "1.5rem 0" }} />
            <p
              style={{
                textAlign: "center",
                color: "var(--color-text-muted)",
                fontSize: "0.83rem",
              }}
            >
              Remember it now?{" "}
              <a
                href="/login"
                style={{
                  color: "var(--color-neon-cyan)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Back to Login
              </a>
            </p>
          </>
        )}

        <style>{`@keyframes progress { from { width:0% } to { width:100% } }`}</style>
      </div>
    </div>
  );
};

export default ResetPassword;
