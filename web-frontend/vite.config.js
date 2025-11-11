import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    },
    server: {
        port: 4173,
        host: true,
        open: false,
        strictPort: true,
        proxy: {
            // Proxy API requests to avoid CORS issues
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
                // Removed rewrite since backend uses /api/v1/auth paths
            }
        }
    },
    preview: {
        port: 4173,
        host: true,
        strictPort: true,
    },
});
