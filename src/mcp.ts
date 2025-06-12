import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  CallToolResult,
  ListToolsRequestSchema,
  ListToolsResult,
} from "@modelcontextprotocol/sdk/types.js";

import {
  emptyServerToolContext,
  ServerTool,
  ServerToolContext,
} from "./mcp-utils/tools.js";
import { availableTools } from "./tools/index.js";
import { mcpError } from "./mcp-utils/utils.js";

import { loadIonicCoreJSON } from "./tools/coreJson/index.js";
import { loadCoreCapAwesomeData } from "./tools/capawesome.io/index.js";
import { getAllCapacitorCommunityRepos } from "./tools/capacitor-community/index.js";
import { getAllCapGoRepos } from "./tools/capgo/index.js";

import { loadOfficialCapacitorPlugins } from "./tools/capacitorjs.com/index.js";
import { get_live_viewer_puppeteerBrowser } from "./tools/mcp-server-setup/set_live_viewer.js";

const SERVER_VERSION = "0.1.0";

export class IonicMCPServer {
  server: Server;
  clientInfo?: { name?: string; version?: string };

  mcp_data_context: ServerToolContext = { ...emptyServerToolContext };

  constructor() {
    // all MCP related stuff
    this.server = new Server({ name: "ionic", version: SERVER_VERSION });
    this.server.registerCapabilities({ tools: { listChanged: true } });
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      this.mcpListTools.bind(this)
    );
    this.server.setRequestHandler(
      CallToolRequestSchema,
      this.mcpCallTool.bind(this)
    );
    this.server.oninitialized = async () => {
      const clientInfo = this.server.getClientVersion();
      this.clientInfo = clientInfo;
    };

    // load all MCP data
    this.mcpData().catch((error) => {
      console.error("Failed to initialize MCP data:", error);
    });

    // setup the live viewer
    this.setLiveViewer("on").catch((error) => {
      console.error("Failed to set up live viewer:", error);
    });
  }

  async setLiveViewer(
    on_off: "on" | "off",
    url: string = "https://google.com"
  ) {
    if (on_off === "on") {
      this.mcp_data_context.liveViewer = {
        puppeteerBrowser: await get_live_viewer_puppeteerBrowser(),
        lastURL: url,
      };

      const page =
        await this.mcp_data_context.liveViewer.puppeteerBrowser.newPage();

      await page.goto(url, {
        waitUntil: "networkidle0",
      });
    } else {
      this.mcp_data_context.liveViewer = {
        puppeteerBrowser: undefined,
        lastURL: undefined,
      };
    }
  }

  getTool(name: string): ServerTool | null {
    return availableTools().find((t) => t.mcp.name === name) || null;
  }

  async mcpListTools(): Promise<ListToolsResult> {
    return {
      tools: availableTools().map((t) => t.mcp),
      _meta: {},
    };
  }

  async mcpCallTool(request: CallToolRequest): Promise<CallToolResult> {
    const toolName = request.params.name;
    const toolArgs = request.params.arguments;
    const tool = this.getTool(toolName);
    if (!tool) throw new Error(`Tool '${toolName}' could not be found.`);

    try {
      const res = await tool.fn(toolArgs, this.mcp_data_context);
      return res;
    } catch (err: unknown) {
      return mcpError(err);
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async mcpData() {
    return Promise.all([
      this.loadCoreJSON(),
      this.loadCoreCapAwesomeData(),
      this.loadCapacitorCommunityData(),
      this.loadCapGoData(),
      this.loadCoreCapacitorJSData(),
    ]);
  }

  async loadCoreCapacitorJSData() {
    loadOfficialCapacitorPlugins();
  }
  async loadCoreJSON() {
    const coreData = await loadIonicCoreJSON();

    this.mcp_data_context.coreJson.downloaded_data = coreData.downloaded_data;
    this.mcp_data_context.coreJson.version = coreData.version;
    this.mcp_data_context.coreJson.ionic_component_map =
      coreData.ionic_component_map;

    return true;
  }

  async loadCoreCapAwesomeData() {
    const capawesomeData = await loadCoreCapAwesomeData();
    this.mcp_data_context.capawesomeData = capawesomeData;
  }

  async loadCapacitorCommunityData() {
    this.mcp_data_context.capacitorCommunityData =
      await getAllCapacitorCommunityRepos();
  }

  async loadCapGoData() {
    this.mcp_data_context.capGoData = await getAllCapGoRepos();
  }
}
