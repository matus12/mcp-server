# Kontent.ai MCP Server

This server provides a Model Context Protocol (MCP) interface for interacting with Kontent.ai's Management and Delivery APIs. It enables AI assistants to access and manipulate Kontent.ai content using standardized tools.

## Features

- Retrieve content items, variants, and assets
- Get content types and their structure
- List available languages and assets
- Create new content types and snippets

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Kontent.ai account with API keys

### Environment Variables

The following environment variables are needed:

```
KONTENT_ENVIRONMENT_ID=your_environment_id
KONTENT_API_KEY=your_api_key
```

### Using with npx

You can run the server directly with npx:

```bash
# Run with SSE transport
npx @kontent-ai/mcp-server sse

# Run with STDIO transport
npx @kontent-ai/mcp-server stdio
```

### Example mcp.json usage

```json
{
  "kontent-ai-stdio": {
      "command": "npx @kontent-ai/mcp stdio",
      "env": {
        "KONTENT_API_KEY": "<management-api-key>",
        "KONTENT_ENVIRONMENT_ID": "<environment-id>"
      }
    },
}
```

### Local Installation

```bash
# Clone the repository
git clone https://github.com/kontent-ai/mcp-server.git
cd mcp-server

# Install dependencies
npm ci

# Build the project
npm run build

# Start the server
npm run start:sse  # For SSE transport
npm run start:stdio  # For STDIO transport
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start:sse` - Start the server with Server-Sent Events transport
- `npm run start:stdio` - Start the server with Standard IO transport

### Project Structure

- `src/` - Source code
  - `tools/` - MCP tool implementations
  - `clients/` - Kontent.ai API client setup
  - `schemas/` - Data validation schemas
  - `server.ts` - Main server setup and tool registration
  - `bin.ts` - Single entry point that handles both transport types

## License

MIT 