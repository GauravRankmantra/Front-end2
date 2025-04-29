import React from "react";
import TopGenres from "../components/TopGenres";
import AlbumCard from "../components/Album/AlbumCard";
import Loading from "../components/Loading"
const apiUrl = import.meta.env.VITE_API_URL;

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
            `${apiUrl}api/v1/albums/featureAlbums`
          }
        />
      </div>
    </div>
  );
};

export default Genre;
