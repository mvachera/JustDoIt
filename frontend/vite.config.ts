import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // En build ou si on est sur le port 8080 (nginx), utilise /JustDoIt/
  const needsBase = command === 'build' || process.env.PORT === '8080';
  
  return {
    plugins: [react()],
    base: needsBase ? '/JustDoIt/' : '/',
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  }
})