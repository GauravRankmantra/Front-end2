import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PlayCircle, MoreHorizontal, Download } from "lucide-react";
import { addSongToQueue, setIsPlaying } from "../features/musicSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

const DownloadPage = () => {
  const user = useSelector((state) => state.user.user);
  const [songs, setSongs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredSongIndex, setHoveredSongIndex] = useState(null);
  const dispatch = useDispatch();

  const handleMouseEnter = (index) => setHoveredSongIndex(index);
  const handleMouseLeave = () => setHoveredSongIndex(null);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDownload = async (song) => {
    const songId = song._id;
    try {
      const response = await axios.get(`${apiUrl}api/v1/song/isPurchased/${songId}`, {
        withCredentials: true,
      });

      if (response.data.isPurchased) {
        toast.success("Download started");
        const audioResponse = await axios.get(song.audioUrls.high, {
          responseType: "blob",
        });

        const audioBlob = audioResponse.data;
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob);
        downloadLink.href = url;
        downloadLink.download = `${song.title}.mp3`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
      } else {
        toast.error("Download not allowed. Purchase the song first.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data?.message === "Unauthorized: You Need to Login"
      ) {
        toast.error("You need to login for this functionality.");
      } else {
        toast.error("An error occurred while checking purchase status.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/v1/user/getPurchasedSong`, {
          withCredentials: true,
        });

        if (res.data.message === "No purchased songs found") {
          setErrorMessage(
            "You don't have any purchased songs to download. Please purchase a song first."
          );
        } else {
          setSongs(res.data.purchasedSongs);
        }
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

  return (
    <div className="w-full mt-20 mb-6 px-4">
      <h1 className="text-lg pb-2 relative inline-block text-[#3bc8e7]">
        Your Purchased Tracks
        <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
      </h1>

      {errorMessage ? (
        <div className="mt-10 text-red-500 font-medium">{errorMessage}</div>
      ) : (
        <div className="overflow-x-auto h-screen mt-6">
          <table className="table-auto w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4 w-10">#</th>
                <th className="p-4">Song Title</th>
                <th className="p-4">Artist</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Download</th>
                <th className="p-4">More</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition-colors duration-300 ${
                    hoveredSongIndex === index ? "text-cyan-500" : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td className="p-4 w-10">
                    <div
                      onClick={() => {
                        dispatch(addSongToQueue(song));
                        dispatch(setIsPlaying(true));
                      }}
                      className="flex items-center justify-center cursor-pointer"
                    >
                      {hoveredSongIndex === index ? (
                        <PlayCircle className="text-cyan-500 w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                  </td>
                  <td className="p-4">{song.title}</td>
                  <td className="p-4">{song.artist.fullName}</td>
                  <td className="p-4">{formatDuration(song.duration)}</td>
                  <td className="p-4">
                    <Download
                      onClick={() => handleDownload(song)}
                      className="w-5 h-5 hover:text-cyan-500 cursor-pointer transition-colors duration-300"
                    />
                  </td>
                  <td className="p-4">
                    <MoreHorizontal className="w-5 h-5 hover:text-cyan-500 cursor-pointer transition-colors duration-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
