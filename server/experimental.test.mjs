import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createApp} from './index.mjs';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
test('experimental collection remains separate and all classes exist',async()=>{const c=JSON.parse(await read('../src/experimental.json'));const css=await read('../packages/brand/experimental.css');const base=JSON.parse(await read('../src/catalog.json'));assert.equal(c.length,46);assert.equal(base.length,49);assert.equal(new Set([...c,...base].map(x=>x.id)).size,95);for(const x of c){assert.equal(x.category,'Nuevos estilos');for(const cls of x.classes){assert.ok(cls.startsWith('pt-exp-'));assert.ok(css.includes('.'+cls),cls);}}assert.doesNotMatch(await read('../packages/brand/index.css'),/experimental/);assert.doesNotMatch(css,/box-shadow:\s*inset/);});
test('experimental API is opt-in',async()=>{const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));try{const base=`http://127.0.0.1:${server.address().port}`;assert.equal((await(await fetch(base+'/api/experimental')).json()).length,46);assert.equal((await(await fetch(base+'/api/catalog')).json()).length,49);assert.equal((await fetch(base+'/styles/experimental.css')).status,200);}finally{await new Promise(r=>server.close(r));}});

test('visual studies preserve independent provenance and dark previews',async()=>{const c=JSON.parse(await read('../src/experimental.json'));const n=c.filter(x=>x.id.startsWith('exp-study-'));assert.equal(n.length,30);for(const [source,count] of Object.entries({Landing:7,Servicios:6,Paix:10,Silvana:7}))assert.equal(n.filter(x=>x.source.startsWith(source+' ·')).length,count);for(const id of ['carbon-search','dark-toolrail','chat-picker','chat-textarea'])assert.equal(n.find(x=>x.id==='exp-study-'+id).background,'dark');for(const x of n)for(const m of x.html.matchAll(/class="([^" ]+(?: [^" ]+)*)"/g))for(const cls of m[1].split(/\s+/))assert.ok(x.classes.includes(cls));});

test('experimental refinements consolidate cards and preserve custom control materials',async()=>{
 const c=JSON.parse(await read('../src/experimental.json'));
 const css=await read('../packages/brand/experimental.css');
 const app=await read('../src/App.tsx');
 const by=id=>c.find(x=>x.id===id);
 assert.equal(c.filter(x=>x.id.startsWith('exp-file')).length,1);
 assert.equal(by('exp-file').name,'File card');
 assert.match(by('exp-file').html,/data-format="txt"/);
 for(const format of ['xlsx','js','css']){assert.ok(css.includes(`[data-format=${format}]`));assert.ok(app.includes(`format:'${format}'`));}
 assert.match(css,/\.pt-exp-active-output\s*\{[^}]*min-height:0; padding:4px/);
 assert.match(css,/\.pt-exp-dock-nav button:last-child\s*\{[^}]*border-radius:4px 15px 15px 7px/);
 assert.match(by('exp-study-circular-button').html,/pt-exp-study-circular-core-face[^>]*><svg/);
 assert.doesNotMatch(by('exp-study-circular-button').html,/Grabar|record|stop/i);
 assert.match(css,/\.pt-exp-param-range\s*\{[^}]*appearance:none[^}]*linear-gradient\(45deg,#0057fe,#00c4ff\)/);
 for(const pseudo of ['::-webkit-slider-thumb','::-moz-range-thumb'])assert.ok(css.includes('.pt-exp-param-range'+pseudo));
 assert.doesNotMatch(css,/\.pt-exp-param-range\s*\{[^}]*accent-color/);
});
