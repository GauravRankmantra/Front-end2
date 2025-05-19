import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaStripe, FaPaypal } from 'react-icons/fa';
import axios from 'axios';
import { GoAlertFill } from "react-icons/go";


const apiUrl = import.meta.env.VITE_API_URL;

const Withdrawal = () => {
  const user = useSelector((state) => state.user.user);
  const [stripeId, setStripeId] = useState('');
  const [paypalId, setPaypalId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const hasStripe = user?.stripeAccountId;
  const hasPaypal = user?.paypalId;

  const handleAdd = async (type) => {
    try {
      const payload =
        type === 'stripe'
          ? { stripeAccountId: stripeId }
          : { paypalId: paypalId };

      await axios.patch(`${apiUrl}api/v1/user/update`, payload, {
        withCredentials: true
      });

      setSuccess(`${type.toUpperCase()} ID added successfully!`);
      setStripeId('');
      setPaypalId('');
    } catch (err) {
      console.error(err);
      setError('Failed to add withdrawal method.');
    }
  };

  if (hasStripe || hasPaypal) return <div />;

  return (
    <div className="max-w-2xl md:mx-auto mx-2 mt-10 p-6 bg-slate-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-7 text-gray-100 justify-center flex items-center gap-2">
        <GoAlertFill className='text-red-500'/> <span>Withdrawal Setup Required</span>
      </h2>
      <p className="text-gray-200 mb-4">
        To upload songs and withdraw earnings, you need to link your Stripe or PayPal account.
      </p>

      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-400">
          {error}
        </div>
      )}

      {/* Stripe Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="flex items-center gap-2 text-indigo-500">
            <FaStripe className='w-10 h-10 text-blue-500'/> Stripe Account ID
          </span>
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={stripeId}
            onChange={(e) => setStripeId(e.target.value)}
            placeholder="acct_123abc..."
            className="flex-1 px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => handleAdd('stripe')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add Stripe
          </button>
        </div>
      </div>

      {/* PayPal Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="flex items-center gap-2 text-blue-500">
           <FaPaypal className='w-6 h-6 text-blue-500'/>PayPal Email
          </span>
        </label>
        <div className="flex gap-3">
          <input
            type="email"
            value={paypalId}
            onChange={(e) => setPaypalId(e.target.value)}
            placeholder="your-paypal@email.com"
            className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => handleAdd('paypal')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add PayPal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
