import { defineConfig } from 'vite'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

function prettyStaticRoutes() {
  return {
    name: 'escbase-pretty-static-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url || !['GET', 'HEAD'].includes(req.method || '')) return next()

        const url = new URL(req.url, 'http://localhost')
        if (url.pathname === '/' || url.pathname.includes('.')) return next()

        let decodedPath = ''
        try {
          decodedPath = decodeURIComponent(url.pathname)
        } catch {
          return next()
        }

        const cleanPath = decodedPath.replace(/^\/+|\/+$/g, '')
        if (!cleanPath || cleanPath.split('/').includes('..')) return next()

        const indexFile = join(process.cwd(), 'public', cleanPath, 'index.html')
        if (!existsSync(indexFile)) return next()

        req.url = `/${cleanPath}/index.html${url.search}`
        return next()
      })
    },
  }
}

export default defineConfig({
  plugins: [prettyStaticRoutes()],
  server: {
    port: 5173
  },
})
