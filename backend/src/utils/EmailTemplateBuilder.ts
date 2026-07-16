export class EmailTemplateBuilder {
  // Promotional Template - Perfect for product launches and special offers
  static promotionalTemplate(
    companyName: string,
    headline: string,
    description: string,
    imageUrl: string,
    ctaText: string,
    ctaLink: string,
    discount?: string
  ): string {
    const discountBadge = discount ? `
      <div style="background-color: #ff4757; color: white; padding: 10px; border-radius: 50%; 
                  display: inline-block; font-weight: bold; font-size: 18px; margin-bottom: 15px;">
        ${discount}% OFF
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headline}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; line-height: 1.6; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: white; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { font-size: 28px; margin-bottom: 10px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .hero-image { width: 100%; height: auto; display: block; }
          .content { padding: 40px 30px; }
          .discount-badge { background-color: #ff4757; color: white; padding: 12px 24px; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 20px; margin-bottom: 25px; }
          .main-headline { font-size: 32px; color: #333; margin-bottom: 15px; font-weight: bold; }
          .description { font-size: 16px; color: #666; line-height: 1.8; margin-bottom: 30px; }
          .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px; transition: transform 0.3s; }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
          .features { background-color: #f9f9f9; padding: 30px; margin: 30px 0; border-radius: 8px; }
          .feature-item { display: inline-block; width: 48%; margin-right: 4%; margin-bottom: 20px; vertical-align: top; }
          .feature-item:nth-child(2n) { margin-right: 0; }
          .feature-item h3 { color: #667eea; margin-bottom: 8px; }
          .feature-item p { font-size: 14px; color: #666; }
          .divider { height: 2px; background: linear-gradient(to right, transparent, #667eea, transparent); margin: 30px 0; }
          .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 12px; }
          .footer a { color: #667eea; text-decoration: none; }
          .social-links { margin: 20px 0; }
          .social-links a { display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; }
          @media only screen and (max-width: 600px) {
            .content { padding: 20px 15px; }
            .main-headline { font-size: 24px; }
            .feature-item { width: 100%; margin-right: 0; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>${headline}</h1>
            <p>Exclusive Offer Just For You</p>
          </div>
          
          ${imageUrl ? `<img src="${imageUrl}" alt="${headline}" class="hero-image" style="width: 100%; height: auto;">` : ''}
          
          <div class="content">
            ${discountBadge}
            
            <h2 class="main-headline">${headline}</h2>
            
            <p class="description">${description}</p>
            
            <a href="${ctaLink}" class="cta-button">${ctaText}</a>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #666; text-align: center;">
              <p style="margin-bottom: 10px;">✓ Limited Time Offer</p>
              <p style="margin-bottom: 10px;">✓ Free Shipping on Orders</p>
              <p>✓ 30-Day Money Back Guarantee</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p style="margin-top: 15px; opacity: 0.8;">© 2026 ${companyName}. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="#">Privacy Policy</a> | 
              <a href="#">Unsubscribe</a> | 
              <a href="#">Contact Us</a>
            </p>
            <div class="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Newsletter Template - Perfect for regular updates and news
  static newsletterTemplate(
    companyName: string,
    issueTitle: string,
    articles: Array<{ title: string; excerpt: string; link: string; imageUrl?: string }>,
    imageUrl?: string
  ): string {
    const articlesHtml = articles.map((article, idx) => `
      <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 25px;">
        <div style="display: flex; gap: 15px; align-items: flex-start;">
          ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.title}" style="width: 120px; height: 120px; border-radius: 8px; object-fit: cover; flex-shrink: 0;">` : ''}
          <div>
            <h3 style="color: #333; margin-bottom: 8px; font-size: 18px;">${article.title}</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">${article.excerpt}</p>
            <a href="${article.link}" style="color: #667eea; text-decoration: none; font-weight: bold;">Read More →</a>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${issueTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6; }
          .email-container { max-width: 700px; margin: 0 auto; background-color: white; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 32px; margin-bottom: 5px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .hero-image { width: 100%; height: auto; display: block; }
          .content { padding: 40px 30px; }
          .issue-title { font-size: 24px; color: #333; margin-bottom: 30px; font-weight: bold; border-bottom: 3px solid #667eea; padding-bottom: 15px; }
          .article { margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #eee; }
          .article:last-child { border-bottom: none; }
          .article h3 { color: #333; margin-bottom: 8px; font-size: 18px; }
          .article p { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
          .article a { color: #667eea; text-decoration: none; font-weight: bold; }
          .featured-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center; }
          .featured-box h3 { margin-bottom: 10px; }
          .featured-box p { opacity: 0.9; margin-bottom: 15px; }
          .featured-box a { background: white; color: #667eea; padding: 10px 25px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; }
          .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 12px; }
          .footer a { color: #667eea; text-decoration: none; }
          @media only screen and (max-width: 600px) {
            .content { padding: 20px 15px; }
            .issue-title { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📰 ${issueTitle}</h1>
            <p>Your Monthly Update</p>
          </div>
          
          ${imageUrl ? `<img src="${imageUrl}" alt="${issueTitle}" class="hero-image" style="width: 100%; height: auto;">` : ''}
          
          <div class="content">
            <h2 class="issue-title">Latest News & Updates</h2>
            
            ${articlesHtml}
            
            <div class="featured-box">
              <h3>📌 Featured Highlight</h3>
              <p>Stay tuned for our upcoming exclusive content and special offers!</p>
              <a href="#">Explore More</a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p style="margin-top: 12px; opacity: 0.8;">© 2026 ${companyName}. All rights reserved.</p>
            <p style="margin-top: 8px;">
              <a href="#">Privacy Policy</a> | 
              <a href="#">Unsubscribe</a> | 
              <a href="#">Preferences</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Product Launch Template
  static productTemplate(
    productName: string,
    productDescription: string,
    features: string[],
    imageUrl: string,
    price: string,
    ctaLink: string
  ): string {
    const featuresHtml = features.map(feature => `
      <li style="padding: 8px 0; color: #555; font-size: 14px;">
        <span style="color: #667eea; font-weight: bold;">✓</span> ${feature}
      </li>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${productName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .email-container { max-width: 600px; margin: 0 auto; background-color: white; overflow: hidden; }
          .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
          .hero h1 { font-size: 36px; margin-bottom: 10px; }
          .hero p { font-size: 16px; opacity: 0.9; }
          .hero-image { width: 100%; height: auto; }
          .content { padding: 40px 30px; }
          .product-highlight { background: #f9f9f9; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
          .price { font-size: 48px; color: #667eea; font-weight: bold; margin: 15px 0; }
          .old-price { text-decoration: line-through; color: #999; font-size: 28px; }
          .features-list { list-style: none; margin: 25px 0; }
          .features-list li { padding: 10px 0; padding-left: 30px; position: relative; }
          .features-list li::before { content: "✓"; position: absolute; left: 0; color: #667eea; font-weight: bold; }
          .cta-section { text-align: center; margin: 30px 0; }
          .cta-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 50px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; }
          .specs { background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 25px 0; font-size: 14px; }
          .specs p { margin-bottom: 8px; }
          .guarantee { text-align: center; padding: 20px; background: #e8f5e9; border-radius: 8px; color: #2e7d32; }
          .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 12px; }
          @media only screen and (max-width: 600px) {
            .hero h1 { font-size: 28px; }
            .price { font-size: 36px; }
            .content { padding: 20px 15px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="hero">
            <h1>🎉 Introducing ${productName}</h1>
            <p>The Future Is Here</p>
          </div>
          
          <img src="${imageUrl}" alt="${productName}" class="hero-image" style="width: 100%; height: auto;">
          
          <div class="content">
            <div class="product-highlight">
              <p style="color: #666; margin-bottom: 15px;">${productDescription}</p>
              <div class="price">${price}</div>
              <p style="color: #999; margin-bottom: 15px;">Limited Launch Price</p>
            </div>
            
            <h3 style="color: #333; margin-bottom: 15px; font-size: 20px;">✨ Key Features:</h3>
            <ul class="features-list">
              ${featuresHtml}
            </ul>
            
            <div class="cta-section">
              <a href="${ctaLink}" class="cta-button">Get It Now</a>
            </div>
            
            <div class="guarantee">
              <strong>🛡️ 100% Satisfaction Guaranteed</strong>
              <p style="margin-top: 8px; font-size: 12px;">30-day money-back guarantee. No questions asked.</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Innovation Labs</strong></p>
            <p style="margin-top: 12px; opacity: 0.8;">© 2026 All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Event Invitation Template
  static eventTemplate(
    eventName: string,
    eventDate: string,
    eventTime: string,
    location: string,
    description: string,
    imageUrl: string,
    ctaLink: string
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: white; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px 30px; text-align: center; color: white; }
          .header h1 { font-size: 36px; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
          .event-image { width: 100%; height: auto; }
          .content { padding: 40px 30px; }
          .event-details { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
          .detail-item { display: flex; align-items: center; margin-bottom: 15px; font-size: 16px; }
          .detail-item:last-child { margin-bottom: 0; }
          .detail-icon { font-size: 24px; margin-right: 15px; }
          .description { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 25px; }
          .agenda { background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 25px 0; }
          .agenda h3 { color: #333; margin-bottom: 15px; }
          .agenda-item { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .agenda-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .agenda-time { color: #f5576c; font-weight: bold; font-size: 14px; }
          .agenda-title { color: #333; margin-top: 5px; }
          .cta-button { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px; margin: 30px 0; }
          .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; font-size: 12px; }
          @media only screen and (max-width: 600px) {
            .header h1 { font-size: 28px; }
            .content { padding: 20px 15px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎊 ${eventName}</h1>
            <p>You're Invited!</p>
          </div>
          
          <img src="${imageUrl}" alt="${eventName}" class="event-image" style="width: 100%; height: auto;">
          
          <div class="content">
            <div class="event-details">
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>${eventDate}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🕐</span>
                <span>${eventTime}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span>${location}</span>
              </div>
            </div>
            
            <p class="description">${description}</p>
            
            <div style="text-align: center;">
              <a href="${ctaLink}" class="cta-button">Register Now</a>
            </div>
            
            <div class="agenda">
              <h3>✨ What to Expect</h3>
              <div class="agenda-item">
                <div class="agenda-time">09:00 AM - 09:30 AM</div>
                <div class="agenda-title">Welcome & Registration</div>
              </div>
              <div class="agenda-item">
                <div class="agenda-time">09:30 AM - 11:00 AM</div>
                <div class="agenda-title">Keynote & Presentations</div>
              </div>
              <div class="agenda-item">
                <div class="agenda-time">11:00 AM - 12:00 PM</div>
                <div class="agenda-title">Networking & Q&A</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Event Management</strong></p>
            <p style="margin-top: 12px; opacity: 0.8;">© 2026 All rights reserved. | <a href="#" style="color: #667eea;">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
