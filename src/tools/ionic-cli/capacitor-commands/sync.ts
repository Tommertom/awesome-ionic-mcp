import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeCapacitorCLI, findProjectRoot } from "../cli-utils.js";

export const capacitor_sync = tool(
  {
    name: "capacitor_sync",
    description:
      "Copy web assets to native platforms and update native dependencies. Combines 'cap copy' and 'cap update' into one command.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .optional()
        .describe("Sync specific platform (ios or android). If not provided, syncs all platforms."),
      deployment: z
        .boolean()
        .optional()
        .describe("Use deployment configuration"),
    }),
    annotations: {
      title: "Sync Capacitor Web Assets and Dependencies",
      idempotentHint: true,
    },
  },
  async ({ project_directory, platform, deployment }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["sync"];
    
    if (platform) {
      args.push(platform);
    }
    
    if (deployment) {
      args.push("--deployment");
    }

    const result = await executeCapacitorCLI(args, workDir, 300000); // 5 minute timeout

    if (!result.success) {
      return mcpError(
        `Sync failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform: platform || "all",
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);

export const capacitor_copy = tool(
  {
    name: "capacitor_copy",
    description:
      "Copy web app build into the native app platforms without updating dependencies",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .optional()
        .describe("Copy to specific platform (ios or android). If not provided, copies to all platforms."),
    }),
    annotations: {
      title: "Copy Web Assets to Native Platforms",
      idempotentHint: true,
    },
  },
  async ({ project_directory, platform }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["copy"];
    
    if (platform) {
      args.push(platform);
    }

    const result = await executeCapacitorCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Copy failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform: platform || "all",
      output: result.stdout,
    });
  }
);

export const capacitor_update = tool(
  {
    name: "capacitor_update",
    description:
      "Update native plugins and dependencies based on package.json. Does not copy web assets.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .optional()
        .describe("Update specific platform (ios or android). If not provided, updates all platforms."),
    }),
    annotations: {
      title: "Update Capacitor Native Dependencies",
      idempotentHint: true,
    },
  },
  async ({ project_directory, platform }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["update"];
    
    if (platform) {
      args.push(platform);
    }

    const result = await executeCapacitorCLI(args, workDir, 300000); // 5 minute timeout

    if (!result.success) {
      return mcpError(
        `Update failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform: platform || "all",
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);
