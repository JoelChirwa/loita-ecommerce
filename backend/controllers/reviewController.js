import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { rating, comment, productId } = req.body;

  try {
    // Check if user has a delivered order for this product
    const hasDeliveredOrder = await Order.findOne({
      user: req.user._id,
      "products.product": productId,
      orderStatus: "delivered",
    });

    if (!hasDeliveredOrder) {
      return res.status(403).json({
        success: false,
        message:
          "You can only review products that have been delivered to you.",
      });
    }

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Product already reviewed" });
    }

    const review = new Review({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: productId,
    });

    await review.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  if (!productId || productId === "undefined") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort("-createdAt");
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.name === "CastError" ? "Invalid ID format" : error.message,
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name")
      .populate("product", "name")
      .sort("-createdAt");
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ success: true, message: "Review removed" });
    } else {
      res.status(404).json({ success: false, message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createReview, getProductReviews, getAllReviews, deleteReview };
