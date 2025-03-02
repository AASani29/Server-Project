import express from "express";
import { uploadMedia, getAllMedia, getUserMedia, deleteMedia } from "../controllers/media.controller.js";
import upload from "../Middleware/upload.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), uploadMedia); 
router.get("/", getAllMedia); 
router.get("/user", verifyToken, getUserMedia); 
router.delete("/:id", verifyToken, deleteMedia); 

export default router;
