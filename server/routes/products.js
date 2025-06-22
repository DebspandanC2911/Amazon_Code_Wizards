const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const Review = require("../models/Review")
const axios = require("axios")

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query

    const query = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Product.countDocuments(query)

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// Get product reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ productId: req.params.id })
      .populate("userId", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Review.countDocuments({ productId: req.params.id })

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
})

// Create product review
router.post("/:id/reviews", async (req, res) => {
  try {
    const { rating, reviewText } = req.body
    const productId = req.params.id

    // Validate input
    if (!rating || !reviewText || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating or review text" })
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Call fake review detection service
    let fakeFlag = false
    try {
      const llmResponse = await axios.post(
        `${process.env.LLM_SERVICE_URL}/api/llm/detect-fake`,
        {
          reviewText,
        },
        {
          timeout: 5000,
        },
      )

      if (llmResponse.data) {
        fakeFlag = llmResponse.data.isPotentiallyFake
      }
    } catch (llmError) {
      console.warn("LLM service unavailable, proceeding without fake detection:", llmError.message)
    }

    // Create review
    const review = new Review({
      productId,
      userId: req.user?.id || null, // Will be null if no auth middleware
      rating,
      reviewText,
      purchaseVerified: true, // For demo purposes
      fakeFlag,
    })

    await review.save()

    // Populate user info for response
    await review.populate("userId", "name")

    res.status(201).json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ error: "Failed to create review" })
  }
})

// Check if user can review product
router.get("/:id/can-review", async (req, res) => {
  try {
    // For demo purposes, allow reviews for products with ID containing '1'
    // In real app, check if user has purchased and received the product
    const canReview = req.params.id.includes("1")

    res.json({ canReview })
  } catch (error) {
    console.error("Error checking review permission:", error)
    res.status(500).json({ error: "Failed to check review permission" })
  }
})

module.exports = router
