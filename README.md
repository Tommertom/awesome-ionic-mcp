# Awesome Ionic MCP server
A first experimental MCP to enhance your LLM coding buddy.

## Tools available
| Tool Name | Feature Group | Description |
| --------- | ------------- | ----------- |
| get_ionic_component_definition | coreJson | Retrieves the typescript definition of an Ionic component based on its HTML tag. |
| get_all_ionic_components | coreJson | Retrieves the list of all Ionic components available for this tool |
| get_component_api | ionicFrameworkCom | Retrieves the component API on from the IonicFramework page using its HTML tag. |
| get_component_demo | docsDemoIo | Returns the component demo from the GitHub repository based on its HTML tag. |

## Getting started
Set up your MCP client  
The Awesome Ionic MCP server can work with any MCP client that supports standard I/O (stdio) as the transport medium. Here are specific instructions for some popular tools:

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
