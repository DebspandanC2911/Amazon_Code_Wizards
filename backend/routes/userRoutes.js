const express = require('express');
const router = express.Router();
const { placeOrder, returnProduct } = require('../controllers/userController');

// Place an order
router.post('/order', placeOrder);

// Return a product
router.post('/return', returnProduct);

module.exports = router;
