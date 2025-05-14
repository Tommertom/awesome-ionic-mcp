import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { appendFileSync } from "fs";
import { giveIonicDefinition } from "./ionic.js";

// Create an MCP server

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
        name: "get_ionic_component_examples",
        description:
          "A useful tool to get example components of Ionic elements (all html elements starting with ion-)",
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

      {
        name: "get_all_ionic_templates",
        description:
          "A useful tool to get list of available templates for usefull app screens using Ionic elements (all html elements starting with ion-)",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },

      {
        name: "get_specific_ionic_template",
        description:
          "A useful tool to get example template with Ionic elements",
        inputSchema: {
          type: "object",
          properties: {
            html_tag: { type: "string" },
          },
          required: ["template_name"],
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
    let result = null;
    try {
      result = giveIonicDefinition(html_tag);
    } catch (e) {
      result = { error: "Failed to read or parse core.json" };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  if (request.params.name === "get_ionic_component_examples") {
    //@ts-ignore
    const { html_tag } = request.params.arguments;
    let result = null;
    try {
      result = giveIonicDefinition(html_tag);
    } catch (e) {
      result = { error: "Failed to read or parse core.json" };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  if (request.params.name === "get_all_ionic_components") {
    let result = null;
    try {
      result = "No components avaible yet";
    } catch (e) {
      result = { error: "Failed to read or parse core.json" };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  if (request.params.name === "get_all_ionic_templates") {
    let result = null;
    try {
      result = "No templates available yet";
    } catch (e) {
      result = { error: "Failed to get templates" };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  if (request.params.name === "get_specific_ionic_template") {
    //@ts-ignore
    const { template_name } = request.params.arguments;
    let result = null;
    try {
      result = `No template found for ${template_name}`;
    } catch (e) {
      result = { error: "Failed to get specific template" };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
