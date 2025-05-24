import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_ionic_components } from "./get_all_components.js";
import { get_ionic_component_definition } from "./get_component_definition.js";

export const coreJsonTools: ServerTool[] = [
  get_ionic_component_definition,
  get_all_ionic_components,
];
