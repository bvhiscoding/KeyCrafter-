const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand column */}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-neon-cyan)', textShadow: '0 0 12px rgba(0,245,255,0.6)' }}>
              KEY<span style={{ color: '#bf00ff', textShadow: '0 0 12px rgba(191,0,255,0.6)' }}>CRAFTER</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              The next-gen mechanical keyboard platform for builders, gamers, and enthusiasts.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <span className="badge badge-cyan">Est. 2024</span>
              <span className="badge badge-purple">Gaming</span>
            </div>
          </div>

          {/* Shop column */}
          <div style={{ display: 'grid', gap: '0.6rem', alignContent: 'start' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-neon-cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Shop
            </div>
            {['Keyboards', 'Switches', 'Keycaps', 'Accessories', 'New Arrivals'].map(item => (
              <a key={item} href="/products" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-neon-cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Support column */}
          <div style={{ display: 'grid', gap: '0.6rem', alignContent: 'start' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-neon-cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Support
            </div>
            {['FAQ', 'Shipping Info', 'Returns', 'Community', 'Contact Us'].map(item => (
              <a key={item} href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-neon-cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-neon-cyan)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Join The Grid
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Get exclusive drops & community updates.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Newsletter email"
                style={{ borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              />
              <button
                className="button button-primary"
                style={{ padding: '0.5rem 0.85rem', whiteSpace: 'nowrap' }}
                aria-label="Subscribe to newsletter"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Neon divider */}
        <div className="neon-divider" role="separator" />

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem', fontFamily: 'var(--font-display)' }}>
            © 2024 KeyCrafter. All systems nominal.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem', fontFamily: 'var(--font-display)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-neon-cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-text-dim)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
