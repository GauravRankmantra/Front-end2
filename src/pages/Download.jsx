import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { PlayCircle, Heart, MoreHorizontal, Download } from "lucide-react";
import { addSongToQueue, setIsPlaying } from "../features/musicSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const apiUrl = import.meta.env.VITE_API_URL;

const DownloadPage = () => {
  const user = useSelector((state) => state.user.user);
  const [songs, setSongs] = useState([]);
  const [hoveredSongIndex, setHoveredSongIndex] = useState(null);

  const dispatch = useDispatch();

  const handleMouseEnter = (index) => {
    setHoveredSongIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredSongIndex(null);
  };
  function formatDuration(duration) {
    const minutes = Math.floor(duration);

    const seconds = Math.round((duration - minutes) * 60);

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const handelDownload = async (song) => {
    const songId=song._id
    try {
      const response = await axios.get(
        `${apiUrl}api/v1/song/isPurchased/${songId}`,
        { withCredentials: true }
      );

      if (response.data.isPurchased) {
        toast.success("Download started", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Fetch the blob data
        const audioResponse = await axios.get(song.audioUrls.high, {
          responseType: "blob", // Important: Get the response as a blob
        });

        const audioBlob = audioResponse.data;

        // Create a download link for the blob
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob); // Create a blob URL
        downloadLink.href = url;
        downloadLink.download = `${song.title}.mp3`; // Set the desired filename
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        window.URL.revokeObjectURL(url); // Release the blob URL
        document.body.removeChild(downloadLink);
      } else if (response.data.isPurchased === false) {
        toast.error("Download not allowed. Purchase the song first.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Unauthorized: You Need to Login"
      ) {
        toast.error("Please login to download the song.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error checking purchase status", error);
        toast.error("An error occurred while checking purchase status.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}api/v1/user/getPurchasedSong`,
          { withCredentials: true }
        );
        setSongs(res.data.purchasedSongs); // Assuming purchasedSongs is returned
      
      } catch (error) {
        console.error("Error fetching purchased songs:", error);
      }
    };
    fetchSongs(); // Call the function correctly
  }, []);

  return (
    <>
      <div className="w-full mb-6 mt-20">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          Your Purchased tracks
          <div className="absolute bottom-0  w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
      </div>
      <div className="overflow-x-auto h-screen ">
        <table className="table-auto w-full text-left text-sm text-gray-400">
          <thead className="text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4 w-10">#</th>{" "}
              {/* Fixed width for the number column */}
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
                  {" "}
                  {/* Fixed width to prevent shifting */}
                  <div
                    onClick={() =>
                      dispatch(addSongToQueue(song), setIsPlaying(true))
                    }
                    className="flex items-center justify-center"
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
                    o
                    onClick={() => handelDownload(song)}
                    className="w-5 h-5 hover:text-cyan-500 transition-colors duration-300"
                  />
                </td>
                <td className="p-4">
                  <MoreHorizontal className="w-5 h-5 hover:text-cyan-500 transition-colors duration-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DownloadPage;
