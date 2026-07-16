import axios, { AxiosInstance } from 'axios';

export interface Lead {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  additionalInfo?: string;
  markerId?: string;
  marketingCategory?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  timezone?: string | null;
  leadVolume?: string | null;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: string;
  createdAt: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  companyName?: string;
  industry?: string;
  country?: string;
  timezone?: string;
  leadVolume?: string;
}

export interface CampaignPayload {
  name: string;
  subject: string;
  templateType: 'promotional' | 'newsletter' | 'product' | 'event' | 'custom';
  content: string;
  imageUrl?: string;
  scheduleFor?: Date | string;
}

export interface Campaign {
  id?: number;
  campaignId: string;
  name: string;
  subject: string;
  templateType: string;
  content: string;
  imageUrl?: string;
  scheduledAt?: string;
  status: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  sentAt?: string;
  updatedAt?: string;
}

export type AssetTag = 'emailable' | 'downloadable' | 'playable';

export interface Asset {
  id?: number;
  assetId: string;
  name: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  tags: AssetTag[];
  storageProvider: 'local' | 's3';
  storageKey: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4050/campain-app/api/v1';
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password
    });
    return response.data;
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post<ApiResponse<{ user: User; token: string }>>('/auth/register', payload);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ resetToken?: string }>> {
    const response = await this.client.post<ApiResponse<{ resetToken?: string }>>('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  // Lead endpoints
  async saveLead(lead: Lead): Promise<ApiResponse<{ id: number; success: boolean }>> {
    const response = await this.client.post<ApiResponse<{ id: number; success: boolean }>>('/save-led', lead);
    return response.data;
  }

  async getLeads(): Promise<ApiResponse<Lead[]>> {
    const response = await this.client.get<ApiResponse<Lead[]>>('/get-led');
    return response.data;
  }

  async getLeadById(id: number): Promise<ApiResponse<Lead>> {
    const response = await this.client.get<ApiResponse<Lead>>(`/get-led/${id}`);
    return response.data;
  }

  async updateLead(id: number, lead: Lead): Promise<ApiResponse<void>> {
    const response = await this.client.put<ApiResponse<void>>(`/update-led/${id}`, lead);
    return response.data;
  }

  async deleteLead(id: number): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/delete-led/${id}`);
    return response.data;
  }

  // Campaign endpoints
  async createCampaign(payload: CampaignPayload): Promise<ApiResponse<{ id: number }>> {
    const response = await this.client.post<ApiResponse<{ id: number }>>('/campaigns', payload);
    return response.data;
  }

  async getCampaigns(): Promise<ApiResponse<Campaign[]>> {
    const response = await this.client.get<ApiResponse<Campaign[]>>('/campaigns');
    return response.data;
  }

  async getCampaignStats(): Promise<ApiResponse<{ totalCampaigns: number; sentCampaigns: number; scheduledCampaigns: number; totalEmailsSent: number }>> {
    const response = await this.client.get<ApiResponse<{ totalCampaigns: number; sentCampaigns: number; scheduledCampaigns: number; totalEmailsSent: number }>>('/campaigns/stats');
    return response.data;
  }

  async sendCampaignNow(id: string): Promise<ApiResponse<{ sent: number; failed: number }>> {
    const response = await this.client.post<ApiResponse<{ sent: number; failed: number }>>(`/campaigns/${id}/send`);
    return response.data;
  }

  async getCampaignById(id: string): Promise<ApiResponse<Campaign>> {
    const response = await this.client.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
    return response.data;
  }

  async updateCampaign(id: string, payload: Partial<CampaignPayload>): Promise<ApiResponse<void>> {
    const response = await this.client.put<ApiResponse<void>>(`/campaigns/${id}`, payload);
    return response.data;
  }

  async deleteCampaign(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/campaigns/${id}`);
    return response.data;
  }

  // Asset endpoints
  async uploadAsset(formData: FormData): Promise<ApiResponse<Asset>> {
    const response = await this.client.post<ApiResponse<Asset>>('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getAssets(): Promise<ApiResponse<Asset[]>> {
    const response = await this.client.get<ApiResponse<Asset[]>>('/assets');
    return response.data;
  }

  async getAssetById(assetId: string): Promise<ApiResponse<Asset>> {
    const response = await this.client.get<ApiResponse<Asset>>(`/assets/${assetId}`);
    return response.data;
  }

  async updateAsset(assetId: string, payload: Partial<Pick<Asset, 'name' | 'tags' | 'thumbnailUrl'>>): Promise<ApiResponse<Asset>> {
    const response = await this.client.put<ApiResponse<Asset>>(`/assets/${assetId}`, payload);
    return response.data;
  }

  async deleteAsset(assetId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/assets/${assetId}`);
    return response.data;
  }

  async emailAsset(assetId: string, payload: { email: string; fullName?: string }): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(`/assets/${assetId}/email`, payload);
    return response.data;
  }

  getAssetDownloadUrl(assetId: string): string {
    return `${this.client.defaults.baseURL}/assets/${assetId}/download`;
  }

  resolveAssetUrl(url?: string | null): string {
    if (!url) {
      return '';
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const baseURL = String(this.client.defaults.baseURL || '');
    const apiOrigin = baseURL.includes('://') ? new URL(baseURL).origin : '';
    if (!apiOrigin) {
      return url;
    }

    if (url.startsWith('/')) {
      return `${apiOrigin}${url}`;
    }

    return `${apiOrigin}/${url}`;
  }
}


export default new ApiService();
