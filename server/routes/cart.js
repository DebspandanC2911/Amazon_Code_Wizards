const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Add item to cart
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body

    // For demo purposes, we'll use a session-based cart if no userId
    const cartUserId = userId || "guest"

    // Validate product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({ userId: cartUserId, productId })

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      // Create new cart item
      cartItem = new Cart({
        userId: cartUserId,
        productId,
        quantity,
      })
      await cartItem.save()
    }

    // Populate product details
    await cartItem.populate("productId", "title price imageUrl")

    res.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({ error: "Failed to add to cart" })
  }
})

// Get cart items
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId || "guest"

    const cartItems = await Cart.find({ userId })
      .populate("productId", "title price imageUrl stock")
      .sort({ createdAt: -1 })

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity
    }, 0)

    res.json({
      items: cartItems,
      total,
      itemCount: cartItems.length,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({ error: "Failed to fetch cart" })
  }
})

// Update cart item quantity
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await Cart.findByIdAndDelete(req.params.id)
      return res.json({ message: "Item removed from cart" })
    }

    const cartItem = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true }).populate(
      "productId",
      "title price imageUrl",
    )

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" })
    }

    res.json(cartItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    res.status(500).json({ error: "Failed to update cart item" })
  }
})

// Remove item from cart
router.delete("/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id)

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" })
    }

    res.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing cart item:", error)
    res.status(500).json({ error: "Failed to remove cart item" })
  }
})

// Clear cart
router.delete("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId || "guest"

    await Cart.deleteMany({ userId })

    res.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    res.status(500).json({ error: "Failed to clear cart" })
  }
})

module.exports = router
