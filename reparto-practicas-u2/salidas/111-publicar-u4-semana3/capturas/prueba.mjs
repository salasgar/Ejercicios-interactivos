// Prueba con clics de las tres prácticas de la semana 3 de la U4 (tarea 111).
// node prueba.mjs [slug...]   (servidor propio en el 8111)
import { abrir } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/reparto-practicas-u2/salidas/89-errores3/capturas/cdp.mjs';
import fs from 'node:fs';
const BASE = 'http://localhost:8111';
const SAL = new URL('.', import.meta.url).pathname + 'resultados';
fs.mkdirSync(SAL, { recursive: true });
const SLUGS = process.argv.slice(2).length ? process.argv.slice(2) : ['multiplica-divide', 'combinadas-fracciones', 'errores4'];
const N_EJ = { 'multiplica-divide': 5, 'combinadas-fracciones': 3, 'errores4': 3 };

const c = await abrir(9411);
const parches = {};
for (const s of SLUGS) {
  const original = await (await fetch(`${BASE}/practicas/${s}/practica.js`)).text();
  parches[s] = original.replace(/generar: (generar\w+)/g, (m, f) => `generar: r => { const i = ${f}(r); window.__it = i; return i; }`);
}
await c.cmd('Fetch.enable', { patterns: [{ urlPattern: '*/practica.js*' }] });
c.eventos.push(p => {
  const s = SLUGS.find(x => p.request.url.includes(`/${x}/practica.js`));
  if (s) c.cmd('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/javascript' }], body: Buffer.from(parches[s]).toString('base64') });
  else c.cmd('Fetch.continueRequest', { requestId: p.requestId });
});
const informe = [];
const log = (...a) => { console.log(...a); informe.push(a.join(' ')); };
const texto = () => c.ev('document.querySelector("#app").innerText');
const desborda = () => c.ev('document.documentElement.scrollWidth > document.documentElement.clientWidth');
async function recortar(ruta) {
  const r = await c.ev('(()=>{const e=document.querySelector("#app");const b=e.getBoundingClientRect();return {x:0,y:Math.max(0,b.top+scrollY),width:innerWidth,height:Math.min(b.height,2000)}})()');
  await c.foto(ruta, r);
}

// Escribe una fracción en el campo de dos cuadros (o en el de un número).
const escribir = (num, den) => c.ev(`(()=>{
  const set=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));};
  const arr=document.querySelector('.campo-fraccion__arriba, .campo-fraccion input');
  const ins=[...document.querySelectorAll('#app input')].filter(i=>!i.disabled);
  if(ins.length>=2){ set(ins[0], String(${num})); set(ins[1], ${den}===1?'':String(${den})); }
  else if(ins.length===1){ set(ins[0], String(${num})); }
  return ins.length;})()`);
const comprobar = () => c.ev(`(()=>{const b=[...document.querySelectorAll('#app button.comprobar, #app #comprobar')].find(b=>!b.hidden&&!b.disabled);if(b){b.click();return true}return false})()`);

