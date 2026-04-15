import React, { useEffect, useRef, useState } from "react";
import GigCard from "../components/GigCard.jsx";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest.js";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  // 1. Get the dynamic category from the URL (e.g., ?cat=Design)
  const { search } = useLocation();

  // 2. Extract the category name for the Heading (Optional but Pro)
  const categoryName = new URLSearchParams(search).get("cat") || "Gigs";

  const { isLoading, error, data, refetch } = useQuery({
    // Adding search and sort to queryKey ensures automatic caching for each filter combo
    queryKey: ["gigs", search, sort], 
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search || "?"}&min=${minRef.current?.value || 0}&max=${
            maxRef.current?.value || 99999
          }&sort=${sort}`
        )
        .then((res) => {
          return res.data.data; 
        }),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  // Sync refetch whenever sorting changes via the dropdown
  useEffect(() => {
    refetch();
  }, [sort, search, refetch]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1400px] py-[30px] px-0 flex flex-col gap-[15px]">
        <span className="font-light uppercase text-[13px] text-[#555]">
          Liverr &gt; {categoryName} &gt;
        </span>
        
        {/* Now dynamic based on the URL category */}
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        
        <p className="text-[#999] font-light">
          Explore the boundaries of art and technology with Liverr's {categoryName.toLowerCase()}
        </p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-[10px] text-[#555] font-light">
            <span>Budget</span>
            <input 
              ref={minRef} 
              type="number" 
              placeholder="min" 
              className="p-[5px] border border-gray-300 rounded-[5px] outline-none"
            />
            <input 
              ref={maxRef} 
              type="number" 
              placeholder="max" 
              className="p-[5px] border border-gray-300 rounded-[5px] outline-none"
            />
            <button 
              onClick={apply}
              className="py-[5px] px-[10px] bg-[#1dbf73] text-white border-none font-medium rounded-[5px] cursor-pointer hover:bg-[#19a463] transition-all"
            >
              Apply
            </button>
          </div>

          <div className="relative flex items-center gap-[10px]">
            <span className="text-[#555] font-light">Sort by</span>
            <span className="font-medium text-gray-800 cursor-pointer" onClick={() => setOpen(!open)}>
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img 
              src="./img/down.png" 
              alt="down" 
              className="w-[15px] cursor-pointer" 
              onClick={() => setOpen(!open)} 
            />
            {open && (
              <div className="absolute top-[30px] right-0 p-5 bg-white border border-gray-200 rounded-[5px] flex flex-col gap-5 text-[#555] z-[9] shadow-md min-w-[120px]">
                <span className="cursor-pointer hover:text-[#1dbf73]" onClick={() => reSort("createdAt")}>Newest</span>
                <span className="cursor-pointer hover:text-[#1dbf73]" onClick={() => reSort("sales")}>Best Selling</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between flex-wrap gap-y-8">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.length > 0 
              ? data.map((gig) => <GigCard key={gig._id} item={gig} />)
              : "No gigs found for this criteria. Try adjusting your filters!"}
        </div>
      </div>
    </div>
  );
}

export default Gigs;