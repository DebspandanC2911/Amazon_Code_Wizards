const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    returned: {
      type: Boolean,
      default: false,
    },
    openBox: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod", "wallet"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    trackingNumber: String,
    deliveryDate: Date,
    returnDate: Date,
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ delivered: 1 })
orderSchema.index({ returned: 1 })

module.exports = mongoose.model("Order", orderSchema)
