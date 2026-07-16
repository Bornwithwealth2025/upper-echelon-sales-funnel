import { DatabaseConfig } from "@/types/db.interface";
import { EmailConfig } from "@/types/email.interface";
import { QueueConfig } from "@/types/queue.job.interface";

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  email: EmailConfig;
  queue: QueueConfig;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}
