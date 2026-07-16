import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is missing'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      req.userId = decoded.userId;
      req.email = decoded.email;
      req.role = decoded.role;
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
}

export function authorizeRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    console.log('User role:', req.role, 'Allowed roles:', allowedRoles);
    if (!req.role || !allowedRoles.includes(req.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }
    next();
  };
}
