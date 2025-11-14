/**
 * Utility functions for GitHub API calls with authentication and retry logic
 */

export interface GitHubFetchOptions {
  retries?: number;
  delayMs?: number;
}

/**
 * Fetch from GitHub API with authentication (if GITHUB_TOKEN is set) and retry logic
 */
export async function fetchGitHubAPI(
  url: string,
  options: GitHubFetchOptions = {}
): Promise<Response> {
  const { retries = 3, delayMs = 2000 } = options;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers });

    if (res.ok) {
      return res;
    }

    // Handle rate limiting with retry
    if (res.status === 403) {
      const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
      const rateLimitReset = res.headers.get("x-ratelimit-reset");

      if (rateLimitRemaining === "0") {
        if (i < retries - 1) {
          const waitTime = delayMs * (i + 1);
          console.error(
            `GitHub API rate limit hit. Retrying in ${waitTime}ms... (attempt ${
              i + 1
            }/${retries})`
          );
          await new Promise((r) => setTimeout(r, waitTime));
          continue;
        } else {
          const resetTime = rateLimitReset
            ? new Date(parseInt(rateLimitReset) * 1000).toISOString()
            : "unknown";
          throw new Error(
            `GitHub API rate limit exceeded. ${
              process.env.GITHUB_TOKEN
                ? "Even with token, limit reached."
                : "Set GITHUB_TOKEN environment variable to increase limits."
            } Rate limit resets at: ${resetTime}`
          );
        }
      }
    }

    // For non-rate-limit errors, throw immediately
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
  }

  throw new Error(`Failed to fetch from GitHub API after ${retries} retries`);
}
