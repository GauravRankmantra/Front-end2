import React from 'react';

const SongShimmer = ({ viewAll }) => {
  return (
    <div className="relative">
      <div
        className={`w-full transition-all duration-400 ${
          viewAll
            ? "grid grid-cols-2 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 place-items-center"
            : "flex space-x-6 py-4 overflow-x-scroll scroll-smooth no-scrollbar"
        }`}
      >
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-[120px] sm:w-[150px] md:w-[190px] group"
            >
              <div className="relative overflow-hidden rounded-[10px] aspect-square">
                <div className="animate-pulse bg-gray-700 rounded-[10px] w-full h-full" />
              </div>
              <div className="text-left mt-4">
                <div className="animate-pulse bg-gray-700 rounded-[4px] h-4 w-2/3 mb-[5px]" />
                <div className="animate-pulse bg-gray-700 rounded-[4px] h-3 w-1/2" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SongShimmer;
