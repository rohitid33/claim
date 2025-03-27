import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser extends Document {
  username: string;
  password: string;
  email: string;
  role: string;
  isAdmin: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema = new Schema<IAdminUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'admin' },
  isAdmin: { type: Boolean, default: true }
}, { timestamps: true, collection: 'adminlogin' }); // Note: using the required collection name

// Hash password before saving
AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    console.log("Hashing password for admin user:", this.username);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
    next();
  } catch (error: any) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log("Comparing password for user:", this.username);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password match result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

export default mongoose.model<IAdminUser>('AdminLogin', AdminUserSchema);