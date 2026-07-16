import { Lead } from "@/types/lead.mode";

export interface ILeadRepository {
  save(lead: Lead): Promise<number>;
  getAll(): Promise<Lead[]>;
  getAllLeadFForAdmin(): Promise<Lead[]>;
  getById(id: number): Promise<Lead | null>;
  update(id: number, lead: Lead): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
