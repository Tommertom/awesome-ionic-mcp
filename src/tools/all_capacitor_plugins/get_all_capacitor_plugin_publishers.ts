import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../mcp-utils/utils.js";

export const get_all_capacitor_plugin_publishers = tool(
  {
    name: "get_all_capacitor_plugin_publishers",
    description:
      "Provides the list of all Capacitor plugin publishers in the MCP server you can ask API info about. Tool get_all_capacitor_plugins will give you the list of all plugins from these publishers.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get Capacitor Plugin Publisher information from the superlist",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capacitor Plugin List of Publishers",
    },
  },
  async ({}, {}) => {
    const result = `The MCP server provides info on Capacitor plugins from the following sources:
- Official Capacitor plugins from capacitorjs.com
- CapAwesome plugins from capawesome.io
- CapGo plugins from capgo.io
- Capacitor Community plugins from capacitor-community.github.io

Query the tool get_all_capacitor_plugins to get the list of all plugins from these publishers.`;
    return toContent({
      result: result,
    });
  }
);
