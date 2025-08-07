import { DecodoTools } from '../tools.js';
import { DecodoClient } from '../decodo-client.js';
import type { ApiResponse } from '../types.js';

// Mock the DecodoClient
jest.mock('../decodo-client.js');

describe('DecodoTools', () => {
  let tools: DecodoTools;
  let mockClient: jest.Mocked<DecodoClient>;

  beforeEach(() => {
    mockClient = {
      createSubUser: jest.fn(),
      getSubUsers: jest.fn(),
      getSubUser: jest.fn(),
      updateSubUser: jest.fn(),
      deleteSubUser: jest.fn(),
      getSubUserTraffic: jest.fn(),
      getEndpoints: jest.fn(),
      generateEndpoint: jest.fn(),
      getTargetInfo: jest.fn(),
      getWhitelist: jest.fn(),
      addWhitelistIP: jest.fn(),
      removeWhitelistIP: jest.fn(),
      getTraffic: jest.fn(),
      getSubscriptions: jest.fn(),
    } as any;

    tools = new DecodoTools(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTools', () => {
    test('should return array of tool definitions', () => {
      const toolList = tools.getTools();
      
      expect(Array.isArray(toolList)).toBe(true);
      expect(toolList.length).toBeGreaterThan(0);
      
      // Check that all tools have required properties
      toolList.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(typeof tool.name).toBe('string');
        expect(typeof tool.description).toBe('string');
        expect(typeof tool.inputSchema).toBe('object');
      });
    });

    test('should include all expected tool names', () => {
      const toolList = tools.getTools();
      const toolNames = toolList.map(tool => tool.name);
      
      const expectedTools = [
        'decodo_create_sub_user',
        'decodo_get_sub_users',
        'decodo_get_sub_user',
        'decodo_update_sub_user',
        'decodo_delete_sub_user',
        'decodo_get_sub_user_traffic',
        'decodo_get_endpoints',
        'decodo_generate_endpoint',
        'decodo_get_target_info',
        'decodo_get_whitelist',
        'decodo_add_whitelist_ip',
        'decodo_remove_whitelist_ip',
        'decodo_get_traffic',
        'decodo_get_subscriptions',
      ];

      expectedTools.forEach(toolName => {
        expect(toolNames).toContain(toolName);
      });
    });
  });

  describe('handleToolCall', () => {
    const mockResponse: ApiResponse = { success: true, data: { result: 'test' } };

    describe('Sub User Management Tools', () => {
      test('decodo_create_sub_user should validate input and call client', async () => {
        const args = { username: 'testuser', password: 'testpass' };
        mockClient.createSubUser.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_create_sub_user', args);

        expect(mockClient.createSubUser).toHaveBeenCalledWith(args);
        expect(result).toEqual(mockResponse);
      });

      test('decodo_create_sub_user should reject invalid input', async () => {
        const args = { password: 'testpass' }; // missing required username

        await expect(tools.handleToolCall('decodo_create_sub_user', args))
          .rejects.toThrow();
      });

      test('decodo_get_sub_users should call client without args', async () => {
        mockClient.getSubUsers.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_get_sub_users', {});

        expect(mockClient.getSubUsers).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });

      test('decodo_update_sub_user should separate id from updates', async () => {
        const args = { id: '123', username: 'newname', email: 'new@example.com' };
        mockClient.updateSubUser.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_update_sub_user', args);

        expect(mockClient.updateSubUser).toHaveBeenCalledWith('123', { 
          username: 'newname', 
          email: 'new@example.com' 
        });
        expect(result).toEqual(mockResponse);
      });

      test('decodo_get_sub_user_traffic should separate id from query', async () => {
        const args = { id: '123', start_date: '2024-01-01' };
        mockClient.getSubUserTraffic.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_get_sub_user_traffic', args);

        expect(mockClient.getSubUserTraffic).toHaveBeenCalledWith('123', { 
          start_date: '2024-01-01' 
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('Proxy Management Tools', () => {
      test('decodo_get_endpoints should call client', async () => {
        mockClient.getEndpoints.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_get_endpoints', {});

        expect(mockClient.getEndpoints).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });

      test('decodo_generate_endpoint should validate config', async () => {
        const args = { protocol: 'https', format: 'json' };
        mockClient.generateEndpoint.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_generate_endpoint', args);

        expect(mockClient.generateEndpoint).toHaveBeenCalledWith(args);
        expect(result).toEqual(mockResponse);
      });

      test('decodo_get_target_info should validate URL', async () => {
        const args = { url: 'https://example.com' };
        mockClient.getTargetInfo.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_get_target_info', args);

        expect(mockClient.getTargetInfo).toHaveBeenCalledWith(args);
        expect(result).toEqual(mockResponse);
      });

      test('decodo_get_target_info should reject invalid URL', async () => {
        const args = { url: 'not-a-url' };

        await expect(tools.handleToolCall('decodo_get_target_info', args))
          .rejects.toThrow();
      });
    });

    describe('IP Whitelist Tools', () => {
      test('decodo_add_whitelist_ip should validate IP address', async () => {
        const args = { ip: '192.168.1.1', description: 'Test IP' };
        mockClient.addWhitelistIP.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_add_whitelist_ip', args);

        expect(mockClient.addWhitelistIP).toHaveBeenCalledWith(args);
        expect(result).toEqual(mockResponse);
      });

      test('decodo_add_whitelist_ip should reject invalid IP', async () => {
        const args = { ip: 'not-an-ip' };

        await expect(tools.handleToolCall('decodo_add_whitelist_ip', args))
          .rejects.toThrow();
      });

      test('decodo_remove_whitelist_ip should call client with IP', async () => {
        const args = { ip: '192.168.1.1' };
        mockClient.removeWhitelistIP.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_remove_whitelist_ip', args);

        expect(mockClient.removeWhitelistIP).toHaveBeenCalledWith('192.168.1.1');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('Analytics Tools', () => {
      test('decodo_get_traffic should handle query parameters', async () => {
        const args = { start_date: '2024-01-01', sub_user_id: '123' };
        mockClient.getTraffic.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_get_traffic', args);

        expect(mockClient.getTraffic).toHaveBeenCalledWith(args);
        expect(result).toEqual(mockResponse);
      });

      test('decodo_get_subscriptions should call client', async () => {
        mockClient.getSubscriptions.mockResolvedValue(mockResponse);

        const result = await tools.handleToolCall('decodo_get_subscriptions', {});

        expect(mockClient.getSubscriptions).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });
    });

    describe('Error Handling', () => {
      test('should handle unknown tool names', async () => {
        await expect(tools.handleToolCall('unknown_tool', {}))
          .rejects.toThrow('Unknown tool: unknown_tool');
      });

      test('should handle client errors', async () => {
        mockClient.getSubUsers.mockRejectedValue(new Error('API Error'));

        await expect(tools.handleToolCall('decodo_get_sub_users', {}))
          .rejects.toThrow('API Error');
      });

      test('should handle validation errors', async () => {
        const args = { username: 123 }; // should be string

        await expect(tools.handleToolCall('decodo_create_sub_user', args))
          .rejects.toThrow();
      });
    });
  });
});