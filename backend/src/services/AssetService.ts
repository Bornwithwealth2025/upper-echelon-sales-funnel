import { randomUUID } from 'crypto';
import { Asset, AssetTag, AssetValidator, UpdateAssetPayload } from '@/models/Asset';
import { AssetRepository } from '@/repositories/AssetRepository';
import { AssetStorageProvider } from '@/services/storage/AssetStorageProvider';
import { EmailService } from '@/services/EmailService';

export class AssetService {
  constructor(
    private readonly repository: AssetRepository,
    private readonly storageProvider: AssetStorageProvider,
    private readonly emailService?: EmailService
  ) {}

  async uploadAsset(params: {
    name: string;
    tags: AssetTag[];
    file: Express.Multer.File;
    thumbnail?: Express.Multer.File;
  }): Promise<Asset> {
    const nameErrors = AssetValidator.validateName(params.name);
    const tagsValidation = AssetValidator.validateTags(params.tags);

    if (!AssetValidator.isSupportedFileType(params.file.mimetype)) {
      nameErrors.push('Unsupported file type. Allowed: image, PDF, DOC, video');
    }

    if (params.thumbnail && !AssetValidator.isImage(params.thumbnail.mimetype)) {
      nameErrors.push('Thumbnail must be an image file');
    }

    if (nameErrors.length > 0 || !tagsValidation.isValid) {
      throw new Error([...nameErrors, ...tagsValidation.errors].join(', '));
    }

    const normalizedTags: AssetTag[] = [...tagsValidation.tags];
    if (AssetValidator.isPlayableMedia(params.file.mimetype) && !normalizedTags.includes('playable')) {
      normalizedTags.push('playable');
    }

    const assetId = randomUUID();
    const fileStored = await this.storageProvider.upload({
      fileBuffer: params.file.buffer,
      originalName: params.file.originalname,
      mimeType: params.file.mimetype,
      folder: 'assets',
      assetId
    });

    let thumbnailUrl: string | null = null;
    try {
      if (params.thumbnail) {
        const thumbStored = await this.storageProvider.upload({
          fileBuffer: params.thumbnail.buffer,
          originalName: params.thumbnail.originalname,
          mimeType: params.thumbnail.mimetype,
          folder: 'thumbnails',
          assetId
        });
        thumbnailUrl = thumbStored.publicUrl;
      }

      await this.repository.create({
        assetId,
        name: params.name.trim(),
        originalFileName: params.file.originalname,
        mimeType: params.file.mimetype,
        sizeBytes: params.file.size,
        tags: normalizedTags,
        storageProvider: fileStored.storageProvider,
        storageKey: fileStored.storageKey,
        fileUrl: fileStored.publicUrl,
        thumbnailUrl
      });
    } catch (error) {
      await this.storageProvider.delete(fileStored.storageKey);
      throw error;
    }

    const asset = await this.repository.findByAssetId(assetId);
    if (!asset) {
      throw new Error('Failed to persist uploaded asset');
    }

    return asset;
  }

  async listAssets(): Promise<Asset[]> {
    return this.repository.findAll();
  }

  async getAsset(assetId: string): Promise<Asset> {
    const asset = await this.repository.findByAssetId(assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }
    return asset;
  }

  async updateAsset(assetId: string, updates: UpdateAssetPayload): Promise<Asset> {
    const payload: UpdateAssetPayload = {};
    const existingAsset = await this.getAsset(assetId);

    if (typeof updates.name === 'string') {
      const errors = AssetValidator.validateName(updates.name);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      payload.name = updates.name.trim();
    }

    if (updates.tags) {
      const tagsValidation = AssetValidator.validateTags(updates.tags);
      if (!tagsValidation.isValid) {
        throw new Error(tagsValidation.errors.join(', '));
      }
      const normalizedTags: AssetTag[] = [...tagsValidation.tags];
      if (AssetValidator.isPlayableMedia(existingAsset.mimeType) && !normalizedTags.includes('playable')) {
        normalizedTags.push('playable');
      }
      payload.tags = normalizedTags;
    }

    if (typeof updates.thumbnailUrl === 'string' || updates.thumbnailUrl === null) {
      payload.thumbnailUrl = updates.thumbnailUrl;
    }

    const updated = await this.repository.updateByAssetId(assetId, payload);
    if (!updated) {
      throw new Error('Asset not found or no valid updates provided');
    }

    return this.getAsset(assetId);
  }

  async deleteAsset(assetId: string): Promise<void> {
    const asset = await this.getAsset(assetId);

    await this.repository.deleteByAssetId(assetId);
    await this.storageProvider.delete(asset.storageKey);
  }

  async getDownloadInfo(assetId: string): Promise<{ asset: Asset; info: Awaited<ReturnType<AssetStorageProvider['getDownloadInfo']>> }> {
    const asset = await this.getAsset(assetId);
    if (!asset.tags.includes('downloadable')) {
      throw new Error('This asset is not downloadable');
    }

    const info = await this.storageProvider.getDownloadInfo(asset);
    return { asset, info };
  }

  async sendAssetByEmail(assetId: string, recipientEmail: string, recipientName?: string): Promise<void> {
    if (!this.emailService) {
      throw new Error('Email service is not configured');
    }

    const asset = await this.getAsset(assetId);
    if (!asset.tags.includes('emailable')) {
      throw new Error('This asset is not emailable');
    }

    const email = String(recipientEmail || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('A valid recipient email is required');
    }

    const attachment = await this.storageProvider.getEmailAttachment(asset);
    const displayName = recipientName?.trim() || 'there';

    const sent = await this.emailService.sendEmail({
      to: email,
      subject: `Your requested asset: ${asset.name}`,
      html: `<p>Hi ${displayName},</p><p>Thanks for your submission. Your requested asset <strong>${asset.name}</strong> is attached.</p>`,
      attachments: [attachment]
    });

    if (!sent) {
      throw new Error('Failed to send asset email');
    }
  }
}
