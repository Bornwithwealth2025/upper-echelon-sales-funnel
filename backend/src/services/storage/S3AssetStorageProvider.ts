import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { Asset } from '@/models/Asset';
import {
  AssetStorageProvider,
  DownloadInfo,
  EmailAttachmentInfo,
  StoredFileInfo
} from '@/services/storage/AssetStorageProvider';

interface S3StorageConfig {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl?: string;
}

export class S3AssetStorageProvider implements AssetStorageProvider {
  private readonly client: S3Client;

  constructor(private readonly config: S3StorageConfig) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
    });
  }

  async upload(params: {
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
    folder: 'assets' | 'thumbnails';
    assetId: string;
  }): Promise<StoredFileInfo> {
    const extension = this.extractExtension(params.originalName, params.mimeType);
    const key = `${params.folder}/${params.assetId}-${randomUUID()}${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: params.fileBuffer,
        ContentType: params.mimeType
      })
    );

    return {
      storageProvider: 's3',
      storageKey: key,
      publicUrl: this.getPublicUrl(key)
    };
  }

  async delete(storageKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: storageKey
      })
    );
  }

  async getDownloadInfo(asset: Asset): Promise<DownloadInfo> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: asset.storageKey,
      ResponseContentDisposition: `attachment; filename="${asset.originalFileName}"`
    });

    const signedUrl = await getSignedUrl(this.client, command, { expiresIn: 300 });
    return {
      type: 'redirect',
      redirectUrl: signedUrl
    };
  }

  async getEmailAttachment(asset: Asset): Promise<EmailAttachmentInfo> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: asset.storageKey
      })
    );

    if (!response.Body) {
      throw new Error('Unable to fetch asset content from S3');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(Buffer.from(chunk));
    }

    return {
      filename: asset.originalFileName,
      contentType: asset.mimeType,
      content: Buffer.concat(chunks)
    };
  }

  private getPublicUrl(key: string): string {
    if (this.config.publicBaseUrl) {
      return `${this.config.publicBaseUrl.replace(/\/$/, '')}/${key}`;
    }

    return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  private extractExtension(originalName: string, mimeType: string): string {
    const fromName = originalName.includes('.') ? `.${originalName.split('.').pop()}` : '';
    if (fromName) {
      return fromName;
    }

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
