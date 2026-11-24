import {useRef,useState,type ReactNode,type ChangeEvent} from 'react';
import {generate,reshuffle,parseComposition,BACKGROUNDS,type Block,type Composition,type Background} from './composition-engine.mjs';
import catalog from './catalog.json';
import './random-composition.css';

const freshSeed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
const STORAGE='pairtial.random-composition.v1';
const backgroundClasses:Record<Background,string>={'bg-white':'pt-bg-white','bg-silver':'pt-bg-silver','bg-carbon':'pt-bg-carbon','bg-grid':'pt-bg-grid'};
const names=new Map(catalog.map(x=>[x.id,x.name]));
const darkMaterials=new Set(['layer-dark','card-black','dark-panel']);
function Material({block,children}:{block:Block;children:ReactNode}){
 const dark=darkMaterials.has(block.material);
 const content=<div className="rc-content" data-pt-surface={dark?'dark':'light'}>{children}</div>;
 switch(block.material){
  case 'layer':return <div className="rc-material pt-layer"><div className="pt-layer__in">{content}</div></div>;
  case 'layer-dark':case 'sunken':return <div className={`rc-material pt-ring ${dark?'pt-layer-ring pt-layer--dark':'pt-sunken'}`}><div className="pt-ring__inner"><div className="pt-ring__face">{content}</div></div></div>;
  case 'dark-panel':return <div className="rc-material pt-panel-dark"><div className="pt-panel-dark__in">{content}</div></div>;
  case 'exp-active':case 'exp-running':return <div className={`rc-material pt-exp-ring pt-exp-active ${block.material==='exp-running'?'pt-exp-running':''}`}><div className="pt-exp-face">{content}</div></div>;
  case 'soft':return <div className="rc-material pt-soft">{content}</div>;
  case 'card-black':return <div className="rc-material pt-card pt-card--black">{content}</div>;
  default:return <div className="rc-material pt-card">{content}</div>;
 }
}
function Widget({block:b,change}:{block:Block;change:(patch:Partial<Block>)=>void}){
 const dark=darkMaterials.has(b.material);
 switch(b.widget){
  case 'metric':return <div className="rc-metric"><strong className={dark?'pt-text-gradient-light':'pt-text-gradient'}>{b.value}<small>%</small></strong><div className="rc-track"><span style={{width:`${b.value}%`}}/></div></div>;
  case 'chart':{const points=Array.from({length:12},(_,i)=>[i*20,Math.max(8,Math.min(58,54-b.value*.35+Math.sin(i*1.7+b.value)*13+Math.cos(i*.7)*8))]);const path=points.map(([x,y],i)=>`${i?'L':'M'}${x},${y.toFixed(2)}`).join(' ');return <svg className="rc-chart" viewBox="0 0 220 66" role="img" aria-label={`Gráfico ilustrativo, índice ${b.value}`} preserveAspectRatio="none"><path d="M0 20H220M0 40H220M0 60H220" stroke="currentColor" opacity=".14" fill="none"/><path d={`${path} L220,66 L0,66 Z`} fill="#008cff" opacity=".13"/><path d={path} stroke={dark?'#00c4ff':'#0066ff'} strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none"/></svg>;}
  case 'slider':return <div className="rc-widget-stack"><output className="rc-number">{b.value}<small> / 100</small></output><input className="pt-exp-param-range" aria-label={b.title} type="range" min="0" max="100" value={b.value} onChange={e=>change({value:Number(e.target.value)})}/></div>;
  case 'toggle':return <div className="rc-toggle"><span>{b.value>=50?'Activado':'En pausa'}</span><input className="pt-toggle" aria-label={b.title} type="checkbox" checked={b.value>=50} onChange={e=>change({value:e.target.checked?100:0})}/></div>;
  case 'actions':return <div className="rc-actions"><button type="button" className="pt-btn pt-btn--black" onClick={()=>change({value:0})}>Reiniciar</button><button type="button" className="pt-ring-btn pt-btn--orange" onClick={()=>change({value:(b.value+10)%101})}><span className="pt-ring__inner"><span className="pt-ring__face">Avanzar</span></span></button><small role="status">Estado · {b.value}%</small></div>;
  case 'list':return <div className="rc-list">{['01','02','03'].map((n,i)=><button type="button" key={n} className={`pt-btn ${b.value%3===i?'pt-btn--black':''}`} aria-pressed={b.value%3===i} onClick={()=>change({value:i})}><span>Elemento {n}</span><span>{b.value%3===i?'●':'○'}</span></button>)}</div>;
  case 'typography':return <div className="rc-type"><span className={dark?'pt-text-gradient-light':'pt-text-gradient-metal'}>Aa</span><div className="pt-bg-brand"/><small>Display / {b.value}</small></div>;
  case 'input':return <div className="rc-widget-stack"><label className="pt-input"><span className="pt-ring__inner"><input aria-label={b.title} maxLength={120} placeholder="Escribe aquí…" value={b.text} onChange={e=>change({text:e.target.value})}/></span></label><small>{b.text.length} caracteres</small></div>;
 }
}
function Canvas({doc,onChange}:{doc:Composition;onChange:(id:string,patch:Partial<Block>)=>void}){
 return <div className={`rc-canvas ${backgroundClasses[doc.background]}`} aria-label="Composición generada">{doc.blocks.map(b=><div className="rc-region" key={b.id} style={{gridColumn:`${b.x+1} / span ${b.w}`,gridRow:`${b.y+1} / span ${b.h}`}}><Material block={b}><div className="rc-module-header"><span>{b.title}</span><small>{b.id.split('-')[1].padStart(2,'0')}</small></div><div className="rc-widget"><Widget block={b} change={patch=>onChange(b.id,patch)}/></div><div className="rc-material-name">{names.get(b.material)}</div></Material></div>)}</div>;
}
export default function RandomComposition(){
 const dialog=useRef<HTMLDialogElement>(null), file=useRef<HTMLInputElement>(null), trigger=useRef<HTMLButtonElement>(null);
 const [doc,setDoc]=useState<Composition>(()=>generate(freshSeed(),6));
 const [seed,setSeed]=useState(String(doc.seed));const [count,setCount]=useState(6);const [showJson,setShowJson]=useState(false);const [status,setStatus]=useState('');const [error,setError]=useState(false);
 const json=JSON.stringify(doc,null,2);
 function message(text:string,bad=false){setStatus(text);setError(bad);}
 function apply(next:Composition,notice:string){setDoc(next);setSeed(String(next.seed));setCount(next.blocks.length);message(notice);}
 function regenerate(){apply(generate(freshSeed(),count),'Nueva exploración generada.');}
 function bySeed(){const n=Number(seed);if(!seed.trim()||!Number.isInteger(n)||n<0||n>4294967295){message('La semilla debe ser un entero entre 0 y 4294967295.',true);return;}apply(generate(n,count),'Composición generada desde la semilla.');}
 function change(id:string,patch:Partial<Block>){setDoc(old=>({...old,blocks:old.blocks.map(b=>b.id===id?{...b,...patch}:b)}));}
 function download(){const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`pairtial-composition-${doc.seed}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message('JSON preparado para descargar.');}
 async function loadFile(e:ChangeEvent<HTMLInputElement>){const chosen=e.target.files?.[0];e.target.value='';if(!chosen)return;try{if(chosen.size>100000)throw new Error('El archivo supera 100 KB.');apply(parseComposition(await chosen.text()),'Composición importada.');}catch(err){message(err instanceof Error?err.message:'No se pudo importar.',true);}}
 function saveLocal(){try{localStorage.setItem(STORAGE,json);message('Exploración guardada en este navegador.');}catch{message('No se pudo guardar localmente. Exporta el JSON.',true);}}
 function loadLocal(){try{const saved=localStorage.getItem(STORAGE);if(!saved){message('Todavía no hay una exploración guardada.',true);return;}apply(parseComposition(saved),'Exploración local recuperada.');}catch(err){message(err instanceof Error?err.message:'No se pudo cargar.',true);}}
 return <article className="ex-card rc-launch"><div className="ex-card-heading"><div><small>Exploración generativa</small><h2>Random composition</h2></div><small>LAB / 01</small></div><p>Descubre combinaciones inéditas de materiales, proporciones y controles.</p><div className="rc-launch-art pt-bg-silver" aria-hidden="true"><div className="pt-layer rc-launch-large"><div className="pt-layer__in"><span className="pt-text-gradient">Aa</span><div className="pt-bg-brand"/></div></div><div className="pt-ring pt-layer-ring pt-layer--dark rc-launch-dark"><div className="pt-ring__inner"><div className="pt-ring__face">73<small>%</small></div></div></div><div className="pt-card rc-launch-small"><div className="rc-track"><span style={{width:'65%'}}/></div></div><div className="pt-exp-ring pt-exp-active rc-launch-active"><div className="pt-exp-face">◈</div></div></div><button ref={trigger} type="button" className="pt-btn pt-btn--black rc-open" onClick={()=>dialog.current?.showModal()}>↗ Abrir generador</button>
 <dialog ref={dialog} className="rc-dialog" aria-labelledby="rc-title" onClose={()=>trigger.current?.focus()}><div className="rc-dialog-inner"><header className="rc-header"><div><small>PAIR TIAL / COMPOSITION ENGINE</small><h2 id="rc-title">Exploración aleatoria</h2><p>Distribución espacial, materiales y controles del catálogo.</p></div><button type="button" className="plain-button" aria-label="Cerrar generador" onClick={()=>dialog.current?.close()}>✕ Cerrar</button></header><div className="rc-toolbar"><button type="button" className="pt-btn pt-btn--black" onClick={regenerate}>↻ Generar otra</button><button type="button" className="pt-btn" onClick={()=>apply(reshuffle(doc,freshSeed()),'Distribución reorganizada. Materiales y contenido conservados.')}>Reorganizar divs</button><label>Módulos <select value={count} onChange={e=>setCount(Number(e.target.value))}>{[3,4,5,6,7,8,9].map(n=><option key={n}>{n}</option>)}</select></label><label>Fondo <select value={doc.background} onChange={e=>setDoc(old=>({...old,background:e.target.value as Background}))}>{BACKGROUNDS.map(bg=><option key={bg} value={bg}>{names.get(bg)}</option>)}</select></label></div><div className="rc-seed-row"><label>Semilla <input type="number" min="0" max="4294967295" step="1" value={seed} onChange={e=>setSeed(e.target.value)}/></label><button className="plain-button" type="button" onClick={bySeed}>Usar semilla</button><small>{doc.blocks.length} módulos · 12 × 8 · {doc.seed}</small></div><div className="rc-preview-scroll"><Canvas doc={doc} onChange={change}/></div><footer className="rc-footer"><div className="rc-toolbar"><button type="button" className="pt-btn pt-btn--black" onClick={download}>↓ Exportar JSON</button><button type="button" className="pt-btn" onClick={()=>file.current?.click()}>↑ Cargar JSON</button><input ref={file} type="file" accept=".json,application/json" hidden onChange={loadFile}/><button type="button" className="plain-button" onClick={saveLocal}>Guardar local</button><button type="button" className="plain-button" onClick={loadLocal}>Recuperar local</button><button type="button" className="plain-button" aria-expanded={showJson} onClick={()=>setShowJson(x=>!x)}>{showJson?'Ocultar JSON':'Ver JSON'}</button></div><p className={`rc-status ${error?'rc-error':''}`} role="status">{status||'Las exploraciones se ejecutan localmente. El JSON conserva la distribución y el estado de los controles.'}</p>{showJson&&<textarea className="rc-json" aria-label="JSON de la composición" readOnly value={json}/>}</footer></div></dialog></article>;
}
