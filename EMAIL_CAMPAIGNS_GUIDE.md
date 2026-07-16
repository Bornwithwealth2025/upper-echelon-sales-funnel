# Email Campaign Management System

## Overview

The Email Campaign Management System enables you to create, schedule, and send beautiful, professional email campaigns to all your collected leads. With pre-built templates and powerful customization options, you can launch sophisticated marketing campaigns in minutes.

## Features

### 1. **Pre-built Email Templates**
- **Promotional**: Perfect for sales, special offers, and discounts
- **Newsletter**: For regular updates and news
- **Product**: Ideal for product launches and announcements
- **Event**: Customized invitations with event details
- **Custom**: Upload or paste your own HTML

### 2. **Campaign Scheduling**
- **Send Immediately**: Launch campaigns right away
- **Scheduled Send**: Pick a date and time for future delivery

### 3. **Beautiful Email Design**
- Fully responsive HTML templates
- Professional gradient headers
- High-quality image support
- Call-to-action buttons with tracking
- Mobile-optimized layouts

### 4. **Lead Management**
- Automatically sends to all collected leads
- Filters for valid email addresses
- Batch sending (10 emails at a time to prevent overload)
- Success/failure tracking

### 5. **Campaign Analytics**
- Total campaigns created
- Sent vs scheduled vs draft campaigns
- Total emails sent across all campaigns
- Individual campaign performance metrics

## Getting Started

### Step 1: Navigate to Campaigns
From the Dashboard, click the **📧 Campaigns** button in the top navigation.

### Step 2: Create a New Campaign
Click **✨ Create Campaign** to start building your email.

### Step 3: Fill in Campaign Details
1. **Campaign Name**: Give your campaign a unique name
2. **Email Subject**: Write an compelling subject line
3. **Select Template Type**: Choose from Promotional, Newsletter, Product, or Event

### Step 4: Customize Your Template
Fill in template-specific options:

#### Promotional Template
- Company Name
- Headline
- Description
- Image URL
- CTA Button Text
- CTA Link (where the button goes)
- Discount % (optional)

#### Newsletter Template
- Company Name
- Newsletter Title
- Header Image URL
- Add articles with titles, excerpts, and links

#### Product Template
- Product Name
- Product Description
- Product Image URL
- Price
- Features (list of key benefits)
- CTA Link

#### Event Template
- Event Name
- Event Date
- Event Time
- Location
- Description
- Event Image URL
- Registration Link

### Step 5: Preview Your Email
Click **Generate Template** to see how your email will look.
- Use the preview iframe to see desktop and mobile rendering
- Scroll through to verify all content

### Step 6: (Optional) Schedule Your Campaign
- Toggle **"Send at a specific date and time"**
- Select a date and time for automatic delivery
- Leave unchecked to send immediately

### Step 7: Send or Schedule
- Click **Edit Template** to make changes
- Click **✓ Create Campaign** to finalize

## Template Details

### Promotional Template
Beautiful gradient header with discount badge, product image, description, and call-to-action button.

**Best For:**
- Black Friday/Cyber Monday sales
- Flash sales and limited-time offers
- Product promotions
- Seasonal discounts

**Example:**
```
Company: ABC Store
Headline: Black Friday Special - 50% Off
Description: This Friday only, get half off everything
Image: store-banner.jpg
CTA: Shop Now
Link: https://yoursite.com/sale
Discount: 50
```

### Newsletter Template
Modern newsletter layout with multiple article cards, featured highlight section, and company branding.

**Best For:**
- Monthly newsletters
- Industry news roundups
- Blog updates
- Company announcements

**Example:**
```
Company: Tech Today
Title: November 2024 Newsletter
Articles:
  1. "New AI Trends" - Read about the latest AI
  2. "Market Update" - Monthly industry analysis
  3. "Company News" - Updates from our team
```

### Product Template
Stunning product showcase with pricing, features list, and satisfaction guarantee.

**Best For:**
- Product launches
- New product announcements
- Product updates
- Exclusive product offers

