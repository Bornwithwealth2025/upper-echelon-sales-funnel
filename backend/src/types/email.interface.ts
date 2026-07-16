export interface EmailConfig {
  host: string;
  user: string;
  password: string;
  from: string;
  fromName: string;
  port: number;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    contentType?: string;
    path?: string;
    content?: Buffer;
  }>;
}

export interface IEmailService {
  sendEmail(payload: EmailPayload): Promise<boolean>;
  sendBulkEmails(payloads: EmailPayload[]): Promise<{ sent: number; failed: number }>;
}
