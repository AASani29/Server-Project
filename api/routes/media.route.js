import express from "express";
import { uploadMedia, getAllMedia, getUserMedia, deleteMedia } from "../controllers/media.controller.js";
import upload from "../Middleware/upload.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), uploadMedia); // Upload media
router.get("/", getAllMedia); // Retrieve all media (with optional category filter)
router.get("/user", verifyToken, getUserMedia); // Retrieve logged-in user's media
router.delete("/:id", verifyToken, deleteMedia); // Delete media (only by uploader)

export default router;
