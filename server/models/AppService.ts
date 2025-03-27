import mongoose, { Document, Schema } from 'mongoose';

// Define the AppService interface
export interface AppServiceData {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  subcategoryIds?: string[];
  features?: string[];
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
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the AppService document interface
export interface AppServiceDocument extends Document, Omit<AppServiceData, 'id'> {
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
    default: "123-456-7890",
  },
  email: {
    type: String,
    default: "contact@example.com",
  },
});

// Create the AppService schema
const AppServiceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "📄",
  },
  category: {
    type: String,
    default: 'general',
  },
  subcategoryIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Subcategory',
    default: [],
  },
  features: {
    type: [String],
    default: ["New service feature"],
  },
  eligibility: {
    type: [String],
    default: ["Everyone is eligible"],
  },
  process: {
    type: [ProcessStepSchema],
    default: [{ 
      title: "Simple Process", 
      steps: ["Contact us to get started"] 
    }],
  },
  documents: {
    type: [String],
    default: ["No documents required"],
  },
  faqs: {
    type: [FAQSchema],
    default: [{
      question: "How do I get started?",
      answer: "Contact us to learn more about this service."
    }],
  },
  contactInfo: {
    type: ContactInfoSchema,
    default: {
      phone: "123-456-7890",
      email: "contact@example.com"
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'appservices', // Explicitly set the collection name
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

// Create and export the AppService model
export const AppService = mongoose.models.AppService || mongoose.model<AppServiceDocument>('AppService', AppServiceSchema);