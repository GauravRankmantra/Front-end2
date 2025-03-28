import React, { useEffect } from "react";
import SongCard from "../components/Song/SongCard";
import AlbumCard from "../components/Album/AlbumCard";
const apiUrl = import.meta.env.VITE_API_URL;

const Albums = () => {
  return (
    <div className="bg-[#14182A]">
      <div className="mt-14">
        <AlbumCard
          heading={"Featured Albums"}
          link={
            `${apiUrl}api/v1/albums/featureAlbums`
          }
        />
        <AlbumCard
          heading={"Trending Albums"}
          link={
            `${apiUrl}api/v1/albums/trendingAlbums`
          }
          type={"album"}
        />
        {/* Top 15 Albums */}
      </div>
    </div>
  );
};

export default Albums;
