import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password?: string; // @deprecated - Will be removed in future version
  hasPassword: boolean; // @deprecated - Will be removed in future version
  preferredAuthMethod: 'otp' | 'password';
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  deviceInfo?: {
    lastDevices: Array<{
      ipAddress: string;
      userAgent: string;
      lastUsed: Date;
    }>;
  };
  backupCodes?: string[];
  migrationStatus?: {
    notifiedAt?: Date;
    reminderCount: number;
    lastReminder?: Date;
    scheduledDeletionDate?: Date;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String,
    select: false, // Don't include password in normal queries
    // @deprecated
    deprecated: 'Password authentication is being phased out. Please migrate to OTP authentication.'
  },
  hasPassword: {
    type: Boolean,
    default: false,
    // @deprecated
    deprecated: 'Password authentication is being phased out. Please migrate to OTP authentication.'
  },
  preferredAuthMethod: {
    type: String,
    enum: ['otp', 'password'],
    default: 'otp'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  deviceInfo: {
    lastDevices: [{
      ipAddress: String,
      userAgent: String,
      lastUsed: {
        type: Date,
        default: Date.now
      }
    }]
  },
  backupCodes: [{
    type: String,
    select: false // Don't include backup codes in normal queries
  }],
  migrationStatus: {
    notifiedAt: Date,
    reminderCount: {
      type: Number,
      default: 0
    },
    lastReminder: Date,
    scheduledDeletionDate: Date
  }
});

// Index for faster queries
UserSchema.index({ 'deviceInfo.lastDevices.ipAddress': 1 });
UserSchema.index({ 'migrationStatus.scheduledDeletionDate': 1 });

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving if it's modified
UserSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this.hasPassword = true;
    } catch (error) {
      next(error instanceof Error ? error : new Error('Password hashing failed'));
      return;
    }
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

export const User = mongoose.model<IUser>('User', UserSchema);
export default User;