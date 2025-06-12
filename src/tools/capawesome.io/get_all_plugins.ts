import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../mcp-utils/utils.js";

export const get_all_plugins = tool(
  {
    name: "get_all_plugins",
    description:
      "Retrieves list of all Capawesome Capacitor plugins (free and insider versions).",
    inputSchema: z.object({}),
    annotations: {
      title: "Get Capeawesome Plugin Information from Official Docs",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capawesome Documentation",
    },
  },
  async ({}, { capawesomeData, liveViewer }) => {
    if (!capawesomeData || capawesomeData.length === 0) {
      return mcpError(
        "No Capawesome plugins data available. The plugin list is empty. Check https://capawesome.io/plugins/ for online plugin information."
      );
    }

    if (liveViewer.puppeteerPage) {
      const url = "https://capawesome.io/plugins/";
      const page = liveViewer.puppeteerPage;
      await page.goto(url, {
        waitUntil: "networkidle0",
      });
      liveViewer.lastURL = url;
    }

    return toContent(
      {
        plugins: capawesomeData.map((plugin) => ({
          name: plugin.name,
          url: plugin.url,
          slug: plugin.slug,
          insider: plugin.insider,
        })),
      },
      {
        contentPrefix:
          "List of all Capawesome Capacitor Plugins, free and insider versions, for which also API documentation can be queried via this MCP server\n\n",
      }
    );
  }
);
