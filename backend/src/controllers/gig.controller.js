import Gig from "../models/gig.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const createGig = asyncHandler(async (req, res) => {
  if (!req.isSeller) throw new ApiError(403, "Only sellers can create a gig.");

  const newGig = new Gig({ userId: req.userId, ...req.body });
  const saved  = await newGig.save();
  res.status(201).json(new ApiResponse(201, saved, "Gig created successfully."));
});

export const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new ApiError(404, "Gig not found.");
  if (gig.userId.toString() !== req.userId) throw new ApiError(403, "You can only delete your own gigs.");
  await Gig.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Gig deleted."));
});

export const getGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new ApiError(404, "Gig not found.");
  res.status(200).json(new ApiResponse(200, gig, "Gig fetched."));
});

export const getGigs = asyncHandler(async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat    && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gte: Number(q.min) }),
        ...(q.max && { $lte: Number(q.max) }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  const sortField = q.sort || "createdAt";
  const gigs = await Gig.find(filters).sort({ [sortField]: -1 }).limit(Number(q.limit) || 50);
  res.status(200).json(new ApiResponse(200, gigs, "Gigs fetched."));
});
