// Uso (desde la raíz del repo): node <este> NIVEL DESDE,HASTA,PASO > p.html; chrome-headless-shell --allow-file-access-from-files --virtual-time-budget=60000 --dump-dom file://…/p.html. Un marco por ancho; #res lista los anchos con palabra cortada.
const { ETIQUETAS, nombreEtiqueta } = await import(process.cwd() + '/practicas/tabla-propiedades/logica.js');
const base='file://'+process.cwd()+'/';
const labels=[];
for (const idioma of ['es','en']) for (const e of ETIQUETAS) labels.push([idioma,e.id,nombreEtiqueta(e.id,idioma)]);
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const tabla=(c0,f0)=>`<div class="tp-tabla" style="--tp-cols: 4"><div class="tp-esquina"></div>${[c0,'Primo','Par','Impar'].map(t=>`<div class="tp-hueco tp-hueco--etiqueta"><button class="tp-pieza tp-pieza--etiqueta">${esc(t)}</button></div>`).join('')}${[f0,'Primo'].map(t=>`<div class="tp-hueco tp-hueco--etiqueta"><button class="tp-pieza tp-pieza--etiqueta">${esc(t)}</button></div>`+[1,2,3,4].map(()=>`<div class="tp-hueco tp-hueco--numero"></div>`).join('')).join('')}</div>`;
const css=['css/estilos.css','practicas/_comun/estilos.css','practicas/tabla-propiedades/estilos.css'].map(h=>`<link rel="stylesheet" href="${base}${h}">`).join('');
const nivel=process.argv[2]||'2';
const cols=nivel==='2'?4:3, rows=nivel==='2'?2:(nivel==='3'?3:(nivel==='4'?4:2));
const tablaN=(c0,f0)=>`<div class="tp-tabla" style="--tp-cols: ${cols}"><div class="tp-esquina"></div>${[c0,'Primo','Par','Impar'].slice(0,cols).map(t=>`<div class="tp-hueco tp-hueco--etiqueta"><button class="tp-pieza tp-pieza--etiqueta">${esc(t)}</button></div>`).join('')}${Array.from({length:rows},(_,i)=>`<div class="tp-hueco tp-hueco--etiqueta"><button class="tp-pieza tp-pieza--etiqueta">${esc(i?'Primo':f0)}</button></div>`+Array.from({length:cols},()=>`<div class="tp-hueco tp-hueco--numero"></div>`).join('')).join('')}</div>`;
const inner=labels.map(([i,id,t])=>`<section data-k="${i}|${t}">${tablaN(t,t)}</section>`).join('');
const doc=`<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">${css}<style>.tp-pieza{overflow-wrap:normal !important}body{margin:0}</style></head><body><main class="app"><div class="tarjeta ejercicio">${inner}</div></main></body></html>`;
const [from,to,step]=(process.argv[3]||"300,800,4").split(",").map(Number);
let ifr='';
for(let w=from;w<=to;w+=step) ifr+=`<iframe id="f${w}" data-w="${w}" style="width:${w}px;height:600px;border:0" srcdoc="${doc.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"></iframe>`;
const js=`window.addEventListener('load',()=>setTimeout(()=>{const out=[];document.querySelectorAll('iframe').forEach(f=>{const d=f.contentDocument;const w=+f.dataset.w;const fs=new Set();d.querySelectorAll('section').forEach(s=>{const k=s.dataset.k;s.querySelectorAll('.tp-pieza--etiqueta').forEach((b,idx)=>{const hc=b.closest('.tp-hueco');const cs=getComputedStyle(b);const content=b.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);const sp=d.createElement('span');sp.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+cs.font+';letter-spacing:'+cs.letterSpacing;d.body.appendChild(sp);let mw=0;b.textContent.split(/\\s+/).forEach(x=>{sp.textContent=x;mw=Math.max(mw,sp.getBoundingClientRect().width)});sp.remove();const over=mw-content+0.5;const bs=parseFloat(getComputedStyle(b).fontSize);
 if(idx===0||idx===${cols}){ if(over>0.5) fs.add(k+(idx===0?'|col':'|fila')+'|+'+Math.max(over,b.scrollWidth-b.clientWidth).toFixed(1)); }
 if(bs<8.99) fs.add('LETRA '+bs);});
 });
 if(d.documentElement.scrollWidth>w) fs.add('SCROLL '+d.documentElement.scrollWidth);
 const mins=[...d.querySelectorAll('.tp-pieza--etiqueta')].map(b=>parseFloat(getComputedStyle(b).fontSize));out.push(w+': '+(fs.size?[...fs].join('; '):'ok')+' (letra '+Math.min(...mins).toFixed(1)+')');});
 const pre=document.createElement('pre');pre.id='res';pre.textContent=out.join('\\n');document.body.appendChild(pre);},1500));`;
console.log(`<!DOCTYPE html><meta charset=utf-8><body>${ifr}<script>${js}</script>`);
