import { EmailCampaign, CreateCampaignPayload, CampaignValidator } from '../models/EmailCampaign';
import { EmailCampaignRepository } from '../repositories/EmailCampaignRepository';
import { EmailService } from './EmailService';
import { LeadRepository } from '../repositories/LeadRepository';
import { DatabaseConnection } from '@/types/db.interface';
import { UserRepository } from '@/repositories/UserRepository';


export class EmailCampaignService {
  private campaignRepo: EmailCampaignRepository;
  private leadRepo: LeadRepository;
  private userRepo:  UserRepository;

  constructor(
    private emailService: EmailService,
    db: DatabaseConnection
  ) {
    this.campaignRepo = new EmailCampaignRepository(db);
    this.leadRepo = new LeadRepository(db);
    this.userRepo = new UserRepository(db);
  }

  async createCampaign(ownerUserId: string, payload: CreateCampaignPayload): Promise<{ id: number; message: string }> {
    // Validate input
    const validation = CampaignValidator.validate(payload);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Get total leads count
    const leads = await this.leadRepo.findAll();
    const recipientCount = leads.length;

    if (recipientCount === 0) {
      throw new Error('No leads available to send campaign to');
    }

    const campaign: Omit<EmailCampaign, 'id'> = {
      campaignId: payload.campaignId,
      ownerUserId,
      name: payload.name,
      subject: payload.subject,
      templateType: payload.templateType,
      content: payload.content,
      imageUrl: payload.imageUrl,
      status: payload.scheduleFor ? 'scheduled' : 'draft',
      scheduledAt: payload.scheduleFor,
      recipientCount,
      sentCount: 0,
      failedCount: 0
    };

    const campaignId = await this.campaignRepo.create(campaign);

    return {
      id: campaignId,
      message: payload.scheduleFor 
        ? `Campaign scheduled for ${payload.scheduleFor.toISOString()}` 
        : 'Campaign created successfully'
    };
  }

  async getCampaign(ownerUserId: string, id: string): Promise<EmailCampaign> {
    const campaign = await this.campaignRepo.findByIdForOwner(id, ownerUserId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign;
  }

  private async getCampaignById(id: string): Promise<EmailCampaign> {
    const campaign = await this.campaignRepo.findById(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign;
  }

  async getAllCampaigns(ownerUserId: string, limit: number = 50, offset: number = 0): Promise<EmailCampaign[]> {
    return this.campaignRepo.findAllForOwner(ownerUserId, limit, offset);
  }

  async updateCampaign(ownerUserId: string, id: string, updates: Partial<CreateCampaignPayload>): Promise<void> {
    const campaign = await this.getCampaign(ownerUserId, id);
    
    // Don't allow updates to sent campaigns
    if (campaign.status === 'sent') {
      throw new Error('Cannot update a campaign that has already been sent');
    }

    const updateData: Partial<EmailCampaign> = {
      name: updates.name,
      subject: updates.subject,
      content: updates.content,
      templateType: updates.templateType,
      imageUrl: updates.imageUrl
    };

    if (updates.scheduleFor) {
      updateData.scheduledAt = updates.scheduleFor;
      updateData.status = 'scheduled';
    }

    await this.campaignRepo.updateForOwner(id, ownerUserId, updateData);
  }

  async deleteCampaign(ownerUserId: string, id: string): Promise<void> {
    const campaign = await this.getCampaign(ownerUserId, id);
    
    if (campaign.status === 'sent') {
      throw new Error('Cannot delete a campaign that has already been sent');
    }

    await this.campaignRepo.deleteForOwner(id, ownerUserId);
  }

  async sendCampaignToAllLeads(campaignId: string, ownerUserId?: string): Promise<{ sent: number; failed: number }> {
    const campaign = ownerUserId
      ? await this.getCampaign(ownerUserId, campaignId)// campain with owner  id
      : await this.getCampaignById(campaignId);

      const user = ownerUserId ? await this.userRepo.findById(ownerUserId) : null;

      if (user && user.accountStatus !== 'active') {
        throw new Error('User account is not active');
      }

    
    if (campaign.status === 'sent') {
      throw new Error('Campaign has already been sent');
    }

    // Get all leads with email addresses
    const leads = user?.role === 'admin'? await this.leadRepo.findAll(): await this.leadRepo.findAllForUser(ownerUserId as string);
    const recipientEmails = leads.map(lead => lead.email).filter(email => email && email.includes('@'));

    if (recipientEmails.length === 0) {
      throw new Error('No valid email addresses found in leads');
    }

    // Prepare email payloads
    const emailPayloads = recipientEmails.map(email => ({
      to: email,
      subject: campaign.subject,
      html: campaign.content
    }));

    // Send emails in batches (10 at a time to avoid overwhelming)
    const batchSize = 10;
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < emailPayloads.length; i += batchSize) {
      const batch = emailPayloads.slice(i, i + batchSize);
      try {
        const result = await this.emailService.sendBulkEmails(batch);
        totalSent += result.sent;
        totalFailed += result.failed;
      } catch (error) {
        totalFailed += batch.length;
      }
    }

    // Update campaign status
    await this.campaignRepo.update(campaignId, {
      status: 'sent',
      sentCount: totalSent,
      failedCount: totalFailed,
      sentAt: new Date()
    });

    return { sent: totalSent, failed: totalFailed };
  }

  async sendCampaignNow(ownerUserId: string, campaignId: string): Promise<{ sent: number; failed: number }> {
    const campaign = await this.getCampaign(ownerUserId, campaignId);
    
    if (campaign.status === 'sent') {
      throw new Error('Campaign has already been sent');
    }

    return this.sendCampaignToAllLeads(campaignId, ownerUserId);
  }

  async getCampaignStats(ownerUserId: string): Promise<{
    totalCampaigns: number;
    sentCampaigns: number;
    scheduledCampaigns: number;
    totalEmailsSent: number;
  }> {
    return this.campaignRepo.getStatsForOwner(ownerUserId);
  }

  async getScheduledCampaigns(): Promise<EmailCampaign[]> {
    return this.campaignRepo.findByStatus('scheduled');
  }

  // This method should be called periodically (e.g., every minute via cron job)
  async processScheduledCampaigns(): Promise<void> {
    const scheduledCampaigns = await this.getScheduledCampaigns();
    const now = new Date();

    for (const campaign of scheduledCampaigns) {
      if (campaign.scheduledAt && new Date(campaign.scheduledAt) <= now) {
        try {
         // console.log(`Sending scheduled campaign: ${campaign.name} (ID: ${campaign.campaignId})`);
          await this.sendCampaignToAllLeads(campaign.campaignId as string);

        } catch (error) {
         // console.error(`Failed to send campaign ${campaign.campaignId}: ${error}`);
          // Mark as failed
          await this.campaignRepo.update(campaign.campaignId as string, {
            status: 'failed',
            failedCount: campaign.recipientCount
          });
        }
      }
    }
  }
}
