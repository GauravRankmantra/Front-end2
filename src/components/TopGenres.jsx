import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const TopGenres = () => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/v1/genre`);
        setGenres(res.data);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="text-white px-4 sm:px-10 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-[#3bc8e7] relative">
          Top Genres
          <div className="w-[120px] h-[2px] bg-gradient-to-r from-[#3bc8e7] to-transparent mt-2 rounded-xl"></div>
        </h2>
        {/* <a href="#" className="text-blue-400 hover:underline text-sm">
          View All
        </a> */}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {genres.length === 0 ? (
          <p>Loading genres...</p>
        ) : (
          genres.map((genre, index) => (
            <div
              key={genre._id}
              onClick={() => navigate(`/genre/${genre.name.toLowerCase()}`, { state: { genreId: genre._id } })}

              className={`
                relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 
                ${index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : "h-60"}
              `}
            >
              <img
                src={genre.image || "/default-genre.jpg"} // fallback image
                alt={genre.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition duration-300"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold">{genre.name}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopGenres;
