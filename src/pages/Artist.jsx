import React from "react";
import AlbumCard from "../components/Album/AlbumCard";
import ArtistCard from "../components/ArtistCard";
const apiUrl = import.meta.env.VITE_API_URL;
const Artist = () => {
  return (
    <div className="bg-[#14182A]">
      <div className="mt-14">
        <ArtistCard
          heading={"Featured Artist"}
          link={`${apiUrl}api/v1/user/featuredArtists`}
        />
        <ArtistCard
          heading={"All Artist"}
          link={`${apiUrl}api/v1/user/artist`}
        />
        {/* Top 15 Albums */}
      </div>
    </div>
  );
};

export default Artist;
