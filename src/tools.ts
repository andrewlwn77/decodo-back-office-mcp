import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { DecodoClient } from './decodo-client.js';
import { logger } from './logger.js';
import {
  SubUserSchema,
  SubUserUpdateSchema,
  WhitelistIPSchema,
  TrafficQuerySchema,
  TargetInfoSchema,
  EndpointGenerationSchema,
} from './types.js';

export class DecodoTools {
  constructor(private client: DecodoClient) {}

  getTools(): Tool[] {
    return [
      // Sub User Management Tools
      {
        name: 'decodo_create_sub_user',
        description: 'Create a new sub-user in Decodo proxy system',
        inputSchema: {
          type: 'object',
          properties: {
            username: { type: 'string', description: 'Username for the sub-user' },
            password: { type: 'string', description: 'Password for the sub-user' },
            email: { type: 'string', format: 'email', description: 'Email address (optional)' },
            traffic_limit: { type: 'number', description: 'Traffic limit in bytes (optional)' },
            expires_at: { type: 'string', description: 'Expiration date (ISO string, optional)' },
          },
          required: ['username'],
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_get_sub_users',
        description: 'Retrieve list of all sub-users',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_get_sub_user',
        description: 'Get details of a specific sub-user',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Sub-user ID' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_update_sub_user',
        description: 'Update an existing sub-user',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Sub-user ID' },
            username: { type: 'string', description: 'New username (optional)' },
            password: { type: 'string', description: 'New password (optional)' },
            email: { type: 'string', format: 'email', description: 'New email (optional)' },
            traffic_limit: { type: 'number', description: 'New traffic limit (optional)' },
            expires_at: { type: 'string', description: 'New expiration date (optional)' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_delete_sub_user',
        description: 'Delete a sub-user',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Sub-user ID to delete' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_get_sub_user_traffic',
        description: 'Get traffic statistics for a specific sub-user',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Sub-user ID' },
            start_date: { type: 'string', description: 'Start date for traffic query (ISO string, optional)' },
            end_date: { type: 'string', description: 'End date for traffic query (ISO string, optional)' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },

      // Proxy Management Tools
      {
        name: 'decodo_get_endpoints',
        description: 'Retrieve available proxy endpoints',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_generate_endpoint',
        description: 'Generate a custom proxy endpoint',
        inputSchema: {
          type: 'object',
          properties: {
            username: { type: 'string', description: 'Username for the proxy endpoint' },
            password: { type: 'string', description: 'Password for the proxy endpoint' },
            protocol: { type: 'string', enum: ['http', 'https'], description: 'Protocol (optional)' },
            format: { type: 'string', enum: ['json', 'xml'], description: 'Response format (optional)' },
            custom_params: { type: 'object', description: 'Custom parameters (optional)' },
          },
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_get_target_info',
        description: 'Get information about a target URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri', description: 'Target URL to analyze' },
          },
          required: ['url'],
          additionalProperties: false,
        },
      },

      // IP Whitelist Tools
      {
        name: 'decodo_get_whitelist',
        description: 'Get list of whitelisted IP addresses',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_add_whitelist_ip',
        description: 'Add an IP address to the whitelist',
        inputSchema: {
          type: 'object',
          properties: {
            ip: { type: 'string', description: 'IP address to whitelist' },
            description: { type: 'string', description: 'Description for the IP (optional)' },
          },
          required: ['ip'],
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_remove_whitelist_ip',
        description: 'Remove an IP address from the whitelist',
        inputSchema: {
          type: 'object',
          properties: {
            ip: { type: 'string', description: 'IP address to remove from whitelist' },
          },
          required: ['ip'],
          additionalProperties: false,
        },
      },

      // Analytics Tools
      {
        name: 'decodo_get_traffic',
        description: 'Get traffic statistics and analytics',
        inputSchema: {
          type: 'object',
          properties: {
            proxyType: { type: 'string', description: 'Proxy type (residential_proxies, datacenter_proxies, etc.)' },
            startDate: { type: 'string', description: 'Start date in Y-m-d H:i:s format' },
            endDate: { type: 'string', description: 'End date in Y-m-d H:i:s format' },
            groupBy: { type: 'string', description: 'Group by (day, hour, etc.)' },
            sub_user_id: { type: 'string', description: 'Filter by sub-user ID (optional)' },
          },
          required: ['proxyType', 'startDate', 'endDate', 'groupBy'],
          additionalProperties: false,
        },
      },
      {
        name: 'decodo_get_subscriptions',
        description: 'Get subscription information and limits',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any): Promise<any> {
    logger.info(`Executing tool: ${name}`, { args });

    try {
      switch (name) {
        // Sub User Management
        case 'decodo_create_sub_user':
          const subUser = SubUserSchema.parse(args);
          return await this.client.createSubUser(subUser);

        case 'decodo_get_sub_users':
          return await this.client.getSubUsers();

        case 'decodo_get_sub_user':
          return await this.client.getSubUser(args.id);

        case 'decodo_update_sub_user':
          const { id, ...updates } = args;
          const validatedUpdates = SubUserUpdateSchema.parse(updates);
          return await this.client.updateSubUser(id, validatedUpdates);

        case 'decodo_delete_sub_user':
          return await this.client.deleteSubUser(args.id);

        case 'decodo_get_sub_user_traffic':
          const { id: subUserId, ...trafficQuery } = args;
          const validatedQuery = TrafficQuerySchema.parse(trafficQuery);
          return await this.client.getSubUserTraffic(subUserId, validatedQuery);

        // Proxy Management
        case 'decodo_get_endpoints':
          return await this.client.getEndpoints();

        case 'decodo_generate_endpoint':
          const endpointConfig = EndpointGenerationSchema.parse(args);
          return await this.client.generateEndpoint(endpointConfig);

        case 'decodo_get_target_info':
          const targetInfo = TargetInfoSchema.parse(args);
          return await this.client.getTargetInfo(targetInfo);

        // IP Whitelist
        case 'decodo_get_whitelist':
          return await this.client.getWhitelist();

        case 'decodo_add_whitelist_ip':
          const whitelistIP = WhitelistIPSchema.parse(args);
          return await this.client.addWhitelistIP(whitelistIP);

        case 'decodo_remove_whitelist_ip':
          return await this.client.removeWhitelistIP(args.ip);

        // Analytics
        case 'decodo_get_traffic':
          const trafficQueryArgs = TrafficQuerySchema.parse(args);
          return await this.client.getTraffic(trafficQueryArgs);

        case 'decodo_get_subscriptions':
          return await this.client.getSubscriptions();

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error(`Tool execution failed: ${name}`, { error: error instanceof Error ? error.message : String(error), args });
      throw error;
    }
  }
}