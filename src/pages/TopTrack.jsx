import React from "react";
import WeeklyTop15 from "../components/WeeklyTop15";
import AlbumCard from "../components/Album/AlbumCard";
const apiUrl = import.meta.env.VITE_API_URL;

const TopTrack = () => {
  return (
    <div>
      <div className="my-14">
        <WeeklyTop15
          heading={"Weekly top 15"}

          link={
            `${apiUrl}api/v1/song/weeklyTop15`}
        />
      </div>

      <div className="my-10">
        <AlbumCard
          heading={"Top track of all time"}
          link={
            `${apiUrl}api/v1/albums/featureAlbums`
          }
        />
      </div>
    </div>
  );
};

export default TopTrack;
