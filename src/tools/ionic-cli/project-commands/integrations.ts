import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI, findProjectRoot } from "../cli-utils.js";

export const integrations_list = tool(
  {
    name: "integrations_list",
    description:
      "List all available and currently active integrations in the Ionic project (e.g., Capacitor, Cordova)",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
    }),
    annotations: {
      title: "List Ionic Integrations",
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async ({ project_directory }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["integrations", "list"];

    const result = await executeIonicCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Failed to list integrations: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      integrations: result.stdout,
    });
  }
);

export const integrations_enable = tool(
  {
    name: "integrations_enable",
    description:
      "Add and enable an integration in the Ionic project (e.g., capacitor, cordova)",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      integration: z
        .string()
        .describe("Integration name to enable (e.g., 'capacitor', 'cordova')"),
    }),
    annotations: {
      title: "Enable Ionic Integration",
      destructiveHint: false,
    },
  },
  async ({ project_directory, integration }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["integrations", "enable", integration];

    const result = await executeIonicCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Failed to enable integration: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      integration,
      message: `Integration '${integration}' enabled`,
      output: result.stdout,
    });
  }
);

export const integrations_disable = tool(
  {
    name: "integrations_disable",
    description:
      "Disable and remove an integration from the Ionic project",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      integration: z
        .string()
        .describe("Integration name to disable (e.g., 'capacitor', 'cordova')"),
    }),
    annotations: {
      title: "Disable Ionic Integration",
      destructiveHint: true,
    },
  },
  async ({ project_directory, integration }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["integrations", "disable", integration];

    const result = await executeIonicCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Failed to disable integration: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      integration,
      message: `Integration '${integration}' disabled`,
      output: result.stdout,
    });
  }
);
