import dotenv from 'dotenv';
import { Application} from './app';
import { databaseConfig } from '@/config/db.config';
import { EmailConfig } from '@/types/email.interface';
import { AppConfig } from '@/types/app.interfce';
import { QueueConfig } from './types/queue.job.interface';

// Load environment variables
dotenv.config();

const emailConfig: EmailConfig = {
  host: process.env.EMAIL_SERVICE || 'gmail',
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_PASSWORD || '',
  from: process.env.EMAIL_FROM || 'noreply@leadcollector.com',
  fromName: process.env.EMAIL_FROM_NAME || 'Lead Collector',
  port: parseInt(process.env.EMAIL_PORT || '587')
};

const queueConfig: QueueConfig = {
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  redisPassword: process.env.REDIS_PASSWORD || '',
  redisUser: process.env.REDIS_USER || ''
};

const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '4050'),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: databaseConfig,
  email: emailConfig,
  queue: queueConfig,
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
};

async function main(): Promise<void> {
  try {
    const Matserapp = new Application(appConfig);
    await Matserapp.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();
