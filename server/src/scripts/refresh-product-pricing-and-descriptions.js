const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

const clampText = (value, maxLength) => {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3).trim()}...`;
};

const inferLayout = (name) => {
  const normalized = String(name || '').toLowerCase();
  const patterns = [
    ['104', 'Full-size 104 keys'],
    ['100', 'Compact full-size'],
    ['96', '96% layout'],
    ['80', 'TKL 80% layout'],
    ['75', '75% layout'],
    ['68', '68-key layout'],
    ['65', '65% layout'],
    ['60', '60% layout'],
  ];

  for (const [keyword, label] of patterns) {
    if (normalized.includes(keyword)) {
      return label;
    }
  }

  return 'Custom layout';
};

const inferSwitchType = (name) => {
  const normalized = String(name || '').toLowerCase();
  if (normalized.includes('tactile')) {
    return 'tactile';
  }
  if (normalized.includes('linear')) {
    return 'linear';
  }
  if (normalized.includes('clicky')) {
    return 'clicky';
  }
  return 'custom-feel';
};

const priceByCategory = (categoryName, index, productName) => {
  const category = String(categoryName || '').toLowerCase();
  const name = String(productName || '').toLowerCase();

  if (category === 'keyboard kits') {
    let base = 2_690_000 + (index % 9) * 220_000;
    if (name.includes('he') || name.includes('magnetic')) {
      base += 550_000;
    }
    if (name.includes('full') || name.includes('104')) {
      base += 300_000;
    }
    return base;
  }

  if (category === 'keycaps') {
    let base = 650_000 + (index % 8) * 120_000;
    if (name.includes('special') || name.includes('limited')) {
      base += 200_000;
    }
    return base;
  }

  if (category === 'switches') {
    let base = 95_000 + (index % 7) * 25_000;
    if (name.includes('pack') || name.includes('18')) {
      base += 15_000;
    }
    return base;
  }

  if (category === 'cases') {
    let base = 1_290_000 + (index % 7) * 210_000;
    if (name.includes('special')) {
      base += 350_000;
    }
    return base;
  }

  return 990_000 + (index % 6) * 100_000;
};

const buildDescription = ({ productName, categoryName, sourceUrl, index }) => {
  const category = String(categoryName || '').toLowerCase();
  const baseIntro = `${productName} la san pham custom keyboard duoc chon loc cho thi truong Viet Nam, huong den nguoi dung can su on dinh, de nang cap va dung tot cho ca game lan cong viec.`;

  if (category === 'keyboard kits') {
    const layout = inferLayout(productName);
    const text = `${baseIntro} Mau nay thuoc nhom keyboard kit ${layout}, phu hop cho nguoi dung muon build ban phim theo gu rieng nhung van can toc do lap rap nhanh va de bao tri. Khung san pham duoc huong den do cung cap on dinh, han che flex qua muc khi go nhanh, dong thoi giu duoc am thanh can bang de su dung dai gio. Neu ban uu tien kha nang thay switch linh hoat, toi uu layout gon cho ban lam viec va gaming, day la lua chon rat thuc dung trong tam gia. Goi y ket hop voi switch linear nhe hoac tactile vua de co trai nghiem de lam quen, sau do nang cap keycap va tuning de dat am thanh theo y muon. Nguon tham khao: ${sourceUrl}.`;
    return clampText(text, 1000);
  }

  if (category === 'keycaps') {
    const text = `${baseIntro} Bo keycap nay tap trung vao do hoan thien be mat, legend ro net va do ben mau de su dung lau dai trong dieu kien khi hau nong am. Cam giac bam huong den su chac tay, giam truot khi danh may nhanh, dong thoi giu tong am thanh day va gon hon khi ket hop cung build da tuning co ban. San pham phu hop voi nguoi dung muon nang cap giao dien ban phim ngay lap tuc ma khong can can thiep ky thuat qua sau. De dat hieu qua cao, nen kiem tra profile keycap va do tuong thich layout truoc khi dat mua, dac biet voi cac phim shift, enter va bottom row. Nguon tham khao: ${sourceUrl}.`;
    return clampText(text, 1000);
  }

  if (category === 'switches') {
    const switchType = inferSwitchType(productName);
    const text = `${baseIntro} Dong switch nay thuoc nhom ${switchType}, duoc huong den muc tieu can bang giua do nhay phim, do muot hanh trinh va kha nang kiem soat khi bam lien tuc. O bo pack co san, san pham phu hop cho nguoi dung muon test truoc khi build full keyboard, hoac thay tung cum phim quan trong de toi uu trai nghiem. Neu ban uu tien game can toc do cao, nen ket hop voi spring luc vua va keycap profile quen tay de giam sai so input. Neu ban uu tien typing dai gio, hay can nhac tuning co ban de giam tieng rung va giu cam giac on dinh. Nguon tham khao: ${sourceUrl}.`;
    return clampText(text, 1000);
  }

  const text = `${baseIntro} San pham nhom case huong den nguoi dung muon cai thien nen tang co khi cho bo build, giup ket cau chac chan hon va de dieu chinh huong am thanh theo tung buoc mod. Voi moi truong su dung thuc te tai Viet Nam, yeu to ben, de bao tri va de thay linh kien duoc uu tien cao, vi vay day la lua chon phu hop cho ca nguoi moi lan nguoi choi lau nam. Khi lap rap, nen kiem tra do khop plate, PCB va foam de tranh phat sinh rung khong mong muon. Nguon tham khao: ${sourceUrl}.`;
  return clampText(text, 1000);
};

const buildShortDescription = ({ productName, categoryName, priceVnd }) => {
  const base = `${productName} - ${categoryName}, gia tham khao ${priceVnd.toLocaleString('vi-VN')} VND.`;
  return clampText(
    `${base} Toi uu cho nhu cau game, typing va nang cap custom keyboard theo tung giai doan.`,
    300,
  );
};

const main = async () => {
  await connectDB();

  const categories = await Category.find({ isDeleted: false }).select('_id name');
  const categoryMap = new Map(categories.map((item) => [String(item._id), item.name]));

  const products = await Product.find({ isDeleted: false, isActive: true }).sort({ createdAt: 1 });
  let updated = 0;

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const categoryName = categoryMap.get(String(product.category)) || 'Products';
    const sourceUrl = product?.specs?.sourceUrl || 'N/A';
    const nextPrice = priceByCategory(categoryName, index, product.name);

    product.price = nextPrice;
    product.salePrice = null;
    product.description = buildDescription({
      productName: product.name,
      categoryName,
      sourceUrl,
      index,
    });
    product.shortDescription = buildShortDescription({
      productName: product.name,
      categoryName,
      priceVnd: nextPrice,
    });

    await product.save();
    updated += 1;
  }

  console.log('Product pricing/description refresh completed');
  console.log(`Products updated: ${updated}`);
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
