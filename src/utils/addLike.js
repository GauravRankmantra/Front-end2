import axios from "axios";
// updateUser is still imported, but useDispatch is removed from here
import { updateUser } from "../features/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;

// addLike now accepts dispatch as an argument
const addLike = async ({ songId, albumId, dispatch }) => {
  console.log("songid at handel add to fav ", songId);

  try {
    const requestBody = {};
    if (songId) {
      requestBody.songId = songId;
    } else if (albumId) {
      requestBody.albumId = albumId;
    } else {
      throw new Error("Either songId or albumId must be provided");
    }

    console.log("requestBody", requestBody);

    const res = await axios.post(`${apiUrl}api/v1/like`, requestBody, {
      withCredentials: true,
    });

    // Dispatch the action if the API call is successful
    // Make sure to handle the case where you might want to add albumId to likedAlbums if that's a thing
    if (songId) {
      dispatch(updateUser({ likedSongs: [songId] }));
    }
    // else if (albumId) {
    //   dispatch(updateUser({ likedAlbums: [albumId] })); // Assuming you have likedAlbums in your userSlice
    // }

    return res;
  } catch (error) {
    console.error("Error in addLike:", error);
    throw error;
  }
};

export default addLike;