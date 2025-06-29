const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
    purchaseVerified: {
      type: Boolean,
      default: false,
    },
    fakeFlag: {
      type: Boolean,
      default: false,
    },
    fakeConfidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    userRating: {
      type: Number,
      default: null, // null for unrated users, 0-5 for rated users
      min: 0,
      max: 5,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 })
reviewSchema.index({ userId: 1 })
reviewSchema.index({ fakeFlag: 1 })

module.exports = mongoose.model("Review", reviewSchema)
