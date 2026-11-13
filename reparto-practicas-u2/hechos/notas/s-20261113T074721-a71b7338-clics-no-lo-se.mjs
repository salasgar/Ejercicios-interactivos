// Tarea 192 (s-20261113T074721-a71b7338): clics del «No lo sé» con Chrome headless por CDP, sin dependencias.
// Uso: python3 -m http.server 8192 --bind 127.0.0.1 (desde la raíz del repo), y: node <este fichero> slug1 slug2 …
// Una línea por ejercicio y ancho (375 y 1200): botón, tarjetas, inert, aviso de la 3.ª ayuda, traducción, desborde, ítem repetido, consola.
// Copia de /tmp; cambia mkdtempSync('/tmp/rev192/perfil-') y la carpeta de capturas si lo usas en otro sitio.
// Clics del «No lo sé» con Chrome headless por CDP. Uso: node /tmp/rev192/clics.mjs slug1 slug2 …
// Perfil temporal y kill en finally (memoria chrome-headless-huerfano).
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
const RAIZ = '/Users/salasgar/Documents/git/Ejercicios-interactivos';
const { CATALOGO } = await import(RAIZ + '/practicas/_comun/catalogo.js');
const PUERTO = 9692;
const dir = mkdtempSync('/tmp/rev192/perfil-');
mkdirSync('/tmp/rev192/capturas', { recursive: true });
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--disable-gpu', 'about:blank',
], { stdio: 'ignore', detached: true });
const espera = ms => new Promise(r => setTimeout(r, ms));
let ws;
try {
  let ver;
  for (let i = 0; i < 50 && !ver; i++) { await espera(200); try { ver = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json(); } catch {} }
  const pagina = ver.find(t => t.type === 'page');
  ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pend = new Map(); const errores = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') errores.push('EXC ' + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 200));
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) errores.push(m.params.type + ' ' + m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200));
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errores.push('LOG ' + m.params.entry.text.slice(0, 200) + ' ' + (m.params.entry.url ?? ''));
  });
  const cdp = (method, params = {}) => new Promise(r => { const n = ++id; pend.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async expr => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
  await cdp('Runtime.enable'); await cdp('Log.enable'); await cdp('Page.enable');
  const slugs = process.argv.slice(2);
  for (const slug of slugs) {
    const ficha = CATALOGO.find(f => f.slug === slug);
    for (const ancho of [375, 1200]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: 800, deviceScaleFactor: 1, mobile: ancho < 500 });
      for (let k = 1; k <= ficha.nEjercicios; k++) {
        errores.length = 0;
        await cdp('Page.navigate', { url: `http://127.0.0.1:8192/practicas/${slug}/?probar=1&ejercicio=${k}` });
        let hay = null;
        for (let i = 0; i < 40; i++) { await espera(150); hay = await ev(`document.querySelector('#no-lo-se') ? 'boton' : document.querySelector('#empezar') ? 'intro' : document.querySelector('#item')?.innerHTML ? 'sin' : null`); if (hay) break; }
        await espera(300);
        if (hay !== 'boton') { await ev(`[...document.querySelectorAll('button')].find(b => /Empezar|Start/.test(b.innerText))?.click()`); for (let i = 0; i < 20; i++) { await espera(150); if (await ev(`!!document.querySelector('#no-lo-se')`)) break; } hay = await ev(`document.querySelector('#no-lo-se') ? 'boton' : 'sin'`); }
        hay = await ev(`document.querySelector('#no-lo-se') ? 'boton' : 'sin'`);
        if (process.env.DEPURA) console.log((await ev('document.body.innerText')).slice(0, 600));
        const linea = [`${slug} ej${k} @${ancho}:`, hay];
        if (hay === 'boton') {
          const vistos = [];
          for (let a = 1; a <= 4; a++) {
            const r = await ev(`(async () => {
              const item = document.querySelector('#item').innerText.trim().slice(0, 120);
              const nota = document.querySelector('.nota-ayuda')?.innerText ?? '';
              const lang = document.documentElement.lang;
              document.querySelector('#no-lo-se').click();
              await new Promise(r => setTimeout(r, 250));
              const tarjeta = document.querySelector('.feedback--ayuda');
              const pen = tarjeta?.querySelector('.penalizacion')?.innerText ?? '';
              const inerte = document.querySelector('#item').inert;
              let trad = 'no-boton';
              const b = document.querySelector('#traducir');
              if (b) { b.click(); await new Promise(r => setTimeout(r, 150)); trad = (document.querySelector('#caja-traduccion')?.innerText ?? '').trim().length; }
              const desborda = document.documentElement.scrollWidth > window.innerWidth + 1;
              const altoTarjeta = tarjeta ? Math.round(tarjeta.getBoundingClientRect().height) : 0;
              return { item, nota, pen, inerte, trad, desborda, altoTarjeta, tarjeta: !!tarjeta, txt: tarjeta?.innerText.slice(0, 400) ?? '' };
            })()`);
            vistos.push(r);
            if (a === 1 && ancho === 375) {
              const cap = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
              if (cap.result?.data) writeFileSync(`/tmp/rev192/capturas/${slug}-${k}.png`, Buffer.from(cap.result.data, 'base64'));
            }
            await ev(`document.querySelector('#siguiente')?.click()`);
            await espera(500);
            if (!(await ev(`!!document.querySelector('#no-lo-se')`))) { await espera(800); }
            if (!(await ev(`!!document.querySelector('#no-lo-se')`))) { linea.push(`(sin botón tras la ayuda ${a})`); break; }
          }
          const iguales = vistos.slice(1).filter((v, i) => v.item === vistos[i].item).length;
          linea.push(`ayudas=${vistos.length}`, `tarjetas=${vistos.filter(v => v.tarjeta).length}`, `inerte=${vistos.every(v => v.inerte)}`,
            `pen3="${vistos[2]?.pen ?? ''}"`, `trad=${vistos.map(v => v.trad).join('/')}`, `desborda=${vistos.some(v => v.desborda)}`,
            `alto=${vistos.map(v => v.altoTarjeta).join('/')}`, `itemIgualAlAnterior=${iguales}`);
        }
        if (errores.length) linea.push('CONSOLA: ' + [...new Set(errores)].join(' | '));
        console.log(linea.join(' '));
      }
    }
  }
} finally {
  try { ws?.close(); } catch {}
  try { process.kill(-chrome.pid, 'SIGKILL'); } catch { chrome.kill('SIGKILL'); }
  await espera(500); spawn('pkill', ['-f', `user-data-dir=${dir}`]);
}
