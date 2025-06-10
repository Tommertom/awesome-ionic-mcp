import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_capacitor_plugins } from "./get_all_capacitor_community_plugins.js";
import { get_all_capacitor_plugin_publishers } from "./get_all_capacitor_plugin_publishers.js";

export const all_capacitor_plugins: ServerTool[] = [
  get_all_capacitor_plugins,
  get_all_capacitor_plugin_publishers,
];
