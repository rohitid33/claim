import mongoose, { Document, Schema } from 'mongoose';

// Define the ServiceData interface directly in the server code
export interface ServiceData {
  id?: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  category?: string;
  subcategoryIds?: string[]; // IDs of subcategories this service belongs to
  popular?: boolean;
  eligibility?: string[];
  process?: {
    title: string;
    steps: string[];
  }[];
  documents?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

// Define the Service document interface
export interface ServiceDocument extends Document, Omit<ServiceData, 'id'> {
  // The id field is handled by MongoDB's _id
}

// Create schemas for nested objects
const ProcessStepSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
});

const FAQSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const ContactInfoSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

// Create the Service schema
const ServiceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  eligibility: {
    type: [String],
    required: true,
  },
  process: {
    type: [ProcessStepSchema],
    required: true,
  },
  documents: {
    type: [String],
    required: true,
  },
  faqs: {
    type: [FAQSchema],
    required: true,
  },
  contactInfo: {
    type: ContactInfoSchema,
    required: true,
  },
  category: {
    type: String,
    default: 'general',
  },
  subcategoryIds: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true, // Add timestamps for tracking created/updated times
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create and export the Service model
export const Service = mongoose.model<ServiceDocument>('Service', ServiceSchema);