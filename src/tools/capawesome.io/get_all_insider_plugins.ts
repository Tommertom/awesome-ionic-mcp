import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";

export const get_all_insider_plugins = tool(
  {
    name: "get_all_insider_plugins",
    description:
      "Retrieves list of all Capawesome Capacitor insider plugins - intensively curated and up-to-date.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get Official Plugin Information from Official Docs",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capawesome Documentation",
    },
  },
  async ({}, { capawesomeData }) => {
    if (!capawesomeData || capawesomeData.length === 0) {
      return mcpError(
        "No Capawesome plugins data available. The plugin list is empty. Check https://capawesome.io/plugins/ for online plugin information."
      );
    }

    return toContent(
      {
        plugins: capawesomeData
          .filter((plugin) => plugin.insider)
          .map((plugin) => ({
            name: plugin.name,
            url: plugin.url,
            slug: plugin.slug,
            insider: plugin.insider,
          })),
      },
      {
        contentPrefix:
          "List of all Capawesome Capacitor Insider Plugins, for which also API documentation can be queried via this MCP server. Reach out to support@capawesome.io to get access to the Insider program \n\n",
      }
    );
  }
);
