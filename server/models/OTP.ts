import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  userId: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  lastAttemptAt?: Date;
  ipAddress?: string;
  deviceInfo?: string;
}

const OTPSchema = new Schema<IOTP>({
  userId: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 300 // Document will be automatically deleted after 5 minutes
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  isUsed: { 
    type: Boolean, 
    default: false 
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  deviceInfo: {
    type: String
  }
});

// Create indexes
OTPSchema.index({ userId: 1, createdAt: 1 });
OTPSchema.index({ ipAddress: 1, createdAt: 1 });

export default mongoose.model<IOTP>('OTP', OTPSchema); 