import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClock,
  FaHeart,
  FaMusic,
  FaPlayCircle,
  FaStar,
  FaList,
  FaDownload,
  FaHistory,
  FaHeadphones,
  FaTachometerAlt,
} from "react-icons/fa";
import { FaCircleCheck, FaUser } from "react-icons/fa6";
import { TbFaceIdError } from "react-icons/tb";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [info, setInfo] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [likedSongs, setLikedSongs] = useState(null);
  const [purchasedSongs, setPurchasedSongs] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
    if (!isAuthenticated) {
      dispatch(setloginPopupSong(song));
      dispatch(setShowLoginPopup(true));
    }
  };
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const value = payload[0].value;
    if (value <= 1) return null;
    return (
      <div
        style={{
          backgroundColor: "#2c2f4c",
          border: "1px solid #444",
          padding: 8,
          color: "#fff",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.85em" }}>{label}</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>{`${value} min`}</p>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/v1/like`, {
          withCredentials: true,
        });

        if (res.data) {
          const data = res.data.data; // Get the data property
          const limitedData = data.slice(0, 4); // Limit to 4 songs
          if (limitedData.length > 0) {
            setLikedSongs(limitedData);
          } else {
            setLikedSongs([]);
          }
        } else {
          setLikedSongs([]); //setLikedSongs to empty array
          setError("No data available");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load liked songs"); // More specific error message
        setError("Error fetching data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/v1/user/getPurchasedSong`, {
          withCredentials: true,
        });

        setPurchasedSongs(res.data.songs);
      } catch (error) {
        if (
          error.response &&
          error.response.data?.message === "Unauthorized: You Need to Login"
        ) {
          setErrorMessage("You need to login for this functionality.");
        } else {
          console.error("Error fetching purchased songs:", error);
          toast.error("Failed to fetch purchased songs.");
        }
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}api/v1/userDashbord/getWeeklyActivityStats`,
          {
            withCredentials: true,
          }
        );

        setWeeklyStats(res.data.data);
      } catch (error) {
        if (
          error.response &&
          error.response.data?.message === "Unauthorized: You Need to Login"
        ) {
          setErrorMessage("You need to login for this functionality.");
        } else {
          console.error("Error fetching weekly Stats songs:", error);
          toast.error("Failed to fetch Weekly stats");
        }
      }
    };

    fetchWeeklyStats();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}api/v1/userDashbord/getDashbordInfo`,
          {
            withCredentials: true,
          }
        );
        if (res?.data) {
          setInfo(res.data.data);
        } else {
          setError("No data available");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard info");
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#22d3ee", "#0891b2", "#2dd4bf", "#164e63"];
  return (
    <div className="md:px-4 px-2  py-6 text-white">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-4 px-8 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaTachometerAlt />
          <h1 className="md:text-2xl text-lg font-semibold tracking-tight">
            Dashboard
          </h1>
        </div>
        <button
          onClick={() => navigate("/top_track")}
          className="bg-white text-cyan-500 font-semibold md:py-2 text-sm py-1 px-1 md:px-4 rounded-full hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          Explore More Tracks
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">
          <Loading />
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Cards Section */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Your songs of this month */}
            <div className="bg-[#1b2039] text-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3 text-lg mb-2">
                <FaPlayCircle />
                <h2 className="font-semibold">Your songs of this month</h2>
              </div>

              {info?.allTimeSong?.length == 0 || !info?.allTimeSong ? (
                <div className=" py-4 flex items-center space-x-2">
                  <TbFaceIdError className="text-4xl text-red-300" />
                  <div>
                    <h1 className="text-red-400">No data avaliable</h1>
                    <h2>Currently you didn't have any songs</h2>
                  </div>
                </div>
              ) : (
                <ul className=" space-y-4 ">
                  {info.allTimeSong?.map((data, index) => (
                    <li
                      key={index}
                      className="flex cursor-pointer justify-between border-b border-gray-700 items-center"
                      onClick={() => handleSongClick(data)}
                    >
                      <div className="flex items-center justify-start space-x-2">
                        <img
                          className="w-14 h-14 object-cover rounded"
                          src={data.coverImage}
                          alt={data.title}
                        />
                        <div>
                          <h1 className="font-josefin-m text-sm sm:text-base">
                            {data.title}
                          </h1>
                          <p className="text-sm font-josefin-r whitespace-nowrap">
                            {Array.isArray(data.artist) ? (
                              data.artist.map((artistObj, index) => (
                                <span
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    navigate(`/artist/${artistObj._id}`);
                                  }} // Example click handler
                                  className="cursor-pointer text-gray-400 hover:underline"
                                >
                                  {artistObj.fullName}
                                  {index !== data.artist.length - 1 && ", "}
                                </span>
                              ))
                            ) : (
                              <span>
                                {data.artist?.fullName ||
                                  data.artist ||
                                  "Unaknown Artist"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="font-josefin-m text-sm">{data.duration}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Liked Songs */}
            <div className="bg-[#1b2039] text-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3 text-lg mb-2">
                <FaHeart className="text-red-500" />
                <h2 className="font-semibold">Liked Songs</h2>
              </div>
              {likedSongs?.length == 0 || !likedSongs ? (
                <div className=" py-4 flex items-center space-x-2">
                  <TbFaceIdError className="text-4xl text-red-300" />
                  <div>
                    <h1 className="text-red-400">No data avaliable</h1>
                    <h2>Currently you didn't like any songs</h2>
                  </div>
                </div>
              ) : (
                <ul className=" space-y-4 ">
                  {likedSongs?.map((data, index) => (
                    <li
                      key={index}
                      onClick={() => handleSongClick(data)}
                      className="flex cursor-pointer justify-between border-b border-gray-700 items-center"
                    >
                      <div className="flex items-center justify-start space-x-2">
                        <img
                          className="w-14 h-14 object-cover rounded"
                          src={data.coverImage}
                          alt={data.title}
                        />
                        <div>
                          <h1 className="font-josefin-m text-sm sm:text-base">
                            {data.title}
                          </h1>
                          <p className="text-sm font-josefin-r whitespace-nowrap">
                            {Array.isArray(data.artist) ? (
                              data.artist.map((artistObj, index) => (
                                <span
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    navigate(`/artist/${artistObj._id}`);
                                  }} // Example click handler
                                  className="cursor-pointer text-gray-400 hover:underline"
                                >
                                  {artistObj.fullName}
                                  {index !== data.artist.length - 1 && ", "}
                                </span>
                              ))
                            ) : (
                              <span
                                className="cursor-pointer text-gray-400 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  navigate(`/artist/${data.artist._id}`);
                                }}
                              >
                                {data.artist?.fullName ||
                                  data.artist ||
                                  "Unaknown Artist"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="font-josefin-m text-sm">{data.duration}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Downloaded Songs */}

            <div className="bg-[#1b2039] h-[15rem] relative flex flex-col justify-center items-center text-white rounded-xl p-4 shadow-lg">
              <div className="absolute top-4 left-4 flex justify-start space-x-2">
                <FaUser />
                <h2 className="font-semibold">Top Artist</h2>
              </div>

              <div className=" flex space-y-2 flex-col justify-center justify-items-center items-center">
                <img
                  className="w-24 h-24 object-cover rounded"
                  src="https://wallpapers.com/images/high/the-weeknd-after-hours-1080-x-1920-wallpaper-iydf361hce1jx7k2.webp"
                  alt="Top Artist"
                ></img>
                <h1 className=" font-josefin-r hover:underline cursor-pointer text-center">
                  The Weekend
                </h1>
              </div>
              <button
                onClick={() => navigate("/artists")}
                className="absolute bottom-4 border border-cyan-700 text-cyan-500 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 rounded-2xl p-1 px-2 font-josefin-m"
              >
                Explore More Artist
              </button>
            </div>
          </div>

          {/* Purchased Songs */}
          <div className="my-8">
            <div className="bg-[#1b2039] text-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3 text-lg mb-2">
                <FaCircleCheck className="text-green-500" />
                <h2 className="font-semibold">Purchased Songs</h2>
              </div>
              {!purchasedSongs || purchasedSongs.length == 0 ? (
                <div className=" py-4 flex items-center space-x-2">
                  <TbFaceIdError className="text-4xl text-red-300" />
                  <div>
                    <h1 className="text-red-400">
                      You haven't purchased any songs yet.
                    </h1>
                    <h2>Explore music and purchase songs</h2>
                  </div>
                </div>
              ) : (
                <ul className=" space-y-4 ">
                  {purchasedSongs?.map((data, index) => (
                    <li
                      onClick={() => handleSongClick(data)}
                      key={index}
                      className="flex cursor-pointer justify-between border-b border-gray-700 items-center"
                    >
                      <div className="flex items-center justify-start space-x-2">
                        <img
                          className="w-14 h-14 object-cover rounded"
                          src={data.coverImage}
                          alt={data.title}
                        />
                        <div>
                          <h1 className="font-josefin-m text-sm sm:text-base">
                            {data.title}
                          </h1>
                          <p className="text-sm font-josefin-r whitespace-nowrap">
                            {Array.isArray(data.artist) ? (
                              data.artist.map((artistObj, index) => (
                                <span
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    navigate(`/artist/${artistObj._id}`);
                                  }} // Example click handler
                                  className="cursor-pointer text-gray-400 hover:underline"
                                >
                                  {artistObj.fullName}
                                  {index !== data.artist.length - 1 && ", "}
                                </span>
                              ))
                            ) : (
                              <span
                                className="cursor-pointer text-gray-400 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  navigate(`/artist/${data.artist._id}`);
                                }}
                              >
                                {data.artist?.fullName ||
                                  data.artist ||
                                  "Unaknown Artist"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="font-josefin-m text-sm">{data.duration}</p>
                    </li>
                  ))}
                </ul>
              )}

              <button className="my-5 font-josefin-m border border-cyan-700 text-cyan-500 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 p-2 rounded-2xl">
                <span>Explore & Purchase Songs</span>
              </button>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Genres Pie Chart */}
            {info.topGenre?.length > 0 && (
              <div className="bg-[#1b2039] rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-white">
                  Top Genres
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={info.topGenre
                        .filter((g) => g.genre)
                        .map((g) => ({ name: g.genre.name, value: g.plays }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      fill="#22d3ee"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent === 1
                          ? null
                          : `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {info.topGenre
                        .filter((g) => g.genre)
                        .map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} plays`, name]}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                      }}
                      labelStyle={{ color: "#fff" }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weekly Listening Activity Bar Chart */}
            {weeklyStats?.length > 0 && (
              <div className="bg-[#1b2039] rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-white">
                  Weekly Activity
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={weeklyStats.map((stat) => ({
                      name: new Date(stat.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      }),
                      minutes: stat.minutesSpent,
                    }))}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#ccc"
                      tick={{ fill: "#fff" }}
                    />
                    <YAxis stroke="#ccc" tick={{ fill: "#fff" }} />
                    <Tooltip cursor={false} content={<CustomBarTooltip />} />
                    <Bar dataKey="minutes" fill="#22d3ee" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
