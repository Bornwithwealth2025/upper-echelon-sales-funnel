import { Router } from 'express';
import multer from 'multer';
import { AssetController } from '@/controllers/AssetController';
import { authenticateToken } from '@/middleware/authMiddleware';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

export function createAssetRoutes(controller: AssetController): Router {
  const router = Router();

  router.post(
    '/assets/upload',
    authenticateToken,
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    (req, res, next) => controller.uploadAsset(req, res, next)
  );

  router.get('/assets', authenticateToken, (req, res, next) => controller.getAssets(req, res, next));
  router.put('/assets/:id', authenticateToken, (req, res, next) => controller.updateAsset(req, res, next));
  router.delete('/assets/:id', authenticateToken, (req, res, next) => controller.deleteAsset(req, res, next));

  router.get('/assets/:id', (req, res, next) => controller.getAssetById(req, res, next));
  router.get('/assets/:id/download', (req, res, next) => controller.downloadAsset(req, res, next));
  router.post('/assets/:id/email', (req, res, next) => controller.emailAsset(req, res, next));

  return router;
}
