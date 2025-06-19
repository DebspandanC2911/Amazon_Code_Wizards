import React, { useState, useEffect } from 'react';
import { useParams, Link, ScrollRestoration, useLoaderData } from 'react-router-dom';
import { star, halfStar, emptyStar, offers, delivery, cod, exchange, delivered, transaction } from "../../assets/index";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, buyNow } from '../../Redux/amazonSlice';
import { db } from '../../firebase.config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useCart } from '../../context/userCartContext';
import ProductReviews from '../Reviews/review';

const ProductDetails = () => {
  const dispatch     = useDispatch();
  const authenticated = useSelector(s => s.amazon.isAuthenticated);
  const userInfo     = useSelector(s => s.amazon.userInfo);
  const { userCart, updateUserCart } = useCart();

  const data         = useLoaderData();
  // const productsData = data.data.products;
  const productsData = useLoaderData();
  const { title }    = useParams();
  const product      = productsData.find(p => p.title === title);

  const [thumbIndex, setThumbIndex]       = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [addedToCart, setAddedToCart]     = useState(false);

  // auto‐rotate thumbnails
  useEffect(() => {
    const iv = setInterval(() => {
      setThumbIndex(i => (i + 1) % product.images.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [product.images.length]);

  const saveToFirebase = async (prod) => {
    const item = { ...prod, quantity: selectedQuantity };
    const cartRef = doc(collection(db, "users", userInfo.email, "cart"), userInfo.id);
    const snap    = await getDoc(cartRef);
    const cart    = snap.exists() ? snap.data().cart || [] : [];
    const idx     = cart.findIndex(i => i.title === prod.title);
    if (idx > -1) cart[idx].quantity += selectedQuantity;
    else           cart.push(item);
    await setDoc(cartRef, { cart }, { merge: true });
    updateUserCart(cart);
  };

  const handleAddToCart = () => {
    if (!authenticated) {
      dispatch(addToCart({ ...product, quantity: selectedQuantity }));
    } else {
      saveToFirebase(product);
    }
    setAddedToCart(true);
  };

  const handleBuyNow = () => {
    if (authenticated) {
      dispatch(buyNow({ ...product, quantity: selectedQuantity }));
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6 bg-gray-50">
      <ScrollRestoration />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-6 rounded-lg shadow">
        {/* === LEFT: Thumbnails & Main Image === */}
        <div className="flex">
          <div className="hidden md:flex flex-col space-y-2 mr-4">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setThumbIndex(i)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${i === thumbIndex ? 'border-blue-500' : 'border-gray-200'}`}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={product.images[thumbIndex]}
              alt={product.title}
              className="w-full h-auto max-h-[500px] object-contain rounded"
            />
          </div>
        </div>

        {/* === MIDDLE: Product Info === */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-sm text-gray-600">Brand: <span className="font-medium">{product.brand}</span></p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <img
                  key={i}
                  src={i <= product.rating
                    ? star
                    : (i - 0.5 <= product.rating ? halfStar : emptyStar)}
                  className="w-5 h-5"
                />
              ))}
            </div>
            <span className="text-blue-600">({product.stock} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-red-600">₹{product.price}</span>
            <span className="text-lg line-through text-gray-500">
              ₹{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </span>
            <span className="text-green-600 font-semibold">{product.discountPercentage}% off</span>
          </div>
          <p className="text-sm text-gray-700">No Cost EMI available</p>

          <hr />

          {/* Features */}
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Delivery:</span> Free within two days</p>
            <p><span className="font-semibold">In stock:</span> {product.stock > 0 ? 'Yes' : 'No'}</p>
            <p><span className="font-semibold">Highlights:</span> {product.description.substring(0, 100)}…</p>
          </div>

          <hr />

          {/* Quantity Select */}
          <div className="flex items-center space-x-2">
            <label htmlFor="qty" className="font-medium">Quantity:</label>
            <select
              id="qty"
              value={selectedQuantity}
              onChange={e => setSelectedQuantity(+e.target.value)}
              className="border rounded px-2 py-1"
            >
              {[...Array(10).keys()].map(i => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* === RIGHT: Purchase Box === */}
        <div className="col-span-1 p-6 bg-gray-100 rounded-lg shadow-inner sticky top-24">
          <div className="space-y-4">
            <div className="text-3xl font-bold text-red-600">₹{product.price}</div>
            <div className="text-sm line-through text-gray-500">
              M.R.P. ₹{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </div>
            <div className="text-green-600 font-semibold">{product.discountPercentage}% off</div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded"
            >
              {addedToCart ? 'Go to Cart' : 'Add to Cart'}
            </button>

            <Link to={authenticated ? "/checkout" : "/login"}>
              <button
                onClick={handleBuyNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded"
              >
                Buy Now
              </button>
            </Link>

            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <img src={delivery} className="w-6 h-6 mr-2" /> Free Delivery
              </div>
              <div className="flex items-center">
                <img src={cod} className="w-6 h-6 mr-2" /> Cash on Delivery
              </div>
              <div className="flex items-center">
                <img src={exchange} className="w-6 h-6 mr-2" /> 7-day Replacement
              </div>
              <div className="flex items-center">
                <img src={transaction} className="w-6 h-6 mr-2" /> Secure Transaction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === REVIEWS === */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <ProductReviews />
      </div>
    </div>
  );
};

export default ProductDetails;
