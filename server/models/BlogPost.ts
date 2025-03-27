import mongoose, { Document, Schema } from 'mongoose';
import { BlogPost as BlogPostType } from '@shared/schema';

// Define the BlogPost document interface
export interface BlogPostDocument extends Document, Omit<BlogPostType, 'id'> {
  // The id field is handled by MongoDB's _id
}

// Create the BlogPost schema
const BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create and export the BlogPost model
export const BlogPost = mongoose.model<BlogPostDocument>('BlogPost', BlogPostSchema);