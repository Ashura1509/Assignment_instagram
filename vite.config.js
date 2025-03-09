import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        // https: {
        //   key: fs.readFileSync('./ssl/server.key'),
        //   cert: fs.readFileSync('./ssl/server.crt'),
        // },
        host: 'localhost',
        port: 5173,
        // cors: true,
        hmr: {
            overlay: false,
        },
    },
  
});


