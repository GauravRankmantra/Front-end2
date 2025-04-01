import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
const apiUrl = import.meta.env.VITE_API_URL;

const CommentForm = ({ albumId, onCommentPosted }) => { // Added onCommentPosted prop
  //   const user = useSelector((state) => state?.user?.user);

  // States for form data and errors
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // Function to validate and submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !comment) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Clear error if validation passes
      setError("");

      // Prepare data to send to the backend
      const commentData = {
        name,
        email,
        comment,
        albumId,
      };

      // Make API call to backend using axios
      const response = await axios.post(
        `${apiUrl}api/v1/albums/comment`,
        commentData
      );

      // Handle the success response (e.g., show a success message or reset form)
      toast.success("Comment submitted successfully!", { // Use toast here
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Trigger re-render in parent component
      onCommentPosted(); // Call the callback function

      // Clear the form after successful submission
      setName("");
      setEmail("");
      setComment("");
    } catch (err) {
      console.error(err);
      // Handle the error (e.g., show error message to the user)
      setError(
        "Something went wrong while submitting the comment. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col w-full  py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="w-full mb-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          Leave a comment
          <div className="absolute bottom-0  w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
      </div>
      <form
        className="flex w-full flex-wrap justify-between items-center gap-4 px-2"
        onSubmit={handleSubmit}
      >
        {/* Name and Email Section */}
        <div className="flex flex-col space-y-2 w-full md:w-1/3">
          <input
            className="p-2 w-full border border-gray-300 rounded"
            type="text"
            placeholder="Enter your Name here"
            value={name}
            onChange={(e) => setName(e.target.value)} // Set name value
          />
          <input
            className="p-2 w-full border border-gray-300 rounded"
            type="email"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Set email value
          />
        </div>

        {/* Comment Section */}
        <div className="w-full md:w-2/3">
          <textarea
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="5"
            placeholder="Enter your comment here"
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Set comment value
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="bg-cyan-500 p-2 rounded-xl text-white w-full md:w-auto"
          >
            Post your comment
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full text-red-500 text-sm mt-2">{error}</div>
        )}
      </form>
    </div>
  );
};

export default CommentForm;
