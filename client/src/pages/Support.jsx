import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ─── SVG ICONS ─── */
const HelpIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TruckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ReturnIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq");

  const tabs = [
    { id: "faq", label: "FAQ", icon: <HelpIcon /> },
    { id: "shipping", label: "Shipping Info", icon: <TruckIcon /> },
    { id: "returns", label: "Returns", icon: <ReturnIcon /> },
    { id: "community", label: "Community", icon: <UsersIcon /> },
    { id: "contact", label: "Contact Us", icon: <MailIcon /> },
  ];

  return (
    <div style={{ paddingTop: 0 }}>
      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ padding: "4rem 0 3rem", minHeight: "auto" }}>
        <div className="hero-bg-glow hero-bg-glow-1" aria-hidden="true" />
        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <span
            className="badge badge-purple"
            style={{ marginBottom: "1rem", display: "inline-flex" }}
          >
            <HelpIcon /> Customer Support
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            How Can We{" "}
            <span
              style={{
                color: "var(--color-neon-cyan)",
                textShadow: "0 0 20px rgba(0,245,255,0.6)",
              }}
            >
              Help You?
            </span>
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            From troubleshooting your new hot-swappable board to tracking your
            recent switch order, we've got you covered.
          </p>
        </div>
      </section>

      {/* ═══ CONTENT TABS ═══ */}
      <section style={{ padding: "2rem 0 5rem" }}>
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
        >
          {/* Tabs Navigation */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              borderBottom: "1px solid rgba(0,245,255,0.1)",
              paddingBottom: "1.5rem",
            }}
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 1.5rem",
                  background:
                    activeTab === tab.id
                      ? "rgba(0,245,255,0.1)"
                      : "transparent",
                  border: `1px solid ${activeTab === tab.id ? "rgba(0,245,255,0.3)" : "transparent"}`,
                  borderRadius: "8px",
                  color:
                    activeTab === tab.id ? "#fff" : "var(--color-text-muted)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow:
                    activeTab === tab.id
                      ? "0 0 15px rgba(0,245,255,0.1)"
                      : "none",
                }}
              >
                <span
                  style={{
                    color:
                      activeTab === tab.id
                        ? "var(--color-neon-cyan)"
                        : "inherit",
                  }}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div
            className="glass-card"
            style={{ padding: "3rem", minHeight: "400px" }}
          >
            {/* 1. FAQ */}
            {activeTab === "faq" && (
              <div className="animate-fade-in stack-md">
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    color: "#fff",
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <div
                  style={{ display: "grid", gap: "1.5rem", marginTop: "1rem" }}
                >
                  {[
                    {
                      q: "Are the keyboards fully hot-swappable?",
                      a: "Yes. All our premium boards support 3-pin and 5-pin MX style mechanical switches. You can swap them easily without any soldering required.",
                    },
                    {
                      q: "Do you offer warranty?",
                      a: "We offer a 2-year warranty on all keyboards and barebones kits covering manufacturing defects. Keycaps and switches are covered for 6 months.",
                    },
                    {
                      q: "Can I cancel my pre-order?",
                      a: "Pre-orders can be cancelled for a full refund up to 48 hours before the estimated shipping date. Once processing begins, standard return policies apply.",
                    },
                    {
                      q: "How do I configure the RGB and Macros?",
                      a: "You can download the KeyCrafter Companion App from our Home page. It supports per-key RGB layering and advanced macro assignments.",
                    },
                  ].map((faq, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1.5rem",
                        background: "rgba(13,13,40,0.4)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          color: "var(--color-neon-cyan)",
                          marginBottom: "0.5rem",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {faq.q}
                      </h3>
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          lineHeight: 1.6,
                          fontSize: "0.95rem",
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Shipping Info */}
            {activeTab === "shipping" && (
              <div className="animate-fade-in stack-md">
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    color: "#fff",
                  }}
                >
                  Shipping Information
                </h2>
                <p style={{ color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  Our warehouse operates Monday through Friday. We take pride in securely packaging your mechanical keyboards, delicate switches, and premium keycaps to ensure they reach you safely. Once your order leaves our facility, you will receive an automated email with tracking information.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "2rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      padding: "2rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "1.2rem",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ color: "var(--color-neon-cyan)" }}>○</span>{" "}
                      Domestic (US)
                    </h3>
                    <ul
                      style={{
                        color: "var(--color-text-muted)",
                        display: "grid",
                        gap: "0.75rem",
                        paddingLeft: "1.5rem",
                        lineHeight: 1.6,
                      }}
                    >
                      <li><strong>Standard (USPS/UPS):</strong> 3-5 business days. Best for components and accessories.</li>
                      <li><strong>Expedited (FedEx/UPS 2-Day):</strong> 1-2 business days. Ideal for heavy barebones kits.</li>
                      <li>
                        <strong style={{ color: "var(--color-neon-cyan)" }}>
                          Free standard shipping
                        </strong>{" "}
                        on domestic orders over $99.
                      </li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      padding: "2rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "1.2rem",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ color: "var(--color-neon-cyan)" }}>○</span>{" "}
                      International
                    </h3>
                    <ul
                      style={{
                        color: "var(--color-text-muted)",
                        display: "grid",
                        gap: "0.75rem",
                        paddingLeft: "1.5rem",
                        lineHeight: 1.6,
                      }}
                    >
                      <li><strong>Economy:</strong> 10-21 business days. Tracking details might be limited outside the US.</li>
                      <li><strong>Priority (DHL/FedEx):</strong> 5-7 business days. Fully tracked from warehouse to your door.</li>
                      <li><strong>Customs & Duties:</strong> Import taxes and duties are the buyer's responsibility and are not included in the checkout price.</li>
                    </ul>
                  </div>
                </div>

                <div
                  style={{
                    padding: "1.5rem",
                    background: "rgba(0,245,255,0.05)",
                    borderLeft: "4px solid var(--color-neon-cyan)",
                    borderRadius: "8px",
                    marginTop: "1rem"
                  }}
                >
                  <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>Order Processing Times</h4>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    In-stock items typically ship within <strong>1-2 business days</strong>. Group Buy (GB) and pre-order items will have estimated shipping dates listed on their specific product pages. If your order contains both in-stock and pre-order items, it will ship once all items become available.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Returns */}
            {activeTab === "returns" && (
              <div className="animate-fade-in stack-md">
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    color: "#fff",
                  }}
                >
                  Returns & Exchanges
                </h2>
                <div
                  style={{
                    padding: "2.5rem",
                    background: "rgba(13,13,40,0.5)",
                    borderRadius: "12px",
                    borderLeft: "4px solid #bf00ff",
                    marginTop: "1rem",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      marginBottom: "1rem",
                      fontSize: "1.4rem",
                    }}
                  >
                    30-Day Return Policy
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                    }}
                  >
                    We want you to love your keyboard. If you are not entirely satisfied with your purchase, you have <strong>30 days from the date of delivery</strong> to initiate a return. To be eligible, items must be in their original, factory-sealed condition. Keyboards must not have been modified, opened, or altered.
                  </p>

                  <h4 style={{ color: "var(--color-neon-cyan)", marginBottom: "0.75rem", fontSize: "1.1rem" }}>
                    How to Initiate a Return:
                  </h4>
                  <ol
                    style={{
                      color: "var(--color-text-muted)",
                      paddingLeft: "1.2rem",
                      marginBottom: "2rem",
                      gap: "0.6rem",
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.6
                    }}
                  >
                    <li>Submit a ticket through our Contact form with your Order ID and reason for return.</li>
                    <li>Our team will review your request and issue a Return Merchandise Authorization (RMA) number.</li>
                    <li>Securely pack the items and ship them back using a tracked carrier.</li>
                    <li>Refunds are processed within 3-5 business days after we inspect the returned items.</li>
                  </ol>

                  <h4
                    style={{
                      color: "#ff5555",
                      marginBottom: "0.75rem",
                      fontSize: "1.1rem"
                    }}
                  >
                    Exceptions & Important Notes:
                  </h4>
                  <ul
                    style={{
                      color: "var(--color-text-dim)",
                      paddingLeft: "1.5rem",
                      listStyleType: "circle",
                      gap: "0.6rem",
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.6
                    }}
                  >
                    <li><strong>Lubed or modified switches:</strong> Cannot be returned under any circumstance.</li>
                    <li><strong>Group Buy (GB) Items:</strong> All Group Buy and pre-order sales are final unless the product arrives defective.</li>
                    <li><strong>Restocking Fee:</strong> A 15% restocking fee may apply for items that have been opened but are otherwise accepted for return.</li>
                    <li><strong>Shipping Costs:</strong> Original shipping charges are non-refundable, and customers are responsible for return shipping out-of-pocket unless the specific reason for return involves our error.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. Community */}
            {activeTab === "community" && (
              <div
                className="animate-fade-in stack-md"
                style={{ textAlign: "center" }}
              >
                <div style={{ marginBottom: "2rem" }}>
                  <UsersIcon
                    style={{
                      width: 48,
                      height: 48,
                      color: "#bf00ff",
                      marginBottom: "1rem",
                    }}
                  />
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.5rem",
                      color: "#fff",
                    }}
                  >
                    Join The Squad
                  </h2>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      maxWidth: "500px",
                      margin: "0 auto",
                      lineHeight: 1.6,
                      marginTop: "1rem",
                    }}
                  >
                    Connect with over 50,000 keyboard enthusiasts. Share your
                    builds, find inspiration for keycap combinations, and
                    participate in exclusive giveaways.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="#"
                    className="button button-primary"
                    style={{
                      background: "#5865F2",
                      borderColor: "#5865F2",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Discord Server
                  </a>
                  <a
                    href="#"
                    className="button button-secondary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Reddit r/KeyCrafter
                  </a>
                </div>
              </div>
            )}

            {/* 5. Contact Us */}
            {activeTab === "contact" && (
              <div
                className="animate-fade-in"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: "4rem",
                  alignItems: "start",
                }}
              >
                <div className="stack-md">
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2rem",
                      color: "#fff",
                    }}
                  >
                    Contact Us
                  </h2>
                  <p style={{ color: "var(--color-text-muted)" }}>
                    Need further assistance? Leave a message and our support
                    team will get back to you within 24 hours.
                  </p>

                  <div
                    style={{
                      marginTop: "2rem",
                      display: "grid",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          color: "var(--color-neon-cyan)",
                          display: "block",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Email
                      </strong>
                      <span style={{ color: "var(--color-text-muted)" }}>
                        support@keycrafter.local
                      </span>
                    </div>
                    <div>
                      <strong
                        style={{
                          color: "var(--color-neon-cyan)",
                          display: "block",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Business Hours
                      </strong>
                      <span style={{ color: "var(--color-text-muted)" }}>
                        Mon - Fri: 9:00 AM - 6:00 PM (EST)
                      </span>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thanks for reaching out! Your message was sent.");
                  }}
                  className="stack-sm"
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    padding: "2rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(0,245,255,0.1)",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--color-text-dim)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--color-text-dim)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--color-text-dim)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Ticket Type
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(13,13,40,0.8)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                      }}
                    >
                      <option>Order Issue</option>
                      <option>Technical Support</option>
                      <option>Returns</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--color-text-dim)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      placeholder="Describe your issue..."
                      rows="5"
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="button button-primary button-block"
                    style={{ marginTop: "1rem" }}
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
