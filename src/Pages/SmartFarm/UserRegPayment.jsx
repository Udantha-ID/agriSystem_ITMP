import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, Check } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

const UserRegPayment = () => {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    cvc: '',
    paymentMethod: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format card number input (4x4 pattern)
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '') // Remove non-digits
        .replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else if (name === 'cardHolderName') {
      // Allow only letters and single spaces
      const formattedValue = value.replace(/[^A-Za-z\s]/g, ''); // Remove non-letters and non-spaces
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else if (name === 'cvc') {
      // Allow only digits
      const formattedValue = value.replace(/\D/g, ''); // Remove non-digits
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const newErrors = {};

    // Card Holder Name Validation (only letters and single spaces)
    if (!formData.cardHolderName.trim().match(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)) {
      newErrors.cardHolderName = 'Only letters and single spaces are allowed';
    }

    // Card Number Validation (16 digits, 4x4 pattern)
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // CVC Validation (3 digits)
    if (!formData.cvc.match(/^\d{3}$/)) {
      newErrors.cvc = 'CVC must be 3 digits';
    }

    // Payment Method Validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div>
    <div
      className="min-h-screen flex items-center justify-center p-8 py-30"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Payment Method */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Payment Method
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="paymentMethod"
                value="visa"
                checked={formData.paymentMethod === 'visa'}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-green-500 rounded border-gray-300 focus:ring-green-500"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="ml-2 h-6 w-12 object-contain"
              />
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="paymentMethod"
                value="mastercard"
                checked={formData.paymentMethod === 'mastercard'}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-green-500 rounded border-gray-300 focus:ring-green-500"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="ml-2 h-6 w-12 object-contain"
              />
            </label>
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
          )}
        </motion.div>

        {/* Card Holder Name */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Card Holder Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type="text"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="Enter card holder name"
              required
            />
          </div>
          {errors.cardHolderName && (
            <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
          )}
        </motion.div>

        {/* Card Number */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Card Number
          </label>
          <div className="relative group">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={19} // 16 digits + 3 spaces
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="0000 0000 0000 0000"
              required
            />
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
          )}
        </motion.div>

        {/* CVC */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            CVC
          </label>
          <div className="relative group">
            <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors h-5 w-5" />
            <input
              type="text"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              maxLength="3"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-500"
              placeholder="123"
              required
            />
          </div>
          {errors.cvc && (
            <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
          )}
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
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <motion.div
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            'Save'
          )}
        </motion.button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default UserRegPayment;