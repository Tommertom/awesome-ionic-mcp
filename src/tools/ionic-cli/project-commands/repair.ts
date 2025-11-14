import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI, findProjectRoot } from "../cli-utils.js";

export const ionic_repair = tool(
  {
    name: "ionic_repair",
    description:
      "Remove and recreate dependencies and generated files. Useful for fixing obscure errors or corrupted node_modules.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      cordova_only: z
        .boolean()
        .optional()
        .describe("Only perform repair steps for Cordova platforms and plugins"),
    }),
    annotations: {
      title: "Repair Ionic Project Dependencies",
      destructiveHint: true,
    },
  },
  async ({ project_directory, cordova_only }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["repair"];
    
    if (cordova_only) {
      args.push("--cordova");
    }

    const result = await executeIonicCLI(args, workDir, 600000); // 10 minute timeout

    if (!result.success) {
      return mcpError(
        `Repair failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      cordova_only: cordova_only || false,
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);
