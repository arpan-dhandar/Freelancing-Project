import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import User from "../models/user.model.js";
import Gig from "../models/gig.model.js";

/**
 * POST /api/upload/avatar
 * Uploads a profile picture for the authenticated user.
 * Expects multipart/form-data with field name "image".
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file provided.");

  const { url } = await uploadToCloudinary(req.file.buffer, "scarr/avatars");

  // Persist the new avatar URL on the user document
  const updated = await User.findByIdAndUpdate(
    req.userId,
    { $set: { img: url } },
    { new: true }
  ).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, { img: url, user: updated }, "Avatar uploaded."));
});

/**
 * POST /api/upload/gig-cover
 * Uploads a cover image for a gig owned by the authenticated seller.
 * Expects multipart/form-data with field "image" and body field "gigId".
 */
export const uploadGigCover = asyncHandler(async (req, res) => {
  if (!req.isSeller) throw new ApiError(403, "Only sellers can upload gig images.");
  if (!req.file)     throw new ApiError(400, "No image file provided.");

  const { url } = await uploadToCloudinary(req.file.buffer, "scarr/gigs");

  // If a gigId is provided, update the gig's cover immediately
  if (req.body.gigId) {
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) throw new ApiError(404, "Gig not found.");
    if (gig.userId.toString() !== req.userId) throw new ApiError(403, "You can only update your own gigs.");

    await Gig.findByIdAndUpdate(req.body.gigId, { $set: { cover: url } });
  }

  // Return just the URL so the frontend can use it in a form before saving
  res.status(200).json(new ApiResponse(200, { url }, "Image uploaded to Cloudinary."));
});

/**
 * POST /api/upload/gig-images
 * Uploads up to 5 gallery images for a gig.
 * Expects multipart/form-data with field "images" (array) and body field "gigId".
 */
export const uploadGigImages = asyncHandler(async (req, res) => {
  if (!req.isSeller)          throw new ApiError(403, "Only sellers can upload gig images.");
  if (!req.files?.length)     throw new ApiError(400, "No image files provided.");
  if (!req.body.gigId)        throw new ApiError(400, "gigId is required.");

  const gig = await Gig.findById(req.body.gigId);
  if (!gig)                               throw new ApiError(404, "Gig not found.");
  if (gig.userId.toString() !== req.userId) throw new ApiError(403, "You can only update your own gigs.");

  // Upload all images concurrently
  const uploads = await Promise.all(
    req.files.map((f) => uploadToCloudinary(f.buffer, "scarr/gigs"))
  );
  const urls = uploads.map((u) => u.url);

  await Gig.findByIdAndUpdate(req.body.gigId, { $push: { images: { $each: urls } } });

  res.status(200).json(new ApiResponse(200, { urls }, "Gallery images uploaded."));
});
