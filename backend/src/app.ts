import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import {  MySQLDatabase} from './database';
import { DatabaseInitializer } from './database/initializer';
import { LeadRepository } from './repositories/LeadRepository';
import { LeadService } from './services/LeadService';
import { LeadController} from './controllers/LeadController';
import { EmailService } from './services/EmailService';
import { EmailQueue } from './services/EmailQueue';
import { EmailController } from './controllers/EmailController';
import { UserRepository } from './repositories/UserRepository';
import { AuthService } from './services/AuthService';
import { AuthController } from './controllers/AuthController';
import { errorHandler } from './middleware/errorHandler';
import { createLeadRoutes } from './routes/leads.http.routes';
import {createAuthRoutes} from './routes/aut.http.route';
import { createEmailRoutes } from './routes/email.http.routes';
import { EmailCampaignService } from './services/EmailCampaignService';
import { EmailCampaignController } from './controllers/EmailCampaignController';
import { CampaignScheduler } from './services/CampaignScheduler';
import { createCampaignRoutes } from './routes/campaigns.http.routes';
import { AssetRepository } from './repositories/AssetRepository';
import { AssetService } from './services/AssetService';
import { AssetController } from './controllers/AssetController';
import { createAssetRoutes } from './routes/assets.http.routes';
import { createAssetStorageProvider } from './services/storage/AssetStorageFactory';
import { AppConfig } from '@/types/app.interfce';
import { DatabaseConnection } from '@/types/db.interface';

export class Application {
  private app: Express;
  private db: DatabaseConnection;
  private config: AppConfig;
  private emailService?: EmailService;
  private emailQueue?: EmailQueue;
  private campaignScheduler?: CampaignScheduler;
  private slates = new Map<string, Application>();

  constructor(config: AppConfig) {
    this.config = config;
    this.app = express();
    this.db = new MySQLDatabase(config.database);
  }

  public setupMiddleware(): void {
    this.app.disable('x-powered-by');
    this.app.set('trust proxy', 1); // Trust first proxy for rate limiting and secure cookies

    // CORS must come before helmet so its headers aren't overridden
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
      .split(',')
      .map((o) => o.trim());

    const corsOptions: cors.CorsOptions = {
      origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 204,
    };

    // Handle preflight for all routes
    this.app.options('*', cors(corsOptions));
    this.app.use(cors(corsOptions));

    // Security middleware — allow cross-origin resource loading so CORP doesn't
    // block the cross-origin fetch that CORS already permits
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    
    // Cookie parser
    this.app.use(cookieParser());
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimitWindowMs,
      max: this.config.rateLimitMaxRequests,
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Serve uploaded files for local storage mode.
    this.app.use('/campain-app/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
  }

  public addSubApp(name: string, app: Application): void {
    this.slates.set(name, app);
  }

  public setupRoutes(): void {

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Auth routes
    const userRepository = new UserRepository(this.db);
    const authConfig = {
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      jwtExpiration: process.env.JWT_EXPIRATION || '24h',
      cookieName: 'authToken',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    };
     this.app.use('/campain-app/api/v1/health', (req, res)=>{
       res.status(200).json({
         success: true,
         message: 'Health check passed'
       })
     } );
    const authService = new AuthService(userRepository, authConfig, this.emailService);
    const authController = new AuthController(authService);
    const authRoutes = createAuthRoutes(authController);
    this.app.use('/campain-app/api/v1', authRoutes);

    // Lead routes
    const leadRepository = new LeadRepository(this.db);
    const leadService = new LeadService(leadRepository);
    const leadController = new LeadController(leadService);
    const leadRoutes = createLeadRoutes(leadController);

    this.app.use('/campain-app/api/v1', leadRoutes);

    // Email routes
    if (this.emailService && this.emailQueue) {
      const emailController = new EmailController(this.db, this.emailQueue);
      const emailRoutes = createEmailRoutes(emailController);
      this.app.use('/campain-app/api/v1/email', emailRoutes);
    }

    // Campaign routes
    if (this.emailService) {
      const campaignService = new EmailCampaignService(this.emailService, this.db);
      const campaignController = new EmailCampaignController(campaignService);
      const campaignRoutes = createCampaignRoutes(campaignController);
      this.app.use('/campain-app/api/v1', campaignRoutes);

      // Initialize campaign scheduler
      this.campaignScheduler = new CampaignScheduler(campaignService);
    }

    // Asset routes
    const assetRepository = new AssetRepository(this.db);
    const assetStorageProvider = createAssetStorageProvider();
    const assetService = new AssetService(assetRepository, assetStorageProvider, this.emailService);
    const assetController = new AssetController(assetService);
    const assetRoutes = createAssetRoutes(assetController);
    this.app.use('/campain-app/api/v1', assetRoutes);

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }

  public setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async initializeEmailServices(): Promise<void> {
    try {
      this.emailService = new EmailService(this.config.email);
      this.emailQueue = new EmailQueue(this.config.queue, this.emailService);
      const connected = await this.emailService.verifyConnection();
      if (connected) {
        console.log('Email service initialized successfully');
      } else {
        console.warn('Email service connection verification failed, but service will continue');
      }
    } catch (error) {
     
      console.warn('Continuing without email services');
    }
  }

  public getExpressApp(): Express {
    return this.app;
  }

  public async start(): Promise<void> {
    // Initialize database schema and seed data
    const initializer = new DatabaseInitializer(this.db);
    await initializer.initialize();

    await this.initializeEmailServices();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();

    // Start campaign scheduler if available
    if (this.campaignScheduler) {
      this.campaignScheduler.start();
    }

    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        console.log(`Server running on port ${this.config.port} in ${this.config.nodeEnv} mode`);
        resolve();
      });
    });
  }

  public async close(): Promise<void> {
    // Stop campaign scheduler if running
    if (this.campaignScheduler) {
      this.campaignScheduler.stop();
    }

    await this.db.end();
  }
}
