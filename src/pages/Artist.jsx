import React from "react";
import AlbumCard from "../components/Album/AlbumCard";
import ArtistCard from "../components/ArtistCard";
const Artist = () => {
  return (
    <div className="bg-[#14182A]">
      <div className="mt-14">
        <ArtistCard
          heading={"Featured Artist"}
          link={
            "https://backend-music-xg6e.onrender.com/api/v1/user/featuredArtists"
          }
        />
        <ArtistCard
          heading={"All Artist"}
          link={"https://backend-music-xg6e.onrender.com/api/v1/user/artist"}
        />
        {/* Top 15 Albums */}
      </div>
    </div>
  );
};

export default Artist;
