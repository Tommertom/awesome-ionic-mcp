import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_ionic_components } from "./get_all_components.js";
import { get_ionic_component_definition } from "./get_component_definition.js";
import { cleanedIonicDefinition, getIonicCoreWithRedirect } from "./utils.js";

export const coreJsonTools: ServerTool[] = [
  get_ionic_component_definition,
  get_all_ionic_components,
];

export const loadIonicCoreJSON = async () => {
  // loading coreData
  const downloadedData = await getIonicCoreWithRedirect(
    "https://unpkg.com/@ionic/docs/core.json"
  );

  if (!downloadedData) {
    throw new Error("Failed to download core JSON data from Ionic.");
  }

  const ionic_component_map: Record<string, any> = {};
  if (
    downloadedData.coreJson.components &&
    Array.isArray(downloadedData.coreJson.components)
  ) {
    const components = downloadedData.coreJson.components;
    components.forEach((component: any) => {
      if (component && component.tag) {
        ionic_component_map[component.tag] = cleanedIonicDefinition(component);
      }
    });
  }

  // console log the stats
  console.log(
    `Loaded ${
      Object.keys(ionic_component_map).length
    } Core Ionic UI components from JSON. Ionic version: ${
      downloadedData.version
    }`
  );

  return {
    downloaded_data: downloadedData.coreJson,
    version: downloadedData.version,
    ionic_component_map,
  };
};
