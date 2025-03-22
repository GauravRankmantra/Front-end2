import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/img/logo.jpeg";

import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faGooglePlusG,
} from "@fortawesome/free-brands-svg-icons";


const Footer = () => {

  return (
       <footer className="bg-gradient-to-b from-gray-900 mt-24 to-gray-400 text-gray-400 py-12 lg:px-36 px-12">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <img src={logo} className="w-28 h-24" />
                <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
                  Music Template
                </h3>
                <p className="text-white leading-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
    
              <div>
                <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
                  Useful Links
                </h3>
                <ul className="text-gray-100 space-y-4">
                  <li className="cursor-pointer hover:text-gray-300">Albums</li>
                  <li className="cursor-pointer hover:text-gray-300">Artists</li>
                  <li className="cursor-pointer hover:text-gray-300">Top Albums</li>
                </ul>
              </div>
    
              <div>
                <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
                  Subscribe
                </h3>
                <p className="text-gray-300 mb-4">
                  Subscribe to our newsletter and get the latest updates and
                  offers.
                </p>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="w-full p-2 mb-4 bg-gray-100 text-gray-300 rounded focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full p-2 mb-4 bg-gray-100 text-gray-300 rounded focus:outline-none"
                />
                <button className="w-full sm:w-6/12 bg-cyan-500 text-white py-2 rounded-3xl hover:bg-cyan-600 transition duration-200">
                  Sign Me Up
                </button>
              </div>
    
              <div>
      <h3 className="footer-title relative text-cyan-400 text-xl mb-2 space-y-4">Contact Us</h3>
      <p className="text-gray-300">
        <strong>Call Us:</strong> (+1) 202-555-0176, (+1) 2025-5501
      </p>
      <p className="text-gray-300">
        <strong>Email Us:</strong> info@gmail.com
      </p>
      <p className="text-gray-300 mb-4">
        <strong>Walk In:</strong> 598 Old House Drive, London
      </p>
      
      <h3 className="text-cyan-400 text-xl mb-2">Follow Us</h3>
      <div className="flex space-x-3">
        <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
          <FontAwesomeIcon icon={faFacebookF} className="text-white" />
        </a>
        <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
          <FontAwesomeIcon icon={faLinkedinIn} className="text-white" />
        </a>
        <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
          <FontAwesomeIcon icon={faTwitter} className="text-white" />
        </a>
        <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
          <FontAwesomeIcon icon={faGooglePlusG} className="text-white" />
        </a>
      </div>
    </div>
    
            </div>
          </footer>
  )
}

export default Footer
