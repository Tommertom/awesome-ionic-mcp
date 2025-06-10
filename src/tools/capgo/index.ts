import { ServerTool } from "../../mcp-utils/tools.js";
import { get_all_capgo_plugins } from "./get_all_capgo_plugins.js";
import { get_capgo_plugin_api } from "./get_capgo_plugin_api.js";

export const capgo_plugins: ServerTool[] = [
  get_capgo_plugin_api,
  get_all_capgo_plugins,
];

const GITHUB_API = "https://api.github.com";
const ORG_NAME = "Cap-go";

export interface CapGoPlugin {
  name: string;
  url: string;
  repo_name: string;
  api_doc: string;
}

/**
 * Fetches all public repositories under a GitHub organization using fetch.
 * @returns A list of repository objects.
 */

export async function getAllCapGoRepos(): Promise<CapGoPlugin[]> {
  const perPage = 100;
  let page = 1;
  let allRepos: any[] = [];

  while (true) {
    const url = `${GITHUB_API}/orgs/${ORG_NAME}/repos?per_page=${perPage}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    const repos = await res.json();
    if (repos.length === 0) break;

    allRepos = allRepos.concat(repos);

    // wait 100ms to avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));

    page++;
  }

  // we need to keep only the plugins that start with "capacitor-"
  allRepos = allRepos.filter((repo) => repo.name.startsWith("capacitor-"));

  const plugins: CapGoPlugin[] = [];
  for (const repo of allRepos) {
    if (repo.archived || repo.disabled) {
      continue;
    }

    const readmeUrl = `https://raw.githubusercontent.com/${ORG_NAME}/${repo.name}/main/README.md`;
    let readmeContent = "";
    try {
      const readmeRes = await fetch(readmeUrl);

      if (readmeRes.ok) {
        readmeContent = await readmeRes.text();
      }
    } catch (error) {
      console.warn(`Failed to fetch README for ${repo.name}:`, error);
    }

    if (readmeContent.length > 100) {
      plugins.push({
        name: repo.name,
        url: readmeContent,
        repo_name: repo.name,
        api_doc: repo.html_url,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`Loaded ${plugins.length} CapGo plugins from GitHub`);

  return plugins;
}
