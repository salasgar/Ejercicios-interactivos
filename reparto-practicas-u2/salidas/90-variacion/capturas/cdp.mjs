// Utilidad CDP mínima: node cdp.mjs  (importa { abrir })
import { spawn } from 'node:child_process';
import fs from 'node:fs';
export async function abrir(puerto = 9333) {
  const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${puerto}`, '--user-data-dir=/tmp/chrome-t90-' + puerto, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let info;
  for (let i = 0; i < 50; i++) { try { info = await (await fetch(`http://127.0.0.1:${puerto}/json`)).json(); if (info.find(t => t.type === 'page')) break; } catch {} await new Promise(r => setTimeout(r, 200)); }
  const ws = new WebSocket(info.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pend = new Map(); const consola = []; const eventos = [];
  ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method === 'Fetch.requestPaused') eventos.forEach(f => f(d.params)); else if (d.method === 'Runtime.exceptionThrown') consola.push('EXC ' + JSON.stringify(d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text)); else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') consola.push('ERR ' + d.params.args.map(a => a.value ?? a.description).join(' ')); });
  const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await cmd('Runtime.enable'); await cmd('Page.enable');
  const ev = async expr => { const r = await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails.exception?.description)); return r.result.result.value; };
  const dormir = ms => new Promise(r => setTimeout(r, ms));
  const ancho = (w, h = 800) => cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: w < 500 });
  const ir = async url => { await cmd('Page.navigate', { url }); await dormir(1500); };
  const foto = async (ruta, clip) => { const r = await cmd('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); fs.writeFileSync(ruta, Buffer.from(r.result.data, 'base64')); };
  const cerrar = () => { try { ws.close(); } catch {} proc.kill(); };
  return { eventos, ev, ir, ancho, foto, dormir, consola, cerrar, cmd };
}
