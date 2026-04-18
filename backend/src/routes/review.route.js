import express from "express";
import { createReview, getReviews, deleteReview } from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();
router.get("/:gigId",  getReviews);
router.post("/",       verifyToken, createReview);
router.delete("/:id",  verifyToken, deleteReview);
export default router;
