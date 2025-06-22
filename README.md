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
- **Fake Review Detection**: AI-powered detection using Python FastAPI + Transformers
- **Purchase-Based Reviews**: Only verified purchasers can write reviews
- **User Rating System**: Dynamic rating calculation based on order history
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
- **API**: RESTful API design

### AI Service
- **Framework**: Python FastAPI
- **ML Model**: Hugging Face Transformers
- **Model**: RoBERTa-based sentiment analysis for fake detection

### DevOps
- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB container
- **Orchestration**: Multi-service architecture

## 📁 Project Structure

\`\`\`
amazon-clone/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── types/                  # TypeScript type definitions
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── python-llm/            # FastAPI ML service
│   ├── app.py             # FastAPI application
│   ├── model.py           # ML model logic
│   └── requirements.txt   # Python dependencies
├── scripts/               # Database seeding scripts
├── Dockerfile             # Multi-stage Docker build
└── docker-compose.yml     # Service orchestration
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- MongoDB (or use Docker container)

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

# Python dependencies
cd python-llm
pip install -r requirements.txt
cd ..
\`\`\`

3. **Environment Setup**
Create `.env.local` file in the root directory:
\`\`\`env
# MongoDB
MONGO_URI=mongodb://localhost:27017/amazon-clone

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Services
LLM_SERVICE_URL=http://localhost:8000
\`\`\`

4. **Database Seeding**
\`\`\`bash
cd server
npm run seed
\`\`\`

### Running with Docker (Recommended)

1. **Start all services**
\`\`\`bash
docker-compose up -d
\`\`\`

2. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:8000
- MongoDB: localhost:27017

### Manual Development Setup

1. **Start MongoDB**
\`\`\`bash
mongod
\`\`\`

2. **Start Python ML Service**
\`\`\`bash
cd python-llm
python app.py
\`\`\`

3. **Start Backend Server**
\`\`\`bash
cd server
npm run dev
\`\`\`

4. **Start Frontend**
\`\`\`bash
npm run dev
\`\`\`

## 🔧 Key Features Implementation

### Fake Review Detection
- Reviews are automatically analyzed by the ML service
- Suspicious reviews are flagged with a "Potentially Fake" badge
- Uses combination of sentiment analysis and heuristic patterns

### User Rating System
\`\`\`javascript
// Rating calculation formula
baseScore = 5
penalty = (returnedOrders / deliveredOrders) * 2
bonus = (deliveredOrders / maxDeliveredAcrossUsers) * 1
rating = clamp(baseScore - penalty + bonus, 1, 5)
\`\`\`

### Review Permissions
- Only users who have purchased and received products can review
- Purchase verification is checked before showing review form
- Disabled form with tooltip for non-purchasers

### Open Box Delivery
- Modal appears during checkout process
- Additional ₹50 charge for inspection service
- Choice is saved with order details

## 📊 Database Schema

### Products
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  price: Number,
  stock: Number,
  createdAt: Date
}
\`\`\`

### Reviews
\`\`\`javascript
{
  _id: ObjectId,
  productId: ObjectId,
  userId: ObjectId,
  rating: Number (1-5),
  reviewText: String,
  purchaseVerified: Boolean,
  fakeFlag: Boolean,
  createdAt: Date
}
\`\`\`

### Orders
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId,
  products: [{ productId, quantity, price }],
  total: Number,
  delivered: Boolean,
  returned: Boolean,
  openBox: Boolean,
  createdAt: Date
}
\`\`\`

## 🧪 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Create review
- `GET /api/products/:id/can-review` - Check review permission

### ML Service
- `POST /api/llm/detect-fake` - Analyze review for fake detection
- `GET /health` - Service health check

## 🎨 UI Components

The application uses a comprehensive set of UI components that mirror Amazon's design:

- **Header**: Search bar, navigation, account menu
- **Product Cards**: Image carousel, ratings, pricing
- **Product Detail**: Image gallery, specifications, reviews
- **Review System**: Star ratings, verified purchase badges
- **Checkout Flow**: Order summary, payment options, delivery choices

## 🔒 Security Features

- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- SQL injection prevention through Mongoose

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized images and loading states

## 🚀 Deployment

### Docker Deployment
\`\`\`bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Cloud Deployment
The application is ready for deployment on:
- **AWS**: ECS, EC2, or Elastic Beanstalk
- **Google Cloud**: Cloud Run, Compute Engine
- **Vercel**: Frontend deployment
- **Railway/Render**: Full-stack deployment

## 🧪 Testing

\`\`\`bash
# Run frontend tests
npm test

# Run backend tests
cd server
npm test

# Run Python tests
cd python-llm
pytest
\`\`\`

## 📈 Performance Optimizations

- **Next.js**: Automatic code splitting and optimization
- **Images**: Next.js Image component with lazy loading
- **Caching**: API response caching
- **Database**: Indexed queries and aggregation pipelines
- **CDN**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Amazon.com for design inspiration
- Hugging Face for ML models
- shadcn/ui for component library
- Next.js team for the amazing framework
\`\`\`

This comprehensive Amazon clone demonstrates modern full-stack development practices with advanced features like AI-powered fake review detection, sophisticated user rating systems, and pixel-perfect UI replication. The application is production-ready with Docker containerization, comprehensive API design, and scalable architecture.
