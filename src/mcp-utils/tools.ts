// taken from https://github.com/firebase/firebase-tools/blob/master/src/mcp/util.ts

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z, ZodTypeAny } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { cleanSchema } from "./utils.js";
import { CapAwesomePlugin } from "../tools/capawesome.io/index.js";
import { CapacitorCommunityPlugin } from "../tools/capacitor-community/index.js";
import { CapGoPlugin } from "../tools/capgo/index.js";
import puppeteer from "puppeteer";

export interface ServerToolContext {
  coreJson: {
    downloaded_data: any;
    ionic_component_map: {
      [key: string]: any;
    };
    version: string;
  };
  capawesomeData: CapAwesomePlugin[];
  capacitorCommunityData: CapacitorCommunityPlugin[];
  capGoData: CapGoPlugin[];
  liveViewer: {
    puppeteerPage: puppeteer.Page | undefined;
    lastURL: string | undefined;
  };
}

export const emptyServerToolContext: ServerToolContext = {
  coreJson: {
    downloaded_data: {},
    ionic_component_map: {},
    version: "0.0.0",
  },
  capawesomeData: [],
  capacitorCommunityData: [],
  capGoData: [],
  liveViewer: {
    puppeteerPage: undefined,
    lastURL: undefined,
  },
};

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
