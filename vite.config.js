import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Local only: run the Subscription Graveyard app's /api/graveyard/* routes the way Vercel does,
// and open /graveyard-app/ at its own index.html instead of the portfolio.
function graveyardApp() {
  return {
    name: 'graveyard-app-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        if (url.pathname === '/graveyard-app' || url.pathname === '/graveyard-app/') {
          req.url = '/graveyard-app/index.html'
          return next()
        }
        if (!url.pathname.startsWith('/api/graveyard/')) return next()
        const name = url.pathname.slice('/api/graveyard/'.length).replace(/[^a-z-]/g, '')
        if (!name || name.startsWith('_')) { res.statusCode = 404; return res.end('Not found') }
        let raw = ''
        for await (const chunk of req) raw += chunk
        req.body = raw ? JSON.parse(raw) : {}
        res.status = code => { res.statusCode = code; return res }
        res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)) }
        try {
          const mod = await import(pathToFileURL(path.resolve('api/graveyard', name + '.js')).href)
          return mod.default(req, res)
        } catch {
          res.statusCode = 404
          res.end('Not found')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), graveyardApp()],
})
