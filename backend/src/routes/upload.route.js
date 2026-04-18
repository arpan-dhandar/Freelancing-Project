import express from "express";
import { uploadAvatar, uploadGigCover, uploadGigImages } from "../controllers/upload.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";
import { handleUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All upload routes require authentication
router.post("/avatar",      verifyToken, handleUpload("single"),   uploadAvatar);
router.post("/gig-cover",   verifyToken, handleUpload("single"),   uploadGigCover);
router.post("/gig-images",  verifyToken, handleUpload("multiple"), uploadGigImages);

export default router;
