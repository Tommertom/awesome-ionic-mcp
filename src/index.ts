import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { appendFileSync, readFileSync } from "fs";

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
        name: "calculate_sum",
        description: "A useful tool to add two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number" },
            b: { type: "number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "get_ionic_component_definition",
        description:
          "A useful tool to get the component definition of an Ionic component",
        inputSchema: {
          type: "object",
          properties: {
            html_tag: { type: "string" },
          },
          required: ["html_tag"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  appendFileSync("log.txt", `Tool request: ${JSON.stringify(request)}\n`);
  if (request.params.name === "calculate_sum") {
    //@ts-ignore
    const { a, b } = request.params.arguments;
    return {
      content: [
        {
          type: "text",
          text: String(a + b),
        },
      ],
    };
  }

  if (request.params.name === "get_ionic_component_definition") {
    //@ts-ignore
    const { html_tag } = request.params.arguments;
    let result = null;
    try {
      const coreJson = JSON.parse(readFileSync("core.json", "utf-8"));
      if (coreJson.components && Array.isArray(coreJson.components)) {
        result = coreJson.components.find((c: any) => c.tag === html_tag);
      }
    } catch (e) {
      result = { error: "Failed to read or parse core.json" };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  }
  throw new Error("Tool not found");
});

// Start receiving messages on stdin and sending messages on stdout
appendFileSync("log.txt", `Server started ` + new Date().toISOString() + "\n");
const transport = new StdioServerTransport();
await server.connect(transport);
