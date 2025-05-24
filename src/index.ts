import { emptyServerToolContext } from "./mcp-utils/tools.js";
import { IonicMCPServer } from "./mcp.js";

// this block is to test the tools without starting the server - using npm run start
const doTest = false;
import { get_component_demo } from "./tools/docs-demo.io/get_component_demo.js";
if (doTest) {
  // console.log(markdownDocsOfTools());

  const toolToTest = get_component_demo;
  console.log("Tool to test:", toolToTest.mcp.name);
  const testInput = {
    html_tag: "ion-button",
  };
  toolToTest
    .fn(testInput, emptyServerToolContext)
    .then((result) => {
      console.log("Test result:", result);
    })
    .catch((error) => {
      console.error("Test error:", error);
    })
    .finally(() => {
      process.exit(0);
    });
}

// If the above block is not executed, the server will start
const mcpServer = new IonicMCPServer();
mcpServer
  .start()
  .then(() => {
    console.log("Ionic MCP Server is running");
  })
  .catch((error) => {
    console.error("Failed to start Ionic MCP Server:", error);
  });
