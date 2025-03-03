import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";

export default function MediaManager() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [allMedia, setAllMedia] = useState([]);
  const [userMedia, setUserMedia] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMedia();
    if (currentUser) {
      fetchUserMedia();
    } else {
      setAuthError(true);
    }
  }, [currentUser]);

  const fetchAllMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/media");
      const data = await response.json();
      setAllMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage("Failed to fetch media.");
    }
    setLoading(false);
  };
    // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload media
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append(
      "fileType",
      file.type.includes("image")
        ? "image"
        : file.type.includes("video")
        ? "video"
        : "audio"
    );

    try {
      const response = await fetch("http://localhost:3000/api/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("File uploaded successfully!");
        setTitle("");
        setFile(null);
        fetchUserMedia(); // Refresh user media list
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Upload failed!");
    }

    setLoading(false);
  };

  const fetchUserMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/media/user", {
        credentials: "include",
      });

      if (response.status === 401) {
        setAuthError(true);
        setMessage("Unauthorized: Please log in.");
        return;
      }

      const data = await response.json();
      setUserMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage("Failed to fetch your media.");
    }
    setLoading(false);
  };

 const fetchComments = async (mediaId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/comments/${mediaId}`);
    const data = await response.json();

    // Ensure data structure consistency
    setComments((prev) => ({
      ...prev,
      [mediaId]: Array.isArray(data) ? data : [],
    }));
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
};
  const handleCommentChange = (mediaId, text) => {
    setNewComment((prev) => ({ ...prev, [mediaId]: text }));
  };

const handleAddComment = async (mediaId, parentId = null, replyText = null) => {
  const text = replyText || newComment[mediaId]; // Use reply text if provided

  if (!text) return;

  try {
    const response = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, text, parentId }),
    });

    if (response.ok) {
      fetchComments(mediaId); // Refresh comments after posting
      setNewComment((prev) => ({ ...prev, [mediaId]: "" }));
    } else {
      console.error("Failed to add comment.");
    }
  } catch (error) {
    console.error("Failed to add comment:", error);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {authError && (
        <p className="text-red-500 text-center font-semibold">
          Unauthorized: Please log in to access your media.
        </p>
      )}

      {currentUser && (
        <div className="flex items-center justify-between mb-4 p-4 border rounded-lg bg-gray-100">
          <div className="flex items-center">
            <img
              src={currentUser.profilePicture}
              alt="profile"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="text-xl font-semibold">{currentUser.name}</h3>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              fetch("/api/auth/signout", { method: "POST", credentials: "include" })
                .then(() => {
                  dispatch(signOut());
                  navigate("/sign-in");
                })
                .catch((error) => console.log(error));
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-center">Media Manager</h2>
      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter title"
          className="border p-2 rounded w-full mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} className="mb-3 w-full" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {message && <p className="mt-3 text-red-500 text-center">{message}</p>}
      </div>

      <div className="mb-4">
        <select
          className="border p-2 rounded w-full"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">All Media</h3>
      <MediaList 
        media={allMedia} 
        filter={filter} 
        fetchComments={fetchComments} 
        comments={comments} 
        newComment={newComment} 
        handleCommentChange={handleCommentChange} 
        handleAddComment={handleAddComment} 
      />

      <h3 className="text-xl font-semibold mt-6 mb-4">Your Uploads</h3>
      <MediaList 
        media={userMedia} 
        filter={filter} 
        fetchComments={fetchComments} 
        comments={comments} 
        newComment={newComment} 
        handleCommentChange={handleCommentChange} 
        handleAddComment={handleAddComment} 
      />
    </div>
  );
}

function MediaList({ media, filter, fetchComments, comments, newComment, handleCommentChange, handleAddComment }) {
  const [replyBox, setReplyBox] = useState({}); 
  const [replyText, setReplyText] = useState({}); 

  return (
    <div className="grid grid-cols-2 gap-4">
      {media
        .filter((item) => (filter ? item.fileType === filter : true))
        .map((item) => (
          <div key={item._id} className="border p-2 rounded shadow-md">
            <h3 className="font-semibold">{item.title}</h3>
            <h3 className="text-sm text-gray-600">
  Uploaded by: {item.uploadedBy?.name || "Unknown"}
</h3>

            {item.fileType === "image" && <img src={item.fileUrl} alt={item.title} className="w-full h-40 object-cover mt-2" />}
            {item.fileType === "video" && <video controls className="w-full h-40 mt-2"><source src={item.fileUrl} type="video/mp4" /></video>}

            <button className="text-blue-500 mt-2" onClick={() => fetchComments(item._id)}>
              Load Comments
            </button>

            {/* Comment Input */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="border p-1 rounded w-full mt-2"
                value={newComment[item._id] || ""}
                onChange={(e) => handleCommentChange(item._id, e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                onClick={() => handleAddComment(item._id)}
              >
                Comment
              </button>
            </div>

            {/* Display Comments */}
            {comments[item._id]?.map((comment) => (
              <div key={comment._id} className="border-l pl-4 my-2">
                <p className="text-sm font-semibold">{comment.userId.name}:</p>
                <p>{comment.text}</p>

                {/* ✅ Reply Button - Toggles Reply Box */}
                <button
                  className="text-blue-500 text-xs mt-1"
                  onClick={() =>
                    setReplyBox((prev) => ({
                      ...prev,
                      [comment._id]: !prev[comment._id],
                    }))
                  }
                >
                  Reply
                </button>

                {/* ✅ Conditionally show reply input box */}
                {replyBox[comment._id] && (
                  <div className="mt-2 ml-4">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="border p-1 rounded w-full mt-2"
                      value={replyText[comment._id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [comment._id]: e.target.value, 
                        }))
                      }
                    />
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
                      onClick={() => {
                        handleAddComment(item._id, comment._id, replyText[comment._id]); 
                        setReplyBox((prev) => ({ ...prev, [comment._id]: false }));
                        setReplyText((prev) => ({ ...prev, [comment._id]: "" })); 
                      }}
                    >
                      Submit Reply
                    </button>
                  </div>
                )}

                {/* ✅ Show Replies (Nested Comments) */}
                {comment.replies?.map((reply) => (
  <div key={reply._id} className="ml-6 border-l pl-4 my-2">
    <p className="text-sm font-semibold">{reply.userId?.name || "Unknown"}:</p>
    <p>{reply.text}</p>
  </div>
))}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
