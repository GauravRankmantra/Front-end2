const getArtistNames = (artist) => {
  if (!artist) return 'Unknown Artist';

  if (typeof artist === 'string') return artist;

  if (Array.isArray(artist)) {
    return artist.map((a) => a.fullName || a).join(', ');
  }

  if (typeof artist === 'object' && artist.fullName) return artist.fullName;

  return 'Unknown Artist';
};

export default getArtistNames