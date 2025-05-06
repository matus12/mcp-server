import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createManagementClient } from '@kontent-ai/management-sdk';

export const registerTool = (server: McpServer): void => {
  server.tool(
    "get-asset-mapi",
    "Get a specific asset by codename from Management API",
    {
      assetCodename: z.string().describe("Codename of the asset to retrieve")
    },
    async ({ assetCodename }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .viewAsset()
        .byAssetCodename(assetCodename)
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