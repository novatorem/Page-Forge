import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Allow JSX in .js files (CRA allowed this; Vite restricts it to .jsx by default)
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },
  server: {
    port: 3000,
    proxy: {
      '/users': 'http://localhost:3001',
      '/covers': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'build'
  }
});
