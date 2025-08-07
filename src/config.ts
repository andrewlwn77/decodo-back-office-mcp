import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

const configSchema = z.object({
  DECODO_API_KEY: z.string().min(1, 'DECODO_API_KEY is required'),
  DECODO_BASE_URL: z.string().url().default('https://api.decodo.com'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  MCP_SERVER_NAME: z.string().default('decodo-back-office-mcp'),
  MCP_SERVER_VERSION: z.string().default('1.0.0'),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:');
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const appConfig = loadConfig();