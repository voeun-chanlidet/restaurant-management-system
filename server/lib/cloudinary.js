const cloudinary = require("cloudinary").v2;
const { env } = require("../src/config/env");

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rms/menus" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

module.exports = { uploadImage };
