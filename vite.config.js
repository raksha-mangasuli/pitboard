import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages under /pitboard/ and anywhere else.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', sourcemap: false },
});
