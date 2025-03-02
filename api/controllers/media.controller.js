import { Media } from "../models/media.model.js";
import cloudinary from "../config/cloudinary.js";

// Upload media (requires authentication)
export const uploadMedia = async (req, res) => {
    try {
        console.log("User from token:", req.user);

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found in request" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { title, fileType } = req.body;

        // Upload file to Cloudinary
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            resource_type: fileType === "video" ? "video" : fileType === "audio" ? "raw" : "image",
        });

        const media = new Media({
            title,
            fileUrl: uploadedFile.secure_url, 
            fileType,
            uploadedBy: req.user.id,
        });

        await media.save();
        res.status(201).json(media);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Retrieve all media (filter by category if provided)
export const getAllMedia = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { fileType: category } : {};

        const media = await Media.find(filter);
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Retrieve media files uploaded by the logged-in user
export const getUserMedia = async (req, res) => {
    try {
        const media = await Media.find({ uploadedBy: req.user.id });
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a media file (only by the uploader)
export const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ message: "Media not found" });

        if (media.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this file" });
        }

        // Delete from Cloudinary
        const publicId = media.fileUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);

        await media.deleteOne();
        res.json({ message: "Media deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
