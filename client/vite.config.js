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
      '/pages': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into stable chunks that can be cached independently
          // of app code changes. React + router rarely change; MUI rarely changes;
          // dnd-kit is isolated so it doesn't bloat the MUI chunk.
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities']
        }
      }
    }
  }
});
