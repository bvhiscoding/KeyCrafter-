/** Static data for the Home page */

export const games = [
  { name: 'VALORANT',      genre: 'TACTICAL SHOOTER', color: '#ff4655', img: 'VAL' },
  { name: 'CS2',           genre: 'FPS',               color: '#ff8c00', img: 'CS2' },
  { name: 'APEX LEGENDS',  genre: 'BATTLE ROYALE',     color: '#cd3333', img: 'APX' },
  { name: 'STARCRAFT II',  genre: 'STRATEGY',          color: '#0080ff', img: 'STC' },
  { name: 'DOTA 2',        genre: 'MOBA',              color: '#c23b22', img: 'DOT' },
  { name: 'CYBERPUNK 2077',genre: 'RPG',               color: '#fcee09', img: 'CP7' },
];

export const testimonials = [
  { name: 'NebulaStrike',  role: 'Pro Gamer',           rating: 5, text: 'The linear switches are incredibly smooth. My APM went up 15% after switching to KeyCrafter.', tag: 'CS2 Player' },
  { name: 'V0idCrafter',  role: 'Keyboard Enthusiast', rating: 5, text: 'Finally a store that understands what builders need. The hot-swap boards are insane quality.', tag: 'Builder' },
  { name: 'CyberHex',     role: 'Content Creator',     rating: 5, text: 'My desk setup looks like a spaceship now. The RGB customization is on another level.', tag: 'Streamer' },
  { name: 'QuantumFps',   role: 'Speedrunner',         rating: 5, text: 'Sub-1ms response time is real. No more missed inputs in the heat of the moment.', tag: 'Speedrunner' },
  { name: 'AstralKeys',   role: 'Typist',              rating: 5, text: 'The tactile feedback is perfect. I love the thocking sound when I game at 3am.', tag: 'Typing Enthusiast' },
  { name: 'NightCodex',   role: 'Developer',           rating: 5, text: 'Coding sessions have never felt this good. The keycaps are crisp and the sound is perfect.', tag: 'Dev' },
];

export const heroStats = [
  { n: '200+', l: 'Products' },
  { n: '50K+', l: 'Builders' },
  { n: '4.9★', l: 'Rating' },
];

export const communityStats = [
  { value: '50K+', label: 'Members',   color: 'var(--color-neon-cyan)' },
  { value: '4.9★', label: 'Avg Rating',color: 'var(--color-neon-yellow)' },
  { value: '200+', label: 'Products',  color: '#bf00ff' },
  { value: '99%',  label: 'Satisfied', color: 'var(--color-neon-green)' },
];

export const faqs = [
  { q: 'Are the keyboards fully hot-swappable?', a: 'Yes. All our premium boards support 3-pin and 5-pin MX style mechanical switches. You can swap them easily without any soldering required.' },
  { q: 'Do you offer warranty?', a: 'We offer a 2-year warranty on all keyboards and barebones kits covering manufacturing defects. Keycaps and switches are covered for 6 months.' },
  { q: 'Can I cancel my pre-order?', a: 'Pre-orders can be cancelled for a full refund up to 48 hours before the estimated shipping date. Once processing begins, standard return policies apply.' },
  { q: 'How do I configure the RGB and Macros?', a: 'You can download the KeyCrafter Companion App from our Home page. It supports per-key RGB layering and advanced macro assignments.' },
];

export const downloadFeatures = ['RGB Control', 'Macro Config', 'Firmware OTA', 'Layout Sharing', 'Cloud Sync'];
