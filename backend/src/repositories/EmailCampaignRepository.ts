import { DatabaseConnection } from '@/types/db.interface';
import { EmailCampaign } from '../models/EmailCampaign';

export class EmailCampaignRepository {
  constructor(private db: DatabaseConnection) {}

  private mapCampaign(row: any): EmailCampaign {
    return {
      id: row.id,
      campaignId: row.campaignId,
      ownerUserId: row.owner_user_id,
      name: row.name,
      subject: row.subject,
      templateType: row.templateType,
      content: row.content,
      imageUrl: row.imageUrl,
      scheduledAt: row.scheduledAt,
      sentAt: row.sentAt,
      status: row.status,
      recipientCount: row.recipientCount,
      sentCount: row.sentCount,
      failedCount: row.failedCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  async create(campaign: Omit<EmailCampaign, 'id'>): Promise<number> {
    const query = `
      INSERT INTO email_campaigns 
      (campaignId, owner_user_id, name, subject, templateType, content, imageUrl, scheduledAt, status, recipientCount, sentCount, failedCount, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
 
    const result: any = await this.db.query(query, [
      campaign.campaignId,
      campaign.ownerUserId,
      campaign.name,
      campaign.subject,
      campaign.templateType,
      campaign.content,
      campaign.imageUrl || null,
      campaign.scheduledAt || null,
      campaign.status,
      campaign.recipientCount || 0,
      campaign.sentCount || 0,
      campaign.failedCount || 0

    ]);

    return (result as any).insertId;
  }

  async findByIdForOwner(id: string, ownerUserId: string): Promise<EmailCampaign | null> {
    const query = 'SELECT * FROM email_campaigns WHERE campaignId = ? AND owner_user_id = ?';
    const rows: any = await this.db.query(query, [id, ownerUserId]);

    if (rows.length === 0) return null;
    return this.mapCampaign(rows[0]);
  }

  async findById(id: string): Promise<EmailCampaign | null> {
    const query = 'SELECT * FROM email_campaigns WHERE campaignId = ?';
    const rows: any = await this.db.query(query, [id]);

    if (rows.length === 0) return null;
    return this.mapCampaign(rows[0]);
  }

  async findAllForOwner(ownerUserId: string, limit: number = 50, offset: number = 0): Promise<EmailCampaign[]> {
    const query = `
      SELECT * FROM email_campaigns 
      WHERE owner_user_id = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `;
    const rows: any = await this.db.query(query, [ownerUserId, limit, offset]);
    return (rows as any[]).map(row => this.mapCampaign(row));
  }

  async findByStatus(status: string): Promise<EmailCampaign[]> {
    const query = 'SELECT * FROM email_campaigns WHERE status = ? ORDER BY createdAt DESC';
    const rows: any = await this.db.query(query, [status]);
    return (rows as any[]).map(row => this.mapCampaign(row));
  }

   async updateForOwner(id: string, ownerUserId: string, campaign: Partial<EmailCampaign>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (campaign.name !== undefined) {
      fields.push('name = ?');
      values.push(campaign.name);
    }
    if (campaign.subject !== undefined) {
      fields.push('subject = ?');
      values.push(campaign.subject);
    }
    if (campaign.templateType !== undefined) {
      fields.push('templateType = ?');
      values.push(campaign.templateType);
    }
    if (campaign.content !== undefined) {
      fields.push('content = ?');
      values.push(campaign.content);
    }
    if (campaign.imageUrl !== undefined) {
      fields.push('imageUrl = ?');
      values.push(campaign.imageUrl);
    }
    if (campaign.scheduledAt !== undefined) {
      fields.push('scheduledAt = ?');
      values.push(campaign.scheduledAt);
    }
    if (campaign.status !== undefined) {
      fields.push('status = ?');
      values.push(campaign.status);
    }
    if (campaign.recipientCount !== undefined) {
      fields.push('recipientCount = ?');
      values.push(campaign.recipientCount);
    }
    if (campaign.sentCount !== undefined) {
      fields.push('sentCount = ?');
      values.push(campaign.sentCount);
    }
    if (campaign.failedCount !== undefined) {
      fields.push('failedCount = ?');
      values.push(campaign.failedCount);
    }
    if (campaign.sentAt !== undefined) {
      fields.push('sentAt = ?');
      values.push(campaign.sentAt);
    }

    if (fields.length === 0) return;

    fields.push('updatedAt = NOW()');

    const query = `UPDATE email_campaigns SET ${fields.join(', ')} WHERE campaignId = ? AND owner_user_id = ?`;
    await this.db.query(query, [...values, id, ownerUserId]);
  }

  async update(id: string, campaign: Partial<EmailCampaign>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (campaign.name !== undefined) {
      fields.push('name = ?');
      values.push(campaign.name);
    }
    if (campaign.subject !== undefined) {
      fields.push('subject = ?');
      values.push(campaign.subject);
    }
    if (campaign.templateType !== undefined) {
      fields.push('templateType = ?');
      values.push(campaign.templateType);
    }
    if (campaign.content !== undefined) {
      fields.push('content = ?');
      values.push(campaign.content);
    }
    if (campaign.imageUrl !== undefined) {
      fields.push('imageUrl = ?');
      values.push(campaign.imageUrl);
    }
    if (campaign.scheduledAt !== undefined) {
      fields.push('scheduledAt = ?');
      values.push(campaign.scheduledAt);
    }
    if (campaign.status !== undefined) {
      fields.push('status = ?');
      values.push(campaign.status);
    }
    if (campaign.recipientCount !== undefined) {
      fields.push('recipientCount = ?');
      values.push(campaign.recipientCount);
    }
    if (campaign.sentCount !== undefined) {
      fields.push('sentCount = ?');
      values.push(campaign.sentCount);
    }
    if (campaign.failedCount !== undefined) {
      fields.push('failedCount = ?');
      values.push(campaign.failedCount);
    }
    if (campaign.sentAt !== undefined) {
      fields.push('sentAt = ?');
      values.push(campaign.sentAt);
    }

    if (fields.length === 0) return;

    fields.push('updatedAt = NOW()');

    const query = `UPDATE email_campaigns SET ${fields.join(', ')} WHERE campaignId = ?`;
    await this.db.query(query, [...values, id]);
  }

  async deleteForOwner(id: string, ownerUserId: string): Promise<void> {
    const query = 'DELETE FROM email_campaigns WHERE campaignId = ? AND owner_user_id = ?';
    await this.db.query(query, [id, ownerUserId]);
  }

  async getStatsForOwner(ownerUserId: string): Promise<{ totalCampaigns: number; sentCampaigns: number; scheduledCampaigns: number; totalEmailsSent: number }> {
    const query = `
      SELECT 
        COUNT(*) as totalCampaigns,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sentCampaigns,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduledCampaigns,
        SUM(sentCount) as totalEmailsSent
      FROM email_campaigns
      WHERE owner_user_id = ?
    `;
    const rows: any = await this.db.query(query, [ownerUserId]);
    return (rows as any)[0] || { totalCampaigns: 0, sentCampaigns: 0, scheduledCampaigns: 0, totalEmailsSent: 0 };
  }
}