import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { compilerOptions, transformAssetUrls } from 'vue3-pixi'

const { isCustomElement } = compilerOptions
const myCustomElements = new Set(['ShockwaveFilter', 'GlitchFilter', 'RGBSplitFilter', 'NoiseFilter'])

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    vue({
      template: {
        // support for custom elements and remove the unknown element warnings
        compilerOptions: {
          isCustomElement: (tag) => {
            return isCustomElement(tag) || myCustomElements.has(tag)
          }
        },
        // support for asset url conversion
        transformAssetUrls,
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue'],
  },
})
