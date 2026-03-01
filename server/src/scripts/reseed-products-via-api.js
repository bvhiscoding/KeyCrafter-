const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const app = require('../app');
const connectDB = require('../config/database');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const Product = require('../models/product.model');

const XLSX_PATH = 'C:\\Users\\NCPC\\Downloads\\keyboard_shop_product_list.xlsx';
const ADMIN_EMAIL = 'admin@keycrafter.dev';
const ADMIN_PASSWORD = 'Admin@12345';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const mimeByExt = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const extByMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const toSlugTag = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const titleCase = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const parseWorkbookRows = (xlsxPath) => {
  const pythonScript = `
import json
import openpyxl

wb = openpyxl.load_workbook(r'''${xlsxPath}''')
items = []

for ws in wb.worksheets:
    if ws.title == 'README':
        continue

    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        continue

    for row in rows[1:]:
        if not row or not row[2]:
            continue

        if not isinstance(row[0], (int, float)):
            continue

        if not row[1] or not row[3]:
            continue

        items.append({
            'category': row[1],
            'name': row[2],
            'shop': row[3],
            'sourceUrl': row[4],
            'source': row[5],
        })

print(json.dumps(items, ensure_ascii=False))
`;

  const result = spawnSync('python', ['-c', pythonScript], {
    encoding: 'utf-8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || 'Failed to parse product workbook');
  }

  return JSON.parse(result.stdout || '[]');
};

const ensureAdminUser = async () => {
  let adminUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

  if (!adminUser) {
    adminUser = await User.create({
      name: 'KeyCrafter Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
    });

    return;
  }

  adminUser.name = adminUser.name || 'KeyCrafter Admin';
  adminUser.password = ADMIN_PASSWORD;
  adminUser.role = 'admin';
  adminUser.isActive = true;
  await adminUser.save();
};

const ensureCategoryDoc = async (categoryName) => {
  let category = await Category.findOne({ name: categoryName });

  if (!category) {
    category = await Category.create({
      name: categoryName,
      description: `${titleCase(categoryName)} collection for custom keyboard enthusiasts.`,
      isActive: true,
      isDeleted: false,
    });

    return category;
  }

  category.description = category.description
    || `${titleCase(categoryName)} collection for custom keyboard enthusiasts.`;
  category.isActive = true;
  category.isDeleted = false;
  await category.save();

  return category;
};

const ensureBrandDoc = async (brandName) => {
  let brand = await Brand.findOne({ name: brandName });

  if (!brand) {
    brand = await Brand.create({
      name: brandName,
      description: `${brandName} product catalog imported for the latest keyboard ecosystem.`,
      isActive: true,
      isDeleted: false,
    });

    return brand;
  }

  brand.description = brand.description
    || `${brandName} product catalog imported for the latest keyboard ecosystem.`;
  brand.isActive = true;
  brand.isDeleted = false;
  await brand.save();

  return brand;
};

const buildDescription = ({ name, category, shop, sourceUrl }) => {
  const normalizedCategory = titleCase(category);

  return `${name} is a curated ${normalizedCategory} item from ${shop} for custom keyboard builders. `
    + `This listing is based on verified catalog data and tuned for everyday typing, gaming, and long-session comfort. `
    + `Reference source: ${sourceUrl}`;
};

const buildShortDescription = ({ name, category, shop }) =>
  `${name} by ${shop} - premium ${titleCase(category)} for custom keyboard builds.`;

const pickPrice = (category, index) => {
  const normalized = String(category || '').toLowerCase();
  const bases = {
    'keyboard kits': 159,
    keycaps: 59,
    switches: 18,
    cases: 69,
  };
  const base = bases[normalized] || 49;

  return base + ((index % 7) * 6);
};

const pickStock = (index) => 20 + ((index * 13) % 81);

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KeyCrafterBot/1.0',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${url}: HTTP ${response.status}`);
  }

  return response.text();
};

