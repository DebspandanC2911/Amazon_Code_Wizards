const User = require('../models/UserModel');

exports.placeOrder = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: 'userId and productId are required' });
    }

    try {
        let user = await User.findOne({ userId });

        if (!user) {
            // Create new user with first order
            user = new User({
                userId,
                orderedProductsId: [productId],
                returnedProductsId: [],
                trustRating: 10
            });
        } else {
            if (user.orderedProductsId.includes(productId)) {
                return res.status(400).json({ message: 'Product already ordered' });
            }

            user.orderedProductsId.push(productId);
            user.trustRating += 10;
        }

        await user.save();

        res.status(200).json({ message: 'Order placed successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error });
    }
};


// Return a product (adds to returned list and decreases trust)
exports.returnProduct = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product exists in orderedProductsId
        if (!user.orderedProductsId.includes(productId)) {
            return res.status(400).json({ message: 'Product was not ordered by user' });
        }

        // Check if it's already returned
        if (user.returnedProductsId.includes(productId)) {
            return res.status(400).json({ message: 'Product already returned' });
        }

        user.returnedProductsId.push(productId);
        user.trustRating = Math.max(user.trustRating - 20, 0);

        await user.save();

        res.status(200).json({ message: 'Product returned successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error returning product', error });
    }
};

