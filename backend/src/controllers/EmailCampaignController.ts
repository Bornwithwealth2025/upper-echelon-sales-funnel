import { Request, Response } from 'express';
import { EmailCampaignService } from '../services/EmailCampaignService';
import { CreateCampaignPayload } from '../models/EmailCampaign';
import { randomUUID } from 'node:crypto';
import { sanitizeInput } from '@/utils/sanitize';
import { desanitizeInput } from '@/utils/desanitize';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class EmailCampaignController {
  constructor(private campaignService: EmailCampaignService) {}

  async createCampaign(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const payload: CreateCampaignPayload = {...req.body};
      const result = await this.campaignService.createCampaign(req.userId, {
        ...payload,
        campaignId: randomUUID(), // Generate unique campaign ID
        content: sanitizeInput(payload.content || ''), // Ensure content is a string
        scheduleFor: payload.scheduleFor ? new Date(payload.scheduleFor) : undefined
      })

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          id: result.id
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create campaign'
      });
    }
  }

  async getCampaign(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const campaign = await this.campaignService.getCampaign(req.userId, id);

      res.status(200).json({
        success: true,
        data: {...campaign, content: desanitizeInput(campaign.content || '')} // Ensure content is a string
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Campaign not found'
      });
    }
  }

  async getAllCampaigns(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const campaigns = await this.campaignService.getAllCampaigns(req.userId, limit, offset);

      res.status(200).json({
        success: true,
        data: campaigns
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch campaigns'
      });
    }
  }

  async updateCampaign(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const updates = req.body;

      await this.campaignService.updateCampaign(req.userId, id, updates);

      res.status(200).json({
        success: true,
        message: 'Campaign updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update campaign'
      });
    }
  }

  async deleteCampaign(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      await this.campaignService.deleteCampaign(req.userId, id);

      res.status(200).json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete campaign'
      });
    }
  }

  async sendCampaignNow(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const result = await this.campaignService.sendCampaignNow(req.userId, id);

      res.status(200).json({
        success: true,
        message: `Campaign sent successfully`,
        data: {
          sent: result.sent,
          failed: result.failed
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to send campaign'
      });
    }
  }

  async getCampaignStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const stats = await this.campaignService.getCampaignStats(req.userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch campaign stats'
      });
    }
  }

  async getTemplateExample(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      // Return example templates based on type
      const examples: { [key: string]: any } = {
        promotional: {
          templateType: 'promotional',
          subject: '🎉 Exclusive Offer Just For You!',
          content: '<h1>Check out this amazing deal!</h1>',
          imageUrl: 'https://example.com/promo-image.jpg'
        },
        newsletter: {
          templateType: 'newsletter',
          subject: '📰 Your Monthly Newsletter',
          content: '<h1>Latest News & Updates</h1>',
          imageUrl: 'https://example.com/newsletter-image.jpg'
        },
        product: {
          templateType: 'product',
          subject: '🎁 New Product Launch',
          content: '<h1>Introducing Our Latest Product</h1>',
          imageUrl: 'https://example.com/product-image.jpg'
        },
        event: {
          templateType: 'event',
          subject: '🎊 You\'re Invited to Our Event!',
          content: '<h1>Join us for an amazing event</h1>',
          imageUrl: 'https://example.com/event-image.jpg'
        }
      };

      const template = examples[type];
      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template type not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: template
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch template'
      });
    }
  }
}
