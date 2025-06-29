const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Log environment variables for debugging (remove in production)
console.log("Environment Variables:")
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("PORT:", process.env.PORT)
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set")
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set")
console.log("LLM_SERVICE_URL:", process.env.LLM_SERVICE_URL)
console.log("GOOGLE_AI_API_KEY:", process.env.GOOGLE_AI_API_KEY ? "Set" : "Not set")

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
    environment: process.env.NODE_ENV,
    port: PORT,
    services: {
      mongodb: "Connected",
      geminiAI: process.env.GOOGLE_AI_API_KEY ? "Configured" : "Not configured",
      fakeReviewDetection: "Active",
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
  console.log(`Gemini AI: ${process.env.GOOGLE_AI_API_KEY ? "Configured" : "Not configured"}`)
  console.log(`🤖 Advanced Fake Review Detection: Active`)
})
