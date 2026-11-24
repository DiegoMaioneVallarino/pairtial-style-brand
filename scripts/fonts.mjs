import { copyFile, mkdir, access, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=process.argv[2];
if(!source){console.error('Uso: npm run fonts -- "C:\\ruta\\a\\tus\\fuentes"');process.exit(1);}
const files=[['pair.otf','Pair Regular',400],['pair-Pro-Display-Thin.otf','Pair Pro Display',100],['pair-Pro-Display-Regular.otf','Pair Pro Display',400],['pair-Pro-Display-Medium.otf','Pair Pro Display',500],['pair-pro-bold.otf','Pair Pro Display',700],['pair-Pro-Text-Thin.otf','Pair Pro Text',100],['pair-Pro-Text-Medium.otf','Pair Pro Text',500]];
const dest=resolve(root,'public/fonts');await mkdir(dest,{recursive:true});let css='';let installed=0;
for(const [filename,family,weight] of files){try{await access(resolve(source,filename));if(resolve(source,filename)!==resolve(dest,filename))await copyFile(resolve(source,filename),resolve(dest,filename));installed++;}catch(e){try{await access(resolve(dest,filename));installed++;}catch{console.warn(`No se pudo instalar ${filename}: ${e.message}`);}}css+=`@font-face { font-family: "${family}"; src: url("./${filename}") format("opentype"); font-weight: ${weight}; font-style: normal; font-display: ${family==='Pair Regular'?'block':'swap'}; }\n`;}
await writeFile(resolve(dest,'local.css'),css);console.log(`${installed}/${files.length} fuentes locales instaladas. No publiques estos binarios sin permiso.`);if(installed!==files.length)process.exitCode=1;
