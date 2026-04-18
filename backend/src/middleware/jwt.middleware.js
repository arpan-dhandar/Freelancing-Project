import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { ApiError } from "../utils/ApiError.util.js";

/**
 * verifyToken
 * Reads the accessToken cookie and verifies it using ACCESS_TOKEN_SECRET.
 * If the token is expired the client should call POST /api/auth/refresh
 * using their refreshToken cookie to get a new access token.
 */
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new ApiError(401, "No access token. Please log in.");

  try {
    // Verify specifically with ACCESS_TOKEN_SECRET (not JWT_SECRET)
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.userId   = decoded.id;
    req.isSeller = decoded.isSeller;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Tell the client exactly what happened so it knows to call /refresh
      throw new ApiError(401, "Access token expired. Please refresh your session.");
    }
    throw new ApiError(403, "Access token invalid. Please log in again.");
  }
};
