import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { twdHmr } from 'twd-js/vite-plugin'
import { twdRemote } from 'twd-relay/vite'
import istanbul from "vite-plugin-istanbul"
import type { PluginOption } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    twdHmr(),
    twdRemote() as PluginOption,
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "**/*.twd.test.ts"],
      requireEnv: !process.env.CI,
      extension: ['.ts', '.tsx'],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
