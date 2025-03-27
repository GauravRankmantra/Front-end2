import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlineHeart,
  AiOutlinePlus,
  AiOutlineDownload,
  AiOutlineUnorderedList,
  AiOutlineShareAlt,
} from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SongActions = ({ onClose, song }) => {
  const dropdownRef = useRef(null);
  const songId = song._id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handelDownload = async () => {
    try {
      const response = await axios.get(
        `https://backend-music-xg6e.onrender.com/api/v1/song/isPurchased/${songId}`,
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

  const handleDownloadClick = async () => {
    await handelDownload();
    onClose();
  };

  const handleAddToFav = () => {
    console.log("Added to favorites");
    toast.success("Added to favorites!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    onClose();
  };

  const handleAddToQueue = () => {
    console.log("Added to queue");
    toast.success("Added to queue!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    onClose();
  };

  const handleAddToPlaylist = () => {
    console.log("Added to playlist");
    toast.success("Added to playlist!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    onClose();
  };

  const handleShare = () => {
    console.log("Shared");
    toast.success("Shared!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    onClose();
  };

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute md:overflow-hidden overflow-scroll right-8 w-24 h-28 md:w-auto md:h-auto m-auto md:max-w-fit rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in"
      >
        <div className="md:py-1">
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200 "
            onClick={handleAddToFav}
          >
            <AiOutlineHeart className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Add To Fav
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToQueue}
          >
            <AiOutlinePlus className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Add To Queue
          </button>
          <button
            className="flex  items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleDownloadClick}
          >
            <AiOutlineDownload className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Download
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToPlaylist}
          >
            <AiOutlineUnorderedList className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Add To Playlist
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleShare}
          >
            <AiOutlineShareAlt className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Share
          </button>
        </div>
      </div>
    </>
  );
};

export default SongActions;
