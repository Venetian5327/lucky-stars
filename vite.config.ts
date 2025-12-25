import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 必须匹配你的仓库名：lucky-stars
  base: '/lucky-stars/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 确保生成 sourcemap 以便在生产环境中调试
    sourcemap: true,
    // 资源文件放置目录
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
        },
      },
    },
  },
  server: {
    // 本地开发配置
    port: 3000,
    open: true
  }
});