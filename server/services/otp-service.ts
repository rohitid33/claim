import OTP from '../models/OTP';

interface VerifyOTPOptions {
  ipAddress?: string;
  deviceInfo?: string;
}

class OTPService {
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Generate a 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create and save new OTP
  async createOTP(userId: string, options?: VerifyOTPOptions): Promise<string> {
    try {
      // Check if user is locked out
      const lastFailedAttempt = await OTP.findOne({
        userId,
        isUsed: false,
        attempts: { $gte: this.MAX_ATTEMPTS },
        lastAttemptAt: { $gt: new Date(Date.now() - this.LOCKOUT_DURATION) }
      });

      if (lastFailedAttempt?.lastAttemptAt) {
        const lockoutRemaining = Math.ceil(
          (this.LOCKOUT_DURATION - (Date.now() - lastFailedAttempt.lastAttemptAt.getTime())) / 1000 / 60
        );
        throw new Error(`Account is locked. Try again in ${lockoutRemaining} minutes`);
      }

      // Delete any existing unused OTPs for this user
      await OTP.deleteMany({ userId, isUsed: false });

      const otp = this.generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

      const otpDoc = await OTP.create({
        userId,
        otp,
        expiresAt,
        createdAt: new Date(),
        ipAddress: options?.ipAddress,
        deviceInfo: options?.deviceInfo
      });

      // For testing purposes, log the OTP
      console.log(`OTP for user ${userId}: ${otp}`);
      console.log(`OTP will expire at: ${expiresAt.toISOString()}`);

      return otp;
    } catch (error) {
      console.error('Error generating OTP:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate OTP: ${error.message}`);
      }
      throw new Error('Failed to generate OTP: Unknown error');
    }
  }

  // Verify OTP
  async verifyOTP(userId: string, otpToVerify: string, options?: VerifyOTPOptions): Promise<boolean> {
    try {
      // Check if user is locked out
      const lastFailedAttempt = await OTP.findOne({
        userId,
        isUsed: false,
        attempts: { $gte: this.MAX_ATTEMPTS },
        lastAttemptAt: { $gt: new Date(Date.now() - this.LOCKOUT_DURATION) }
      });

      if (lastFailedAttempt?.lastAttemptAt) {
        const lockoutRemaining = Math.ceil(
          (this.LOCKOUT_DURATION - (Date.now() - lastFailedAttempt.lastAttemptAt.getTime())) / 1000 / 60
        );
        throw new Error(`Account is locked. Try again in ${lockoutRemaining} minutes`);
      }

      // Find the OTP record
      const otpRecord = await OTP.findOne({
        userId,
        otp: otpToVerify,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        // Check if OTP exists but is expired
        const expiredOTP = await OTP.findOne({
          userId,
          otp: otpToVerify,
          isUsed: false,
          expiresAt: { $lte: new Date() }
        });

        if (expiredOTP) {
          console.log(`OTP expired for user ${userId}. Expired at: ${expiredOTP.expiresAt}`);
          throw new Error('OTP has expired');
        }

        // Record failed attempt
        const existingOTP = await OTP.findOne({ userId, isUsed: false });
        if (existingOTP) {
          existingOTP.attempts += 1;
          existingOTP.lastAttemptAt = new Date();
          existingOTP.ipAddress = options?.ipAddress;
          existingOTP.deviceInfo = options?.deviceInfo;
          await existingOTP.save();

          if (existingOTP.attempts >= this.MAX_ATTEMPTS) {
            throw new Error(`Maximum attempts exceeded. Account is locked for ${this.LOCKOUT_DURATION / 1000 / 60} minutes`);
          }
        }

        console.log(`Invalid OTP attempt for user ${userId}`);
        return false;
      }

      // Mark OTP as used
      otpRecord.isUsed = true;
      otpRecord.ipAddress = options?.ipAddress;
      otpRecord.deviceInfo = options?.deviceInfo;
      await otpRecord.save();

      console.log(`OTP verified successfully for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error instanceof Error && 
         (error.message === 'OTP has expired' || 
          error.message.includes('Account is locked') || 
          error.message.includes('Maximum attempts exceeded'))) {
        throw error;
      }
      throw new Error('Failed to verify OTP');
    }
  }
}

export const otpService = new OTPService(); 