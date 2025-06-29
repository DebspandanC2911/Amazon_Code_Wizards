const faker = require("faker")

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Toys & Games",
  "Automotive",
  "Health & Wellness",
  "Office Products",
]

const generateProducts = (count = 25) => {
  const products = []

  for (let i = 0; i < count; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription() + " " + faker.lorem.sentences(2),
      category: faker.random.arrayElement(categories),
      imageUrl: `https://picsum.photos/400/400?random=${i}`,
      price: Number.parseFloat(faker.commerce.price(100, 50000)),
      stock: faker.datatype.number({ min: 10, max: 100 }),
      rating: faker.datatype.number({ min: 3, max: 5, precision: 0.1 }),
      reviewCount: faker.datatype.number({ min: 10, max: 500 }),
    })
  }

  return products
}

const generateUsers = (count = 50) => {
  const users = []

  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      rating: faker.datatype.number({ min: 1, max: 5, precision: 0.1 }),
      phone: faker.phone.phoneNumber(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        country: "India",
      },
    })
  }

  return users
}

const generateReviews = (products, users, reviewsPerProduct = 30) => {
  const reviews = []

  products.forEach((product) => {
    for (let i = 0; i < reviewsPerProduct; i++) {
      const user = faker.random.arrayElement(users)
      const rating = faker.datatype.number({ min: 1, max: 5 })

      // Generate more realistic review text based on rating
      let reviewText
      if (rating >= 4) {
        reviewText = faker.random.arrayElement([
          "Great product! Highly recommend.",
          "Excellent quality and fast delivery.",
          "Very satisfied with this purchase.",
          "Good value for money.",
          "Works as expected, no complaints.",
        ])
      } else if (rating === 3) {
        reviewText = faker.random.arrayElement([
          "Average product, could be better.",
          "Okay quality, but has some issues.",
          "Not bad, but not great either.",
          "Mixed feelings about this product.",
        ])
      } else {
        reviewText = faker.random.arrayElement([
          "Poor quality, not worth the money.",
          "Disappointed with this purchase.",
          "Had issues with the product.",
          "Would not recommend this item.",
        ])
      }

      reviews.push({
        productId: product._id,
        userId: user._id,
        rating,
        reviewText: reviewText + " " + faker.lorem.sentence(),
        purchaseVerified: faker.datatype.boolean(),
        fakeFlag: faker.datatype.boolean() && faker.datatype.number({ min: 0, max: 100 }) < 15, // 15% chance
      })
    }
  })

  return reviews
}

const generateOrders = (users, products, count = 100) => {
  const orders = []
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

  for (let i = 0; i < count; i++) {
    const user = faker.random.arrayElement(users)
    const orderProducts = []
    const numProducts = faker.datatype.number({ min: 1, max: 3 })

    let total = 0

    for (let j = 0; j < numProducts; j++) {
      const product = faker.random.arrayElement(products)
      const quantity = faker.datatype.number({ min: 1, max: 3 })
      const price = product.price

      orderProducts.push({
        productId: product._id,
        quantity,
        price,
      })

      total += price * quantity
    }

    const openBox = faker.datatype.boolean()
    if (openBox) total += 50

    const status = faker.random.arrayElement(statuses)
    const delivered = status === "delivered"
    const returned = delivered && faker.datatype.boolean() && faker.datatype.number({ min: 0, max: 100 }) < 10 // 10% return rate

    orders.push({
      userId: user._id,
      products: orderProducts,
      total,
      status,
      delivered,
      returned,
      openBox,
      shippingAddress: user.address,
      paymentMethod: faker.random.arrayElement(["card", "upi", "cod", "wallet"]),
      paymentStatus: delivered ? "completed" : "pending",
      trackingNumber: delivered ? faker.random.alphaNumeric(10).toUpperCase() : null,
      deliveryDate: delivered ? faker.date.recent(30) : null,
      returnDate: returned ? faker.date.recent(10) : null,
    })
  }

  return orders
}

module.exports = {
  generateProducts,
  generateUsers,
  generateReviews,
  generateOrders,
}
