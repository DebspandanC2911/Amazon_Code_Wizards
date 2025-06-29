const express = require("express")
const router = express.Router()
const Review = require("../models/Review")

// Get all reviews (admin)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, fakeFlag } = req.query

    const query = {}
    if (fakeFlag !== undefined) {
      query.fakeFlag = fakeFlag === "true"
    }

    const reviews = await Review.find(query)
      .populate("productId", "title")
      .populate("userId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Review.countDocuments(query)

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

// Update review fake flag (admin)
router.patch("/:id/fake-flag", async (req, res) => {
  try {
    const { fakeFlag } = req.body

    const review = await Review.findByIdAndUpdate(req.params.id, { fakeFlag }, { new: true })
      .populate("productId", "title")
      .populate("userId", "name")

    if (!review) {
      return res.status(404).json({ error: "Review not found" })
    }

    res.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
    res.status(500).json({ error: "Failed to update review" })
  }
})

// Delete review
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (!review) {
      return res.status(404).json({ error: "Review not found" })
    }

    res.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    res.status(500).json({ error: "Failed to delete review" })
  }
})

module.exports = router
