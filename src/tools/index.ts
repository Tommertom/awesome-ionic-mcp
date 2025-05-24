import { ServerTool } from "../mcp-utils/tools.js";
import { coreJsonTools } from "./coreJson/index.js";
import { docs_demo_io } from "./docs-demo.io/index.js";
import { ionic_framework_com } from "./ionicframework.com/index.js";

export const SERVER_FEATURES = [
  "coreJsonTools",
  "ionic_framework_com",
  "docs_demo_io",
] as const;
export type ServerFeature = (typeof SERVER_FEATURES)[number];

const tools: Record<ServerFeature, ServerTool[]> = {
  coreJsonTools: addFeaturePrefix("@ionic/core.json", coreJsonTools),
  ionic_framework_com: addFeaturePrefix(
    "ionicframework.com",
    ionic_framework_com
  ),
  docs_demo_io: addFeaturePrefix("docs-demo.ionic.io", docs_demo_io),
};

export function availableTools(activeFeatures?: ServerFeature[]): ServerTool[] {
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
      name: `${tool.mcp.name}`,
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
    doc += `
| ${tool.mcp.name} | ${feature} | ${tool.mcp?.description || ""} |`;
  }
  return doc;
}
