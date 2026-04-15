import React, { useState } from "react";
import upload from "../utils/upload.js";
import newRequest from "../utils/newRequest.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Reusable Tailwind classes to match your SCSS
  const labelStyle = "text-gray-500 text-[18px]";
  const inputStyle =
    "p-5 border border-[rgb(216,214,214)] outline-none rounded-sm";

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[960px] py-[100px] px-0 flex gap-[120px]"
      >
        {/* LEFT SECTION */}
        <div className="flex-1 flex flex-col gap-[10px] justify-between">
          <h1 className="text-gray-500 mb-5 text-3xl font-bold">
            Create a new account
          </h1>

          <label className={labelStyle}>Username</label>
          <input
            className={inputStyle}
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />

          <label className={labelStyle}>Email</label>
          <input
            className={inputStyle}
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />

          <label className={labelStyle}>Password</label>
          <input
            className={inputStyle}
            name="password"
            type="password"
            onChange={handleChange}
          />

          <label className={labelStyle}>Profile Picture</label>
          <input
            type="file"
            className="p-2"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label className={labelStyle}>Country</label>
          <input
            className={inputStyle}
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="border-none p-5 text-white font-medium text-[18px] bg-[#1dbf73] cursor-pointer hover:bg-[#19a463] transition-colors mt-4"
          >
            Register
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 flex flex-col gap-[10px] justify-between">
          <h1 className="text-gray-500 mb-5 text-3xl font-bold">
            I want to become a seller
          </h1>

          <div className="flex items-center gap-[10px]">
            <label className={labelStyle}>Activate the seller account</label>
            <label className="relative inline-block w-[50px] h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0 peer"
                onChange={handleSeller}
              />
              <span
                className="absolute cursor-pointer inset-0 bg-[#ccc] transition-all duration-300 rounded-[24px] 
                before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition-all before:duration-300 before:rounded-full
                peer-checked:bg-[#2196f3] peer-checked:before:translate-x-[26px] peer-focus:shadow-[0_0_1px_#2196f3]"
              ></span>
            </label>
          </div>

          <label className={labelStyle}>Phone Number</label>
          <input
            className={inputStyle}
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />

          <label className={labelStyle}>Description</label>
          <textarea
            className={inputStyle}
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
