import React from "react";
import { AiFillPlayCircle } from "react-icons/ai";

const PlayListCard = ({playlist}) => {
  return (
    <div>
      <div
        key={playlist._id}
        className="relative flex-shrink-0 w-[120px] sm:w-[150px] md:w-[190px] group cursor-pointer"
      >
        <div
          className="relative overflow-hidden rounded-[10px] aspect-square group"
          // onMouseLeave={() => setCurrentSong(null)} // Hide menu on mouse leave
        >
          <img
            className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
            src={playlist.coverImage || "https://dummyimage.com/150x150"}
            alt={playlist.name}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AiFillPlayCircle
              className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
              // onClick={() => handleSongClick(song)}
            />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-2 right-2 w-5 h-5 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
              // onClick={() => handleMenuToggle(song)}
            >
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="5" cy="12" r="2" fill="currentColor" />
              <circle cx="19" cy="12" r="2" fill="currentColor" />
            </svg>

            {/* {currentSong && currentSong._id === song._id && (
                        <SongAction
                          onClose={() => setCurrentSong(null)}
                          song={currentSong}
                        />
                      )} */}
          </div>
        </div>

        <div className="text-left mt-4">
          <h3 className="text-[14px] mb-[5px]">
            <a href="#" className="text-white hover:text-[#3bc8e7]">
              {playlist.name}
            </a>
          </h3>
          <p className="text-[#dedede] text-[12px]">{playlist.totalSongs} Songs</p>
        </div>
      </div>
    </div>
  );
};

export default PlayListCard;
