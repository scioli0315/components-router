import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(process.cwd(), 'playground'),
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@playground': resolve(process.cwd(), 'playground'),
      '@src': resolve(process.cwd(), 'src')
    }
  }
})
