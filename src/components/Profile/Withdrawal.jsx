import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaStripe, FaPaypal, FaPen, FaSave, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;
import StripeOnboardButton from "../StripeOnboardButton";
import { IoShieldCheckmark } from "react-icons/io5";

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
    <div className="max-w-2xl md:mx-auto mx-3 mt-10 p-6 bg-slate-800 text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Withdrawal Method</h2>

      <p className="text-gray-300 mb-4">
        Connect to Yout Stripe Account to start earning.
      </p>
      {user.stripeId ? (
        <div className="flex  gap-2">
          <IoShieldCheckmark className="text-green-500 w-6 h-6" />

          <p className="text-green-500">
            Your Stripe Account Connected Successfully
          </p>
        </div>
      ) : (
        <StripeOnboardButton user={user} />
      )}

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
    </div>
  );
};

export default Withdrawal;
