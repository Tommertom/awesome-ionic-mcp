import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI } from "../cli-utils.js";

export const ionic_init = tool(
  {
    name: "ionic_init",
    description:
      "Initialize an existing project with Ionic. Creates ionic.config.json file and configures the project for Ionic CLI.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .describe("Directory of the existing project to initialize with Ionic"),
      name: z
        .string()
        .optional()
        .describe("Optional name for your project. If not provided, will be prompted or use directory name."),
      type: z
        .enum(["angular", "react", "vue", "custom", "vue-vite", "react-vite", "angular-standalone"])
        .optional()
        .describe("Type of project (framework)"),
      force: z
        .boolean()
        .optional()
        .describe("Initialize even if a project already exists (overwrites existing config)"),
      multi_app: z
        .boolean()
        .optional()
        .describe("Initialize as a multi-app project (monorepo support)"),
      project_id: z
        .string()
        .optional()
        .describe("[multi-app] Specify a slug for your app"),
      default: z
        .boolean()
        .optional()
        .describe("[multi-app] Mark the initialized app as the default project"),
    }),
    annotations: {
      title: "Initialize Existing Project with Ionic",
      destructiveHint: false,
    },
  },
  async ({ project_directory, name, type, force, multi_app, project_id, default: isDefault }) => {
    const args = ["init"];
    
    if (name) {
      args.push(name);
    }
    
    if (type) {
      args.push("--type", type);
    }
    
    if (force) {
      args.push("--force");
    }
    
    if (multi_app) {
      args.push("--multi-app");
    }
    
    if (project_id) {
      args.push("--project-id", project_id);
    }
    
    if (isDefault) {
      args.push("--default");
    }

    const result = await executeIonicCLI(args, project_directory);

    if (!result.success) {
      return mcpError(
        `Failed to initialize project: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory,
      name,
      type,
      multi_app: multi_app || false,
      output: result.stdout,
    });
  }
);
