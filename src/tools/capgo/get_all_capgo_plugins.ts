import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../mcp-utils/utils.js";

export const get_all_capgo_plugins = tool(
  {
    name: "get_all_capgo_plugins",
    description: "Retrieves list of all CapGo plugins.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get CapGo Plugin Information from Official Docs",
      readOnlyHint: true,
    },
    _meta: {
      feature: "CapGo Documentation",
    },
  },
  async ({}, { capGoData, liveViewer }) => {
    if (!capGoData || capGoData.length === 0) {
      return mcpError(
        "No Capacitor Community plugins data available. The plugin list is empty. Check https://github.com/capacitor-community for online plugin information."
      );
    }

    if (liveViewer.puppeteerPage) {
      const url = "https://capgo.app/plugins/";
      const page = liveViewer.puppeteerPage;
      await page.goto(url, {
        waitUntil: "networkidle0",
      });
      liveViewer.lastURL = url;
    }

    return toContent(
      {
        plugins: capGoData.map((plugin) => ({
          name: plugin.name,
          url: plugin.url,
          repo_name: plugin.repo_name,
        })),
      },
      {
        contentPrefix:
          "List of all CapGo Plugins for which also API documentation can be queried via this MCP server\n\n",
      }
    );
  }
);
