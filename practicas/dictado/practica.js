// Dictado de números (repaso de la unidad 1): la interfaz.
// Tres ejercicios: dictado en inglés, -teen o -ty y ortografía inglesa, y ortografía
// española con fichas (más dictado en español). Contrato de la base en `../_comun/base.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  agrupar, generarDictado, esRespuestaDictado, gruposConValor, generarTeen, generarEscritura,
  generarFichas, esSecuenciaCorrecta, generarDictadoEs,
} from './logica.js';

// ─── Síntesis de voz (patrón de ../leelo/practica.js) ───────────────────────
// `getVoices()` devuelve [] la primera vez en Chrome: se espera a `voiceschanged` (hasta 1 s).

let promesaVoz = null;
const hayVozAhora = () => 'speechSynthesis' in window && speechSynthesis.getVoices().length > 0;

function detectarVoz() {
  if (!('speechSynthesis' in window)) return Promise.resolve(false);
  if (promesaVoz) return promesaVoz;
  promesaVoz = hayVozAhora() ? Promise.resolve(true) : new Promise(resolve => {
    const limite = setTimeout(() => resolve(hayVozAhora()), 1000);
    speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(limite); resolve(hayVozAhora()); }, { once: true });
  });
  return promesaVoz;
}

/** Lee `texto` en `lengua` ('en-GB' o 'es-ES'): voz exacta, si no cualquiera del idioma. */
function hablar(texto, lengua) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  const voces = speechSynthesis.getVoices();
  u.voice = voces.find(v => v.lang === lengua) ?? voces.find(v => v.lang?.startsWith(lengua.slice(0, 2))) ?? null;
  u.lang = lengua;
  speechSynthesis.speak(u);
}

/**
 * Pone en `caja` el botón de escuchar (si hay voz) o el texto escrito (modo lectura).
 * `alTexto(texto)` avisa de que se ha caído al modo lectura.
 */
function pintarVoz(caja, item, lengua, api, etiquetaBoton) {
  detectarVoz().then(hay => {
    if (!caja.isConnected) return;
    if (hay) {
      caja.innerHTML = `<button type="button" class="ancho" id="escuchar">${api.tt(etiquetaBoton)}</button>`;
      caja.querySelector('#escuchar').addEventListener('click', () => hablar(item.texto, lengua));
    } else {
      caja.innerHTML = `<p class="aviso">${api.tt(TX.voz.sin_voz)}</p><p class="operacion operacion--texto">${api.esc(item.texto)}</p>`;
    }
  });
  return hayVozAhora();
}

// ─── Teclado de cifras (no abre el del móvil: son botones) ───────────────────

const MAX_CIFRAS = 7;

/** Pone pantalla + teclado + «Comprobar»; `alComprobar(escrito, pantalla)` recibe lo tecleado. */
function teclado(contenedor, api, alComprobar) {
  const caja = document.createElement('div');
  caja.innerHTML = `
    <div class="operacion operacion--teclado" id="pantalla"></div>
    <div class="botones-numeros teclado" id="teclado">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<button type="button" data-d="${d}">${d}</button>`).join('')}
      <button type="button" data-d="borrar" class="teclado__borrar" aria-label="${api.tt(TX.dictado.borrar)}">⌫</button>
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  contenedor.append(caja);
  let escrito = '';
  const pantalla = caja.querySelector('#pantalla');
  const comprobar = caja.querySelector('#comprobar');
  const pintar = () => {
    pantalla.textContent = escrito ? agrupar(Number(escrito)) : '…';
    pantalla.classList.toggle('operacion--vacia', !escrito);
    comprobar.disabled = !escrito;
  };
  pintar();
  caja.querySelector('#teclado').addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b || api.respondido()) return;
    if (b.dataset.d === 'borrar') escrito = escrito.slice(0, -1);
    else if (escrito.length < MAX_CIFRAS && !(escrito === '' && b.dataset.d === '0')) escrito += b.dataset.d;
    pintar();
  });
  comprobar.addEventListener('click', () => {
    if (api.respondido() || !escrito) return;
    caja.querySelectorAll('#teclado button').forEach(b => { b.disabled = true; });
    comprobar.hidden = true;
    alComprobar(escrito, pantalla);
  });
}

/** Explicación de un dictado: el número en palabras y por grupos (inglés) o solo el número (español). */
function explicarDictado(item, api) {
  let html = `<span class="cuenta">${item.texto} = ${agrupar(item.n)}</span>`;
  if (item.tipo === 'dictado') {
    const grupos = gruposConValor(item.n).map(g => `${g.texto} = ${agrupar(g.valor)}`);
    if (grupos.length > 1) html += `<br>${api.tt(TX.dictado.grupos)}: ${grupos.join(' · ')}`;
  }
  return html;
}

function montarDictado(contenedor, item, api) {
  const { tt } = api;
  const lengua = item.tipo === 'dictado' ? 'en-GB' : 'es-ES';
  const textos = item.tipo === 'dictado'
    ? { instruccion: TX.dictado.instruccion, boton: TX.voz.escuchar_en }
    : { instruccion: TX.fichas.dictado_instruccion, boton: TX.voz.escuchar_es };
  contenedor.innerHTML = `<p class="instruccion">${tt(textos.instruccion)}</p><div id="voz"></div>`;
  pintarVoz(contenedor.querySelector('#voz'), item, lengua, api, textos.boton);
  teclado(contenedor, api, (escrito, pantalla) => {
    const acierto = esRespuestaDictado(item, escrito);
    pantalla.classList.add(acierto ? 'operacion--bien' : 'operacion--mal');
    const buena = explicarDictado(item, api);
    api.responder({
      acierto,
      html: acierto ? buena : `${tt(TX.dictado.tu_respuesta)(agrupar(Number(escrito)))} ${buena}`,
      espera: 3000,
    });
  });
}

