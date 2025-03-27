import { Router } from 'express';
import { z } from 'zod';
import User from '../models/User';
import { passwordLimiter } from '../middleware/rate-limit';
import { MigrationService } from '../services/migration-service';

const router = Router();

// Schema for password setup/change
const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Setup or change password
router.post('/setup-password', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "You must be logged in to set up a password" });
    }

    // Add deprecation warning
    res.set('Warning', 'Password authentication is being deprecated. Please consider using OTP authentication.');

    const { password, confirmPassword } = passwordSchema.parse(req.body);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    user.preferredAuthMethod = 'password';
    await user.save();

    // Start migration process
    await MigrationService.startMigration(user.id);

    const migrationStatus = await MigrationService.getMigrationStatus(user.id);

    res.json({ 
      message: "Password set successfully, but please note that password authentication is being deprecated",
      preferredAuthMethod: user.preferredAuthMethod,
      migrationStatus,
      warning: "Password authentication will be removed soon. Please migrate to OTP authentication."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid password format",
        errors: error.errors 
      });
    }
    console.error('Error setting up password:', error);
    res.status(500).json({ message: "Failed to set up password" });
  }
});

// Login with password
router.post('/login', passwordLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Add deprecation warning
    res.set('Warning', 'Password authentication is being deprecated. Please consider using OTP authentication.');

    // Include password field in query
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.hasPassword) {
      return res.status(401).json({ message: "Password login not enabled for this account" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login and device info
    user.lastLogin = new Date();
    const deviceInfo = {
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      lastUsed: new Date()
    };

    // Keep only the last 5 devices
    if (!user.deviceInfo) {
      user.deviceInfo = { lastDevices: [deviceInfo] };
    } else {
      user.deviceInfo.lastDevices.unshift(deviceInfo);
      if (user.deviceInfo.lastDevices.length > 5) {
        user.deviceInfo.lastDevices = user.deviceInfo.lastDevices.slice(0, 5);
      }
    }

    await user.save();

    // Get migration status if exists
    const migrationStatus = await MigrationService.getMigrationStatus(user.id);

    // Login the user
    req.login(user, (err) => {
      if (err) {
        console.error("Session creation error:", err);
        return res.status(500).json({ message: "Error creating session" });
      }

      // Return user without sensitive data
      const safeUser = {
        id: user.id,
        username: user.username,
        preferredAuthMethod: user.preferredAuthMethod,
        createdAt: user.createdAt,
        migrationStatus,
        warning: "Password authentication will be removed soon. Please migrate to OTP authentication."
      };

      res.json(safeUser);
    });
  } catch (error) {
    console.error('Password login error:', error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Change preferred auth method
router.post('/change-auth-method', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "You must be logged in to change auth method" });
    }

    const { method } = req.body;
    if (!['password', 'otp'].includes(method)) {
      return res.status(400).json({ message: "Invalid authentication method" });
    }

    // Add deprecation warning for password method
    if (method === 'password') {
      res.set('Warning', 'Password authentication is being deprecated. Please consider using OTP authentication.');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If switching to password auth, ensure user has a password set
    if (method === 'password') {
      if (!user.hasPassword) {
        return res.status(400).json({ message: "You must set up a password first" });
      }
      // Start migration process if switching to password
      await MigrationService.startMigration(user.id);
    }

    user.preferredAuthMethod = method;
    await user.save();

    const migrationStatus = method === 'password' 
      ? await MigrationService.getMigrationStatus(user.id)
      : null;

    res.json({ 
      message: method === 'password' 
        ? "Authentication method updated. Note: Password authentication will be deprecated soon."
        : "Authentication method updated successfully",
      preferredAuthMethod: user.preferredAuthMethod,
      migrationStatus,
      warning: method === 'password' 
        ? "Password authentication will be removed soon. Please consider using OTP authentication."
        : undefined
    });
  } catch (error) {
    console.error('Error changing auth method:', error);
    res.status(500).json({ message: "Failed to change authentication method" });
  }
});

export default router; 