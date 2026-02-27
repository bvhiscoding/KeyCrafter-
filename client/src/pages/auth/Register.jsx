import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { useRegisterMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";

const UserPlusIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [registerApi, { isLoading }] = useRegisterMutation();

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Execute registration
      const response = await registerApi({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      // Backend returns { user, accessToken, refreshToken } in res.data
      const { user, accessToken } = response.data || response;

      // Auto-login the user
      dispatch(setCredentials({ token: accessToken, user }));

      // Redirect to home/dashboard
      navigate("/");
    } catch (error) {
      console.error("Register Error:", error);

      // Attempt to extract the error message from the backend response
      let message = "Registration failed. Please try again.";
      if (error?.data?.message) {
        message = error.data.message;
        // Check for joi validation mapping
        if (typeof message === "object" && message["string.pattern.base"]) {
          message = message["string.pattern.base"];
        } else if (typeof message === "object") {
          message = Object.values(message).join(", ");
        }
      }

      setErrorMsg(message);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "rgba(191,0,255,0.1)",
              border: "1px solid rgba(191,0,255,0.3)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "#bf00ff",
              boxShadow: "0 0 20px rgba(191,0,255,0.2)",
            }}
          >
            <UserPlusIcon />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.4rem",
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
            Join the KeyCrafter community
          </p>
        </div>

        {/* Error message box */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.8rem",
              background: "rgba(255,50,50,0.1)",
              border: "1px solid rgba(255,50,50,0.3)",
              borderRadius: "8px",
              color: "#ff5555",
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ display: "block", marginBottom: "0.2rem" }}>
              Error:
            </strong>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              htmlFor="reg-name"
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
              }}
            >
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
              }}
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <p
              style={{
                marginTop: "0.4rem",
                fontSize: "0.75rem",
                color: "var(--color-text-dim)",
                lineHeight: 1.4,
              }}
            >
              * Password must be at least 8 characters and include{" "}
              <strong>1 uppercase</strong>, <strong>1 lowercase</strong>, and{" "}
              <strong>1 number</strong>.
            </p>
          </div>

          <button
            type="submit"
            className="button button-primary button-block"
            style={{
              padding: "0.85rem",
              fontSize: "0.88rem",
              marginTop: "0.25rem",
              background: "linear-gradient(135deg, #bf00ff, #7b00cc)",
              boxShadow: "0 0 20px rgba(191,0,255,0.4)",
            }}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="neon-divider" style={{ margin: "1.5rem 0" }} />

        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "0.85rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--color-neon-cyan)", fontWeight: 600 }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
