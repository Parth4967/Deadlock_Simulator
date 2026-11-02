import { defineConfig } from 'vite';
import { exec, execFile } from 'child_process';
import path from 'path';
import fs from 'fs';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    plugins: [
      {
        name: 'c-deadlock-backend',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/api/c-engine')) {
              // Parse query or body
              const url = new URL(req.url, 'http://localhost:3000');
              const args: string[] = [];

              const preset = url.searchParams.get('preset');
              if (preset) {
                args.push('--preset', preset);
              }

              const terminate = url.searchParams.get('terminate');
              if (terminate) {
                args.push('--terminate', terminate);
              }

              const preempt = url.searchParams.get('preempt');
              if (preempt) {
                const parts = preempt.split(',');
                if (parts.length === 3) {
                  args.push('--preempt', parts[0], parts[1], parts[2]);
                }
              }

              const binaryPath = path.resolve(__dirname, 'deadlock_sim');

              execFile(binaryPath, args, (err, stdout, stderr) => {
                if (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message, stderr }));
                  return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(stdout);
              });
              return;
            }

            if (req.url === '/api/c-source') {
              const srcPath = path.resolve(__dirname, 'src/deadlock.c');
              fs.readFile(srcPath, 'utf8', (err, data) => {
                if (err) {
                  res.statusCode = 500;
                  res.end('Error reading source');
                  return;
                }
                res.setHeader('Content-Type', 'text/plain');
                res.end(data);
              });
              return;
            }

            if (req.url === '/api/recompile-c') {
              exec('gcc -O2 -Wall src/deadlock.c -o deadlock_sim', (err, stdout, stderr) => {
                res.setHeader('Content-Type', 'application/json');
                if (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: stderr || err.message }));
                  return;
                }
                res.end(JSON.stringify({ success: true, message: 'Compilation successful with gcc -O2 -Wall!' }));
              });
              return;
            }

            next();
          });
        },
      },
    ],
  };
});
