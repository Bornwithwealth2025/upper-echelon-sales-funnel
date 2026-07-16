import { EmailPayload, IEmailService } from '@/types/email.interface';
import { EmailJobData, QueueConfig } from '@/types/queue.job.interface';
import { desanitizeInput } from '@/utils/desanitize';
import Queue from 'bull';

/**
 *  EmailQueue
 *  Manages a queue of email jobs using Bull and Redis
 *  Handles adding email jobs to the queue and processing them with retry logic
 * 
 * new Queue
 * process(concurrency: e.g5, processor: async (job) => void)
 * events: completed, failed
 * new QueueJob(data, options).add()
 * getActiveCount(), getWaitingCount(), getCompletedCount(), getFailedCount()
 * close()
 */
export class EmailQueue {
  private queue: Queue.Queue<EmailJobData>;
  private emailService: IEmailService;

  constructor(config: QueueConfig, emailService: IEmailService) {
    this.emailService = emailService;
    
    const redisOptions = {
      host: config.redisHost,
      port: config.redisPort,
      ...(config.redisPassword && { password: config.redisPassword }),
      ...(config.redisUser && { username: config.redisUser })
    };

    this.queue = new Queue<EmailJobData>('email-queue', { redis: redisOptions });
    
    // Process email jobs
    this.queue.process(3, async (job) => {
      return this.processEmailJob(job);
    });

    // Event handlers
    this.queue.on('completed', (job) => {
      console.log(`Email job ${job.id} completed successfully`);
    });

    this.queue.on('failed', (job, error) => {
      console.error(`Email job ${job.id} failed:`, error.message);
    });
  }

  private async processEmailJob(job: Queue.Job<EmailJobData>): Promise<void> {
    const { to, subject, html, text } = job.data;
    
    const payload: EmailPayload = {
      to,
      subject,
      html: desanitizeInput(html || ''), // Ensure html is a string
      text
    }; 

    const success = await this.emailService.sendEmail(payload);
    
    if (!success) {
      throw new Error(`Failed to send email to ${to}`);
    }
  }

  async addEmailJob(data: EmailJobData): Promise<Queue.Job<EmailJobData>> {
    return this.queue.add(data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
    });
  }

  async addBulkEmails(emails: EmailJobData[]): Promise<Queue.Job<EmailJobData>[]> {
    const jobs = await Promise.all(
      emails.map(email => this.addEmailJob(email))
    );
    return jobs;
  }

  async getQueueStats(): Promise<{ active: number; waiting: number; completed: number; failed: number }> {
    const [active, waiting, completed, failed] = await Promise.all([
      this.queue.getActiveCount(),
      this.queue.getWaitingCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount()
    ]);

    return { active, waiting, completed, failed };
  }

  async close(): Promise<void> {
    await this.queue.close();
  }
}
