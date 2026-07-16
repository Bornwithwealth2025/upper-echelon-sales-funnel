-- Create database
CREATE DATABASE IF NOT EXISTS lead_collector;
USE lead_collector;

-- Create users table (marketer-oriented)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin user (password: @Bwithweath__001)
-- Pre-hashed with bcryptjs: $2a$10$aLPKMAq3h0qWN.7q6a0xSOyYPZlZQRGjkIxD3YIKOLMqpdExR2jDa
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
) VALUES (
  UUID(),
  'System',
  'Admin',
  'admin@bww.com',
  '$2a$10$aLPKMAq3h0qWN.7q6a0xSOyYPZlZQRGjkIxD3YIKOLMqpdExR2jDa',
  'admin',
  'active',
  TRUE,
  FALSE
) ON DUPLICATE KEY UPDATE id=id;

-- Password reset token table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id CHAR(36) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create leads table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create email campaigns table owned by marketer users
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create assets table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

