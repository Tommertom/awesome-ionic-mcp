import { z } from "zod";
import { tool } from "../../mcp-utils/tools.js";
import { mcpError, toContent } from "../../mcp-utils/utils.js";
import puppeteer from "puppeteer";

export const get_component_api = tool(
  {
    name: "get_component_api",
    description:
      "Retrieves the component API on from the IonicFramework page using its HTML tag.",
    inputSchema: z.object({
      html_tag: z
        .string()
        .describe(
          "The HTML tag of the Ionic component to retrieve. For example, 'ion-button'."
        ),
    }),
    annotations: {
      title:
        "Get Ionic Component Information from Official Docs using Puppeteer",
      readOnlyHint: true,
    },
    _meta: {
      feature: "Ionic Framework Documentation",
    },
  },
  async ({ html_tag }, { liveViewer }) => {
    if (html_tag === undefined) {
      return mcpError(`No HTML tag supplied in get_component_api tool`);
    }

    // trim whitespace and strip the 'ion-' prefix if it exists
    const clean_tag = html_tag.trim();
    const tag = clean_tag.startsWith("ion-") ? clean_tag.slice(4) : clean_tag;

    const website_url = `https://ionicframework.com/docs/api/${tag}`;

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

    return toContent(
      { api_docs, website_url },
      {
        contentPrefix: `API documentation for the Ionic component <${html_tag}> taken from ${website_url}:\n\n`,
      }
    );
  }
);
