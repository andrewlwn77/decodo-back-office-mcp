# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-05

### Added
- Initial release of Decodo Back Office MCP Server
- Complete integration with Decodo API v2
- 14 MCP tools for comprehensive proxy management:
  - 6 sub-user management tools
  - 3 proxy endpoint management tools
  - 3 IP whitelist management tools
  - 2 analytics and traffic tools
- TypeScript implementation with full type safety
- Comprehensive input validation using Zod schemas
- Secure API key handling with automatic log sanitization
- Production-ready error handling and logging
- Complete test suite with 96%+ coverage
- Support for all major MCP clients (Claude Desktop, Continue.dev, Cline)
- Environment-based configuration system
- CLI binary for easy installation and execution

### Security
- API keys automatically sanitized from all log output
- Environment variable validation and secure loading
- Input validation prevents injection attacks
- Comprehensive `.gitignore` to prevent credential leakage

### Documentation
- Complete README with MCP configuration examples
- Troubleshooting guide and common issues
- API reference and tool documentation
- Development and contribution guidelines

[1.0.0]: https://github.com/andrewlwn77/decodo-back-office-mcp/releases/tag/v1.0.0