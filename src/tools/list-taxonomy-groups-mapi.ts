import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMapiClient } from '../clients/kontentClients.js';

export const registerTool = (server: McpServer): void => {
  server.tool(
    "list-taxonomy-groups-mapi",
    "Get all taxonomy groups from Management API",
    {
      random_string: z.string().describe("Dummy parameter for no-parameter tools")
    },
    async () => {
      const client = createMapiClient();

      const response = await client
        .listTaxonomies()
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