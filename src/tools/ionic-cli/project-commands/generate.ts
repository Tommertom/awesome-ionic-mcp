import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI, findProjectRoot } from "../cli-utils.js";

export const ionic_generate = tool(
  {
    name: "ionic_generate",
    description:
      "Generate pages, components, services, and other Angular/React/Vue features. Framework-specific code scaffolding.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      type: z
        .string()
        .describe("Type of feature to generate (e.g., 'page', 'component', 'service', 'module', 'guard', 'pipe', 'directive')"),
      name: z
        .string()
        .describe("Name of the feature to generate (e.g., 'home', 'user-profile', 'auth')"),
    }),
    annotations: {
      title: "Generate Ionic Page/Component/Service",
      destructiveHint: false,
    },
  },
  async ({ project_directory, type, name }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["generate", type, name];

    const result = await executeIonicCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Failed to generate ${type}: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      type,
      name,
      project_directory: workDir,
      output: result.stdout,
    });
  }
);
