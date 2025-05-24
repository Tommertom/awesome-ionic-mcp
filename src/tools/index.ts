import { ServerTool } from "../mcp-utils/tools.js";
import { coreJsonTools } from "./coreJson/index.js";

export const SERVER_FEATURES = ["coreJsonTools"] as const;
export type ServerFeature = (typeof SERVER_FEATURES)[number];

const tools: Record<ServerFeature, ServerTool[]> = {
  coreJsonTools: addFeaturePrefix("coreJson", coreJsonTools),
};

/** availableTools returns the list of MCP tools available  */
export function availableTools(activeFeatures?: ServerFeature[]): ServerTool[] {
  // Core tools are always present.
  const toolDefs: ServerTool[] = [];
  if (!activeFeatures?.length) {
    activeFeatures = Object.keys(tools) as ServerFeature[];
  }
  for (const key of activeFeatures) {
    toolDefs.push(...tools[key]);
  }
  return toolDefs;
}

function addFeaturePrefix(feature: string, tools: ServerTool[]): ServerTool[] {
  return tools.map((tool) => ({
    ...tool,
    mcp: {
      ...tool.mcp,
      name: `${feature}_${tool.mcp.name}`,
      _meta: {
        ...tool.mcp._meta,
        feature,
      },
    },
  }));
}

/**
 * Generates a markdown table of all available tools and their descriptions.
 * This is used for generating documentation.
 */
export function markdownDocsOfTools(): string {
  const allTools = availableTools([]);
  let doc = `
| Tool Name | Feature Group | Description |
| --------- | ------------- | ----------- |`;
  for (const tool of allTools) {
    let feature = tool.mcp?._meta?.feature || "";
    if (feature === "firebase") {
      feature = "core";
    }
    doc += `
| ${tool.mcp.name} | ${feature} | ${tool.mcp?.description || ""} |`;
  }
  return doc;
}
