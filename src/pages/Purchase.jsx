import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import { useDispatch, useSelector } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";

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
  const [btnloading, setBtnLoading] = useState(false);
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
    setBtnLoading(true);
    const stripe = await loadStripe("pk_test_KCqVsz425oziejiwnrrCEnzL");

    if (!stripe) {
      console.error("Stripe failed to load");
      setBtnLoading(false);
      return;
    }
    // https://dashboard.stripe.com/test/connect/onboarding
    try {
      const response = await axios.post(
        `${apiUrl}api/v1/payment/create-checkout-session`,
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
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
      }
    } catch (error) {
      console.error(
        "Payment Error:",
        error?.response?.data?.error || error.message
      );
    }
  };

  const handleBuyNow2 = async () => {
    setBtnLoading(true);
    const stripe = await loadStripe("pk_test_KCqVsz425oziejiwnrrCEnzL");

    if (!stripe) {
      console.error("Stripe failed to load");
      setBtnLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}api/v1/payment/create-checkout-session-admin`,
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

   //-> enable this when artist payment is done by admin stripe dashbord(enable connect functionality) 
  const handelBuy = () => {
    // if (songInfo?.artist[0]?.admin) {
      handleBuyNow2();
    // } else {
    //   handleBuyNow();
    // }
  };

  if (!isAuthenticated)
    return (
      <div className="max-w-5xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-2xl flex flex-col  gap-6 transition-all duration-300">
        <h1 className="mt-16 text-black text-2xl text-center">
          Login To Buy This song{" "}
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-cyan-500 p-2 rounded-lg text-white "
        >
          Login
        </button>
      </div>
    );
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!songInfo) {
    return <div>No song information found.</div>;
  }
  // if (user?.purchasedSongs?.includes(songInfo._id)) {
  //   return (
  //     <div>
  //       <h1>Song already purchased by you</h1>
  //     </div>
  //   );
  // }

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
            {songInfo?.duration || "N/A"}
          </p>
          {songInfo.price ? (
            <p className="text-xl text-green-600 font-semibold mt-2">
              $ {songInfo?.price?.toFixed(2)}
            </p>
          ) : (
            <p className="text-xl text-green-600 font-semibold mt-2">$ 0</p>
          )}
        </div>

        {user?.purchasedSongs?.includes(songInfo._id) ? (
          <div className="text-red-500">
            Song Alredy Exist in your purchase list !
          </div>
        ) : (
          <div className="w-full">
            {songInfo?.artist[0]?.paypalId ||
            songInfo?.artist[0]?.stripeId ||
            songInfo?.artist[0]?.admin ? (
              <button
                onClick={handelBuy}
                className="mt-6 w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-lg transition-all"
              >
                {!btnloading ? (
                  <span>Buy Now</span>
                ) : (
                  <FaSpinner className="animate-spin" />
                )}
              </button>
            ) : (
              <h1>
                Try again after some time , (artist not added payment info)
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;
