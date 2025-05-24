import { IonicMCPServer } from "./mcp.js";

const mcpServer = new IonicMCPServer();
mcpServer
  .start()
  .then(() => {
    console.log("Ionic MCP Server is running");
  })
  .catch((error) => {
    console.error("Failed to start Ionic MCP Server:", error);
  });
