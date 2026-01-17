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
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingCount: stats[0].nRating,
      ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingCount: 0,
      ratingAverage: 0,
    });
  }
};

// Update rating after save
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

// Update rating after delete
reviewSchema.post("remove", function () {
  this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
