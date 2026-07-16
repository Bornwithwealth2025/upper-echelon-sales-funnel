import { AssetStorageProvider } from '@/services/storage/AssetStorageProvider';
import { LocalAssetStorageProvider } from '@/services/storage/LocalAssetStorageProvider';
import { S3AssetStorageProvider } from '@/services/storage/S3AssetStorageProvider';

export function createAssetStorageProvider(): AssetStorageProvider {
  const driver = (process.env.ASSET_STORAGE_DRIVER || 'local').toLowerCase();

  if (driver === 's3') {
    const bucketName = process.env.AWS_S3_BUCKET || '';
    const region = process.env.AWS_REGION || '';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

    if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
      throw new Error('S3 storage selected but AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are required');
    }

    return new S3AssetStorageProvider({
      bucketName,
      region,
      accessKeyId,
      secretAccessKey,
      publicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL
    });
  }

  const basePath = process.env.ASSET_LOCAL_PUBLIC_BASE_PATH || '/campain-app/uploads';
  return new LocalAssetStorageProvider(basePath);
}
