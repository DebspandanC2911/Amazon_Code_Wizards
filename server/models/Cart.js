const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Can be ObjectId for logged users or 'guest' for anonymous
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique cart items per user
cartSchema.index({ userId: 1, productId: 1 }, { unique: true })

module.exports = mongoose.model("Cart", cartSchema)
