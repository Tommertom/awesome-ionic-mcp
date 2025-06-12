import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";
import puppeteer from "puppeteer";
import { available_official_capacitor_plugins } from "./official_plugins.js";

export const get_official_plugin_api = tool(
  {
    name: "get_official_plugin_api",
    description:
      "Retrieves the official plugin API on from the Capacitor page using its HTML tag.",
    inputSchema: z.object({
      plugin_name: z
        .string()
        .describe(
          "The HTML tag of the Capacitor plugin to retrieve. For example, 'ion-button'."
        ),
    }),
    annotations: {
      title:
        "Get Capacitor Official Plugin Information from Official Docs using Puppeteer",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Capacitor Documentation",
    },
  },
  async ({ plugin_name }, { liveViewer }) => {
    if (plugin_name === undefined) {
      return mcpError(`No plugin name supplied in get_plugin_api tool`);
    }

    // trim whitespace and strip the 'ion-' prefix if it exists
    const name = plugin_name.trim();

    // Check if the name is in the list of available names
    if (!available_official_capacitor_plugins.includes(name)) {
      return mcpError(
        `The plugin '${name}' is not a valid Capacitor plugin. Available plugins: ${available_official_capacitor_plugins.join(
          ", "
        )}`
      );
    }

    const website_url = `https://capacitorjs.com/docs/apis/${name}`;

    // if liveViewer is set, open the plugin's API documentation in a that page
    let puppeteerPage = undefined;
    if (liveViewer.puppeteerPage) {
      puppeteerPage = liveViewer.puppeteerPage;
      liveViewer.lastURL = website_url;
    } else {
      const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      puppeteerPage = page;
    }
    await puppeteerPage.goto(website_url, { waitUntil: "networkidle0" });

    // Remove all stylesheets and scripts, then get only the visible text from the main doc content
    const api_docs = await puppeteerPage.evaluate(() => {
      // Remove <style> and <script> tags
      document.querySelectorAll("style, script").forEach((el) => el.remove());
      // Remove <link rel="stylesheet">
      document
        .querySelectorAll('link[rel="stylesheet"]')
        .forEach((el) => el.remove());
      // Get all divs with the classes 'theme-doc-markdown markdown'
      const docDivs = Array.from(
        document.querySelectorAll("div.theme-doc-markdown.markdown")
      );
      // Concatenate their innerText
      return docDivs.map((div) => (div as HTMLElement).innerText).join("\n\n");
    });

    if (!liveViewer.puppeteerPage) {
      // If we opened a new browser, close it
      await puppeteerPage.close();
    }

    return toContent({ api_docs, website_url });
  }
);
