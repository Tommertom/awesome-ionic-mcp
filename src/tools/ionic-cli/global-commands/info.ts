import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI, parseJSONOutput } from "../cli-utils.js";

export const ionic_info = tool(
  {
    name: "ionic_info",
    description:
      "Get comprehensive project, system, and environment information including Ionic version, Node version, OS details, and installed packages",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Optional project directory path. Defaults to current directory."),
      format: z
        .enum(["json", "text"])
        .optional()
        .default("json")
        .describe("Output format: json for structured data or text for human-readable output"),
    }),
    annotations: {
      title: "Get Ionic Project and System Information",
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async ({ project_directory, format }) => {
    const args = ["info"];
    if (format === "json") {
      args.push("--json");
    }

    const result = await executeIonicCLI(args, project_directory);

    if (!result.success) {
      return mcpError(
        `Failed to get Ionic info: ${result.stderr || result.stdout}`
      );
    }

    let data: any;
    if (format === "json") {
      data = parseJSONOutput(result.stdout);
      if (!data) {
        data = { raw_output: result.stdout };
      }
    } else {
      data = { info: result.stdout };
    }

    return toContent({
      success: true,
      format,
      data,
      duration_ms: result.duration,
    });
  }
);
