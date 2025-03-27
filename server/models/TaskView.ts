import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskView extends Document {
  userId: mongoose.Types.ObjectId | string;
  taskId: mongoose.Types.ObjectId | string;
  viewedAt: Date;
}

const taskViewSchema = new Schema<ITaskView>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for userId and taskId to ensure uniqueness
taskViewSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export const TaskView = mongoose.model<ITaskView>('TaskView', taskViewSchema); 