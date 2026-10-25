import { abrir } from './cdp.mjs';
import fs from 'node:fs';
const SAL = '/Users/salasgar/Documents/git/Ejercicios-interactivos/reparto-practicas-u2/salidas/89-errores3/capturas';
fs.mkdirSync(SAL, { recursive: true });
const c = await abrir(9344);
const original = await (await fetch('http://localhost:8080/practicas/errores3/practica.js')).text();
const parcheado = original.replace(/generar: (generar\w+)/g, (m, f) => `generar: r => { const i = ${f}(r); window.__it = i; return i; }`);
await c.cmd('Fetch.enable', { patterns: [{ urlPattern: '*errores3/practica.js*' }] });
c.eventos.push(p => {
  if (p.request.url.includes('errores3/practica.js')) c.cmd('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/javascript' }], body: Buffer.from(parcheado).toString('base64') });
  else c.cmd('Fetch.continueRequest', { requestId: p.requestId });
});
const informe = [];
const log = (...a) => { console.log(...a); informe.push(a.join(' ')); };
const click = sel => c.ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return false;e.click();return true})()`);
const texto = () => c.ev('document.querySelector("#app").innerText');
const desborda = () => c.ev('document.documentElement.scrollWidth > document.documentElement.clientWidth');
async function recortar(ruta) {
  const r = await c.ev('(()=>{const e=document.querySelector("#app");const b=e.getBoundingClientRect();return {x:0,y:Math.max(0,b.top+scrollY),width:innerWidth,height:Math.min(b.height,1800)}})()');
  await c.foto(ruta, r);
}
// Respuesta buena y mala de cada ejercicio, según el ítem guardado en window.__it
async function responder(ej, bien) {
  const it = await c.ev('window.__it');
  const n = it.opciones.length;
  let buena = ej === 0 ? it.solucion : ej === 1 ? it.opciones.indexOf(it.solucion) : (it.solucion === 'bien' ? 0 : 1);
  let mala = (buena + 1) % (ej === 2 ? 2 : n);
  await c.ev(`document.querySelectorAll(".eleccion")[${bien ? buena : mala}].click()`);
}
for (const idioma of ['es', 'en']) for (const w of [375, 1000]) {
  await c.ancho(w);
  for (const ej of [0, 1, 2]) for (const bien of [true, false]) {
    await c.ir(`http://localhost:8080/practicas/errores3/?idioma=${idioma}`);
    await click('#probar'); await c.dormir(500);
    await c.ev(`document.querySelectorAll("button")[${ej + 1 - 1}]`);
    await c.ev(`[...document.querySelectorAll("button")].filter(b=>/Empezar|Start/.test(b.textContent))[${ej}].click()`);
    await c.dormir(600);
    const intro = await texto();
    // cerrar la introducción si hay botón de continuar
    await c.ev(`(()=>{const b=[...document.querySelectorAll("button")].find(b=>/Entendido|Empezar|Vale|Got it|Start|Continuar|Continue/i.test(b.textContent)&&!b.disabled);if(b)b.click()})()`);
    await c.dormir(600);
    if (!(await c.ev('!!window.__it'))) { log(`[${idioma} ${w}] ej${ej + 1}: SIN ÍTEM. Texto: ${(await texto()).slice(0, 200)}`); continue; }
    const antes = await texto();
    
    await responder(ej, bien);
    await c.dormir(900);
    const des = await desborda();
    const fb = await c.ev('document.querySelector(".feedback")?.innerText ?? ""');
    const clase = await c.ev('document.querySelector(".feedback")?.className ?? ""');
    const hide = await c.ev('(()=>{const b=document.querySelector(".comprobar");return b?b.hidden||getComputedStyle(b).display==="none":"sin botón"})()');
    log(`[${idioma} ${w}] ej${ej + 1} ${bien ? 'ACIERTO' : 'FALLO'}: desborda=${des} comprobarOculto=${hide} feedback="${fb.replace(/\n/g, ' ').slice(0, 260)}" (${clase})`);
    if (w === 375 && idioma === 'es') await recortar(`${SAL}/ej${ej + 1}-${bien ? 'acierto' : 'fallo'}.png`);
    if (w === 1000 && idioma === 'en' && ej === 0) await recortar(`${SAL}/ej1-ancho-en.png`);
  }
}
log('consola:', JSON.stringify(c.consola));
fs.writeFileSync(SAL + '/prueba.log', informe.join('\n'));
c.cerrar();
