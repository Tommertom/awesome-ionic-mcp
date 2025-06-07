import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_official_plugins } from "./get_all_official_plugins.js";
import { get_official_plugin_api } from "./get_official_plugin_api.js";

export const capacitorjs_com: ServerTool[] = [
  get_official_plugin_api,
  get_all_official_plugins,
];
