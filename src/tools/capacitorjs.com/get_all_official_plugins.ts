import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { toContent } from "../../mcp-utils/utils.js";

import { available_official_plugins } from "./official_plugins.js";

export const get_all_official_plugins = tool(
  {
    name: "get_all_official_plugins",
    description: "Retrieves list of all Official Capacitor plugins.",
    inputSchema: z.object({}),
    annotations: {
      title: "Get Capacitor Official Plugin Information from Official Docs",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capacitor Documentation",
    },
  },
  async ({}, { coreJson }) => {
    return toContent({ plugins: available_official_plugins });
  }
);
