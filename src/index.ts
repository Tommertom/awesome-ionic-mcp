import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { giveAllIonicComponents, initIonicData, ionic_data } from "./ionic.js";

const server = new Server(
  {
    name: "example-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_ionic_component_definition",
        description:
          "A useful tool to get the component definition of an Ionic component (all html elements starting with ion-)",
        inputSchema: {
          type: "object",
          properties: {
            html_tag: { type: "string" },
          },
          required: ["html_tag"],
        },
      },

      {
        name: "get_all_ionic_components",
        description:
          "A useful tool to get all Ionic elements (all html elements starting with ion-)",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_ionic_component_definition") {
    //@ts-ignore
    const { html_tag } = request.params.arguments;
    let result = undefined;

    if (
      ionic_data.coreJson.components &&
      ionic_data.ionic_components[html_tag]
    ) {
      result = ionic_data.ionic_components[html_tag];
    }

    return {
      content: [
        {
          type: "text",
          text: result
            ? JSON.stringify(result, null, 2)
            : "Component definition not found",
        },
      ],
    };
  }

  if (request.params.name === "get_all_ionic_components") {
    let result = [];
    result = giveAllIonicComponents();
    return {
      content: [
        {
          type: "text",
          text:
            result.length > 0
              ? JSON.stringify(result, null, 2)
              : "No components found",
        },
      ],
    };
  }

  throw new Error("Tool not found");
});

initIonicData();
const transport = new StdioServerTransport();
await server.connect(transport);
