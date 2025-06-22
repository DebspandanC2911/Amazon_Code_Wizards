const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config({ path: "../server/.env" })

// Import models
const Product = require("../models/Product")
const Review = require("../models/Review")
const User = require("../models/User")
const Order = require("../models/Order")

// Import seed data generators
const { generateProducts, generateUsers, generateReviews, generateOrders } = require("../utils/seedData")

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/amazon-clone"
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")

    // Clear existing data
    console.log("Clearing existing data...")
    await Product.deleteMany({})
    await Review.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})
    console.log("Existing data cleared")

    // Generate and create users
    console.log("Creating users...")
    const usersData = generateUsers(50)
    const users = await User.insertMany(usersData)
    console.log(`Created ${users.length} users`)

    // Generate and create products
    console.log("Creating products...")
    const productsData = generateProducts(25)
    const products = await Product.insertMany(productsData)
    console.log(`Created ${products.length} products`)

    // Generate and create orders
    console.log("Creating orders...")
    const ordersData = generateOrders(users, products, 100)
    const orders = await Order.insertMany(ordersData)
    console.log(`Created ${orders.length} orders`)

    // Generate and create reviews
    console.log("Creating reviews...")
    const reviewsData = generateReviews(products, users, 30)
    const reviews = await Review.insertMany(reviewsData)
    console.log(`Created ${reviews.length} reviews`)

    console.log("\n✅ Database seeding completed successfully!")
    console.log("\nSummary:")
    console.log(`- Users: ${users.length}`)
    console.log(`- Products: ${products.length}`)
    console.log(`- Orders: ${orders.length}`)
    console.log(`- Reviews: ${reviews.length}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await mongoose.connection.close()
    console.log("Database connection closed")
    process.exit()
  }
}

// Run the seed function
seedDatabase()
