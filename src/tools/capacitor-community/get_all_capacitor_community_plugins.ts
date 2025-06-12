import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../mcp-utils/utils.js";

export const get_all_capacitor_community_plugins = tool(
  {
    name: "get_all_capacitor_community_plugins",
    description: "Retrieves list of all Capacitor Community plugins.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get Capacitor Community Plugin Information from Official Docs",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capacitor Community Documentation",
    },
  },
  async ({}, { capacitorCommunityData, liveViewer }) => {
    if (!capacitorCommunityData || capacitorCommunityData.length === 0) {
      return mcpError(
        "No Capacitor Community plugins data available. The plugin list is empty. Check https://github.com/capacitor-community for online plugin information."
      );
    }

    if (liveViewer.puppeteerPage) {
      const url = "https://github.com/capacitor-community";
      const page = liveViewer.puppeteerPage;
      await page.goto(url, {
        waitUntil: "networkidle0",
      });
      liveViewer.lastURL = url;
    }

    return toContent(
      {
        plugins: capacitorCommunityData.map((plugin) => ({
          name: plugin.name,
          url: plugin.url,
          repo_name: plugin.repo_name,
        })),
      },
      {
        contentPrefix:
          "List of all Capacitor Community Plugins for which also API documentation can be queried via this MCP server\n\n",
      }
    );
  }
);
