import express from 'express';
import AdminUser from './models/AdminUser';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    console.log('Admin login attempt with:', req.body);
    const { username, password } = req.body;
    
    // Find admin user
    console.log('Finding admin user with username:', username);
    const admin = await AdminUser.findOne({ username });
    
    if (!admin) {
      console.log('Admin user not found with username:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Admin user found:', admin.username);
    
    // Check password
    console.log('Comparing passwords...');
    const isMatch = await admin.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    console.log('Creating JWT token for admin:', admin.username);
    const token = jwt.sign(
      { id: admin._id, role: admin.role, isAdmin: true },
      process.env.JWT_SECRET || 'adminsecret',
      { expiresIn: '1d' }
    );
    
    console.log('Admin login successful for user:', admin.username);
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify admin token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adminsecret') as { id: string };
    const admin = await AdminUser.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;