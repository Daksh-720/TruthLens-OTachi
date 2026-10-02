import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function truthlensDevApiPlugin() {
  return {
    name: 'truthlens-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/health' || url === '/api/misinformation/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'UP',
            geminiIntegration: 'UP',
            service: 'TruthLens Forensic Backend',
            timestamp: Date.now()
          }));
          return;
        }

        if (url.startsWith('/api/verify/') || url === '/api/misinformation/analyze') {
          let body = {};
          if (req.method === 'POST') {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const rawBody = Buffer.concat(chunks).toString();
            try {
              body = JSON.parse(rawBody);
            } catch (e) {
              body = { content: rawBody };
            }
          }
          req.body = body;

          const mockRes = {
            setHeader: (k, v) => res.setHeader(k, v),
            status: (code) => {
              res.statusCode = code;
              return mockRes;
            },
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end: () => res.end()
          };

          try {
            if (url === '/api/verify/text' || url === '/api/misinformation/analyze') {
              const textModule = await import('./api/verify/text.js');
              return await textModule.default(req, mockRes);
            } else if (url === '/api/verify/media') {
              const mediaModule = await import('./api/verify/media.js');
              return await mediaModule.default(req, mockRes);
            } else if (url === '/api/verify/url') {
              const urlModule = await import('./api/verify/url.js');
              return await urlModule.default(req, mockRes);
            } else if (url === '/api/verify/social') {
              const socialModule = await import('./api/verify/social.js');
              return await socialModule.default(req, mockRes);
            }
          } catch (err) {
            console.error('Local dev API execution error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    truthlensDevApiPlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
