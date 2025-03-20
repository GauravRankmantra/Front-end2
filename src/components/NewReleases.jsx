import React from "react";
import { PlayIcon } from "@heroicons/react/24/outline";

const NewReleases = () => {
  const tracks = [
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    {
      id: 1,
      title: "Dark Alley Acoustic",
      artist: "Ava Cornish",
      duration: "5:10",
      cover:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn2.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcS-TfsaKW04nQqScGOF-f2-jGE9b6ra2LZD7tL1cvAUSTQg1n-n&psig=AOvVaw2ZWPvWU60EWuIFqNttbFZd&ust=1742542643603000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCJCh9KuTmIwDFQAAAAAdAAAAABAE", // Placeholder for the image
    },
    // Add more tracks as needed...
  ];

  return (
    <div className="bg-gray-900 py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-teal-400">New Releases</h2>
          <a href="#" className="text-sm text-teal-200 hover:underline">
            View More
          </a>
        </div>
        <div className="flex items-center space-x-8 overflow-x-scroll scrollbar-hide  no-scrollbar">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group justify-center content-center items-center flex relative w-full  bg-gray-800 rounded-lg hover:bg-blue-500 hover:cursor-pointer transition duration-300 ease-in-out"
            >
              <div className="w-20 h-14 rounded bg-gray-300 mb-2">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3 className="text-sm px-1 font-medium text-white">
                {track.title}
              </h3>
              <p className="text-sm text-gray-400">{track.artist}</p>
              <p className="text-sm text-gray-400">{track.duration}</p>
              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewReleases;
