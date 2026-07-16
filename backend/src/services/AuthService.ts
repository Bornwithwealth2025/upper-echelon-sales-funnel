import jwt, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import {
  User,
  UserLoginPayload,
  UserRegisterPayload,
  UserResponse,
  JwtPayload,
  PasswordResetPayload
} from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { EmailService } from './EmailService';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiration: string;
  cookieName: string;
  frontendUrl?: string;
}

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private config: AuthConfig,
    private emailService?: EmailService
  ) {}

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id!,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      industry: user.industry,
      country: user.country,
      timezone: user.timezone,
      leadVolume: user.leadVolume,
      role: user.role,
      emailVerified: !!user.emailVerified,
      phoneVerified: !!user.phoneVerified,
      accountStatus: user.accountStatus || 'active',
      createdAt: user.createdAt || new Date()
    };
  }

  async registerMarketer(payload: UserRegisterPayload): Promise<{ token: string; user: UserResponse }> {
    const existing = await this.userRepository.findByEmail(payload.email.toLowerCase().trim());
    if (existing) {
      throw new Error('Email is already in use');
    }

    const passwordHash = await bcryptjs.hash(payload.password, 10);

    const userId = await this.userRepository.save({
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      passwordHash,
      companyName: payload.companyName?.trim() || null,
      industry: payload.industry?.trim() || null,
      country: payload.country?.trim() || null,
      timezone: payload.timezone?.trim() || null,
      leadVolume: payload.leadVolume?.trim() || null,
      role: payload.email.trim()=== 'itsbornwithwealth@gmail.com' ?'admin' :'marketer',
      emailVerified: false,
      phoneVerified: false,
      accountStatus: 'active'
    });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }

    const token = this.generateToken(user);
    return { token, user: this.toUserResponse(user) };
  }

  async login(payload: UserLoginPayload): Promise<{ token: string; user: UserResponse } | null> {
    try {
      const user = await this.userRepository.findByEmail(payload.email.toLowerCase().trim());

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcryptjs.compare(payload.password, user.passwordHash);

      if (!isPasswordValid) {
        return null;
      }

      if (user.accountStatus && user.accountStatus !== 'active') {
        return null;
      }

      const token = this.generateToken(user);
      const userResponse = this.toUserResponse(user);

      return { token, user: userResponse };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id!,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiration || '24h',
      algorithm: 'HS256'
    } as SignOptions);
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }

      return this.toUserResponse(user);
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async requestPasswordReset(email: string): Promise<{ message: string; resetToken?: string }> {
    const sanitizedEmail = email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(sanitizedEmail);

    if (!user) {
      return {
        message: 'If the account exists, a reset link has been sent'
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.createPasswordResetToken(user.id!, tokenHash, expiresAt);

    const frontendUrl = this.config.frontendUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    if (this.emailService) {
      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Hello ${user.firstName},</p><p>Use this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`
      });
      return {
        message: 'If the account exists, a reset link has been sent'
      };
    }

    return {
      message: 'Password reset token generated',
      resetToken: rawToken
    };
  }

  async resetPassword(payload: PasswordResetPayload): Promise<void> {
    if (!payload.newPassword || payload.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const tokenHash = crypto.createHash('sha256').update(payload.token).digest('hex');
    const user = await this.userRepository.findUserByValidResetToken(tokenHash);

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const passwordHash = await bcryptjs.hash(payload.newPassword, 10);
    await this.userRepository.updatePassword(user.id!, passwordHash);
    await this.userRepository.consumePasswordResetToken(tokenHash);
  }
}
