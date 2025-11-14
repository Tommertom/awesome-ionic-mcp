import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeCapacitorCLI, findProjectRoot } from "../cli-utils.js";

export const capacitor_migrate = tool(
  {
    name: "capacitor_migrate",
    description:
      "Migrate Capacitor project to the latest major version. Updates dependencies and configuration files.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
    }),
    annotations: {
      title: "Migrate Capacitor to Latest Version",
      destructiveHint: true,
    },
  },
  async ({ project_directory }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["migrate"];

    const result = await executeCapacitorCLI(args, workDir, 600000); // 10 minute timeout

    if (!result.success) {
      return mcpError(
        `Migration failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);
