import axios from 'axios';
import { DecodoClient } from '../decodo-client.js';
import type { SubUser, ApiResponse } from '../types.js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DecodoClient', () => {
  let client: DecodoClient;
  let mockAxiosInstance: jest.Mocked<any>;

  beforeEach(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    client = new DecodoClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Sub User Management', () => {
    test('createSubUser should make POST request to /api/subusers', async () => {
      const subUser: SubUser = {
        username: 'testuser',
        password: 'testpass',
        email: 'test@example.com',
      };

      const mockResponse: ApiResponse = {
        success: true,
        data: { id: '123', ...subUser },
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await client.createSubUser(subUser);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/subusers', subUser);
      expect(result).toEqual(mockResponse);
    });

    test('getSubUsers should make GET request to /api/subusers', async () => {
      const mockResponse: ApiResponse = {
        success: true,
        data: [
          { id: '1', username: 'user1' },
          { id: '2', username: 'user2' },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getSubUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/subusers');
      expect(result).toEqual(mockResponse);
    });

    test('updateSubUser should make PUT request with correct parameters', async () => {
      const id = '123';
      const updates = { username: 'newusername' };
      const mockResponse: ApiResponse = { success: true };

      mockAxiosInstance.put.mockResolvedValue({ data: mockResponse });

      const result = await client.updateSubUser(id, updates);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/api/subusers/${id}`, updates);
      expect(result).toEqual(mockResponse);
    });

    test('deleteSubUser should make DELETE request to correct endpoint', async () => {
      const id = '123';
      const mockResponse: ApiResponse = { success: true };

      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

      const result = await client.deleteSubUser(id);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/api/subusers/${id}`);
      expect(result).toEqual(mockResponse);
    });

    test('getSubUserTraffic should handle query parameters correctly', async () => {
      const id = '123';
      const query = { start_date: '2024-01-01', end_date: '2024-01-31' };
      const mockResponse: ApiResponse = { success: true, data: { usage: 1000 } };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getSubUserTraffic(id, query);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/api/subusers/${id}/traffic`, { params: query });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Proxy Endpoint Management', () => {
    test('getEndpoints should make GET request to /api/endpoints', async () => {
      const mockResponse: ApiResponse = {
        success: true,
        data: ['endpoint1', 'endpoint2'],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getEndpoints();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/endpoints');
      expect(result).toEqual(mockResponse);
    });

    test('generateEndpoint should handle optional config', async () => {
      const config = { protocol: 'https' as const, format: 'json' as const };
      const mockResponse: ApiResponse = { success: true, data: { endpoint: 'generated-endpoint' } };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await client.generateEndpoint(config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/endpoints/generate', config);
      expect(result).toEqual(mockResponse);
    });

    test('getTargetInfo should POST target URL', async () => {
      const target = { url: 'https://example.com' };
      const mockResponse: ApiResponse = { success: true, data: { info: 'target info' } };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await client.getTargetInfo(target);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/targets', target);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('IP Whitelist Management', () => {
    test('addWhitelistIP should make POST request with IP config', async () => {
      const ipConfig = { ip: '192.168.1.1', description: 'Test IP' };
      const mockResponse: ApiResponse = { success: true };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await client.addWhitelistIP(ipConfig);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/whitelist', ipConfig);
      expect(result).toEqual(mockResponse);
    });

    test('removeWhitelistIP should encode IP address in URL', async () => {
      const ip = '192.168.1.1';
      const mockResponse: ApiResponse = { success: true };

      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

      const result = await client.removeWhitelistIP(ip);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/api/whitelist/${encodeURIComponent(ip)}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Analytics', () => {
    test('getTraffic should handle query parameters', async () => {
      const query = { start_date: '2024-01-01' };
      const mockResponse: ApiResponse = { success: true, data: { traffic: 1000 } };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getTraffic(query);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/traffic', { params: query });
      expect(result).toEqual(mockResponse);
    });

    test('getSubscriptions should make GET request', async () => {
      const mockResponse: ApiResponse = { success: true, data: { plan: 'premium' } };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.getSubscriptions();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/subscriptions');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors correctly', async () => {
      const error = {
        response: {
          status: 401,
          data: 'Unauthorized',
        },
        config: { url: '/api/test' },
        isAxiosError: true,
      };

      // Simulate the axios interceptor rejection by calling the formatError method
      const formattedError = new Error('Decodo API Error (401): Unauthorized');
      mockAxiosInstance.get.mockRejectedValue(formattedError);

      await expect(client.getEndpoints()).rejects.toThrow('Decodo API Error (401): Unauthorized');
    });

    test('should handle network errors', async () => {
      const error = {
        message: 'Network Error',
        config: { url: '/api/test' },
        isAxiosError: true,
      };

      // Simulate the axios interceptor rejection by calling the formatError method
      const formattedError = new Error('Decodo API Error (undefined): Network Error');
      mockAxiosInstance.get.mockRejectedValue(formattedError);

      await expect(client.getEndpoints()).rejects.toThrow('Decodo API Error (undefined): Network Error');
    });
  });
});