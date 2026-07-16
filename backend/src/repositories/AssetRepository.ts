import { DatabaseConnection } from '@/types/db.interface';
import { Asset, AssetTag, CreateAssetPayload, UpdateAssetPayload } from '@/models/Asset';

interface AssetRow {
  id: number;
  assetId: string;
  name: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  tags: string;
  storageProvider: 'local' | 's3';
  storageKey: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AssetRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async create(payload: CreateAssetPayload): Promise<number> {
    const query = `
      INSERT INTO assets (
        assetId,
        name,
        originalFileName,
        mimeType,
        sizeBytes,
        tags,
        storageProvider,
        storageKey,
        fileUrl,
        thumbnailUrl
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await this.db.query(query, [
      payload.assetId,
      payload.name,
      payload.originalFileName,
      payload.mimeType,
      payload.sizeBytes,
      JSON.stringify(payload.tags),
      payload.storageProvider,
      payload.storageKey,
      payload.fileUrl,
      payload.thumbnailUrl || null
    ]);

    return (result as { insertId: number }).insertId;
  }

  async findAll(): Promise<Asset[]> {
    const rows = await this.db.query('SELECT * FROM assets ORDER BY createdAt DESC');
    return (rows as AssetRow[]).map((row) => this.mapRow(row));
  }

  async findByAssetId(assetId: string): Promise<Asset | null> {
    const rows = await this.db.query('SELECT * FROM assets WHERE assetId = ? LIMIT 1', [assetId]);
    const row = (rows as AssetRow[])[0];
    return row ? this.mapRow(row) : null;
  }

  async updateByAssetId(assetId: string, updates: UpdateAssetPayload): Promise<boolean> {
    const assignments: string[] = [];
    const values: Array<string | null> = [];

    if (typeof updates.name === 'string') {
      assignments.push('name = ?');
      values.push(updates.name.trim());
    }

    if (Array.isArray(updates.tags)) {
      assignments.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }

    if (typeof updates.thumbnailUrl === 'string' || updates.thumbnailUrl === null) {
      assignments.push('thumbnailUrl = ?');
      values.push(updates.thumbnailUrl ?? null);
    }

    if (assignments.length === 0) {
      return false;
    }

    const query = `
      UPDATE assets
      SET ${assignments.join(', ')}, updatedAt = CURRENT_TIMESTAMP
      WHERE assetId = ?
    `;
    values.push(assetId);

    const result = await this.db.query(query, values);
    return (result as { affectedRows: number }).affectedRows > 0;
  }

  async deleteByAssetId(assetId: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM assets WHERE assetId = ?', [assetId]);
    return (result as { affectedRows: number }).affectedRows > 0;
  }

  private mapRow(row: AssetRow): Asset {
    return {
      id: row.id,
      assetId: row.assetId,
      name: row.name,
      originalFileName: row.originalFileName,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      tags: this.parseTags(row.tags),
      storageProvider: row.storageProvider,
      storageKey: row.storageKey,
      fileUrl: row.fileUrl,
      thumbnailUrl: row.thumbnailUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private parseTags(tagsRaw: string): AssetTag[] {
    try {
      const parsed = JSON.parse(tagsRaw) as AssetTag[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
