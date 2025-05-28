import React, { useEffect } from "react";
import SongCard from "../components/Song/SongCard";
import AlbumCard from "../components/Album/AlbumCard";
const apiUrl = import.meta.env.VITE_API_URL;
import { useTranslation } from "react-i18next";

const Albums = () => {
   const { t } = useTranslation();
  return (
    <div className="bg-[#14182A]">
      <div className="mt-14 space-y-10">
        <AlbumCard
          heading={t("featuredAlbum")}
          link={
            `${apiUrl}api/v1/albums/featureAlbums`
          }
        />
        <AlbumCard
          heading={t("trendingAlbum")}
          link={
            `${apiUrl}api/v1/albums/trendingAlbums`
          }
          type={"album"}
        />
        {/* Top 15 Albums */}
                <AlbumCard
          heading={'Top 15'}
          link={
            `${apiUrl}api/v1/albums/top15`
          }
          type={"album"}
        />
      </div>
    </div>
  );
};

export default Albums;
