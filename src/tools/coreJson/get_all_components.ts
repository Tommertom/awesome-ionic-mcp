import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";

export const get_all_ionic_components = tool(
  {
    name: "get_all_ionic_components",
    description: "Retrieves the definition of all Ionic components.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get All Ionic Components",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Core JSON based tools",
    },
  },
  async ({}, { coreJson }) => {
    if (!coreJson.ionic_component_map) {
      return mcpError(
        `No Ionic component map found in get_all_ionic_components tool`
      );
    }
    return toContent({
      components: Object.values(coreJson.ionic_component_map),
    });
  }
);
