import { IonicMCPServer } from "./mcp.js";

// this is a flag to do testing of tools without starting the server
const doTest = false;

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
import { markdownDocsOfTools } from "./tools/index.js";
import { loadCoreCapAwesomeData } from "./tools/capawesome.io/index.js";
import { get_all_plugins } from "./tools/capawesome.io/get_all_plugins.js";
import { get_plugin_api } from "./tools/capawesome.io/get_plugin_api.js";
import { getAllCapacitorCommunityRepos } from "./tools/capacitor-community/index.js";

async function runTests() {
  if (doTest) {
    console.log(markdownDocsOfTools());

    try {
      const repos = await getAllCapacitorCommunityRepos();
      console.log(`Found ${repos.length} repositories:`);
      console.log(
        repos.map((repo) => `- ${repo.name} (${repo.repo_name})`).join("\n")
      );
    } catch (err) {
      console.error("Error fetching repos:", err);
    }

    process.exit(0);

    const toolToTest = get_plugin_api;
    console.log("Tool to test:", toolToTest.mcp.name);
    const testInput = {
      repo_name: "speech-recognition",
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

if (doTest) {
  runTests();
}
