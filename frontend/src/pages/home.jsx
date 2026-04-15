import React from "react";
import Featured from "../components/Featured.jsx";
import Slide from "../components/Slide.jsx";
import CatCard from "../components/CatCard.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { cards, projects } from "../data.js";

function Home() {
  return (
    <div className="home">
      <Featured />

      {/* Category Slide */}
      <div className="flex justify-center py-10">
        <div className="w-[1400px]">
          <Slide slidesToShow={5} arrowsScroll={5}>
            {cards.map((card) => (
              <CatCard key={card.id} card={card} />
            ))}
          </Slide>
        </div>
      </div>

      {/* Features Section (Light) */}
      <div className="bg-[#f1fdf7] flex justify-center py-[100px]">
        <div className="w-[1400px] flex items-center gap-[200px]">
          <div className="flex-[2] flex flex-col gap-[15px]">
            <h1 className="text-3xl font-medium mb-[10px] text-[#404145]">
              A whole world of freelance talent at your fingertips
            </h1>
            
            {[
              { 
                title: "The best for every budget", 
                desc: "Find high-quality services at every price point. No hourly rates, just project-based pricing." 
              },
              { 
                title: "Quality work done quickly", 
                desc: "Find the right freelancer to begin working on your project within minutes." 
              },
              { 
                title: "Protected payments, every time", 
                desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work." 
              },
              { 
                title: "24/7 support", 
                desc: "Find high-quality services at every price point. No hourly rates, just project-based pricing." 
              }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center gap-[10px] font-medium text-[18px] text-[#666]">
                  <img src="./img/check.png" alt="check" className="w-6 h-6" />
                  {item.title}
                </div>
                <p className="text-[18px] font-light text-gray-500 leading-[28px] tracking-[1px] mb-4">
                  {item.desc}
                </p>
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex-[3]">
            <video src="./img/video.mp4" controls className="w-[720px] rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* Explore Marketplace Section */}
      <div className="flex justify-center py-[100px]">
        <div className="w-[1400px]">
          <h1 className="text-3xl font-bold text-[#555] mb-12">
            Explore the marketplace
          </h1>
          <div className="flex flex-wrap justify-between gap-y-10">
            {[
              { name: "Graphics & Design", icon: "palette" },
              { name: "Digital Marketing", icon: "trending-up" },
              { name: "Writing & Translation", icon: "pen-tool" },
              { name: "Video & Animation", icon: "video" },
              { name: "Music & Audio", icon: "mic" },
              { name: "Programming & Tech", icon: "layout" },
              { name: "Business", icon: "briefcase" },
              { name: "Lifestyle", icon: "heart" },
              { name: "Data", icon: "bot" },
              { name: "Photography", icon: "camera" },
            ].map((cat, index) => (
              <div
                key={index}
                className="w-[250px] h-[150px] flex flex-col items-center justify-center gap-[10px] text-center cursor-pointer group"
              >
                <img
                  src={`/icons/${cat.icon}.svg`}
                  alt={cat.name}
                  className="w-[50px] h-[50px] transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "/icons/default.svg"; // Ensure this exists in public/icons
                  }}
                />
                <div className="w-[50px] h-[2px] bg-gray-200 transition-all duration-300 ease group-hover:w-[80px] group-hover:bg-[#1dbf73]" />
                <span className="font-light text-[#777] group-hover:text-black">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Dark (Scarr Business) */}
      <div className="bg-[#0d084d] flex justify-center py-[100px] text-white">
        <div className="w-[1400px] flex items-center gap-[200px]">
          <div className="flex-[2] flex flex-col gap-[15px]">
            <h1 className="text-2xl font-medium mb-[10px] text-white">
              Scarr <i className="font-light">business</i>
            </h1>
            <h1 className="text-4xl font-medium mb-[10px] text-white">
              A business solution designed for <i className="font-light">teams</i>
            </h1>
            <p className="text-[18px] font-light leading-[28px] tracking-[1px] mb-[20px] text-white">
              Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses
            </p>
            <div className="flex flex-col gap-[15px]">
              {[
                "Connect to freelancers with proven business experience",
                "Get matched with the perfect talent by a customer success manager",
                "Manage teamwork and boost productivity with one powerful workspace",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[10px] font-light text-[16px] text-white"
                >
                  <img src="./img/check.png" alt="check" className="w-6 h-6 invert" />
                  {text}
                </div>
              ))}
            </div>
            <button className="bg-[#1dbf73] text-white border-none py-[10px] px-[20px] rounded-[5px] w-max text-[16px] cursor-pointer mt-[20px] hover:bg-[#19a463] transition-all">
              Explore Scarr Business
            </button>
          </div>
          
        </div>
      </div>

      {/* Project Slide */}
      <div className="flex justify-center py-[100px]">
        <div className="w-[1400px]">
          <Slide slidesToShow={4} arrowsScroll={4}>
            {projects.map((card) => (
              <ProjectCard key={card.id} card={card} />
            ))}
          </Slide>
        </div>
      </div>
    </div>
  );
}

export default Home;