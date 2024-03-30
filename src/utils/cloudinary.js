const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    console.log("Image uploaded successfully:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

module.exports = uploadImageToCloudinary