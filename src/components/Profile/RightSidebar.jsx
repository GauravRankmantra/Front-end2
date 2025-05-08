import React, { useCallback, useEffect, useState } from "react";
import {
  FaDollarSign,
  FaHeadphonesAlt,
  FaUser,
  FaCloudSun,
  FaCloudMoon,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const RightSidebar = () => {
  const [webUpdates, setWebUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const websiteUpdates = [
    {
      text: "Admin has added a new Album",
      highlight: "new webseries",
      time: "1 month ago",
    },
    {
      text: "Admin has added a new Playlist",
      highlight: "kids webseries test",
      time: "1 month ago",
    },
    {
      text: "Admin has added a new Live TV",
      highlight: "live tv",
      time: "1 month ago",
    },
    {
      text: "Admin has added a new Training",
      highlight: "Session",
      time: "1 month ago",
    },
    {
      text: "Admin has added a new Song",
      highlight: "jkasa ",
      time: "1 month ago",
    },
    // Add more updates as needed
  ];

  const quickLinks = [
    {
      text: "Donate now",
      icon: <FaDollarSign />,
      onClick: () => console.log("Donate clicked"),
    },
    {
      text: "Access the radio",
      icon: <FaHeadphonesAlt />,
      onClick: () => console.log("Radio clicked"),
    },
    {
      text: "Become a sponsor",
      icon: <FaUser />,
      onClick: () => console.log("Sponsor clicked"),
    },
    {
      text: "Morning prayer",
      icon: <FaCloudSun />,
      onClick: () => console.log("Morning prayer clicked"),
    },
    {
      text: "Sleep prayer",
      icon: <FaCloudMoon />,
      onClick: () => console.log("Sleep prayer clicked"),
    },
  ];

  const fetchWebUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/web");
      if (response.data.success) {
        setWebUpdates(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch web updates.");
        toast.error(response.data.message || "Failed to fetch web updates.");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while fetching web updates."
      );
      toast.error(
        error.message || "An error occurred while fetching web updates."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebUpdates();
  }, [fetchWebUpdates]);

  return (
    <div className=" mt-2 bg-[#141834] text-white shadow-lg py-4 px-2 space-y-6 overflow-y-auto">
      {/* Website Updates Section */}
      <div className="mb-4 h-64 overflow-scroll no-scrollbar ">
        <h2 className="font-semibold text-lg mb-2 underline text-cyan-500">
          Website Updates
        </h2>
        <ul className="space-y-2">
          {webUpdates.map((update, index) => (
            <li key={index} className="">
              {update.heading}{" "}
              {update.subHeading && (
                <a href={update.link}>
                  <span className="text-cyan-500">{update.subHeading}</span>
                </a>
              )}
              <p className="text-sm text-gray-400">
                {" "}
                {update?.createdAt &&
                  new Date(update.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </li>
          ))}
          {/* Add more dummy lines to simulate scroll */}
        </ul>
      </div>

      <hr className="text-gray-400"></hr>
      {/* Quick Links Section */}
      <div className="space-y-4">
        {quickLinks.map((link, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center text-center w-full py-3 rounded-md hover:bg-gray-800 transition duration-200"
            onClick={link.onClick}
          >
            <span className="text-xl text-cyan-500 mb-1">{link.icon}</span>
            <span className="text-sm font-semibold">{link.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
