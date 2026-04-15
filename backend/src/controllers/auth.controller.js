import config from "../config/config.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "Username or email already present!");
    }

    // 2. Create and save new user
    const newUser = new User({
        ...req.body,
    });

    await newUser.save();

    // 3. Return user without password
    const createdUser = await User.findById(newUser._id).select("-password");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User has been created successfully.")
    );
});

export const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    // 2. Validate password
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
        throw new ApiError(400, "Wrong password or username");
    }

    // 3. Generate Token (Using config.JWT_SECRET to match verifyToken)
    const token = jwt.sign(
        {
            id: user._id,
            isSeller: user.isSeller
        },
        config.JWT_SECRET,
        { expiresIn: "24h" } // Added expiration for security
    );

    // 4. Remove password from the response object
    const { password: userPassword, ...info } = user._doc;

    // 5. Set Cookie and Send Response
    return res
        .cookie("accessToken", token, {
            httpOnly: true,
            secure: false, // Set to true only in production (HTTPS)
            sameSite: "lax",
            path: "/" // Ensures cookie is available for all routes
        })
        .status(200)
        .json(new ApiResponse(200, info, "User logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
    // 1. Clear the cookie by matching the same options used to set it
    return res
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        })
        .status(200)
        .json(new ApiResponse(200, {}, "User has been logged out."));
});