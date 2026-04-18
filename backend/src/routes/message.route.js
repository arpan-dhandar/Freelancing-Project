import express from "express";
import { createMessage, getMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();
router.get("/:id",  verifyToken, getMessage);
router.post("/",    verifyToken, createMessage);
export default router;
