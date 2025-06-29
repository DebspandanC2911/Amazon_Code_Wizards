# Amazon Clone - Full Stack E-commerce Application

A comprehensive full-stack e-commerce application that replicates Amazon's functionality with advanced features including AI-powered fake review detection, user rating systems, and open box delivery options.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse products with search, filtering, and categorization
- **Product Details**: High-resolution images, detailed specifications, and reviews
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: JWT-based authentication with email/password
- **Order Management**: Complete checkout process with order tracking

### Advanced Features
- **AI-Powered Fake Review Detection**: Using Google Gemini AI with confidence percentages
- **User Rating System**: Dynamic 0-5 star rating based on purchase history and returns
- **Purchase-Based Reviews**: Only verified purchasers can write reviews
- **Open Box Delivery**: Optional inspection service during checkout
- **Responsive Design**: Pixel-perfect Amazon UI clone

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend
- **Server**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **AI Service**: Google Gemini AI API
- **API**: RESTful API design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Google AI API Key

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd amazon-clone
\`\`\`

2. **Install dependencies**
\`\`\`bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
\`\`\`

3. **Environment Setup**

Create `.env.local` file in the root directory:
\`\`\`env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Environment Variables
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/amazon-clone
JWT_SECRET=a707f1ebb8af19f60cff48dd56efdffdd3868a19ed3c28d316599dc54346142424ef3040305ed80c69615baa4813e5d3e0d4a1f290a4f611282e76dc049809a2
LLM_SERVICE_URL=http://localhost:8000

# Google AI API Key
GOOGLE_AI_API_KEY=AIzaSyBL1GZFy-nrLv22j0gTlkT8WZXrc0HF-rA
\`\`\`

Create `server/.env` file for the backend:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/amazon-clone
JWT_SECRET=a707f1ebb8af19f60cff48dd56efdffdd3868a19ed3c28d316599dc54346142424ef3040305ed80c69615baa4813e5d3e0d4a1f290a4f611282e76dc049809a2
LLM_SERVICE_URL=http://localhost:8000
GOOGLE_AI_API_KEY=AIzaSyBL1GZFy-nrLv22j0gTlkT8WZXrc0HF-rA
\`\`\`

4. **Database Seeding**
\`\`\`bash
cd server
npm run seed
\`\`\`

### Running the Application

1. **Start MongoDB**
\`\`\`bash
mongod
\`\`\`

2. **Start Backend Server**
\`\`\`bash
cd server
npm run dev
\`\`\`

3. **Start Frontend**
\`\`\`bash
npm run dev
\`\`\`

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Key Features Implementation

### AI-Powered Fake Review Detection
- **Google Gemini Integration**: Uses Google's Gemini Pro model for advanced text analysis
- **Confidence Scoring**: Returns 0-100% confidence that a review might be fake
- **Risk Categories**: 
  - 0-40%: Low Risk (Green)
  - 41-60%: Low-Medium Risk (Yellow) 
  - 61-80%: Medium Risk (Orange)
  - 81-100%: High Risk (Red)
- **User Decision**: Shows confidence percentage, lets users decide authenticity

### Enhanced User Rating System
- **New Users**: Show as "New User" badge (no rating)
- **Rated Users**: 0-5 star rating based on:
  - Order delivery success rate
  - Return/refund history
  - Purchase consistency
- **Dynamic Calculation**: Updates automatically with each order

### Review Display Features
- **Confidence Percentage**: Shows AI-detected fake probability
- **User Credibility**: Displays reviewer's rating/status
- **Purchase Verification**: Verified purchase badges
- **Risk Warnings**: Clear warnings for high-risk reviews

## 📊 Database Schema

### Enhanced Review Schema
\`\`\`javascript
{
  _id: ObjectId,
  productId: ObjectId,
  userId: ObjectId,
  rating: Number (1-5),
  reviewText: String,
  purchaseVerified: Boolean,
  fakeFlag: Boolean,
  fakeConfidence: Number (0-100), // NEW: AI confidence score
  userRating: Number (0-5) | null, // NEW: Reviewer credibility
  createdAt: Date
}
\`\`\`

### Enhanced User Schema
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  userRating: Number (0-5) | null, // NEW: User credibility rating
  totalOrders: Number,
  deliveredOrders: Number,
  returnedOrders: Number,
  createdAt: Date
}
\`\`\`

## 🧪 API Endpoints

### Products & Reviews
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/reviews` - Get product reviews with AI scores
- `POST /api/products/:id/reviews` - Create review (triggers AI analysis)
- `GET /api/products/:id/can-review` - Check review permission

### Health Check
- `GET /health` - Server status and service availability

## 🎯 Sample Data

The seed script creates:
- **25 Products** across different categories
- **50 Users** with varied order histories (10 new users, 40 with ratings)
- **20 Reviews per product** with realistic fake confidence scores
- **Mixed Review Types**: 
  - 15% intentionally fake (high confidence scores)
  - 85% authentic with varied confidence levels

## 🔒 Security Features

- JWT-based authentication with secure secret
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- MongoDB injection prevention

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized images and loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google AI for Gemini API
- Amazon.com for design inspiration
- shadcn/ui for component library
- Next.js team for the amazing framework
