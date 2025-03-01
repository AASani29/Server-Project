import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "media_uploads", // Cloudinary folder name
    allowedFormats: ["jpg", "jpeg", "png", "mp4", "mp3"],
    transformation: [{ width: 800, crop: "limit" }], // Optional transformation
  },
});

const upload = multer({ storage });

export default upload;
