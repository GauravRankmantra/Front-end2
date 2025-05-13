import React from "react";
import { Link } from "react-router-dom";
import { FaMusic, FaChartLine, FaUsers, FaLock } from "react-icons/fa";

const SellSongLanding = () => {
  return (
    <div className="bg-gradient-to-br from-[#1b2039] mt-10 to-gray-800 min-h-screen text-white py-20">
      <header className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Unleash Your Sound. Earn with ODGMusic.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Join a vibrant community of artists and start selling your music to a
          global audience.
        </p>
        <Link
          to="/login"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out"
        >
          Start Selling Your Music
        </Link>
      </header>

      <section className="container mx-auto px-4 md:px-8 lg:px-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className=" rounded-lg shadow-2xl border border-gray-800 p-8 text-center">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaMusic />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Reach a Global Audience
            </h3>
            <p className="text-gray-300">
              Connect with music lovers worldwide and expand your reach beyond
              geographical boundaries.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="shadow-2xl border border-gray-800 rounded-lg  p-8 text-center">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Control Your Earnings
            </h3>
            <p className="text-gray-300">
              Set your own prices and track your sales performance with detailed
              analytics.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="shadow-2xl border border-gray-800 rounded-lg  p-8 text-center">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Join a Thriving Community
            </h3>
            <p className="text-gray-300">
              Collaborate with other artists, get feedback, and grow your
              network within the ODGMusic ecosystem.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="shadow-2xl border border-gray-800 rounded-lg p-8 text-center">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaLock />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Secure and Reliable Platform
            </h3>
            <p className="text-gray-300">
              Your music and data are protected with our robust security
              measures. Focus on your art, we'll handle the rest.
            </p>
          </div>

          {/* Feature 5 (Optional - can be about stemming benefits) */}
          <div className="shadow-2xl border border-gray-800 rounded-lg p-8 text-center">
            <div className="text-cyan-400 text-4xl mb-4">
              {/* Add a relevant icon for stemming */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6a2 2 0 00-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2h4a2 2 0 002-2zm7-16a2 2 0 00-2-2h-2a2 2 0 00-2 2v16a2 2 0 002 2h2a2 2 0 002-2V3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Unlock Stemming Power
            </h3>
            <p className="text-gray-300">
              Leverage our advanced music stemming technology to offer unique
              and customizable listening experiences for your fans.
            </p>
          </div>

          {/* Feature 6 (Optional - can be about support) */}
          <div className="rounded-lg  shadow-2xl border border-gray-800 p-8 text-center">
            <div className="text-cyan-400 text-4xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Dedicated Artist Support
            </h3>
            <p className="text-gray-300">
              Get the help you need with our dedicated support team, ensuring a
              smooth and successful selling journey.
            </p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 text-center py-12">
        <p className="text-gray-300 mb-4">Ready to take the next step?</p>
        <Link
          to="/login"
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out"
        >
          Login to Your Account
        </Link>
        <p className="mt-8 text-gray-400 text-sm">
          © {new Date().getFullYear()} ODGMusic. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SellSongLanding;
