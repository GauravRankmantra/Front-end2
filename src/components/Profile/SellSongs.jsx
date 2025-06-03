import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import {
  FaCreditCard,
  FaLink,
  FaInfoCircle,
  FaHourglassHalf,
  FaPaperPlane,
  FaTimesCircle,
  FaEnvelope,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  FaBible,
  FaCloudUploadAlt,
  FaImage,
  FaMusic,
  FaPlay,
  FaChevronDown,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MdDelete } from "react-icons/md";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  clearQueue,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import Loading from "../Loading";
import UserStatsCharts from "./UserStatsCharts";
import SellerStats from "./SellerStats";
import { updateUser } from "../../features/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;

const dayMap = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};
const SellSongs = () => {
  const user = useSelector((state) => state.user.user);
  const [userAlbums, setUserAlbums] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const [downloadData, setDownloadData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAlbumUploadModalOpen, setIsAlbumUploadModalOpen] = useState(false);
  const [expandedSongId, setExpandedSongId] = useState(null);

  const [animate, setAnimate] = useState(false);

  const [songSelected, setSongSelected] = useState(true);
  const [albumSelected, setAlbumSelected] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState([
    { _id: user._id, fullName: user.fullName },
  ]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];
  const [uploadFormAlbum, setUploadFormAlbum] = useState({
    title: "",
    price: 0,
    genre: "",
    company: "",
    isPaid: false,
    artists: [{ _id: user._id, fullName: user.fullName }],
    artistInput: "",
    coverImage: null,
    coverImagePreview: "",
  });

  const [artistSuggestions, setArtistSuggestions] = useState([]);

  const toggleExpand = (songId) => {
    setExpandedSongId(expandedSongId === songId ? null : songId);
  };
  const [uploadForm, setUploadForm] = useState({
    title: "",
    artists: [],

    genre: "",
    album: [],
    lowAudio: null,
    highAudio: null,
    coverImage: null,
    price: 0,
    freeDownload: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.error("Please log in to sell songs.");
    } else {
      fetchUploadedSongs();
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/genre"
        );
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast.error("Failed to fetch genres. Please try again.");
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}api/v1/albums/userAlbum/${user._id}`
        );
        setAlbums(response?.data?.albums);
      } catch (error) {
        console.error("Error fetching Album:", error);
        toast.error("Failed to fetch Albums. Please try again.");
      }
    };
    fetchGenres();
  }, []);

  const fetchUploadedSongs = async () => {
    setLoadingFetch(true);
    try {
      const res = await axios.get(
        `${apiUrl}api/v1/user/getUserSongs${user._id}`
      );

      setUploadedSongs(res.data?.songs || []);
      setLoadingFetch(false);
    } catch (err) {
      setError(err.response?.message || "An error occurred");
    } finally {
      setLoading(false);
      setLoadingFetch(false);
    }
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadForm({
      title: "",
      artists: [],
      genre: "",
      album: "",
      lowAudio: null,
      highAudio: null,
      coverImage: null,
      price: 0,
      freeDownload: false,
    });
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm({ ...uploadForm, [name]: value });
  };
  const handleInputChange2 = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUploadFormAlbum((prev) => ({ ...prev, [name]: newValue }));
  };
  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
  };

  const handleImageChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFormAlbum((prev) => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleArtistInputChange = async (e) => {
    const value = e.target.value;
    setUploadFormAlbum((prev) => ({ ...prev, artistInput: value }));
    if (value.length >= 2) {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }api/v1/user/artist/search?search=${value}`
        );
        setArtistSuggestions(res.data.data || []);
      } catch (err) {
        setArtistSuggestions([]);
      }
    } else {
      setArtistSuggestions([]);
    }
  };

  const addArtist = (artist) => {
    if (uploadFormAlbum.artists.find((a) => a._id === artist._id)) return;
    if (uploadFormAlbum.artists.length >= 3) return;
    setUploadFormAlbum((prev) => ({
      ...prev,
      artists: [...prev.artists, artist],
      artistInput: "",
    }));

    setArtistSuggestions([]);
  };

  const removeArtist = (id) => {
    setUploadFormAlbum((prev) => ({
      ...prev,
      artists: prev.artists.filter((a) => a._id !== id),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm({
        ...uploadForm,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleAudioChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUploadForm({ ...uploadForm, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (
      !uploadForm.coverImage ||
      !uploadForm.title ||
      !uploadForm.genre ||
      uploadForm.price === null ||
      !uploadForm.lowAudio ||
      !uploadForm.highAudio
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", uploadForm.coverImage);
    formData.append("artists", JSON.stringify([user._id]));
    formData.append("title", uploadForm.title);
    formData.append("price", uploadForm.price);
    formData.append("low", uploadForm.lowAudio);
    formData.append("high", uploadForm.highAudio);
    formData.append("genre", uploadForm.genre);
    if (!uploadForm.album == "") formData.append("album", uploadForm.album);

    try {
      const response = await axios.post(`${apiUrl}api/v1/song`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadLoading(false);
        toast.success("Song uploaded successfully!");
        closeUploadModal();
        fetchUploadedSongs();

        setUploadForm({
          coverImage: null,
          coverImagePreview: "",
          title: "",
          price: 0,
          genre: "",
          album: "",
          artists: [],
          lowAudio: null,
          highAudio: null,
        });
      } else {
        toast.error(response.data.message || "Failed to upload song.");
      }
    } catch (error) {
      console.error("Error uploading song:", error);
      toast.error("Error uploading song.");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    if (
      !uploadFormAlbum.title ||
      !uploadFormAlbum.coverImage ||
      !uploadFormAlbum.genre ||
      selectedArtists.length === 0
    ) {
      toast.error(
        "Please fill all required fields including at least one artist."
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadFormAlbum.title);
    formData.append("genre", uploadFormAlbum.genre);
    formData.append("coverImage", uploadFormAlbum.coverImage);
    formData.append("company", uploadFormAlbum.company);

    if (uploadFormAlbum.isPaid && uploadFormAlbum.price) {
      formData.append("price", uploadFormAlbum.price);
    }

    // Append selected artist IDs as JSON array
    const artistIds = uploadFormAlbum.artists.map((artist) => artist._id);
    formData.append("artist", JSON.stringify(artistIds));

    try {
      setUploadLoading(true);

      const response = await axios.post(
        `${apiUrl}api/v1/albums`, // Update if your API route is different
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Album uploaded successfully!");
        setIsAlbumUploadModalOpen(false);
        setUploadFormAlbum({
          title: "",
          price: 0,
          genre: "",
          company: "",
          isPaid: false,
          artists: [{ _id: user._id, fullName: user.fullName }],
          artistInput: "",
          coverImage: null,
          coverImagePreview: "",
        });
        setSelectedArtists([]);
      } else {
        toast.error(response.data.message || "Failed to upload album.");
      }
    } catch (error) {
      console.error("Error uploading album:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handelSongDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}api/v1/song/${id}`);
      toast.success("Deleted Successfully");
      dispatch(clearQueue);
      setUploadedSongs((prevSongs) =>
        prevSongs.filter((song) => song._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete song. Please try again.");
    }
  };

  const addForVarification = async () => {
    try {
      setAnimate(true);
      const res = await axios.patch(
        `${apiUrl}api/v1/user/addVerifyReq`,
        {},
        { withCredentials: true }
      );
      if (!res) {
        setAnimate(false);
      } else {
        toast.success("Request submitted successfully");
        dispatch(updateUser({ verificationState: "pending" }));
        setTimeout(() => {
          setAnimate(false);
        }, 200);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  if (!user.stripeId) {
    return (
      <div className="flex justify-center font-josefin-r items-center py-10 min-h-screen ">
        <div className=" p-8 md:p-10 rounded-lg shadow-xl max-w-xl w-full text-center border border-red-200">
          {/* Icon for visual emphasis */}
          <div className="text-red-500 text-5xl mb-6">
            <FaCreditCard className="mx-auto" /> {/* React Icon */}
          </div>

          <h2 className="text-3xl font-extrabold text-red-600 mb-4">
            Action Required: Connect Your Stripe Account
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            To unlock your earnings and manage payouts seamlessly, you need to
            connect your Stripe account with ODG Music. This is a one-time setup
            process to ensure secure transactions and timely withdrawals.
          </p>

          <button
            onClick={() => navigate("/dashboard/withdrawal")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out flex items-center justify-center w-full focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
          >
            <FaLink className="text-2xl mr-3" /> {/* React Icon */}
            Connect Your Stripe Account Now
          </button>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-md mt-6 flex items-start">
            <FaInfoCircle className="text-blue-600 text-xl mr-3 mt-1" />{" "}
            {/* React Icon */}
            <p className="text-left flex-grow">
              Don't have a Stripe account? You can easily create one during the
              connection process.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user.isVerified) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 text-white shadow-xl rounded-xl transition-colors duration-300 flex flex-col justify-center items-center text-center">
        {user.verificationState == "pending" ? (
          <div className="flex flex-col justify-center items-center space-y-4">
            <FaHourglassHalf className="text-orange-400 text-5xl mb-2 animate-pulse" />
            <h2 className="text-3xl font-bold text-orange-300">
              Verification Pending
            </h2>
            <p className="text-gray-300 text-center max-w-md">
              Your profile is currently under review by our team. We're
              carefully assessing your eligibility to sell music on ODG Music.
              Please be patient; we'll notify you via email as soon as a
              decision has been made.
            </p>
          </div>
        ) : (
          <div>
            {user.verificationState == "no" ? (
              <>
                {animate ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500 mx-auto mt-2"></div>
                ) : (
                  <div className="flex flex-col space-y-6 justify-center items-center">
                    <FaExclamationTriangle className="text-yellow-400 text-5xl mb-2" />
                    <h2 className="text-3xl font-bold text-yellow-300 text-center">
                      Become a Verified Seller
                    </h2>
                    <p className="text-xl text-gray-400">
                      You're not yet authorized to sell songs on ODG Music. To
                      gain access to our vibrant marketplace and share your
                      creations, please submit a verification request. Our team
                      will review your profile.
                    </p>
                    <h2 className="text-lg text-gray-200">
                      You can send request for varification{" "}
                    </h2>
                    <button
                      onClick={addForVarification}
                      className="text-cyan-500 flex items-center border py-1 px-2 border-gray-700 hover:bg-cyan-500 hover:text-white rounded-lg"
                    >
                      <FaPaperPlane className="mr-3 text-xl" />
                      <span>Request Verification</span>
                    </button>
                    <p className="text-gray-400 text-xs mt-2 text-center">
                      This is a one-time process to ensure the quality and
                      authenticity of our sellers.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col font-josefin-r justify-center items-center space-y-4">
                <FaTimesCircle className="text-red-500 text-5xl mb-2" />
                <h2 className="text-3xl font-bold text-red-400">
                  Verification Denied
                </h2>
                <p className="text-gray-300 text-center max-w-md">
                  Unfortunately, your previous verification request was denied
                  by our team. We understand this can be disappointing.
                </p>
                <p className="text-gray-300 text-center max-w-md">
                  For further instructions or to understand the reasons for
                  denial, please reach out to us directly via email. We're here
                  to help!
                </p>
                <a
                  href="mailto:support@odgmusic.com" // Replace with your actual support email
                  className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-opacity-75"
                >
                  <FaEnvelope className="mr-3 text-2xl" />
                  Contact Support
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="md:px-4 px-2 font-josefin-m py-10 rounded-md shadow-md">
      {/* Upload New Song Section */}

      <div className="mb-6 flex space-x-2">
        <button
          onClick={openUploadModal}
          className="bg-cyan-500 hover:bg-cyan-600  text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <FaCloudUploadAlt className="inline-block mr-2" /> Upload New Song
        </button>
        {/* <button
          onClick={() => setIsAlbumUploadModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <FaCloudUploadAlt className="inline-block mr-2" /> Add New Album
        </button> */}
      </div>

      {/* Song Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 no-scrollbar bg-black bg-opacity-60 z-[1000] flex items-start justify-center overflow-y-auto px-4 pt-10 pb-10 sm:pt-20">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 sm:p-8 overflow-y-auto max-h-[95vh] relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload New Song
            </h2>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-5"
            >
              {/* Cover Image */}
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cover Image
                </label>
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md">
                  {uploadForm.coverImagePreview ? (
                    <img
                      src={uploadForm.coverImagePreview}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaImage className="text-gray-400 text-2xl" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={uploadForm.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Genre */}
              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={uploadForm.genre}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label
                  htmlFor="album"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Albums
                </label>
                {!albums || albums.length == 0 ? (
                  <>
                    <p className="text-xs text-red-500">
                      Currently you dont have any album,
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong className="text-black underline cursor-pointer mr-1">
                        Add a album{" "}
                      </strong>{" "}
                      first If you want to add this song to a Album
                    </p>
                  </>
                ) : (
                  <select
                    id="album"
                    name="album"
                    value={uploadForm.album}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Select Album</option>

                    {albums.map((album) => (
                      <option key={album._id} value={album._id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                )}
              </div> */}

              {/* Audio Low */}
              <div>
                <label
                  htmlFor="lowAudio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Audio (Low Quality)
                </label>
                <input
                  type="file"
                  id="lowAudio"
                  name="lowAudio"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* Audio High */}
              <div>
                <label
                  htmlFor="highAudio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Audio (High Quality)
                </label>
                <input
                  type="file"
                  id="highAudio"
                  name="highAudio"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <div className="flex items-center">
                  {uploadLoading ? (
                    <div className="animate-spin mx-4 my-2 rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 transition"
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Album Upload Modal */}
      {isAlbumUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] overflow-y-auto flex justify-center items-start p-4">
          <div className="bg-white w-full max-w-2xl mt-20 rounded-xl shadow-xl p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Album
            </h2>
            <form onSubmit={handleSubmit2} className="space-y-5">
              <div className="flex flex-col items-center border border-dashed p-2">
                <label className="mb-1 text-gray-700">Upload Cover Image</label>
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  {uploadFormAlbum.coverImagePreview ? (
                    <img
                      src={uploadFormAlbum.coverImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaImage className="text-2xl text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange2}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <input
                type="text"
                name="title"
                placeholder="Album Title"
                value={uploadFormAlbum.title}
                onChange={handleInputChange2}
                className="w-full border rounded px-3 py-2"
                required
              />

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Is Paid?
                </label>
                <label>
                  <input
                    type="radio"
                    name="isPaid"
                    checked={!uploadFormAlbum.isPaid}
                    onChange={() =>
                      setUploadForm({ ...uploadFormAlbum, isPaid: false })
                    }
                  />{" "}
                  Free
                </label>
                <label>
                  <input
                    type="radio"
                    name="isPaid"
                    checked={uploadFormAlbum.isPaid}
                    onChange={() =>
                      setUploadFormAlbum({ ...uploadFormAlbum, isPaid: true })
                    }
                  />{" "}
                  Paid
                </label>
              </div>

              {uploadFormAlbum.isPaid && (
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={uploadFormAlbum.price}
                  onChange={handleInputChange2}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              )}

              <select
                name="genre"
                value={uploadFormAlbum.genre}
                onChange={handleInputChange2}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="company"
                placeholder="Company"
                value={uploadFormAlbum.company}
                onChange={handleInputChange2}
                className="w-full border rounded px-3 py-2"
                required
              />

              {/* Artist Search */}
              <div>
                <input
                  type="text"
                  value={uploadFormAlbum.artistInput}
                  onChange={handleArtistInputChange}
                  placeholder="Search Artist..."
                  className="w-full border rounded px-3 py-2"
                />
                {artistSuggestions.length > 0 && (
                  <ul className="bg-white border mt-1 rounded shadow text-sm max-h-40 overflow-y-auto">
                    {artistSuggestions.map((artist) => (
                      <li
                        key={artist._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addArtist(artist)}
                      >
                        {artist.fullName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Selected Artists */}
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadFormAlbum.artists.map((artist, index) => (
                  <span
                    key={artist._id}
                    className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full flex items-center"
                  >
                    {artist.fullName}
                    {index == 0 ? (
                      <div></div>
                    ) : (
                      <FaTimes
                        className="ml-2 text-sm cursor-pointer"
                        onClick={() => removeArtist(artist._id)}
                      />
                    )}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAlbumUploadModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  {loading ? "Uploading..." : "Add Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Uploaded Songs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Your Upload's
        </h2>

        <div className="flex space-x-5 my-4 ">
          <button
            onClick={() => {
              setSongSelected(true);
              setAlbumSelected(false);
            }}
            className={`${
              songSelected
                ? `text-white border-b-[1px]`
                : `text-gray-400 border-b-[0px]`
            } px-2 py-1  border-cyan-500`}
          >
            Songs
          </button>
          {/* <button
            onClick={() => {
              setSongSelected(false);
              setAlbumSelected(true);
            }}
            className={`${
              albumSelected
                ? `text-white border-b-[1px]`
                : `text-gray-400 border-b-[0px]`
            } px-2 py-1  border-cyan-500`}
          >
            Albums
          </button> */}
        </div>

        {loadingFetch ? (
          <Loading />
        ) : (
          <>
            {songSelected ? (
              <div>
                {uploadedSongs.length > 0 ? (
                  <ul className=" space-y-6">
                    {uploadedSongs.map((song) => (
                      <li
                        key={song._id}
                        className="bg-[#1b2039] relative rounded-md shadow-sm p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {song.coverImage ? (
                              <img
                                src={song.coverImage}
                                alt={song.title}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                                <FaMusic className="text-gray-100 text-lg" />
                              </div>
                            )}
                            <div>
                              <p className="text-xl font-medium text-gray-100">
                                {song.title}
                              </p>
                              <p className=" text-gray-300">
                                Price:{" "}
                                <span className="text-green-500">
                                  $ {song.price}
                                </span>
                              </p>

                              {/* Display other relevant song info */}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {song.audioUrls?.high || song.audioUrls?.low ? (
                              <button
                                onClick={() => handleSongClick(song)}
                                className="p-2 rounded-full text-cyan-600 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title="Play"
                              >
                                <FaPlay className="h-5 w-5" />
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No Audio
                              </span>
                            )}
                            {/* Add options to edit or delete songs later */}
                            <button
                              onClick={() => handelSongDelete(song._id)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <MdDelete className="text-2xl" />
                            </button>
                          </div>
                        </div>
                        {/* Expandable section */}
                        {expandedSongId === song._id && (
                          <div className="mt-4 p-4 bg-[#1b2039] space-y-1 rounded-md">
                            <h3 className="text-lg font-semibold text-gray-100 mb-2">
                              More Details
                            </h3>
                            <p className=" text-gray-100">
                              Uploaded At:{" "}
                              {new Date(song.createdAt).toLocaleDateString()}
                            </p>
                            <p className=" text-gray-300">
                              Duration: {song.duration}
                            </p>
                            <p className=" text-gray-300">
                              Purchased Count: 21
                            </p>
                            <p className=" text-gray-300">
                              Genre: {song.genre?.name}
                            </p>
                            <p className=" text-gray-200">
                              Plays: {song.plays}
                            </p>
                            <p className="text-gray-100">
                              Published:{" "}
                              <span
                                className={`${
                                  song.isPublished
                                    ? `text-green-500`
                                    : `text-red-500`
                                }`}
                              >
                                {song.isPublished ? "Yes" : "No"}
                              </span>
                            </p>
                            {/* Add any other details you want to display here */}
                          </div>
                        )}
                        {/* Arrow button for expanding */}
                        <div className="flex absolute bottom-0 left-1/2 justify-center mt-2">
                          <button
                            onClick={() => toggleExpand(song._id)}
                            className={`text-gray-300 hover:text-gray-700 focus:outline-none transition-transform duration-200 ${
                              expandedSongId === song._id ? "rotate-180" : ""
                            }`}
                            title="View More Details"
                          >
                            <FaChevronDown className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    You haven't uploaded any songs yet.
                  </p>
                )}
              </div>
            ) : (
              <div>
                {albums.length > 0 ? (
                  <ul className=" space-y-6">
                    {albums.map((album) => (
                      <li
                        onClick={() => navigate(`/album/${album._id}`)}
                        key={album._id}
                        className="bg-[#1b2039] cursor-pointer relative rounded-md shadow-sm p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {album.coverImage ? (
                              <img
                                src={album.coverImage}
                                alt={album.title}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                                <FaMusic className="text-gray-100 text-lg" />
                              </div>
                            )}
                            <div>
                              <p className="text-xl font-medium text-gray-100">
                                {album.title}
                              </p>
                              <p className=" text-gray-300">
                                Price:{" "}
                                <span className="text-green-500">
                                  $ {album.price}
                                </span>
                              </p>

                              {/* Display other relevant song info */}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    You haven't uploaded any songs yet.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <UserStatsCharts userId={user._id} />
      <div>
        <SellerStats sellerId={user._id} />
      </div>
    </div>
  );
};

export default SellSongs;
