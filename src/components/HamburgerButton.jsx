// src/components/HamburgerButton.jsx
import React from 'react';

const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <button
      className="lg:hidden flex items-center justify-center p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white z-[71]"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="block w-6 transform transition-all duration-300">
        <span
          className={`block absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : '-translate-y-2'
          }`}
        ></span>
        <span
          className={`block absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : ''
          }`}
        ></span>
        <span
          className={`block absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-2' : 'translate-y-2'
          }`}
        ></span>
      </div>
    </button>
  );
};

export default HamburgerButton;