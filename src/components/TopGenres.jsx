import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import { useTranslation } from "react-i18next";

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
              onClick={() =>
                navigate(`/genre/${genre.name.toLowerCase()}`, {
                  state: { genreId: genre._id },
                })
              }
              className={`
    relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 
    ${index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : "h-60"}
  `}
            >
              <img
                src={genre.image || "/default-genre.jpg"}
                alt={genre.name}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />

              {/* Genre Name with Background */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md">
                <h3 className="text-xl font-bold text-white">{genre.name}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopGenres;
