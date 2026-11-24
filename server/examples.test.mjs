import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createApp} from './index.mjs';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const examples=JSON.parse(await read('../src/examples.json'));
const catalog=JSON.parse(await read('../src/catalog.json'));
const source=await read('../src/Examples.tsx');
test('seven compositions reference only existing catalog items',()=>{
 assert.equal(examples.length,7);
 assert.equal(new Set(examples.map(x=>x.id)).size,7);
 for(const example of examples){assert.ok(example.styles.length>=5);assert.equal(new Set(example.styles).size,example.styles.length);for(const id of example.styles)assert.ok(catalog.some(x=>x.id===id),id);assert.match(source,new RegExp(`\\b${example.id}:\\w+`));}
});
test('examples are integrated in the studio and reuse the library',async()=>{
 const app=await read('../src/App.tsx');assert.match(app,/navigate\('Ejemplos'\)/);assert.match(app,/<Examples query=\{query\}/);assert.match(source,/onStyle\(item\)/);assert.match(source,/setReset\(n=>n\+1\)/);const css=await read('../packages/brand/components.css');for(const name of ['pt-exp-active','pt-exp-running','pt-exp-param-range','pt-node','pt-exp-study-chat-panel','pt-exp-file','pt-exp-study-service-card']){assert.ok(source.includes(name));assert.ok(css.includes('.'+name));}
});
test('Node API serves composition metadata independently of the catalog',async()=>{
 const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));try{const base=`http://127.0.0.1:${server.address().port}`;assert.deepEqual(await(await fetch(base+'/api/examples')).json(),examples);assert.equal((await(await fetch(base+'/api/catalog')).json()).length,91);}finally{await new Promise(r=>server.close(r));}
});
