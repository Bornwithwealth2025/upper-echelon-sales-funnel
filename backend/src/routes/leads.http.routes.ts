import { Router } from "express";
import { ILeadController } from "../controllers/LeadController";
import { authenticateToken, authorizeRole } from "@/middleware/authMiddleware";


export function createLeadRoutes(controller: ILeadController): Router {
  const router = Router();

  router.post('/save-led', (req, res, next) => controller.saveLead(req, res, next));
  router.get('/get-led', authenticateToken, (req, res, next) => controller.getAllLeads(req, res, next));
  router.get('/get-led/:id', authenticateToken, (req, res, next) => controller.getLeadById(req, res, next));
  router.put('/update-led/:id', authenticateToken, authorizeRole(['admin']), (req, res, next) => controller.updateLead(req, res, next));
  router.delete('/delete-led/:id', authenticateToken, authorizeRole(['admin']), (req, res, next) => controller.deleteLead(req, res, next));

  return router;
}
