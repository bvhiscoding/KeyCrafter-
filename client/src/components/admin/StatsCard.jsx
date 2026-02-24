const StatsCard = ({
  title,
  value,
  note,
  color = "var(--color-neon-cyan)",
}) => {
  return (
    <article
      className="glass-card"
      style={{ padding: "1.5rem" }}
      aria-label={`${title}: ${value}`}
    >
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "0.78rem",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.6rem",
        }}
      >
        {title}
      </p>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          fontWeight: 900,
          color,
          textShadow: `0 0 15px ${color}88`,
          lineHeight: 1,
          marginBottom: note ? "0.5rem" : 0,
        }}
      >
        {value}
      </h3>
      {note && (
        <p style={{ color: "var(--color-text-dim)", fontSize: "0.78rem" }}>
          {note}
        </p>
      )}
    </article>
  );
};

export default StatsCard;
