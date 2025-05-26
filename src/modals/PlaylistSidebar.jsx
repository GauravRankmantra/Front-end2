import React from "react";

const PlaylistSidebar = ({isPlaylistOpen}) => {
  return (
    <div
      className={`fixed right-0 bottom-16 bg-gray-800 p-4 text-white shadow-xl transform transition-transform duration-300 no-scrollbar ${
        isPlaylistOpen ? "translate-x-0" : "translate-x-full"
      } w-80 h-3/4 z-50 overflow-y-auto rounded-lg`}
    >
      <div className=" sticky flex justify-between items-center mb-4">
        <h4 className="text-white text-lg font-semibold">Queue</h4>
        <button
          className="text-yellow-400"
          onClick={() => dispatch(clearQueue())}
        >
          Clear queue
        </button>
      </div>

      <ul className="space-y-4 ">
        {playlist.map((song, index) => (
          <li
            onClick={() => handelQueueSongClick(song)}
            key={index}
            className={`flex relative  items-center hover:bg-cyan-500 justify-start gap-4 p-2 rounded-md cursor-pointer ${
              index === currentSongIndex
                ? "bg-cyan-500 text-white"
                : "bg-gray-800"
            }`}
          >
            <img
              src={song.coverImage}
              alt={song.title}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex  w-6/12 flex-col justify-start items-start">
              <div className="w-full text-start overflow-hidden">
                {" "}
                {/* Wrapping div */}
                <h5 className="text-lg font-semibold whitespace-nowrap">
                  {song.title}
                </h5>
              </div>
              <div className="w-full text-start overflow-hidden">
                {" "}
                {/* Wrapping div */}
                <p className="text-sm whitespace-nowrap">
                  {Array.isArray(song.artist) ? (
                    song.artist.map((artistObj, index) => (
                      <span
                        key={index}
                        onClick={() => navigate(`/artist/${artistObj._id}`)} // Example click handler
                        className="cursor-pointer hover:underline"
                      >
                        {artistObj.fullName}
                        {index !== song.artist.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>
                      {song.artist?.fullName || song.artist || "Unknown Artist"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="absolute right-1">
              <p className="text-sm">{song.duration}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistSidebar;
