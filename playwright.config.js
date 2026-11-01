import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4317', browserName: 'chromium', channel: 'chrome' },
  webServer: {
    command: 'python3 -m http.server 4317 --bind 127.0.0.1 --directory public',
    url: 'http://127.0.0.1:4317',
    reuseExistingServer: false
  }
});
