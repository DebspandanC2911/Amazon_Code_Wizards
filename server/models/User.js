const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    userRating: {
      type: Number,
      default: null, // null for new users, 0-5 for rated users
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    deliveredOrders: {
      type: Number,
      default: 0,
    },
    returnedOrders: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
userSchema.index({ email: 1 })

module.exports = mongoose.model("User", userSchema)
