import React from "react";
import SongCard from "../components/SongCard";
import owner from "../assets/img/frame.jpeg";
import AlbumCard from "../components/AlbumCard";
import WeeklyTop15 from "../components/WeeklyTop15";
import img728 from "../assets/img/dummy.png"
import NewReleases from "../components/NewReleases";

const Home = () => {
  return (
    <>
      <div className="py-6 lg:py-16  bg-[#14182A]">
        <div className="">
          <div className="flex flex-wrap justify-center lg:justify-start">
            <div className="w-full sm:w-[90%] lg:w-[511px] mx-auto text-center lg:text-left">
              <div className="ms_banner_img">
                <img
                  src={owner}
                  alt="Record Breaking Albums"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="w-full sm:w-[90%] lg:w-[calc(100%-511px)] mt-0 lg:mt-0 px-4 lg:px-30">
              <div className="ms_banner_text pt-8 sm:pt-16 lg:pt-32 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  This Month's
                </h1>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3bc8e7]">
                  Record Breaking Albums !
                </h1>
                <p className="text-white my-4 leading-8 text-sm sm:text-base lg:text-md">
                  Dream your moments, Until I Met You, Gimme Some Courage, Dark
                  Alley, One More Of A Stranger, Endless
                  <br /> Things, The Heartbeat Stops, Walking Promises, Desired
                  Games and many more...
                </p>
                <div className="ms_banner_btn flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                  <a
                    href="#"
                    className="ms_btn bg-[#3bc8e7] text-white py-2 px-6 rounded-lg font-semibold text-center w-full sm:w-auto"
                  >
                    Listen Now
                  </a>
                  <a
                    href="#"
                    className="ms_btn bg-[#3bc8e7] text-white py-2 px-6 rounded-lg font-semibold text-center w-full sm:w-auto"
                  >
                    Add To Queue
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <SongCard
            heading={"Top 15 Songs"}
            link={"http://localhost:5000/api/v1/song/top15"}
          />
        </div>
      </div>
      <div className="mb-4">
        <WeeklyTop15
          heading={"Weekly top 15"}
          link={"http://localhost:5000/api/v1/song/top15"}
        />
      </div>
      <div className="my-10">
        <AlbumCard
          heading={"Feature Albums"}
          link={"http://localhost:5000/api/v1/albums/featureAlbums"}
     
        />
      </div>
      <div className="flex justify-center my-4">
        <img src={img728} className="w-6/12  h-20 object-cover">
        </img>
      </div>
      <div>
        <NewReleases/>
      </div>
    </>
  );
};

export default Home;
