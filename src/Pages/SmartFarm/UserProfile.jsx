import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaUser, FaIdCard, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import Footer from '../../Components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pt-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {errorMessage}
              </div>
            )}

            {/* Profile Header */}
            <div className="bg-teal-500 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                      <FaCamera className="text-teal-500" />
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-teal-100">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'personal'
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'payment'
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Payment Information
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'personal' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCreditCard className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="cardNumber"
                        value={user.cardNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="expiryDate"
                          value={user.expiryDate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="MM/YY"
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        />
                      </div>
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">CVC</label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="cvc"
                          value={user.cvc}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.cvc ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                        />
                      </div>
                      {errors.cvc && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Edit/Save/Cancel Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 shadow-md"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-300"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;