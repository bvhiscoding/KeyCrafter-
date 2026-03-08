const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');

const OUTPUT_FILE = path.resolve(__dirname, 'seedData.js');

const exportSeedData = async () => {
  await connectDB();

  const db = mongoose.connection.db;
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();

  const seedData = {};

  for (const { name } of collections.sort((a, b) => a.name.localeCompare(b.name))) {
    if (name.startsWith('system.')) {
      continue;
    }

    const documents = await db.collection(name).find({}).toArray();
    seedData[name] = documents;
    console.log(`Exported ${name}: ${documents.length} documents`);
  }

  const fileContent = `/* eslint-disable */\nmodule.exports = ${JSON.stringify(seedData, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');

  console.log(`\nSeed data exported to: ${OUTPUT_FILE}`);
};

exportSeedData()
  .catch((error) => {
    console.error('Export failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
