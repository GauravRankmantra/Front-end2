import React from "react";
import SongCard from "./Song/SongCard"
const apiUrl = import.meta.env.VITE_API_URL;

const History = () => {
  return (
    <div className="bg-[#14182A]  flex flex-col items-center justify-center lg:px-36 md:px-0 mt-10 scroll-smooth no-scrollbar">
      <div className="w-full  m-auto mt-5">
        <SongCard
        showGrid={true}
          heading={"Recently played"}
          link={`${apiUrl}api/v1/user/gethistory`}
        />
      </div>
    </div>
  );
};

export default History;
