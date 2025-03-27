import mongoose, { Document, Schema } from 'mongoose';
import { Category as CategoryType } from '@shared/schema';

// Define the Category document interface
export interface CategoryDocument extends Document, Omit<CategoryType, 'id'> {
  // The id field is handled by MongoDB's _id
}

// Create the Category schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  icon: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  number: {
    type: Number,
    default: 0,
    required: false
  },
  tags: {
    type: [String],
    default: [],
    required: false
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  collection: 'categories' // Explicitly set the collection name
});

// Create and export the Category model
export const Category = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);