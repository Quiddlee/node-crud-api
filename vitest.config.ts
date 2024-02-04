/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    css: false,
    setupFiles: ['dotenv/config'],
  },
});
