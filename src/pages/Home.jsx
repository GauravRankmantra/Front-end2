import React, { useEffect, useState } from "react";
import SongCard from "../components/Song/SongCard";

import AlbumCard from "../components/Album/AlbumCard";
import WeeklyTop15 from "../components/WeeklyTop15";
import img728 from "../assets/img/home2bg.svg";
import NewReleases from "../components/NewReleases";
import TopGenres from "../components/TopGenres";


import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import { useTranslation } from "react-i18next";
import VideoGallery from "../components/VideoGallery";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [videos, setVideos] = useState(null);

  const { t } = useTranslation();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);

  const incrementView = async (id) => {
    try {
      await axios.post(`${apiUrl}api/v1/AdminVideo/${id}/views`);
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  const handleVideoClick = (video) => {
    incrementView(video._id);
    setSelectedVideo(video);
  };

  const formatViews = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num;
  };

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
    const fetchVideUrl = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}api/v1/AdminVideo`
        ); // Fetch all videos
        if (Array.isArray(data)) {
          setVideos(data);
        } else if (data && typeof data === "object") {
          // If it's a single video object (from old API), wrap it in an array
          setVideos([data]);
          console.warn(
            "API returned a single video object where an array was expected. Wrapping in array."
          );
        } else {
          // If data is null, undefined, or empty, set to empty array
          setVideos([]);
        }
      } catch (error) {
        console.log("error while fetching video url ", error);
      }
    };
    fetchVideUrl();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="pt-6 lg:pt-16  bg-[#14182A] scroll-smooth ">
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
                    {t("listenNow")}
                  </button>
                  <button
                    onClick={() => navigate("/albums")}
                    className="ms_btn bg-[#3bc8e7] text-white py-2 px-6 rounded-lg font-semibold text-center w-full sm:w-auto"
                  >
                    {t("exploreNow")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <SongCard
            heading={t("top15Songs")}
            link={`${apiUrl}api/v1/song/top15`}
          />
        </div>
      </div>

      <div className="my-4">
        <WeeklyTop15
          heading={t("weeklyTop15")}
          link={`${apiUrl}api/v1/song/weeklyTop15`}
        />
      </div>
      <div className="my-10">
        <AlbumCard
          heading={t("featuredAlbum")}
          link={`${apiUrl}api/v1/albums/featureAlbums`}
        />
      </div>
      <div className="my-14">
        <ArtistCard
          heading={t("featuredArtist")}
          link={`${apiUrl}api/v1/user/featuredArtists`}
        />
      </div>
      <div className="flex relative rounded-md justify-center my-4">
        <img
          src={img728}
          loading="lazy"
          className="w-full rounded-md h-20 md:h-28 object-cover bottom-0"
          alt="Advertisement"
        />
        <div className="absolute inset-0 bg-black/40 w-full h-full"></div>
      </div>
      <div className="my-4">
        <NewReleases />
      </div>
      <div className="my-10">
        <TopGenres />
      </div>
      <div className="container mx-auto px-4">


        <VideoGallery videos={videos} />

        {/* Video Modal */}
        {/* <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        /> */}
      </div>
    </>
  );
};

export default Home;
