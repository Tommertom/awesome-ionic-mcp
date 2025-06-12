import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";
import puppeteer from "puppeteer";

export const set_live_viewer = tool(
  {
    name: "set_live_viewer",
    description:
      "Sets the live viewer for the MCP server to show the browser for viewing the documentation that is used by the MCP server.",
    inputSchema: z.object({
      on_off: z
        .enum(["on", "off"])
        .describe("Whether to turn the live viewer on or off."),
    }),
    annotations: {
      title: "Configuring the Live Viewer for the MCP Server",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Awesome Ionic MCP Server",
    },
  },
  async ({ on_off }, { liveViewer }) => {
    if (on_off === undefined) {
      return mcpError(`No on_off value supplied in set_live_viewer tool`);
    }

    // Check if the live viewer is already set
    if (on_off === "on") {
      if (liveViewer.puppeteerBrowser) {
        return mcpError(`Live viewer is already set.`);
      }
      liveViewer.puppeteerBrowser = await get_live_viewer_puppeteerBrowser();
      liveViewer.lastURL = "https://google.com";
    } else {
      if (!liveViewer.puppeteerBrowser) {
        return mcpError(`Live viewer is not set.`);
      }
      await liveViewer.puppeteerBrowser.close();
      liveViewer.puppeteerBrowser = undefined;
      liveViewer.lastURL = undefined;
    }

    return toContent({
      result:
        "Live viewer is now " + (on_off === "on" ? "enabled" : "disabled"),
    });
  }
);

export const get_live_viewer_puppeteerBrowser = () => {
  return puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
};
