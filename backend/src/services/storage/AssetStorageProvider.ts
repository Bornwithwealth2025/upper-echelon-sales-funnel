import { Asset } from '@/models/Asset';

export interface StoredFileInfo {
  storageProvider: 'local' | 's3';
  storageKey: string;
  publicUrl: string;
}

export interface DownloadInfo {
  type: 'local-file' | 'redirect';
  localPath?: string;
  redirectUrl?: string;
}

export interface EmailAttachmentInfo {
  filename: string;
  contentType: string;
  path?: string;
  content?: Buffer;
}

export interface AssetStorageProvider {
  upload(params: {
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
    folder: 'assets' | 'thumbnails';
    assetId: string;
  }): Promise<StoredFileInfo>;
  delete(storageKey: string): Promise<void>;
  getDownloadInfo(asset: Asset): Promise<DownloadInfo>;
  getEmailAttachment(asset: Asset): Promise<EmailAttachmentInfo>;
}
