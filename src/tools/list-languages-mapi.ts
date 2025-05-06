import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createManagementClient } from '@kontent-ai/management-sdk';

export const registerTool = (server: McpServer): void => {
  server.tool(
    "list-languages-mapi",
    "Get all languages from Management API",
    {},
    async () => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .listLanguages()
        .toAllPromise();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data),
          },
        ],
      };
    }
  );
}; 