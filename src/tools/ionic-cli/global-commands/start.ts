import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI } from "../cli-utils.js";

export const ionic_start = tool(
  {
    name: "ionic_start",
    description:
      "Create a new Ionic project with the specified name, template, and framework type. Installs dependencies and sets up the project structure.",
    inputSchema: z.object({
      name: z.string().describe("The name of your new project (e.g., 'myApp' or 'My App')"),
      template: z
        .string()
        .optional()
        .describe("Starter template to use (e.g., blank, tabs, sidemenu, list). Use ionic_start_list to see all available templates."),
      type: z
        .enum(["angular", "react", "vue", "angular-standalone"])
        .optional()
        .describe("Type of project framework to use"),
      capacitor: z
        .boolean()
        .optional()
        .describe("Include Capacitor integration for native functionality"),
      package_id: z
        .string()
        .optional()
        .describe("Specify the bundle ID/application ID for your app (reverse-DNS notation, e.g., com.mycompany.myapp)"),
      no_deps: z
        .boolean()
        .optional()
        .describe("Do not install npm/yarn dependencies (faster but requires manual install later)"),
      no_git: z
        .boolean()
        .optional()
        .describe("Do not initialize a git repository"),
      project_id: z
        .string()
        .optional()
        .describe("Specify a slug for your app (used for directory name and package name)"),
    }),
    annotations: {
      title: "Create New Ionic Project",
      destructiveHint: true,
    },
  },
  async ({ name, template, type, capacitor, package_id, no_deps, no_git, project_id }) => {
    const args = ["start", name];
    
    if (template) {
      args.push(template);
    }
    
    if (type) {
      args.push("--type", type);
    }
    
    if (capacitor) {
      args.push("--capacitor");
    }
    
    if (package_id) {
      args.push("--package-id", package_id);
    }
    
    if (no_deps) {
      args.push("--no-deps");
    }
    
    if (no_git) {
      args.push("--no-git");
    }
    
    if (project_id) {
      args.push("--project-id", project_id);
    }

    args.push("--no-interactive");

    const result = await executeIonicCLI(args, undefined, 600000); // 10 minute timeout

    if (!result.success) {
      return mcpError(
        `Failed to create project: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_name: name,
      template,
      type,
      capacitor: capacitor || false,
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);

export const ionic_start_list = tool(
  {
    name: "ionic_start_list",
    description:
      "List all available Ionic starter templates that can be used with ionic_start command",
    inputSchema: z.object({}),
    annotations: {
      title: "List Ionic Starter Templates",
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async () => {
    const result = await executeIonicCLI(["start", "--list"]);

    if (!result.success) {
      return mcpError(
        `Failed to list templates: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      templates: result.stdout,
    });
  }
);
