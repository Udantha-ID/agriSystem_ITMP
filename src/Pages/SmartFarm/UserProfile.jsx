import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaUser, FaIdCard, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import Footer from '../../Components/Footer'

// Using a placeholder image URL - replace with your actual image path
const profileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: 'Alexa Rawles',
    email: 'alexarawles@gmail.com',
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

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const validateFullName = (name) => {
    const re = /^[a-zA-Z ]+$/;
    return re.test(name);
  };

  const validateCardNumber = (card) => {
    const re = /^\d{16}$/;
    return re.test(card);
  };

  const validateCVC = (cvc) => {
    const re = /^\d{3}$/;
    return re.test(cvc);
  };

  const validateExpiryDate = (date) => {
    const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    return re.test(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    
    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          error = 'Please enter a valid Gmail address';
        }
        break;
      case 'phoneNumber':
        if (!validatePhoneNumber(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'fullName':
        if (!validateFullName(value)) {
          error = 'Name should contain only letters';
        }
        break;
      case 'cardNumber':
        if (!validateCardNumber(value.replace(/\s/g, ''))) {
          error = 'Card number must be 16 digits';
        }
        break;
      case 'cvc':
        if (!validateCVC(value)) {
          error = 'CVC must be 3 digits';
        }
        break;
      case 'expiryDate':
        if (!validateExpiryDate(value)) {
          error = 'Invalid expiry date (MM/YY)';
        }
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCardNumber(value);
    setUser(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleSave = () => {
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
    
    setIsEditing(false);
    console.log('User data saved:', user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({
      fullName: '',
      email: '',
      phoneNumber: '',
      cardNumber: '',
      expiryDate: '',
      cvc: ''
    });
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

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pt-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-200">
            {isEditing && (
              <button className="absolute right-4 top-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-200">
                <FaCamera className="text-gray-600" />
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="px-6 pb-8">
            <div className="flex justify-between items-end -mt-16 mb-6">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-picture-upload"
                      className="hidden"
                      onChange={handleProfilePictureUpload}
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 shadow-md transition duration-200"
                    >
                      <FaCamera size={14} />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition duration-300 shadow-md"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 shadow-md"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Name and Email */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-10">
                {['personal', 'payment'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-b-2 border-teal-500 text-teal-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'personal' ? 'Personal Information' : 'Payment Details'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Fields */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                      !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    } ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaEnvelope className="text-gray-500" size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="example@gmail.com"
                      className={`w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                      } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaPhone className="text-gray-500" size={16} />
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="1234567890"
                      maxLength="10"
                      className={`w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                      } ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaMapMarkerAlt className="text-gray-500" size={16} />
                    </span>
                    <input
                      type="text"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="123 Main St, City, State, Zip"
                      className={`w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaLock className="text-gray-500" size={16} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      disabled
                      className="w-full p-3 pl-12 border rounded-lg bg-gray-50 shadow-sm"
                    />
                  </div>
                  <button className="text-teal-500 text-sm font-medium mt-2 hover:text-teal-600 transition duration-200">
                    {isEditing ? 'Set New Password' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaCreditCard className="text-gray-500" size={16} />
                    </span>
                    <input
                      type="text"
                      name="cardNumber"
                      value={user.cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={`w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                        !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                      } ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FaCalendarAlt className="text-gray-500" size={16} />
                      </span>
                      <input
                        type="text"
                        name="expiryDate"
                        value={user.expiryDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                          !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                        } ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                  </div>

                  {/* CVC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FaLock className="text-gray-500" size={16} />
                      </span>
                      <input
                        type="text"
                        name="cvc"
                        value={user.cvc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        placeholder="123"
                        maxLength="3"
                        className={`w-full p-3 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
                          !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                        } ${errors.cvc ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    <Footer />
    </div>
  );
};

export default UserProfile;