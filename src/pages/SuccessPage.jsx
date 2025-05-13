import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [songData, setSongData] = useState(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // 1. Get Stripe session details
        const { data } = await axios.get(
          `${apiUrl}api/v1/payment/stripe/session/${sessionId}`,
          { withCredentials: true }
        );
        setSongData(data);

        // 2. Fetch song details using songId from session
        const res = await axios.get(`${apiUrl}api/v1/song/${data.songId}`);
        const song = res.data.data;

        const songId = song._id;
        const price = song.price;

        // 3. Extract artistIds
        let artistIds = [];
        if (Array.isArray(song.artist)) {
          artistIds = song.artist.map((a) => a._id);
        } else if (typeof song.artist === "object" && song.artist?._id) {
          artistIds = [song.artist._id];
        }

        // 4. Update purchase stats
        try {
          await axios.post(`${apiUrl}api/v1/userStats/addPurchaseStats`, {
            songId,
            artistIds,
          });
        } catch (err) {
          console.error("Error adding purchase stats", err);
        }

        // 5. Update revenue stats
        try {
          await axios.post(`${apiUrl}api/v1/userStats/addRevenueStats`, {
            price,
            artistIds,
          });
        } catch (err) {
          console.error("Error adding revenue stats", err);
        }

        // 6. Add purchased song to user profile
        try {
          const purchaseRes = await axios.post(
            `${apiUrl}api/v1/user/addPurchaseSong`,
            { songId },
            { withCredentials: true }
          );

          if (purchaseRes.status === 200) {
            // Navigate after a short delay
            setTimeout(() => navigate("/downloads"), 200);
          }
        } catch (err) {
          console.error("Error saving purchased song", err);
        }
      } catch (err) {
        console.error("Error processing payment session:", err);
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId, navigate]);

  return (
    <div className="p-8 m-10">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
      {songData ? (
        <div className="mt-4 text-white">
          <p>Song ID: {songData.songId}</p>
          <p>Album: {songData?.album?.title || "N/A"}</p>
        </div>
      ) : (
        <p className="text-white">Loading payment info...</p>
      )}
    </div>
  );
};

export default SuccessPage;
