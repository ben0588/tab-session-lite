import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    // 自訂插件：複製 lazy.html 到 dist 目錄
    {
      name: 'copy-lazy-html',
      closeBundle() {
        const source = resolve(__dirname, 'lazy.html')
        const dest = resolve(__dirname, 'dist/lazy.html')
        const destDir = dirname(dest)
        
        // 確保目標目錄存在
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true })
        }
        
        // 複製檔案
        if (existsSync(source)) {
          copyFileSync(source, dest)
          console.log('✓ lazy.html copied to dist/')
        }
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    cors: true,
  },
  build: {
    // 生產環境移除 console 和 debugger
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
