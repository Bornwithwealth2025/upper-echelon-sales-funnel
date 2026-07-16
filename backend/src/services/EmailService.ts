import { EmailConfig, EmailPayload, IEmailService } from '@/types/email.interface';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';


export class EmailService implements IEmailService {
  private transporter: Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
     // service: config.service,
      host: config.host,
      port: config.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.password
      }
    });
  }

  async sendEmail(payload: EmailPayload): Promise<boolean> {
    try {
      const mailOptions: SendMailOptions = {
        from: `${this.config.fromName} <${this.config.from}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text || this.stripHtml(payload.html),
        attachments: payload.attachments
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${payload.to}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${payload.to}:`, error);
      return false;
    }
  }

  async sendBulkEmails(payloads: EmailPayload[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const payload of payloads) {
      const success = await this.sendEmail(payload);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }
}
