import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "video", "audio"], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Media = mongoose.model("Media", mediaSchema);
