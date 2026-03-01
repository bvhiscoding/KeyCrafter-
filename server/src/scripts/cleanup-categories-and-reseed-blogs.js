const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Blog = require('../models/blog.model');

const getAdminAuthor = async () => {
  let admin = await User.findOne({ role: 'admin', isActive: true });

  if (admin) {
    return admin;
  }

  admin = await User.create({
    name: 'KeyCrafter Admin',
    email: 'content-admin@keycrafter.dev',
    password: 'Admin@12345',
    role: 'admin',
    isActive: true,
  });

  return admin;
};

const buildBlogs = (authorId) => ([
  {
    title: 'Huong Dan Chon Keyboard Kit Tu A Den Z Cho Nguoi Moi',
    category: 'guide',
    tags: ['keyboard-kit', 'guide', 'custom-keyboard', 'beginner'],
    excerpt: 'Bai viet chi tiet giup ban chon bo kit ban phim co phu hop theo nhu cau game, lam viec va ngan sach.',
    isFeatured: true,
    status: 'published',
    seo: {
      metaTitle: 'Huong Dan Chon Keyboard Kit Tu A Den Z',
      metaDescription: 'Checklist day du de chon keyboard kit: layout, plate, mounting, pcb, firmware va do on dinh.',
    },
    author: authorId,
    content: `Neu ban moi bat dau voi custom keyboard, keyboard kit la diem vao de nhat vi no quyet dinh 70% trai nghiem sau cung. Truoc khi mua, ban can lam ro ba yeu to: muc dich su dung, muc ngan sach va kha nang nang cap sau nay.

1) Xac dinh layout theo thoi quen su dung
- 60%: gon nhe, de setup, phu hop ban hep. Diem tru la thieu phim dieu huong va cum function.
- 65%: can bang tot giua gon va day du phim mui ten, rat hop cho so dong nguoi moi.
- 75%: gan giong TKL, van gon hon fullsize, giu duoc hang F va dieu huong.

2) Hieu ve mounting va cam giac go
- Tray mount: pho bien, gia tot, de sua.
- Gasket mount: mem hon, giam rung, am thanh de chiu.
- Top mount: cam giac chac chan, phan hoi ro.

3) Chon material cho plate va case
- Plate polycarbonate: am mem, giam do gat.
- Plate aluminum: can bang giua do cung va do em.
- Plate FR4: am 'thock' de nghe, de choi.
- Case aluminum: dep, ben, trong luong cao.

4) Kiem tra PCB truoc khi xuong tien
- Hot-swap 3/5 pin la uu tien so 1 neu ban moi.
- QMK/VIA hoac firmware tuong duong de remap nhanh.
- Co RGB hay khong tuy nhu cau, khong bat buoc neu uu tien am thanh.

5) Stabilizer va tuning la bat buoc
Ngay ca bo kit dat tien cung can tuning. Luon du tru ngan sach cho grease, tape, foam va phim test switch.

Checklist mua nhanh:
- Layout hop tay
- PCB hot-swap
- Plate phu hop gu am thanh
- Co tai lieu assembly ro rang
- Co cong dong nguoi dung de tham khao loi

Neu ban can mot bo kit 'an toan', hay uu tien 65% gasket + plate aluminum + PCB hot-swap. Day la combo de canh sai nhat cho nguoi moi, de nang cap dan theo thoi gian va it rui ro hoi han sau mua.`,
  },
  {
    title: 'So Sanh Switch Linear Va Tactile Trong Gaming Thuc Te',
    category: 'comparison',
    tags: ['switch', 'linear', 'tactile', 'gaming', 'latency'],
    excerpt: 'Phan tich do nhay, do on, fatigue va do chinh xac khi choi game FPS, MOBA va typing dai gio.',
    status: 'published',
    seo: {
      metaTitle: 'So Sanh Switch Linear va Tactile Cho Gaming',
      metaDescription: 'Danh gia khach quan linear va tactile theo moi truong choi game va danh may dai gio.',
    },
    author: authorId,
    content: `Linear va tactile khong co loai nao tuyet doi 'tot hon', ma chi co loai phu hop hon voi ngu canh su dung. Bai viet nay tong hop trai nghiem test tren FPS can tracking nhanh, MOBA can combo lien tuc va typing dai gio.

FPS:
- Linear cho hanh trinh deu, de spam movement va counter-strafe.
- Tactile cho diem can ro, giup ban cam thay input chac chan hon.

MOBA/MMO:
- Tactile co loi khi can xac nhan ky nang, giam bam nham trong luc cang thang.
- Linear co loi khi can thao tac nhanh lien tuc, nhung de nham neu tay nang.

Typing va lam viec:
- Tactile thuong giam met hon neu luc bam vua phai va bump khong qua gac.
- Linear em va yen tinh hon khi duoc lube dung cach.

Yeu to quyet dinh thuc te:
1. Force spring: 45g-55g la vung an toan cho da so.
2. Pre-travel va total travel: pre-travel ngan de nhanh, travel du de tranh sai phim.
3. Housing va stem material: anh huong lon den am thanh.
4. Lubing: 1 switch tune dung co the 'an dut' 1 switch dat nhung tune te.

Khuyen nghi nhanh:
- Ban choi FPS nhieu: linear 45-50g, stem tron, spring deu.
- Ban lam viec + game can bang: tactile nhe 50-55g.
- Ban can yen tinh: uu tien switch da lube + foam case + keycap PBT day.

Ket luan: dung tim switch 'best', hay tim switch khien ban danh duoc 2-3 gio lien tuc ma van thoai mai. Do moi la hieu suat that su.`,
  },
  {
    title: 'Kinh Nghiem Tune Stabilizer De Het Leng Keng Trong 30 Phut',
    category: 'guide',
    tags: ['stabilizer', 'tune', 'mod', 'spacebar', 'guide'],
    excerpt: 'Quy trinh tune stab nhanh gon, de lap lai, giup phim dai em hon va on dinh ngay lan dau.',
    status: 'published',
    author: authorId,
    content: `Tieng leng keng den tu nhieu nguon: wire chua can, housing rung, stem kho va keycap long. Neu lam dung quy trinh, ban co the cai thien rat ro chi trong 30 phut.

Dung cu can co:
- Grease cho housing/stem
- Dung dich mong hon cho wire
- Tweezers, brush nho, tissue

Quy trinh 5 buoc:
1. Can wire
Kiem tra wire tren mat phang. Neu co do venh, can lai nhe tay den khi hai dau can nhau.

2. Lube housing va stem
Phu lop mong deu, tranh boi qua day vi se lam phim bi i ach.

3. Lube diem tiep xuc wire
Day la diem tao ra am kim loai. Lam ky buoc nay giam tieng rung ro ret.

4. Kiem tra keycap fit
Nhieu truong hop am xau den tu keycap long, khong phai do stab.

5. Test theo cap
Test tung phim dai: space, enter, backspace, shift. Chinh sua tung phim theo muc do tieng.

Loi thuong gap:
- Qua nhieu lube: phim bi cham va kho hoi.
- Bo qua buoc can wire.
- Khong test voi keycap thuc te.

Muc tieu dung:
Khong can im tuyet doi, ma can am deu, khong rung kim loai, va cam giac nhat quan giua cac phim dai. Neu dat 3 dieu nay, build cua ban da rat on.`,
  },
  {
    title: 'Top Build Cho Ban Lam Viec Va Gaming Co Muc Gia Hop Ly',
    category: 'keyboard',
    tags: ['build', 'budget', 'productivity', 'gaming'],
    excerpt: 'Goi y cau hinh can bang gia thanh, trai nghiem go, do ben va kha nang nang cap ve sau.',
    status: 'published',
    author: authorId,
    content: `Khong phai ai cung can build dat tien. Dieu quan trong la chia ngan sach dung cho tung thanh phan.

Ty le ngan sach de tham khao:
- Kit: 45%
- Switch: 25%
- Keycap: 20%
- Tuning/phu kien: 10%

Profile 1: Work-first
- Layout 75%
- Switch tactile nhe
- Keycap profile thap de giam met co tay

Profile 2: Game-first
- Layout 65%
- Switch linear 45-50g
- Latency on dinh va firmware de remap nhanh

Profile 3: Hybrid
- Layout 65% hoac 75%
- Switch tactile nhe hoac linear da lube
- Keycap PBT doubleshot de ben va de ve sinh

Mau chot quan trong:
1) Dung don qua nhieu theo trend. Ban can bo co the tune va bao tri de dang.
2) Luon de ngan sach cho tuning.
3) Chon shop co bao hanh ro, linh kien thay the san.

Neu ban mua thong minh, 1 build tam trung da du de vuot xa keyboard prebuilt pho thong ve ca cam giac go va do ca nhan hoa.`,
  },
  {
    title: 'Keycap Material ABS Va PBT: Khac Nhau O Dau Va Chon The Nao',
    category: 'keycap',
    tags: ['keycap', 'abs', 'pbt', 'profile', 'sound'],
    excerpt: 'So sanh thuc te giua ABS va PBT theo do ben, am thanh, texture va kha nang giu form sau thoi gian.',
    status: 'published',
    author: authorId,
    content: `ABS va PBT deu co dat dung trong custom keyboard. Khac biet lon nhat nam o cam giac be mat va cach am thanh duoc tao ra.

ABS:
- De tao mau dep, de lam doubleshot chat luong cao.
- Am thuong vang va sang hon.
- Co the bong be mat sau thoi gian dai.

PBT:
- Be mat nham hon, cam giac bam chac tay.
- Ben mau tot, kho bong hon.
- Am thuong dam va day hon.

Khong chi material, cac yeu to nay cung anh huong manh:
1. Do day keycap
2. Kieu profile (Cherry, OEM, SA...)
3. Quy trinh in legend

Khuyen nghi chon nhanh:
- Uu tien dep, sang, ruc ro: ABS chat luong cao.
- Uu tien ben, it bong, am day: PBT.

Neu ban chua chac, hay bat dau voi PBT profile quen tay. Sau do moi thu profile cao hon de mo rong trai nghiem.`,
  },
  {
    title: 'Case Keyboard: Vai Tro Cua Do Cung, Trong Luong Va Tieu Am',
    category: 'custom',
    tags: ['case', 'acoustic', 'mounting', 'custom'],
    excerpt: 'Tai sao case anh huong lon den am thanh va cam giac go, va cach setup case de dat ket qua on dinh.',
    status: 'published',
    author: authorId,
    content: `Case la khung xuong cua toan bo build. Nhieu nguoi tap trung qua nhieu vao switch ma quen rang case quyet dinh cach rung duoc truyen va tieu tan.

Case kim loai:
- Chac chan, dep, cho cam giac premium.
- Trong luong cao giup ban phim dung vung.

Case nhua:
- Nhe, de di chuyen, gia de tiep can.
- Co the cho am mem hon neu ket hop dung plate/foam.

Nhung mod hay duoc dung:
1) Foam case de giam echo
2) Tape mod de thay doi dac tinh am
3) Force-break de cat rung giua cac be mat tiep xuc

Luu y quan trong: mod khong co cong thuc chung. Moi bo kit se co diem toi uu rieng. Ban nen thay doi tung buoc, test lai, roi moi tiep tuc. Neu thay doi qua nhieu cung luc, ban se khong biet cai nao tao ra khac biet that.`,
  },
  {
    title: 'Tin Tong Hop Thi Truong Keyboard: Xu Huong 2026 Dang Noi Bat',
    category: 'news',
    tags: ['news', 'trend', 'keyboard-2026', 'community'],
    excerpt: 'Tong hop xu huong moi ve switch, firmware, keycap va hanh vi mua hang trong cong dong keyboard.',
    status: 'published',
    author: authorId,
    content: `Thi truong keyboard 2026 dang dich chuyen theo huong thuc dung hon: nguoi dung giam mua theo hype va uu tien trai nghiem dai han.

Xu huong 1: switch da duoc tune tot tu nha san xuat
Nguoi dung ky vong cao hon o out-of-box quality, giam phu thuoc vao tuning sau mua.

Xu huong 2: firmware than thien
Remap nhanh, profile cloud, va giao dien de dung tro thanh tieu chuan moi.

Xu huong 3: build can bang
Thay vi theo duoi 1 am thanh duy nhat, cong dong quay ve triet ly can bang giua cam giac go, do ben va tinh thuc dung.

Xu huong 4: keycap tap trung vao chat lieu va legend
Nguoi dung quan tam den do ben legend hon la chay theo bo mau qua nhieu.

Danh cho nguoi mua:
Hay danh gia san pham theo vong doi 12-24 thang, khong chi theo cam xuc mua lan dau.`,
  },
  {
    title: 'Review Chi Tiet Build 65 Phan Tram Cho Setup Toi Gian',
    category: 'review',
    tags: ['review', '65-percent', 'minimal-setup', 'daily-use'],
    excerpt: 'Danh gia toan dien mot build 65% theo tieu chi su dung hang ngay, game va tinh tham my tren ban lam viec.',
    status: 'published',
    isFeatured: true,
    rating: 9,
    author: authorId,
    content: `Build 65% la diem ngot cho nhieu nguoi: gon hon TKL nhung van giu duoc cum mui ten. Trong bai review nay, minh danh gia theo 5 nhom tieu chi.

1. Cam giac go
Key travel on dinh, khong co phim nao bi lech cam giac. Spacebar da duoc tune tot, tieng dong deu.

2. Am thanh
Tong the am theo huong dam, khong bi vang qua muc. O toc do go cao, am van duoc kiem soat.

3. Tinh thuc dung
Layout de lam quen, di chuyen tren ban lam viec don gian, khong chiem nhieu dien tich.

4. Kha nang nang cap
Hot-swap, plate de thay, firmware de remap. Day la diem cong lon cho build lau dai.

5. Do hoan thien
Case fit chac, khong rung du thua, ket cau giup build on dinh khi su dung lien tuc.

Tong ket: neu ban can 1 bo keyboard vua de choi game vua de lam viec, build 65% duoc tune dung cach la lua chon rat kho sai.`,
  },
  {
    title: 'Huong Dan Ve Sinh Va Bao Tri Keyboard Khong Lam Mat Cam Giac Go',
    category: 'guide',
    tags: ['maintenance', 'cleaning', 'keyboard-care', 'guide'],
    excerpt: 'Quy trinh bao tri dinh ky de keyboard ben hon ma van giu duoc am thanh va do nhay mong muon.',
    status: 'published',
    author: authorId,
    content: `Bao tri dung cach giup ban phim giu duoc chat luong trong thoi gian dai, dac biet voi build da tune ky.

Tan suat de xuat:
- Hang tuan: lau be mat keycap va case.
- Hang thang: thao keycap, hut bui, ve sinh plate.
- Moi 3-6 thang: kiem tra stab, spring ping va tinh trang switch.

Nguyen tac quan trong:
1) Khong dung dung dich manh lam bong keycap.
2) Khong xit chat long truc tiep vao switch.
3) Chup anh truoc khi thao keycap de lap lai nhanh.

Neu ban thay am thanh bat thuong (rung, keng, i ach), hay xu ly theo thu tu: keycap -> stab -> switch -> case. Lam tu ngoai vao trong se de tim loi va tiet kiem thoi gian hon.`,
  },
  {
    title: 'Checklist Truoc Khi Mua Switch So Luong Lon De Build Full',
    category: 'switch',
    tags: ['switch', 'checklist', 'buying-guide', 'custom-build'],
    excerpt: 'Danh sach can kiem tra truoc khi dat mua switch de tranh mismatch va tiet kiem chi phi build.',
    status: 'published',
    author: authorId,
    content: `Mua switch so luong lon de build full la khoan de sai nhat neu ban bo qua khau planning. Day la checklist ngan gon nhung quan trong:

1. Kiem tra pin compatibility
PCB cua ban ho tro 3-pin hay 5-pin? Neu khong khop, ban se ton them cong cat chan.

2. Tinh du so luong dung
So phim + 5% du phong cho loi vat ly, tuning va thay the.

3. Chon spring force theo thoi gian su dung
Neu go dai gio, tranh spring qua nang.

4. Kiem tra tinh trang pre-lube
Neu switch da pre-lube tot, ban tiet kiem duoc nhieu cong tune.

5. Dat cung bo sample
Thu 1-2 loai sample truoc khi mua full batch luon la cach tiet kiem nhat.

6. Ghi lai profile yeu thich
Luu y ve force, am thanh, do muot de lan sau mua nhanh hon.

Ket luan: chuan bi ky truoc khi mua switch se giup ban tranh duoc 80% sai lam pho bien cua nguoi moi va tiet kiem rat nhieu chi phi nang cap khong can thiet.`,
  },
]);

const main = async () => {
  await connectDB();

  const usedCategoryIds = await Product.distinct('category', {
    isDeleted: false,
    isActive: true,
  });

  const categoryCleanupResult = await Category.updateMany(
    {
      isDeleted: false,
      _id: { $nin: usedCategoryIds },
    },
    {
      $set: {
        isDeleted: true,
        isActive: false,
      },
    },
  );

  const activeCategories = await Category.find({ isDeleted: false }).select('name slug');

  const deletedBlogsResult = await Blog.deleteMany({});
  const author = await getAdminAuthor();
  const blogs = buildBlogs(author._id);
  const createdBlogs = [];

  for (const blogData of blogs) {
    const created = await Blog.create(blogData);
    createdBlogs.push(created);
  }

  console.log('Cleanup and reseed completed');
  console.log(`Unused categories soft-deleted: ${categoryCleanupResult.modifiedCount}`);
  console.log(`Active categories remaining: ${activeCategories.length}`);
  console.log(`Old blogs deleted: ${deletedBlogsResult.deletedCount}`);
  console.log(`New blogs created: ${createdBlogs.length}`);
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
