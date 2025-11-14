import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI, findProjectRoot } from "../cli-utils.js";

export const ionic_serve = tool(
  {
    name: "ionic_serve",
    description:
      "Start a local development server for the Ionic app. Opens browser and watches for file changes with live reload.",
    inputSchema: z.object({
      project_directory: z
        .string()
        .optional()
        .describe("Project directory path. If not provided, uses current directory or searches upward for ionic.config.json."),
      port: z
        .number()
        .optional()
        .describe("Port number for the dev server (default: 8100)"),
      host: z
        .string()
        .optional()
        .describe("Host for the dev server (default: localhost)"),
      external: z
        .boolean()
        .optional()
        .describe("Host dev server on all network interfaces (0.0.0.0) for LAN access"),
      no_open: z
        .boolean()
        .optional()
        .describe("Do not automatically open browser window"),
      no_livereload: z
        .boolean()
        .optional()
        .describe("Do not start live reload server - just serve static files"),
      browser: z
        .string()
        .optional()
        .describe("Specify browser to open (safari, firefox, google-chrome)"),
      browser_option: z
        .string()
        .optional()
        .describe("Path to open in browser (e.g., '/#/tab/dash')"),
    }),
    annotations: {
      title: "Start Ionic Development Server",
      destructiveHint: false,
    },
  },
  async ({ project_directory, port, host, external, no_open, no_livereload, browser, browser_option }) => {
    const workDir = project_directory || (await findProjectRoot()) || process.cwd();
    
    const args = ["serve"];
    
    if (port) {
      args.push("--port", port.toString());
    }
    
    if (host) {
      args.push("--host", host);
    }
    
    if (external) {
      args.push("--external");
    }
    
    if (no_open) {
      args.push("--no-open");
    }
    
    if (no_livereload) {
      args.push("--no-livereload");
    }
    
    if (browser) {
      args.push("--browser", browser);
    }
    
    if (browser_option) {
      args.push("--browseroption", browser_option);
    }

    return toContent({
      success: false,
      message: "ionic_serve is a long-running command that starts a development server. This tool would need special handling to run in the background. For now, please run 'ionic serve' manually in your terminal.",
      suggested_command: `cd ${workDir} && ionic serve ${args.slice(1).join(" ")}`,
      note: "Future implementation will support background server management",
    });
  }
);
