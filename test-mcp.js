#!/usr/bin/env node

import { spawn } from "child_process";
import readline from "readline";

// Start the MCP server
const server = spawn("node", ["build/index.js"], {
  stdio: ["pipe", "pipe", process.stderr],
});

const rl = readline.createInterface({
  input: server.stdout,
  terminal: false,
});

let initialized = false;

rl.on("line", (line) => {
  console.log("Raw line:", line);
  try {
    const response = JSON.parse(line);
    console.log("\n=== Parsed Response ===");
    console.log(JSON.stringify(response, null, 2));

    if (!initialized && response.result && response.id === 1) {
      initialized = true;
      // Send notifications/initialized
      const initializedNotification = {
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {},
      };
      server.stdin.write(JSON.stringify(initializedNotification) + "\n");

      // Now request tools list
      console.log("\n--- Requesting tools list ---");
      const listToolsRequest = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      };
      server.stdin.write(JSON.stringify(listToolsRequest) + "\n");
    } else if (response.result && response.result.tools) {
      console.log(`\n=== Found ${response.result.tools.length} tools ===\n`);
      response.result.tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   Description: ${tool.description}`);
        console.log("");
      });
      server.kill();
      process.exit(0);
    }
  } catch (e) {
    // Not JSON, probably a log message
    // Ignore
  }
});

// Send initialize request
console.log("--- Initializing MCP server ---");
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-11-25",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0",
    },
  },
};

server.stdin.write(JSON.stringify(initRequest) + "\n");

// Wait for initialization
setTimeout(() => {
  if (!initialized) {
    console.error("Initialization timeout");
    server.kill();
    process.exit(1);
  }
}, 10000);
