import React from "react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ShareModal = ({ shareUrl, socialMediaLinks, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Share this music</h2>

        {/* Social Media Buttons */}
        <div className="flex justify-between">
          <a
            href={socialMediaLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 text-2xl"
          >
            <FaWhatsapp />
          </a>
          <a
            href={socialMediaLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-2xl"
          >
            <FaFacebook />
          </a>
          <a
            href={socialMediaLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-2xl"
          >
            <FaTwitter />
          </a>
        </div>

        {/* Share Link Section */}
        <div className="mt-4 p-2 border rounded flex justify-between items-center">
          <span className="truncate">{shareUrl}</span>
          <button onClick={copyToClipboard} className="ml-2 text-gray-600">
            <FaCopy />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
