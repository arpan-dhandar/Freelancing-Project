import express from "express";
import { createGig, deleteGig, getGig, getGigs } from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();
router.get("/",        getGigs);
router.get("/single/:id", getGig);
router.post("/",       verifyToken, createGig);
router.delete("/:id",  verifyToken, deleteGig);
export default router;
