import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_official_plugins } from "./get_all_official_plugins.js";
import { get_official_plugin_api } from "./get_official_plugin_api.js";
import { available_official_capacitor_plugins } from "./official_plugins.js";

export const capacitorjs_com: ServerTool[] = [
  get_official_plugin_api,
  get_all_official_plugins,
];

export const loadOfficialCapacitorPlugins = async () => {
  // console log only the stats for available_official_capacitor_plugins
  setTimeout(() => {
    console.log(
      `Loaded ${available_official_capacitor_plugins.length} official Capacitor plugins`
    );
  }, 1000);
};
