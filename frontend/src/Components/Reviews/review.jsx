import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const ProductReviews = () => {
  // initial hard-coded reviews
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Alice', rating: 5, text: 'Amazing quality and fast shipping!' },
    { id: 2, author: 'Bob',   rating: 4, text: 'Very good, but packaging could be better.' },
    { id: 3, author: 'Carol', rating: 3, text: 'It’s okay for the price.' },
  ]);

  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim() || newRating === 0) return;

    const next = {
      id: reviews.length + 1,
      author: 'You',
      rating: newRating,
      text: newText.trim()
    };
    setReviews([next, ...reviews]);
    setNewText('');
    setNewRating(0);
    setHoverRating(0);
  };

  // Render a row of 5 stars; if `onClick` is provided it's interactive
  const renderStars = (rating, onClick) => {
    const interactive = typeof onClick === 'function';
    const displayRating = interactive
      ? (hoverRating || rating)
      : rating;

    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5].map(i => {
          const filled = i <= displayRating;
          const Star = filled ? AiFillStar : AiOutlineStar;
          return (
            <Star
              key={i}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                color: filled ? '#ffc107' : '#ccc',
                transition: 'color 0.2s'
              }}
              onClick={interactive ? () => onClick(i) : undefined}
              onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
              onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Customer Reviews</h2>

      {/* Review form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Your Rating:</label>
          {renderStars(newRating, setNewRating)}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Your Review:</label>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
            placeholder="Write your review here..."
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: '8px 16px',
            background: '#f0c14b',
            border: '1px solid #a88734',
            cursor: 'pointer'
          }}
        >
          Submit Review
        </button>
      </form>

      {/* List of reviews */}
      {reviews.map(({ id, author, rating, text }) => (
        <div
          key={id}
          style={{
            borderBottom: '1px solid #ddd',
            padding: '12px 0'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{author}</div>
          {renderStars(rating)}
          <p style={{ marginTop: 4 }}>{text}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
