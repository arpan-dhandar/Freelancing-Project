import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest.js";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Helper for the "Active" logic (scrolled or not on home page)
  const isTransparent = !active && pathname === "/";

  return (
    <div
      className={`sticky top-0 z-[999] flex flex-col items-center transition-all duration-500 ease-in-out ${
        isTransparent ? "bg-[#013914] text-white" : "bg-white text-black"
      }`}
    >
      {/* Container: .container */}
      <div className="w-full max-w-[1400px] flex items-center justify-between py-5">
        
        {/* Logo Section */}
        <div className="text-[34px] font-bold tracking-tight">
          <Link to="/" className="text-inherit no-underline">
            <span>Scarr</span>
          </Link>
          <span className="text-[#1dbf73]">.</span>
        </div>

        {/* Links Section */}
        <div className="flex items-center gap-6 font-medium font-['Montserrat']">
          <span className="whitespace-nowrap cursor-pointer">Fiverr Business</span>
          <span className="whitespace-nowrap cursor-pointer">Explore</span>
          <span className="whitespace-nowrap cursor-pointer">English</span>
          {!currentUser?.isSeller && <span className="cursor-pointer">Become a Seller</span>}
          
          {currentUser ? (
            <div 
              className="relative flex items-center gap-2.5 cursor-pointer" 
              onClick={() => setOpen(!open)}
            >
              <img 
                src={currentUser.img || "/img/noavatar.jpg"} 
                alt="" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{currentUser?.username}</span>
              
              {/* Dropdown Options: .options */}
              {open && (
                <div className="absolute top-[50px] right-0 p-5 bg-white rounded-lg border border-gray-200 flex flex-col gap-2.5 w-[200px] font-light text-gray-500 z-[999] shadow-lg">
                  {currentUser.isSeller && (
                    <>
                      <Link className="text-inherit no-underline" to="/mygigs">Gigs</Link>
                      <Link className="text-inherit no-underline" to="/add">Add New Gig</Link>
                    </>
                  )}
                  <Link className="text-inherit no-underline" to="/orders">Orders</Link>
                  <Link className="text-inherit no-underline" to="/messages">Messages</Link>
                  <span className="cursor-pointer" onClick={handleLogout}>Logout</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-inherit no-underline">Sign in</Link>
              <Link to="/register">
                <button className={`py-2 px-5 rounded-md border cursor-pointer transition-all duration-300 ${
                  isTransparent 
                  ? "bg-transparent text-white border-white hover:bg-[#1dbf73] hover:border-[#1dbf73]" 
                  : "bg-white text-[#1dbf73] border-[#1dbf73]"
                }`}>
                  Join
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Categories Menu (Conditional) */}
      {(!isTransparent) && (
        <>
          <hr className="w-full h-0 border-t-[0.5px] border-gray-200" />
          <div className="w-full max-w-[1400px] py-2.5 flex justify-between text-gray-500 font-light font-['Montserrat']">
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Graphics & Design</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Video & Animation</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Writing & Translation</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">AI Services</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Digital Marketing</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Music & Audio</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Programming & Tech</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Business</Link>
            <Link className="text-inherit no-underline hover:text-black transition" to="/">Lifestyle</Link>
          </div>
          <hr className="w-full h-0 border-t-[0.5px] border-gray-200" />
        </>
      )}
    </div>
  );
}

export default Navbar;