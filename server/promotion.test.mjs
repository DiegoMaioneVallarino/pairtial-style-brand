import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createApp} from './index.mjs';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const catalog=JSON.parse(await read('../src/catalog.json'));
const css=await read('../packages/brand/components.css');
const app=await read('../src/App.tsx');
const by=id=>catalog.find(x=>x.id===id);
test('all 42 retained studies are promoted; four unwanted cards are absent',()=>{
 assert.equal(catalog.length,91);assert.equal(catalog.filter(x=>x.id.startsWith('exp-')).length,42);
 for(const id of ['exp-study-product-panel','exp-study-service-card-steel','exp-study-glass-device','exp-study-split-selection'])assert.equal(by(id),undefined);
 assert.ok(catalog.every(x=>x.category!=='Nuevos estilos'));
 assert.doesNotMatch(app,/LABORATORIO|experimental\.json|experimentalCSS/);
 assert.doesNotMatch(css,/\.pt-exp-study-product-panel\b|\.pt-exp-study-split-cell\b/);
});
test('rotating borders distinguish neutral pipeline from blue pulse and start',()=>{
 const rule=cls=>css.match(new RegExp('^\\.'+cls+'\\s*\\{([^}]+)\\}','m'))?.[1];
 assert.match(rule('pt-exp-active'),/linear-gradient\(var\(--pt-border-angle,0deg\),#888,#e1e1e1,#fafafa,#a4a4a4\)/);
 assert.match(rule('pt-exp-active'),/animation:pt-border-rotation/);assert.doesNotMatch(rule('pt-exp-active'),/pulse|box-shadow/);
 assert.match(rule('pt-exp-running'),/pt-border-rotation.*pt-exp-pulse/);
 assert.match(rule('pt-exp-study-chat-start'),/animation:pt-border-rotation/);
 assert.match(css,/@property --pt-border-angle/);assert.match(css,/@keyframes pt-border-rotation/);
 assert.match(css,/prefers-reduced-motion:reduce[^\n]*\.pt-exp-active,\.pt-exp-running,\.pt-exp-study-chat-start\{animation:none/);
});
test('combined service variants, standalone popover and font correction',()=>{
 assert.match(by('exp-study-service-card-violet').html,/data-variant="violet"/);
 assert.match(css,/\[data-variant=steel\] \.pt-exp-study-service-art/);
 assert.match(app,/id:'steel'/);
 assert.match(by('exp-study-split-popover').html,/^<div class="pt-exp-study-split-popover">/);
 assert.doesNotMatch(by('exp-study-split-popover').html,/class="pt-exp-study-split(?:"|-cell)/);
 assert.match(css,/\.pt-exp-study-split-popover\{position:relative/);
 assert.match(css,/\.pt-exp-study-color-panel small\{font:500 12px var\(--pt-font-display/);
});
test('main CSS includes the retained styles and old experimental API is removed',async()=>{
 assert.match(await read('../packages/brand/index.css'),/components.css/);
 assert.match(css,/\.pt-exp-param-range\s*\{[^}]*appearance:none/);
 assert.equal(catalog.filter(x=>x.id.startsWith('exp-file')).length,1);
 const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));try{const base=`http://127.0.0.1:${server.address().port}`;assert.equal((await fetch(base+'/api/experimental')).status,404);assert.match(await(await fetch(base+'/styles/components.css')).text(),/pt-border-rotation/);}finally{await new Promise(r=>server.close(r));}
});
