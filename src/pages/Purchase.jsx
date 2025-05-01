import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import formatDuration from "../utils/formatDuration";
import { useDispatch } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";


import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../features/musicSlice";

const Purchase = () => {
  const [search] = useSearchParams();
  const [songInfo, setSongInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      
    
        const response = await axios.get(`${apiUrl}api/v1/song/${id}`); // Or use query params: `YOUR_API_ENDPOINT?id=${id}`

        setSongInfo(response.data.data);
      } catch (err) {
        setError("Failed to fetch song information. Please try again later.");
        console.error("Fetch error:", err);
        if (err.response) {

          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
          if (err.response.status === 404) {
            setError("Song not found.");
          } else if (err.response.status >= 500) {
            setError("Server error occurred. Please try again later.");
          }
        } else if (err.request) {

          console.error("No response received:", err.request);
          setError("Network error. Please check your internet connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up the request:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongInfo();
  }, [id]);

  const handleBuyNow = async () => {
    const stripe = await loadStripe(
      "pk_test_51RBVXW071DpBkmZmltHiGE9eJOGrGPhJuYmnnH0LvJnTcvRKSpYM6lfh3nFiLNq86VNYhGAllYGHdofP91Nea6ni00RAZf2Tov"
    );

    if (!stripe) {
      console.error("Stripe failed to load");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}api/v1/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // ✅ Wrap the song object in an array
          body: JSON.stringify({ products: [songInfo] }),
        }
      );

      const session = await response.json();

      if (!session.id) {
        console.error("No session ID returned from backend", session);
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  if (loading) {
    return <div>Loading song information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!songInfo) {
    return <div>No song information found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-2xl flex flex-col md:flex-row gap-6 transition-all duration-300">
      {/* Left: Song Image */}
      <div className="relative group w-full md:w-1/3">
        {songInfo?.coverImage ? (
          <img
            src={songInfo.coverImage}
            alt={songInfo.title}
            className="w-full h-64 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AiFillPlayCircle
            className="w-12 h-12 z-10 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => handleSongClick(songInfo)}
          />
        </div>
      </div>

      {/* Right: Song Info */}
      <div className="w-full md:w-2/3 flex flex-col justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">{songInfo.title}</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Artist:</span>{" "}
            {Array.isArray(songInfo?.artist)
              ? songInfo.artist.map((a, index) => (
                  <span key={index}>
                    {a?.fullName || "Unknown Artist"}
                    {index < songInfo.artist.length - 1 && ", "}
                  </span>
                ))
              : songInfo?.artist?.fullName ||
                songInfo?.artistInfo?.fullName ||
                "Unknown Artist"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Album:</span>{" "}
            {songInfo?.album?.title ||
              songInfo?.albumInfo?.title ||
              "Unknown Album"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Genre:</span>{" "}
            {songInfo?.genre?.name || "Unknown Genre"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Duration:</span>{" "}
            {formatDuration(songInfo?.duration) || "N/A"}
          </p>
          <p className="text-xl text-green-600 font-semibold mt-2">
            $ {songInfo?.price.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleBuyNow}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-lg transition-all"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Purchase;
