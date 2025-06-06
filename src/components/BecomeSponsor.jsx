import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaDonate, FaUser, FaEnvelope, FaPhone, FaDollarSign } from 'react-icons/fa'; // Import react-icons
import bgVideo from "../assets/bg.mp4"; 

const apiUrl = import.meta.env.VITE_API_URL;

const stripePromise = loadStripe('pk_test_KCqVsz425oziejiwnrrCEnzL');


const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff', 
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#a0aec0', 
      },
    },
    invalid: {
      color: '#ef4444', 
      iconColor: '#ef4444',
    },
  },
};

function DonationForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); 
    setLoading(true);

    if (!stripe || !elements) {
      setMessage({ type: 'error', text: 'Stripe is not loaded yet. Please try again in a moment.' });
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        setMessage({ type: 'error', text: 'Card details input is missing.' });
        setLoading(false);
        return;
    }

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
      return;
    }

    try {

      const res = await axios.post(`${apiUrl}api/v1/sponsor`, {
        ...form,
        token: token, 
      });

      setMessage({ type: 'success', text: '🎉 Thank you! You became a sponsor successfully.' });
      setForm({ name: '', email: '', phone: '', amount: '' }); 
      cardElement.clear();
    } catch (err) {

      const errorMessage = err.response?.data?.message || 'Donation failed. Please try again or check your details.';
      setMessage({
        type: 'error',
        text: `❌ ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg bg-black/40 backdrop-blur-md shadow-2xl rounded-3xl p-8 space-y-7 border border-cyan-700/50 transform transition-all duration-300 hover:scale-[1.01]"
    >
      <h2 className="text-4xl font-extrabold text-center text-cyan-400 drop-shadow-lg flex items-center justify-center gap-3">
        <FaDonate className="text-cyan-500" /> Become a Sponsor
      </h2>

      <p className="text-center text-gray-200 text-lg">Your contribution makes a difference!</p>

      <div className="grid grid-cols-1 gap-5">
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
          />
        </div>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
          />
        </div>
        <div className="relative">
          <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
          />
        </div>
        <div className="relative">
          <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="amount"
            type="number"
            placeholder="Donation Amount (USD)"
            value={form.amount}
            onChange={handleChange}
            required
            min={1}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="p-4 border-2 border-dashed border-cyan-500/50 bg-cyan-900/20 rounded-xl mb-6 shadow-inner">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {message.text && (
        <div
          className={`flex items-center justify-center gap-2 text-center font-medium rounded-lg py-3 px-5 text-lg transition-all duration-300 ease-in-out ${
            message.type === 'success'
              ? 'bg-green-600/20 text-green-300 border border-green-500'
              : 'bg-red-600/20 text-red-300 border border-red-500'
          }`}
        >
          {message.type === 'success' ? <FaCheckCircle className="text-xl" /> : <FaTimesCircle className="text-xl" />}
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center items-center gap-3 py-3 rounded-lg text-white font-bold text-xl uppercase tracking-wider transition-all duration-300 ease-in-out transform ${
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700 active:scale-95 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin text-xl" />
            Processing...
          </>
        ) : (
          'Make Payment'
        )}
      </button>
    </form>
  );
}

export default function StripeWrapper() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-[40rem] object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for darker background effect and better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-10"></div>

      {/* Donation Form Container */}
      <div className="relative w-full mt-[25rem] max-w-xl my-8 z-20"> {/* Adjusted max-w and removed mt-28 to center better */}
        <Elements stripe={stripePromise}>
          <DonationForm />
        </Elements>
      </div>
    </div>
  );
}