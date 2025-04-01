import React from "react";

const WeeklyTop15Shimmer = () => {
  return (
    <div className="bg-gray-900 text-gray-300 px-4 sm:px-10 lg:px-10 py-4">
      <div className="container mx-auto">
        {/* Heading Section */}
        <div className="w-full mb-6">
          <div className="animate-pulse bg-gray-700 rounded-[4px] h-8 w-1/2" />
        </div>

        {/* Song Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="relative flex items-center p-4 rounded-lg"
              >
                {/* Bottom Divider */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-700"></div>

                {/* Song Index */}
                <div className="animate-pulse bg-gray-700 rounded-[4px] h-8 w-8 mr-4" />

                {/* Song Cover Image */}
                <div className="w-14 h-14 xl:w-20 xl:h-20 flex-shrink-0 mr-4">
                  <div className="animate-pulse bg-gray-700 rounded-lg w-full h-full" />
                </div>

                {/* Song Info */}
                <div className="flex flex-col justify-between flex-grow overflow-hidden">
                  <div className="animate-pulse bg-gray-700 rounded-[4px] h-6 w-2/3 mb-2" />
                  <div className="animate-pulse bg-gray-700 rounded-[4px] h-4 w-1/2" />
                </div>

                {/* Song Duration */}
                <div className="text-xs block sm:text-sm lg:hidden xl:hidden 2xl:block text-gray-400 ml-4 flex-shrink-0">
                  <div className="animate-pulse bg-gray-700 rounded-[4px] h-4 w-16" />
                </div>

                {/* Options Button */}
                <div className="ml-4 flex-shrink-0 block lg:hidden xl:hidden 2xl:block">
                  <div className="animate-pulse bg-gray-700 rounded-[4px] h-6 w-6" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTop15Shimmer;
