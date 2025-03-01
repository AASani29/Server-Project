import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
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
          <p className="text-xl font-semibold text-white text-center ">
            Your Media sharing platform.
          </p>
        </div>

        {/* Right Section with Signup Card */}
        <div className="p-8 w-full max-w-md bg-gray-100  rounded-lg shadow-md">
          <h1 className="text-3xl text-center font-semibold mb-7 text-red-600">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="bg-cream p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handleChange}
            />
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
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
            <OAuth />
          </form>
          <div className="flex items-center justify-center mt-5">
            <p className="text-teal-800 font-semibold">Have an account?</p>
            <Link to="/sign-in">
              <span className="text-red-600 text-lg ml-1 hover:text-red-800">
                Sign In
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
