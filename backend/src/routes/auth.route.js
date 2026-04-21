import express from "express";
import { register, login, logout, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login",    login);
router.post("/logout",   verifyToken, logout);
router.post("/refresh",  refreshAccessToken);
export default router;