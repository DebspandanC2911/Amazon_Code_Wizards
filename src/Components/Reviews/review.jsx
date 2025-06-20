import React, { useState } from 'react';
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineDown,
  AiOutlineUp
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const AMAZON_ORANGE = '#FFA41C';
const TRACK_GRAY    = '#E3E3E3';

const CompactProductReviews = () => {
  const isAuthenticated = useSelector(s => s.amazon.isAuthenticated);

  // === dummy reviews ===
   const reviewsData = [
    {
      id: 1,
      author: 'Lokesh',
      rating: 1,
      title: 'Good product',
      date: dayjs('2025-06-14').format('D MMM YYYY'),
      location: 'India',
      details: 'Size: 8 UK | Colour: Black',
      verified: true,
      text: 'Product is good but I had a size issue and there is no response for return. Hence money wasted'
    },
    {
      id: 2,
      author: 'Priya',
      rating: 5,
      title: 'Absolutely love it!',
      date: dayjs('2025-06-10').format('D MMM YYYY'),
      location: 'India',
      details: 'Size: 7 US | Colour: Pink',
      verified: true,
      text: 'Fits perfectly, color is gorgeous, and quality feels premium. Highly recommend!'
    },
    {
      id: 3,
      author: 'Rahul',
      rating: 4,
      title: 'Very comfortable',
      date: dayjs('2025-06-08').format('D MMM YYYY'),
      location: 'India',
      details: 'Size: 9 UK | Colour: Blue',
      verified: false,
      text: 'Comfort is great, but the sole grip could be better on wet surfaces.'
    },
    {
      id: 4,
      author: 'Sneha',
      rating: 2,
      title: 'Not as expected',
      date: dayjs('2025-06-05').format('D MMM YYYY'),
      location: 'India',
      details: 'Size: 6 UK | Colour: Red',
      verified: true,
      text: 'Color faded after one wash and the stitching came undone on one side.'
    },
    {
      id: 5,
      author: 'Anand',
      rating: 3,
      title: 'Average',
      date: dayjs('2025-06-01').format('D MMM YYYY'),
      location: 'India',
      details: 'Size: 10 UK | Colour: Black',
      verified: false,
      text: 'Decent for the price, but nothing special. Would’ve liked more cushioning.'
    },
  ];

  const totalReviews = reviewsData.length;
  const avgRating = totalReviews
    ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const distribution = [5,4,3,2,1].map(starValue => {
    const cnt = reviewsData.filter(r => r.rating === starValue).length;
    const pct = totalReviews ? Math.round((cnt / totalReviews) * 100) : 0;
    return { starValue, pct };
  });

  const [showCalc, setShowCalc] = useState(false);

  const renderAvgStars = () => {
    const full  = Math.floor(avgRating);
    const half  = avgRating - full >= 0.5;
    return (
      <div className="flex items-center">
        {[1,2,3,4,5].map(i => {
          if (i <= full) return <AiFillStar key={i} color={AMAZON_ORANGE} size={16} />;
          if (i === full + 1 && half)
            return <AiOutlineStar key={i} style={{ clipPath: 'inset(0 50% 0 0)', color: AMAZON_ORANGE }} size={16} />;
          return <AiOutlineStar key={i} color="#ccc" size={16} />;
        })}
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      {/* LEFT COLUMN */}
      <div className="space-y-4">
        <div className="border rounded bg-white p-3" style={{ borderColor: TRACK_GRAY }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">Customer reviews</span>
            <span className="font-semibold">{avgRating} / 5</span>
          </div>
          <div className="flex items-center mb-2">
            {renderAvgStars()}
            <span className="ml-2 text-gray-600">{totalReviews} ratings</span>
          </div>
          <div className="space-y-1 mb-2">
            {distribution.map(({ starValue, pct }) => (
              <div key={starValue} className="flex items-center">
                <span className="w-8 text-blue-500">{starValue}★</span>
                <div className="flex-1 h-2 bg-gray-200 mx-2 rounded overflow-hidden">
                  <div style={{ width: `${pct}%`, background: AMAZON_ORANGE, height: '100%' }} />
                </div>
                <span className="w-6 text-right text-blue-500">{pct}%</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowCalc(!showCalc)}
            className="flex items-center text-blue-600 mb-1"
          >
            How are ratings calculated? {showCalc ? <AiOutlineUp size={14}/> : <AiOutlineDown size={14}/>}
          </button>
          {showCalc && (
            <p className="text-xs text-gray-700">
              Aggregated from customer feedback over time…
            </p>
          )}
        </div>

        <div className="border rounded bg-white p-3 text-center" style={{ borderColor: TRACK_GRAY }}>
          <div className="font-semibold">Review this product</div>
          <div className="text-gray-600 mb-2">Share your thoughts with other customers</div>
          {isAuthenticated ? (
            <button
              className="px-4 py-1 border rounded-full text-gray-700 hover:bg-gray-100"
              onClick={() => {/* scroll to your review form */}}
            >
              Write a product review
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-block px-4 py-1 border rounded-full text-gray-700 hover:bg-gray-100"
            >
              Write a product review
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Top reviews from India</h3>
          <button className="px-2 py-1 text-xs border rounded hover:bg-gray-100">
            Translate all reviews
          </button>
        </div>

        {reviewsData.map(r => (
          <div key={r.id} className="border rounded bg-white p-3" style={{ borderColor: TRACK_GRAY }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {[1,2,3,4,5].map(i =>
                  i <= r.rating
                    ? <AiFillStar key={i} color={AMAZON_ORANGE} size={16}/>
                    : <AiOutlineStar key={i} color="#ccc" size={16}/>
                )}
              </div>
              <span className="text-xs text-gray-600">{r.date}</span>
            </div>
            <div className="font-medium mb-1">{r.title}</div>
            <div className="text-xs text-gray-600 mb-2">
              Reviewed in {r.location} on {r.date} <br/>
              {r.details}{' '}
              {r.verified && (
                <span className="text-xs text-yellow-700 font-medium">
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-gray-800">{r.text}</p>
            <div className="flex space-x-4 mt-2 text-xs text-blue-600">
              <button className="hover:underline">Helpful</button>
              <button className="hover:underline">Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactProductReviews;

