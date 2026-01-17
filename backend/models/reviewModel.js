import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (productId) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId.toString()),
        },
      },
      {
        $group: {
          _id: "$product",
          nRating: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const ProductModel = mongoose.model("Product");

    if (stats.length > 0) {
      await ProductModel.findByIdAndUpdate(productId, {
        ratingCount: stats[0].nRating,
        ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
      });
    } else {
      await ProductModel.findByIdAndUpdate(productId, {
        ratingCount: 0,
        ratingAverage: 0,
      });
    }
  } catch (error) {
    console.error("Error in calculateAverageRating:", error);
  }
};

// Update rating after save
reviewSchema.post("save", function (doc) {
  if (doc.product) {
    doc.constructor.calculateAverageRating(doc.product);
  }
});

// Update rating after delete (handling both deleteOne and remove for compatibility)
reviewSchema.post(
  /delete|remove/,
  { document: true, query: false },
  function (doc) {
    if (doc && doc.product) {
      doc.constructor.calculateAverageRating(doc.product);
    }
  },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
