#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { appConfig } from './config.js';
import { logger } from './logger.js';
import { DecodoClient } from './decodo-client.js';
import { DecodoTools } from './tools.js';

class DecodoMCPServer {
  private server: Server;
  private tools: DecodoTools;

  constructor() {
    this.server = new Server({
      name: appConfig.MCP_SERVER_NAME,
      version: appConfig.MCP_SERVER_VERSION,
    });

    const client = new DecodoClient();
    this.tools = new DecodoTools(client);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listing available tools');
      return {
        tools: this.tools.getTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      logger.info(`Tool called: ${name}`);
      
      try {
        const result = await this.tools.handleToolCall(name, args || {});
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`Tool execution error: ${errorMessage}`, { tool: name, args });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: errorMessage,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    logger.info(`Starting ${appConfig.MCP_SERVER_NAME} v${appConfig.MCP_SERVER_VERSION}`);
    logger.info('Server ready for connections');
    
    await this.server.connect(transport);
  }
}

// Start the server
async function main() {
  try {
    const server = new DecodoMCPServer();
    await server.start();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});