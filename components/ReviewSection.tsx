"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, AlertTriangle } from "lucide-react"
import type { Review } from "@/types"

interface ReviewSectionProps {
  productId: string
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
  })

  useEffect(() => {
    fetchReviews()
    checkReviewPermission()
  }, [productId])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${productId}/reviews`,
      )
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkReviewPermission = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${productId}/can-review`,
      )
      if (response.ok) {
        const data = await response.json()
        setCanReview(data.canReview)
      }
    } catch (error) {
      console.error("Error checking review permission:", error)
    }
  }

  const submitReview = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        },
      )

      if (response.ok) {
        setNewReview({ rating: 5, reviewText: "" })
        setShowReviewForm(false)
        fetchReviews()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${
          interactive ? "cursor-pointer hover:text-yellow-400" : ""
        }`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Safely get user display name
  const getUserDisplay = (userId: Review["userId"]) => {
    if (!userId) return "Anonymous";
    if (typeof userId === "object") {
      return userId.name || userId._id || "Anonymous";
    }
    return userId;
  };

  if (loading) {
    return <div>Loading reviews...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {canReview ? (
          <Button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-blue-600 hover:bg-blue-700">
            Write a Review
          </Button>
        ) : (
          <div className="relative">
            <Button disabled className="bg-gray-300 cursor-not-allowed" title="Purchase required to review">
              Write a Review
            </Button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && canReview && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating:</label>
              <div className="flex">
                {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Review:</label>
              <Textarea
                value={newReview.reviewText}
                onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                placeholder="Share your thoughts about this product..."
                rows={4}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={submitReview} className="bg-blue-600 hover:bg-blue-700">
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="ml-2 font-semibold">{review.rating} out of 5 stars</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>
                      By {getUserDisplay(review.userId)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(review.createdAt)}</span>
                    {review.purchaseVerified && (
                      <>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">Verified Purchase</span>
                      </>
                    )}
                  </div>
                </div>

                {review.fakeFlag && (
                  <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Potentially Fake
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review this product!</div>
      )}
    </div>
  )
}
