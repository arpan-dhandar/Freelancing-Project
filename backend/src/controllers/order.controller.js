import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

// Helper to simulate network latency for "real vibes"
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a dummy payment intent and saves a completed order after a delay.
 */
export const dummyIntent = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    throw new ApiError(404, "Gig not found");
  }

  // 1. Prepare the Order object
  // We generate a mock ID that looks like a Stripe Payment Intent (pi_...)
  const mockPaymentIntentId = "pi_mock_" + Math.random().toString(36).substring(2, 12);

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: mockPaymentIntentId,
    isCompleted: true, // Set to true to simulate a successful instant payment
  });

  // 2. Simulate the "Processing" delay (2 seconds)
  // This happens in the background so we can respond to the user immediately
  setTimeout(async () => {
    try {
      await newOrder.save();
      console.log(`Order ${newOrder._id} saved to database after dummy delay.`);
    } catch (error) {
      console.error("Error saving dummy order:", error);
    }
  }, 2000);

  // 3. Send Response
  // We send the clientSecret back so the frontend feels like it's talking to Stripe
  res.status(200).json(
    new ApiResponse(
      200,
      {
        clientSecret: "dummy_secret_shhh_its_a_fake",
        paymentIntentId: mockPaymentIntentId,
        orderId: newOrder._id,
      },
      "Payment initiated successfully (Dummy Mode)"
    )
  );
});

/**
 * Fetches completed orders for the logged-in user (Buyer or Seller).
 */
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
    isCompleted: true,
  });

  if (!orders || orders.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No orders found."));
  }

  res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully."));
});

/**
 * Manually confirms an order as completed. 
 * (In this dummy setup, it's a backup for the frontend logic)
 */
export const confirm = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    {
      payment_intent: req.body.payment_intent,
    },
    {
      $set: {
        isCompleted: true,
      },
    },
    { new: true } // Returns the updated document
  );

  if (!order) {
    throw new ApiError(404, "Order not found with that payment intent.");
  }

  res.status(200).json(new ApiResponse(200, order, "Order has been confirmed."));
});