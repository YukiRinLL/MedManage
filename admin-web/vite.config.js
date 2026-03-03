import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/wechat': {
        target: 'https://mp.weixin.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wechat/, ''),
        secure: false
      }
    }
  }
})
