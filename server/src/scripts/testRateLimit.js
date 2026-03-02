require('dotenv').config();
const app = require('../app');
const http = require('http');

// Vô hiệu hóa logger morgan để dễ nhìn kết quả hơn
app.use((req, res, next) => next());

const PORT = 4000;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🧪 Bắt đầu test Rate Limiting (giới hạn 10 request/giờ cho /api/auth/login)...`);
  console.log(`=========================================\n`);

  const url = `http://localhost:${PORT}/api/auth/login`;

  for (let i = 1; i <= 12; i++) {
    try {
      // Gửi request rỗng (sẽ bị lỗi 400 Validation Error ở các req đầu tiên)
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (response.status === 429) {
        console.log(
          `🔴 Request ${i}: [BỊ CHẶN] Mã HTTP: ${response.status}, Lỗi: ${data.message || 'Too many requests'}`
        );
      } else {
        console.log(
          `🟢 Request ${i}: [THÀNH CÔNG ĐI QUA RATE LIMIT] (Dừng lại ở Validator), Mã HTTP: ${response.status}`
        );
      }
    } catch (err) {
      console.error(`Lỗi request:`, err.message);
    }
  }

  console.log(`\n✅ Hoàn tất bài test.`);
  server.close();
  process.exit(0);
});
