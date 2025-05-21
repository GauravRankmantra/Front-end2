import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const SellerStats = ({ sellerId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}api/v1/userDashbord/seller-stats/${sellerId}`
        );
        setStats(data.data);
      } catch (err) {
        setError("Failed to load seller stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) fetchStats();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium py-8">{error}</div>
    );
  }

  if (!stats || stats.songs.length === 0) {
    return (
      <div className="w-full text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">No Sales Yet</h2>
        <p className="text-gray-500 mt-2">
          Your earnings and sales will appear here once you start selling songs.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-14">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <p className="mt-2">Here’s your sales performance overview.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white text-indigo-700 rounded-lg p-4 shadow">
            <h3 className="text-lg font-medium">Total Earnings</h3>
            <p className="text-2xl font-bold mt-1">
              ${stats.totalSellerEarnings.toFixed(2)}
            </p>
          </div>
          <div className="bg-white text-indigo-700 rounded-lg p-4 shadow">
            <h3 className="text-lg font-medium">Total Songs Sold</h3>
            <p className="text-2xl font-bold mt-1">{stats.totalSongsSold}</p>
          </div>
        </div>
      </div>

      <div className=" ">
        {stats.songs.map((song) => (
          <div
            key={song.songId}
            className="bg-white flex items-center justify-between rounded-lg p-5 border-black shadow border hover:shadow-lg transition"
          >
            <div className="flex gap-2 items-center">
              <img src={song.coverImage} className="w-16 h-16 object-cover"></img>
              <div className="text-gray-700">
                {" "}
                <h3 className="text-xl font-semibold text-gray-800">
                  {song.songTitle}
                </h3>
                <p>
                  Total Sales:{" "}
                  <span className="font-medium">{song.totalSales}</span>
                </p>
              </div>
            </div>


            <p >
              Earnings:{" "}
              <span className="font-medium text-green-600">
                ${song.totalEarnings.toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerStats;
