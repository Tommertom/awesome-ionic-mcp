# Awesome Ionic MCP server
Your comprehensive Ionic coding companion powered by the Model Context Protocol (MCP). This intelligent server provides seamless access to Ionic Framework components, Capacitor plugins, and developer resources to accelerate your mobile app development workflow. Whether you're building cross-platform applications with React, Angular, Vue, or Vanilla JavaScript, this MCP server delivers real-time component definitions, API documentation, code examples, and plugin information directly to your AI assistant, enabling faster development and better code quality.

Data is sourced from the package `@ionic/core`, ionicframework.com, docs-demo.ionic.io, capacitorjs.com, capawesome.io, and capacitor-community to ensure accuracy and completeness.

## Tools available
| Tool Name | Feature Group | Description |
| --------- | ------------- | ----------- |
| get_ionic_component_definition | @ionic/core.json | Retrieves the typescript definition of an Ionic component based on its HTML tag. |
| get_all_ionic_components | @ionic/core.json | Retrieves the list of all Ionic components available for this tool |
| get_component_api | ionicframework.com | Retrieves the component API on from the IonicFramework page using its HTML tag. |
| get_component_demo | docs-demo.ionic.io | Returns the component demo from the GitHub repository based on its HTML tag. |
| get_official_plugin_api | capacitorjs.com | Retrieves the official plugin API on from the Capacitor page using its HTML tag. |
| get_all_official_plugins | capacitorjs.com | Retrieves list of all Official Capacitor plugins. |
| get_all_plugins | capawesome.io | Retrieves list of all Capawesome Capacitor plugins (free and insider versions). |
| get_all_free_plugins | capawesome.io | Retrieves list of all Capawesome Capacitor free plugins - intensively curated and up-to-date. |
| get_all_insider_plugins | capawesome.io | Retrieves list of all Capawesome Capacitor insider plugins - intensively curated and up-to-date. |
| get_plugin_api | capawesome.io | Retrieves API documentation for a specific Capawesome Capacitor plugin. |
| get_capacitor_community_plugin_api | capacitor-community | Retrieves API documentation for a specific Capacitor Community plugin. |
| get_all_capacitor_community_plugins | capacitor-community | Retrieves list of all Capacitor Community plugins. |

## Getting started & upfront warning
The Awesome Ionic MCP server can work with any MCP client that supports standard I/O (stdio) as the transport medium. Here are specific instructions for some popular tools:

Just to let you know - for some data the MCP server will run Puppeteer to open a browser and get the data. So you will see a browser window spanwed and closed.

### Basic configuration

#### Claude Desktop
To configure Claude Desktop to use the Awesome Ionic MCP server, edit the `claude_desktop_config.json` file. You can open or create this file from the Claude > Settings menu. Select the Developer tab, then click Edit Config.

```json
{
  "mcpServers": {
    "awesome-ionic-mcp": {
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"]
    }
  }
}
```

---

#### Cline
To configure Cline to use the Awesome Ionic MCP server, edit the `cline_mcp_settings.json` file. You can open or create this file by clicking the MCP Servers icon at the top of the Cline pane, then clicking the Configure MCP Servers button.

```json
{
  "mcpServers": {
    "awesome-ionic-mcp": {
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"],
      "disabled": false
    }
  }
}
```

---

#### Cursor
To configure Cursor to use the Awesome Ionic MCP server, edit either the file `.cursor/mcp.json` (to configure only a specific project) or the file `~/.cursor/mcp.json` (to make the MCP server available in all projects):

```json
{
  "mcpServers": {
    "awesome-ionic-mcp": {
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"]
    }
  }
}
```

---

#### Visual Studio Code Copilot
To configure a single project, edit the `.vscode/mcp.json` file in your workspace:

```json
{
  "servers": {
    "awesome-ionic-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"]
    }
  }
}
```

To make the server available in every project you open, edit your user settings:

```json
{
  "mcp": {
    "servers": {
      "awesome-ionic-mcp": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "awesome-ionic-mcp@latest"]
      }
    }
  }
}
```

---

#### Windsurf Editor
To configure Windsurf Editor, edit the file `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "awesome-ionic-mcp": {
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"]
    }
  }
}
```

## Credits
Credits go to Firebase team- for using their code of their Firebase MCP server.
https://firebase.google.com/docs/cli/mcp-server
