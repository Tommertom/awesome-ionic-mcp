import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";

export const get_ionic_component_definition = tool(
  {
    name: "get_ionic_component_definition",
    description:
      "Retrieves the definition of an Ionic component based on its HTML tag.",
    inputSchema: z.object({
      html_tag: z
        .string()
        .describe(
          "The HTML tag of the Ionic component to retrieve. For example, 'ion-button'."
        ),
    }),
    annotations: {
      title: "Get Ionic Component Definition",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Core JSON based tools",
    },
  },
  async ({ html_tag }, { coreJson }) => {
    if (html_tag === undefined) {
      return mcpError(
        `No HTML tag supplied in get_ionic_component_definition tool`
      );
    }
    const component = coreJson.ionic_component_map[html_tag];
    if (!component) {
      return mcpError(`Component not found: ${html_tag}`);
    }
    return toContent({ component });
  }
);
