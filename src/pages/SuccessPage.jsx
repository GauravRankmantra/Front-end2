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
        const { data } = await axios.get(
          `${apiUrl}api/v1/payment/stripe/session/${sessionId}`,
          { withCredentials: true }
        );
        setSongData(data);

        const purchaseRes = await axios.post(
          `${apiUrl}api/v1/user/addPurchaseSong`,
          { songId: data.songId },
          { withCredentials: true }
        );

        if (purchaseRes.status === 200) {
          // ✅ Redirect to downloads page after successful purchase
          setTimeout(() => {
            navigate("/downloads");
          }, 1500); // optional small delay for user to see success message
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
      {songData ? (
        <div className="mt-4">
          <p>Song ID: {songData.songId}</p>
          <p>Album: {songData?.album?.title}</p>
        </div>
      ) : (
        <p>Loading payment info...</p>
      )}
    </div>
  );
};

export default SuccessPage;