**Example:**
```
Product: ProCam 5000
Description: Revolutionary 8K camera
Image: camera.jpg
Price: $1,299
Features:
  - 8K recording at 60fps
  - AI-powered stabilization
  - 100-hour battery
CTA: Pre-order Now
```

### Event Template
Eye-catching event invitation with date, time, location, and agenda.

**Best For:**
- Webinars
- Virtual conferences
- In-person events
- Product launches
- Networking events

**Example:**
```
Event: TechConnect 2024
Date: December 15, 2024
Time: 10:00 AM
Location: Convention Center, NYC
Description: Join industry leaders for a day of learning
Image: event-banner.jpg
```

## Campaign Management

### View All Campaigns
The Campaigns page shows:
- **Campaign Name**: Custom title you created
- **Template Type**: Promotional, Newsletter, etc.
- **Status**: Draft, Scheduled, Sent, or Failed
- **Recipients**: Number of leads to be sent
- **Sent/Failed**: Success and failure count
- **Created**: Date created
- **Actions**: Send, View, Delete buttons

### Campaign Status Badges
- **Draft** (Gray): Pending, not yet scheduled or sent
- **Scheduled** (Blue): Will be sent at scheduled time
- **Sent** (Green): Successfully sent to all leads
- **Failed** (Red): Error occurred during sending

### Actions

#### Send Campaign
Click the **Send** button to send immediately:
1. Confirmation dialog appears
2. Campaign emails all leads with valid emails
3. Success/failure counts displayed
4. Status updates to "Sent"

#### View Campaign
Click **View** to see campaign details and performance.

#### Delete Campaign
Click **Delete** to remove (only available for draft/scheduled campaigns):
1. Cannot delete sent campaigns
2. Confirmation required
3. Permanently removes from system

## Statistics Dashboard

### Campaign Metrics
- **Total Campaigns**: All campaigns created
- **Sent**: Campaigns successfully delivered
- **Scheduled**: Waiting to be sent at future time
- **Total Emails**: Cumulative emails sent across all campaigns

## Advanced Features

### Batch Sending
- Emails sent in batches of 10
- Prevents email service overload
- Automatic retry on failure
- Real-time success/failure tracking

### Scheduled Campaigns
- Uses server time for scheduling
- Automatic processing every minute
- Failed scheduled campaigns marked as "failed"
- Can be manually sent immediately

### Image Hosting
Use images from:
- Your website: `https://yoursite.com/image.jpg`
- CDN: `https://cdn.example.com/image.jpg`
- Free hosting: Unsplash, Pexels, Pixabay links

### Mobile Optimization
All templates are fully responsive:
- Desktop: 600px width
- Tablet: Adapts to screen size
- Mobile: Stacks vertically for readability
- Touch-friendly buttons and links

## Best Practices

### Subject Lines
- Keep under 50 characters for mobile
- Be specific and benefit-focused
- Avoid spam trigger words
- Include urgency when appropriate

**Good Examples:**
- "🎉 Exclusive 50% Off - Today Only"
- "December Newsletter: Industry Trends"
- "New Product Launch: ProCam 5000"
- "You're Invited: TechConnect 2024"

### Email Content
- Keep content focused and scannable
- Use clear call-to-action buttons
- Include company branding
- Add unsubscribe option (automatically included)

### Images
- Use high-quality, relevant images
- Include alt text descriptions
- Keep file sizes reasonable (< 500KB)
- Use descriptive file names

### Testing
1. Create a test campaign
2. Send to yourself first
3. Test on multiple devices
4. Check links work properly
5. Verify email address formatting

### Timing
**Best times to send:**
- Tuesday-Thursday: 10 AM - 2 PM
- Avoid holidays and weekends
- Avoid early morning or late night
- Consider timezone differences

## API Reference

### Campaign Endpoints

#### Create Campaign
```
POST /api/v1/campaigns
Content-Type: application/json

{
  "name": "Black Friday Sale",
  "subject": "🎉 Limited Time: 50% Off Everything!",
  "templateType": "promotional",
  "content": "<html>...</html>",
  "imageUrl": "https://example.com/image.jpg",
  "scheduleFor": "2024-12-01T10:00:00Z"  // optional
}
```

