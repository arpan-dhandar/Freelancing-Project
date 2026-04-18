import config from "../config/config.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ── Token helpers ─────────────────────────────────────────────────────────────

/** Short-lived access token — signed with ACCESS_TOKEN_SECRET, expires in 15m */
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, isSeller: user.isSeller },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY } 
  );

/** Long-lived refresh token — signed with REFRESH_TOKEN_SECRET, expires in 1d */
const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY } 
  );

const baseCookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

// ── Controllers ───────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    country  = "Unknown",
    isSeller = false,
    desc     = "",
  } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email and password are required.");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new ApiError(409, "Username or email already taken.");

  const newUser = new User({ username, email, password, country, isSeller, desc });
  await newUser.save();

  const created = await User.findById(newUser._id).select("-password -refreshToken");
  return res.status(201).json(new ApiResponse(201, created, "Account created successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) throw new ApiError(400, "Username and password are required.");

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found.");

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) throw new ApiError(400, "Wrong username or password.");

  // Issue both tokens using their specific secrets + expiries from .env
  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Persist refresh token on the user document for rotation / revocation
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const { password: _pw, refreshToken: _rt, ...info } = user._doc;

  return res
    // Access token cookie — 15 min
    .cookie("accessToken", accessToken, {
      ...baseCookieOpts,
      secure: config.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    })
    // Refresh token cookie — 1 day
    .cookie("refreshToken", refreshToken, {
      ...baseCookieOpts,
      secure: config.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, { user: info, accessToken }, "Logged in successfully."));
});

export const logout = asyncHandler(async (req, res) => {
  // Revoke the refresh token from DB so it cannot be reused
  await User.findByIdAndUpdate(req.userId, { $unset: { refreshToken: 1 } });

  return res
    .clearCookie("accessToken",  baseCookieOpts)
    .clearCookie("refreshToken", baseCookieOpts)
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully."));
});

/**
 * POST /api/auth/refresh
 * Called by the frontend when the access token expires (401 response).
 * Verifies the refresh token cookie using REFRESH_TOKEN_SECRET,
 * then issues a fresh access token.
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken;
  if (!incoming) throw new ApiError(401, "No refresh token. Please log in.");

  let decoded;
  try {
    decoded = jwt.verify(incoming, config.REFRESH_TOKEN_SECRET); // REFRESH_TOKEN_SECRET
  } catch {
    throw new ApiError(403, "Refresh token invalid or expired. Please log in again.");
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== incoming) {
    throw new ApiError(403, "Refresh token revoked. Please log in again.");
  }

  const newAccessToken = generateAccessToken(user);

  return res
    .cookie("accessToken", newAccessToken, {
      ...baseCookieOpts,
      secure: config.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, { accessToken: newAccessToken }, "Access token refreshed."));
});
