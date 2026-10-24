import { defineConfig } from 'astro/config';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  outDir: './dist/public',
  output: 'static',
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT || 4321),
    strictPort: true,
    allowedHosts: true,
  },
});
