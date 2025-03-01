import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  mediaId: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // Nested Comment
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model("Comment", commentSchema);
