import React from "react";
import TopGenres from "../components/TopGenres";
import AlbumCard from "../components/Album/AlbumCard";
import Loading from "../components/Loading"
import { useTranslation } from "react-i18next";
const apiUrl = import.meta.env.VITE_API_URL;

const Genre = () => {
     const { t } = useTranslation();
  return (
    <div>
      <div className="mt-14">
        <TopGenres />
      </div>
      <div className="mt-10">
        <AlbumCard
          heading={t("featuredAlbum")}
          link={
            `${apiUrl}api/v1/albums/featureAlbums`
          }
        />
      </div>
    </div>
  );
};

export default Genre;
