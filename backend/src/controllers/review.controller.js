import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";

export const createReview = asyncHandler(async (req, res) => {
  if (req.isSeller) throw new ApiError(403, "Sellers cannot leave reviews.");

  const purchased = await Order.findOne({
    gigId: req.body.gigId, buyerId: req.userId, isCompleted: true,
  });
  if (!purchased) throw new ApiError(403, "You must purchase this gig before reviewing it.");

  const existing = await Review.findOne({ gigId: req.body.gigId, userId: req.userId });
  if (existing) throw new ApiError(403, "You have already reviewed this gig.");

  const newReview = new Review({
    userId: req.userId,
    gigId:  req.body.gigId,
    desc:   req.body.desc,
    star:   req.body.star,
  });

  const saved = await newReview.save();

  await Gig.findByIdAndUpdate(req.body.gigId, {
    $inc: { totalStars: req.body.star, starNumber: 1 },
  });

  res.status(201).json(new ApiResponse(201, saved, "Review added."));
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ gigId: req.params.gigId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched."));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found.");
  if (review.userId.toString() !== req.userId) throw new ApiError(403, "You can only delete your own reviews.");

  await Review.findByIdAndDelete(req.params.id);
  await Gig.findByIdAndUpdate(review.gigId, {
    $inc: { totalStars: -review.star, starNumber: -1 },
  });

  res.status(200).json(new ApiResponse(200, {}, "Review deleted."));
});
