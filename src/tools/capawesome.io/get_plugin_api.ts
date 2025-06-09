import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent } from "../../mcp-utils/utils.js";

export const get_plugin_api = tool(
  {
    name: "get_plugin_api",
    description:
      "Retrieves API documentation for a specific Capawesome Capacitor plugin.",
    inputSchema: z.object({
      slug: z
        .string()
        .describe(
          "The slug tag of the Capawesome Capacitor plugin to retrieve based on a slug. For example, 'android-battery-optimization'."
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
  async ({ slug }, { capawesomeData }) => {
    const plugin = capawesomeData.find((p) => p.slug === slug);
    if (!plugin) {
      throw new Error(
        `Plugin not found: ${slug}\n\nQuery again using the exact slug. List of plugins:\n\n${capawesomeData
          .map((p) => `- ${p.name} - slug: ${p.slug}`)
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
              ? "Insider plugin, please contact support@capawesome.io for a license key if you don't have one."
              : "Free plugin",
            api_doc: plugin.api_doc,
          },
        ],
      },
      {
        contentPrefix: `API documentation for the Capawesome Capacitor plugin <${plugin.name}, slug ${plugin.slug}>:\n\n`,
      }
    );
  }
);

// https://capawesome.io/plugins/barcode-scanning/index.md
//
