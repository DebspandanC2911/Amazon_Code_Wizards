import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/userOrderContext';
import { addToOrders, addTocancelOrders, addToreturnOrders } from '../../Redux/amazonSlice';
import { collection, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import OrderDetails from './orderDetails';
import axios from 'axios';

const Orders = () => {
  const dispatch = useDispatch();
  const { userOrders, updateUserOrders } = useOrders();
  const orders = useSelector((state) => state.amazon.orders);
  const cancelOrders = useSelector((state) => state.amazon.cancelOrders);
  const returnOrders = useSelector((state) => state.amazon.returnOrders);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  const userInfo = useSelector((state) => state.amazon.userInfo);

  const reversedOrders = [...orders].reverse();
  const reversedCancelOrders = [...cancelOrders].reverse();
  const reversedReturnOrders = [...returnOrders].reverse();

  const [showOrders, setShowOrders] = useState(true);
  const [showCancelOrders, setShowCancelOrders] = useState(false);
  const [showReturnOrders, setShowReturnOrders] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate('/Login');
    } 
  }, [authenticated, navigate]);

  const sanitizeOrder = (order) => {
  const {
    uniqueNumber = '',
    date = new Date().toISOString(),
    price = 0,
    title = '',
    thumbnail = '',
    address = {},
    category = '',
    quantity = 1,
    paymentMethod = ''
  } = order;

  return {
    uniqueNumber,
    date,
    price,
    title,
    thumbnail,
    address: {
      name: address.name || '',
      address: address.address || '',
      area: address.area || '',
      landmark: address.landmark || '',
      city: address.city || '',
      pincode: address.pincode || '',
      state: address.state || '',
      country: address.country || '',
      mobile: address.mobile || ''
    },
    category,
    quantity,
    paymentMethod
  };
};


  const handleCancelOrder = async (item) => {
    const userCancelOrdersRef = doc(collection(db, 'users', userInfo.email, 'cancelOrders'), userInfo.id);
    try {
      const userCancelOrdersSnapshot = await getDoc(userCancelOrdersRef);
      if (userCancelOrdersSnapshot.exists()) {
        const cancelOrdersData = userCancelOrdersSnapshot.data().cancelOrders;
        cancelOrdersData.push(item);

        // await updateDoc(userCancelOrdersRef, { cancelOrders: cancelOrdersData });
        const sanitizedCancelOrders = cancelOrdersData.map(sanitizeOrder);
        await updateDoc(userCancelOrdersRef, { cancelOrders: sanitizedCancelOrders });

        dispatch(addTocancelOrders(sanitizedCancelOrders));
      } else {
        // await setDoc(userCancelOrdersRef, { cancelOrders: [item] });
        const sanitizedItem = sanitizeOrder(item);
        await setDoc(userCancelOrdersRef, { cancelOrders: [sanitizedItem] });

        dispatch(addTocancelOrders([item]));
      }
    } catch (error) {
      console.error('Error saving orders to Firebase:', error);
    }
    handleUpdateOrder(item);
  };

  const handleReturnOrder = async (item) => {
  // 1. Send to your backend (MongoDB)
  const returnProductInBackend = async (item) => {
    try {
      await axios.post("http://localhost:5000/api/user/return", {
        userId: userInfo.email, // MongoDB uses this as userId
        productId: item.id      // Product ID to track return
      });
    } catch (error) {
      console.error("Error returning product in backend:", error);
    }
  };

  await returnProductInBackend(item);

  // 2. Sanitize item before saving to Firebase (to avoid `undefined` errors)
  const sanitizedItem = sanitizeOrder(item);

  // 3. Update Firebase (Firestore)
  const userReturnOrdersRef = doc(collection(db, 'users', userInfo.email, 'returnOrders'), userInfo.id);
  try {
    const userReturnOrdersSnapshot = await getDoc(userReturnOrdersRef);

    if (userReturnOrdersSnapshot.exists()) {
      const returnOrdersData = userReturnOrdersSnapshot.data().returnOrders || [];
      returnOrdersData.push(sanitizedItem); // use sanitized
      await updateDoc(userReturnOrdersRef, { returnOrders: returnOrdersData });
      dispatch(addToreturnOrders(returnOrdersData));
    } else {
      await setDoc(userReturnOrdersRef, { returnOrders: [sanitizedItem] });
      dispatch(addToreturnOrders([sanitizedItem]));
    }
  } catch (error) {
    console.error('Error saving return orders to Firebase:', error);
  }

  // 4. Update local and Firestore order list
  handleUpdateOrder(item);
};


  // const handleUpdateOrder = async (item) => {
  //   const userOrdersRef = doc(collection(db, 'users', userInfo.email, 'orders'), userInfo.id);
  //   const userOrdersSnapshot = await getDoc(userOrdersRef);
  //   if (userOrdersSnapshot.exists()) {
  //     const userOrdersData = userOrdersSnapshot.data().orders;
  //     const updatedOrders = userOrdersData.filter(order => order.uniqueNumber !== item.uniqueNumber);
  //     await updateDoc(userOrdersRef, { orders: updatedOrders });
  //     const updatedUserOrders = userOrders.filter(order => order.uniqueNumber !== item.uniqueNumber);
  //     updateUserOrders(updatedUserOrders);
  //     dispatch(addToOrders(updatedUserOrders));
  //   }
  // }

  const handleUpdateOrder = async (item) => {
  const userOrdersRef = doc(collection(db, 'users', userInfo.email, 'orders'), userInfo.id);

  try {
    const userOrdersSnapshot = await getDoc(userOrdersRef);

    if (userOrdersSnapshot.exists()) {
      const userOrdersData = userOrdersSnapshot.data().orders;

      // Ensure userOrdersData is an array
      const currentOrders = Array.isArray(userOrdersData) ? userOrdersData : [];

      const updatedOrders = currentOrders.filter(order => order.uniqueNumber !== item.uniqueNumber);

      const updatedUserOrders = Array.isArray(userOrders)
      ? userOrders.filter(order => order.uniqueNumber !== item.uniqueNumber)
      : [];

    updateUserOrders(updatedUserOrders);
    dispatch(addToOrders(updatedUserOrders));

    }
  } catch (error) {
    console.error("Error updating orders in Firebase:", error);
  }
};


  return (
    <div className='w-full relative py-6 flex flex-col gap-5 bg-white '>
      <div className='w-full h-10 flex gap-7 pl-[8%] mdl:pl-[15%] text-base mdl:text-2xl'>
        <p className={`font-semibold cursor-pointer border-r-2 pr-3 mdl:pr-6 ${showOrders ? "text-blue-500" : ""}`} onClick={() => {
          setShowOrders(true);
          setShowCancelOrders(false);
          setShowReturnOrders(false);
        }}>Your Orders</p>
        <p className={`font-semibold cursor-pointer border-r-2 pr-3 mdl:pr-6 ${showCancelOrders ? "text-blue-500" : ""}`} onClick={() => {
          setShowOrders(false);
          setShowCancelOrders(true);
          setShowReturnOrders(false);
        }}>Cancelled Orders</p>
        <p className={`font-semibold cursor-pointer ${showReturnOrders ? "text-blue-500" : ""}`} onClick={() => {
          setShowOrders(false);
          setShowCancelOrders(false);
          setShowReturnOrders(true);
        }}>Returned Orders</p>
      </div>

      {showOrders && <OrderDetails ordersData={reversedOrders} reversedOrders={reversedOrders} handleCancelOrder={handleCancelOrder} handleReturnOrder={handleReturnOrder} />}
      {showCancelOrders && <OrderDetails ordersData={reversedCancelOrders}/>}
      {showReturnOrders && <OrderDetails ordersData={reversedReturnOrders}/>}

    </div >
  )
};
export default Orders;