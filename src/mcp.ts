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
import {
  cleanedIonicDefinition,
  getIonicCoreWithRedirect,
} from "./tools/coreJson/utils.js";
import { loadCoreCapAwesomeData } from "./tools/capawesome.io/index.js";
import { getAllCapacitorCommunityRepos } from "./tools/capacitor-community/index.js";

const SERVER_VERSION = "0.1.0";

export class IonicMCPServer {
  server: Server;
  clientInfo?: { name?: string; version?: string };

  mcp_data_context: ServerToolContext = { ...emptyServerToolContext };

  constructor() {
    // load all MCP data
    this.mcpData().catch((error) => {
      console.error("Failed to initialize MCP data:", error);
    });

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
    return Promise.all([this.loadCoreJSON(), this.loadCoreCapAwesomeData()]);
  }

  async loadCoreJSON() {
    // loading coreData
    const downloadedData = await getIonicCoreWithRedirect(
      "https://unpkg.com/@ionic/docs/core.json"
    );

    if (!downloadedData) {
      throw new Error("Failed to download core JSON data from Ionic.");
    }

    this.mcp_data_context.coreJson.downloaded_data = downloadedData.coreJson;
    this.mcp_data_context.coreJson.version = downloadedData.version;
    this.mcp_data_context.coreJson.ionic_component_map = {};
    if (
      downloadedData.coreJson.components &&
      Array.isArray(downloadedData.coreJson.components)
    ) {
      const components = downloadedData.coreJson.components;
      components.forEach((component: any) => {
        if (component && component.tag) {
          this.mcp_data_context.coreJson.ionic_component_map[component.tag] =
            cleanedIonicDefinition(component);
        }
      });
    }

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
}
