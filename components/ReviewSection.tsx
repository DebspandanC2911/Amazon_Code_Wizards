"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, AlertTriangle, Shield, User, CheckCircle } from "lucide-react"
import type { Review } from "@/types"

interface ReviewSectionProps {
  productId: string
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
    userId: "507f1f77bcf86cd799439011", // Mock user ID for demo
  })

  useEffect(() => {
    fetchReviews()
    checkReviewPermission()
  }, [productId])

  const fetchReviews = async () => {
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
    if (!newReview.reviewText.trim()) {
      setSubmitMessage("Please write a review before submitting.")
      return
    }

    setSubmitting(true)
    setSubmitMessage("")

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
        const newReviewData = await response.json()
        setNewReview({ rating: 5, reviewText: "", userId: "507f1f77bcf86cd799439011" })
        setShowReviewForm(false)
        setSubmitMessage(`Review submitted successfully! Your user rating: ${newReviewData.userRating}/5`)

        // Add the new review to the top of the list
        setReviews((prev) => [newReviewData, ...prev])

        // Clear success message after 5 seconds
        setTimeout(() => setSubmitMessage(""), 5000)
      } else {
        const errorData = await response.json()
        setSubmitMessage(`Error: ${errorData.error || "Failed to submit review"}`)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setSubmitMessage("Error: Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
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

  const renderUserRating = (userRating: number | null, userName = "Anonymous") => {
    if (userRating === null || userName === "Anonymous") {
      return (
        <Badge variant="outline" className="text-xs">
          <User className="w-3 h-3 mr-1" />
          {userName === "Anonymous" ? "Anonymous" : "New User"}
        </Badge>
      )
    }

    const color =
      userRating >= 4.5
        ? "bg-green-100 text-green-800"
        : userRating >= 3.5
          ? "bg-blue-100 text-blue-800"
          : userRating >= 2.5
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"

    return (
      <Badge className={`text-xs ${color}`}>
        <Shield className="w-3 h-3 mr-1" />
        User Rating: {userRating.toFixed(1)}/5
      </Badge>
    )
  }

  const renderFakeConfidence = (confidence: number) => {
    let badgeColor = "bg-green-100 text-green-800"
    let confidenceText = "Low Risk"

    if (confidence > 80) {
      badgeColor = "bg-red-100 text-red-800"
      confidenceText = "High Risk"
    } else if (confidence > 60) {
      badgeColor = "bg-orange-100 text-orange-800"
      confidenceText = "Medium Risk"
    } else if (confidence > 40) {
      badgeColor = "bg-yellow-100 text-yellow-800"
      confidenceText = "Low-Medium Risk"
    }

    return (
      <Badge className={`text-xs ${badgeColor}`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        {confidenceText} ({confidence}%)
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews ({reviews.length})</h2>
        <Button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-blue-600 hover:bg-blue-700">
          Write a Review
        </Button>
      </div>

      {/* Success/Error Message */}
      {submitMessage && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            submitMessage.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          <div className="flex items-center">
            {submitMessage.includes("Error") ? (
              <AlertTriangle className="w-4 h-4 mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {submitMessage}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your user rating will be randomly assigned between 0-5 stars for this demo.
            </p>

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
                className="w-full"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={submitReview} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? "Submitting..." : "Submit Review"}
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
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <span>By {review.userId?.name || "Anonymous"}</span>
                    <span>•</span>
                    <span>{formatDate(review.createdAt)}</span>
                    {review.purchaseVerified && (
                      <>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">Verified Purchase</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderUserRating(review.userRating, review.userId?.name)}
                    {renderFakeConfidence(review.fakeConfidence)}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>

              {review.fakeConfidence > 60 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span>
                      This review has a {review.fakeConfidence}% confidence of being potentially fake. Please consider
                      this when evaluating the review's authenticity.
                    </span>
                  </div>
                </div>
              )}
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
