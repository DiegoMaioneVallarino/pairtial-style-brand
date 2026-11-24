// Pure, deterministic layout engine. No DOM, network or dependencies.
export const VERSION = 1;
export const GRID = Object.freeze({columns:12, rows:8});
export const BACKGROUNDS = Object.freeze(['bg-white','bg-silver','bg-carbon','bg-grid']);
export const MATERIALS = Object.freeze(['layer','layer-dark','soft','card','card-black','sunken','dark-panel','exp-active','exp-running']);
export const WIDGETS = Object.freeze(['metric','chart','slider','toggle','actions','list','typography','input']);
const labels = {
 metric:['Capacidad','Índice','Balance','Progreso','Actividad'], chart:['Fluctuación','Serie de datos','Señal','Tendencia'],
 slider:['Intensidad','Precisión','Nivel','Amplitud'], toggle:['Modo automático','Sincronización','Visibilidad','Control activo'],
 actions:['Operaciones','Acceso rápido','Herramientas','Acciones'], list:['Colección','Secuencia','Registro','Selección'],
 typography:['Forma','Órbita','Materia','Horizonte','Atlas'], input:['Nombre','Referencia','Etiqueta','Búsqueda']
};
export function rng(seed){let state=seed>>>0;return ()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const pick=(random,items)=>items[Math.floor(random()*items.length)];
const int=(random,min,max)=>min+Math.floor(random()*(max-min+1));
export function layout(seed,count){
 if(!Number.isInteger(count)||count<3||count>9)throw new Error('Se requieren entre 3 y 9 módulos.');
 const random=rng(seed), boxes=[{x:0,y:0,w:GRID.columns,h:GRID.rows}];
 while(boxes.length<count){
  const candidates=boxes.map((b,i)=>({b,i})).filter(({b})=>b.w>=6||b.h>=4);
  if(!candidates.length)throw new Error('No hay espacio para dividir.');
  // Favor larger regions but retain stochastic asymmetry.
  const ranked=candidates.map(c=>({...c,score:c.b.w*c.b.h*(.65+random()*.7)})).sort((a,b)=>b.score-a.score);
  const {b,i}=ranked[0];
  const vertical=b.w>=6&&(b.h<4||random()<b.w/(b.w+b.h*1.5));
  if(vertical){const cut=int(random,3,b.w-3);boxes.splice(i,1,{...b,w:cut},{...b,x:b.x+cut,w:b.w-cut});}
  else {const cut=int(random,2,b.h-2);boxes.splice(i,1,{...b,h:cut},{...b,y:b.y+cut,h:b.h-cut});}
 }
 return boxes.sort((a,b)=>a.y-b.y||a.x-b.x);
}
export function generate(seed,count=6){
 const random=rng(seed^0xA1B2C3D4), background=pick(random,BACKGROUNDS);
 const dark=background==='bg-carbon';
 const palette=dark?['layer-dark','card-black','dark-panel','layer','exp-active']:['layer','soft','card','sunken','exp-active','layer-dark','card-black'];
 const widgets=[...WIDGETS];
 const blocks=layout(seed,count).map((rect,i)=>{
  const widget=widgets.length?widgets.splice(int(random,0,widgets.length-1),1)[0]:pick(random,WIDGETS);
  return {id:`module-${i+1}`,...rect,material:pick(random,palette),widget,title:pick(random,labels[widget]),value:int(random,15,88),text:''};
 });
 // Occasionally an animated accent; never a collection of competing pulses.
 if(random()<.25)blocks[int(random,0,blocks.length-1)].material='exp-running';
 return {version:VERSION,seed:seed>>>0,background,grid:{...GRID},blocks};
}
export function reshuffle(document,seed){const rectangles=layout(seed,document.blocks.length);return {...document,seed:seed>>>0,blocks:document.blocks.map((b,i)=>({...b,...rectangles[i]}))};}
function fail(message){throw new Error(`Composición inválida: ${message}`);}
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function parseComposition(raw){
 if(typeof raw!=='string'||raw.length>100000)fail('el archivo supera el límite de 100 KB.');
 let doc;try{doc=JSON.parse(raw);}catch{fail('JSON incorrecto.');}
 if(!object(doc)||doc.version!==VERSION||!integer(doc.seed,0,4294967295)||!BACKGROUNDS.includes(doc.background))fail('versión, semilla o fondo no admitidos.');
 if(!object(doc.grid)||doc.grid.columns!==GRID.columns||doc.grid.rows!==GRID.rows)fail('cuadrícula no admitida.');
 if(!Array.isArray(doc.blocks)||!integer(doc.blocks.length,3,9))fail('cantidad de módulos fuera de rango.');
 const ids=new Set(), occupied=new Set();
 const blocks=doc.blocks.map(b=>{
  if(!object(b)||typeof b.id!=='string'||!/^module-[1-9]$/.test(b.id)||ids.has(b.id))fail('identificador duplicado o incorrecto.');ids.add(b.id);
  if(!integer(b.x,0,9)||!integer(b.y,0,6)||!integer(b.w,3,12)||!integer(b.h,2,8)||b.x+b.w>12||b.y+b.h>8)fail('módulo fuera de los límites.');
  if(!MATERIALS.includes(b.material)||!WIDGETS.includes(b.widget)||typeof b.title!=='string'||b.title.length>60||!integer(b.value,0,100)||typeof b.text!=='string'||b.text.length>120)fail('material, contenido o valor no admitidos.');
  for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){const key=y*12+x;if(occupied.has(key))fail('los módulos se superponen.');occupied.add(key);}
  const {id,x,y,w,h,material,widget,title,value,text}=b;return {id,x,y,w,h,material,widget,title,value,text};
 });
 if(occupied.size!==GRID.columns*GRID.rows)fail('la cuadrícula contiene huecos.');
 return {version:VERSION,seed:doc.seed,background:doc.background,grid:{...GRID},blocks};
}
