import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeCapacitorCLI, findProjectRoot } from "../cli-utils.js";

export const capacitor_list_plugins = tool(
  {
    name: "capacitor_list_plugins",
    description:
      "List all installed Cordova and Capacitor plugins in the project with their versions and IDs",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .optional()
        .describe("List plugins for specific platform. If not provided, lists all plugins."),
    }),
    annotations: {
      title: "List Installed Capacitor Plugins",
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async ({ project_directory, platform }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["ls"];
    
    if (platform) {
      args.push(platform);
    }

    const result = await executeCapacitorCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Failed to list plugins: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform: platform || "all",
      plugins: result.stdout,
    });
  }
);
