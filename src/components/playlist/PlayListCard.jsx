import React from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  addPlaylistToQueue,
  setIsPlaying,
  clearQueue,
} from "../../features/musicSlice";

const apiUrl = import.meta.env.VITE_API_URL;

const PlayListCard = ({ playlist, onClose, onPlaylistDeleted }) => {
  // Added onClose prop
  const dispatch = useDispatch();

  const handelPlaylistClick = (songs) => {
    try {
      dispatch(clearQueue());

      dispatch(addPlaylistToQueue(songs));
      dispatch(setIsPlaying(true));
    } catch (error) {
      console.error("Error playing playlist:", error);
      toast.error("Failed to play playlist.", { position: "top-right" });
    }
  };
  const deletePlaylist = async (playlist, onPlaylistDeleted, onClose) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the playlist "${playlist?.name}"?`
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}api/v1/playlist/delete${playlist._id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Playlist deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });

          if (onPlaylistDeleted) {
            onPlaylistDeleted();
          }

          if (onClose) {
            onClose();
          }
        } else {
          toast.error(response.data.message || "Failed to delete playlist.", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting playlist:", error);
        toast.error("An error occurred while deleting the playlist.", {
          position: "top-right",
        });
      }
    }
  };
  return (
    <div key={playlist?._id}>
      {" "}
      {/* Added key prop */}
      <div className="relative flex-shrink-0 w-[120px] sm:w-[150px] md:w-[190px] group cursor-pointer">
        <div className="relative overflow-hidden rounded-[10px] aspect-square group">
          <img
            className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
            src={playlist?.coverImage || "https://dummyimage.com/150x150"}
            alt={playlist?.name}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AiFillPlayCircle
              onClick={() => handelPlaylistClick(playlist.songs)}
              className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
              aria-label={`Play playlist ${playlist?.name}`} // Added aria label
            />
            <FaTrashAlt
              onClick={() => deletePlaylist(playlist,onPlaylistDeleted,onClose)}
              className="absolute top-2 right-2 w-5 h-5 text-white hover:text-red-400 cursor-pointer transform transition-transform duration-300 hover:scale-110"
              aria-label={`Delete playlist ${playlist?.name}`} // Added aria label
            />
          </div>
        </div>

        <div className="text-left mt-4">
          <h1 className="text-[14px] mb-[5px]">
            <a href="#" className="text-white hover:text-[#3bc8e7]">
              {playlist?.name}
            </a>
          </h1>
          <p className="text-[#dedede] text-[12px]">
            {playlist?.totalSongs} Songs
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayListCard;
