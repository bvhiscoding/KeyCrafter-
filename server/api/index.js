const dotenv = require('dotenv');
const app = require('../src/app');
const connectDB = require('../src/config/database');

dotenv.config();

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
      });
    }
  }

  return app(req, res);
};
