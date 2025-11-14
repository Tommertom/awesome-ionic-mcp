import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeCapacitorCLI, findProjectRoot } from "../cli-utils.js";

export const capacitor_doctor = tool(
  {
    name: "capacitor_doctor",
    description:
      "Check Capacitor setup for common configuration errors, missing dependencies, and platform-specific issues",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .optional()
        .describe("Check specific platform (ios or android). If not provided, checks all platforms."),
    }),
    annotations: {
      title: "Check Capacitor Configuration",
      readOnlyHint: true,
    },
  },
  async ({ project_directory, platform }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["doctor"];
    
    if (platform) {
      args.push(platform);
    }

    const result = await executeCapacitorCLI(args, workDir);

    return toContent({
      success: result.success,
      project_directory: workDir,
      platform: platform || "all",
      report: result.stdout,
      warnings: result.stderr || undefined,
      exit_code: result.exitCode,
    });
  }
);
