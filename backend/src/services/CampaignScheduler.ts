import schedule from 'node-schedule';
import { EmailCampaignService } from './EmailCampaignService';

/**
 * CampaignScheduler
 * Handles scheduling and execution of email campaigns at specific times
 * Runs a job every minute to check for campaigns that need to be sent
 */
export class CampaignScheduler {
  private scheduler: schedule.Job | null = null;
  private isRunning: boolean = false;

  constructor(private campaignService: EmailCampaignService) {}

  /**
   * Start the campaign scheduler
   * Checks for scheduled campaigns every minute
   */
  public start(): void {
    if (this.isRunning) {
      console.warn('Campaign scheduler is already running');
      return;
    }

    // Schedule job to run every minute
    // Pattern: '0 * * * * *' means every minute at the 0th second
    this.scheduler = schedule.scheduleJob('0 * * * * *', async () => {
      await this.checkAndSendScheduledCampaigns();
    });

    this.isRunning = true;
    console.log('Campaign scheduler started - will check every minute for scheduled campaigns');
  }

  /**
   * Stop the campaign scheduler
   */
  public stop(): void {
    if (this.scheduler) {
      this.scheduler.cancel();
      this.isRunning = false;
      console.log('Campaign scheduler stopped');
    }
  }

  /**
   * Check and send all campaigns that are scheduled for the current time or earlier
   * This method is called periodically by the scheduler
   */
  private async checkAndSendScheduledCampaigns(): Promise<void> {
    try {
      const startTime = new Date();
      
    //  console.log(`[${startTime.toISOString()}] Checking for scheduled campaigns to send...`);
      
      // Process all scheduled campaigns that are due
      await this.campaignService.processScheduledCampaigns();
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
    ///  console.log(`[${endTime.toISOString()}] Campaign check completed in ${duration}ms`);
    } catch (error) {
      console.error('Error checking scheduled campaigns:', error);
    }
  }

  /**
   * Manually trigger campaign check (for immediate testing or manual intervention)
   */
  public async triggerImmediately(): Promise<void> {
    console.log('Manually triggering campaign scheduler...');
    await this.checkAndSendScheduledCampaigns();
  }

  /**
   * Get scheduler status
   */
  public getStatus(): { isRunning: boolean; nextRun: Date | null } {
    return {
      isRunning: this.isRunning,
      nextRun: this.scheduler?.nextInvocation() || null
    };
  }
}
