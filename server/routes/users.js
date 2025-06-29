const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Order = require("../models/Order")

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ error: "Failed to register user" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
      },
    })
  } catch (error) {
    console.error("Error logging in user:", error)
    res.status(500).json({ error: "Failed to login" })
  }
})

// Get user profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Calculate user rating based on orders
    const orders = await Order.find({ userId: user._id })
    const deliveredOrders = orders.filter((order) => order.delivered).length
    const returnedOrders = orders.filter((order) => order.returned).length

    // Get max delivered orders across all users for bonus calculation
    const allUsers = await User.find()
    let maxDeliveredAcrossUsers = 0

    for (const u of allUsers) {
      const userOrders = await Order.find({ userId: u._id })
      const userDelivered = userOrders.filter((order) => order.delivered).length
      if (userDelivered > maxDeliveredAcrossUsers) {
        maxDeliveredAcrossUsers = userDelivered
      }
    }

    // Calculate rating using the specified formula
    const baseScore = 5
    const penalty = deliveredOrders > 0 ? (returnedOrders / deliveredOrders) * 2 : 0
    const bonus = maxDeliveredAcrossUsers > 0 ? (deliveredOrders / maxDeliveredAcrossUsers) * 1 : 0
    const rating = Math.max(1, Math.min(5, baseScore - penalty + bonus))

    // Update user rating
    user.rating = Math.round(rating * 10) / 10 // Round to 1 decimal place
    await user.save()

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        stats: {
          totalOrders: orders.length,
          deliveredOrders,
          returnedOrders,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Failed to fetch user profile" })
  }
})

module.exports = router
