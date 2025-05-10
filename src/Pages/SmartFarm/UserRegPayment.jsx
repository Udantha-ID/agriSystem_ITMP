// pages/UserRegisterPayment.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegPayment = () => {
  const [paymentData, setPaymentData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    paymentMethod: 'visa'
  });
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/users/${userId}/payment`, paymentData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Payment Method</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Card Holder Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={paymentData.cardHolderName}
              onChange={(e) => setPaymentData({ ...paymentData, cardHolderName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              pattern="[0-9]{16}"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Expiry Date</label>
            <input
              type="month"
              className="w-full px-3 py-2 border rounded-lg"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">CVC</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              pattern="[0-9]{3}"
              value={paymentData.cvc}
              onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">American Express</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Payment Method
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegPayment;