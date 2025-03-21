import React, { useState, useEffect } from "react";

const WeeklyTop15 = ({ link,heading }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${link}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data && data.data) {
          setSongs(data.data);
        } else {
          setError("No songs available");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [link]);

  return (
    <div className="bg-gray-900 text-gray-300 mx-4 sm:mx-10 lg:mx-10">
      <div className="container mx-auto">
      <div className="w-full mb-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          {heading}
          <div className="absolute bottom-0  w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
      </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && (
            <p className="text-white text-center">Loading songs...</p>
          )}
          {error && <p className="text-white">Error: {error}</p>}

          {!loading && !error && songs.length > 0
            ? songs.map((song, index) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`text-5xl font-bold ${
                        index + 1 === 1 ? "text-blue-400" : "text-gray-300"
                      } mr-4`}
                    >
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>
                    <img
                      src={song.coverImage}
                      alt="Album"
                      className="w-12 h-12 mr-4 object-cover"
                    />
                    <div>
                      <p className="font-bold">{song.title}</p>
                      <p className="text-sm">{song.artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{song.duration}</p>
                    <button className="text-xl">...</button>
                  </div>
                </div>
              ))
            : !loading &&
              !error && <p className="text-white">No songs available</p>}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTop15;
