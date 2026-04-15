import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest.js";
import Reviews from "../components/Reviews.jsx";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Gig() {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error loading gig data.</div>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1400px] py-[30px] px-5 flex flex-col lg:flex-row gap-[50px]">
        
        {/* Left Section */}
        <div className="flex-[2] flex flex-col gap-[20px]">
          <h1 className="text-3xl font-bold">{data?.title}</h1>
          
          <div className="flex items-center gap-[10px]">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={dataUser?.img || "/img/noavatar.jpg"}
              alt=""
            />
            <span className="text-[14px] font-medium">{dataUser?.username || "Loading..."}</span>
          </div>

          {/* NEW SWIPER SLIDER */}
          <div className="bg-[#F5F5F5] rounded-md overflow-hidden">
            {data?.images?.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="mySwiper"
              >
                {data.images.map((img) => (
                  <SwiperSlide key={img}>
                    <img src={img} alt="" className="max-h-[500px] object-contain w-full" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-48 flex items-center justify-center">No images found</div>
            )}
          </div>

          <h2 className="font-normal text-xl mt-4">About This Gig</h2>
          <p className="font-light leading-[25px] text-[#555] whitespace-pre-line">{data?.desc}</p>

          <Reviews gigId={id} />
        </div>

        {/* Right Section */}
        <div className="flex-1 border border-gray-300 p-[20px] rounded-[5px] flex flex-col gap-[20px] h-max lg:sticky lg:top-[100px]">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{data?.shortTitle}</h3>
            <h2 className="font-light text-2xl">${data?.price}</h2>
          </div>
          <p className="text-gray-500 text-sm">{data?.shortDesc}</p>
          <Link to={`/pay/${id}`}>
            <button className="w-full bg-[#1dbf73] p-[10px] text-white font-medium text-[18px] hover:bg-[#19a463] transition-all">
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Gig;