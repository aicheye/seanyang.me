import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

interface VercelConfig {
  redirects?: { source: string; destination: string; permanent?: boolean }[]
  rewrites?: { source: string; destination: string }[]
}

function vercelCompat(): Plugin {
  const vercelConfig: VercelConfig = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'vercel.json'), 'utf-8'),
  )

  function applyRoutes(server: ViteDevServer) {
    // Redirects and API rewrites run BEFORE Vite's internal middleware
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split('?')[0] ?? '/'

      for (const { source, destination, permanent } of vercelConfig.redirects ?? []) {
        if (url === source) {
          res.writeHead(permanent ? 301 : 302, { location: destination })
          res.end()
          return
        }
      }

      for (const { source, destination } of vercelConfig.rewrites ?? []) {
        if (url === source && destination.startsWith('/api/')) {
          try {
            const mod = await server.ssrLoadModule(`${destination}.ts`)
            const vercelRes = Object.assign(res, {
              status(code: number) { res.statusCode = code; return vercelRes },
              send(body: unknown) { res.end(body) },
            })
            await mod.default(req, vercelRes)
          } catch (e) {
            next(e)
          }
          return
        }
      }

      next()
    })

    // 404 runs AFTER Vite's internal middleware (assets, HMR, etc. get priority)
    return () => {
      const knownRoutes = new Set([
        '/',
        ...(vercelConfig.rewrites ?? []).map(r => r.source),
      ])
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '/'
        if (!knownRoutes.has(url) && !url.startsWith('/@') && !url.includes('.')) {
          res.statusCode = 404
          res.setHeader('content-type', 'text/html')
          res.end(fs.readFileSync(path.resolve(__dirname, 'public/404.html'), 'utf-8'))
        } else {
          next()
        }
      })
    }
  }

  return {
    name: 'vercel-compat',
    configureServer: applyRoutes,
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    vercelCompat(),
  ],
})
