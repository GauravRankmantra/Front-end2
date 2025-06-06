import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom"; // Import Link
import { updateUser } from "../features/userSlice";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

// Import icons for a better look
import {
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaDownload,
  FaMusic,
  FaCreditCard,
  FaHourglassHalf,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";

const apiUrl = import.meta.env.VITE_API_URL;

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [songData, setSongData] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [receiptUrl, setreceiptUrl] = useState();
  const [loading, setLoading] = useState(true); // New loading state
  const [error, setError] = useState(null); // New error state for the page itself
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.user.user?._id);
  const sellerSharePercentage = 0.7;

  useEffect(() => {
    const recordSale = async () => {
      if (!paymentInfo || !songData || !userId) {
        setLoading(false);
        return;
      }

      const sellerId = songData?.artist?.[0]?._id;
      if (!sellerId) {
        console.error("❌ Seller ID not found.");
        setError("Seller information missing. Please contact support.");
        setLoading(false);
        return;
      }

      const admin = songData?.artist[0]?.admin;

      const {
        paymentIntentId,
        customerFacingAmount,
        customerFacingCurrency,
        amountReceived,
        paymentStatus,
        paymentMethodType,
        receiptEmail,
        createdTimestamp,
        createdDateTime,
        latestChargeId,
        description,
        customer,
        captureMethod,
        balanceTransactionId,
        processedAmount,
        processedCurrency,
        netAmount,
        feeAmount,
        feeCurrency,
        exchangeRate,
        originalCurrency,
        convertedCurrency,
        balanceType,
        availableOnTimestamp,
        availableOnDateTime,
        transactionCreatedTimestamp,
        transactionCreatedDateTime,
        reportingCategory,
        transactionStatus,
        transactionType,
        feeDetails,
        receiptUrl,
      } = paymentInfo;

      let sellerEarning = 0;
      let adminEarning = 0;
      //stripe first convert to CAD then split

      //-> enable this when artist payment is done by admin stripe dashbord(enable connect functionality)
      // if (!admin) {
      //   sellerEarning = parseFloat(
      //     (+processedAmount * sellerSharePercentage).toFixed(2)
      //   );
      //   adminEarning = parseFloat(
      //     (+processedAmount - sellerEarning - feeAmount).toFixed(2)
      //   );
      // } else {
      sellerEarning = 0;
      adminEarning = parseFloat((+processedAmount - feeAmount).toFixed(2));
      // }

      const saleData = {
        songId: songData._id,
        buyerId: userId,
        sellerId,
        paymentIntentId,
        customerFacingAmount,
        customerFacingCurrency,
        amountReceived,
        paymentStatus,
        paymentMethodType,

        receiptEmail,
        createdTimestamp,
        createdDateTime,
        latestChargeId,
        description,
        customer,
        captureMethod,
        balanceTransactionId,
        processedAmount,
        processedCurrency,
        netAmount,
        feeAmount,
        feeCurrency,
        exchangeRate,
        originalCurrency,
        convertedCurrency,
        balanceType,
        availableOnTimestamp,
        availableOnDateTime,
        transactionCreatedTimestamp,
        transactionCreatedDateTime,
        reportingCategory,
        transactionStatus,
        transactionType,
        feeDetails,
        sellerEarning,
        adminEarning,
        receiptUrl,
      };

      try {
        const res = await axios.post(`${apiUrl}api/v1/sale`, saleData, {
          withCredentials: true,
        });

        if (res.status === 201) {
          toast.success("✅ Sale recorded successfully!");
        }
      } catch (err) {
        console.error("❌ Error recording sale:", err);
        toast.error("Failed to record sale. Please contact support.");
        setError(
          "There was an issue recording the sale. Please contact support."
        );
      } finally {
        setLoading(false);
      }
    };

    recordSale();
  }, [paymentInfo, songData, userId, sellerSharePercentage]);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setLoading(false);
        setError("No session ID found. Payment status unknown.");
        return;
      }

      try {
        const { data } = await axios.get(
          `${apiUrl}api/v1/payment/stripe/session/${sessionId}`,
          { withCredentials: true }
        );

        setPaymentInfo(data);
        console.log("payment info", data);
        setreceiptUrl(data?.receipt?.receiptUrl);

        const songRes = await axios.get(`${apiUrl}api/v1/song/${data.songId}`);
        const song = songRes.data.data;
        setSongData(song);

        const songId = song._id;

        let artistIds = [];
        if (Array.isArray(song.artist)) {
          artistIds = song.artist.map((a) => a._id);
        } else if (typeof song.artist === "object" && song.artist?._id) {
          artistIds = [song.artist._id];
        }

        // Stats: Purchase
        try {
          await axios.post(`${apiUrl}api/v1/userStats/addPurchaseStats`, {
            songId,
            artistIds,
          });
        } catch (err) {
          console.error("❌ Error adding purchase stats:", err);
          toast.error("Failed to update purchase statistics.");
        }

        const isArtistAdmin = song.artist?.[0]?.admin;
        if (!isArtistAdmin && artistIds.length > 0) {
          try {
            const earningForStats = parseFloat(
              (data.processedAmount * sellerSharePercentage).toFixed(2)
            );
            await axios.post(`${apiUrl}api/v1/userStats/addRevenueStats`, {
              price: earningForStats,
              artistIds,
            });
          } catch (err) {
            console.error("❌ Error adding revenue stats:", err);
            toast.error("Failed to update revenue statistics for artist.");
          }
        }

        try {
          const purchaseRes = await axios.post(
            `${apiUrl}api/v1/user/addPurchaseSong`,
            { songId },
            { withCredentials: true }
          );

          if (purchaseRes.status === 200) {
            dispatch(updateUser({ purchasedSongs: [songId] }));
            toast.success("Song added to your purchased library!");
          }
        } catch (err) {
          console.error("❌ Error saving purchased song:", err);
          toast.error("Failed to add song to your purchases.");
        }
      } catch (err) {
        console.error("❌ Error processing session:", err);
        toast.error(
          "Invalid session or payment failed. Please try again or contact support."
        );
        setError(
          "Payment verification failed. Please contact support if you were charged."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSessionData();
    } else {
      setLoading(false);
    }
  }, [sessionId, navigate, dispatch, isAuthenticated, sellerSharePercentage]);

  if (paymentInfo?.paymentStatus === "succeeded" && songData) {
    console.log("song data befor navigate ", songData);
    navigate("/payment-success", { state: { paymentInfo, songData } });
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold text-red-500 mb-4 text-center">
          Unauthorized Access
        </h1>
        <p className="text-lg text-gray-300 mb-6 text-center">
          You need to be logged in to view this page.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
        >
          Login Now
        </button>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold text-red-500 mb-4 text-center">
          Payment Processing Error
        </h1>
        <p className="text-lg text-gray-300 mb-6 text-center">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className=" rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 max-w-lg w-full text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <div className="mb-6">
          <FaCreditCard className="text-cyan-500 text-6xl mx-auto mb-4" />{" "}
          {/* Large icon, centered */}
          <h1 className="text-4xl font-extrabold text-gray-200 mb-2 leading-tight">
            Processing Your Payment...
          </h1>
          <p className="text-lg text-gray-100 mb-4">
            Please wait a moment while we securely finalize your transaction.
          </p>
          <p className="text-red-500 font-semibold text-base flex items-center justify-center">
            <FaHourglassHalf className="mr-2 text-xl" />
            Important: Do not refresh this page or close your browser.
          </p>
        </div>
        <Loading /> {/* Your simple spinner component */}
        {/* Optional: Add a small reassuring message or tips */}
        <p className="text-sm text-gray-100 mt-6">
          This may take a few seconds. We appreciate your patience.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
