import express from "express";
import { verifyToken } from "../middleware/jwt.middleware.js";
// Changed 'intent' to 'dummyIntent' to match your controller
import { getOrders, dummyIntent, confirm } from "../controllers/order.controller.js";

const router = express.Router();

// Get all orders for the user
router.get("/", verifyToken, getOrders);

// Create the mock payment intent (using the Gig ID)
router.post("/create-payment-intent/:id", verifyToken, dummyIntent);

// Confirm the order status
router.put("/", verifyToken, confirm);

export default router;