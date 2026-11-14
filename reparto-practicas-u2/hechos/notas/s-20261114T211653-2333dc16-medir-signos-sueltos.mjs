// Tarea 197: signos sueltos detrás (o delante) de una .cuenta / .cuenta-frac en el feedback, la tarjeta del «No lo sé» y la traducción.
// Uso: node medir197.mjs <puerto CDP> <puerto web> <carpeta salida> <etiqueta> <anchos, p. ej. 375,1200> [veces=6]
import { writeFileSync, mkdirSync } from 'node:fs';
const [puertoCdp, puertoWeb, salida, etiqueta, anchosTxt, vecesTxt] = process.argv.slice(2);
const anchos = anchosTxt.split(',').map(Number);
const VECES = Number(vecesTxt ?? 6);
mkdirSync(`${salida}/capturas`, { recursive: true });

const PEORES = [['reloj', 2], ['leelo', 2], ['distributiva', 1], ['baldosas', 3]];
const FRAC = [1, 2, 3, 4, 5].map(k => ['multiplica-divide', k]).concat([1, 2, 3, 4].map(k => ['fraccion-decimal', k]));
const MUESTRA = [
  ['jerarquia', 2], ['exponente', 1], ['division', 2], ['expresion', 1],
  ['semaforo', 1], ['criba', 3], ['errores', 1], ['factorizaciones', 2],
  ['saltos', 2], ['signos-producto', 3], ['jerarquia-enteros', 2], ['variacion', 1],
  ['suma-resta', 2], ['combinadas-fracciones', 1], ['equivalentes', 2],
  ['suma-resta-decimales', 2], ['multiplica-divide-decimales', 3], ['leelo5', 1],
  ['transposicion', 1], ['valor-numerico', 1],
];
const LISTA = process.env.SOLO ? process.env.SOLO.split(',').map(x => { const [a, b] = x.split(':'); return [a, Number(b)]; }) : [...PEORES, ...FRAC, ...MUESTRA];

const lista = await (await fetch(`http://127.0.0.1:${puertoCdp}/json/list`)).json();
const ws = new WebSocket(lista.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const pend = new Map(); let errores = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') errores.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errores.push(m.params.args.map(a => a.value ?? a.description).join(' '));
});
const cdp = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description); return r.result?.result?.value; };
const espera = ms => new Promise(r => setTimeout(r, ms));
await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable'); await cdp('Network.setCacheDisabled', { cacheDisabled: true });

// Se mete en la página: cuenta los signos sueltos dentro de `raiz`.
const MEDIR = `(() => {
  const CIERRE = '.,;:)»”!?', APERTURA = '(«“¿¡';
  const raiz = document.querySelector('#feedback');
  if (!raiz) return null;
  const cuentaDe = n => n.parentElement?.closest('.cuenta, .cuenta-frac') ?? null;
  const bloqueDe = n => n.parentElement?.closest('p, div:not(.cuenta):not(.cuenta-frac), li, td, th, h2, h3') ?? null;
  const tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  const cs = []; let n;
  while ((n = tw.nextNode())) {
    if (!n.parentElement || n.parentElement.getClientRects().length === 0) continue;
    for (let i = 0; i < n.data.length; i++) if (!/[\\s\\u2060]/.test(n.data[i])) cs.push({ n, i, ch: n.data[i] });
  }
  const rng = document.createRange();
  const rect = c => { rng.setStart(c.n, c.i); rng.setEnd(c.n, c.i + 1); return rng.getClientRects()[0] ?? rng.getBoundingClientRect(); };
  const sueltos = [];
  const linea = (a, b) => { const ra = rect(a), rb = rect(b); return rb.top >= ra.bottom - 2; }; // b empieza por debajo de a
  const contexto = k => cs.slice(Math.max(0, k - 12), k + 4).map(c => c.ch).join('');
  for (let k = 0; k < cs.length; k++) {
    const c = cs[k];
    if (CIERRE.includes(c.ch) && k > 0 && !(c.i > 0 && /\\s/.test(c.n.data[c.i - 1]))) {
      const p = cs[k - 1];
      if (bloqueDe(p.n) === bloqueDe(c.n) && linea(p, c)) sueltos.push({ tipo: 'cierre', ch: c.ch, cuenta: !!(cuentaDe(c.n) || cuentaDe(p.n)), ctx: contexto(k) });
    }
    if (APERTURA.includes(c.ch) && k < cs.length - 1) {
      const s = cs[k + 1];
      if (bloqueDe(s.n) === bloqueDe(c.n) && linea(c, s)) sueltos.push({ tipo: 'apertura', ch: c.ch, cuenta: !!(cuentaDe(c.n) || cuentaDe(s.n)), ctx: contexto(k) });
    }
  }
  const cuentas = raiz.querySelectorAll('.cuenta, .cuenta-frac').length;
  return { sueltos, cuentas, desborda: document.documentElement.scrollWidth > innerWidth };
})()`;

