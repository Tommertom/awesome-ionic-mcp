import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_free_plugins } from "./get_all_free_plugins.js";
import { get_all_insider_plugins } from "./get_all_insider_plugins.js";
import { get_all_plugins } from "./get_all_plugins.js";

export const capawesome_io: ServerTool[] = [
  get_all_plugins,
  get_all_free_plugins,
  get_all_insider_plugins,

  //   get_all_insider_plugins,
  //   get_all_free_plugins
  //
];

export interface CapAwesomePlugin {
  name: string;
  url: string;
  slug: string;
  api_doc: string;
  insider: boolean;
}

export const loadCoreCapAwesomeData = async (): Promise<CapAwesomePlugin[]> => {
  try {
    // fetch the https://capawesome.io/llms.txt
    const response = await fetch("https://capawesome.io/llms.txt");
    const content = await response.text();

    // Find the plugins section (marked by ##)
    const lines = content.split("\n");
    let inPluginSection = false;
    const plugins: CapAwesomePlugin[] = [];

    // Iterate through lines to find plugin entries
    for (const line of lines) {
      // Check if we're entering a plugin section
      if (line.startsWith("##") && line.toLowerCase().includes("plugin")) {
        inPluginSection = true;
        continue;
      }

      // Check if we're leaving the plugin section (next ## section)
      if (inPluginSection && line.startsWith("##")) {
        break;
      }

      // Parse plugin lines
      if (inPluginSection && line.trim().startsWith("- [")) {
        const match = line.match(/- \[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const [, name, url] = match;
          const slug = url.split("/").slice(-2, -1)[0]; // Extract slug from URL

          // skip Plugin with the name "Plugins"
          if (name.trim().toLowerCase() === "plugins") {
            continue;
          }

          plugins.push({
            name: name.trim(),
            url: url.trim(),
            slug: slug,
            api_doc: ``,
            insider: false,
          });
        }
      }
    }

    // Fetch MD content for each plugin
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      try {
        const mdResponse = await fetch(plugin.url);
        if (mdResponse.ok) {
          const mdContent = await mdResponse.text();
          plugin.api_doc = mdContent;

          // Check if this is an insider plugin
          if (mdContent.includes("YOUR_LICENSE_KEY")) {
            plugin.insider = true;
          }
        } else {
          console.warn(
            `Failed to fetch MD for ${plugin.name}: ${mdResponse.status} ${mdResponse.statusText}`
          );
          plugin.api_doc = `Error: Failed to fetch content (${mdResponse.status})`;
        }
      } catch (error) {
        console.error(`Error fetching MD for ${plugin.name}:`, error);
        plugin.api_doc = `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }

      // Add a small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return plugins;
  } catch (error) {
    console.error("Error loading CapAwesome data:", error);
    return [];
  }
};
