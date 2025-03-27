import rateLimit from 'express-rate-limit';

// Rate limit for OTP requests - 3 requests per 5 minutes
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: { message: "Too many OTP requests. Please try again later." }
});

// Rate limit for OTP verification - 5 attempts per 15 minutes
export const otpVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: "Too many verification attempts. Please try again later." }
});

// Rate limit for password login attempts - 5 attempts per 15 minutes
export const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: "Too many login attempts. Please try again later." }
}); 