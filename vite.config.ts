import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ts.ispat.db/', // 🔥 THIS LINE FIXES THE PROBLEM
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