// Cada función responde el ítem actual (window.__it) bien o mal.
const RESPONDER = {
  'multiplica-divide': async (ej, bien) => {
    const it = await c.ev('window.__it');
    const [n, d] = it.valor;
    if (ej === 2) { // inversa: dos pasos
      if (!bien) { await escribir(-n, d); await comprobar(); return; }
      await escribir(n, d); await comprobar(); await c.dormir(400);
      await escribir(1, 1); await comprobar(); return;
    }
    await escribir(bien ? n : n + 1, d); await comprobar();
  },
  'combinadas-fracciones': async (ej, bien) => {
    if (ej === 0) {
      return c.ev(`(async()=>{const L=await import('/practicas/combinadas-fracciones/logica.js');const a=L.arbolDe(window.__it.texto);const v=new Set(L.rutasPrimeras(a));
        const ops=[...document.querySelectorAll('.cf-linea .frac-op')];const el=ops.find(o=>${bien}?v.has(o.dataset.ruta):!v.has(o.dataset.ruta));if(!el)return 'sin toque malo';el.click();return el.dataset.ruta})()`);
    }
    if (ej === 1) {
      return c.ev(`(async()=>{const L=await import('/practicas/combinadas-fracciones/logica.js');const F=await import('/practicas/_comun/fracciones.js');
        const dormir=ms=>new Promise(r=>setTimeout(r,ms));let a=L.arbolDe(window.__it.texto);let primero=true;const hechos=[];
        for(let k=0;k<8&&F.valorLiteral(a)===null;k++){
          const v=new Set(L.rutasPrimeras(a));const ops=[...document.querySelectorAll('.cf-linea .frac-op')];
          let el=ops.find(o=>v.has(o.dataset.ruta));
          if(!${bien}&&primero){const malo=ops.find(o=>!v.has(o.dataset.ruta));if(malo){malo.click();const r=L.clasificarToque(a,malo.dataset.ruta);a=F.aplicarPaso(a,r.canonico);hechos.push('toque malo '+malo.dataset.ruta);primero=false;await dormir(2200);continue;}}
          primero=false;const r=L.clasificarToque(a,el.dataset.ruta);el.click();await dormir(300);
          const buena=F.htmlFraccion(r.paso.valor);const bs=[...document.querySelectorAll('.cf-pregunta .eleccion')];
          const b=bs.find(x=>x.innerHTML===buena);if(!b)return 'sin opción buena '+buena+' | '+bs.map(x=>x.innerHTML).join(' ; ');
          b.click();hechos.push(r.paso.operacion);a=F.aplicarPaso(a,r.paso);await dormir(400);}
        return hechos.join(' | ')})()`);
    }
    // ej 3: línea y tipo
    const it = await c.ev('window.__it');
    const linea = bien ? it.linea : (it.linea % (it.lineas.length - 1)) + 1;
    await c.ev(`document.querySelector('button.cf-fila[data-n="${linea}"]').click()`); await c.dormir(300);
    const tipo = bien ? it.tipo : it.tipo;
    await c.ev(`[...document.querySelectorAll('.cf-pregunta .eleccion')][${tipo === 'orden' ? 0 : 1}].click()`);
  },
  'errores4': async (ej, bien) => {
    const it = await c.ev('window.__it');
    const pulsar = i => c.ev(`(()=>{const bs=[...document.querySelectorAll('#app .elecciones')].pop().querySelectorAll('.eleccion');bs[${i}].click();return bs.length})()`);
    if (ej === 0) {
      const verdadera = it.solucion === 'verdadera';
      if (verdadera) { await pulsar(bien ? 0 : 1); return; }
      await pulsar(bien ? 1 : 0); if (!bien) return; await c.dormir(400);
      await pulsar(it.opciones.indexOf(it.error)); return;
    }
    if (ej === 1) { await pulsar(bien ? it.solucion : (it.solucion + 1) % it.lineas.length); return; }
    const { num, den } = it.bien;
    if (it.natural) { await escribir(bien ? num / den : num / den + 1, 1); } else { await escribir(bien ? num : num + 1, den); }
    await c.dormir(200); await comprobar();
  },
};

for (const slug of SLUGS) for (const idioma of ['es', 'en']) for (const w of [375, 1100]) {
  await c.ancho(w);
  for (let ej = 0; ej < N_EJ[slug]; ej++) for (const bien of [true, false]) {
    await c.ir(`${BASE}/practicas/${slug}/?idioma=${idioma}`);
    await c.ev('document.querySelector("#probar")?.click()'); await c.dormir(500);
    await c.ev(`document.querySelector('[data-ejercicio="${ej}"]')?.click()`); await c.dormir(500);
    await c.ev('document.querySelector("#empezar")?.click()'); await c.dormir(600);
    if (!(await c.ev('!!window.__it'))) { log(`[${slug} ${idioma} ${w}] ej${ej + 1}: SIN ÍTEM. ${(await texto()).slice(0, 200)}`); continue; }
    const enun = (await c.ev('document.querySelector("#app section")?.innerText ?? ""')).replace(/\s+/g, ' ').slice(0, 220);
    let extra = '';
    try { extra = await RESPONDER[slug](ej, bien) ?? ''; } catch (e) { extra = 'ERROR ' + e.message; }
    await c.dormir(1200);
    const des = await desborda();
    const fb = (await c.ev('document.querySelector("#feedback")?.innerText ?? ""')).replace(/\s+/g, ' ').slice(0, 400);
    const cls = await c.ev('document.querySelector("#feedback")?.className ?? ""');
    const anchoMax = await c.ev('Math.max(...[...document.querySelectorAll("#app *")].map(e=>e.getBoundingClientRect().right))');
    log(`[${slug} ${idioma} ${w}] ej${ej + 1} ${bien ? 'ACIERTO' : 'FALLO'} desborda=${des} derecha=${Math.round(anchoMax)} ${extra ? '{' + String(extra).slice(0, 160) + '} ' : ''}\n   ENUNCIADO: ${enun}\n   FEEDBACK(${cls}): ${fb}`);
    if (w === 375) await recortar(`${SAL}/${slug}-ej${ej + 1}-${idioma}-${bien ? 'acierto' : 'fallo'}.png`);
  }
}
log('consola:', JSON.stringify(c.consola));
fs.writeFileSync(`${SAL}/prueba-${SLUGS.join('+')}.log`, informe.join('\n'));
c.cerrar();