#### Get All Campaigns
```
GET /api/v1/campaigns?limit=50&offset=0
```

#### Get Campaign By ID
```
GET /api/v1/campaigns/:id
```

#### Update Campaign
```
PUT /api/v1/campaigns/:id
Content-Type: application/json

{
  "name": "Updated Campaign Name",
  "subject": "New subject",
  "content": "<html>...</html>"
}
```

#### Send Campaign Now
```
POST /api/v1/campaigns/:id/send
```

Response:
```json
{
  "success": true,
  "message": "Campaign sent successfully",
  "data": {
    "sent": 45,
    "failed": 2
  }
}
```

#### Delete Campaign
```
DELETE /api/v1/campaigns/:id
```

#### Get Campaigns Stats
```
GET /api/v1/campaigns/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalCampaigns": 12,
    "sentCampaigns": 8,
    "scheduledCampaigns": 2,
    "totalEmailsSent": 450
  }
}
```

## Database Schema

### email_campaigns Table
```sql
CREATE TABLE email_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  templateType ENUM('promotional', 'newsletter', 'product', 'event', 'custom'),
  content LONGTEXT NOT NULL,
  imageUrl VARCHAR(500),
  scheduledAt DATETIME,
  sentAt DATETIME,
  status ENUM('draft', 'scheduled', 'sent', 'failed'),
  recipientCount INT DEFAULT 0,
  sentCount INT DEFAULT 0,
  failedCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## Troubleshooting

### Campaign Won't Send
**Problem:** "No valid email addresses found"
- **Solution:** Ensure leads have valid email addresses
- Check that email field is not empty
- Verify email format (should contain @)

### Images Not Showing
**Problem:** Images appear broken in preview
- **Solution:** Check image URL is publicly accessible
- Verify CORS is enabled on image host
- Use HTTPS URLs when possible
- Test URL directly in browser

### Scheduled Campaign Not Sending
**Problem:** Campaign shows as scheduled but not sent
- **Solution:** Check server logs
- Verify scheduled time is in the future
- Server must be running at scheduled time
- Consider timezone settings

### All Emails Failed
**Problem:** All emails show as failed
- **Solution:** Check email service credentials in .env
- Verify email provider isn't blocking sends
- Check rate limits haven't been exceeded
- Review error logs for specific error

## Performance Notes

### Email Volume
- Recommended: 100-500 leads per campaign
- Maximum:** 10,000 leads per campaign
- Batch size: 10 emails simultaneously

### Limits
- Subject line: 255 characters
- Campaign name: 255 characters
- Image URL: 500 characters
- HTML content: 16MB maximum

### Scheduled Campaigns
- Minimum: 1 minute in future
- Maximum: No limit
- Processing: Every 60 seconds
- Timezone: Server timezone (UTC recommended)

## Security

### Email Authentication
- From address validated
- Subject sanitized
- HTML content validated
- Images checked for malware

### Access Control
- Admin-only feature
- Session required
- CSRF protection enabled
- Rate limiting applied

### Data Protection
- Passwords hashed with bcryptjs
- Emails transmitted securely via TLS
- Lead data encrypted at rest
- Campaign content logged securely

## Future Enhancements

Planned features for future releases:
- [ ] Email templates builder UI
- [ ] Drag-and-drop email editor
- [ ] Open rate tracking
- [ ] Click tracking on links
- [ ] A/B testing capability
- [ ] Lead segmentation
- [ ] Personalization tokens
- [ ] Unsubscribe management
- [ ] Campaign performance analytics
- [ ] Recurring campaigns
- [ ] Multi-language support

## Support & Documentation

For more information:
- Check the main README.md
- Review code comments
- Visit backend logs for detailed errors
- Check email service documentation

## License

This email campaign system is part of the Lead Page application.

---

**Last Updated:** December 2024
