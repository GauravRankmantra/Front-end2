import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { updateUser } from "../features/userSlice";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [songData, setSongData] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.user.user?._id);
  const sellerSharePercentage = 0.7;

  useEffect(() => {
    const recordSale = async () => {
      try {
        if (!paymentInfo || !songData || !userId) return;

        const sellerId = songData?.artist?.[0]?._id;
        if (!sellerId) {
          console.error("❌ Seller ID not found.");
          return;
        }
        const admin = songData?.artist[0]?.admin;

        const {
          total_amount,
          stripe_fee,
          net_amount,
          charge_id,
          currency,
          payment_intent_id,
        } = paymentInfo;

        let sellerEarning = 0;
        let adminEarning = 0;

        if (!admin) {
          sellerEarning = parseFloat(
            (total_amount * sellerSharePercentage).toFixed(2)
          );
          adminEarning = parseFloat(
            (total_amount - sellerEarning - stripe_fee).toFixed(2)
          );
        } else {
          sellerEarning = 0;
          adminEarning = parseFloat((total_amount - stripe_fee).toFixed(2));
        }

        const saleData = {
          songId: songData._id,
          buyerId: userId,
          sellerId,
          amountPaid: total_amount,
          platformShare: stripe_fee,
          sellerEarning,
          adminEarning,
          currency,
          stripeId: payment_intent_id,
          amountReceved: net_amount,
          stripeChargeId: charge_id,
        };

        const res = await axios.post(`${apiUrl}api/v1/sale`, saleData, {
          withCredentials: true,
        });

        if (res.status === 201) {
          toast.success("Sale recorded successfully");
        }
      } catch (err) {
        console.error("❌ Error recording sale:", err);
        toast.error("Failed to record sale.");
      }
    };

    recordSale();
  }, [paymentInfo, songData, userId]);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) return;

      try {
        const { data } = await axios.get(
          `${apiUrl}api/v1/payment/stripe/session/${sessionId}`,
          { withCredentials: true }
        );

        setPaymentInfo(data.paymentInfo);

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
        }

        // Stats: Revenue
        try {
          const earning = parseFloat(
            (data.paymentInfo.total_amount * sellerSharePercentage).toFixed(2)
          );
          await axios.post(`${apiUrl}api/v1/userStats/addRevenueStats`, {
            price: earning,
            artistIds,
          });
        } catch (err) {
          console.error("❌ Error adding revenue stats:", err);
        }

        // Add to user's purchased songs
        try {
          const purchaseRes = await axios.post(
            `${apiUrl}api/v1/user/addPurchaseSong`,
            { songId },
            { withCredentials: true }
          );

          if (purchaseRes.status === 200) {
            dispatch(updateUser({ purchasedSongs: [songId] }));
            toast.success("Song added to your purchases");
            setTimeout(() => navigate("/downloads"), 100);
          }
        } catch (err) {
          console.error("❌ Error saving purchased song:", err);
          toast.error("Failed to add song to your purchases");
        }
      } catch (err) {
        console.error("❌ Error processing session:", err);
        toast.error("Invalid session or payment failed");
      }
    };

    fetchSessionData();
  }, [sessionId, navigate]);

  if (!isAuthenticated)
    return (
      <div className="flex justify-center items-center flex-col gap-5">
        <h1 className="mt-16 text-red-500 text-center">
          UnAuthorize Access, Login to access this page{" "}
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-cyan-500 p-2 rounded-lg text-white "
        >
          Login
        </button>
      </div>
    );

  return (
    <div className="p-8 m-10">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>

      {songData ? (
        <div className="mt-4 text-white">
          <p>Song ID: {songData._id}</p>
          <p>Album: {songData?.album?.title || "N/A"}</p>
        </div>
      ) : (
        <p className="text-white animate-pulse">Loading payment info...</p>
      )}
    </div>
  );
};

export default SuccessPage;
