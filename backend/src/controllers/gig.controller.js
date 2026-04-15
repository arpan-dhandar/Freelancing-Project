import Gig from "../models/gig.model.js"
import { ApiError } from "../utils/ApiError.util.js"
import { ApiResponse } from "../utils/ApiResponse.util.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"

export const createGig = asyncHandler(async (req, res, next) => {
    // 1. Check if user is a seller
    if (!req.isSeller) {
        throw new ApiError(403, "Only sellers can create a gig!")
    }

    // 2. Create new gig instance
    const newGig = new Gig({
        userId: req.userId,
        ...req.body,
    })

    // 3. Save and return response (Fixed: Added 201 into status)
    const savedGig = await newGig.save();
    res.status(201).json(new ApiResponse(201, savedGig, "Gig saved successfully!"))
})

export const deleteGig = asyncHandler(async (req, res, next) => {
    const gig = await Gig.findById(req.params.id)
    
    if (!gig) {
        throw new ApiError(404, "Gig not found!")
    }

    // 4. Check ownership (Fixed: Added .toString() for object ID comparison)
    if (gig.userId.toString() !== req.userId) {
        throw new ApiError(403, "You can delete only your gig!")
    }

    await Gig.findByIdAndDelete(req.params.id)
    res.status(200).json(new ApiResponse(200, {}, "Gig has been deleted!"))
})

export const getGig = asyncHandler(async (req, res, next) => {
    const gig = await Gig.findById(req.params.id)
    if (!gig) {
        throw new ApiError(404, "Gig not found!")
    }
    res.status(200).json(new ApiResponse(200, gig, "Gig fetched successfully"))
})

export const getGigs = asyncHandler(async (req, res, next) => {
    const q = req.query;

    // 5. Build Dynamic Filters
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {
            price: {
                ...(q.min && { $gt: q.min }), // Fixed: Changed $qt to $gt
                ...(q.max && { $lt: q.max })
            },
        }), // Fixed: Added missing comma here
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    // 6. Execute search with sorting
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 })
    res.status(200).json(new ApiResponse(200, gigs, "Gigs retrieved successfully"))
})