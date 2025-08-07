import axios, { AxiosInstance, AxiosError } from 'axios';
import { appConfig } from './config.js';
import { logger } from './logger.js';
import type { 
  SubUser, 
  SubUserUpdate, 
  WhitelistIP, 
  TrafficQuery, 
  TargetInfo, 
  EndpointGeneration,
  ApiResponse 
} from './types.js';

export class DecodoClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: appConfig.DECODO_BASE_URL,
      headers: {
        'Authorization': appConfig.DECODO_API_KEY,  // Direct API key, not Bearer token
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        const message = error.response?.data || error.message;
        logger.error(`API Error: ${status} ${error.config?.url} - ${message}`);
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: AxiosError): Error {
    const status = error.response?.status;
    const message = error.response?.data || error.message;
    return new Error(`Decodo API Error (${status}): ${message}`);
  }

  // Sub User Management
  async createSubUser(subUser: SubUser): Promise<ApiResponse> {
    const response = await this.client.post('/sub-users', subUser);
    return response.data;
  }

  async getSubUsers(): Promise<ApiResponse> {
    const response = await this.client.get('/sub-users');
    return response.data;
  }

  async getSubUser(id: string): Promise<ApiResponse> {
    const response = await this.client.get(`/sub-users/${id}`);
    return response.data;
  }

  async updateSubUser(id: string, updates: SubUserUpdate): Promise<ApiResponse> {
    const response = await this.client.put(`/sub-users/${id}`, updates);
    return response.data;
  }

  async deleteSubUser(id: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/sub-users/${id}`);
    return response.data;
  }

  async getSubUserTraffic(id: string, query?: TrafficQuery): Promise<ApiResponse> {
    const response = await this.client.get(`/sub-users/${id}/traffic`, { params: query });
    return response.data;
  }

  // Proxy Endpoint Management
  async getEndpoints(): Promise<ApiResponse> {
    const response = await this.client.get('/endpoints');
    return response.data;
  }

  async generateEndpoint(config?: EndpointGeneration): Promise<ApiResponse> {
    const response = await this.client.post('/endpoints/generate', config || {});
    return response.data;
  }

  async getTargetInfo(target: TargetInfo): Promise<ApiResponse> {
    const response = await this.client.post('/targets', target);
    return response.data;
  }

  // IP Whitelist Management
  async getWhitelist(): Promise<ApiResponse> {
    const response = await this.client.get('/whitelisted-ips');
    return response.data;
  }

  async addWhitelistIP(ipConfig: WhitelistIP): Promise<ApiResponse> {
    const response = await this.client.post('/whitelisted-ips', ipConfig);
    return response.data;
  }

  async removeWhitelistIP(ip: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/whitelisted-ips/${encodeURIComponent(ip)}`);
    return response.data;
  }

  // Analytics and Traffic
  async getTraffic(query?: TrafficQuery): Promise<ApiResponse> {
    const response = await this.client.get('/traffic', { params: query });
    return response.data;
  }

  async getSubscriptions(): Promise<ApiResponse> {
    const response = await this.client.get('/subscriptions');
    return response.data;
  }
}