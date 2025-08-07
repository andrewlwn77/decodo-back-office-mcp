# Decodo Back Office MCP Server

[![npm version](https://badge.fury.io/js/decodo-back-office-mcp.svg)](https://badge.fury.io/js/decodo-back-office-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides seamless integration with Decodo's proxy management API, enabling AI agents to manage proxy infrastructure, sub-users, traffic monitoring, and endpoint configuration.

## Features

### 🔧 Sub-User Management
- Create, read, update, and delete sub-users
- Track individual sub-user traffic and usage
- Manage sub-user permissions and quotas

### 🌐 Proxy Endpoint Management
- Retrieve available proxy endpoints
- Generate custom endpoint configurations
- Monitor endpoint health and analyze targets

### 🛡️ IP Whitelist Management
- Add/remove IP addresses from whitelist
- Bulk whitelist operations
- Manage IP configurations with descriptions

### 📊 Traffic & Usage Analytics
- Real-time traffic monitoring
- Historical usage data retrieval
- Target analysis and reporting
- Subscription and quota monitoring

## Installation

### Via npx (Easiest - No Installation Required)
```bash
npx -y decodo-back-office-mcp
```

### Via NPM Global Install
```bash
npm install -g decodo-back-office-mcp
decodo-mcp
```

### From Source
```bash
git clone https://github.com/andrewlwn77/decodo-back-office-mcp.git
cd decodo-back-office-mcp
npm install
npm run build
npm start
```

## Quick Start

### 1. Get Your Decodo API Key
1. Log into your [Decodo Dashboard](https://dashboard.decodo.com)
2. Navigate to "API Keys" section
3. Generate a new API key

### 2. Configure Environment
Create a `.env` file in your project directory:
```bash
DECODO_API_KEY=your_api_key_here
DECODO_BASE_URL=https://api.decodo.com/v2
LOG_LEVEL=info
```

### 3. MCP Configuration

#### For Claude Desktop

**Option A: Using npx (Recommended - No Installation Required)**
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "decodo-back-office": {
      "command": "npx",
      "args": ["-y", "decodo-back-office-mcp"],
      "env": {
        "DECODO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Option B: Using Global Install**
```json
{
  "mcpServers": {
    "decodo-back-office": {
      "command": "decodo-mcp",
      "env": {
        "DECODO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Option C: From Source**
```json
{
  "mcpServers": {
    "decodo-back-office": {
      "command": "node",
      "args": ["/path/to/decodo-back-office-mcp/dist/index.js"],
      "env": {
        "DECODO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### For Continue.dev

**Using npx (Recommended):**
Add to your `config.json`:
```json
{
  "experimental": {
    "modelContextProtocol": true
  },
  "mcpServers": {
    "decodo-back-office": {
      "transport": {
        "type": "stdio"
      },
      "command": "npx",
      "args": ["-y", "decodo-back-office-mcp"],
      "env": {
        "DECODO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### For Cline (VS Code)

**Using npx (Recommended):**
Add to your MCP settings:
```json
{
  "mcpServers": {
    "decodo-back-office": {
      "command": "npx",
      "args": ["-y", "decodo-back-office-mcp"],
      "env": {
        "DECODO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Manual Server Start

```bash
# Using npx (easiest)
npx -y decodo-back-office-mcp

# Using global install
npm install -g decodo-back-office-mcp
decodo-mcp

# Development (from source)
npm run dev

# Production (from source)
npm run build
npm start
```

## Configuration

### Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DECODO_API_KEY` | ✅ Yes | - | Your Decodo API key |
| `DECODO_BASE_URL` | No | `https://api.decodo.com/v2` | Decodo API base URL |
| `LOG_LEVEL` | No | `info` | Logging level (error, warn, info, debug) |
| `MCP_SERVER_NAME` | No | `decodo-back-office-mcp` | Server identification |
| `MCP_SERVER_VERSION` | No | `1.0.0` | Server version |

### Finding Configuration Paths

#### Claude Desktop Config Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Continue.dev Config Location
- **All Platforms**: `~/.continue/config.json`

## Available Tools

The server provides 14 MCP tools for complete Decodo proxy management:

### 🔧 Sub-User Management (6 tools)
| Tool | Description | Parameters |
|------|-------------|------------|
| `decodo_create_sub_user` | Create a new sub-user | `username`, `password?`, `email?`, `traffic_limit?` |
| `decodo_get_sub_users` | List all sub-users | None |
| `decodo_get_sub_user` | Get specific sub-user details | `id` |
| `decodo_update_sub_user` | Update existing sub-user | `id`, `username?`, `password?`, `email?`, `traffic_limit?` |
| `decodo_delete_sub_user` | Delete a sub-user | `id` |
| `decodo_get_sub_user_traffic` | Get sub-user traffic statistics | `id`, `start_date?`, `end_date?` |

### 🌐 Proxy Management (3 tools)
| Tool | Description | Parameters |
|------|-------------|------------|
| `decodo_get_endpoints` | Retrieve proxy endpoints | None |
| `decodo_generate_endpoint` | Generate custom endpoints | `protocol?`, `format?`, `custom_params?` |
| `decodo_get_target_info` | Analyze target URLs | `url` |

### 🛡️ IP Whitelist (3 tools)
| Tool | Description | Parameters |
|------|-------------|------------|
| `decodo_get_whitelist` | List whitelisted IPs | None |
| `decodo_add_whitelist_ip` | Add IP to whitelist | `ip`, `description?` |
| `decodo_remove_whitelist_ip` | Remove IP from whitelist | `ip` |

### 📊 Analytics (2 tools)
| Tool | Description | Parameters |
|------|-------------|------------|
| `decodo_get_traffic` | Get traffic statistics | `start_date?`, `end_date?`, `sub_user_id?` |
| `decodo_get_subscriptions` | View subscription information | None |

## Example Usage

### Using with Claude Desktop
Once configured, you can ask Claude:

```
"Can you show me all my Decodo sub-users and their traffic usage?"

"Please create a new sub-user called 'test-user' with a 1GB traffic limit"

"Add IP address 192.168.1.100 to my whitelist for my home office"

"Generate a custom HTTPS endpoint for JSON responses"
```

### Using with API
```javascript
// The server will automatically handle tool calls through MCP protocol
// Your AI client will have access to all 14 Decodo management tools
```

## Troubleshooting

### Common Issues

**Server won't start:**
- Check that `DECODO_API_KEY` is set in your environment
- Verify Node.js version is 18+ (`node --version`)
- Run `npm run build` to ensure compilation

**API errors:**
- Verify your Decodo API key is valid
- Check that your Decodo account has necessary permissions
- Ensure `DECODO_BASE_URL` is set to `https://api.decodo.com/v2`

**MCP client can't connect:**
- Ensure the server path in your MCP config is correct
- Check that the server process is running
- Verify environment variables are passed correctly

### Debug Mode
Enable debug logging:
```bash
LOG_LEVEL=debug npm start
```

## Security & Best Practices

- ✅ API keys are securely handled and never logged
- ✅ All requests include proper authentication headers  
- ✅ Input validation using Zod schemas
- ✅ Comprehensive error handling with sanitized logs
- ✅ TypeScript for compile-time type safety
- ✅ `.gitignore` prevents credential leakage

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Type Checking
```bash
npm run typecheck
```

## API Reference

For detailed Decodo API documentation, visit:
[Decodo API Documentation](https://help.decodo.com/reference/public-api-key-authentication)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

- **MCP Server Issues**: [GitHub Issues](https://github.com/andrewlwn77/decodo-back-office-mcp/issues)
- **Decodo API**: [Decodo Support](https://help.decodo.com)
- **MCP Protocol**: [MCP Documentation](https://modelcontextprotocol.io)

---

*Built with the BMAD Agent Team methodology for comprehensive multi-perspective development.*