import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../mcp-utils/utils.js";
import { available_official_plugins } from "../capacitorjs.com/official_plugins.js";

export const get_all_capacitor_plugins = tool(
  {
    name: "get_all_capacitor_plugins",
    description:
      "Superlist of all Capacitor plugings from different publishers you can use to retrieve API information through this MCP tool. If you are lost about which plugin to use, this tool will help you find the right one.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get Capacitor Plugin information from the superlist",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capacitor Plugin Superlist",
    },
  },
  async ({}, { capawesomeData, capGoData, capacitorCommunityData }) => {
    if (
      available_official_plugins.length === 0 &&
      capawesomeData.length === 0 &&
      capGoData.length === 0 &&
      capacitorCommunityData.length === 0
    ) {
      throw mcpError(
        "No Capacitor plugins found. Please ensure the data is downloaded."
      );
    }

    const result = `List of all Capacitor Plugins and how to get them using this MCP server\n\n

## Official Plugins - using get_official_plugin_api and get_all_official_plugins tools
${available_official_plugins.map((plugin) => `- use plugin_name ${plugin}\n`)}

## CapAwesome Plugins - using get_all_free_plugins tool, get_all_insider_plugins, get_all_plugins, get_plugin_api tools
${capawesomeData.map(
  (plugin) => `- **${plugin.name}**: use slug: ${plugin.slug}`
)}

## CapGo Plugins - using get_capgo_plugin_api tool
${capGoData.map(
  (plugin) => `- **${plugin.name}**: use repo_name: ${plugin.repo_name}`
)}

## Capacitor Community Plugins - using get_capacitor_community_plugin_api tool
${capacitorCommunityData.map(
  (plugin) => `- **${plugin.name}**: use repo_name: ${plugin.repo_name}`
)};
    `;
    return toContent({
      result: result,
    });
  }
);
