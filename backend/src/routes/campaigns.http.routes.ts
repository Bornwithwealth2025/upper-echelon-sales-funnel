import { Router } from 'express';
import { EmailCampaignController } from '../controllers/EmailCampaignController';
import { authenticateToken, AuthenticatedRequest } from '@/middleware/authMiddleware';

export function createCampaignRoutes(controller: EmailCampaignController): Router {
  const router = Router();

  // Get campaign statistics
  router.get('/campaigns/stats', authenticateToken, (req, res) => controller.getCampaignStats(req as AuthenticatedRequest, res));

  // Get template example
  router.get('/campaigns/templates/:type', authenticateToken, (req, res) => controller.getTemplateExample(req as AuthenticatedRequest, res));

  // Get all campaigns
  router.get('/campaigns', authenticateToken,  (req, res) => controller.getAllCampaigns(req as AuthenticatedRequest, res));

  // Create new campaign
  router.post('/campaigns', authenticateToken, (req, res) => controller.createCampaign(req as AuthenticatedRequest, res));

  // Get specific campaign
  router.get('/campaigns/:id', authenticateToken, (req, res) => controller.getCampaign(req as AuthenticatedRequest, res));

  // Update campaign
  router.put('/campaigns/:id', authenticateToken, (req, res) => controller.updateCampaign(req as AuthenticatedRequest, res));

  // Delete campaign
  router.delete('/campaigns/:id', authenticateToken, (req, res) => controller.deleteCampaign(req as AuthenticatedRequest, res));

  // Send campaign immediately
  router.post('/campaigns/:id/send', authenticateToken, (req, res) => controller.sendCampaignNow(req as AuthenticatedRequest, res));

  return router;
}
