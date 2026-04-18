import express from "express";
import { getUser, deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();
router.get("/:id", getUser);
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);
export default router;
