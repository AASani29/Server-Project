import { Comment } from "../models/comment.model.js";

// ✅ Add a Comment
export const addComment = async (req, res) => {
  try {
    const { mediaId, text, parentId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = new Comment({
      mediaId,
      userId: req.user.id,
      text,
      parentId: parentId || null, // Handle nested comments
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch Comments for a Media (Nested Structure)
export const getComments = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const comments = await Comment.find({ mediaId }).populate("userId", "name");

    // Create a nested comment structure
    const buildNestedComments = (parentId = null) =>
      comments
        .filter((comment) => String(comment.parentId) === String(parentId))
        .map((comment) => ({
          ...comment.toObject(),
          replies: buildNestedComments(comment._id),
        }));

    res.json(buildNestedComments());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
