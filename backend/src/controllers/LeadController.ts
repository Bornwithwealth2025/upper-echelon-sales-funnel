import { Router, Request, Response, NextFunction } from 'express';
import { ILeadService } from '../services/LeadService';
import { Lead } from '@/types/lead.mode';
import { randomUUID } from 'node:crypto';


export interface ILeadController {
  saveLead(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllLeads(req: Request, res: Response, next: NextFunction): Promise<void>;
  getLeadById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateLead(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteLead(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class LeadController implements ILeadController {
  constructor(private leadService: ILeadService) {}

  async saveLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead: Lead = req.body;
      
      const result = await this.leadService.saveLead({...lead, leadId: randomUUID()}); // leadId will be set by the database
      res.status(201).json({
        success: true,
        message: 'Lead saved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = (req as Request & { role?: string }).role ?? '';
      const leads = await this.leadService.getAllLeads(role);

      res.status(200).json({
        success: true,
        message: 'Leads retrieved successfully',
        data: leads
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeadById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const lead = await this.leadService.getLeadById(id);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lead retrieved successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const lead: Lead = req.body;
      const updated = await this.leadService.updateLead(id, lead);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.leadService.deleteLead(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

