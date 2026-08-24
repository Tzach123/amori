import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    root: './',
    include: ['**/*.e2e-spec.ts'],
    environment: 'node',
    globals: true,
  },
  plugins: [tsconfigPaths(), swc.vite()],
});