const extractMetaImageCandidates = (html, pageUrl) => {
  const candidates = [];
  const metaRegex = /<meta\b[^>]*>/gi;
  const attrsRegex = /(\w[\w:-]*)\s*=\s*(["'])(.*?)\2/g;

  for (const tag of html.match(metaRegex) || []) {
    const attrs = {};
    let match;

    while ((match = attrsRegex.exec(tag)) !== null) {
      attrs[match[1].toLowerCase()] = match[3];
    }

    const key = (attrs.property || attrs.name || '').toLowerCase();
    const content = attrs.content;

    if (!content) {
      continue;
    }

    if (!['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'].includes(key)) {
      continue;
    }

    try {
      candidates.push(new URL(content, pageUrl).href);
    } catch (error) {
      // Ignore invalid URL in HTML meta tags
    }
  }

  return candidates;
};

const collectImagesFromJsonLdValue = (value, pageUrl, output) => {
  if (!value) {
    return;
  }

  if (typeof value === 'string') {
    try {
      output.push(new URL(value, pageUrl).href);
    } catch (error) {
      // Ignore malformed URLs in JSON-LD
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectImagesFromJsonLdValue(item, pageUrl, output);
    }
    return;
  }

  if (typeof value === 'object') {
    if (value.image) {
      collectImagesFromJsonLdValue(value.image, pageUrl, output);
    }
  }
};

const extractJsonLdImageCandidates = (html, pageUrl) => {
  const candidates = [];
  const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const raw = (match[1] || '').trim();
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw);
      collectImagesFromJsonLdValue(parsed, pageUrl, candidates);
    } catch (error) {
      // Ignore malformed JSON-LD blocks
    }
  }

  return candidates;
};

const looksLikeImageUrl = (value) => {
  const lower = String(value || '').toLowerCase();

  if ([...IMAGE_EXTENSIONS].some((ext) => lower.includes(ext))) {
    return true;
  }

  return lower.includes('/products/') || lower.includes('/files/');
};

const chooseProductImageUrl = (candidates) => {
  const unique = [...new Set(candidates.filter(Boolean))];

  const filtered = unique.filter((item) => {
    const lower = item.toLowerCase();
    if (!looksLikeImageUrl(lower)) {
      return false;
    }
    if (lower.includes('logo')) {
      return false;
    }
    return true;
  });

  return filtered[0] || unique[0] || null;
};

const getImageUrlFromProductPage = async (pageUrl) => {
  const html = await fetchText(pageUrl);
  const candidates = [
    ...extractMetaImageCandidates(html, pageUrl),
    ...extractJsonLdImageCandidates(html, pageUrl),
  ];

  const chosen = chooseProductImageUrl(candidates);
  if (!chosen) {
    throw new Error(`No image URL found on product page: ${pageUrl}`);
  }

  return chosen;
};

