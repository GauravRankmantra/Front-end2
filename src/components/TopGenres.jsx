import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import { useTranslation } from "react-i18next";
import { AiFillPayCircle, AiFillPlayCircle } from "react-icons/ai";

const TopGenres = () => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          {t("topGenres")}
          <div className="w-[120px] h-[2px] bg-gradient-to-r from-[#3bc8e7] to-transparent mt-2 rounded-xl"></div>
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {genres.length === 0 ? (
          <p>Loading genres...</p>
        ) : (
          genres.map((genre, index) => (
            <div
              key={genre._id}
              onClick={() =>
                navigate(`/genre/${genre.name.toLowerCase()}`, {
                  state: { genreId: genre._id },
                })
              }
              className={`
                relative rounded-2xl group overflow-hidden shadow-lg cursor-pointer transition-all duration-300
                ${index === 0 || index === 1 ? "lg:col-span-3 h-72" : "lg:col-span-2 h-60"}
              `}
            >
              <img
                src={genre.image || "/default-genre.jpg"}
                alt={genre.name}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />

              {/* Hover Effect Div */}
              <div
                className="p-4 relative 
                           bg-gradient-to-t from-cyan-500 via-cyan-500/70 to-transparent 
                           translate-y-full group-hover:-translate-y-full 
                           transition-transform duration-500 ease-in-out
                           flex items-end h-full" // Added flex and items-end for better text positioning
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {genre.name}
                </h3>
                <h3 className="absolute top-1/2 translate-x-1/2 translate-y-1/2 right-1/2 text-2xl font-bold text-white mb-2">
                  <AiFillPlayCircle className="w-10 h-10" />
                </h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopGenres;
