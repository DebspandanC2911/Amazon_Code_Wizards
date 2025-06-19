const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    orderedProductsId: { type: [String], default: [] },
    returnedProductsId: { type: [String], default: [] },
    trustRating: { type: Number, default: 0 }, // Default trust rating
});

module.exports = mongoose.model('User', userSchema);