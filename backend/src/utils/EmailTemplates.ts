export class EmailTemplates {
  static getPromoEmailTemplate(leadName: string, promoTitle: string, promoDescription: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .promo-section {
              background-color: #f0f4ff;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .cta-button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .cta-button:hover {
              background-color: #764ba2;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Special Offer Just For You</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${this.escapeHtml(leadName)}</strong>,</p>
              
              <p>We hope you're enjoying being part of our Lead Collector community! We have something special for you today.</p>
              
              <div class="promo-section">
                <h2 style="margin-top: 0; color: #667eea;">${this.escapeHtml(promoTitle)}</h2>
                <p>${this.escapeHtml(promoDescription)}</p>
              </div>
              
              <p>This exclusive offer is available for a limited time only. Don't miss out on this opportunity to get the most out of our service.</p>
              
              <center>
                <a href="https://leadcollector.com/promo" class="cta-button">Learn More</a>
              </center>
              
              <p>If you have any questions or need assistance, feel free to reach out to our team. We're always here to help!</p>
              
              <p>Best regards,<br>
              <strong>The Lead Collector Team</strong></p>
              
              <div class="footer">
                <p>© 2024 Lead Collector. All rights reserved.</p>
                <p>You're receiving this email because you're a valued member of our community.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static getWelcomeEmailTemplate(leadName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .feature-list {
              list-style: none;
              padding: 0;
            }
            .feature-list li {
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .feature-list li:before {
              content: "✓ ";
              color: #667eea;
              font-weight: bold;
              margin-right: 10px;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Lead Collector! 👋</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${this.escapeHtml(leadName)}</strong>,</p>
              
              <p>Thank you for joining Lead Collector! We're excited to have you as part of our community.</p>
              
              <p><strong>Here's what you can do with your account:</strong></p>
              <ul class="feature-list">
                <li>Collect and manage leads efficiently</li>
                <li>View all your leads in an organized dashboard</li>
                <li>Export your leads data to CSV</li>
                <li>Track lead information securely</li>
              </ul>
              
              <p>Getting started is easy. Log in to your dashboard and start collecting leads right away.</p>
              
              <p>If you need any help or have questions, our support team is always here to assist you.</p>
              
              <p>Best regards,<br>
              <strong>The Lead Collector Team</strong></p>
              
              <div class="footer">
                <p>© 2024 Lead Collector. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
