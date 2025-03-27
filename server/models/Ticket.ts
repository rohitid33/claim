import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Ticket document
export interface ITicket extends Document {
  serviceId: string;
  serviceName: string;
  userId: string;
  title: string;
  description: string;
  status: 'new' | 'processing' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ticketSchema = new Schema<ITicket>({
  serviceId: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'processing', 'completed', 'rejected'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save hook to update the updatedAt field
ticketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the model
export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);