// taken from https://github.com/firebase/firebase-tools/blob/master/src/mcp/util.ts

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z, ZodTypeAny } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { cleanSchema } from "./utils.js";

export interface ServerToolContext {
  coreJson: {
    downloaded_data: any;
    ionic_component_map: {
      [key: string]: any;
    };
    version: string;
  };
}

export interface ServerTool<InputSchema extends ZodTypeAny = ZodTypeAny> {
  mcp: {
    name: string;
    description?: string;
    inputSchema: any;
    annotations?: {
      title?: string;
      readOnlyHint?: boolean;
      destructiveHint?: boolean;
      idempotentHint?: boolean;
      openWorldHint?: boolean;
    };
    _meta?: {
      /** Tools are grouped by feature. --only can configure what tools is available. */
      feature?: string;
    };
  };
  fn: (
    input: z.infer<InputSchema>,
    ctx: ServerToolContext
  ) => Promise<CallToolResult>;
}

export function tool<InputSchema extends ZodTypeAny>(
  options: Omit<ServerTool<InputSchema>["mcp"], "inputSchema"> & {
    inputSchema: InputSchema;
  },
  fn: ServerTool<InputSchema>["fn"]
): ServerTool {
  return {
    mcp: {
      ...options,
      inputSchema: cleanSchema(zodToJsonSchema(options.inputSchema)),
    },
    fn,
  };
}
