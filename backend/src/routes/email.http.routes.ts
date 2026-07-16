import { Router } from "express";
import { IEmailController } from "../controllers/EmailController";

export function createEmailRoutes(controller: IEmailController): Router {
  const router = Router();

  router.post('/send-promo-all', (req, res, next) =>
    controller.sendPromoToAllLeads(req, res, next)
  );

  router.post('/send-promo', (req, res, next) =>
    controller.sendPromoToLead(req, res, next)
  );

  router.get('/queue-status', (req, res, next) =>
    controller.getQueueStatus(req, res, next)
  );

  return router;
}
