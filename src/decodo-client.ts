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
        const data = error.response?.data;
        const message = typeof data === 'object' && data !== null ? JSON.stringify(data) : String(data) || error.message;
        logger.error(`API Error: ${status} ${error.config?.url} - ${message}`);
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: AxiosError): Error {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Properly serialize error data
    let message: string;
    if (typeof data === 'object' && data !== null) {
      message = JSON.stringify(data, null, 2);
    } else {
      message = String(data) || error.message;
    }
    
    return new Error(`Decodo API Error (${status}): ${message}`);
  }

  // Sub User Management
  async createSubUser(subUser: SubUser): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/sub-users
    const response = await this.client.post('/v2/sub-users', subUser);
    return response.data;
  }

  async getSubUsers(): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/sub-users
    const response = await this.client.get('/v2/sub-users');
    return response.data;
  }

  async getSubUser(id: string): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/sub-users/{id}
    const response = await this.client.get(`/v2/sub-users/${id}`);
    return response.data;
  }

  async updateSubUser(id: string, updates: SubUserUpdate): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/sub-users/{id}
    const response = await this.client.put(`/v2/sub-users/${id}`, updates);
    return response.data;
  }

  async deleteSubUser(id: string): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/sub-users/{id}
    const response = await this.client.delete(`/v2/sub-users/${id}`);
    return response.data;
  }

  async getSubUserTraffic(id: string, query?: TrafficQuery): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/sub-users/{id}/traffic
    const response = await this.client.get(`/v2/sub-users/${id}/traffic`, { params: query });
    return response.data;
  }

  // Proxy Endpoint Management
  async getEndpoints(): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/endpoints
    const response = await this.client.get('/v2/endpoints');
    return response.data;
  }

  async generateEndpoint(config?: EndpointGeneration): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/endpoints-custom
    const response = await this.client.get('/v2/endpoints-custom', { params: config || {} });
    return response.data;
  }

  async getTargetInfo(target: TargetInfo): Promise<ApiResponse> {
    // Use the correct API pattern: /api/v2/targets
    const response = await this.client.post('/api/v2/targets', target);
    return response.data;
  }

  // IP Whitelist Management
  async getWhitelist(): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/whitelisted-ips
    const response = await this.client.get('/v2/whitelisted-ips');
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
    // Use the correct API pattern: /api/v2/statistics/traffic
    const response = await this.client.post('/api/v2/statistics/traffic', query || {});
    return response.data;
  }

  async getSubscriptions(): Promise<ApiResponse> {
    // Use the documented v2 API pattern: /v2/subscriptions
    const response = await this.client.get('/v2/subscriptions');
    return response.data;
  }
}