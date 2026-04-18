import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import User from "../models/user.model.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(404, "User not found.");
  res.status(200).json(new ApiResponse(200, user, "User fetched."));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found.");
  if (req.userId !== user._id.toString()) throw new ApiError(403, "You can only delete your own account.");
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Account deleted."));
});

export const updateUser = asyncHandler(async (req, res) => {
  if (req.userId !== req.params.id) throw new ApiError(403, "You can only update your own profile.");
  const { password, ...safeFields } = req.body; // never let password update through this route
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { $set: safeFields },
    { new: true }
  ).select("-password");
  res.status(200).json(new ApiResponse(200, updated, "Profile updated."));
});