const clicId = sel => ev(`(() => { const b = document.querySelector(${JSON.stringify(sel)}); if (b && !b.disabled) { b.click(); return true; } return false; })()`);
const clicTexto = re => ev(`(() => { const b = [...document.querySelectorAll('button')].filter(b => !b.disabled && b.offsetParent).find(b => ${re}.test(b.textContent.trim())); if (b) b.click(); return !!b; })()`);
async function captura(nombre) {
  const caja = await ev(`(() => { const r = document.querySelector('#feedback')?.getBoundingClientRect(); return r ? { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: Math.max(r.height, 20) } : null; })()`);
  if (!caja) return;
  const r = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...caja, scale: 1 } });
  writeFileSync(`${salida}/capturas/${nombre}.png`, Buffer.from(r.result.data, 'base64'));
}

const resultado = [];
for (const ancho of anchos) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: 900, deviceScaleFactor: 1, mobile: ancho < 500 });
  for (const [slug, k] of LISTA) {
    errores = [];
    const fila = { ancho, slug, k, tarjetas: 0, cuentas: 0, sueltos: [], desborda: false, nota: '' };
    let cargada = false;
    for (let intento = 0; intento < 3 && !cargada; intento++) {
      await cdp('Page.navigate', { url: `http://127.0.0.1:${puertoWeb}/practicas/${slug}/?probar=1&ejercicio=${k}` });
      await espera(1400);
      await clicTexto('/^(Empezar|Start|Empezar el ejercicio)$/'); await espera(500);
      cargada = await ev(`!!document.querySelector('#item')`);
    }
    if (!cargada) { fila.nota = 'no carga'; resultado.push(fila); continue; }
    let capturada = false;
    for (let v = 0; v < VECES; v++) {
      if (!(process.env.FEEDBACK ? await ev(`(() => { const bs = [...document.querySelectorAll('#item .eleccion, #item .si-no button')].filter(b => !b.disabled); const b = bs[Math.floor(Math.random() * bs.length)]; if (b) b.click(); return !!b; })()`) : await clicId('#no-lo-se'))) { fila.nota = fila.tarjetas ? fila.nota : 'sin botón «No lo sé»'; break; }
      await espera(450);
      await clicId('#traducir'); await espera(300);
      const m = await ev(MEDIR);
      if (m) {
        fila.tarjetas++; fila.cuentas += m.cuentas; fila.sueltos.push(...m.sueltos); fila.desborda ||= m.desborda;
        const peor = PEORES.some(([s, e]) => s === slug && e === k);
        if (peor && ancho === 375 && !capturada && (m.sueltos.some(s => s.cuenta) || v === VECES - 1)) { await captura(`${etiqueta}-${slug}-ej${k}-375`); capturada = true; }
      }
      if (!(await clicId('#siguiente'))) { await espera(800); await clicId('#siguiente'); }
      await espera(450);
    }
    fila.errores = errores.slice(0, 3);
    resultado.push(fila);
    const deCuenta = fila.sueltos.filter(s => s.cuenta).length;
    console.log(`${ancho} ${slug} ej${k}: ${fila.tarjetas} tarjetas, ${fila.cuentas} cuentas, sueltos ${fila.sueltos.length} (junto a cuenta ${deCuenta})${fila.desborda ? ' DESBORDA' : ''}${fila.nota ? ' — ' + fila.nota : ''}${fila.errores.length ? ' ERRORES: ' + fila.errores.join(' | ').slice(0, 200) : ''}`);
  }
}
writeFileSync(`${salida}/${etiqueta}.json`, JSON.stringify(resultado, null, 1));
for (const ancho of anchos) {
  const f = resultado.filter(r => r.ancho === ancho);
  const tot = f.reduce((a, r) => a + r.sueltos.length, 0), cu = f.reduce((a, r) => a + r.sueltos.filter(s => s.cuenta).length, 0);
  console.log(`TOTAL ${ancho} px: ${f.length} ejercicios, ${f.reduce((a, r) => a + r.tarjetas, 0)} tarjetas, ${tot} sueltos (${cu} junto a cuenta) en ${f.filter(r => r.sueltos.some(s => s.cuenta)).length} ejercicios; desbordan ${f.filter(r => r.desborda).length}`);
}
ws.close();
