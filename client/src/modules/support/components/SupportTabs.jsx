import { useState } from "react";
import { faqs, supportTabs, contactInfo } from "../data/support.data";

/* ─── Icons ─── */
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

const iconMap = {
  help: <HelpIcon />,
  truck: <TruckIcon />,
  return: <ReturnIcon />,
  users: <UsersIcon />,
  mail: <MailIcon />,
};

/* ─── Tab content components ─── */
const FaqTab = () => (
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
    <div style={{ display: "grid", gap: "1.5rem", marginTop: "1rem" }}>
      {faqs.map((faq, i) => (
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
);

const ShippingTab = () => (
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
    <p style={{ color: "var(--color-text-muted)" }}>
      We ship globally with tracked services to ensure your gear arrives safely.
    </p>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "2rem",
        marginTop: "1.5rem",
      }}
    >
      {[
        {
          title: "Domestic (US)",
          items: [
            "Standard: 3-5 business days",
            "Express: 1-2 business days",
            "Free shipping on orders over $99",
          ],
        },
        {
          title: "International",
          items: [
            "Economy: 10-15 business days",
            "Priority: 5-7 business days",
            "Customs duties may apply based on your region",
          ],
        },
      ].map((region) => (
        <div
          key={region.title}
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
            {region.title}
          </h3>
          <ul
            style={{
              color: "var(--color-text-muted)",
              display: "grid",
              gap: "0.5rem",
              paddingLeft: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            {region.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const ReturnsTab = () => (
  <div className="animate-fade-in stack-md">
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "2rem",
        color: "#fff",
      }}
    >
      Returns &amp; Exchanges
    </h2>
    <div
      style={{
        padding: "2rem",
        background: "rgba(13,13,40,0.5)",
        borderRadius: "12px",
        borderLeft: "4px solid #bf00ff",
        marginTop: "1rem",
      }}
    >
      <h3 style={{ color: "#fff", marginBottom: "1rem", fontSize: "1.2rem" }}>
        30-Day Money-Back Guarantee
      </h3>
      <p
        style={{
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
          marginBottom: "1rem",
        }}
      >
        If you are not entirely satisfied with your purchase, simply return the
        item within 30 days with your receipt. Returned items must be in the
        original packaging, untouched, and in the same condition that you
        received them.
      </p>
      <h4 style={{ color: "var(--color-neon-cyan)", marginBottom: "0.5rem" }}>
        Exceptions:
      </h4>
      <ul
        style={{
          color: "var(--color-text-dim)",
          paddingLeft: "1.5rem",
          listStyleType: "circle",
          gap: "0.5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <li>Lubed switches cannot be returned.</li>
        <li>Group Buy items are final sale unless damaged upon arrival.</li>
        <li>Shipping costs are non-refundable.</li>
      </ul>
    </div>
  </div>
);

const CommunityTab = () => (
  <div className="animate-fade-in stack-md" style={{ textAlign: "center" }}>
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
          margin: "1rem auto 0",
          lineHeight: 1.6,
        }}
      >
        Connect with over 50,000 keyboard enthusiasts. Share your builds, find
        inspiration for keycap combinations, and participate in exclusive
        giveaways.
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
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        Reddit r/KeyCrafter
      </a>
    </div>
  </div>
);

const ContactTab = () => (
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
        Need further assistance? Leave a message and our support team will get
        back to you within 24 hours.
      </p>
      <div style={{ marginTop: "2rem", display: "grid", gap: "1.5rem" }}>
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
            {contactInfo.email}
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
            {contactInfo.hours}
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
      {[
        { label: "Name", type: "text", placeholder: "John Doe" },
        { label: "Email", type: "email", placeholder: "john@example.com" },
      ].map(({ label, type, placeholder }) => (
        <div key={label}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "var(--color-text-dim)",
              fontSize: "0.85rem",
            }}
          >
            {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            required
            style={{ width: "100%" }}
          />
        </div>
      ))}
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
);

const tabContentMap = {
  faq: <FaqTab />,
  shipping: <ShippingTab />,
  returns: <ReturnsTab />,
  community: <CommunityTab />,
  contact: <ContactTab />,
};

/* ─── Main SupportTabs component ─── */
const SupportTabs = () => {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <section style={{ padding: "2rem 0 5rem" }}>
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
      >
        {/* Tab navigation */}
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
          {supportTabs.map((tab) => (
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
                  activeTab === tab.id ? "rgba(0,245,255,0.1)" : "transparent",
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
                    activeTab === tab.id ? "var(--color-neon-cyan)" : "inherit",
                }}
              >
                {iconMap[tab.iconName]}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="glass-card"
          style={{ padding: "3rem", minHeight: "400px" }}
        >
          {tabContentMap[activeTab]}
        </div>
      </div>
    </section>
  );
};

export default SupportTabs;
