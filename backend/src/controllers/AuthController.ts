import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import {
  UserLoginPayload,
  UserRegisterPayload,
  PasswordResetRequestPayload,
  PasswordResetPayload,
  UserValidator
} from '../models/User';
// import { authenticateToken } from '../middleware/authMiddleware';
import { sanitizeInput } from '@/utils/sanitize';

export interface IAuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  me(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body as UserRegisterPayload;
      const validation = UserValidator.validateRegistration(payload);

      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.errors.join(', ')
        });
        return;
      }

      const result = await this.authService.registerMarketer({
        ...payload,
        firstName: sanitizeInput(payload.firstName),
        lastName: sanitizeInput(payload.lastName),
        email: sanitizeInput(payload.email),
        phone: payload.phone ? sanitizeInput(payload.phone) : undefined,
        companyName: payload.companyName ? sanitizeInput(payload.companyName) : undefined,
        industry: payload.industry ? sanitizeInput(payload.industry) : undefined,
        country: payload.country ? sanitizeInput(payload.country) : undefined,
        timezone: payload.timezone ? sanitizeInput(payload.timezone) : undefined,
        leadVolume: payload.leadVolume ? sanitizeInput(payload.leadVolume) : undefined,
       
      });

      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        message: 'Marketer account created successfully',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error: any) {
      if (error.message === 'Email is already in use') {
        res.status(409).json({
          success: false,
          message: error.message
        });
        return;
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as UserLoginPayload;

      const validation = UserValidator.validateLogin({ email, password });
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.errors.join(', ')
        });
        return;
      }

      const result = await this.authService.login({ email: sanitizeInput(email), password });

      if (!result) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Set token in cookie
      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body as PasswordResetRequestPayload;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }

      const result = await this.authService.requestPasswordReset(sanitizeInput(email));

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.resetToken ? { resetToken: result.resetToken } : undefined
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body as PasswordResetPayload;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
        return;
      }

      await this.authService.resetPassword({ token, newPassword });

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error: any) {
      if (error.message === 'Invalid or expired reset token' || error.message === 'Password must be at least 8 characters') {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('authToken');
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies['authToken'];
      const decoded = this.authService.verifyToken(token);
     
      if (!decoded?.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const user = await this.authService.getUserById(decoded.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}


