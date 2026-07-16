import { NextFunction, Request, Response } from 'express';
import { AssetTag } from '@/models/Asset';
import { AssetService } from '@/services/AssetService';

export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  async uploadAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = (req.files || {}) as Record<string, Express.Multer.File[]>;
      const file = files.file?.[0];
      const thumbnail = files.thumbnail?.[0];

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Asset file is required'
        });
        return;
      }

      const tags = this.parseTags(req.body.tags);
      const asset = await this.assetService.uploadAsset({
        name: String(req.body.name || ''),
        tags,
        file,
        thumbnail
      });

      res.status(201).json({
        success: true,
        message: 'Asset uploaded successfully',
        data: asset
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assets = await this.assetService.listAssets();
      res.status(200).json({ success: true, message: 'Assets retrieved successfully', data: assets });
    } catch (error) {
      next(error);
    }
  }

  async getAssetById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const asset = await this.assetService.getAsset(req.params.id);
      res.status(200).json({ success: true, message: 'Asset retrieved successfully', data: asset });
    } catch (error) {
      next(error);
    }
  }

  async updateAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = req.body.tags ? this.parseTags(req.body.tags) : undefined;
      const asset = await this.assetService.updateAsset(req.params.id, {
        name: req.body.name,
        tags,
        thumbnailUrl: req.body.thumbnailUrl
      });

      res.status(200).json({ success: true, message: 'Asset updated successfully', data: asset });
    } catch (error) {
      next(error);
    }
  }

  async deleteAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.assetService.deleteAsset(req.params.id);
      res.status(200).json({ success: true, message: 'Asset deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async downloadAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { asset, info } = await this.assetService.getDownloadInfo(req.params.id);

      if (info.type === 'redirect' && info.redirectUrl) {
        res.redirect(info.redirectUrl);
        return;
      }

      if (info.type === 'local-file' && info.localPath) {
        res.download(info.localPath, asset.originalFileName);
        return;
      }

      res.status(500).json({ success: false, message: 'Unable to prepare download' });
    } catch (error) {
      next(error);
    }
  }

  async emailAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = String(req.body.email || '').trim();
      const fullName = String(req.body.fullName || '').trim();

      await this.assetService.sendAssetByEmail(req.params.id, email, fullName);

      res.status(200).json({
        success: true,
        message: 'Asset sent to email successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  private parseTags(tagsRaw: unknown): AssetTag[] {
    if (Array.isArray(tagsRaw)) {
      return tagsRaw as AssetTag[];
    }

    if (typeof tagsRaw === 'string') {
      return tagsRaw
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean) as AssetTag[];
    }

    return [];
  }
}
