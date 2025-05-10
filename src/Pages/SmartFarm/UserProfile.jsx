import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaLock, FaCamera, FaMapMarkerAlt, FaUser, FaIdCard, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const profileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data);
        setFormData(response.data);
        setPaymentData(response.data.paymentDetails || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/${user._id}/payment`, paymentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-200">
            {isEditing && (
              <button className="absolute right-4 top-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                <FaCamera className="text-gray-600" />
              </button>
            )}
          </div>

          <div className="px-6 pb-8">
            <div className="flex justify-between items-end -mt-16 mb-6">
              <div className="relative group">
                <img src={profileImage} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600">
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-10">
                <button className="pb-3 font-medium text-sm text-gray-500 hover:text-gray-700 border-b-2 border-teal-500 text-teal-600">
                  Personal Information
                </button>
              </nav>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={`w-full p-3 border rounded-lg ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} disabled={!isEditing} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="email" value={formData.email || ''} className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50" disabled />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="tel" value={formData.phoneNumber || ''} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className={`w-full pl-10 pr-4 py-3 border rounded-lg ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} disabled={!isEditing} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={`w-full pl-10 pr-4 py-3 border rounded-lg ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`} disabled={!isEditing} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input type="text" value={paymentData.cardNumber || ''} onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })} className="w-full pl-10 pr-4 py-3 border rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input type="text" value={paymentData.expiryDate || ''} onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })} className="w-full pl-10 pr-4 py-3 border rounded-lg" />
                    </div>
                  </div>
                </div>
                <button onClick={handlePaymentSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;