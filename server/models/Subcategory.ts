import mongoose, { Document, Schema } from 'mongoose';
import { Subcategory as SubcategoryType } from '@shared/schema';

// Define the Subcategory document interface
export interface SubcategoryDocument extends Document, Omit<SubcategoryType, 'id'> {
  // The id field is handled by MongoDB's _id
}

// Create the Subcategory schema
const SubcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  serviceIds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  collection: 'subcategories' // Explicitly set the collection name
});

// Create a compound index for unique subcategory names within a category
SubcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

// Create and export the Subcategory model
export const Subcategory = mongoose.models.Subcategory || mongoose.model<SubcategoryDocument>('Subcategory', SubcategorySchema);