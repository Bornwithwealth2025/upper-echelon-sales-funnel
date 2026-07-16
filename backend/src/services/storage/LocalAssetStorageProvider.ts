import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { Asset } from '@/models/Asset';
import {
  AssetStorageProvider,
  DownloadInfo,
  EmailAttachmentInfo,
  StoredFileInfo
} from '@/services/storage/AssetStorageProvider';

export class LocalAssetStorageProvider implements AssetStorageProvider {
  private readonly rootDirectory: string;

  constructor(private readonly publicBasePath: string) {
    this.rootDirectory = path.resolve(process.cwd(), 'uploads');
  }

  async upload(params: {
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
    folder: 'assets' | 'thumbnails';
    assetId: string;
  }): Promise<StoredFileInfo> {
    const extension = path.extname(params.originalName) || this.deriveExtension(params.mimeType);
    const fileName = `${params.assetId}-${randomUUID()}${extension}`;
    const relativePath = path.join(params.folder, fileName).replace(/\\/g, '/');
    const absolutePath = path.join(this.rootDirectory, relativePath);

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, params.fileBuffer);

    return {
      storageProvider: 'local',
      storageKey: relativePath,
      publicUrl: `${this.publicBasePath}/${relativePath}`
    };
  }

  async delete(storageKey: string): Promise<void> {
    const fullPath = path.join(this.rootDirectory, storageKey);
    try {
      await fs.unlink(fullPath);
    } catch {
      // File may already be gone; treat delete as idempotent.
    }
  }

  async getDownloadInfo(asset: Asset): Promise<DownloadInfo> {
    return {
      type: 'local-file',
      localPath: path.join(this.rootDirectory, asset.storageKey)
    };
  }

  async getEmailAttachment(asset: Asset): Promise<EmailAttachmentInfo> {
    return {
      filename: asset.originalFileName,
      contentType: asset.mimeType,
      path: path.join(this.rootDirectory, asset.storageKey)
    };
  }

  private deriveExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/quicktime': '.mov'
    };

    return map[mimeType] || '';
  }
}
