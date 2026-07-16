export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

export interface DatabaseConnection {
  query(sql: string, values?: any[]): Promise<any>;
  getConnection(): Promise<any>;
  end(): Promise<void>;
}
