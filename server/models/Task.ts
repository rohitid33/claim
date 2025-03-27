import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Task document
export interface ITask extends Document {
  ticketId: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  dueDate: Date;
  assigneeId: mongoose.Types.ObjectId | string;
  updatedAt: Date;
}

// Create the schema
const taskSchema = new Schema<ITask>({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
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
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  assigneeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save hook to update the updatedAt field
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the model
export const Task = mongoose.model<ITask>('Task', taskSchema);