import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import CommentForm from "./CommentForm";

const CommentSlider = ({ comments, albumId }) => {
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [updatedComments, setUpdatedComments] = useState(comments);

  const handleCommentPosted = () => {
    setNewCommentAdded(true);
  };

  useEffect(() => {
    setUpdatedComments(comments);
    setNewCommentAdded(false);
  }, [comments, newCommentAdded]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <>
      <div className="relative bg-gray-900 text-cyan-500 px-4 md:px-8 py-4">
        <div className="w-full mb-6">
          <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
            Comments ({updatedComments.length})
            <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
          </h1>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={10}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {updatedComments.map((comment, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    className="w-12 h-12 rounded-full"
                    src='https://dummyimage.com/50x50'
                    alt={comment.name}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{comment.name}</h3>
                    <span className="text-gray-400 text-sm">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300">{comment.comment}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <CommentForm albumId={albumId} onCommentPosted={handleCommentPosted} />
    </>
  );
};

export default CommentSlider;
