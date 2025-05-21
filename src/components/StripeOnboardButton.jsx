import React, { useState } from 'react';
import { toast } from 'react-hot-toast';


const apiUrl = import.meta.env.VITE_API_URL;
const StripeOnboardButton = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const handleConnectStripe = async () => {
    if (!user || !user.email || !user._id) {
      toast.error('User not logged in or missing required info');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}api/v1/payment/onboard-artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          userId: user._id,
        }),
      });

      const data = await response.json();
      console.log("Dataaaa",data)

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = data.url; // Redirect to Stripe onboarding
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnectStripe}
      disabled={loading}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Redirecting...' : 'Connect with Stripe'}
    </button>
  );
};

export default StripeOnboardButton;
