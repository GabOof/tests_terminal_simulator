import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    use: {
        baseURL: "http://127.0.0.1:4173",
        browserName: "chromium",
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
    },
    reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
    webServer: {
        command: "npm run start",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});
