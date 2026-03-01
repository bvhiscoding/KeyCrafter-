const fs = require('fs/promises');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const removeLocalFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore cleanup errors for temporary uploaded files
  }
};

const uploadImageFromPath = async (filePath, options = {}) => {
  if (!isCloudinaryConfigured() || !filePath) {
    return null;
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'keycrafter',
    resource_type: 'image',
    ...options,
  });

  return result;
};

module.exports = {
  removeLocalFile,
  uploadImageFromPath,
};
