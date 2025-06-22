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
