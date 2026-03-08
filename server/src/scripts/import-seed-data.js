const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('../config/database');
const seedData = require('./seedData');

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const reviveTypes = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => reviveTypes(item));
  }

  if (value && typeof value === 'object') {
    const next = {};

    Object.entries(value).forEach(([key, item]) => {
      next[key] = reviveTypes(item);
    });

    return next;
  }

  if (typeof value === 'string') {
    if (OBJECT_ID_REGEX.test(value)) {
      return new mongoose.Types.ObjectId(value);
    }

    if (ISO_DATE_REGEX.test(value)) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  return value;
};

const importSeedData = async () => {
  await connectDB();

  const db = mongoose.connection.db;
  const collectionNames = Object.keys(seedData).sort();

  for (const collectionName of collectionNames) {
    const rawDocuments = seedData[collectionName] || [];

    if (!Array.isArray(rawDocuments) || rawDocuments.length === 0) {
      console.log(`Skipped ${collectionName}: no documents`);
      continue;
    }

    const documents = rawDocuments.map((doc) => reviveTypes(doc));
    const collection = db.collection(collectionName);

    const operations = documents.map((doc) => {
      if (doc._id) {
        return {
          replaceOne: {
            filter: { _id: doc._id },
            replacement: doc,
            upsert: true,
          },
        };
      }

      return {
        insertOne: {
          document: doc,
        },
      };
    });

    const result = await collection.bulkWrite(operations, { ordered: false });

    console.log(
      `Imported ${collectionName}: total=${rawDocuments.length}, matched=${result.matchedCount}, modified=${result.modifiedCount}, upserted=${result.upsertedCount}, inserted=${result.insertedCount}`,
    );
  }

  console.log('Import completed successfully.');
};

importSeedData()
  .catch((error) => {
    console.error('Import failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