// ─── Ejercicio 2: -teen o -ty, y cómo se escribe ─────────────────────────────

function montarTeen(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.teen.instruccion)}</p><div id="voz"></div><div id="caja-elecciones"></div>`;
  pintarVoz(contenedor.querySelector('#voz'), item, 'en-GB', api, TX.voz.escuchar_en);
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase: 'si-no',
    opciones: item.opciones.map((o, i) => ({ valor: i, html: agrupar(o) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const otro = item.opciones[1 - item.solucion];
      api.responder({
        acierto: Number(valor) === item.solucion,
        html: tt(TX.teen.diferencia)(agrupar(item.n), agrupar(otro), api.esc(item.texto)),
        espera: 3200,
      });
    },
  });
}

function montarEscritura(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.teen.escritura)(agrupar(item.n))}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4 elecciones--palabras',
    opciones: item.opciones.map((o, i) => ({ valor: i, html: api.esc(o) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const nota = { compuesto: TX.teen.nota_compuesto, decena: TX.teen.nota_decena, plural: TX.teen.nota_plural }[item.clase];
      api.responder({
        acierto: Number(valor) === item.solucion,
        html: `${tt(TX.teen.escritura_ok)(agrupar(item.n), api.esc(item.opciones[item.solucion]))} ${tt(nota)}`,
        espera: 3200,
      });
    },
  });
}

function montarTeenOEscritura(contenedor, item, api) {
  (item.tipo === 'teen' ? montarTeen : montarEscritura)(contenedor, item, api);
}

// ─── Ejercicio 3: fichas de palabras en español ──────────────────────────────

function montarFichas(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.fichas.instruccion)(agrupar(item.n))}</p>
    <div class="linea-fichas" id="linea" aria-live="polite"></div>
    <div class="banco-fichas" id="banco"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const linea = contenedor.querySelector('#linea'), banco = contenedor.querySelector('#banco');
  const comprobar = contenedor.querySelector('#comprobar');
  const puestas = [];                         // índices de item.fichas, en el orden en que se tocaron
  let bloqueado = false;
  const pintar = () => {
    linea.innerHTML = puestas.length
      ? puestas.map(i => `<button type="button" class="ficha-palabra ficha-palabra--puesta" data-i="${i}">${api.esc(item.fichas[i])}</button>`).join('')
      : `<span class="linea-fichas__vacia">${tt(TX.fichas.linea_vacia)}</span>`;
    banco.innerHTML = item.fichas.map((f, i) =>
      `<button type="button" class="ficha-palabra" data-i="${i}"${puestas.includes(i) ? ' hidden' : ''}>${api.esc(f)}</button>`).join('');
    comprobar.disabled = !puestas.length;
  };
  pintar();
  contenedor.addEventListener('click', ev => {
    const b = ev.target.closest('.ficha-palabra');
    if (!b || bloqueado || api.respondido()) return;
    const i = Number(b.dataset.i);
    if (puestas.includes(i)) puestas.splice(puestas.indexOf(i), 1); else puestas.push(i);
    pintar();
  });
  comprobar.addEventListener('click', () => {
    if (api.respondido() || !puestas.length) return;
    bloqueado = true;
    comprobar.hidden = true;
    const mias = puestas.map(i => item.fichas[i]);
    const acierto = esSecuenciaCorrecta(item, mias);
    linea.classList.add(acierto ? 'linea-fichas--bien' : 'linea-fichas--mal');
    banco.querySelectorAll('button').forEach(b => { b.disabled = true; });
    const buena = `${tt(TX.fichas.correcta)}: <span class="cuenta">${agrupar(item.n)} = ${api.esc(item.texto)}</span>`;
    const notas = item.sobran.map(s => tt(TX.fichas.notas[s])).join(' ');
    api.responder({
      acierto,
      html: acierto ? `${buena}` : `${tt(TX.fichas.tu_respuesta)}: <span class="cuenta">${api.esc(mias.join(' '))}</span>. ${buena}<br>${notas}`,
      espera: 3200,
    });
  });
}

function montarFichasODictadoEs(contenedor, item, api) {
  (item.tipo === 'fichas' ? montarFichas : montarDictado)(contenedor, item, api);
}

// ─── La práctica ─────────────────────────────────────────────────────────────

arrancar({
  slug: 'dictado',
  ejercicios: [
    {
      nombre: TX.dictado.nombre,
      detalle: TX.dictado.detalle,
      introduccion: TX.dictado.introduccion,
      generar: generarDictado,
      montar: montarDictado,
    },
    {
      nombre: TX.teen.nombre,
      detalle: TX.teen.detalle,
      introduccion: TX.teen.introduccion,
      generar: rng => (rng.azar() < 0.5 ? generarTeen(rng) : generarEscritura(rng)),
      montar: montarTeenOEscritura,
    },
    {
      nombre: TX.fichas.nombre,
      detalle: TX.fichas.detalle,
      introduccion: TX.fichas.introduccion,
      generar: rng => (rng.azar() < 0.6 ? generarFichas(rng) : generarDictadoEs(rng)),
      montar: montarFichasODictadoEs,
    },
  ],
});
