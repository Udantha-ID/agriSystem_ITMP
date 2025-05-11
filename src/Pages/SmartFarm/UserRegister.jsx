import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, XCircle, Phone, MapPin, Sprout, Leaf, CreditCard } from 'lucide-react';
import backgroundImage from '../../images/SmartFarm/wallpaper.jpeg';
import Navbar from '../../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    paymentInfo: {
      cardHolderName: '',
      cardNumber: '',
      cvc: '',
      paymentMethod: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    server: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fullName') {
      const lettersOnly = /^[A-Za-z\s]+$/;
      if (!lettersOnly.test(value) && value !== '') return;
    }

    if (name === 'phoneNumber') {
      const numbersOnly = /^\d*$/;
      if (!numbersOnly.test(value) && value !== '') return;
      if (value.length > 10) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.server) {
      setErrors(prev => ({ ...prev, server: '' }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Email must include @gmail.com' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }

    if (name === 'phoneNumber') {
      if (value.length !== 10) {
        setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be 10 digits' }));
      } else {
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      }
    }
  };

  const passwordStrength = (password) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    return {
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isStrong: hasLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      Swal.fire({
        title: 'Terms Required',
        text: 'Please agree to the Terms of Service and Privacy Policy',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'animated fadeInDown',
          title: 'text-2xl font-bold text-yellow-600',
          content: 'text-gray-600',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg'
        }
      });
      return;
    }

    // Form validation
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Email must include @gmail.com' }));
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be 10 digits' }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);
    
    try {
      // Remove confirmPassword as it's not needed in the backend
      const { confirmPassword, ...userData } = formData;
      
      // Call the register API directly instead of using the auth context
      await authService.registerOnly(userData);
      
      // Show success message with SweetAlert2
      Swal.fire({
        title: 'Success!',
        text: 'Your account has been created successfully',
        icon: 'success',
        confirmButtonText: 'Continue to Login',
        showCancelButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'animated fadeInDown',
          title: 'text-2xl font-bold text-green-600',
          content: 'text-gray-600',
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg'
        },
        background: '#ffffff',
        backdrop: `
          rgba(0,0,0,0.4)
          left top
          no-repeat
        `
      }).then(() => {
        navigate('/login', { 
          state: { 
            registrationSuccess: true,
            email: formData.email 
          }
        });
      });
    } catch (error) {
      Swal.fire({
        title: 'Registration Failed',
        text: error.message || 'Registration failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
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
      setIsLoading(false);
    }
  };

  return (
    <div>
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 py-30"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
      
      <div className="flex items-center justify-center mb-8">
        <motion.div className="relative">
          <Sprout className="h-12 w-12 text-green-500" />
          <Leaf className="h-6 w-6 text-green-300 absolute -top-1 -right-1" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white ml-3"
        >
          Create Profile
        </motion.h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 space-y-6"
      >
        {/* Registration success message */}
        {registrationSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
          >
            Account created successfully! Redirecting to login...
          </motion.div>
        )}

        {/* Server error message */}
        {errors.server && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          >
            {errors.server}
          </motion.div>
        )}

        {/* Full Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="Enter your full name"
              required
            />
          </div>
        </motion.div>

        {/* Email Field */}
        <motion.div
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
              onBlur={handleBlur}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </motion.div>

        {/* Address Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Address
          </label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500 min-h-[80px] resize-none"
              placeholder="Enter your address"
              required
            />
          </div>
        </motion.div>

        {/* Phone Number Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Phone Number
          </label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="Enter your phone number"
              required
              maxLength="10"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {Object.entries(strength).map(([key, value]) => {
              if (key === 'isStrong') return null;
              return (
                <div key={key} className="flex items-center text-sm">
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {key === 'hasLength' && '8+ characters'}
                    {key === 'hasUpper' && 'Uppercase letter'}
                    {key === 'hasLower' && 'Lowercase letter'}
                    {key === 'hasNumber' && 'Number'}
                    {key === 'hasSpecial' && 'Special character'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Confirm Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
          )}
        </motion.div>

        {/* Terms and Conditions with Payment Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-green-500 rounded border-gray-300 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-green-500 hover:text-green-600 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-500 hover:text-green-600 transition-colors">
                Privacy Policy
              </a>
            </span>
          </label>
          
          {/* Add Payment Method Button */}
          <motion.button
            type="button"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-blue-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/payment')}
          >
            <CreditCard className="h-5 w-5" />
            Add Payment Method
          </motion.button>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !agreed || formData.password !== formData.confirmPassword || !strength.isStrong || registrationSuccess}
          className={`w-full bg-green-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] ${
            (isLoading || !agreed || formData.password !== formData.confirmPassword || !strength.isStrong || registrationSuccess)
              ? 'opacity-75 cursor-not-allowed'
              : ''
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <motion.div
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : registrationSuccess ? (
            'Account Created!'
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default UserRegister;