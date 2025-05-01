import React from "react";
import SongCard from "./Song/SongCard"
const apiUrl = import.meta.env.VITE_API_URL;
import { useTranslation } from "react-i18next";

const History = () => {
    const { t } = useTranslation();
  return (
    <div className="bg-[#14182A]  flex flex-col items-center justify-center lg:px-36 md:px-0 mt-10 scroll-smooth no-scrollbar">
      <div className="w-full  m-auto mt-5">
        <SongCard
        showGrid={true}
          heading={t("recentlyPlayed")}
          link={`${apiUrl}api/v1/user/gethistory`}
        />
      </div>
    </div>
  );
};

export default History;
