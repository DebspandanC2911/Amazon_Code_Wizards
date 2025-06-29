const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const Review = require("../models/Review")
const User = require("../models/User")
const { detectFakeReview, calculateUserRating } = require("../utils/fakeReviewDetector")
const faker = require("faker")

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

// Get product reviews with enhanced data
router.get("/:id/reviews", async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query // Increased limit to show more reviews

    const reviews = await Review.find({ productId: req.params.id })
      .populate("userId", "name userRating")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Review.countDocuments({ productId: req.params.id })

    // Format reviews - all should have user ratings now
    const formattedReviews = reviews.map((review) => {
      const reviewObj = review.toObject()

      // All reviews should have users with ratings now
      if (reviewObj.userId && reviewObj.userId.userRating !== null) {
        reviewObj.userRatingDisplay = reviewObj.userId.userRating
      } else {
        // Fallback (shouldn't happen with new seed data)
        reviewObj.userRatingDisplay = "New User"
      }

      return reviewObj
    })

    res.json({
      reviews: formattedReviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
})

// Create product review with alternating user rating system
router.post("/:id/reviews", async (req, res) => {
  try {
    const { rating, reviewText, userId } = req.body
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

    // Generate alternating user rating (high -> low -> high -> low...)
    const { generateAlternatingUserRating } = require("../utils/fakeReviewDetector")
    const alternatingUserRating = generateAlternatingUserRating()

    // Create a mock user name for display
    const mockUserName = faker.name.findName()

    // Detect fake review with improved model
    const fakeConfidence = await detectFakeReview(reviewText, rating, alternatingUserRating, userId)

    // Create review with proper user data
    const review = new Review({
      productId,
      userId: userId || null,
      rating,
      reviewText,
      purchaseVerified: Math.random() > 0.3,
      fakeFlag: fakeConfidence > 60,
      fakeConfidence,
      userRating: alternatingUserRating,
    })

    await review.save()

    // Format response with proper user display
    const reviewObj = review.toObject()
    reviewObj.userId = {
      name: mockUserName,
      userRating: alternatingUserRating,
    }
    reviewObj.userRatingDisplay = alternatingUserRating

    // Log the review creation for debugging
    console.log(`📝 NEW REVIEW CREATED:`)
    console.log(`   Text: "${reviewText}"`)
    console.log(`   User Rating: ${alternatingUserRating}/5`)
    console.log(`   Fake Confidence: ${fakeConfidence}%`)
    console.log(`   Review Rating: ${rating}/5`)

    res.status(201).json(reviewObj)
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ error: "Failed to create review" })
  }
})

// Check if user can review product
router.get("/:id/can-review", async (req, res) => {
  try {
    const canReview = true
    res.json({ canReview })
  } catch (error) {
    console.error("Error checking review permission:", error)
    res.status(500).json({ error: "Failed to check review permission" })
  }
})

module.exports = router
