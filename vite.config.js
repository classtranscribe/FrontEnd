import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        const normalizedId = id.replace(/\\/g, '/');
        if (!normalizedId.includes('/src/') || !normalizedId.endsWith('.js')) {
          return null;
        }
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react({
      jsxRuntime: 'classic',
      babel: {
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      docs: path.resolve(__dirname, 'src/docs'),
      entities: path.resolve(__dirname, 'src/entities'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      layout: path.resolve(__dirname, 'src/layout'),
      model: path.resolve(__dirname, 'src/model'),
      screens: path.resolve(__dirname, 'src/screens'),
      store: path.resolve(__dirname, 'src/store.js'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    port: 3000,
  },
});