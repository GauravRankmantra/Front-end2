import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const addLike = async ({ songId, albumId }) => {
  try {
    const requestBody = {};
    if (songId) {
      requestBody.songId = songId;
    } else if (albumId) {
      requestBody.albumId = albumId;
    } else {
      // Handle the error case where neither songId nor albumId is provided
      throw new Error("Either songId or albumId must be provided");
    }

    const res = await axios.post(`${apiUrl}api/v1/like`, requestBody, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    // improved error handling
    console.error("Error in addLike:", error);
    throw error; // re-throw the error so the caller can handle it
  }
};

export default addLike;
