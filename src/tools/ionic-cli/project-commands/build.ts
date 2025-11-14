import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI, findProjectRoot } from "../cli-utils.js";

export const ionic_build = tool(
  {
    name: "ionic_build",
    description:
      "Build web assets and prepare your Ionic app for deployment. Compiles TypeScript, bundles JavaScript, and optimizes assets.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      prod: z
        .boolean()
        .optional()
        .describe("Build for production with optimizations (minification, tree-shaking, etc.)"),
      configuration: z
        .string()
        .optional()
        .describe("Specify build configuration to use (e.g., 'production', 'development')"),
      platform: z
        .string()
        .optional()
        .describe("Target platform (e.g., 'ios', 'android')"),
      engine: z
        .string()
        .optional()
        .describe("Target engine (e.g., 'browser', 'cordova')"),
      source_map: z
        .boolean()
        .optional()
        .describe("[Angular] Output source maps for debugging"),
    }),
    annotations: {
      title: "Build Ionic Project",
      idempotentHint: true,
    },
  },
  async ({ project_directory, prod, configuration, platform, engine, source_map }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["build"];
    
    if (prod) {
      args.push("--prod");
    }
    
    if (configuration) {
      args.push("--configuration", configuration);
    }
    
    if (platform) {
      args.push("--platform", platform);
    }
    
    if (engine) {
      args.push("--engine", engine);
    }
    
    if (source_map) {
      args.push("--source-map");
    }

    const result = await executeIonicCLI(args, workDir, 600000); // 10 minute timeout

    if (!result.success) {
      return mcpError(
        `Build failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      prod: prod || false,
      configuration,
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);
