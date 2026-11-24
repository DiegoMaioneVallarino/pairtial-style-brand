import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(import.meta.url);
let vite;
try {vite=join(dirname(require.resolve('vite/package.json')),'bin','vite.js');if(!existsSync(vite))throw new Error('Missing Vite binary');}
catch {console.error('Vite no está instalado. Ejecuta npm install --include=dev y luego npm run dev.');process.exit(1);}
const children=[spawn(process.execPath,['--watch','server/index.mjs'],{cwd:root,stdio:'inherit'}),spawn(process.execPath,[vite],{cwd:root,stdio:'inherit'})];
let closing=false;function stop(code=0){if(closing)return;closing=true;for(const child of children)child.kill();process.exitCode=code;}
for(const child of children){child.on('exit',code=>stop(code??0));child.on('error',e=>{console.error(e);stop(1);});}process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
