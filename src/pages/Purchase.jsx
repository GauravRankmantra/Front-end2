import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import { useDispatch, useSelector } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

import {
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../features/musicSlice";
import Loading from "../components/Loading";
import { FaSpinner } from "react-icons/fa6";

const Purchase = () => {
  const [search] = useSearchParams();
  const [songInfo, setSongInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false); // Specific loading for Stripe
  const [squareLoading, setSquareLoading] = useState(false); // Specific loading for Square
  const [showSquareForm, setShowSquareForm] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  const id = search.get("id");
  const dispatch = useDispatch();

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));
    dispatch(setIsPlaying(true));
  };

  useEffect(() => {
    const fetchSongInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}api/v1/song/${id}`);
        setSongInfo(response.data.data);
      } catch (err) {
        let errorMessage = "Failed to fetch song information. Please try again later.";
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = "Song not found.";
          } else if (err.response.status >= 500) {
            errorMessage = "Server error occurred. Please try again later.";
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your internet connection.";
        }
        setError(errorMessage);
        toast.error(errorMessage); // Display error notification
      } finally {
        setLoading(false);
      }
    };

    fetchSongInfo();
  }, [id]);



  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    const stripe = await loadStripe("pk_test_KCqVsz425oziejiwnrrCEnzL");

    if (!stripe) {
      console.error("Stripe failed to load");
      toast.error("Stripe payment service is unavailable. Please try again later.");
      setStripeLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}api/v1/payment/create-checkout-session-admin`, // Using the admin checkout for simplicity as per your existing code
        {
          products: [
            {
              _id: songInfo._id,
              title: songInfo.title,
              price: songInfo.price,
              coverImage: songInfo.coverImage || "https://link-to-image.com",
              artist: {
                stripeId: songInfo?.artist[0]?.stripeId,
              },
              album: {
                title: songInfo?.album?.title || "Unknown",
              },
            },
          ],
        }
      );

      const session = response.data;

      if (!session?.id) {
        console.error("No session ID returned from backend", session);
        toast.error("Failed to create Stripe checkout session. Please try again.");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
        toast.error(`Stripe redirect error: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Stripe Payment Error:", error?.response?.data?.error || error.message);
      toast.error(error?.response?.data?.error || "Failed to initiate Stripe payment.");
    } finally {
      setStripeLoading(false);
    }
  };

  if (!isAuthenticated)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            Please log in to purchase this song.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Error!</h1>
          <p className="text-gray-700 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!songInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Song Not Found</h1>
          <p className="text-gray-600 mb-8">
            The song you are looking for could not be found.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const isAlreadyPurchased = user?.purchasedSongs?.includes(songInfo._id);

  return (
    <div className="max-w-6xl mx-auto mt-16 p-8 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row gap-8 animate-fade-in-up">
      {/* Left: Song Image */}
      <div className="relative group w-full md:w-2/5 flex-shrink-0">
        {songInfo?.coverImage ? (
          <img
            src={songInfo.coverImage}
            alt={songInfo.title}
            className="w-full h-80 object-cover rounded-2xl shadow-lg transition-transform duration-300 transform group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-500 text-lg font-medium shadow-lg">
            No Cover Art Available
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40 rounded-2xl">
          <AiFillPlayCircle
            className="w-16 h-16 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110 active:scale-95"
            onClick={() => handleSongClick(songInfo)}
            title="Listen to a preview"
          />
        </div>
      </div>

      {/* Right: Song Info and Purchase Options */}
      <div className="w-full md:w-3/5 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {songInfo.title}
          </h2>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Artist:</span>{" "}
            {Array.isArray(songInfo?.artist)
              ? songInfo.artist.map((a, index) => (
                <span key={index} className="hover:text-blue-600 transition-colors cursor-pointer">
                  {a?.fullName || "Unknown Artist"}
                  {index < songInfo.artist.length - 1 && ", "}
                </span>
              ))
              : songInfo?.artist?.fullName ||
              songInfo?.artistInfo?.fullName ||
              "Unknown Artist"}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Album:</span>{" "}
            {songInfo?.album?.title || songInfo?.albumInfo?.title || "Unknown Album"}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Genre:</span>{" "}
            {songInfo?.genre?.name || "Unknown Genre"}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Duration:</span>{" "}
            {songInfo?.duration || "N/A"}
          </p>
          {songInfo.price ? (
            <p className="text-4xl text-green-700 font-bold mt-4">
              $ {songInfo?.price?.toFixed(2)}
            </p>
          ) : (
            <p className="text-4xl text-green-700 font-bold mt-4">$ 0.00</p>
          )}
        </div>

        {isAlreadyPurchased ? (
          <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center animate-fade-in">
            <p className="font-semibold text-lg">
              This song is already in your purchased list!
            </p>
            <button
              onClick={() => handleSongClick(songInfo)}
              className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300 shadow-md"
            >
              Play Now
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4 mt-8">
            {songInfo?.artist[0]?.paypalId ||
              songInfo?.artist[0]?.stripeId ||
              songInfo?.artist[0]?.admin ? (
              <>
                <button
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading || squareLoading} // Disable if any payment is loading
                  className={`w-full flex items-center justify-center px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-lg
                    ${stripeLoading || squareLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white transform hover:scale-105 active:scale-100"
                    }`}
                >
                  {stripeLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" /> Processing with Stripe...
                    </>
                  ) : (
                    "Buy Now with Stripe"
                  )}
                </button>

                <button
                  onClick={() => setShowSquareForm(true)}
                  disabled={stripeLoading || squareLoading || showSquareForm} // Disable if any payment is loading or form is shown
                  className={`w-full flex items-center justify-center px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-lg
                    ${stripeLoading || squareLoading || showSquareForm
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white transform hover:scale-105 active:scale-100"
                    }`}
                >
                  {squareLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" /> Processing with Square...
                    </>
                  ) : (
                    "Pay with Square"
                  )}
                </button>
              </>
            ) : (
              <div className="p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg text-center animate-fade-in">
                <p className="font-semibold text-lg">
                  Payment options for this artist are not yet set up. Please check back later!
                </p>
              </div>
            )}
          </div>
        )}

        {showSquareForm && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200 animate-slide-down">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Enter Card Details
            </h3>
            <PaymentForm
              applicationId={"sandbox-sq0idb-BVCpFrvZnGqXBnLKNUVc7w"}
              locationId={"LJ9W5RMXJR33C"}
              // In your Purchase component (the parent)
              cardTokenizeResponseReceived={async (tokenResult) => {
                try {
                  const token = tokenResult.token;

                  const response = await axios.post(`${apiUrl}api/v1/payment/submitSquarePayment`, {
                    sourceId: token,
                    product: {
                      price: songInfo.price,
                      title: songInfo.title,
                      _id: songInfo._id,
                    },
                    buyerEmail: user?.email,
                  });

                  const { paymentId, orderId, amount, status, result } = response.data;

                  // --- FIX IS HERE ---
                  // Stringify the 'result' object and then URI encode it
                  const encodedResult = encodeURIComponent(JSON.stringify(result));

                  // Redirect to purchase-success with relevant info
                  navigate(
                    `/purchase-success?paymentId=${paymentId}&orderId=${orderId}&amount=${amount.amount}&status=${status}&songId=${songInfo._id}&result=${encodedResult}`
                  );
                } catch (err) {
                  console.error("Error submitting payment:", err.response?.data || err.message);
                  alert("Payment failed. Please try again.");
                }
              }}

            >
              <CreditCard />
            </PaymentForm>
            <button
              onClick={() => setShowSquareForm(false)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-lg transition-all shadow-md"
            >
              Cancel Square Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;