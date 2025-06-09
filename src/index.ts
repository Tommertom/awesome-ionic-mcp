import { IonicMCPServer } from "./mcp.js";

// this is a flag to do testing of tools without starting the server
const doTest = true;
// console.log(markdownDocsOfTools());

// If we are not testing tools, we start the server
if (!doTest) {
  const mcpServer = new IonicMCPServer();
  mcpServer
    .start()
    .then(() => {
      console.log("Ionic MCP Server is running");
    })
    .catch((error) => {
      console.error("Failed to start Ionic MCP Server:", error);
    });
}

// this block holds the testing code - using npm run start
import { emptyServerToolContext } from "./mcp-utils/tools.js";
import { get_component_demo } from "./tools/docs-demo.io/get_component_demo.js";
import { markdownDocsOfTools } from "./tools/index.js";
import { loadCoreCapAwesomeData } from "./tools/capawesome.io/index.js";

async function runTests() {
  if (doTest) {
    await loadCoreCapAwesomeData();
    // console.log("CapAwesome data loaded successfully");

    // process.exit(0);

    // console.log(markdownDocsOfTools());
    process.exit(0);
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
}

runTests();
