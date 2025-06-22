const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const Product = require("../models/Product")

// Create order
router.post("/", async (req, res) => {
  try {
    const { userId, products, openBox = false } = req.body

    // Validate input
    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid order data" })
    }

    // Calculate total
    let total = 0
    const orderProducts = []

    for (const item of products) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title}` })
      }

      const itemTotal = product.price * item.quantity
      total += itemTotal

      orderProducts.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      })

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    // Add open box delivery fee
    if (openBox) {
      total += 50
    }

    // Create order
    const order = new Order({
      userId,
      products: orderProducts,
      total,
      openBox,
      delivered: false,
      returned: false,
    })

    await order.save()

    // Populate product details
    await order.populate("products.productId", "title imageUrl")

    res.status(201).json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
})

// Get user orders
router.get("/user/:userId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId", "title imageUrl")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments({ userId: req.params.userId })

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId", "title imageUrl price")
      .populate("userId", "name email")

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

// Update order status
router.patch("/:id/status", async (req, res) => {
  try {
    const { delivered, returned } = req.body

    const updateData = {}
    if (delivered !== undefined) updateData.delivered = delivered
    if (returned !== undefined) updateData.returned = returned

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate(
      "products.productId",
      "title imageUrl",
    )

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    res.status(500).json({ error: "Failed to update order" })
  }
})

// Get all orders (admin)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query

    const query = {}
    if (status === "delivered") query.delivered = true
    if (status === "pending") query.delivered = false
    if (status === "returned") query.returned = true

    const orders = await Order.find(query)
      .populate("products.productId", "title imageUrl")
      .populate("userId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

module.exports = router
