import React from "react";
import { useNavigate } from "react-router-dom";

const LoginCard = ({ song, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 animate-fadeIn">
        {/* Close Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 border p-2 rounded-full text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Card Content */}
        <div className="p-2 pt-0 flex flex-col items-center text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 rounded p-4 shadow-md">
            <img
              src={song?.coverImage}
              alt={song?.title}
              className="w-40 h-40 object-cover rounded-lg shadow"
            />
            <div className="text-start">
              <h2 className="text-2xl font-semibold text-gray-800">
                {song?.title}
              </h2>
              <p className="text-gray-600 text-sm">
                Artist:{" "}
                {song?.artist?.fullName || song?.artist || "Unknown Artist"}
              </p>
              <p className="text-gray-600 text-sm">
                played: {song?.plays || "0"} Times
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              navigate("/login");
              onClose();
            }}
            className="mt-4 w-full bg-cyan-500 text-white py-2 px-6 rounded-full hover:bg-cyan-600 transition"
          >
            Login to Listen
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
