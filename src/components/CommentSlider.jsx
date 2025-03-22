import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // Ensure you import the CSS for navigation
import { Navigation } from "swiper/modules";

const CommentSlider = ({ comments }) => {
  return (
    <div className="relative bg-gray-900 text-cyan-500 px-4 md:px-8 py-4">
      <div className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={10} // Adjust the spacing between slides for mobile
        loop={true}
        breakpoints={{
          // when window width is >= 320px (mobile)
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // when window width is >= 640px (tablet)
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // when window width is >= 1024px (desktop)
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {comments.map((comment, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center mb-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src={comment.avatar}
                  alt={comment.name}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{comment.name}</h3>
                  <span className="text-gray-400 text-sm">
                    {comment.timeAgo}
                  </span>
                </div>
              </div>
              <p className="text-gray-300">{comment.commentText}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper Navigation */}
      {/* <div className="swiper-button-prev absolute   left-5 translate-y-1/2 text-white cursor-pointer"></div>
      <div className="swiper-button-next absolute  right-5 translate-y-1/2 text-white  cursor-pointer"></div> */}
    </div>
  );
};

export default CommentSlider;
