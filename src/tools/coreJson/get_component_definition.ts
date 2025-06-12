import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";

export const get_ionic_component_definition = tool(
  {
    name: "get_ionic_component_definition",
    description:
      "Retrieves the typescript definition of an Ionic component based on its HTML tag.",
    inputSchema: z.object({
      html_tag: z
        .string()
        .describe(
          "The HTML tag of the Ionic component to retrieve. For example, 'ion-button'."
        ),
    }),
    annotations: {
      title: "Get Ionic Component Definition from core.json",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Core JSON based tools",
    },
  },
  async ({ html_tag }, { coreJson, liveViewer }) => {
    if (html_tag === undefined) {
      return mcpError(
        `No HTML tag supplied in get_ionic_component_definition tool`
      );
    }
    const component = coreJson.ionic_component_map[html_tag];
    if (!component) {
      return mcpError(`Component not found: ${html_tag}`);
    }

    // if liveViewer is set, open the plugin's API documentation in a new page
    const url = `https://ionicframework.com/docs/api/${html_tag}`;
    if (liveViewer.puppeteerPage) {
      const page = liveViewer.puppeteerPage;
      await page.goto(url, {
        waitUntil: "networkidle0",
      });
      liveViewer.lastURL = url;
    }

    return toContent({ component });
  }
);
