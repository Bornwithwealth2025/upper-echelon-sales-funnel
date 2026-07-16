import { LeadValidator } from "@/models/Lead";
import { Lead } from "@/types/lead.mode";
import { ILeadRepository } from "@/types/leadRepo.interface";


export interface ILeadService {
  saveLead(lead: Lead): Promise<{ id: number; success: boolean }>;
  getAllLeads(role: string): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | null>;
  updateLead(id: number, lead: Lead): Promise<boolean>;
  deleteLead(id: number): Promise<boolean>;
}

export class LeadService implements ILeadService {
  constructor(private leadRepository: ILeadRepository) {}

  async saveLead(lead: Lead): Promise<{ id: number; success: boolean }> {
    const validation = LeadValidator.validate(lead);
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const id = await this.leadRepository.save(lead);
    return { id, success: true };
  }

  async getAllLeads(role: string): Promise<Lead[]> {
    return role === 'admin'? this.leadRepository.getAllLeadFForAdmin() : this.leadRepository.getAll();
  }

  async getLeadById(id: number): Promise<Lead | null> {
    return this.leadRepository.getById(id);
  }

  async updateLead(id: number, lead: Lead): Promise<boolean> {
    const validation = LeadValidator.validate(lead);
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return this.leadRepository.update(id, lead);
  }

  async deleteLead(id: number): Promise<boolean> {
    return this.leadRepository.delete(id);
  }
}
