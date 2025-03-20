import React, { useEffect } from "react";
import SongCard from "../components/SongCard";
import AlbumCard from "../components/AlbumCard";

const Albums = () => {
  return (
    <div className="bg-[#14182A]">
      <div className="mt-14">
        <AlbumCard
          heading={"Featured Albums"}
          link={"http://localhost:5000/api/v1/albums/featureAlbums"}
        />
        <AlbumCard
          heading={"Trending Albums"}
          link={"http://localhost:5000/api/v1/albums/trendingAlbums"}
          type={"album"}
        />
        {/* Top 15 Albums */}
      </div>
    </div>
  );
};

export default Albums;
