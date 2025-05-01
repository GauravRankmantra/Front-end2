import React from "react";
import AlbumCard from "../components/Album/AlbumCard";
import ArtistCard from "../components/ArtistCard";
const apiUrl = import.meta.env.VITE_API_URL;
import { useTranslation } from "react-i18next";
const Artist = () => {
     const { t } = useTranslation();
  return (
    <div className="bg-[#14182A]">
      <div className="mt-14">
        <ArtistCard
          heading={t("featuredArtist")}
          link={`${apiUrl}api/v1/user/featuredArtists`}
        />
        <ArtistCard
          heading={t("allArtist")}
          link={`${apiUrl}api/v1/user/artist`}
        />
        {/* Top 15 Albums */}
      </div>
    </div>
  );
};

export default Artist;
