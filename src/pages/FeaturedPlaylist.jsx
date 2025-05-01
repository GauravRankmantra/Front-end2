import React from "react";
import SongCard from "../components/Song/SongCard";
import AlbumCard from "../components/Album/AlbumCard"
import { useTranslation } from "react-i18next";

const apiUrl = import.meta.env.VITE_API_URL;

const FeaturedPlaylist = () => {
    const { t } = useTranslation();
  return (
    <div className="my-14">
      <div className="my-4">
        <SongCard
          heading={t("top15Songs")}
          link={`${apiUrl}api/v1/song/top15`}
        />
      </div>
      <div className="my-10">
        <AlbumCard
          heading={t("topPlaylist")}
          type={'playlist'}
          link={`${apiUrl}api/v1/playlist/getTopPlaylist`}
        />
      </div>
    </div>
  );
};

export default FeaturedPlaylist;
