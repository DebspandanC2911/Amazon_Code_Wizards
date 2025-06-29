const mongoose = require("mongoose")
const faker = require("faker")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../.env") })

// MongoDB Models
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  price: Number,
  stock: Number,
  createdAt: { type: Date, default: Date.now },
})

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  rating: { type: Number, min: 1, max: 5 },
  reviewText: String,
  purchaseVerified: { type: Boolean, default: false },
  fakeFlag: { type: Boolean, default: false },
  fakeConfidence: { type: Number, default: 0, min: 0, max: 100 },
  userRating: { type: Number, default: null, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, default: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" },
  rating: { type: Number, default: 5 },
  userRating: { type: Number, default: null, min: 0, max: 5 },
  totalOrders: { type: Number, default: 0 },
  deliveredOrders: { type: Number, default: 0 },
  returnedOrders: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  delivered: { type: Boolean, default: false },
  returned: { type: Boolean, default: false },
  openBox: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product", productSchema)
const Review = mongoose.model("Review", reviewSchema)
const User = mongoose.model("User", userSchema)
const Order = mongoose.model("Order", orderSchema)

function calculateUserRating(user) {
  if (!user.totalOrders || user.totalOrders === 0) {
    return null // New user, no rating
  }

  const baseRating = 5.0
  const deliveryRate = user.deliveredOrders / user.totalOrders
  const returnRate = user.returnedOrders / user.deliveredOrders || 0

  let rating = baseRating

  if (deliveryRate < 0.9) {
    rating -= (0.9 - deliveryRate) * 2
  }

  if (returnRate > 0.1) {
    rating -= (returnRate - 0.1) * 3
  }

  if (user.totalOrders > 10 && deliveryRate > 0.95 && returnRate < 0.05) {
    rating += 0.5
  }

  return Math.max(0, Math.min(5, Math.round(rating * 10) / 10))
}

function generateBalancedFakeConfidence(reviewText, reviewRating, userRating, isIntentionallyFake = false) {
  if (isIntentionallyFake) {
    return faker.datatype.number({ min: 65, max: 90 }) // High fake confidence for intentionally fake
  }

  let confidence = 15 // Lower base confidence

  // Text-based analysis (more lenient)
  const text = reviewText.toLowerCase()
  const strongFakePatterns = [
    "amazing product highly recommend five stars",
    "best purchase ever perfect quality",
    "outstanding incredible must buy",
  ]
  const moderateFakePatterns = ["amazing product", "highly recommend", "five stars", "perfect quality"]
  const authenticPatterns = ["however", "but", "minor issue", "could be better", "after using", "compared to"]

  // Strong fake patterns (multiple keywords together)
  const strongFakeMatches = strongFakePatterns.filter((pattern) => text.includes(pattern)).length
  confidence += strongFakeMatches * 25

  // Moderate fake patterns
  const moderateFakeMatches = moderateFakePatterns.filter((pattern) => text.includes(pattern)).length
  confidence += moderateFakeMatches * 8

  // Authentic patterns (reduce confidence)
  const authenticMatches = authenticPatterns.filter((pattern) => text.includes(pattern)).length
  confidence -= authenticMatches * 12

  // User rating vs review rating correlation (more balanced)
  if (userRating !== null) {
    const ratingDifference = Math.abs(userRating - reviewRating)

    // High-rated users giving positive reviews = credible
    if (userRating >= 4.0 && reviewRating >= 4) {
      confidence -= 10 // Less penalty
    }

    // Low-rated users giving very positive reviews = suspicious
    if (userRating <= 2.0 && reviewRating >= 4) {
      confidence += 20 // Moderate penalty
    }

    // High-rated users giving very negative reviews = suspicious
    if (userRating >= 4.0 && reviewRating <= 2) {
      confidence += 15 // Moderate penalty
    }

    // Low-rated users giving negative reviews = credible
    if (userRating <= 2.5 && reviewRating <= 3) {
      confidence -= 8
    }

    // Extreme rating differences
    if (ratingDifference >= 3) {
      confidence += 12
    }
  } else {
    // New users are slightly more suspicious
    confidence += 5
  }

  // Review length analysis (more balanced)
  const wordCount = reviewText.split(" ").length
  if (wordCount < 5) {
    confidence += 15 // Very short reviews
  } else if (wordCount > 50) {
    confidence -= 8 // Detailed reviews are more credible
  }

  // Exclamation marks (more lenient)
  const exclamationCount = (reviewText.match(/!/g) || []).length
  if (exclamationCount > 3) {
    confidence += exclamationCount * 3
  }

  return Math.max(5, Math.min(85, confidence)) // Cap at 85% max
}

// Diverse review templates with realistic content
const reviewTemplatesByRating = {
  1: [
    "Terrible product. Broke immediately after opening. Complete waste of money. Would not recommend to anyone.",
    "Worst purchase I've ever made. Poor quality, doesn't work as advertised. Save your money and buy something else.",
    "Absolutely horrible. The product arrived damaged and customer service was unhelpful. Very disappointed.",
    "Don't buy this! It's cheaply made and stopped working after one day. Total garbage.",
    "Very poor quality. Had multiple issues from day one. Returning this immediately.",
    "Completely useless. Nothing works as described. Waste of time and money.",
  ],
  2: [
    "Not worth the money. Had several issues right out of the box. Quality is much lower than expected.",
    "Disappointed with this purchase. It works but has many problems. Would not buy again.",
    "Below average product. Some features don't work properly and build quality is poor.",
    "Had high hopes but this product let me down. Multiple issues and poor customer support.",
    "Mediocre at best. Works sometimes but often has problems. Not reliable.",
    "Poor value for money. Expected much better quality for this price point.",
  ],
  3: [
    "It's okay, does what it's supposed to do but nothing special. Average quality for the price.",
    "Mixed feelings about this. Some good points but also some issues. Could be better.",
    "Decent product but has room for improvement. Works fine but not exceptional.",
    "Average purchase. Gets the job done but don't expect anything amazing.",
    "Neither good nor bad. It works but there are better options available.",
    "Acceptable quality. Does what it promises but nothing more. Could use improvements.",
  ],
  4: [
    "Good product overall. Works well and good value for money. Minor issues but mostly satisfied.",
    "Pretty happy with this purchase. Good quality and arrived quickly. Would recommend.",
    "Solid product. Does what it promises and build quality is good. A few minor complaints.",
    "Very pleased with this item. Good performance and reasonable price. Would buy again.",
    "Works great! Good build quality and reliable performance. Happy with my purchase.",
    "Excellent value for money. Works as expected and good customer service.",
  ],
  5: [
    "Excellent product! Exceeded my expectations. High quality and works perfectly. Highly recommend!",
    "Outstanding purchase! Amazing quality and fantastic customer service. Love everything about it.",
    "Perfect! Exactly what I needed. Great build quality and arrived quickly. Five stars!",
    "Incredible product! Best purchase I've made in a long time. Absolutely love it!",
    "Fantastic quality and performance. Works flawlessly and great value. Highly recommend!",
    "Amazing product! Everything works perfectly and build quality is excellent. Very satisfied!",
  ],
}

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")
    console.log("MONGO_URI:", process.env.MONGO_URI)

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/amazon-clone")
    console.log("Connected to MongoDB")

    // Clear existing data
    await Product.deleteMany({})
    await Review.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})

    console.log("Cleared existing data")

    // Create 25 products
    const products = []
    const categories = ["Electronics", "Books", "Clothing", "Home", "Sports", "Beauty"]

    for (let i = 0; i < 25; i++) {
      const product = await Product.create({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.random.arrayElement(categories),
        imageUrl: `/placeholder.svg?height=400&width=400&text=Product${i + 1}`,
        price: Number.parseFloat(faker.commerce.price(100, 50000)),
        stock: faker.datatype.number({ min: 10, max: 100 }),
      })
      products.push(product)
    }

    console.log(`Created ${products.length} products`)

    // Create users with diverse rating distribution (NO NULL RATINGS)
    const users = []

    // Create users across all rating ranges (0-5 stars)
    const ratingRanges = [
      { min: 0.1, max: 1.0, count: 15 }, // Very low rated users
      { min: 1.0, max: 2.0, count: 20 }, // Low rated users
      { min: 2.0, max: 3.0, count: 25 }, // Medium-low rated users
      { min: 3.0, max: 4.0, count: 30 }, // Medium-high rated users
      { min: 4.0, max: 5.0, count: 35 }, // High rated users
    ]

    for (const range of ratingRanges) {
      for (let i = 0; i < range.count; i++) {
        const targetRating = faker.datatype.number({ min: range.min * 10, max: range.max * 10 }) / 10

        // Calculate orders to achieve target rating
        const totalOrders = faker.datatype.number({ min: 5, max: 30 })
        const deliveryRate = Math.max(
          0.3,
          Math.min(1.0, targetRating / 5.0 + faker.datatype.number({ min: -0.1, max: 0.1 })),
        )
        const deliveredOrders = Math.floor(totalOrders * deliveryRate)
        const returnRate = Math.max(
          0,
          Math.min(0.4, (5.0 - targetRating) / 8 + faker.datatype.number({ min: -0.05, max: 0.05 })),
        )
        const returnedOrders = Math.floor(deliveredOrders * returnRate)

        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email().toLowerCase(),
          password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
          totalOrders,
          deliveredOrders,
          returnedOrders,
          userRating: targetRating, // ALL USERS HAVE RATINGS
        })
        users.push(user)
      }
    }

    console.log(`Created ${users.length} users with diverse ratings (0-5 stars)`)

    // Create 30 reviews per product with balanced rating distribution
    let totalReviews = 0
    const balancedRatingDistribution = [
      1,
      1,
      1,
      1,
      1,
      1, // 6 x 1-star (20%)
      2,
      2,
      2,
      2, // 4 x 2-star (13%)
      3,
      3,
      3,
      3,
      3, // 5 x 3-star (17%)
      4,
      4,
      4,
      4,
      4,
      4,
      4, // 7 x 4-star (23%)
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5, // 8 x 5-star (27%)
    ]

    for (const product of products) {
      const reviewCount = 30 // Exactly 30 reviews per product

      for (let j = 0; j < reviewCount; j++) {
        const user = faker.random.arrayElement(users) // All users have ratings
        const reviewRating = faker.random.arrayElement(balancedRatingDistribution)

        // 10% chance of intentionally fake review (reduced from 15%)
        const isIntentionallyFake = faker.datatype.number({ min: 0, max: 100 }) < 10

        let reviewText
        if (isIntentionallyFake) {
          // Fake reviews tend to be overly positive
          reviewText = faker.random.arrayElement(reviewTemplatesByRating[5])
        } else {
          reviewText = faker.random.arrayElement(reviewTemplatesByRating[reviewRating])
        }

        const fakeConfidence = generateBalancedFakeConfidence(
          reviewText,
          reviewRating,
          user.userRating,
          isIntentionallyFake,
        )

        await Review.create({
          productId: product._id,
          userId: user._id, // Always has a user
          rating: reviewRating,
          reviewText: reviewText,
          purchaseVerified: faker.datatype.boolean(),
          fakeFlag: fakeConfidence > 60,
          fakeConfidence,
          userRating: user.userRating, // Always has a user rating
          createdAt: faker.date.recent(90),
        })
        totalReviews++
      }
    }

    console.log(`Created ${totalReviews} diverse reviews (30 per product)`)
    console.log("Database seeding completed successfully!")

    // Log statistics
    const ratingStats = await Review.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    const userRatingStats = await User.aggregate([
      {
        $group: {
          _id: { $floor: "$userRating" },
          count: { $sum: 1 },
          avgRating: { $avg: "$userRating" },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const fakeReviewCount = await Review.countDocuments({ fakeFlag: true })
    const confidenceStats = await Review.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ["$fakeConfidence", 20] }, then: "Very Low (0-19%)" },
                { case: { $lt: ["$fakeConfidence", 40] }, then: "Low (20-39%)" },
                { case: { $lt: ["$fakeConfidence", 60] }, then: "Medium (40-59%)" },
                { case: { $lt: ["$fakeConfidence", 80] }, then: "High (60-79%)" },
              ],
              default: "Very High (80%+)",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    console.log(`\nReview Rating Distribution:`)
    ratingStats.forEach((stat) => {
      console.log(`- ${stat._id} stars: ${stat.count} reviews`)
    })

    console.log(`\nUser Rating Distribution:`)
    userRatingStats.forEach((stat) => {
      console.log(`- ${stat._id}-${stat._id + 1} stars: ${stat.count} users (avg: ${stat.avgRating.toFixed(1)})`)
    })

    console.log(`\nFake Detection Distribution:`)
    confidenceStats.forEach((stat) => {
      console.log(`- ${stat._id}: ${stat.count} reviews`)
    })

    console.log(`\nOverall Stats:`)
    console.log(`- Total reviews: ${totalReviews}`)
    console.log(`- Fake reviews detected: ${fakeReviewCount}`)
    console.log(`- Fake percentage: ${((fakeReviewCount / totalReviews) * 100).toFixed(1)}%`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.connection.close()
    process.exit()
  }
}

// Run the seed function
seedDatabase()
