import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 固定端口：后端 CORS 只放行 http://localhost:5173，端口漂移会导致登录等请求全部被拦
    port: 5173,
    strictPort: true,
  },
});
