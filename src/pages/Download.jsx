import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PlayCircle, MoreHorizontal, Download } from "lucide-react";
import { addSongToQueue, setIsPlaying } from "../features/musicSlice";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import SongList from "../components/Song/SongList";
import Loading from "../components/Loading";

const apiUrl = import.meta.env.VITE_API_URL;

const DownloadPage = () => {
  const { t } = useTranslation();
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
    let artistIds = [];

    if (typeof song.artist === "string") {
      artistIds.push(song.artist._id);
    } else if (Array.isArray(song.artist)) {
      artistIds = song.artist
        .filter((artist) => artist && artist._id)
        .map((artist) => artist._id);
    } else {
      console.warn("song.artist is not a string or an array:", song.artist);
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}api/v1/song/isPurchased/${songId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.isPurchased) {
        toast.success("Download started");
        try {
          const response = await axios.post(
            `${apiUrl}api/v1/userStats/addDownloadStats`,
            { songId, artistIds }
          );
        } catch (error) {
          console.log("error while update download stats", error);
        }
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
          setSongs(res.data.songs);
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
      <h1 className="text-2xl text-white">Your Download</h1>
      <div className="mt-10">
      {songs && songs.length > 0 ? (
        <SongList songs={songs} type={"download"} />
      ) : (
        <p>
          <Loading />
        </p>
      )}
      </div>

    </div>
  );
};

export default DownloadPage;
