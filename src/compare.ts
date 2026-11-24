const frames=document.querySelector<HTMLElement>('.frames')!;
const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-mode]')).filter(x=>x.tagName==='BUTTON');
const original=document.getElementById('v01')!;
const rings=document.getElementById('v02')!;
function setMode(mode:string){
 if(!['v01','v02','both'].includes(mode))mode='v02';
 frames.dataset.mode=mode; original.hidden=mode==='v02'; rings.hidden=mode==='v01';
 for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.mode===mode));
 try{localStorage.setItem('pt-compare-mode',mode);}catch{}
}
for(const button of buttons)button.addEventListener('click',()=>setMode(button.dataset.mode??'v02'));
try{setMode(localStorage.getItem('pt-compare-mode')??'v02');}catch{setMode('v02');}
