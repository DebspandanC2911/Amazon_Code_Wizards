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

// Predefined products that match your image mapping
const predefinedProducts = [
  // Electronics
  {
    title: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with active noise cancellation technology. Features 30-hour battery life, premium sound quality, and comfortable over-ear design.",
    category: "Electronics",
    imageUrl: "/images/product-headphones.jpg",
    price: 2999,
    stock: 50,
  },
  {
    title: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking smartwatch with heart rate monitoring, GPS, sleep tracking, and 50+ workout modes. Water-resistant design with 7-day battery life.",
    category: "Electronics",
    imageUrl: "/images/product-smartwatch.jpg",
    price: 8999,
    stock: 30,
  },
  {
    title: "Gaming Mechanical Keyboard",
    description:
      "RGB backlit mechanical keyboard for gaming with tactile switches, programmable keys, and durable aluminum frame.",
    category: "Electronics",
    imageUrl: "/images/product-keyboard.jpg",
    price: 4999,
    stock: 40,
  },
  {
    title: "Professional Camera Lens",
    description:
      "50mm prime lens for professional photography with fast autofocus, image stabilization, and weather sealing.",
    category: "Electronics",
    imageUrl: "/images/product-camera-lens.jpg",
    price: 25999,
    stock: 15,
  },

  // Clothing & Fashion
  {
    title: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt with premium fabric, perfect fit, and eco-friendly production.",
    category: "Clothing",
    imageUrl: "/images/product-tshirt.jpg",
    price: 799,
    stock: 100,
  },
  {
    title: "Handmade Steel Keyboard",
    description: "Premium handcrafted steel mechanical keyboard with custom switches and artisan keycaps.",
    category: "Electronics",
    imageUrl: "/images/products/keyboard.jpg",
    price: 12999,
    stock: 20,
  },
  {
    title: "Tasty Cotton Shirt",
    description: "Premium cotton shirt with modern fit, breathable fabric, and stylish design for everyday wear.",
    category: "Clothing",
    imageUrl: "/images/products/shirt.jpg",
    price: 1299,
    stock: 75,
  },

  // Home & Kitchen
  {
    title: "Coffee Maker Deluxe",
    description:
      "Programmable coffee maker with built-in grinder, thermal carafe, and multiple brewing options for perfect coffee every time.",
    category: "Home",
    imageUrl: "/images/product-coffee-maker.jpg",
    price: 12999,
    stock: 25,
  },
  {
    title: "Yoga Mat Premium",
    description:
      "Non-slip premium yoga mat for all your workout needs with extra cushioning and eco-friendly materials.",
    category: "Sports",
    imageUrl: "/images/product-yoga-mat.jpg",
    price: 1499,
    stock: 75,
  },
  {
    title: "Generic Concrete Table",
    description: "Modern concrete dining table with sleek design, durable construction, and contemporary style.",
    category: "Home",
    imageUrl: "/images/products/table.jpg",
    price: 15999,
    stock: 10,
  },

  // Beauty & Personal Care
  {
    title: "Skincare Serum Set",
    description:
      "Complete skincare routine with vitamin C serum, hyaluronic acid, and anti-aging ingredients for glowing skin.",
    category: "Beauty",
    imageUrl: "/images/product-skincare.jpg",
    price: 2499,
    stock: 60,
  },

  // Food & Beverages
  {
    title: "Licensed Frozen Bacon",
    description:
      "Premium quality frozen bacon strips, perfectly cured and ready to cook for delicious breakfast meals.",
    category: "Food",
    imageUrl: "/images/products/bacon.jpg",
    price: 599,
    stock: 200,
  },
  {
    title: "Handcrafted Frozen Cheese",
    description: "Artisanal frozen cheese selection with rich flavors, perfect for cooking and gourmet meals.",
    category: "Food",
    imageUrl: "/images/products/cheese.jpg",
    price: 899,
    stock: 150,
  },
  {
    title: "Sleek Cotton Pizza",
    description: "Gourmet frozen pizza with organic ingredients, artisanal crust, and premium toppings.",
    category: "Food",
    imageUrl: "/images/products/pizza.jpg",
    price: 1299,
    stock: 80,
  },
  {
    title: "Tasty Wooden Tuna",
    description: "Premium canned tuna with sustainable fishing practices, rich in protein and omega-3 fatty acids.",
    category: "Food",
    imageUrl: "/images/products/tuna.jpg",
    price: 399,
    stock: 300,
  },
  {
    title: "Practical Plastic Chicken",
    description: "Fresh chicken cuts, farm-raised with natural feed, perfect for healthy family meals.",
    category: "Food",
    imageUrl: "/images/products/chicken.jpg",
    price: 699,
    stock: 120,
  },
  {
    title: "Fantastic Frozen Sausages",
    description: "Gourmet frozen sausages with authentic spices and premium meat, perfect for grilling.",
    category: "Food",
    imageUrl: "/images/products/sausages.jpg",
    price: 799,
    stock: 90,
  },
  {
    title: "Unbranded Soft Salad",
    description: "Fresh mixed greens salad with organic vegetables, perfect for healthy eating.",
    category: "Food",
    imageUrl: "/images/products/salad.jpg",
    price: 299,
    stock: 180,
  },

  // Sports & Accessories
  {
    title: "Unbranded Fresh Bike",
    description:
      "Modern bicycle with lightweight frame, smooth gears, and comfortable riding experience for daily commuting.",
    category: "Sports",
    imageUrl: "/images/products/bike.jpg",
    price: 18999,
    stock: 15,
  },
  {
    title: "Sleek Soft Gloves",
    description: "Premium leather gloves with soft lining, perfect for winter weather and elegant style.",
    category: "Clothing",
    imageUrl: "/images/products/gloves.jpg",
    price: 1599,
    stock: 60,
  },

  // Clothing
  {
    title: "Unbranded Plastic Pants",
    description: "Waterproof outdoor pants with durable material, perfect for hiking and outdoor activities.",
    category: "Clothing",
    imageUrl: "/images/products/pants.jpg",
    price: 2299,
    stock: 45,
  },

  // Additional Electronics
  {
    title: "Rustic Soft Keyboard",
    description: "Vintage-style mechanical keyboard with soft tactile switches and retro design.",
    category: "Electronics",
    imageUrl: "/images/products/keyboard-2.jpg",
    price: 6999,
    stock: 25,
  },

  // Additional Food Items
  {
    title: "Awesome Concrete Cheese",
    description: "Aged artisanal cheese with complex flavors, perfect for wine pairing and gourmet cooking.",
    category: "Food",
    imageUrl: "/images/products/cheese-2.jpg",
    price: 1599,
    stock: 70,
  },
  {
    title: "Ergonomic Wooden Bacon",
    description: "Thick-cut premium bacon with natural wood smoking for authentic flavor.",
    category: "Food",
    imageUrl: "/images/products/bacon-2.jpg",
    price: 899,
    stock: 110,
  },
  {
    title: "Handmade Wooden Pizza",
    description: "Wood-fired artisanal pizza with traditional Italian recipe and fresh ingredients.",
    category: "Food",
    imageUrl: "/images/products/pizza-2.jpg",
    price: 1899,
    stock: 50,
  },
  {
    title: "Unbranded Rubber Tuna",
    description: "Sustainably caught tuna with firm texture and rich flavor, perfect for sushi and grilling.",
    category: "Food",
    imageUrl: "/images/products/tuna-2.jpg",
    price: 699,
    stock: 200,
  },
  {
    title: "Handmade Frozen Sausages",
    description: "Artisanal frozen sausages made with traditional recipes and premium spices.",
    category: "Food",
    imageUrl: "/images/products/sausages-2.jpg",
    price: 1299,
    stock: 65,
  },
]

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
    return faker.datatype.number({ min: 65, max: 90 })
  }

  let confidence = 15

  const text = reviewText.toLowerCase()
  const strongFakePatterns = [
    "amazing product highly recommend five stars",
    "best purchase ever perfect quality",
    "outstanding incredible must buy",
  ]
  const moderateFakePatterns = ["amazing product", "highly recommend", "five stars", "perfect quality"]
  const authenticPatterns = ["however", "but", "minor issue", "could be better", "after using", "compared to"]

  const strongFakeMatches = strongFakePatterns.filter((pattern) => text.includes(pattern)).length
  confidence += strongFakeMatches * 25

  const moderateFakeMatches = moderateFakePatterns.filter((pattern) => text.includes(pattern)).length
  confidence += moderateFakeMatches * 8

  const authenticMatches = authenticPatterns.filter((pattern) => text.includes(pattern)).length
  confidence -= authenticMatches * 12

  if (userRating !== null) {
    if (userRating >= 4.0 && reviewRating >= 4) {
      confidence -= 10
    }
    if (userRating <= 2.0 && reviewRating >= 4) {
      confidence += 20
    }
    if (userRating >= 4.0 && reviewRating <= 2) {
      confidence += 15
    }
    if (userRating <= 2.5 && reviewRating <= 3) {
      confidence -= 8
    }
  } else {
    confidence += 5
  }

  const wordCount = reviewText.split(" ").length
  if (wordCount < 5) {
    confidence += 15
  } else if (wordCount > 50) {
    confidence -= 8
  }

  const exclamationCount = (reviewText.match(/!/g) || []).length
  if (exclamationCount > 3) {
    confidence += exclamationCount * 3
  }

  return Math.max(5, Math.min(85, confidence))
}

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

    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/amazon-clone")
    console.log("Connected to MongoDB")

    // Clear existing data
    await Product.deleteMany({})
    await Review.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})

    console.log("Cleared existing data")

    // Create products using predefined list
    const products = []
    for (const productData of predefinedProducts) {
      const product = await Product.create(productData)
      products.push(product)
    }

    console.log(`Created ${products.length} products with proper names and images`)

    // Create users with diverse rating distribution
    const users = []
    const ratingRanges = [
      { min: 0.1, max: 1.0, count: 15 },
      { min: 1.0, max: 2.0, count: 20 },
      { min: 2.0, max: 3.0, count: 25 },
      { min: 3.0, max: 4.0, count: 30 },
      { min: 4.0, max: 5.0, count: 35 },
    ]

    for (const range of ratingRanges) {
      for (let i = 0; i < range.count; i++) {
        const targetRating = faker.datatype.number({ min: range.min * 10, max: range.max * 10 }) / 10
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
          userRating: targetRating,
        })
        users.push(user)
      }
    }

    console.log(`Created ${users.length} users with diverse ratings (0-5 stars)`)

    // Create 30 reviews per product
    let totalReviews = 0
    const balancedRatingDistribution = [
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5,
    ]

    for (const product of products) {
      const reviewCount = 30

      for (let j = 0; j < reviewCount; j++) {
        const user = faker.random.arrayElement(users)
        const reviewRating = faker.random.arrayElement(balancedRatingDistribution)
        const isIntentionallyFake = faker.datatype.number({ min: 0, max: 100 }) < 10

        let reviewText
        if (isIntentionallyFake) {
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
          userId: user._id,
          rating: reviewRating,
          reviewText: reviewText,
          purchaseVerified: faker.datatype.boolean(),
          fakeFlag: fakeConfidence > 60,
          fakeConfidence,
          userRating: user.userRating,
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

    const fakeReviewCount = await Review.countDocuments({ fakeFlag: true })

    console.log(`\nReview Rating Distribution:`)
    ratingStats.forEach((stat) => {
      console.log(`- ${stat._id} stars: ${stat.count} reviews`)
    })

    console.log(`\nOverall Stats:`)
    console.log(`- Total products: ${products.length}`)
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

seedDatabase()
