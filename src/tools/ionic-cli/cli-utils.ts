import { execa, ExecaError } from "execa";
import { findUp } from "find-up";
import stripAnsi from "strip-ansi";
import { ChildProcess } from "child_process";

export interface CLIExecutionOptions {
  command: string;
  args: string[];
  cwd?: string;
  timeout?: number;
  captureOutput?: boolean;
  env?: Record<string, string>;
}

export interface CLIExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  command: string;
}

const DEFAULT_TIMEOUT = 300000; // 5 minutes
const ALLOWED_COMMANDS = ["ionic", "npx"];
const ALLOWED_NPX_PACKAGES = ["@ionic/cli", "@capacitor/cli"];

export function validateCommand(command: string, args: string[]): void {
  if (!ALLOWED_COMMANDS.includes(command)) {
    throw new Error(`Command '${command}' is not allowed`);
  }

  if (command === "npx" && args.length > 0) {
    const pkg = args[0];
    if (!ALLOWED_NPX_PACKAGES.includes(pkg) && !pkg.startsWith("cap")) {
      throw new Error(`NPX package '${pkg}' is not allowed`);
    }
  }

  // Check for shell metacharacters in args
  const dangerousChars = /[;&|`$(){}[\]<>]/;
  for (const arg of args) {
    if (dangerousChars.test(arg)) {
      throw new Error(`Argument contains dangerous characters: ${arg}`);
    }
  }
}

export async function findProjectRoot(
  startDir?: string
): Promise<string | undefined> {
  const configFile = await findUp("ionic.config.json", {
    cwd: startDir || process.cwd(),
  });
  if (configFile) {
    return configFile.replace("/ionic.config.json", "");
  }
  return undefined;
}

export async function executeCLI(
  options: CLIExecutionOptions
): Promise<CLIExecutionResult> {
  const startTime = Date.now();
  const { command, args, cwd, timeout = DEFAULT_TIMEOUT, env } = options;

  validateCommand(command, args);

  const workDir = cwd || process.cwd();

  try {
    const result = await execa(command, args, {
      cwd: workDir,
      timeout,
      env: {
        ...process.env,
        ...env,
        CI: "true",
        NO_COLOR: "true",
      },
      reject: false,
    });

    const duration = Date.now() - startTime;
    const stdout = stripAnsi(result.stdout || "");
    const stderr = stripAnsi(result.stderr || "");

    return {
      success: result.exitCode === 0,
      stdout,
      stderr,
      exitCode: result.exitCode || 0,
      duration,
      command: `${command} ${args.join(" ")}`,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const execaError = error as ExecaError;

    const stdoutStr = typeof execaError.stdout === 'string' ? execaError.stdout : '';
    const stderrStr = typeof execaError.stderr === 'string' ? execaError.stderr : execaError.message || '';

    return {
      success: false,
      stdout: stripAnsi(stdoutStr),
      stderr: stripAnsi(stderrStr),
      exitCode: execaError.exitCode || 1,
      duration,
      command: `${command} ${args.join(" ")}`,
    };
  }
}

export async function executeIonicCLI(
  args: string[],
  cwd?: string,
  timeout?: number
): Promise<CLIExecutionResult> {
  return executeCLI({
    command: "npx",
    args: ["-y", "@ionic/cli", ...args],
    cwd,
    timeout,
  });
}

export async function executeCapacitorCLI(
  args: string[],
  cwd?: string,
  timeout?: number
): Promise<CLIExecutionResult> {
  return executeCLI({
    command: "npx",
    args: ["-y", "@capacitor/cli", ...args],
    cwd,
    timeout,
  });
}

export function formatCLIError(result: CLIExecutionResult): string {
  let error = `Command failed: ${result.command}\n`;
  error += `Exit code: ${result.exitCode}\n`;
  error += `Duration: ${result.duration}ms\n\n`;

  if (result.stderr) {
    error += `Error output:\n${result.stderr}\n\n`;
  }

  if (result.stdout) {
    error += `Standard output:\n${result.stdout}\n`;
  }

  return error;
}

export function parseJSONOutput(output: string): any {
  try {
    return JSON.parse(output);
  } catch (error) {
    return null;
  }
}

export interface RunningServer {
  process: ChildProcess;
  url: string;
  port: number;
  projectDir: string;
  startTime: Date;
}

const runningServers = new Map<string, RunningServer>();

export function trackServer(
  projectDir: string,
  server: RunningServer
): void {
  runningServers.set(projectDir, server);
}

export function getRunningServer(
  projectDir: string
): RunningServer | undefined {
  return runningServers.get(projectDir);
}

export function stopServer(projectDir: string): boolean {
  const server = runningServers.get(projectDir);
  if (server) {
    server.process.kill();
    runningServers.delete(projectDir);
    return true;
  }
  return false;
}

export function getAllRunningServers(): Map<string, RunningServer> {
  return runningServers;
}