const downloadImageToTemp = async (imageUrl, targetDir, index) => {
  const response = await fetch(imageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KeyCrafterBot/1.0',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      Referer: imageUrl,
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to download image ${imageUrl}: HTTP ${response.status}`);
  }

  const contentType = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  const urlPathname = new URL(response.url || imageUrl).pathname;
  const extFromUrl = path.extname(urlPathname).toLowerCase();
  const ext = extByMime[contentType] || (IMAGE_EXTENSIONS.has(extFromUrl) ? extFromUrl : '.jpg');

  const filePath = path.join(targetDir, `product-${index}${ext}`);
  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return filePath;
};

const getJson = async (response) => {
  const body = await response.json();

  if (!response.ok || !body.success) {
    const message = body?.message || body?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body.data;
};

const apiFactory = (baseUrl, token) => async (method, endpoint, payload) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  return getJson(response);
};

const listAllItems = async (requestFn, endpoint) => {
  const allItems = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await requestFn('GET', `${endpoint}?page=${page}&limit=50&isDeleted=false`);
    const items = data?.items || [];
    const pagination = data?.pagination || {};

    allItems.push(...items);
    totalPages = Number(pagination.totalPages || 1);
    page += 1;
  } while (page <= totalPages);

  return allItems;
};

const uploadProductImage = async (baseUrl, token, productId, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeByExt[ext] || 'application/octet-stream';
  const fileBuffer = await fs.readFile(filePath);

  const form = new FormData();
  form.append(
    'image',
    new Blob([fileBuffer], { type: mimeType }),
    path.basename(filePath),
  );

  const response = await fetch(`${baseUrl}/api/admin/products/${productId}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  return getJson(response);
};

const main = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment');
  }

  await connectDB();
  await ensureAdminUser();

  const rows = parseWorkbookRows(XLSX_PATH);
  if (!rows.length) {
    throw new Error('No product rows found in workbook');
  }
  const tempImageDir = await fs.mkdtemp(path.join(os.tmpdir(), 'keycrafter-images-'));

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    const publicApi = apiFactory(baseUrl);
    const loginData = await publicApi('POST', '/api/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const accessToken = loginData?.accessToken;
    if (!accessToken) {
      throw new Error('Could not get access token from login response');
    }

    const adminApi = apiFactory(baseUrl, accessToken);

    const categoryByName = new Map();
    const brandByName = new Map();

    for (const categoryName of new Set(rows.map((row) => row.category))) {
      const ensured = await ensureCategoryDoc(categoryName);
      categoryByName.set(String(categoryName).toLowerCase(), ensured);
    }

    for (const brandName of new Set(rows.map((row) => row.shop))) {
      const ensured = await ensureBrandDoc(brandName);
      brandByName.set(String(brandName).toLowerCase(), ensured);
    }

    const currentProducts = await listAllItems(adminApi, '/api/admin/products');
    for (const product of currentProducts) {
      await adminApi('DELETE', `/api/admin/products/${product._id}`);
    }

    await Product.deleteMany({ isDeleted: true });

    const createdProducts = [];

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const category = categoryByName.get(String(row.category).toLowerCase());
      const brand = brandByName.get(String(row.shop).toLowerCase());

      if (!category || !brand) {
        throw new Error(`Missing category or brand mapping for row: ${row.name}`);
      }

      const payload = {
        name: row.name,
        description: buildDescription(row),
        shortDescription: buildShortDescription(row),
        price: pickPrice(row.category, index),
        salePrice: null,
        stock: pickStock(index),
        category: String(category._id),
        brand: String(brand._id),
        tags: [
          toSlugTag(row.category),
          toSlugTag(row.shop),
          'imported',
          'cloudinary',
        ].filter(Boolean),
        isFeatured: index % 6 === 0,
        isNew: true,
        isActive: true,
        specs: {
          source: row.source,
          sourceUrl: row.sourceUrl,
          importedAt: new Date().toISOString(),
        },
      };

      const created = await adminApi('POST', '/api/admin/products', payload);
      const sourceImageUrl = await getImageUrlFromProductPage(row.sourceUrl);
      const tempImagePath = await downloadImageToTemp(sourceImageUrl, tempImageDir, index);
      const updated = await uploadProductImage(baseUrl, accessToken, created._id, tempImagePath);

      createdProducts.push({
        id: created._id,
        name: created.name,
        sourceUrl: row.sourceUrl,
        sourceImageUrl,
        image: updated?.thumbnail || updated?.images?.[0] || null,
      });
    }

    const verifyProducts = await listAllItems(adminApi, '/api/admin/products');
    const cloudinaryCount = verifyProducts.filter((item) =>
      String(item.thumbnail || '').includes('res.cloudinary.com'));

    console.log('Reseed completed successfully');
    console.log(`Products deleted: ${currentProducts.length}`);
    console.log(`Products created: ${createdProducts.length}`);
    console.log(`Products with Cloudinary thumbnail: ${cloudinaryCount.length}`);
  } finally {
    await fs.rm(tempImageDir, { recursive: true, force: true });
    await new Promise((resolve) => server.close(resolve));
  }
};

main()
  .catch((error) => {
    console.error('Reseed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
