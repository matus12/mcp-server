# Kontent.ai MCP Server

This server provides a Model Context Protocol (MCP) interface for interacting with Kontent.ai's Management and Delivery APIs. It enables AI assistants to access and manipulate Kontent.ai content using standardized tools.

## Features

- Retrieve content items, variants, and assets
- List available languages and assets
- Get, List, and Create content types and snippets
- Get, List, and Create taxonomies

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Kontent.ai account with API keys

### Running

You can run this server with either stdio or sse transport.

### Stdio transport

To run the server with stdio transport configure your MCP client with the command to run and the necessary environment variables.
Example:
```json
{
  "kontent-ai-stdio": {
      "command": "npx @kontent-ai/mcp-server@latest stdio",
      "env": {
        "KONTENT_API_KEY": "<management-api-key>",
        "KONTENT_ENVIRONMENT_ID": "<environment-id>"
      }
    }
}
```

### SSE transport

You can also run your server manually with the SSE transport and configure your MCP client to connect to the port the server is running on.
Run the following command to start the server and ensure the environment variables are defined for it either by providing `.env` file in the `cwd` or providing the variables to the process any other way.

```bash
npx @kontent-ai/mcp-server@latest sse
```
```env
KONTENT_API_KEY=<management-api-key>
KONTENT_ENVIRONMENT_ID=<environment-id>
PORT=<port-number> # optionally specify port, defaults to 3001
```

Then configure your MCP client to connect to the running server.
Example:
```json
{
  "kontent-ai-sse": {
    "url": "http://localhost:3001/sse"
  }
}
```


## Development

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