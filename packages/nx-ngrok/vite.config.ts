/// <reference types="vitest" />

import { join } from 'node:path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/test',

  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),

    viteTsConfigPaths({
      root: '../../',
    }),

    viteStaticCopy({
      targets: [
        {
          src: '../../README.md',
          dest: '.',
        },
        {
          src: '../../LICENSE',
          dest: '.',
        },
        {
          src: '*.md',
          dest: '.',
        },
        {
          src: 'executors.json',
          dest: '.',
        },
        {
          src: 'generators.json',
          dest: '.',
        },
        {
          src: 'migrations.json',
          dest: '.',
        },
      ],
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: ['src/index.ts', 'src/'],
      name: 'nx-ngrok',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        '@nrwl/cypress',
        '@nrwl/devkit',
        '@nrwl/js',
        '@nrwl/linter',
        '@nrwl/node',
        '@nrwl/workspace',
        'nx',
      ],
    },
  },
});
