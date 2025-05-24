import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  CallToolResult,
  ListToolsRequestSchema,
  ListToolsResult,
} from "@modelcontextprotocol/sdk/types.js";

import { ServerTool, ServerToolContext } from "./mcp-utils/tools.js";
import { availableTools } from "./tools/index.js";
import { mcpError } from "./mcp-utils/utils.js";
import {
  cleanedIonicDefinition,
  getIonicCoreWithRedirect,
} from "./tools/coreJson/utils.js";

const SERVER_VERSION = "0.1.0";

export class IonicMCPServer {
  server: Server;
  clientInfo?: { name?: string; version?: string };

  ionic_data_context: ServerToolContext = {
    coreJson: {
      downloaded_data: {},
      ionic_component_map: {},
      version: "",
    },
  };

  constructor() {
    console.log("Ionic MCP Server initialized");

    // load all Ionic data
    this.initIonicData()
      .then(() => {
        console.log("Ionic data initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize Ionic data:", error);
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
      console.log(
        `Ionic MCP Server initialized with client version: ${clientInfo?.version}`
      );
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
      const res = await tool.fn(toolArgs, this.ionic_data_context);
      return res;
    } catch (err: unknown) {
      return mcpError(err);
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async initIonicData() {
    console.log("Ionic data init");

    const downloadedData = await getIonicCoreWithRedirect(
      "https://unpkg.com/@ionic/docs/core.json"
    );

    if (!downloadedData) {
      console.log("Failed to load Ionic data");
      return;
    }

    this.ionic_data_context.coreJson.downloaded_data = downloadedData.coreJson;
    this.ionic_data_context.coreJson.version = downloadedData.version;
    this.ionic_data_context.coreJson.ionic_component_map = {};
    if (
      downloadedData.coreJson.components &&
      Array.isArray(downloadedData.coreJson.components)
    ) {
      const components = downloadedData.coreJson.components;
      components.forEach((component: any) => {
        if (component && component.tag) {
          this.ionic_data_context.coreJson.ionic_component_map[component.tag] =
            cleanedIonicDefinition(component);
        }
      });
    }

    console.log(
      "Ionic data loaded",
      this.ionic_data_context.coreJson.version,
      Object.keys(this.ionic_data_context.coreJson.ionic_component_map).length
    );
  }
}
