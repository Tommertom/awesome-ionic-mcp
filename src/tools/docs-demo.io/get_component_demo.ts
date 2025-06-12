import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";

export const get_component_demo = tool(
  {
    name: "get_component_demo",
    description:
      "Returns the component demo from the GitHub repository based on its HTML tag.",
    inputSchema: z.object({
      html_tag: z
        .string()
        .describe(
          "The HTML tag of the Ionic component to retrieve. For example, 'ion-button'."
        ),
    }),
    annotations: {
      title: "Get Ionic Component Demo code from Official Docs",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Ionic Kitchen Sink App",
    },
  },
  async ({ html_tag }, { liveViewer }) => {
    if (html_tag === undefined) {
      return mcpError(`No HTML tag supplied in get_component_demo tool`);
    }

    // trim whitespace and strip the 'ion-' prefix if it exists
    const clean_tag = html_tag.trim();
    const tag = clean_tag.startsWith("ion-") ? clean_tag.slice(4) : clean_tag;

    const stencil_code_url = `https://raw.githubusercontent.com/ionic-team/docs-demo/refs/heads/main/src/components/${tag}/${tag}.tsx`;

    const demo_url = `https://docs-demo.ionic.io/component/${tag}`;

    // use fetch to get the content of the demo file
    const response = await fetch(stencil_code_url);
    if (!response.ok) {
      return mcpError(
        `Failed to fetch demo for ${tag} from ${stencil_code_url}: ${response.statusText}`
      );
    }
    const demo_code = await response.text();

    // if liveViewer is set, open the plugin's API documentation in a new page
    if (liveViewer.puppeteerPage) {
      const page = liveViewer.puppeteerPage;
      await page.goto(demo_url, {
        waitUntil: "networkidle0",
      });
      liveViewer.lastURL = demo_url;
    }

    return toContent({ demo_code, stencil_code_url, demo_url });
  }
);
