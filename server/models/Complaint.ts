import mongoose, { Document, Schema } from 'mongoose';
import { Complaint as ComplaintType } from '@shared/schema';

// Define the Complaint document interface
export interface ComplaintDocument extends Document, Omit<ComplaintType, 'id'> {
  // The id field is handled by MongoDB's _id
}

// Create the Complaint schema
const ComplaintSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

// Create and export the Complaint model
export const Complaint = mongoose.model<ComplaintDocument>('Complaint', ComplaintSchema);