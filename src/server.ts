import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTool as registerGetItemMapi } from "./tools/get-item-mapi.js";
import { registerTool as registerGetItemDapi } from "./tools/get-item-dapi.js";
import { registerTool as registerGetVariantMapi } from "./tools/get-variant-mapi.js";
import { registerTool as registerGetTypeMapi } from "./tools/get-type-mapi.js";
import { registerTool as registerListContentTypesMapi } from "./tools/list-content-types-mapi.js";
import { registerTool as registerListLanguagesMapi } from "./tools/list-languages-mapi.js";
import { registerTool as registerGetAssetMapi } from "./tools/get-asset-mapi.js";
import { registerTool as registerListAssetsMapi } from "./tools/list-assets-mapi.js";
import { registerTool as registerAddContentTypeMapi } from "./tools/add-content-type-mapi.js";

// Create server instance
export const createServer = () => {
  const server = new McpServer({
      name: "kontent-ai",
      version: "1.0.0",
      capabilities: {
        resources: {},
        tools: {},
      },
  });

  // Register all tools
  registerGetItemMapi(server);
  registerGetItemDapi(server);
  registerGetVariantMapi(server);
  registerGetTypeMapi(server);
  registerListContentTypesMapi(server);
  registerListLanguagesMapi(server);
  registerGetAssetMapi(server);
  registerListAssetsMapi(server);
  registerAddContentTypeMapi(server);

  return { server };
};