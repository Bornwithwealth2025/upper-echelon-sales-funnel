import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middleware/authMiddleware";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();
  router.post('/auth/register', (req, res, next) => controller.register(req, res, next));
  router.post('/auth/login', (req, res, next) => controller.login(req, res, next));
  router.post('/auth/forgot-password', (req, res, next) => controller.forgotPassword(req, res, next));
  router.post('/auth/reset-password', (req, res, next) => controller.resetPassword(req, res, next));
  router.post('/auth/logout', (req, res, next) => controller.logout(req, res, next));
  router.get('/auth/me', authenticateToken, (req, res, next) => controller.me(req, res, next));

  return router;
}