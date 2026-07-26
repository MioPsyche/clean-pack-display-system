import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // better-sqlite3 为原生模块，使用进程隔离更稳妥
    pool: 'forks',
  },
});
