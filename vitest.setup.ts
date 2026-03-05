// Configure Neon serverless WebSocket for Node.js test environment
// This must be done before any database imports
import { neonConfig } from "@neondatabase/serverless";
// Load environment variables the same way Next.js does
// This ensures .env.local and other env files are loaded for tests
import { loadEnvConfig } from "@next/env";
import ws from "ws";

// Safety check: Fail immediately if NODE_ENV is not 'test'
// Note: Vitest automatically sets NODE_ENV to 'test', but this check provides
// an extra safety layer in case tests are run in an unusual way or environment
if (process.env.NODE_ENV !== "test") {
    throw new Error(
        `❌ NODE_ENV must be 'test' for tests. Current value: ${process.env.NODE_ENV}`,
    );
}

// Suppress console output during tests to keep terminal output clean
// Errors are still thrown and can be tested, but won't clutter the output
// Using direct replacement ensures this persists even after vi.restoreAllMocks()
const noop = () => {};
console.log = noop;
console.error = noop;
console.warn = noop;

neonConfig.webSocketConstructor = ws;

const projectDir = process.cwd();
loadEnvConfig(projectDir);
