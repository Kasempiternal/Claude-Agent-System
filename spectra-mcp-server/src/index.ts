import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./server.js";
import { closeBrowser } from "./browser/launcher.js";
import { stopHealthMonitor } from "./browser/health.js";

const server = new McpServer({
  name: "spectra-mcp-server",
  version: "0.1.0",
});

registerAllTools(server);

// Graceful shutdown
async function cleanup() {
  stopHealthMonitor();
  await closeBrowser();
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Connect via stdio
const transport = new StdioServerTransport();
await server.connect(transport);
