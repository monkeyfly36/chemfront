import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import svgr from '@svgr/rollup';

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      "Src": resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',

    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "Src/styles/variables.scss";`,
      }
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      // '/api': {
      //   target: 'http://localhost:11434',
      //   secure: false,
      //   changeOrigin: true,
      // },
      '/ollama': {
        target: 'http://10.1.80.225:3000',
        secure: false,
        changeOrigin: true,
      },

      '/v1': {
        target: 'http://10.140.24.107:10001',
        secure: false,
        changeOrigin: true,
      },
    }
  },
})
