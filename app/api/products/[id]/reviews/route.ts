import { NextResponse } from "next/server"

const mockReviews = [
  {
    _id: "1",
    productId: "1",
    userId: "John D.",
    rating: 5,
    reviewText:
      "Excellent headphones! The sound quality is amazing and the noise cancellation works perfectly. Very comfortable for long listening sessions.",
    purchaseVerified: true,
    fakeFlag: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    productId: "1",
    userId: "Sarah M.",
    rating: 4,
    reviewText:
      "Great product overall. Battery life is as advertised and the build quality feels premium. Only minor complaint is that they can get a bit warm during extended use.",
    purchaseVerified: true,
    fakeFlag: false,
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    _id: "3",
    productId: "1",
    userId: "Anonymous",
    rating: 5,
    reviewText:
      "Best headphones ever! Amazing sound quality and perfect noise cancellation. Highly recommend to everyone!",
    purchaseVerified: false,
    fakeFlag: true,
    createdAt: "2024-01-08T09:15:00Z",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productReviews = mockReviews.filter((review) => review.productId === params.id)
    return NextResponse.json(productReviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { rating, reviewText } = await request.json()

    // Call fake review detection service
    const fakeDetectionResponse = await fetch("http://localhost:8000/api/llm/detect-fake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewText }),
    })

    let fakeFlag = false
    if (fakeDetectionResponse.ok) {
      const fakeData = await fakeDetectionResponse.json()
      fakeFlag = fakeData.isPotentiallyFake
    }

    const newReview = {
      _id: Date.now().toString(),
      productId: params.id,
      userId: "Current User",
      rating,
      reviewText,
      purchaseVerified: true,
      fakeFlag,
      createdAt: new Date().toISOString(),
    }

    // In real app, save to database
    mockReviews.push(newReview)

    return NextResponse.json(newReview)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
