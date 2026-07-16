export type AssetTag = 'emailable' | 'downloadable' | 'playable';

export interface Asset {
  id?: number;
  assetId: string;
  name: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  tags: AssetTag[];
  storageProvider: 'local' | 's3';
  storageKey: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAssetPayload {
  assetId: string;
  name: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  tags: AssetTag[];
  storageProvider: 'local' | 's3';
  storageKey: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
}

export interface UpdateAssetPayload {
  name?: string;
  tags?: AssetTag[];
  thumbnailUrl?: string | null;
}

export class AssetValidator {
  static validateName(name: string): string[] {
    const errors: string[] = [];
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Asset name is required');
    }
    if (typeof name === 'string' && name.trim().length > 180) {
      errors.push('Asset name must be less than 180 characters');
    }
    return errors;
  }

  static validateTags(tags: unknown): { isValid: boolean; errors: string[]; tags: AssetTag[] } {
    const errors: string[] = [];
    const allowed = new Set<AssetTag>(['emailable', 'downloadable', 'playable']);

    if (!Array.isArray(tags)) {
      return { isValid: false, errors: ['Tags must be an array'], tags: [] };
    }

    const normalized = tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean) as AssetTag[];

    if (normalized.length === 0) {
      errors.push('At least one tag is required');
    }

    for (const tag of normalized) {
      if (!allowed.has(tag)) {
        errors.push(`Invalid tag: ${tag}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      tags: [...new Set(normalized)]
    };
  }

  static isSupportedFileType(mimeType: string): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'audio/webm'
    ];

    return allowedMimeTypes.includes(mimeType);
  }

  static isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  static isPlayableMedia(mimeType: string): boolean {
    return mimeType.startsWith('video/') || mimeType.startsWith('audio/');
  }
}
