import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        // Use 'node' environment for API route tests (server-side code)
        // Use 'jsdom' if you need to test client side functionality like React components
        environment: "node",
        include: ["**/__tests__/**/*.{unit,int}.{test,spec}.ts"],
        setupFiles: ["./vitest.setup.ts"],
        testTimeout: 10000, // 10 seconds for slower CI environments like GitHub Actions
    },
});
