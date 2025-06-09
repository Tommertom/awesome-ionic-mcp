import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent } from "../../mcp-utils/utils.js";

export const get_plugin_api = tool(
  {
    name: "get_plugin_api",
    description:
      "Retrieves API documentation for a specific Capawesome Capacitor plugin.",
    inputSchema: z.object({
      plugin_id: z
        .string()
        .describe(
          "The slug tag of the Capawesome Capacitor plugin to retrieve. For example, 'android-battery-optimization'."
        ),
    }),
    annotations: {
      title: "Get Official Plugin API Documentation",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capawesome Documentation",
    },
  },
  async ({ plugin_id }, { capawesomeData }) => {
    const plugin = capawesomeData.find((p) => p.slug === plugin_id);
    if (!plugin) {
      throw new Error(
        `Plugin not found: ${plugin_id}\n\nList of plugins:\n\n${capawesomeData
          .map((p) => p.slug)
          .join("\n")}`
      );
    }
    return toContent(
      {
        plugin_info: [
          {
            name: plugin.name,
            url: plugin.url,
            slug: plugin.slug,
            insider: plugin.insider
              ? "Insider, please contact support@capawesome.io for a license key if you don't have one."
              : "Free plugin",
            api_doc: plugin.api_doc,
          },
        ],
      },
      {
        contentPrefix: `API documentation for the Capawesome Capacitor plugin <${plugin.name}>:\n\n`,
      }
    );
  }
);
