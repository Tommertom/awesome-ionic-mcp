import { ServerTool } from "../../mcp-utils/tools.js";

// Global commands
import {
  ionic_info,
  ionic_config_get,
  ionic_config_set,
  ionic_config_unset,
  ionic_start,
  ionic_start_list,
  ionic_init,
} from "./global-commands/index.js";

// Project commands
import {
  ionic_build,
  ionic_serve,
  ionic_generate,
  ionic_repair,
  integrations_list,
  integrations_enable,
  integrations_disable,
} from "./project-commands/index.js";

// Capacitor commands
import {
  capacitor_doctor,
  capacitor_list_plugins,
  capacitor_sync,
  capacitor_copy,
  capacitor_update,
  capacitor_init,
  capacitor_add,
  capacitor_build,
  capacitor_run,
  capacitor_open,
  capacitor_migrate,
} from "./capacitor-commands/index.js";

export const ionic_cli_tools: ServerTool[] = [
  // Global commands
  ionic_info,
  ionic_config_get,
  ionic_config_set,
  ionic_config_unset,
  ionic_start,
  ionic_start_list,
  ionic_init,
  
  // Project commands
  ionic_build,
  ionic_serve,
  ionic_generate,
  ionic_repair,
  integrations_list,
  integrations_enable,
  integrations_disable,
  
  // Capacitor commands
  capacitor_doctor,
  capacitor_list_plugins,
  capacitor_sync,
  capacitor_copy,
  capacitor_update,
  capacitor_init,
  capacitor_add,
  capacitor_build,
  capacitor_run,
  capacitor_open,
  capacitor_migrate,
];
