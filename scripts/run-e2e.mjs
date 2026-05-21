import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const playwrightCli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
const port = process.env.E2E_PORT ?? "3100";
const baseUrl = `http://127.0.0.1:${port}`;

let server;

try {
  await run(process.execPath, [nextBin, "build"]);

  if (await isServerReady(`${baseUrl}/api/health`)) {
    console.log(`[e2e] Reusing existing server at ${baseUrl}`);
  } else {
    server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", port], {
      cwd: root,
      env: { ...process.env, PORT: port },
      stdio: ["ignore", "pipe", "pipe"]
    });

    server.stdout.on("data", (chunk) => process.stdout.write(`[next] ${chunk}`));
    server.stderr.on("data", (chunk) => process.stderr.write(`[next] ${chunk}`));
  }

  await waitForServer(`${baseUrl}/api/health`);
  await run(process.execPath, [playwrightCli, "test"], {
    PLAYWRIGHT_BASE_URL: baseUrl
  });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  stopServer();
  process.exit(process.exitCode ?? 0);
}

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitForServer(url) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 60_000) {
    if (await isServerReady(url)) {
      return;
    }

    await sleep(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function isServerReady(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stopServer() {
  if (!server?.pid) {
    return;
  }

  if (isWindows) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
      stdio: "ignore"
    });
    return;
  }

  server.kill("SIGTERM");
}
