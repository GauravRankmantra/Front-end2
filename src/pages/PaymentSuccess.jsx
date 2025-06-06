import React from "react";
import {
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaDownload,
  FaMusic,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const { paymentInfo, songData } = location.state || {};

  console.log(paymentInfo)
  console.log(songData)
  if (paymentInfo == null || !paymentInfo)
    return (
      <div>
        <h1 className="text-2xl text-red-500">unauthorize access</h1>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-900 text-white flex mt-20 items-center justify-center p-4 sm:p-8 font-josefin-sb">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-10 max-w-2xl w-full text-center border border-green-500/50 relative overflow-hidden">
        {/* Confetti-like background element (simplified) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute w-20 h-20 bg-green-500 rounded-full animate-pulse top-5 left-10"></div>
          <div className="absolute w-16 h-16 bg-blue-500 rounded-full animate-pulse bottom-10 right-10 animation-delay-500"></div>
          <div className="absolute w-12 h-12 bg-purple-500 rounded-full animate-pulse top-1/2 left-1/4 animation-delay-1000"></div>
        </div>

        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6 animate-bounce" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-400 mb-4 drop-shadow-lg">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-prose mx-auto">
          Your purchase has been completed successfully. Thank you for your
          support!
        </p>

        {/* Payment Summary Section */}
        {paymentInfo && (
          <div className="bg-gray-700 p-4 sm:p-6 rounded-md mb-8 text-left shadow-inner border border-gray-600">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4">
              Order Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
              <p>
                <strong>Amount Paid:</strong>{" "}
                <span className="text-green-300">
                  {paymentInfo?.amountReceived}{" "}
                  {paymentInfo?.currency?.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                <span className="text-gray-300 break-words">
                  {paymentInfo?.paymentIntentId}
                </span>
              </p>
              <p>
                <strong>Receipt:</strong>
                {paymentInfo?.receiptUrl ? (
                  <a
                    href={paymentInfo.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 mt-1 sm:mt-0"
                  >
                    View Receipt{" "}
                    <FaFileInvoiceDollar className="inline-block ml-1" />
                  </a>
                ) : (
                  <span className="text-red-400">N/A</span>
                )}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span className="text-green-300">Completed</span>
              </p>
            </div>
          </div>
        )}

        {/* Song Information Section */}
        {songData && (
          <div className="bg-gray-700 p-4 sm:p-6 rounded-md mb-8 text-left shadow-inner border border-gray-600">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4">
              Purchased Song
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={songData?.coverImage}
                alt={songData.title}
                className="w-20 h-20 rounded-md object-cover flex-shrink-0 border border-gray-600"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {songData?.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {songData.artistDetails
                    ?.map((artist) => artist.fullName)
                    .join(", ") ||
                    songData.artist
                      ?.map((artist) => artist.fullName)
                      .join(", ")}
                </p>
                <p className="text-gray-400 text-xs">
                  Album: {songData.album?.title || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/purchased-tracks"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaDownload /> Go to Purchased Songs
          </Link>
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaMusic /> Continue Browse
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <MdOutlineDashboard /> Go to Dashboard
            </Link>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-8">
          If you have any questions, please contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
