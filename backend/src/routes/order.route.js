import express from "express";
import { dummyIntent, getOrders, confirm } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();
router.get("/",                           verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, dummyIntent);
router.put("/",                           verifyToken, confirm);
export default router;
