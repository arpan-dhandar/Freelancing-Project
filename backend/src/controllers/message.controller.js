import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js"
import { ApiResponse } from "../utils/ApiResponse.util.js"
import Message from "../models/message.model.js"
import Conversation from "../models/conversation.model.js"

export const createMessage = asyncHandler(async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc
  })

  const savedMessage = await newMessage.save();

  await Conversation.findByIdAndUpdate(
    { id: req.body.conversationId },
    {
      $set: {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
        lastMessage: req.body.desc,
      },
    },
    { new: true }
  )

  res.status(201).json(new ApiResponse(201, savedMessage, "Message sent."))
})

export const getMessage = asyncHandler(async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
  res.status(200).json(new ApiResponse(200, messages, "Messages fetched."));
});