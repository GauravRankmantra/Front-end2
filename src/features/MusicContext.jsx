import React, { createContext, useState } from 'react';

// Create the context
export const MusicContext = createContext();

// Music Provider component
export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  // Method to play a new song
  const playSong = (song) => {
    setCurrentSong(song);
    // Save song info to localStorage or sessionStorage
    localStorage.setItem('currentSong', JSON.stringify(song));
  };

  // Load song from localStorage when app reloads
  React.useEffect(() => {
    const savedSong = JSON.parse(localStorage.getItem('currentSong'));
    if (savedSong) {
      setCurrentSong(savedSong);
    }
  }, []);

  return (
    <MusicContext.Provider value={{ currentSong, playSong }}>
      {children}
    </MusicContext.Provider>
  );
};
