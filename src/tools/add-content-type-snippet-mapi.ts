import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMapiClient } from '../clients/kontentClients.js';
import { snippetElementSchema, contentGroupSchema } from '../schemas/contentTypeSchemas.js';

export const registerTool = (server: McpServer): void => {
  server.tool(
    "add-content-type-snippet-mapi",
    "Add a new content type snippet via Management API",
    {
      name: z.string().describe("Display name of the content type snippet"),
      codename: z.string().optional().describe("Codename of the content type snippet (optional, will be generated if not provided)"),
      external_id: z.string().optional().describe("External ID of the content type snippet (optional)"),
      elements: z.array(snippetElementSchema).describe("Array of elements that define the structure of the content type snippet"),
      content_groups: z.array(contentGroupSchema).optional().describe("Array of content groups (optional)"),
    },
    async ({ name, codename, external_id, elements, content_groups }) => {
      const client = createMapiClient();

      const response = await client
        .addContentTypeSnippet()
        .withData(() => ({
          name,
          codename,
          external_id,
          elements,
          content_groups: content_groups?.map(group => ({
            name: group.name,
            external_id: group.external_id,
            codename: group.codename
          })),
        }))
        .toPromise();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.rawData),
          },
        ],
      };
    }
  );
}; 