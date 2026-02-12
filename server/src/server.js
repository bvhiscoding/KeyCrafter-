const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
