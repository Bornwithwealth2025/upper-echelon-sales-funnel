import mysql from 'mysql2/promise';
import type { DatabaseConfig } from '@/types/db.interface';
import type { DatabaseConnection } from '@/types/db.interface';



export class MySQLDatabase implements DatabaseConnection {
  private pool: mysql.Pool;

  constructor(config: DatabaseConfig) {
    this.pool = mysql.createPool(config);
  }

  async query(sql: string, values: any[] = []): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const [results] = await connection.execute(sql, values);
      return results;
    } finally {
      connection.release();
    }
  }

  async getConnection(): Promise<any> {
    return this.pool.getConnection();
  }

  async end(): Promise<void> {
    await this.pool.end();
  }
}
