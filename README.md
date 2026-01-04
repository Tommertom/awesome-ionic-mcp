# Awesome Ionic MCP server
Your comprehensive Ionic coding companion powered by the Model Context Protocol (MCP). This intelligent server provides seamless access to Ionic Framework components, Capacitor plugins, developer resources, and **CLI command execution** to accelerate your mobile app development workflow. Whether you're building cross-platform applications with React, Angular, Vue, or Vanilla JavaScript, this MCP server delivers real-time component definitions, API documentation, code examples, plugin information, and the ability to execute Ionic/Capacitor CLI commands directly to your AI assistant, enabling faster development and better code quality.

Data is sourced from the package `@ionic/core`, ionicframework.com, docs-demo.ionic.io, capacitorjs.com, capawesome.io, capacitor-community, and capgo.live to ensure accuracy and completeness.

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
| get_capgo_plugin_api | capgo | Retrieves API documentation for a specific CapGo plugin. |
| get_all_capgo_plugins | capgo | Retrieves list of all CapGo plugins. |
| get_all_capacitor_plugins | all-capacitor-plugins | Superlist of all Capacitor plugings from different publishers you can use to retrieve API information through this MCP tool. If you are lost about which plugin to use, this tool will help you find the right one. |
| **ionic_info** | **ionic-cli** | **Get comprehensive project, system, and environment information** |
| **ionic_config_get** | **ionic-cli** | **Read CLI or project configuration values** |
| **ionic_config_set** | **ionic-cli** | **Set CLI or project configuration value** |
| **ionic_config_unset** | **ionic-cli** | **Delete/unset configuration value** |
| **ionic_start** | **ionic-cli** | **Create a new Ionic project** |
| **ionic_start_list** | **ionic-cli** | **List available Ionic starter templates** |
| **ionic_init** | **ionic-cli** | **Initialize existing project with Ionic** |
| **ionic_build** | **ionic-cli** | **Build web assets for deployment** |
| **ionic_serve** | **ionic-cli** | **Start local development server** |
| **ionic_generate** | **ionic-cli** | **Generate pages, components, services** |
| **ionic_repair** | **ionic-cli** | **Repair project dependencies** |
| **integrations_list** | **ionic-cli** | **List project integrations** |
| **integrations_enable** | **ionic-cli** | **Enable integration in project** |
| **integrations_disable** | **ionic-cli** | **Disable integration in project** |
| **capacitor_doctor** | **ionic-cli** | **Check Capacitor setup for errors** |
| **capacitor_list_plugins** | **ionic-cli** | **List installed Capacitor plugins** |
| **capacitor_sync** | **ionic-cli** | **Sync web assets and dependencies** |
| **capacitor_copy** | **ionic-cli** | **Copy web assets to native platforms** |
| **capacitor_update** | **ionic-cli** | **Update native dependencies** |
| **capacitor_init** | **ionic-cli** | **Initialize Capacitor configuration** |
| **capacitor_add** | **ionic-cli** | **Add native platform (iOS/Android)** |
| **capacitor_build** | **ionic-cli** | **Build native platform release** |
| **capacitor_run** | **ionic-cli** | **Run app on device/emulator** |
| **capacitor_open** | **ionic-cli** | **Open native IDE** |
| **capacitor_migrate** | **ionic-cli** | **Migrate to latest Capacitor version** |

## CLI Tools
The Awesome Ionic MCP server now includes **28 Ionic and Capacitor CLI tools** that allow you to execute commands directly through your AI assistant:

### Project Information & Diagnostics
- `ionic_info` - Get project, system, and environment information
- `capacitor_doctor` - Check setup for configuration errors
- `capacitor_list_plugins` - List all installed plugins
- `ionic_config_get/set/unset` - Manage configuration values
- `integrations_list` - List available integrations

### Development Workflow
- `ionic_build` - Build web assets with optimizations
- `ionic_serve` - Start development server (manual launch recommended)
- `capacitor_sync` - Sync web assets and update native dependencies
- `capacitor_copy` - Copy web assets to native platforms
- `capacitor_update` - Update native plugins

### Code Generation
- `ionic_generate` - Generate pages, components, services, guards, pipes
- Framework-specific scaffolding for Angular, React, Vue

### Project Setup & Management
- `ionic_start` - Create new Ionic project
- `ionic_start_list` - List available templates
- `ionic_init` - Initialize existing project with Ionic
- `capacitor_init` - Initialize Capacitor configuration
- `capacitor_add` - Add iOS or Android platform
- `integrations_enable/disable` - Manage project integrations

### Native Development
- `capacitor_build` - Build native app release
- `capacitor_run` - Run on device or emulator
- `capacitor_open` - Open Xcode or Android Studio
- `capacitor_migrate` - Migrate to latest Capacitor version

### Maintenance
- `ionic_repair` - Fix dependencies and regenerate files

### Common Workflows

**Create a new project:**
```typescript
// 1. Create project
ionic_start({ name: "MyApp", template: "tabs", type: "react", capacitor: true })

// 2. Add iOS platform
capacitor_add({ project_directory: "./MyApp", platform: "ios" })

// 3. Build and sync
ionic_build({ project_directory: "./MyApp", prod: true })
capacitor_sync({ project_directory: "./MyApp", platform: "ios" })
```

**Check project health:**
```typescript
ionic_info({ format: "json" })
capacitor_doctor({ platform: "ios" })
capacitor_list_plugins({})
```

**Generate components:**
```typescript
ionic_generate({ type: "page", name: "home" })
ionic_generate({ type: "component", name: "user-card" })
ionic_generate({ type: "service", name: "auth" })
```

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

## Environment Variables

The server supports optional environment variables for enhanced functionality:

### `GITHUB_TOKEN` (Recommended)
**Purpose:** Authenticate GitHub API requests to avoid rate limiting

**Why it's needed:** The server fetches plugin data from GitHub organizations (CapGo, Capacitor Community). Without authentication, GitHub limits you to 60 API requests per hour per IP address. The server makes ~160+ API calls during initialization, which exhausts the unauthenticated limit in a single startup. With a token, the limit increases to 5,000 requests per hour.

**How to get a token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Awesome Ionic MCP")
4. No special scopes/permissions needed for public repository access
5. Copy the generated token (starts with `ghp_`)

**Configuration example:**
```json
{
  "mcpServers": {
    "awesome-ionic-mcp": {
      "type": "stdio"
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      },
       "alwaysAllow": [
      "get_ionic_component_definition",
      "get_all_ionic_components",
      "get_component_api",
      "get_all_official_plugins",
      "get_official_plugin_api"
    ],
    }
  }
}
```

### `MCP_QUIET`
**Purpose:** Suppress informational logs (only errors will be shown)

**When to use:** If you want minimal logging output

**Configuration example:**
```json
{
  "mcpServers": {
    "awesome-ionic-mcp": {
      "command": "npx",
      "args": ["-y", "awesome-ionic-mcp@latest"],
      "env": {
        "MCP_QUIET": "true"
      }
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
