import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent } from "../../mcp-utils/utils.js";

export const get_capgo_plugin_api = tool(
  {
    name: "get_capgo_plugin_api",
    description: "Retrieves API documentation for a specific CapGo plugin.",
    inputSchema: z.object({
      repo_name: z
        .string()
        .describe(
          "The repo_name tag of the CapGo plugin to retrieve. For example, 'speech-recognition'."
        ),
    }),
    annotations: {
      title: "Get CapGo Plugin API Documentation",
      readOnlyHint: true,
    },
    _meta: {
      feature: "CapGo Documentation",
    },
  },
  async ({ repo_name }, { capGoData }) => {
    const plugin = capGoData.find((p) => p.repo_name === repo_name);
    if (!plugin) {
      throw new Error(
        `Plugin not found: ${repo_name}\n\nQuery again using the exact repo_name. List of plugins:\n\n${capGoData
          .map((p) => `- ${p.name} - repo_name: ${p.repo_name}`)
          .join("\n")}`
      );
    }
    return toContent(
      {
        plugin_info: [
          {
            name: plugin.name,
            url: plugin.url,
            repo_name: plugin.repo_name,
            api_doc: plugin.api_doc,
          },
        ],
      },
      {
        contentPrefix: `API documentation for the Capacitor Community plugin <${plugin.name}, repo_name ${plugin.repo_name}>:\n\n`,
      }
    );
  }
);
