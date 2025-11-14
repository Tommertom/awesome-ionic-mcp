import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeCapacitorCLI, findProjectRoot } from "../cli-utils.js";

export const capacitor_init = tool(
  {
    name: "capacitor_init",
    description:
      "Initialize Capacitor configuration in the project. Creates capacitor.config.json file.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory."),
      app_name: z
        .string()
        .optional()
        .describe("Application name (e.g., 'My App')"),
      app_id: z
        .string()
        .optional()
        .describe("Application ID in reverse-DNS notation (e.g., 'com.example.app')"),
      web_dir: z
        .string()
        .optional()
        .describe("Web assets directory (e.g., 'www', 'build', 'dist')"),
    }),
    annotations: {
      title: "Initialize Capacitor Configuration",
      destructiveHint: false,
    },
  },
  async ({ project_directory, app_name, app_id, web_dir }) => {
    const workDir = project_directory || process.cwd();
    
    const args = ["init"];
    
    if (app_name) {
      args.push(app_name);
    }
    
    if (app_id) {
      args.push(app_id);
    }
    
    if (web_dir) {
      args.push("--web-dir", web_dir);
    }

    const result = await executeCapacitorCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Init failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      app_name,
      app_id,
      web_dir,
      output: result.stdout,
    });
  }
);

export const capacitor_add = tool(
  {
    name: "capacitor_add",
    description:
      "Add a native platform (iOS or Android) to the Capacitor project. Creates the native project files.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .describe("Platform to add (ios or android)"),
    }),
    annotations: {
      title: "Add Native Platform to Capacitor Project",
      destructiveHint: false,
    },
  },
  async ({ project_directory, platform }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["add", platform];

    const result = await executeCapacitorCLI(args, workDir, 300000); // 5 minute timeout

    if (!result.success) {
      return mcpError(
        `Failed to add platform: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform,
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);
