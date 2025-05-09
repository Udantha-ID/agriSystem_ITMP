import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaUser, FaIdCard, FaCalendarAlt, FaCreditCard, FaEdit, FaSave, FaTimes, FaShieldAlt, FaBell, FaCog, FaTrophy, FaSeedling, FaUserFriends, FaChartLine } from 'react-icons/fa';
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
    password: '********',
    bio: '',
    birthday: '',
    interests: [],
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    birthday: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [imagePreview, setImagePreview] = useState(profileImage);
  const [themeColor, setThemeColor] = useState('teal');
  
  // Achievements data
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Profile Completed', icon: '🌟', description: 'Completed your profile information', achieved: true },
    { id: 2, title: 'First Purchase', icon: '🛒', description: 'Made your first purchase in our store', achieved: true },
    { id: 3, title: 'Farm Expert', icon: '🌱', description: 'Shared farming knowledge with the community', achieved: false },
    { id: 4, title: 'Sustainable Farmer', icon: '♻️', description: 'Used eco-friendly farming methods', achieved: false },
  ]);
  
  // Activity data
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Purchased Premium Seeds', date: '2 days ago' },
    { id: 2, action: 'Updated Profile Information', date: '1 week ago' },
    { id: 3, action: 'Joined Smart Farming Community', date: '2 weeks ago' },
  ]);

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
        password: '********',
        bio: currentUser.bio || '',
        birthday: currentUser.birthday || '',
        interests: currentUser.interests || [],
        socialLinks: {
          facebook: currentUser.socialLinks?.facebook || '',
          twitter: currentUser.socialLinks?.twitter || '',
          instagram: currentUser.socialLinks?.instagram || ''
        }
      });
    }
  }, [currentUser]);

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validateFullName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const validateCardNumber = (cardNumber) => {
    // Remove spaces for validation
    const cleanedNumber = cardNumber.replace(/\s+/g, '');
    return /^\d{16}$/.test(cleanedNumber);
  };

  const validateCVC = (cvc) => {
    return /^\d{3}$/.test(cvc);
  };

  const validateExpiryDate = (date) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) {
      return false;
    }
    
    // Check if the date is in the future
    const [month, year] = date.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();
    return expiryDate > currentDate;
  };
  
  const validateBirthday = (date) => {
    if (!date) return true; // Birthday is optional
    
    // Basic date format validation (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return false;
    }
    
    const birthdayDate = new Date(date);
    const currentDate = new Date();
    
    // Check if date is valid and not in the future
    return !isNaN(birthdayDate.getTime()) && birthdayDate < currentDate;
  };
  
  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setUser(prev => ({ ...prev, [name]: formatCardNumber(value) }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleAddInterest = () => {
    if (newInterest.trim() !== '' && !user.interests.includes(newInterest.trim())) {
      setUser(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (interest) => {
    setUser(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };
  
  const handleThemeChange = (color) => {
    setThemeColor(color);
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const newErrors = {};
    
    if (!validateEmail(user.email)) {
      newErrors.email = 'Please enter a valid email address';
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
    
    if (user.birthday && !validateBirthday(user.birthday)) {
      newErrors.birthday = 'Please enter a valid birth date';
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
        bio: user.bio,
        birthday: user.birthday,
        interests: user.interests,
        socialLinks: user.socialLinks,
        paymentInfo: {
          cardNumber: user.cardNumber.replace(/\s/g, ''),
          expiryDate: user.expiryDate,
          cvc: user.cvc
        }
      };

      await updateProfile(userData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Update achievements state if profile is completed
      if (!achievements.find(a => a.id === 1).achieved) {
        const updatedAchievements = [...achievements];
        updatedAchievements[0] = { ...updatedAchievements[0], achieved: true };
        setAchievements(updatedAchievements);
        setShowAchievements(true);
        setTimeout(() => setShowAchievements(false), 5000);
      }
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
        password: '********',
        bio: currentUser.bio || '',
        birthday: currentUser.birthday || '',
        interests: currentUser.interests || [],
        socialLinks: {
          facebook: currentUser.socialLinks?.facebook || '',
          twitter: currentUser.socialLinks?.twitter || '',
          instagram: currentUser.socialLinks?.instagram || ''
        }
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
        setImagePreview(event.target.result);
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
    <div className="bg-gray-50 min-h-screen" style={{
      '--color-teal-50': '#e6fffa',
      '--color-teal-100': '#b2f5ea',
      '--color-teal-500': '#38b2ac',
      '--color-teal-600': '#319795',
      '--color-teal-700': '#2c7a7b',
      
      '--color-blue-50': '#ebf8ff',
      '--color-blue-100': '#bee3f8',
      '--color-blue-500': '#4299e1',
      '--color-blue-600': '#3182ce',
      '--color-blue-700': '#2b6cb0',
      
      '--color-purple-50': '#faf5ff',
      '--color-purple-100': '#e9d8fd',
      '--color-purple-500': '#9f7aea',
      '--color-purple-600': '#805ad5',
      '--color-purple-700': '#6b46c1',
      
      '--color-green-50': '#f0fff4',
      '--color-green-100': '#c6f6d5',
      '--color-green-500': '#48bb78',
      '--color-green-600': '#38a169',
      '--color-green-700': '#2f855a',
      
      '--color-orange-50': '#fffaf0',
      '--color-orange-100': '#feebcb',
      '--color-orange-500': '#ed8936',
      '--color-orange-600': '#dd6b20',
      '--color-orange-700': '#c05621',
    }}>
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pt-20`}>
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
            <div className={`bg-gradient-to-r from-${themeColor}-500 to-${themeColor}-600 p-8 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-teal-50">
                      <FaCamera className={`text-${themeColor}-600`} />
                      <input type="file" className="hidden" onChange={handleProfilePictureUpload} accept="image/*" />
                    </label>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-1">{user.fullName}</h1>
                  <p className={`text-${themeColor}-100 flex items-center justify-center md:justify-start mb-1`}>
                    <FaEnvelope className="mr-2" /> {user.email}
                  </p>
                  {user.bio && (
                    <p className="text-white text-sm mt-2 max-w-md opacity-90">{user.bio}</p>
                  )}
                </div>
                
                {/* Achievements icon */}
                <div className="absolute top-4 right-4 flex">
                  <button 
                    onClick={() => {
                      setActiveTab('preferences');
                      setShowAchievements(true);
                    }}
                    className={`bg-white p-2 rounded-full shadow-md text-${themeColor}-600 hover:bg-${themeColor}-50 transition-colors`}
                    title="Achievements"
                  >
                    <FaTrophy />
                  </button>
                </div>
              </div>
              
              {/* Badge indicators */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {user.interests.length > 0 && (
                  <span className={`bg-${themeColor}-100 text-${themeColor}-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                    {user.interests.length} Interests
                  </span>
                )}
                <span className={`bg-white text-${themeColor}-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                  Active Member
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex justify-center md:justify-start px-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-6 py-4 text-sm font-medium relative ${
                    activeTab === 'personal'
                      ? `text-${themeColor}-600`
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
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${themeColor}-500`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`px-6 py-4 text-sm font-medium relative ${
                    activeTab === 'payment'
                      ? `text-${themeColor}-600`
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
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${themeColor}-500`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-6 py-4 text-sm font-medium relative ${
                    activeTab === 'preferences'
                      ? `text-${themeColor}-600`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FaCog />
                    <span>Preferences</span>
                  </div>
                  {activeTab === 'preferences' && (
                    <motion.div 
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${themeColor}-500`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-6 py-4 text-sm font-medium relative ${
                    activeTab === 'activity'
                      ? `text-${themeColor}-600`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FaChartLine />
                    <span>Activity</span>
                  </div>
                  {activeTab === 'activity' && (
                    <motion.div 
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${themeColor}-500`}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      label="Birthday"
                      icon={<FaCalendarAlt className="text-gray-400" />}
                      name="birthday"
                      type="date"
                      value={user.birthday}
                      disabled={!isEditing}
                      error={errors.birthday}
                    />
                  </div>

                  <FormField
                    label="Address"
                    icon={<FaMapMarkerAlt className="text-gray-400" />}
                    name="address"
                    type="text"
                    value={user.address}
                    disabled={!isEditing}
                    error={null}
                  />
                  
                  <motion.div variants={itemVariants} className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-gray-400">
                        <FaUser />
                      </div>
                      <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="4"
                        placeholder="Tell us about yourself..."
                        className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-${themeColor}-500 focus:border-${themeColor}-500 sm:text-sm transition-all duration-300 ${
                          !isEditing ? 'bg-gray-50' : 'bg-white'
                        } ${isEditing ? `hover:border-${themeColor}-400` : ''}`}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Social Media Links */}
                  {isEditing && (
                    <motion.div variants={itemVariants} className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-700 mb-3">Social Media Links</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="w-24 text-sm text-gray-500">Facebook:</span>
                          <input
                            type="text"
                            name="facebook"
                            value={user.socialLinks.facebook}
                            onChange={(e) => setUser(prev => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                facebook: e.target.value
                              }
                            }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Your Facebook URL"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-sm text-gray-500">Twitter:</span>
                          <input
                            type="text"
                            name="twitter"
                            value={user.socialLinks.twitter}
                            onChange={(e) => setUser(prev => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                twitter: e.target.value
                              }
                            }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Your Twitter URL"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-sm text-gray-500">Instagram:</span>
                          <input
                            type="text"
                            name="instagram"
                            value={user.socialLinks.instagram}
                            onChange={(e) => setUser(prev => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                instagram: e.target.value
                              }
                            }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Your Instagram URL"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : activeTab === 'payment' ? (
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
              ) : activeTab === 'preferences' ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Theme Selection */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaCog className="mr-2 text-gray-600" /> Theme Preferences
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {['teal', 'blue', 'purple', 'green', 'orange'].map(color => (
                        <button
                          key={color}
                          onClick={() => handleThemeChange(color)}
                          className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 ${themeColor === color ? 'ring-2 ring-offset-2' : ''}`}
                          style={{ backgroundColor: `var(--color-${color}-500)` }}
                          aria-label={`${color} theme`}
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Interests */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaSeedling className="mr-2 text-gray-600" /> Farming Interests
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.interests.map(interest => (
                        <span 
                          key={interest}
                          className={`bg-${themeColor}-100 text-${themeColor}-800 text-xs font-medium px-3 py-1 rounded-full flex items-center`}
                        >
                          {interest}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveInterest(interest)}
                              className={`ml-2 text-${themeColor}-600 hover:text-${themeColor}-800 focus:outline-none`}
                            >
                              <FaTimes size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <div className="flex">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add new interest..."
                          className={`flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:ring-${themeColor}-500 focus:border-${themeColor}-500`}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        />
                        <button
                          onClick={handleAddInterest}
                          className={`bg-${themeColor}-500 text-white px-4 py-2 rounded-r-lg hover:bg-${themeColor}-600 transition-colors`}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Notifications */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaBell className="mr-2 text-gray-600" /> Notification Settings
                    </h3>
                    
                    <div className="space-y-3">
                      {[
                        { id: 'email_notifications', label: 'Email Notifications' },
                        { id: 'push_notifications', label: 'Push Notifications' },
                        { id: 'product_updates', label: 'Product Updates' },
                        { id: 'newsletter', label: 'Weekly Newsletter' }
                      ].map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={item.id === 'email_notifications' || item.id === 'product_updates'} />
                            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${themeColor}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${themeColor}-500`}></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Achievements */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800 flex items-center">
                        <FaTrophy className="mr-2 text-gray-600" /> Achievements
                      </h3>
                      <button 
                        onClick={() => setShowAchievements(!showAchievements)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        {showAchievements ? 'Hide' : 'Show All'}
                      </button>
                    </div>
                    
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${!showAchievements ? 'max-h-32 overflow-hidden' : ''}`}>
                      {achievements.map(achievement => (
                        <div 
                          key={achievement.id}
                          className={`p-3 rounded-lg ${achievement.achieved ? `bg-${themeColor}-50 border border-${themeColor}-100` : 'bg-gray-50 border border-gray-100'} flex items-center`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.achieved ? `bg-${themeColor}-100` : 'bg-gray-100'} mr-3 text-xl`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className={`font-medium ${achievement.achieved ? `text-${themeColor}-700` : 'text-gray-400'}`}>
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : activeTab === 'activity' ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Recent Activity */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-gray-600" /> Recent Activity
                    </h3>
                    
                    <div className="space-y-4">
                      {recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-start">
                          <div className={`w-2 h-2 mt-2 rounded-full bg-${themeColor}-500 mr-3`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{activity.action}</p>
                            <span className="text-xs text-gray-500">{activity.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Farm Statistics */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaSeedling className="mr-2 text-gray-600" /> Farming Statistics
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Crops Planted', value: 12, icon: '🌱' },
                        { label: 'Harvest Completed', value: 8, icon: '🌾' },
                        { label: 'Farm Efficiency', value: '76%', icon: '📈' },
                      ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl mb-1">{stat.icon}</div>
                          <div className={`text-xl font-semibold text-${themeColor}-600`}>{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Community */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaUserFriends className="mr-2 text-gray-600" /> Community Engagement
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Connections</h4>
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                              <div className={`w-full h-full bg-${themeColor}-${i*100}`}></div>
                            </div>
                          ))}
                          <div className={`w-8 h-8 rounded-full border-2 border-white bg-${themeColor}-100 flex items-center justify-center text-xs font-medium text-${themeColor}-600`}>
                            +12
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Groups</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className={`bg-${themeColor}-100 text-${themeColor}-800 text-xs font-medium px-2.5 py-0.5 rounded`}>
                            Organic Farming
                          </span>
                          <span className={`bg-${themeColor}-100 text-${themeColor}-800 text-xs font-medium px-2.5 py-0.5 rounded`}>
                            Smart Irrigation
                          </span>
                          <span className={`bg-${themeColor}-100 text-${themeColor}-800 text-xs font-medium px-2.5 py-0.5 rounded`}>
                            +3 more
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                // If none of the tabs match, fallback to personal info tab
                <div>Invalid tab selected</div>
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
                    className={`px-6 py-3 bg-${themeColor}-500 text-white rounded-lg hover:bg-${themeColor}-600 transition duration-300 shadow-md flex items-center space-x-2`}
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
                      className={`px-6 py-3 bg-${themeColor}-500 text-white rounded-lg hover:bg-${themeColor}-600 transition duration-300 shadow-md flex items-center space-x-2 ${
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