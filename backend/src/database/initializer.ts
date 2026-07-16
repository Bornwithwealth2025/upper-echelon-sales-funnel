import { DatabaseConnection } from '@/types/db.interface';
import bcryptjs from 'bcryptjs';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export class DatabaseInitializer {
  constructor(private db: DatabaseConnection) {}

  private async columnExists(tableName: string, columnName: string): Promise<boolean> {
    const result = await this.db.query(
      `
        SELECT COUNT(*) AS count
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND COLUMN_NAME = ?
      `,
      [tableName, columnName]
    );

    return Number((result as any[])?.[0]?.count || 0) > 0;
  }

  private async addColumnIfMissing(tableName: string, columnName: string, definition: string): Promise<void> {
    const exists = await this.columnExists(tableName, columnName);

    if (!exists) {
      await this.db.query(`ALTER TABLE \`${tableName}\` ADD COLUMN ${definition}`);
    }
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing database schema...');
      await this.createUsersTable();
      await this.ensureUsersTableCompatibility();
      await this.createPasswordResetTokensTable();
      await this.createLeadsTable();
      await this.ensureLeadsTableCompatibility();
      await this.createAssetsTable();
      await this.ensureAssetsTableCompatibility();
      await this.createEmailCampaignsTable();
      await this.ensureEmailCampaignsCompatibility();
      await this.seedAdminUser();
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createUsersTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(30),
        password_hash TEXT NOT NULL,
        company_name VARCHAR(255),
        industry VARCHAR(100),
        country VARCHAR(100),
        timezone VARCHAR(50),
        lead_volume VARCHAR(50),
        role ENUM('admin', 'marketer') DEFAULT 'marketer',
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        account_status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await this.db.query(createTableSQL);
    console.log('Users table created or already exists');
  }

  private async ensureUsersTableCompatibility(): Promise<void> {
    const columnsToEnsure = [
      { name: 'first_name', definition: 'first_name VARCHAR(100)' },
      { name: 'last_name', definition: 'last_name VARCHAR(100)' },
      { name: 'phone', definition: 'phone VARCHAR(30)' },
      { name: 'password_hash', definition: 'password_hash TEXT' },
      { name: 'company_name', definition: 'company_name VARCHAR(255)' },
      { name: 'industry', definition: 'industry VARCHAR(100)' },
      { name: 'country', definition: 'country VARCHAR(100)' },
      { name: 'timezone', definition: 'timezone VARCHAR(50)' },
      { name: 'lead_volume', definition: 'lead_volume VARCHAR(50)' },
      { name: 'email_verified', definition: 'email_verified BOOLEAN DEFAULT FALSE' },
      { name: 'phone_verified', definition: 'phone_verified BOOLEAN DEFAULT FALSE' },
      { name: 'account_status', definition: "account_status VARCHAR(20) DEFAULT 'active'" }
    ];

    for (const column of columnsToEnsure) {
      await this.addColumnIfMissing('users', column.name, column.definition);
    }

    await this.db.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'marketer') DEFAULT 'marketer'");

    const hasLegacyPasswordColumnResult = await this.db.query(`
      SELECT COUNT(*) AS count
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'password'
    `);

    const hasLegacyPasswordColumn = Number((hasLegacyPasswordColumnResult as any[])?.[0]?.count || 0) > 0;

    if (hasLegacyPasswordColumn) {
      await this.db.query("UPDATE users SET password_hash = COALESCE(NULLIF(password_hash, ''), password) WHERE password_hash IS NULL OR password_hash = ''");
    }

    await this.db.query("UPDATE users SET first_name = COALESCE(NULLIF(first_name, ''), 'Marketer')");
    await this.db.query("UPDATE users SET last_name = COALESCE(NULLIF(last_name, ''), 'User')");
    await this.db.query("UPDATE users SET account_status = COALESCE(NULLIF(account_status, ''), 'active')");
    await this.db.query("UPDATE users SET role = 'marketer' WHERE role = 'user'");

    console.log('Users table compatibility checks complete');
  }

  private async createPasswordResetTokensTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id CHAR(36) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        token_hash VARCHAR(128) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await this.db.query(createTableSQL);
    console.log('Password reset tokens table created or already exists');
  }

  private async createLeadsTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        leadId VARCHAR(255) NOT NULL UNIQUE,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phoneNumber VARCHAR(20) NOT NULL,
        additionalInfo TEXT,
        markerId VARCHAR(255),
        marketingCategory VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await this.db.query(createTableSQL);
    console.log('Leads table created or already exists');
  }

  private async ensureLeadsTableCompatibility(): Promise<void> {
    const columnsToEnsure = [
      { name: 'markerId', definition: 'markerId VARCHAR(255)' },
      { name: 'marketingCategory', definition: 'marketingCategory VARCHAR(100)' }
    ];

    for (const column of columnsToEnsure) {
      await this.addColumnIfMissing('leads', column.name, column.definition);
    }

    console.log('Leads table compatibility checks complete');
  }

  private async createAssetsTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        assetId CHAR(36) NOT NULL UNIQUE,
        name VARCHAR(180) NOT NULL,
        originalFileName VARCHAR(255) NOT NULL,
        mimeType VARCHAR(150) NOT NULL,
        sizeBytes BIGINT NOT NULL,
        tags JSON NOT NULL,
        storageProvider ENUM('local', 's3') DEFAULT 'local',
        storageKey VARCHAR(500) NOT NULL,
        fileUrl VARCHAR(1000) NOT NULL,
        thumbnailUrl VARCHAR(1000),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_assetId (assetId),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await this.db.query(createTableSQL);
    console.log('Assets table created or already exists');
  }

  private async ensureAssetsTableCompatibility(): Promise<void> {
    const columnsToEnsure = [
      { name: 'assetId', definition: 'assetId CHAR(36)' },
      { name: 'name', definition: 'name VARCHAR(180)' },
      { name: 'originalFileName', definition: 'originalFileName VARCHAR(255)' },
      { name: 'mimeType', definition: 'mimeType VARCHAR(150)' },
      { name: 'sizeBytes', definition: 'sizeBytes BIGINT' },
      { name: 'tags', definition: 'tags JSON' },
      { name: 'storageProvider', definition: "storageProvider ENUM('local', 's3') DEFAULT 'local'" },
      { name: 'storageKey', definition: 'storageKey VARCHAR(500)' },
      { name: 'fileUrl', definition: 'fileUrl VARCHAR(1000)' },
      { name: 'thumbnailUrl', definition: 'thumbnailUrl VARCHAR(1000)' }
    ];

    for (const column of columnsToEnsure) {
      await this.addColumnIfMissing('assets', column.name, column.definition);
    }

    console.log('Assets table compatibility checks complete');
  }

  private async createEmailCampaignsTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaignId VARCHAR(255) NOT NULL UNIQUE,
        owner_user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        templateType ENUM('promotional', 'newsletter', 'product', 'event', 'custom') NOT NULL,
        content LONGTEXT NOT NULL,
        imageUrl VARCHAR(500),
        scheduledAt DATETIME,
        sentAt DATETIME,
        status ENUM('draft', 'scheduled', 'sent', 'failed') DEFAULT 'draft',
        recipientCount INT DEFAULT 0,
        sentCount INT DEFAULT 0,
        failedCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_owner_user_id (owner_user_id),
        INDEX idx_status (status),
        INDEX idx_scheduledAt (scheduledAt),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await this.db.query(createTableSQL);
    console.log('Email campaigns table created or already exists');
  }

  private async ensureEmailCampaignsCompatibility(): Promise<void> {
    await this.addColumnIfMissing('email_campaigns', 'owner_user_id', 'owner_user_id VARCHAR(255)');

    const adminRows = await this.db.query("SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1");
    const adminId = (adminRows as any[])?.[0]?.id;

    if (adminId) {
      await this.db.query('UPDATE email_campaigns SET owner_user_id = ? WHERE owner_user_id IS NULL OR owner_user_id = ""', [String(adminId)]);
    }

    console.log('Email campaigns table compatibility checks complete');
  }

  private async seedAdminUser(): Promise<void> {
    try {
      const checkAdminSQL = 'SELECT * FROM users WHERE email = ?';
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@bww.com';
      const adminPassword = process.env.ADMIN_PASSWORD || '@Bwithweath__001';
      const result = await this.db.query(checkAdminSQL, [adminEmail]);

      if (result && result.length === 0) {
        const adminPasswordHash = bcryptjs.hashSync(adminPassword, 10);

        const insertAdminSQL = `
          INSERT INTO users (
            id,
            first_name,
            last_name,
            email,
            password_hash,
            role,
            account_status,
            email_verified,
            phone_verified
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
          await this.db.query(insertAdminSQL, [
            randomUUID(),
            'System',
            'Admin',
            adminEmail,
            adminPasswordHash,
            'admin',
            'active',
            true,
            false
          ]);
        } catch {
          const legacyInsertAdminSQL = `
            INSERT INTO users (email, password, password_hash, role, userId, first_name, last_name, account_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          await this.db.query(legacyInsertAdminSQL, [
            adminEmail,
            adminPasswordHash,
            adminPasswordHash,
            'admin',
            randomUUID(),
            'System',
            'Admin',
            'active'
          ]);
        }

        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error seeding admin user:', error);
      // Don't throw, just log the error - table might already have the user
    }
  }
}
