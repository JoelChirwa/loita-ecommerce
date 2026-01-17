import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } else {
    res.status(400).json({ success: false, message: "No file uploaded" });
  }
});

export default router;
