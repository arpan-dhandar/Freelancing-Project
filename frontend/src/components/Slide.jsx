import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  return (
    <div className="slide-container py-12 px-0 flex justify-center">
      <div className="container w-[1400px]">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={slidesToShow || 5}
          slidesPerGroup={arrowsScroll || 1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {React.Children.map(children, (child) => (
            <SwiperSlide>{child}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slide;