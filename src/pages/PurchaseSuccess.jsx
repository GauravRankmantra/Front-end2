// src/pages/PurchaseSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaFileInvoiceDollar } from "react-icons/fa";
import axios from "axios"; // Assuming you might need to fetch song details or other data
import { useDispatch } from "react-redux";
const apiUrl = import.meta.env.VITE_API_URL; // If you need to fetch additional data
import { updateUser } from "../features/userSlice";
import toast from "react-hot-toast";
const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loadingSong, setLoadingSong] = useState(true);
  const [songTitle, setSongTitle] = useState("Purchased Song");
  const [error, setError] = useState(null);

  // Extract parameters from URL
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  const amountParam = searchParams.get("amount");
  const status = searchParams.get("status");
  const songId = searchParams.get("songId");
  const resultString = searchParams.get("result"); // This will be a stringified JSON
    const dispatch = useDispatch();

  let result = null;
  try {
    if (resultString) {
      result = JSON.parse(decodeURIComponent(resultString));
    }
  } catch (e) {
    console.error("Failed to parse result JSON from URL:", e);
    setError("Failed to process payment details. Some information might be missing.");
  }

  // Extract amount and currency from result.payment if available, otherwise from amountParam
  const displayAmount = result?.payment?.amountMoney?.amount
    ? (parseInt(result.payment.amountMoney.amount) / 100).toFixed(2) // Square amounts are in cents
    : parseFloat(amountParam / 100).toFixed(2); // Fallback, assuming it's also in cents

  const displayCurrency = result?.payment?.amountMoney?.currency || "CAD"; // Default to USD if not found

  const receiptUrl = result?.payment?.receiptUrl;
  const cardBrand = result?.payment?.cardDetails?.card?.cardBrand;
  const last4 = result?.payment?.cardDetails?.card?.last4;

  const isSuccess = status === "COMPLETED";
const addToList=async ()=>{


  const purchaseRes = await axios.post(
            `${apiUrl}api/v1/user/addPurchaseSong`,
            { songId },
            { withCredentials: true }
          );

          if (purchaseRes.status === 200) {
            dispatch(updateUser({ purchasedSongs: [songId] }));
            toast.success("Song added to your purchased library!");
          }
}

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (songId) {
        try {
          const response = await axios.get(`${apiUrl}api/v1/song/${songId}`);
          setSongTitle(response.data.data.title || "Unknown Song");
        } catch (err) {
          console.error("Failed to fetch song details:", err);
          // Don't block the page if song details fail to load
          setSongTitle("Unknown Song (ID: " + songId + ")");
        } finally {
          setLoadingSong(false);
        }
      } else {
        setLoadingSong(false);
      }
    };
    fetchSongDetails();
    addToList()
  }, [songId]);

  if (loadingSong) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center text-gray-700 dark:text-gray-300 text-xl">
          <FaSpinner className="animate-spin mr-3 text-3xl" /> Loading purchase details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 w-full max-w-2xl text-center transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-up">
        {isSuccess ? (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6 animate-bounce-in" />
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Thank you for your purchase of **{songTitle}**!
              Your transaction has been successfully processed.
            </p>
          </>
        ) : (
          <>
            <FaExclamationCircle className="text-red-500 text-6xl mx-auto mb-6 animate-shake" />
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
              Payment Status: {status || "Failed"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              There was an issue processing your payment for **{songTitle}**.
              Please check your details and try again.
              {error && <span className="block mt-2 text-red-400">{error}</span>}
            </p>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <div className="text-gray-700 dark:text-gray-200">
            <p className="font-semibold mb-1">Transaction Details:</p>
            <p>
              <span className="font-medium">Amount:</span>{" "}
              <span className="text-green-600 dark:text-green-400 font-bold">
                {displayAmount} {displayCurrency}
              </span>
            </p>
            {cardBrand && last4 && (
                <p>
                  <span className="font-medium">Card:</span> {cardBrand} (**** **** **** {last4})
                </p>
            )}
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className={`font-bold ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                {status || "N/A"}
              </span>
            </p>
          </div>
          <div className="text-gray-700 dark:text-gray-200">
            <p className="font-semibold mb-1">References:</p>
            <p>
              <span className="font-medium">Payment ID:</span>{" "}
              <span className="break-all">{paymentId || "N/A"}</span>
            </p>
            <p>
              <span className="font-medium">Order ID:</span>{" "}
              <span className="break-all">{orderId || "N/A"}</span>
            </p>
            {result?.payment?.receiptNumber && (
              <p>
                <span className="font-medium">Receipt No.:</span> {result.payment.receiptNumber}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {receiptUrl && (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <FaFileInvoiceDollar className="mr-2" /> View Receipt
            </a>
          )}
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transform transition-all duration-300 hover:scale-105"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;