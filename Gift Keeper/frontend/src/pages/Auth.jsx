import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => password.length >= 6;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const { data } = await axios.post(
        `http://localhost:5000/api/auth${endpoint}`,
        formData
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success(isLogin ? "Login successful!" : "Registration successful!");
        navigate("/home");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-tertiary p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-highlight mb-2">Gift Keeper</h1>
          <p className="text-accent">Keep track of your gift ideas</p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-full ${
              isLogin
                ? "bg-highlight text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-full ${
              !isLogin
                ? "bg-highlight text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              onChange={(e) => {
                handleChange(e);
                if (!validatePassword(e.target.value)) {
                  e.target.setCustomValidity(
                    "Password must be at least 6 characters long"
                  );
                } else {
                  e.target.setCustomValidity("");
                }
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors duration-200"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}