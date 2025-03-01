import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector(state => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));

      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/uploadmedia');
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cream px-4"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center justify-between">
        {/* Left Section with Logo and Tagline */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 mb-8 md:mb-0">
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-48 h-48 object-contain mb-4"
          />
          <p className="text-xl font-semibold text-white text-center">
            Your daily Media Sharing Platform.
          </p>
        </div>

        {/* Right Section with Sign-in Card */}
        <div className="p-8 w-full max-w-md rounded-lg bg-gray-100 shadow-md">
          <h1 className="text-3xl text-center font-semibold mb-7 text-black">
            Sign In
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="bg-cream p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="bg-cream p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="bg-red-600 text-white p-3 rounded-lg uppercase hover:bg-red-800 disabled:opacity-80"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            <OAuth />
          </form>
          <div className="flex items-center justify-center mt-5">
            <p className="text-teal-800 font-semibold">
              Don't have an account?
            </p>
            <Link to="/sign-up">
              <span className="text-red-600 text-lg ml-1 hover:text-red-800">
                Sign Up
              </span>
            </Link>
          </div>
          <p className="text-red-700 mt-5">
            {error ? error.message || 'Something went wrong!' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
