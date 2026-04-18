import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

// Dummy payment — simulates Stripe without needing keys
export const dummyIntent = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new ApiError(404, "Gig not found.");

  const mockPaymentIntentId = "pi_mock_" + Math.random().toString(36).substring(2, 12);

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: mockPaymentIntentId,
    isCompleted: true,
  });

  await newOrder.save();
  await Gig.findByIdAndUpdate(gig._id, { $inc: { sales: 1 } });

  res.status(200).json(
    new ApiResponse(200, {
      clientSecret: "dummy_secret",
      paymentIntentId: mockPaymentIntentId,
      orderId: newOrder._id,
    }, "Order placed (dummy mode).")
  );
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
    isCompleted: true,
  }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, orders, "Orders fetched."));
});

export const confirm = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { payment_intent: req.body.payment_intent },
    { $set: { isCompleted: true } },
    { new: true }
  );
  if (!order) throw new ApiError(404, "Order not found.");
  res.status(200).json(new ApiResponse(200, order, "Order confirmed."));
});
