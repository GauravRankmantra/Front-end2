import React from "react";
import WeeklyTop15 from "../components/WeeklyTop15";
import AlbumCard from "../components/Album/AlbumCard";

const TopTrack = () => {
  return (
    <div>
      <div className="my-14">
        <WeeklyTop15
          heading={"Weekly top 15"}
          link={"https://backend-music-xg6e.onrender.com/api/v1/song/top15"}
        />
      </div>

      <div className="my-10">
        <AlbumCard
          heading={"Top track of all time"}
          link={
            "https://backend-music-xg6e.onrender.com/api/v1/albums/featureAlbums"
          }
        />
      </div>
    </div>
  );
};

export default TopTrack;
