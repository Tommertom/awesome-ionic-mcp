import { z } from "zod";
import { tool } from "../../../mcp-utils/tools.js";
import { toContent, mcpError } from "../../../mcp-utils/utils.js";
import { executeIonicCLI } from "../cli-utils.js";

export const ionic_config_get = tool(
  {
    name: "ionic_config_get",
    description:
      "Read CLI or project configuration values from ionic.config.json or global config",
    inputSchema: z.object({
      key: z
        .string()
        .optional()
        .describe("Configuration key to retrieve. If omitted, returns all config values."),
      global: z
        .boolean()
        .optional()
        .describe("If true, reads from global CLI config (~/.ionic/config.json) instead of project config"),
    }),
    annotations: {
      title: "Get Ionic Configuration Value",
      readOnlyHint: true,
      idempotentHint: true,
    },
  },
  async ({ key, global }) => {
    const args = ["config", "get"];
    
    if (key) {
      args.push(key);
    }
    
    if (global) {
      args.push("--global");
    }

    const result = await executeIonicCLI(args);

    if (!result.success) {
      return mcpError(
        `Failed to get config: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      key: key || "all",
      value: result.stdout.trim(),
      global: global || false,
    });
  }
);

export const ionic_config_set = tool(
  {
    name: "ionic_config_set",
    description:
      "Set CLI or project configuration value in ionic.config.json or global config",
    inputSchema: z.object({
      key: z.string().describe("Configuration key to set"),
      value: z.string().describe("Configuration value to set"),
      global: z
        .boolean()
        .optional()
        .describe("If true, sets in global CLI config (~/.ionic/config.json) instead of project config"),
    }),
    annotations: {
      title: "Set Ionic Configuration Value",
      destructiveHint: false,
      idempotentHint: false,
    },
  },
  async ({ key, value, global }) => {
    const args = ["config", "set", key, value];
    
    if (global) {
      args.push("--global");
    }

    const result = await executeIonicCLI(args);

    if (!result.success) {
      return mcpError(
        `Failed to set config: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      key,
      value,
      global: global || false,
      message: `Configuration ${key} set to ${value}`,
    });
  }
);

export const ionic_config_unset = tool(
  {
    name: "ionic_config_unset",
    description:
      "Delete/unset CLI or project configuration value from ionic.config.json or global config",
    inputSchema: z.object({
      key: z.string().describe("Configuration key to unset/delete"),
      global: z
        .boolean()
        .optional()
        .describe("If true, unsets from global CLI config (~/.ionic/config.json) instead of project config"),
    }),
    annotations: {
      title: "Unset Ionic Configuration Value",
      destructiveHint: true,
      idempotentHint: false,
    },
  },
  async ({ key, global }) => {
    const args = ["config", "unset", key];
    
    if (global) {
      args.push("--global");
    }

    const result = await executeIonicCLI(args);

    if (!result.success) {
      return mcpError(
        `Failed to unset config: ${result.stderr || result.stdout}`
      );
    }

    return toContent({
      success: true,
      key,
      global: global || false,
      message: `Configuration ${key} unset`,
    });
  }
);
