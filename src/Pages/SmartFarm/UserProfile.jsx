import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaUser, FaIdCard, FaCalendarAlt, FaCreditCard, FaEdit, FaSave, FaTimes, FaShieldAlt } from 'react-icons/fa';
import Footer from '../../Components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Using a placeholder image URL - replace with your actual image path
const profileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    password: '********'
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize user data from currentUser
  useEffect(() => {
    if (currentUser) {
      setUser({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        phoneNumber: currentUser.phoneNumber || '',
        cardNumber: currentUser.paymentInfo?.cardNumber || '',
        expiryDate: currentUser.paymentInfo?.expiryDate || '',
        cvc: currentUser.paymentInfo?.cvc || '',
        password: '********'
      });
    }
  }, [currentUser]);

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validateFullName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const validateCardNumber = (cardNumber) => {
    return /^\d{16}$/.test(cardNumber);
  };

  const validateCVC = (cvc) => {
    return /^\d{3}$/.test(cvc);
  };

  const validateExpiryDate = (date) => {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const newErrors = {};
    
    if (!validateEmail(user.email)) {
      newErrors.email = 'Please enter a valid Gmail address';
    }
    
    if (user.phoneNumber && !validatePhoneNumber(user.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!validateFullName(user.fullName)) {
      newErrors.fullName = 'Name should contain only letters';
    }
    
    if (user.cardNumber && !validateCardNumber(user.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (user.cvc && !validateCVC(user.cvc)) {
      newErrors.cvc = 'CVC must be 3 digits';
    }
    
    if (user.expiryDate && !validateExpiryDate(user.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData = {
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        paymentInfo: {
          cardNumber: user.cardNumber.replace(/\s/g, ''),
          expiryDate: user.expiryDate,
          cvc: user.cvc
        }
      };

      await updateProfile(userData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to current user data
    if (currentUser) {
      setUser({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        phoneNumber: currentUser.phoneNumber || '',
        cardNumber: currentUser.paymentInfo?.cardNumber || '',
        expiryDate: currentUser.paymentInfo?.expiryDate || '',
        cvc: currentUser.paymentInfo?.cvc || '',
        password: '********'
      });
    }
    setIsEditing(false);
    setErrors({});
    setErrorMessage('');
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('Profile picture uploaded:', file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const FormField = ({ label, icon, name, type, value, placeholder, disabled, error }) => (
    <motion.div variants={itemVariants} className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-3 py-3 border ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-300 ${
            disabled ? 'bg-gray-50' : 'bg-white'
          } ${isEditing && !disabled ? 'hover:border-teal-400' : ''}`}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaTimes className="text-red-500" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </motion.div>
  );

  // Notification component
  const Notification = ({ message, type }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`${
        type === 'success' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700'
      } border px-4 py-3 rounded-lg shadow-md mb-6 flex items-center`}
    >
      <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-200' : 'bg-red-200'} mr-3`}>
        {type === 'success' ? (
          <FaShieldAlt className={type === 'success' ? 'text-green-600' : 'text-red-600'} />
        ) : (
          <FaTimes className="text-red-600" />
        )}
      </div>
      <span>{message}</span>
    </motion.div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pt-20">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Success/Error Messages */}
          {successMessage && <Notification message={successMessage} type="success" />}
          {errorMessage && <Notification message={errorMessage} type="error" />}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-teal-50">
                      <FaCamera className="text-teal-600" />
                      <input type="file" className="hidden" onChange={handleProfilePictureUpload} accept="image/*" />
                    </label>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-1">{user.fullName}</h1>
                  <p className="text-teal-100 flex items-center justify-center md:justify-start">
                    <FaEnvelope className="mr-2" /> {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex justify-center md:justify-start px-6">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-6 py-4 text-sm font-medium relative ${
                    activeTab === 'personal'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FaUser />
                    <span>Personal Information</span>
                  </div>
                  {activeTab === 'personal' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" 
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`px-6 py-4 text-sm font-medium relative ${
                    activeTab === 'payment'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FaCreditCard />
                    <span>Payment Information</span>
                  </div>
                  {activeTab === 'payment' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" 
                    />
                  )}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'personal' ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <FormField
                    label="Full Name"
                    icon={<FaUser className="text-gray-400" />}
                    name="fullName"
                    type="text"
                    value={user.fullName}
                    disabled={!isEditing}
                    error={errors.fullName}
                  />

                  <FormField
                    label="Email"
                    icon={<FaEnvelope className="text-gray-400" />}
                    name="email"
                    type="email"
                    value={user.email}
                    disabled={!isEditing}
                    error={errors.email}
                  />

                  <FormField
                    label="Phone Number"
                    icon={<FaPhone className="text-gray-400" />}
                    name="phoneNumber"
                    type="tel"
                    value={user.phoneNumber}
                    disabled={!isEditing}
                    error={errors.phoneNumber}
                  />

                  <FormField
                    label="Address"
                    icon={<FaMapMarkerAlt className="text-gray-400" />}
                    name="address"
                    type="text"
                    value={user.address}
                    disabled={!isEditing}
                    error={null}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6">
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <FaShieldAlt className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800">Secure Payment Information</h3>
                        <p className="text-sm text-blue-600 mt-1">Your payment details are encrypted and securely stored.</p>
                      </div>
                    </div>
                  </div>
                  
                  <FormField
                    label="Card Number"
                    icon={<FaCreditCard className="text-gray-400" />}
                    name="cardNumber"
                    type="text"
                    value={user.cardNumber}
                    disabled={!isEditing}
                    placeholder="XXXX XXXX XXXX XXXX"
                    error={errors.cardNumber}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Expiry Date"
                      icon={<FaCalendarAlt className="text-gray-400" />}
                      name="expiryDate"
                      type="text"
                      value={user.expiryDate}
                      disabled={!isEditing}
                      placeholder="MM/YY"
                      error={errors.expiryDate}
                    />

                    <FormField
                      label="CVC"
                      icon={<FaIdCard className="text-gray-400" />}
                      name="cvc"
                      type="text"
                      value={user.cvc}
                      disabled={!isEditing}
                      placeholder="XXX"
                      error={errors.cvc}
                    />
                  </div>
                </motion.div>
              )}

              {/* Edit/Save/Cancel Buttons */}
              <motion.div 
                className="mt-8 flex justify-end space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 shadow-md flex items-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center space-x-2"
                      disabled={isLoading}
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 shadow-md flex items-center space-x-2 ${
                        isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <FaSave />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;