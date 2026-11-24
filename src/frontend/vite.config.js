import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Бэкенд не настроен на CORS, поэтому все запросы фронтенда идут
// через прокси Vite и остаются в рамках одного origin.
const BACKEND = process.env.VITE_BACKEND_URL || 'http://localhost:8000'

const PROXY_ROUTES = [
  '/health',
  '/regions',
  '/auctions',
  '/rate-car',
  '/car_compare',
  '/log',
  '/docs',
  '/openapi.json',
]

const proxy = Object.fromEntries(
  PROXY_ROUTES.map((route) => [route, { target: BACKEND, changeOrigin: true }]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
})
