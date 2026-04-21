import config from "../config/config.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, isSeller: user.isSeller },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY }
  );

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, country = "Unknown", isSeller = false, desc = "" } = req.body;

  if (!username || !email || !password)
    throw new ApiError(400, "Username, email and password are required.");

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new ApiError(409, "Username or email already taken.");

  // Hash password manually — completely bypasses pre-save hook
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    country,
    isSeller,
    desc,
  });

  const created = await User.findById(newUser._id).select("-password -refreshToken");
  return res.status(201).json(new ApiResponse(201, created, "Account created successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new ApiError(400, "Username and password are required.");

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found.");

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) throw new ApiError(400, "Wrong username or password.");

  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await User.findByIdAndUpdate(
    user._id,
    { $set: { refreshToken } },
    { returnDocument: "after" }
  );

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, { user: userObj, accessToken }, "Logged in successfully."));
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.userId,
    { $unset: { refreshToken: 1 } },
    { returnDocument: "after" }
  );
  return res
    .clearCookie("accessToken",  { httpOnly: true, sameSite: "lax", path: "/" })
    .clearCookie("refreshToken", { httpOnly: true, sameSite: "lax", path: "/" })
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully."));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken;
  if (!incoming) throw new ApiError(401, "No refresh token. Please log in.");

  let decoded;
  try {
    decoded = jwt.verify(incoming, config.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(403, "Refresh token invalid or expired.");
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== incoming)
    throw new ApiError(403, "Refresh token revoked. Please log in again.");

  const newAccessToken = generateAccessToken(user);
  return res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed."));
});