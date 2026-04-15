import React from "react";

function Footer() {
  return (
    // Outer Wrapper: .footer
    <div className="flex justify-center text-[#666] my-[50px]">
      
      {/* Container: .container */}
      <div className="w-full max-w-[1400px]">
        
        {/* Top Section: .top */}
        <div className="flex justify-between">
          
          {/* Columns: .item */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[16px] text-[#555] font-semibold">Categories</h2>
            <span className="font-light">Graphics & Design</span>
            <span className="font-light">Digital Marketing</span>
            <span className="font-light">Writing & Translation</span>
            <span className="font-light">Video & Animation</span>
            <span className="font-light">Music & Audio</span>
            <span className="font-light">Programming & Tech</span>
            <span className="font-light">Data</span>
            <span className="font-light">Business</span>
            <span className="font-light">Lifestyle</span>
            <span className="font-light">Photography</span>
            <span className="font-light">Sitemap</span>
          </div>

          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[16px] text-[#555] font-semibold">About</h2>
            <span className="font-light">Press & News</span>
            <span className="font-light">Partnerships</span>
            <span className="font-light">Privacy Policy</span>
            <span className="font-light">Terms of Service</span>
            <span className="font-light">Intellectual Property Claims</span>
            <span className="font-light">Investor Relations</span>
            <span className="font-light">Contact Sales</span>
          </div>

          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[16px] text-[#555] font-semibold">Support</h2>
            <span className="font-light">Help & Support</span>
            <span className="font-light">Trust & Safety</span>
            <span className="font-light">Selling on Scarr</span>
            <span className="font-light">Buying on Scarr</span>
          </div>

          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[16px] text-[#555] font-semibold">Community</h2>
            <span className="font-light">Customer Success Stories</span>
            <span className="font-light">Community hub</span>
            <span className="font-light">Forum</span>
            <span className="font-light">Events</span>
            <span className="font-light">Blog</span>
            <span className="font-light">Influencers</span>
            <span className="font-light">Affiliates</span>
            <span className="font-light">Podcast</span>
            <span className="font-light">Invite a Friend</span>
            <span className="font-light">Become a Seller</span>
            <span className="font-light">Community Standards</span>
          </div>

          <div className="flex flex-col gap-[20px]">L
            <h2 className="text-[16px] text-[#555] font-semibold">More From Scarr</h2>
            <span className="font-light">Scarr Business</span>
            <span className="font-light">Scarr Pro</span>
            <span className="font-light">Scarr Logo Maker</span>
            <span className="font-light">Scarr Guides</span>
            <span className="font-light">Get Inspired</span>
            <span className="font-light">Scarr Select</span>
            <span className="font-light">ClearVoice</span>
            <span className="font-light">Scarr Workspace</span>
            <span className="font-light">Learn</span>
            <span className="font-light">Working Not Working</span>
          </div>
        </div>

        {/* Divider: hr */}
        <hr className="my-[50px] h-0 border-t border-[#ebe9e9]" />

        {/* Bottom Section: .bottom */}
        <div className="flex items-center justify-between">
          
          {/* Left Side: .left */}
          <div className="w-max flex items-center gap-[20px]">
            <h2 className="text-[20px] font-bold text-[#555]">Scarr</h2>
            <span className="text-[13px] whitespace-nowrap">
              © Scarr International Ltd. 2023
            </span>
          </div>

          {/* Right Side: .right */}
          <div className="w-max flex items-center gap-[30px]">
            {/* Social Icons: .social */}
            <div className="flex gap-[20px]">
              <img src="/img/twitter.png" alt="" className="w-6 h-6" />
              <img src="/img/facebook.png" alt="" className="w-6 h-6" />
              <img src="/img/linkedin.png" alt="" className="w-6 h-6" />
              <img src="/img/pinterest.png" alt="" className="w-6 h-6" />
              <img src="/img/instagram.png" alt="" className="w-6 h-6" />
            </div>

            {/* Language/Currency Links: .link */}
            <div className="flex items-center gap-[10px]">
              <img src="/img/language.png" alt="" className="w-6 h-6" />
              <span>English</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <img src="/img/coin.png" alt="" className="w-6 h-6" />
              <span>USD</span>
            </div>
            
            <img src="/img/accessibility.png" alt="" className="w-6 h-6" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Footer;