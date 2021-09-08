import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {
      '/api/users/current': 'http://localhost:5000',
      '/api/login': 'http://localhost:5000',
    },
  },
  build: {
    outDir: './build',
  },
});
