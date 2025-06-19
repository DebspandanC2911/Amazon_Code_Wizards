import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    numberOfStars: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
  },
    
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
