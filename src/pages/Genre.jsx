import React from "react";
import TopGenres from "../components/TopGenres";
import AlbumCard from "../components/Album/AlbumCard";

const Genre = () => {
  return (
    <div>
      <div className="mt-14">
        <TopGenres />
      </div>
      <div className="mt-10">
        <AlbumCard
          heading={"Featured Albums"}
          link={
            "https://backend-music-xg6e.onrender.com/api/v1/albums/featureAlbums"
          }
        />
      </div>
    </div>
  );
};

export default Genre;
