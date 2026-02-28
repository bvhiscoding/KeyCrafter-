const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/blog.model');

// Load env vars
dotenv.config();

// Sample English Blog Data
const blogs = [
  {
    title: 'Gateron Milky Yellow Pro Review: The Best Budget Linear?',
    excerpt:
      'Exploring the legendary Gateron Milky Yellow Pro switches. Are they still the king of budget linear switches in 2026? We test sound, feel, and factory lube.',
    content:
      '<h2>Introduction</h2><p>The Gateron Milky Yellow has been a staple in the mechanical keyboard community for years. With the release of the Pro version, Gateron aims to solidify its position as the go-to budget linear switch.</p><h2>Sound & Feel</h2><p>Out of the box, the factory lube on the Pro version is surprisingly consistent. There is minimal spring ping, and the bottom out is a solid, muted thock thanks to the milky housing.</p><ul><li>Actuation force: 50g</li><li>Bottom out: 60g</li><li>Travel distance: 4.0mm</li></ul><h2>Conclusion</h2><p>If you have less than $0.30 per switch to spend, you cannot go wrong with the Milky Yellow Pro. Highly recommended.</p>',
    coverImage:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
    author: null, // Will be set dynamically
    category: 'review',
    tags: ['gateron', 'linear', 'budget', 'switches'],
    rating: 8.5,
    status: 'published',
    isFeatured: true,
    seo: {
      metaTitle: 'Gateron Milky Yellow Pro Review',
      metaDescription: 'An in-depth review of the Gateron Milky Yellow Pro linear switches.',
    },
    viewCount: 1250,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'GMK vs. ePBT: Which ABS Keycaps Should You Buy?',
    excerpt:
      'A direct comparison between the two giants of Cherry profile ABS keycaps. We analyze legends, warping, textures, and value for money.',
    content:
      "<h2>The Battle of ABS</h2><p>When it comes to premium Cherry profile keycaps, GMK has been the undisputed king. However, ePBT (EnjoyPBT) has massively improved their ABS double-shot manufacturing.</p><h2>Legend Sharpness</h2><p>GMK still holds a slight edge in legend consistency, especially on modifiers. ePBT is very close, but occasionally exhibits minor blurring on complex icons.</p><h2>Texture & Shine</h2><p>Both will eventually shine (it's ABS after all), but GMK's initial texture is slightly chalkier, which many enthusiasts prefer over ePBT's smoother finish.</p>",
    coverImage:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
    author: null,
    category: 'comparison',
    tags: ['gmk', 'epbt', 'keycaps', 'abs', 'cherry profile'],
    rating: 9.0,
    status: 'published',
    isFeatured: false,
    viewCount: 843,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: "A Beginner's Guide to Lubing Switches",
    excerpt:
      'Everything you need to know about lubing mechanical keyboard switches. From Krytox 205g0 to TriboSys 3203, we explain methods and techniques.',
    content:
      "<h2>Why Lube?</h2><p>Lubricating your switches is the single most impactful modification you can do to a mechanical keyboard. It reduces scratchiness, enhances the sound profile (making it deeper or 'thockier'), and eliminates spring ping.</p><h2>Tools Needed</h2><ul><li>Switch opener</li><li>Lube station</li><li>Brush (Size 0 or 00)</li><li>Lubricant (Krytox 205g0 for linears, TriboSys 3203 for tactiles)</li></ul><h2>Step by Step Process</h2><p>We recommend starting with the stem. Apply a very thin, consistent layer to the rails... (Content truncated for demo).</p>",
    coverImage:
      'https://images.unsplash.com/photo-1610465299993-e6675c9f9fac?q=80&w=1000&auto=format&fit=crop',
    author: null,
    category: 'guide',
    tags: ['lubing', 'guide', 'krytox', 'beginner'],
    status: 'published',
    isFeatured: true,
    viewCount: 3200,
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'The Ultimate Custom Build: 65% Aluminum Case',
    excerpt:
      'Walking through a premium 65% keyboard build featuring a gasket-mounted aluminum case, Boba U4T switches, and GMK keycaps.',
    content:
      '<h2>The Kit</h2><p>Today we look at building a premium 65% gasket-mount board. The aluminum case offers a hefty, premium feel.</p><p>We chose the Boba U4T for a pronounced, deep tactile bump, paired with sound-dampening foam to eliminate hollowness.</p>',
    coverImage:
      'https://images.unsplash.com/photo-1627389955805-3e284a1e9487?q=80&w=1000&auto=format&fit=crop',
    author: null,
    category: 'custom',
    tags: ['build', '65percent', 'aluminum', 'tactile'],
    status: 'published',
    isFeatured: false,
    viewCount: 450,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Upcoming Switch Releases in Q3 2026',
    excerpt:
      'A roundup of the most anticipated mechanical keyboard switch releases coming in the next quarter.',
    content:
      "<h2>What's Next?</h2><p>Manufacturers are pushing the boundaries of factory lubing and new plastic blends (like POK and LY). Let's look at what Outemu, KTT, and JWK have planned for the coming months.</p>",
    coverImage:
      'https://images.unsplash.com/photo-1511467687858-23d9fc217d84?q=80&w=1000&auto=format&fit=crop',
    author: null,
    category: 'news',
    tags: ['news', 'switches', 'upcoming'],
    status: 'draft',
    isFeatured: false,
    viewCount: 0,
  },
];

const seedBlogs = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/keycrafter';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');

    // Find a valid user to assign as author (using an admin user if possible)
    const User = require('./models/user.model');
    const admin = await User.findOne({ role: 'admin' });

    // If no admin, fallback to just the first user
    const authorId = admin ? admin._id : (await User.findOne())?._id;

    if (!authorId) {
      console.log('No users found in database to assign as author. Aborting.');
      process.exit(1);
    }

    // Assign author ID to blogs
    const blogsWithAuthor = blogs.map((b) => ({ ...b, author: authorId }));

    await Blog.deleteMany(); // clear existing blogs
    console.log('Cleared existing blogs');

    const createdBlogs = [];
    for (const data of blogsWithAuthor) {
      const newBlog = new Blog(data);
      await newBlog.save();
      createdBlogs.push(newBlog);
    }
    
    console.log(`Successfully seeded ${createdBlogs.length} blogs!`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedBlogs();
