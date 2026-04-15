import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js"; // Needed for purchase check

export const createReview = asyncHandler(async (req, res) => {
    // 1. Check if the user is a seller (Sellers cannot review)
    if (req.isSeller) {
        throw new ApiError(403, "Sellers can't create a review!");
    }

    // 2. Check if the user has actually purchased this gig
    const purchased = await Order.findOne({
        gigId: req.body.gigId,
        buyerId: req.userId,
        isCompleted: true,
    });

    if (!purchased) {
        throw new ApiError(403, "You must purchase the gig before reviewing it!");
    }

    // 3. Check if user already reviewed this gig
    const existingReview = await Review.findOne({
        gigId: req.body.gigId,
        userId: req.userId,
    });

    if (existingReview) {
        throw new ApiError(403, "You have already created a review for this gig!");
    }

    // 4. Create and save review
    const newReview = new Review({
        userId: req.userId,
        gigId: req.body.gigId,
        desc: req.body.desc,
        star: req.body.star,
    });

    const savedReview = await newReview.save();

    // 5. Update Gig's average rating stats
    await Gig.findByIdAndUpdate(req.body.gigId, {
        $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).json(new ApiResponse(201, savedReview, "Review created successfully"));
});

export const getReviews = asyncHandler(async (req, res) => {
    // Use req.params.gigId (plural) to match your route
    const reviews = await Review.find({ gigId: req.params.gigId });

    res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new ApiError(404, "Review not found!");
    }

    // Only the person who wrote the review can delete it
    if (review.userId.toString() !== req.userId) {
        throw new ApiError(403, "You can only delete your own reviews!");
    }

    await Review.findByIdAndDelete(req.params.id);

    // Optional: You might want to update the Gig's star count here as well
    await Gig.findByIdAndUpdate(review.gigId, {
        $inc: { totalStars: -review.star, starNumber: -1 },
    });

    res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});