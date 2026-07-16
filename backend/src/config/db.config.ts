import { DatabaseConfig } from '@/types/db.interface';
import dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser) {
  throw new Error('DB_USER must be set in the backend environment');
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: dbUser,
  password: dbPassword || '',
  database: process.env.DB_NAME || 'lead_collector',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
