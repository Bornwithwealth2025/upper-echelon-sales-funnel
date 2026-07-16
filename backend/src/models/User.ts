export type UserRole = 'admin' | 'marketer';
export type AccountStatus = 'active' | 'suspended' | 'inactive';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  timezone?: string | null;
  leadVolume?: string | null;
  role: UserRole;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  accountStatus?: AccountStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  companyName?: string;
  industry?: string;
  country?: string;
  timezone?: string;
  leadVolume?: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  timezone?: string | null;
  leadVolume?: string | null;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: AccountStatus;
  createdAt: Date;
}

export class UserValidator {
  static validateLogin(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRegistration(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const hasMinLength = (value: string | undefined, min: number): boolean => typeof value === 'string' && value.trim().length >= min;

    if (!hasMinLength(data.firstName, 2)) {
      errors.push('First name is required');
    }

    if (!hasMinLength(data.lastName, 2)) {
      errors.push('Last name is required');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
