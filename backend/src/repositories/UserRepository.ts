import { DatabaseConnection } from '@/types/db.interface';
import { randomUUID } from 'crypto';
import { User } from '../models/User';

export interface IUserRepository {
  save(user: User): Promise<string>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePassword(id: string, passwordHash: string): Promise<boolean>;
  createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findUserByValidResetToken(tokenHash: string): Promise<User | null>;
  consumePasswordResetToken(tokenHash: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private db: DatabaseConnection) {}

  private mapUser(row: any): User {
    const role = row.role === 'user' ? 'marketer' : row.role;

    return {
      id: row.id,
      firstName: row.first_name || row.firstName || 'Marketer',
      lastName: row.last_name || row.lastName || 'User',
      email: row.email,
      phone: row.phone,
      passwordHash: row.password_hash || row.password,
      companyName: row.company_name,
      industry: row.industry,
      country: row.country,
      timezone: row.timezone,
      leadVolume: row.lead_volume,
      role,
      emailVerified: !!row.email_verified,
      phoneVerified: !!row.phone_verified,
      accountStatus: row.account_status,
      createdAt: row.created_at || row.createdAt,
      updatedAt: row.updated_at || row.updatedAt
    };
  }

  async save(user: User): Promise<string> {
    const userId = user.id || randomUUID();
    const query = `
      INSERT INTO users (
        id,
        first_name,
        last_name,
        email,
        phone,
        password_hash,
        company_name,
        industry,
        country,
        timezone,
        lead_volume,
        role,
        email_verified,
        phone_verified,
        account_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await this.db.query(query, [
        userId,
        user.firstName,
        user.lastName,
        user.email,
        user.phone || null,
        user.passwordHash,
        user.companyName || null,
        user.industry || null,
        user.country || null,
        user.timezone || null,
        user.leadVolume || null,
        user.role || 'marketer',
        user.emailVerified ?? false,
        user.phoneVerified ?? false,
        user.accountStatus || 'active'
      ]);

      return userId;
    } catch {
      const legacyQuery = `
        INSERT INTO users (
          userId,
          first_name,
          last_name,
          email,
          phone,
          password,
          password_hash,
          company_name,
          industry,
          country,
          timezone,
          lead_volume,
          role,
          email_verified,
          phone_verified,
          account_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result: any = await this.db.query(legacyQuery, [
        userId,
        user.firstName,
        user.lastName,
        user.email,
        user.phone || null,
        user.passwordHash,
        user.passwordHash,
        user.companyName || null,
        user.industry || null,
        user.country || null,
        user.timezone || null,
        user.leadVolume || null,
        user.role || 'marketer',
        user.emailVerified ?? false,
        user.phoneVerified ?? false,
        user.accountStatus || 'active'
      ]);

      return String(result?.insertId || userId);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?';
    const results = await this.db.query(query, [email]);
    const row = (results as any[])[0];
    return row ? this.mapUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const results = await this.db.query(query, [id]);
    const row = (results as any[])[0];
    return row ? this.mapUser(row) : null;
  }

  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const query = `
      UPDATE users
      SET password_hash = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result: any = await this.db.query(query, [passwordHash, id]);
    return (result as any).affectedRows > 0;
  }

  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.db.query('DELETE FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL', [userId]);

    const query = `
      INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `;

    await this.db.query(query, [randomUUID(), userId, tokenHash, expiresAt]);
  }

  async findUserByValidResetToken(tokenHash: string): Promise<User | null> {
    const query = `
      SELECT u.*
      FROM users u
      INNER JOIN password_reset_tokens prt ON prt.user_id = u.id
      WHERE prt.token_hash = ?
        AND prt.used_at IS NULL
        AND prt.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `;

    const rows = await this.db.query(query, [tokenHash]);
    const row = (rows as any[])[0];
    return row ? this.mapUser(row) : null;
  }

  async consumePasswordResetToken(tokenHash: string): Promise<void> {
    const query = `
      UPDATE password_reset_tokens
      SET used_at = CURRENT_TIMESTAMP
      WHERE token_hash = ?
        AND used_at IS NULL
    `;
    await this.db.query(query, [tokenHash]);
  }
}
