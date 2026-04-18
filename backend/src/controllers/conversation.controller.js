import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = asyncHandler(async (req, res) => {
  // Compose a deterministic unique ID for this seller-buyer pair
  const sellerId = req.isSeller ? req.userId : req.body.to;
  const buyerId  = req.isSeller ? req.body.to : req.userId;
  const convId   = sellerId + buyerId;

  // Return existing conversation if one already exists
  const existing = await Conversation.findOne({ id: convId });
  if (existing) return res.status(200).json(new ApiResponse(200, existing, "Conversation already exists."));

  const newConversation = new Conversation({
    id:           convId,
    sellerId,
    buyerId,
    readBySeller: req.isSeller,
    readByBuyer:  !req.isSeller,
  });

  const saved = await newConversation.save();
  res.status(201).json(new ApiResponse(201, saved, "Conversation created."));
});

// FIX: was using ...ApiError() instead of a plain object spread
export const updateConversation = asyncHandler(async (req, res) => {
  const updated = await Conversation.findOneAndUpdate(
    { id: req.params.id }, // FIX: was req.param.id
    {
      $set: req.isSeller ? { readBySeller: true } : { readByBuyer: true },
    },
    { new: true }
  );
  if (!updated) throw new ApiError(404, "Conversation not found.");
  res.status(200).json(new ApiResponse(200, updated, "Conversation updated."));
});

export const getSingleConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ id: req.params.id });
  if (!conversation) throw new ApiError(404, "Conversation not found.");
  res.status(200).json(new ApiResponse(200, conversation, "Conversation fetched."));
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find(
    req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
  ).sort({ updatedAt: -1 });
  res.status(200).json(new ApiResponse(200, conversations, "Conversations fetched."));
});
