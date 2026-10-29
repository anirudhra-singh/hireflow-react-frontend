import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Tailwind runs at BUILD time through this plugin, so the browser only receives
// a normal CSS file. WHY it matters: no CDN script is needed, and the strict CSP
// (style-src 'self') can stay strict.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});