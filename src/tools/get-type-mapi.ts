import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createManagementClient } from '@kontent-ai/management-sdk';

export const registerTool = (server: McpServer): void => {
  server.tool(
    "get-type-mapi",
    "Get content type by codename from Management API",
    {
      codename: z.string().describe("Codename of the content type to get")
    },
    async ({ codename }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .viewContentType()
        .byTypeCodename(codename)
        .toPromise();

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