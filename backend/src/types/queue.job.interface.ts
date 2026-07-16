export interface QueueConfig {
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  redisUser?: string;
}

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
