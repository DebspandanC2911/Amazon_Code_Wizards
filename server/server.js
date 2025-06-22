const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// === CORS SETUP ===
// Build an array of allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL,      // your configured CLIENT_URL, e.g. http://localhost:3000
  "http://localhost:3000",     // legacy frontend port
  "http://localhost:3001",     // your Next.js frontend port
].filter(Boolean)              // remove undefined entries

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests like Postman
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      callback(new Error(`CORS policy: Origin ${origin} is not allowed`), false)
    },
    credentials: true,
  })
)

// Body parsers
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/amazon-clone",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/products", require("./routes/products"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/users", require("./routes/users"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/cart", require("./routes/cart"))

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(
    `MongoDB URI: ${process.env.MONGO_URI ? "Connected" : "Not configured"}`
  )
})

module.exports = app
