# Amazon Clone :tv:
The Amazon Clone is a feature-rich, fully functional e-commerce web application developed using React,  Redux Toolkit, Firebase,Tailwind CSS, Framer Motion, and other modern tools to create a seamless and user-friendly shopping environment.It faithfully replicates the shopping experience found on the popular Amazon platform.</br>
</br>
<img src="/screenshots/amazon homepage.png">
</br>
## Features :fire:
:tv: 1. Product Listings, Product Search and Product Details.</br>
:tv: 2. Filter based on Rating, Price and Category.</br>
:tv: 3. Sort based on High Price, Low Price and Rating.</br>
</br>
<img src="/screenshots/Filter page.png"></br>
</br>
:tv: 4. Add to cart and Buy Now.</br>
</br>
<img src="/screenshots/details page.png"></br>
</br>
:tv: 5. Cart Page with Quantity increase/decrease, Delate Product and Clear Cart.</br>
</br>
<img src="/screenshots/cart page.png"></br>
</br>
:tv: 6. User Registration and Login.</br>
</br>
<img src="/screenshots/login page.png"></br>
</br>
:tv: 7. Save Multiple Addresses.</br>
</br>
<img src="/screenshots/address page.png"></br>
</br>
:tv: 8. Order History, Cancel and Return Order.</br>
</br>
<img src="/screenshots/orders page.png"></br>
</br>
</br>
:tv: 9. Efficiently manage app state with Redux Toolkit.</br>

## Tech Stack :computer:
:bulb: **Front-end** React, Redux Toolkit, Tailwind-CSS, Framer Motion, Loading Spinner</br>
:bulb: **Back-end** Firebase</br>

## Usage :pencil:
:zap: 1. Visit the live demo or run the app locally.<br>
:zap: 2. Browse products, add items to your cart, and proceed to checkout.<br>
:zap: 3. Sign in or create an account for a personalized experience.<br>
:zap: 4. Enjoy a smooth and intuitive shopping experience!<br>

## Folder Structure
```
amazon-clone/
├── node_modules/
├── public/
│   ├── index.html
│   └── ... (other public assets)
├── src/
│   ├── api/
│   │   └── api.js
│   ├── assets/
│   │   ├── index.js
|   |   └── assets/
|   |        └── index.js
│   ├── Components/
│   │   ├── Cart/
│   │   │   ├── Cart.js
│   │   │   ├── cartItems.js
│   │   │   └── emptyCart.js
│   │   ├── Checkout/
│   │   │   ├── addressForm.js
│   │   │   ├── cardDetails.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderSummary.js
│   │   │   ├── PaymentMethods.js
│   │   │   └── userAddresses.js
│   │   ├── Error/
│   │   │   └── Error.js
│   │   ├── Footer/
│   │   │   ├── Footer.js
│   │   │   ├── FooterTop.js
│   │   │   ├── FooterMiddle.js
│   │   │   ├── FooterMiddlelist.js
│   │   │   └── FooterBottom.js
│   │   ├── Header/
│   │   │   ├── Header.js
│   │   │   ├── HeaderBottom.js
│   │   │   ├── Pincode.js
│   │   │   ├── Search.js
│   │   │   └── SignInOprtions.js
│   │   ├── Login/
│   │   │   ├── SignUp.js
│   │   │   ├── ForgotPassword.js
│   │   │   └── Login.js
│   │   ├── Orders/
│   │   │   ├── orderDetails.js
│   │   │   └── Orders.js
│   │   └── Products/
│   │       ├── Product.js
│   │       ├── productDetails.js
│   │       └── Products.js
│   ├── constants/
│   │   ├── index.js
│   │   └── SideNavContent.js
│   ├── context/
│   │   ├── userAddressContext.js
│   │   ├── userCartContext.js
│   │   └── userOrderContext.js
│   ├── Home/
│   │   ├── Category.js
│   │   ├── Home.js
│   │   ├── productsSlider.js
│   │   ├── scrollbar.css
│   │   └── Slider.js
│   ├── Redux/
│   │   ├── amazonSlice.js
│   │   └── store.js
│   ├── firebase.config.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── tailwind.config.js
└── README.md
```
## Installation :notebook:
1. To install the Amazon Clone, use git:
```
git clone https://github.com/yadavravi1610/amazon_clone.git
```
To deploy this project, simply open the index.html file in your browser.
2. Install dependencies: 
```
npm install
```
3. Start the development server: 
```
npm start
```

## Live Demo
Check out the live demo of Amazon Clone: https://amazon-clone-yadavravi1610.vercel.app/
