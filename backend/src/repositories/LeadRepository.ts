import { DatabaseConnection } from '@/types/db.interface';
import { ILeadRepository } from '@/types/leadRepo.interface';
import { Lead } from '@/types/lead.mode';

export class LeadRepository implements ILeadRepository {
  constructor(private db: DatabaseConnection) {}

  async save(lead: Lead): Promise<number> {
    const query = `
      INSERT INTO leads (fullName, email, phoneNumber, additionalInfo, leadId, markerId, marketingCategory)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await this.db.query(query, [
      lead.fullName,
      lead.email,
      lead.phoneNumber,
      lead.additionalInfo || null,
      lead.leadId,
      lead.markerId || null,
      lead.marketingCategory || null
    ]);
    return (result as any).insertId;
  }

  async getAll(): Promise<Lead[]> {
    const query = `SELECT * FROM leads
                    INNER JOIN users ON leads.markerId = users.userId
                    ORDER BY leads.createdAt DESC`;
    const results = await this.db.query(query);
    return results as Lead[];
  }
  async getAllLeadFForAdmin(): Promise<Lead[]> {
    const query = `SELECT * FROM leads ORDER BY createdAt DESC`;
    const results = await this.db.query(query);
    return results as Lead[];
  }

  async getById(id: number): Promise<Lead | null> {
    const query = 'SELECT * FROM leads WHERE leadId = ?';
    const results = await this.db.query(query, [id]);
    return (results as Lead[])[0] || null;
  }

  async update(id: number, lead: Lead): Promise<boolean> {
    const query = `
      UPDATE leads 
      SET fullName = ?, email = ?, phoneNumber = ?, additionalInfo = ?, markerId = ?, marketingCategory = ?
      WHERE id = ?
    `;
    const result = await this.db.query(query, [
      lead.fullName,
      lead.email,
      lead.phoneNumber,
      lead.additionalInfo || null,
      lead.markerId || null,
      lead.marketingCategory || null,
      id
    ]);
    return (result as any).affectedRows > 0;
  }

  async findAll(): Promise<any[]> {
    const query = 'SELECT * FROM leads ORDER BY createdAt DESC';
    const rows: any = await this.db.query(query, []);
    return rows as any[];
  }

  async findAllForUser(userId: string): Promise<any[]> {
    const query = `
      SELECT * FROM leads
      WHERE markerId = ?
      ORDER BY createdAt DESC
    `;
    const rows: any = await this.db.query(query, [userId]);
    return rows as any[];
  }


  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM leads WHERE id = ?';
    const result = await this.db.query(query, [id]);
    return (result as any).affectedRows > 0;
  }
}
