const handleShare = ({ songId, albumId }) => {
    try {
      let shareUrl;
      if (songId && albumId) {
        shareUrl = `https://odgmusic.com/song/${songId}`;
      } else if (albumId) {
        shareUrl = `https://odgmusic.com/album/${albumId}`;
      } else {
        throw new Error("Either songId or albumId must be provided.");
      }
  
      const message = encodeURIComponent(
        `Check out this amazing ${
          songId ? "Song" : "Album"
        } on odg music: ${shareUrl}`
      );
  
      const socialMediaLinks = {
        whatsapp: `https://wa.me/?text=${message}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        x: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${message}`,
        instagram: "https://www.instagram.com/",
      };
  
      return { shareUrl, socialMediaLinks };
    } catch (error) {
      console.error("Error sharing:", error);
      // Optionally, handle the error (e.g., return null or an error object)
      // return null; // or
      return { shareUrl: null, socialMediaLinks: null }; // Or return an error object
    }
  };
  
  export default handleShare;