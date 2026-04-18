import multer from "multer";
import { ApiError } from "../utils/ApiError.util.js";

// Keep file in memory — we stream straight to Cloudinary (no disk writes)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files are allowed (jpeg, png, webp, gif)."), false);
  }
};

// Single image — field name flexible (cover, avatar, image)
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
}).single("image");

// Multiple images — up to 5 (for gig gallery)
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

/**
 * Express middleware wrapper that calls uploadSingle and normalises errors.
 */
export const handleUpload = (field = "single") => (req, res, next) => {
  const uploader = field === "single" ? uploadSingle : uploadMultiple;
  uploader(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      return next(new ApiError(400, `Upload error: ${err.message}`));
    }
    return next(err);
  });
};
