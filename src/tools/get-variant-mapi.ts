import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createManagementClient } from '@kontent-ai/management-sdk';

export const registerTool = (server: McpServer): void => {
  server.tool(
    "get-variant-mapi",
    "Get language variant of a content item from Management API",
    {
      itemCodename: z.string().describe("Codename of the content item"),
      languageCodename: z.string().describe("Codename of the language variant to get")
    },
    async ({ itemCodename, languageCodename }) => {
      const client = createManagementClient({
        apiKey: process.env.KONTENT_API_KEY ?? "",
        environmentId: process.env.KONTENT_ENVIRONMENT_ID ?? "",
      });

      const response = await client
        .viewLanguageVariant()
        .byItemCodename(itemCodename)
        .byLanguageCodename(languageCodename)
        .toPromise();

      return {
        content: [
          {
            type: "text", 
            text: JSON.stringify(response.data)
          }
        ]
      };
    }
  );
}; 