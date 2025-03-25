import React from 'react';

const ResponsiveDivs = () => {
  return (
    <div className="flex flex-wrap justify-center items-stretch">
      <div className="flex-grow flex-shrink min-w-0 w-full md:w-1/2 lg:w-1/4 bg-blue-500 text-white p-4 m-2">
        <p>This is the first div. It will grow and shrink as needed.</p>
      </div>
      <div className="flex-grow flex-shrink min-w-0 w-full md:w-1/2 lg:w-1/4 bg-green-500 text-white p-4 m-2">
        <p>This is the second div. It will grow and shrink as needed.</p>
      </div>
      <div className="flex-grow flex-shrink min-w-0 w-full md:w-1/2 lg:w-1/4 bg-red-500 text-white p-4 m-2">
        <p>This is the third div. It will grow and shrink as needed.</p>
      </div>
      <div className="flex-grow flex-shrink min-w-0 w-full md:w-1/2 lg:w-1/4 bg-yellow-500 text-black p-4 m-2">
        <p>This is the fourth div. It will grow and shrink as needed.</p>
      </div>
    </div>
  );
};

export default ResponsiveDivs;
