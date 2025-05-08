import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowPopup(true);
    } else {
      setHasConsented(consent === "accepted");
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowPopup(false);
    setHasConsented(true);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowPopup(false);
    setHasConsented(false);
    // Optionally implement logic to disable non-essential cookies here
  };

  const handleClose = () => {
    setShowPopup(false);
    // Optionally, you might want to set a temporary preference (e.g., session storage)
    // to avoid showing the popup on every page load if the user doesn't explicitly accept or reject.
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-700 border-t border-gray-800 p-4 flex flex-col md:flex-row justify-between items-center shadow-md transition-transform duration-300 ease-out">
      <div className="flex-grow md:mr-4 mb-2 md:mb-0">
        <p className="text-gray-100 text-sm leading-relaxed">
          We use cookies to enhance your browsing experience, analyze site
          traffic, and personalize content. By clicking "Accept," you consent to
          the use of all cookies as described in our 
          <Link
            to="/privacy-policy"
            className="text-cyan-500 hover:underline ml-1"
            target="_blank"

          >
            Privacy Policy
          </Link>
          . You can manage your preferences or reject non-essential cookies by
          clicking "Reject."
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleAccept}
          className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
        >
          Accept All
        </button>
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200"
        >
          Reject All
        </button>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full transition-colors duration-200"
        >
          <MdCancel className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
