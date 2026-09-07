import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

// This project intentionally keeps manifest.json and pages.json at the root.
process.env.UNI_INPUT_DIR ||= '.'

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  }
})
