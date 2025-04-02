import React, { useEffect, useState } from "react";
import classical from "../assets/img/classical.png";
import dance from "../assets/img/dance.jpg";
import edm from "../assets/img/edm.jpg";
import hip_hop from "../assets/img/hip-hop.jpg";
import rock from "../assets/img/rock.jpg";
import rom from "../assets/img/rom.jpg";
import axios from "axios";
import { Navigate, useNavigate, Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const TopGenres = () => {
  const [genre, setGenre] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}api/v1/genre`
        );
        setGenre(res.data);
      } catch (error) {
        console.error("Error fetching genre:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-white mx-2 sm:mx-10 lg:mx-10">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full mb-6">
          <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
            Top Genres
            <div className="absolute bottom-0  w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
          </h1>
        </div>

        <a
          href="#"
          className="text-blue-500 text-xs md:text-sm hover:underline"
        >
          View More
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Romantic */}
        <div
          onClick={() => navigate("/genre/romantic")}
          className="relative col-span-1 md:col-span-1 lg:col-span-2 row-span-2 group"
        >
          <div className="relative bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg overflow-hidden">
            <img
              src={rom}
              alt="Romantic"
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out"></div>
            <div className="absolute bottom-4 left-4">
              <a href="#" className="text-white font-semibold text-lg">
                Romantic
              </a>
            </div>
            <a
              href="#"
              className="absolute top-4 right-4 text-blue-500 hover:underline"
            >
              View Song
            </a>
          </div>
        </div>

        {/* Classical */}
        <div
          onClick={() => navigate("/genre/classical")}
          className="relative bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg overflow-hidden h-full group"
        >
          <img
            src={classical}
            alt="Classical"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute bottom-4 left-4">
            <a href="#" className="text-white font-semibold">
              Classical
            </a>
          </div>
        </div>

        {/* Hip Hop */}
        <div
          onClick={() => navigate("/genre/hip-hop")}
          className="relative bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg overflow-hidden h-full group"
        >
          <img
            src={hip_hop}
            alt="Hip Hop"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute bottom-4 left-4">
            <a href="#" className="text-white font-semibold">
              Hip-Hop
            </a>
          </div>
        </div>

        {/* Dancing */}
        <div
          onClick={() => navigate("/genre/dancing")}
          className="relative bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg overflow-hidden h-48 group"
        >
          <img
            src={dance}
            alt="Dancing"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute bottom-4 left-4">
            <a href="#" className="text-white font-semibold">
              Dancing
            </a>
          </div>
        </div>

        {/* EDM */}
        <div
          onClick={() => navigate("/genre/edm")}
          className="relative bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg overflow-hidden h-48 group"
        >
          <img
            src={edm}
            alt="EDM"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute bottom-4 left-4">
            <a href="#" className="text-white font-semibold">
              EDM
            </a>
          </div>
        </div>

        {/* Rock */}
        <div
          onClick={() => navigate("/genre/rock")}
          className="relative bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg overflow-hidden h-48 group"
        >
          <img
            src={rock}
            alt="Rock"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute bottom-4 left-4">
            <a href="#" className="text-white font-semibold">
              Rock
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopGenres;
