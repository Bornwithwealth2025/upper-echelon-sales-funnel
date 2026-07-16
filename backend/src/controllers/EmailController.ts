import { Request, Response, NextFunction } from 'express';
import { EmailQueue} from '../services/EmailQueue';
import { EmailTemplates } from '../utils/EmailTemplates';
import { DatabaseConnection } from '@/types/db.interface';
import { EmailJobData } from '@/types/queue.job.interface';

export interface IEmailController {
  sendPromoToAllLeads(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendPromoToLead(req: Request, res: Response, next: NextFunction): Promise<void>;
  getQueueStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class EmailController implements IEmailController {
  constructor(private db: DatabaseConnection, private emailQueue: EmailQueue) {}

  async sendPromoToAllLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { promoTitle, promoDescription, batchSize = 100 } = req.body;

      if (!promoTitle || !promoDescription) {
        res.status(400).json({
          success: false,
          message: 'promoTitle and promoDescription are required'
        });
        return;
      }

      // Fetch all leads from database
      const query = 'SELECT id, fullName, email FROM leads WHERE email IS NOT NULL';
      const leads = await this.db.query(query);

      if (!Array.isArray(leads) || leads.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No leads found'
        });
        return;
      }

      // Prepare email jobs
      const emailJobs: EmailJobData[] = leads.map((lead: any) => ({
        to: lead.email,
        subject: promoTitle,
        html: EmailTemplates.getPromoEmailTemplate(
          lead.fullName,
          promoTitle,
          promoDescription
        )
      }));

      // Add jobs to queue in batches
      let totalJobsAdded = 0;
      for (let i = 0; i < emailJobs.length; i += batchSize) {
        const batch = emailJobs.slice(i, i + batchSize);
        await this.emailQueue.addBulkEmails(batch);
        totalJobsAdded += batch.length;

        // Add delay between batches to avoid overwhelming the system
        if (i + batchSize < emailJobs.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      res.status(202).json({
        success: true,
        message: `Promo campaign started. ${totalJobsAdded} emails queued for delivery`,
        data: {
          totalLeads: totalJobsAdded,
          queuedJobs: totalJobsAdded
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async sendPromoToLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leadId, promoTitle, promoDescription } = req.body;

      if (!leadId || !promoTitle || !promoDescription) {
        res.status(400).json({
          success: false,
          message: 'leadId, promoTitle, and promoDescription are required'
        });
        return;
      }

      // Fetch lead from database
      const query = 'SELECT id, fullName, email FROM leads WHERE id = ?';
      const leads = await this.db.query(query, [leadId]);

      if (!Array.isArray(leads) || leads.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
        return;
      }

      const lead = leads[0];

      // Add email job to queue
      const emailJob: EmailJobData = {
        to: lead.email,
        subject: promoTitle,
        html: EmailTemplates.getPromoEmailTemplate(
          lead.fullName,
          promoTitle,
          promoDescription
        )
      };

      const job = await this.emailQueue.addEmailJob(emailJob);

      res.status(202).json({
        success: true,
        message: 'Promo email queued for delivery',
        data: {
          jobId: job.id,
          leadId,
          email: lead.email,
          status: 'pending'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getQueueStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.emailQueue.getQueueStats();

      res.status(200).json({
        success: true,
        message: 'Queue status retrieved successfully',
        data: {
          active: stats.active,
          waiting: stats.waiting,
          completed: stats.completed,
          failed: stats.failed,
          total: stats.active + stats.waiting + stats.completed + stats.failed
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
