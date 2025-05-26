import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IoShieldCheckmark } from "react-icons/io5"; // For the success icon

import { FaStripe, FaPaypal, FaPen, FaSave, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;
import StripeOnboardButton from "../StripeOnboardButton";

const Withdrawal = () => {
  const user = useSelector((state) => state.user.user);

  const [stripeId, setStripeId] = useState(user?.stripeId || "");
  const [paypalId, setPaypalId] = useState(user?.paypalId || "");
  const dispatch = useDispatch();
  const [isEditingStripe, setIsEditingStripe] = useState(!user?.stripeId);
  const [isEditingPaypal, setIsEditingPaypal] = useState(!user?.paypalId);

  const [loadingField, setLoadingField] = useState(null); // 'stripe' | 'paypal'
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setSuccess("");
    setError("");
  };

  const handleSave = async (type) => {
    resetMessages();
    setLoadingField(type);

    const payload = type === "stripe" ? { stripeId } : { paypalId };

    try {
      await axios.put(`${apiUrl}api/v1/user/withdrawal`, payload, {
        withCredentials: true,
      });
      dispatch(updateUser(payload));

      setSuccess(`${type.toUpperCase()} ID saved successfully.`);
      if (type === "stripe") setIsEditingStripe(false);
      if (type === "paypal") setIsEditingPaypal(false);
    } catch (err) {
      setError("Failed to save. Please try again later.");
    } finally {
      setLoadingField(null);
    }
  };

  const handleDelete = async (type) => {
    resetMessages();
    setLoadingField(type);
    try {
      await axios.delete(`${apiUrl}api/v1/user/withdrawal?method=${type}`, {
        withCredentials: true,
      });
      const emptyPayload =
        type === "stripe" ? { stripeId: "" } : { paypalId: "" };
      dispatch(updateUser(emptyPayload));

      if (type === "stripe") {
        setStripeId("");
        setIsEditingStripe(true);
      }
      if (type === "paypal") {
        setPaypalId("");
        setIsEditingPaypal(true);
      }

      setSuccess(`${type.toUpperCase()} ID removed successfully.`);
    } catch (err) {
      setError("Failed to delete. Please try again.");
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <>
      <div className="max-w-2xl font-josefin-r md:mx-auto mx-2 mt-10 p-8 bg-gray-800 text-white shadow-xl rounded-xl border border-gray-700">
        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold text-white flex-grow">
            <span className="mr-3">💰</span> Withdrawal Method
          </h2>
          {user.stripeId && (
            <div className="flex items-center text-green-400">
              <IoShieldCheckmark className="w-7 h-7 mr-2" />
              <span className="text-lg font-semibold">Connected</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 mb-6 border-b border-gray-700 pb-6">
          Securely manage your earnings by connecting a trusted payout method.
          Stripe ensures reliable and timely transfers of your revenue.
        </p>

        {user.stripeId ? (
          <div className="bg-green-700 bg-opacity-30 border border-green-600 p-4 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center">
              <IoShieldCheckmark className="text-green-400 w-8 h-8 mr-4 flex-shrink-0" />
              <div>
                <p className="text-green-300 text-lg font-semibold">
                  Your Stripe Account is Connected!
                </p>
                <p className="text-green-200 text-sm mt-1">
                  You're all set to receive payouts. Funds will be transferred
                  to your connected bank account according to your Stripe
                  settings.
                </p>
              </div>
            </div>
            {/* Optionally add a button to manage Stripe account here */}
            {/* <button className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-sm font-medium">
            Manage Stripe
          </button> */}
          </div>
        ) : (
          <div className="bg-red-700 bg-opacity-30 border border-red-600 p-4 rounded-lg animate-fade-in">
            <p className="text-red-300 text-lg font-semibold mb-3">
              Connect Your Stripe Account to Start Earning!
            </p>
            <p className="text-red-200 text-sm mb-5">
              A Stripe account is essential for processing your sales and
              facilitating secure withdrawals. This step is required before you
              can receive any payouts.
            </p>
            <StripeOnboardButton user={user} />
            <p className="text-gray-400 text-xs mt-4">
              Don't worry, the connection process is quick and secure, handled
              directly by Stripe.
            </p>
          </div>
        )}

        <div className="mt-8 text-gray-400 text-sm border-t border-gray-700 pt-6">
          <h3 className="font-semibold text-lg mb-2 text-white">
            Payout Information:
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Payouts are processed via Stripe, a secure payment gateway.</li>
            <li>
              Funds will be transferred to the bank account linked with your
              Stripe account.
            </li>
            <li>
              Standard payout schedules (e.g., daily, weekly, monthly) are
              managed within your Stripe dashboard.
            </li>
            <li>
              Ensure your Stripe account details are up-to-date to avoid delays
              in receiving funds.
            </li>
          </ul>
        </div>
      </div>

      {/* {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>
      )}

     
      <div className="mb-6">
        <label className="text-sm font-medium flex items-center gap-2 mb-2">
          <FaStripe className="text-blue-400" /> Stripe ID
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={stripeId}
            onChange={(e) => setStripeId(e.target.value)}
            disabled={!isEditingStripe}
            placeholder="acct_123abc..."
            className={`flex-1 px-4 py-2 rounded border focus:ring-indigo-500 focus:border-indigo-500 text-black ${
              isEditingStripe ? "" : "bg-gray-200"
            }`}
          />
          {isEditingStripe ? (
            <button
              onClick={() => handleSave("stripe")}
              disabled={loadingField === "stripe" || !stripeId}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loadingField === "stripe" ? "Saving..." : <FaSave />}
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditingStripe(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                <FaPen />
              </button>
              <button
                onClick={() => handleDelete("stripe")}
                disabled={loadingField === "stripe"}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>


      <div>
        <label className="text-sm font-medium flex items-center gap-2 mb-2">
          <FaPaypal className="text-blue-400" /> PayPal Email
        </label>

        <div className="flex gap-2">
          <input
            type="email"
            value={paypalId}
            onChange={(e) => setPaypalId(e.target.value)}
            disabled={!isEditingPaypal}
            placeholder="you@example.com"
            className={`flex-1 px-4 py-2 rounded border focus:ring-blue-500 focus:border-blue-500 text-black ${
              isEditingPaypal ? "" : "bg-gray-200"
            }`}
          />
          {isEditingPaypal ? (
            <button
              onClick={() => handleSave("paypal")}
              disabled={loadingField === "paypal" || !paypalId}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingField === "paypal" ? "Saving..." : <FaSave />}
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditingPaypal(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                <FaPen />
              </button>
              <button
                onClick={() => handleDelete("paypal")}
                disabled={loadingField === "paypal"}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div> */}
    </>
  );
};

export default Withdrawal;
