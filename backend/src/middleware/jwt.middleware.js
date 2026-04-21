import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { ApiError } from "../utils/ApiError.util.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next(new ApiError(401, "No access token. Please log in."));

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.userId   = decoded.id;
    req.isSeller = decoded.isSeller;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired. Please refresh your session."));
    }
    return next(new ApiError(403, "Access token invalid. Please log in again."));
  }
};