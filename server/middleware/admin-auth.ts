import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser';

interface JwtPayload {
  id: string;
  role: string;
}

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adminsecret') as JwtPayload;
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    // Attach admin to request
    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Set both admin and user properties for compatibility with different middleware
    (req as any).admin = admin;
    (req as any).user = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      isAdmin: true
    };
    
    console.log('Admin authenticated:', (req as any).user.username);
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default adminAuthMiddleware;