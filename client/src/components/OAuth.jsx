import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Capture GitHub user data from URL query params after redirect
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const photo = urlParams.get("photo");

    if (name && email) {
      dispatch(signInSuccess({ name, email, photo }));
      navigate("/uploadmedia"); // ✅ Redirect to media page
    }
  }, [dispatch, navigate]);

  // ✅ Google Login
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/uploadmedia");
    } catch (error) {
      console.log("Could not login with Google", error);
    }
  };

  // ✅ GitHub Login (Redirects to Backend)
  const handleGithubClick = () => {
    window.location.href = "http://localhost:3000/api/auth/github";
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
        onClick={handleGoogleClick}
      >
        <img src="/Google.png" alt="Google" className="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
      <button
        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
        onClick={handleGithubClick}
      >
        <img src="/Github.png" alt="GitHub" className="w-5 h-5 mr-2" />
        Sign in with GitHub
      </button>
    </div>
  );
}
