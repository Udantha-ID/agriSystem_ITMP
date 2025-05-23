import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../Components/Footer';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isInitialized } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.registrationSuccess ? 
    'Account created successfully! Please log in.' : null);
  
  const from = location.state?.from || '/';
  
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate, from]);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showSuccessAlert = (userName) => {
Swal.fire({
  title: `<span class="text-3xl font-extrabold text-green-700">Welcome, ${userName}!</span>`,
  html: `
    <p class="text-gray-700 text-lg mt-2">
      You have <strong>successfully logged in</strong>.<br>
      We're redirecting you to the homepage...
    </p>
    <div class="mt-4 flex justify-center">
      <svg class="w-12 h-12 text-green-500 animate-bounce" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 19V6l-2 2m12 11v-9l-2 2m-4 4l-2 2m0 0l2 2m-2-2H5m14 0h-6" />
      </svg>
    </div>
  `,
  icon: 'success',
  toast: false, // set to true for top-right toast
  position: 'center',
  showConfirmButton: true,
  confirmButtonText: 'Let\'s Go!',
  showCancelButton: false,
  timer: 4000,
  timerProgressBar: true,
  background: '#f0fff4',
  customClass: {
    popup: 'animated fadeInDown shadow-2xl rounded-xl',
    title: '',
    htmlContainer: '',
    confirmButton: 'bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-lg transition-all duration-200',
  },
  didOpen: () => {
    const audio = new Audio('/sounds/login-success.mp3'); // optional sound effect
    audio.play().catch(() => {}); // catch autoplay errors
  },
  backdrop: `
    rgba(0, 128, 0, 0.3)
    center
    no-repeat
  `
}).then(() => {
  navigate("/");
});

  };

  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      title: 'Login Failed',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Try Again',
      showCancelButton: false,
      customClass: {
        popup: 'animated fadeInDown',
        title: 'text-2xl font-bold text-red-600',
        content: 'text-gray-600',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg'
      },
      background: '#ffffff',
      backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
      `
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    
    try {
      const response = await login(formData.email, formData.password);
      if (response && response.user) {
        // Get user's name from the response or use email as fallback
        const userName = response.user.name || response.user.email.split('@')[0];
        showSuccessAlert(userName);
      }
    } catch (err) {
      let errorMessage = 'Invalid credentials. Please try again.';
      
      // More specific error messages based on the error
      if (err.message.includes('email')) {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (err.message.includes('password')) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      showErrorAlert(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div 
        className="flex-grow flex items-center justify-center p-8 py-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          {/* Registration Success Message */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Email Field */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>

          {/* Remember Me and Forgot Password */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-green-500 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-green-500 hover:text-green-600 transition-colors"
            >
              Forgot password?
            </a>
          </motion.div>

          {/* Create Account Section */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="text-sm text-green-500 hover:text-green-600 transition-colors font-semibold"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UserLogin;