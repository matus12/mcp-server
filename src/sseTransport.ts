import 'dotenv/config';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { createServer } from "./server.js";

const app = express();

const { server } = createServer();

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);

  /*server.onclose = async () => {
    //await cleanup();
    await server.close();
    process.exit(0); 
  };*/
});

app.post("/message", async (req, res) => {
  await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Kontent.ai MCP Server (SSE) running on port ${PORT}`);
});