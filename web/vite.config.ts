import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const { name } = require('./package.json');
const Q3Rcon = require('quake3-rcon');
require('dotenv').config({ path: '../.env' });

const rcon = new Q3Rcon({
  address: process.env.ADDRESS,
  port: process.env.PORT,
  password: process.env.PASSWORD,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'run-script-on-change',
      apply: 'serve',
      handleHotUpdate({ file }) {
        console.log(`${file} has changed. Restarting resource...`);
        rcon.send(`restart ${name}`, () => {
          console.log(`Resource ${name} restarted`);
        });
      },
    },
  ],
  base: './',
});
