import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeCapacitorCLI, findProjectRoot } from "../cli-utils.js";

export const capacitor_build = tool(
  {
    name: "capacitor_build",
    description:
      "Build the release version of the selected native platform (creates .apk for Android or .app for iOS)",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .describe("Platform to build (ios or android)"),
      scheme: z
        .string()
        .optional()
        .describe("[iOS] Scheme to build"),
      flavor: z
        .string()
        .optional()
        .describe("[Android] Flavor to build"),
    }),
    annotations: {
      title: "Build Native Platform Release",
      idempotentHint: false,
    },
  },
  async ({ project_directory, platform, scheme, flavor }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["build", platform];
    
    if (scheme) {
      args.push("--scheme", scheme);
    }
    
    if (flavor) {
      args.push("--flavor", flavor);
    }

    const result = await executeCapacitorCLI(args, workDir, 600000); // 10 minute timeout

    if (!result.success) {
      return mcpError(
        `Build failed: ${result.stderr || result.stdout}`
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

export const capacitor_run = tool(
  {
    name: "capacitor_run",
    description:
      "Run the app on a connected device or emulator. Performs sync, build, and deploy in one command.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .describe("Platform to run (ios or android)"),
      target: z
        .string()
        .optional()
        .describe("Deploy to specific device by ID. Use capacitor_run_list to see available targets."),
      list: z
        .boolean()
        .optional()
        .describe("List all available targets (devices and emulators) instead of running"),
    }),
    annotations: {
      title: "Run App on Device/Emulator",
      destructiveHint: false,
    },
  },
  async ({ project_directory, platform, target, list }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["run", platform];
    
    if (list) {
      args.push("--list");
    }
    
    if (target) {
      args.push("--target", target);
    }

    const result = await executeCapacitorCLI(args, workDir, 600000); // 10 minute timeout

    if (!result.success && !list) {
      return mcpError(
        `Run failed: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform,
      target,
      list: list || false,
      output: result.stdout,
      duration_ms: result.duration,
    });
  }
);

export const capacitor_open = tool(
  {
    name: "capacitor_open",
    description:
      "Open the native IDE for the platform (Xcode for iOS, Android Studio for Android)",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      platform: z
        .enum(["ios", "android"])
        .describe("Platform IDE to open (ios for Xcode, android for Android Studio)"),
    }),
    annotations: {
      title: "Open Native IDE",
      destructiveHint: false,
    },
  },
  async ({ project_directory, platform }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["open", platform];

    const result = await executeCapacitorCLI(args, workDir);

    if (!result.success) {
      return mcpError(
        `Failed to open IDE: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      project_directory: workDir,
      platform,
      message: `Opening ${platform === "ios" ? "Xcode" : "Android Studio"}`,
      output: result.stdout,
    });
  }
);
