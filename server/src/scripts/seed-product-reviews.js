const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');
const Product = require('../models/product.model');
const Review = require('../models/review.model');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Category = require('../models/category.model');

const REVIEW_PASSWORD = 'Reviewer@123';
const BASE_REVIEWER_COUNT = 20;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sample = (items) => items[Math.floor(Math.random() * items.length)];

const categoryTemplates = {
  'keyboard kits': [
    'Build quality chac chan, lap rap rat de va khong gap loi fit linh kien. Sau mot tuan su dung lien tuc, cam giac go van on dinh va khong co hien tuong rung kho chiu.',
    'Layout thuc dung cho ca game va cong viec. PCB hot-swap hoat dong tot, thay switch nhanh, phu hop nguoi moi bat dau choi custom keyboard.',
    'Am thanh tong the de nghe sau khi tune co ban. Khung case ben, khong bi flex qua muc, trai nghiem su dung hang ngay rat dang tien.',
  ],
  keycaps: [
    'Be mat keycap cam tay, legend ro va de doc khi dung ban dem. Chat lieu cho cam giac chac, go dai gio khong bi met ngon tay.',
    'Mau sac thuc te dep va dong deu, profile quen tay nen lam quen nhanh. Sau thoi gian su dung van giu duoc do on dinh rat tot.',
    'Do hoan thien keycap tot trong tam gia, gan vao layout chuan rat vua. Tong am thanh tro nen day hon va de chiu hon truoc.',
  ],
  switches: [
    'Do muot hanh trinh tot, bam lien tuc khong bi khung. Dung cho game phan xa nhanh rat on, dong thoi typing cung de chiu.',
    'Luc nhan vua phai, khong qua nang nen dung lau khong met. Sau khi giong va tune nhe, am thanh gon va it tap am hon han.',
    'Switch cho cam giac dong deu giua cac phim, khong gap loi lech chat luong. Day la lua chon de khuyen nghi trong tam gia nay.',
  ],
  cases: [
    'Case lap rap de, ket cau chac va trong luong vua du de giu ban phim on dinh tren ban. Khi ket hop build hop ly cho am thanh rat tot.',
    'Do hoan thien ben ngoai dep va dong deu, cac chi tiet cat CNC gon gang. Sau khi thay case, tong cam giac su dung cai thien rat ro.',
    'Case giup giam rung va tang do chac cho toan bo build. Rat hop voi nguoi muon nang cap tu prebuilt len custom o muc gia hop ly.',
  ],
  default: [
    'San pham dung on dinh, chat luong hoan thien tot va phu hop voi nhu cau su dung hang ngay. Trong tam gia nay, day la lua chon dang can nhac.',
  ],
};

const buildComment = (productName, categoryName, rating) => {
  const key = String(categoryName || '').toLowerCase();
  const templates = categoryTemplates[key] || categoryTemplates.default;
  const opener = sample([
    `Minh da dung ${productName} duoc hon 1 tuan va co vai nhan xet thuc te.`,
    `Sau khi test ${productName} cho ca game lan typing, day la danh gia cua minh.`,
    `${productName} cho trai nghiem vuot ky vong trong phan khuc gia hien tai.`,
  ]);
  const body = sample(templates);
  const closerByRating = rating >= 5
    ? 'Tong ket: rat dang tien, se tiep tuc dung lau dai va co the mua them cho build khac.'
    : rating >= 4
      ? 'Tong ket: san pham tot, co the can tune nhe de dat trang thai toi uu theo gu ca nhan.'
      : 'Tong ket: van dung duoc, nhung can toi uu them de phu hop hon voi nhu cau cua minh.';

  return `${opener} ${body} ${closerByRating}`;
};

const ensureReviewUsers = async (minimumCount) => {
  const users = [];

  for (let index = 1; index <= minimumCount; index += 1) {
    const padded = String(index).padStart(2, '0');
    const email = `reviewer${padded}@keycrafter.dev`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: `Reviewer ${padded}`,
        email,
        password: REVIEW_PASSWORD,
        role: 'user',
        isActive: true,
      });
    } else if (!user.isActive) {
      user.isActive = true;
      await user.save();
    }

    users.push(user);
  }

  return users;
};

const createDeliveredOrder = async (userId, product) => {
  const subtotal = Number(product.price || 0);
  const shippingFee = 30000;

  const order = await Order.create({
    user: userId,
    items: [
      {
        product: product._id,
        name: product.name,
        image: product.thumbnail || product.images?.[0] || 'https://example.com/image.jpg',
        price: subtotal,
        quantity: 1,
      },
    ],
    subtotal,
    shippingFee,
    discount: 0,
    total: subtotal + shippingFee,
    status: 'delivered',
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'Nguyen Van A',
      phone: '0901234567',
      address: '123 Nguyen Trai',
      ward: 'Ward 1',
      district: 'District 1',
      city: 'Ho Chi Minh City',
    },
  });

  return order;
};

const main = async () => {
  await connectDB();

  const products = await Product.find({ isDeleted: false, isActive: true }).sort({ createdAt: 1 });
  const categories = await Category.find({ isDeleted: false }).select('_id name');
  const categoryMap = new Map(categories.map((item) => [String(item._id), item.name]));

  if (!products.length) {
    throw new Error('No active products found to seed reviews');
  }

  const reviewUsers = await ensureReviewUsers(BASE_REVIEWER_COUNT);

  let createdReviews = 0;

  for (const product of products) {
    const productId = String(product._id);
    const categoryName = categoryMap.get(String(product.category)) || 'Products';

    const existingReviews = await Review.find({ product: product._id }).select('user');
    const existingUserSet = new Set(existingReviews.map((item) => String(item.user)));

    const targetCount = randomInt(2, 10);
    const needed = Math.max(0, targetCount - existingReviews.length);

    if (needed === 0) {
      continue;
    }

    const availableUsers = reviewUsers.filter((user) => !existingUserSet.has(String(user._id)));

    if (availableUsers.length < needed) {
      throw new Error(`Not enough reviewer users for product ${productId}`);
    }

    for (let index = 0; index < needed; index += 1) {
      const user = availableUsers[index];
      const rating = sample([5, 5, 5, 4, 4, 4, 3]);
      const comment = buildComment(product.name, categoryName, rating);
      const order = await createDeliveredOrder(user._id, product);

      await Review.create({
        product: product._id,
        user: user._id,
        order: order._id,
        rating,
        comment,
        images: Math.random() > 0.75 && product.thumbnail ? [product.thumbnail] : [],
        isApproved: true,
        helpfulCount: randomInt(0, 18),
      });

      createdReviews += 1;
    }
  }

  const reviewStats = await Review.aggregate([
    { $group: { _id: '$product', count: { $sum: 1 } } },
    {
      $group: {
        _id: null,
        minCount: { $min: '$count' },
        maxCount: { $max: '$count' },
        avgCount: { $avg: '$count' },
      },
    },
  ]);

  const summary = reviewStats[0] || { minCount: 0, maxCount: 0, avgCount: 0 };

  console.log('Review seeding completed');
  console.log(`Products processed: ${products.length}`);
  console.log(`Reviews created: ${createdReviews}`);
  console.log(`Review count per product -> min: ${summary.minCount}, max: ${summary.maxCount}, avg: ${summary.avgCount.toFixed(2)}`);
};

main()
  .catch((error) => {
    console.error('Script failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
