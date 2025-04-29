import React, { useEffect, useState } from "react";
import SongCard from "../components/Song/SongCard";
import owner from "../assets/img/frame.jpeg";
import AlbumCard from "../components/Album/AlbumCard";
import WeeklyTop15 from "../components/WeeklyTop15";
import img728 from "../assets/img/home2bg.svg";
import NewReleases from "../components/NewReleases";
import TopGenres from "../components/TopGenres";
import logo from "../assets/img/logo.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}api/v1/home/heroSection`);

      if (res.data && res.data.success) {
        setData(res.data.data);

        setError(null);
      } else {
        setError("Failed to fetch hero section: Invalid response from server.");
        setData(null);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch hero section";
      toast.error(message);
      setError(message);
      setData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="py-6 lg:py-16  bg-[#14182A] scroll-smooth ">
        <div className="">
          <div className="flex flex-wrap justify-center lg:justify-start">
            <div className="w-full sm:w-[90%] lg:w-[511px] mx-auto text-center lg:text-left">
              <div className="">
                <img
                  src={data?.coverImage}
                  alt="Record Breaking Albums"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="w-full sm:w-[90%] lg:w-[calc(100%-511px)] mt-0 lg:mt-0 px-4 lg:px-30">
              <div className="ms_banner_text pt-8 sm:pt-16 lg:pt-32 text-center lg:text-left">
                {data && (
                  <>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-josefin-b text-white">
                      {data.heading.split(" ").slice(0, 2).join(" ")}
                    </h1>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-josefin-b text-[#3bc8e7]">
                      {data.heading.split(" ").slice(2).join(" ")}
                    </h1>
                  </>
                )}

                {data && (
                  <p className="text-gray-300 my-4 leading-8 text-sm sm:text-base lg:text-md">
                    {data.subHeading}
                  </p>
                )}

                <div className="ms_banner_btn flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                  <button
                    onClick={() => navigate("/albums")}
                    className="ms_btn bg-[#3bc8e7] text-white py-2 px-6 rounded-lg font-semibold text-center w-full sm:w-auto"
                  >
                    Listen Now
                  </button>
                  <button
                    onClick={() => navigate("/albums")}
                    className="ms_btn bg-[#3bc8e7] text-white py-2 px-6 rounded-lg font-semibold text-center w-full sm:w-auto"
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <SongCard
            heading={"Top 15 Songs"}
            link={`${apiUrl}api/v1/song/top15`}
          />
        </div>
      </div>

      <div className="my-4">
        <WeeklyTop15
          heading={"Weekly top 15"}
          link={`${apiUrl}api/v1/song/weeklyTop15`}
        />
      </div>
      <div className="my-10">
        <AlbumCard
          heading={"Feature Albums"}
          link={`${apiUrl}api/v1/albums/featureAlbums`}
        />
      </div>
      <div className="flex justify-center my-4">
        <img src={img728} className="md:w-9/12  h-20 object-cover"></img>
      </div>
      <div className="my-4">
        <NewReleases />
      </div>
      <div className="my-10">
        <TopGenres />
      </div>
      <div className="flex w-full flex-col items-center justify-center mt-10 ">
        <img
          className=" relative w-24 h-20 rounded-full shadow-2xl opacity-80"
          src={logo}
        ></img>
        <div className="absolute w-28 h-20 rounded-full border border-gray-400 shadow-2xl"></div>
      </div>
    </>
  );
};

export default Home;
