// Tabla de propiedades (reto de la unidad 2, tarea 206): la interfaz. Los generadores,
// el corrector y las frases de «por qué no encaja» están en logica.js (puro, con su
// test) y los textos en textos.js.
//
// Un solo ejercicio con cuatro niveles dentro: el nivel sale de los puntos del alumno
// (0 → 6 → 20 → 35 → 54), así el progreso guardado basta para retomar. Comprobar no
// cuesta nada (`sinVidas`); al quedar la tabla entera bien, `api.sumar` da 1 punto por
// cada pieza colocada. Se coloca arrastrando (ratón, dedo, lápiz) o tocando una pieza y
// después un hueco.

import { arrancar } from '../_comun/base.js';
import { TX } from './textos.js';
import {
  OBJETIVO, generar, clave, corregir, estaCompleta, nombreEtiqueta, razon, infografiasDe,
} from './logica.js';

// --- Lo que el alumno ya sabe (infografías) ------------------------------------------

const CLAVE_SABE = familia => `practicas:tabla-propiedades:sabe:${familia}`;
function sabe(familia) {
  try { return localStorage.getItem(CLAVE_SABE(familia)) === '1'; } catch { return false; }
}
function recordarQueSabe(familia) {
  try { localStorage.setItem(CLAVE_SABE(familia), '1'); } catch { /* sin almacenamiento: volverá a salir, no es grave */ }
}

/** Puntos en triángulo: el triángulo de `k` filas, con `k` puntos en la última. */
function triangulo(k, x0, radio = 4, paso = 11) {
  const puntos = [];
  for (let fila = 1; fila <= k; fila++) {
    for (let i = 0; i < fila; i++) {
      const x = x0 + (k - fila) * paso / 2 + i * paso + radio;
      const y = 6 + (fila - 1) * paso;
      puntos.push(`<circle cx="${x.toFixed(1)}" cy="${y}" r="${radio}"/>`);
    }
  }
  return puntos.join('');
}

/** El dibujo de «triangular»: los triángulos de 1, 3, 6, 10 y 15 puntos, cada uno con su cuenta. */
function dibujoTriangular(conCuentas) {
  let x = 4;
  const partes = [];
  for (let k = 1; k <= 5; k++) {
    const total = k * (k + 1) / 2;
    partes.push(`<g fill="currentColor">${triangulo(k, x)}</g>`);
    const centro = x + ((k - 1) * 11 + 8) / 2;
    partes.push(`<text x="${centro.toFixed(1)}" y="${6 + 5 * 11 + 6}" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${conCuentas ? total : ''}</text>`);
    x += (k - 1) * 11 + 8 + 14;
  }
  return `<svg class="tp-dibujo" viewBox="0 0 ${x - 6} 80" role="img" aria-label="1, 3, 6, 10, 15">${partes.join('')}</svg>`;
}

/** Una infografía por familia: añadir otra es añadir una entrada aquí, otra en TX.infografias y otra en FAMILIAS_CON_INFOGRAFIA. */
const DIBUJOS = { triangular: dibujoTriangular };

// --- La tabla ----------------------------------------------------------------------

const enunciado = (item, { tt }) => `<p class="instruccion">${tt(item.fijas ? TX.pantalla.instruccion_fijas : TX.pantalla.instruccion)}</p>`;

function montar(contenedor, item, api) {
  const { tt } = api;
  const idioma = api.idioma;
  const x = TX.pantalla;
  let bloqueado = api.respondido();
  let elegida = null;                 // clave de la pieza tocada, a la espera de hueco
  let malas = new Set();              // claves de las casillas con algo que no encaja
  let feedback = '';                  // el último aviso (html)

  const claveEtiqueta = id => `e:${id}`;
  const claveNumero = n => `n:${n}`;
  const tipoPieza = k => (k.startsWith('e:') ? 'etiqueta' : 'numero');
  const tipoHueco = h => (h.startsWith('x') ? 'numero' : 'etiqueta');
  const hf = i => `f${i}`, hc = j => `c${j}`, hx = (i, j) => `x${i}-${j}`;

  // lugar[pieza] = clave de hueco o null (en la bandeja)
  const lugar = new Map();
  for (const id of item.etiquetas) lugar.set(claveEtiqueta(id), null);
  for (const n of item.numeros) lugar.set(claveNumero(n), null);
  if (item.fijas) {
    item.diseno.filas.forEach((id, i) => lugar.set(claveEtiqueta(id), hf(i)));
    item.diseno.cols.forEach((id, j) => lugar.set(claveEtiqueta(id), hc(j)));
  }
  const esFija = k => item.fijas && tipoPieza(k) === 'etiqueta';
  const ocupante = h => [...lugar].find(([, l]) => l === h)?.[0] ?? null;
  const textoPieza = k => (tipoPieza(k) === 'etiqueta' ? nombreEtiqueta(k.slice(2), idioma) : k.slice(2));

  const faltan = () => [...lugar].filter(([k, l]) => l === null && !esFija(k)).length;

  function colocacion() {
    const de = h => { const k = ocupante(h); return k === null ? null : (tipoPieza(k) === 'etiqueta' ? k.slice(2) : Number(k.slice(2))); };
    return {
      filas: Array.from({ length: item.nF }, (_, i) => de(hf(i))),
      cols: Array.from({ length: item.nC }, (_, j) => de(hc(j))),
      celdas: Array.from({ length: item.nF }, (_, i) => Array.from({ length: item.nC }, (_, j) => de(hx(i, j)))),
    };
  }

  // --- Pintado ---

  const pieza = k => {
    const clases = ['tp-pieza', `tp-pieza--${tipoPieza(k)}`];
    if (k === elegida) clases.push('tp-pieza--elegida');
    if (esFija(k)) clases.push('tp-pieza--fija');
    return `<button type="button" class="${clases.join(' ')}" data-pieza="${k}" ${bloqueado || esFija(k) ? 'disabled' : ''}>${api.esc(textoPieza(k))}</button>`;
  };
  const hueco = (h, clase = '') => {
    const k = ocupante(h);
    const mal = malas.has(h) ? ' tp-hueco--mal' : '';
    return `<div class="tp-hueco tp-hueco--${tipoHueco(h)}${clase}${mal}" data-destino="${h}">${k ? pieza(k) : ''}</div>`;
  };

  function pintar() {
    let filasHtml = `<div class="tp-esquina" aria-hidden="true"></div>${Array.from({ length: item.nC }, (_, j) => hueco(hc(j))).join('')}`;
    for (let i = 0; i < item.nF; i++) {
      filasHtml += hueco(hf(i));
      for (let j = 0; j < item.nC; j++) filasHtml += hueco(hx(i, j));
    }
    const libres = tipo => [...lugar].filter(([k, l]) => l === null && tipoPieza(k) === tipo).map(([k]) => k);
    const bandeja = (tipo, titulo) => {
      const piezas = libres(tipo);
      if (!piezas.length && tipo === 'etiqueta' && item.fijas) return '';
      return `<div class="tp-bandeja" data-destino="bandeja">
        <span class="tp-bandeja__titulo">${tt(titulo)}</span>
        <div class="tp-bandeja__piezas">${piezas.map(pieza).join('')}</div>
      </div>`;
    };
    const quedan = faltan();
    const aviso = bloqueado ? '' : quedan > 0 ? tt(x.faltan)(quedan) : tt(x.listo);
    contenedor.innerHTML = `
      ${enunciado(item, api)}
      <p class="tp-nivel">${tt(x.nivel)(item.nivel)} · ${item.nF} × ${item.nC}</p>
      <div class="tp-tabla" style="--tp-cols: ${item.nC}">${filasHtml}</div>
      ${bandeja('etiqueta', x.etiquetas)}
      ${bandeja('numero', x.numeros)}
      <p class="tp-aviso" aria-live="polite">${elegida && !bloqueado ? tt(x.elegida) : aviso}</p>
      <div class="tp-feedback" aria-live="polite">${feedback}</div>
      <button type="button" class="comprobar" ${bloqueado || quedan > 0 ? 'disabled' : ''}>${api.t.comprobar}</button>`;
    contenedor.querySelectorAll('.tp-pieza:not([disabled])').forEach(activar);
    contenedor.querySelectorAll('[data-destino]').forEach(el => el.addEventListener('click', ev => {
      if (bloqueado || elegida === null || ev.target.closest('.tp-pieza')) return;
      llevar(elegida, el.dataset.destino);
    }));
    contenedor.querySelector('.comprobar').addEventListener('click', comprobar);
  }

  // --- Mover piezas ---

  const cabe = (k, destino) => destino === 'bandeja' || tipoPieza(k) === tipoHueco(destino);

  function llevar(k, destino) {
    if (bloqueado || esFija(k)) return;
    if (!cabe(k, destino)) { elegida = null; feedback = ''; return pintar(); }
    const origen = lugar.get(k);
    if (destino === 'bandeja') lugar.set(k, null);
    else {
      const otra = ocupante(destino);
      if (otra && otra !== k) {
        if (esFija(otra)) { elegida = null; return pintar(); }
        lugar.set(otra, origen);   // la que estaba allí se va al sitio de la que llega (o a la bandeja)
      }
      lugar.set(k, destino);
    }
    elegida = null; malas = new Set(); feedback = '';
    pintar();
  }

  function tocar(k) {
    if (bloqueado) return;
    if (elegida === k) elegida = null;
    else if (elegida !== null && lugar.get(k) !== null && cabe(elegida, lugar.get(k))) return llevar(elegida, lugar.get(k));
    else elegida = k;
    pintar();
  }

  /** Arrastre con ratón, dedo o lápiz; sin moverse, es un toque. */
  function activar(el) {
    const k = el.dataset.pieza;
    el.addEventListener('pointerdown', ev => {
      if (bloqueado || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      ev.preventDefault();
      el.setPointerCapture?.(ev.pointerId);
      const x0 = ev.clientX, y0 = ev.clientY;
      let arrastrando = false;
      const mover = e => {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!arrastrando && Math.hypot(dx, dy) > 6) { arrastrando = true; el.classList.add('tp-pieza--arrastrando'); }
        if (arrastrando) el.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const soltar = e => {
        el.removeEventListener('pointermove', mover);
        el.removeEventListener('pointerup', soltar);
        el.removeEventListener('pointercancel', soltar);
        el.style.transform = '';
        el.classList.remove('tp-pieza--arrastrando');
        if (bloqueado || e.type === 'pointercancel') return;
        if (!arrastrando) return tocar(k);
        // La pieza arrastrada está justo debajo del dedo: se esconde para ver qué hay detrás.
        el.style.visibility = 'hidden';
        const destino = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-destino]');
        el.style.visibility = '';
        if (destino && contenedor.contains(destino)) llevar(k, destino.dataset.destino);
        else { elegida = null; pintar(); }
      };
      el.addEventListener('pointermove', mover);
      el.addEventListener('pointerup', soltar);
      el.addEventListener('pointercancel', soltar);
    });
    // Con teclado (o un lector de pantalla) no hay puntero: Intro o espacio la eligen.
    el.addEventListener('keydown', ev => {
      if (bloqueado || (ev.key !== 'Enter' && ev.key !== ' ')) return;
      ev.preventDefault();
      tocar(k);
    });
  }

  // --- Comprobar ---

  const MAX_FRASES = 6;

  function comprobar() {
    if (api.respondido() || bloqueado || faltan() > 0) return;
    const col = colocacion();
    if (!estaCompleta(col)) return;
    const { ok, malos } = corregir(item, col);
    const piezas = item.etiquetas.length + item.numeros.length - (item.fijas ? item.etiquetas.length : 0);
    if (ok) {
      bloqueado = true; elegida = null; malas = new Set(); feedback = '';
      pintar();
      contenedor.querySelector('.comprobar').hidden = true;   // tras el acierto ya no hay nada que comprobar
      api.sumar(item.puntos, {
        html: ({ tt }) => `<p>${tt(x.bien)(item.puntos, piezas)}</p><p>${tt(x.bien_extra)}</p><p><strong>${item.nivel < 4 ? tt(x.sube)(item.nivel + 1) : tt(x.final)}</strong></p>`,
      });
      return;
    }
    malas = new Set(malos.map(m => hx(m.f, m.c)));
    const frases = idi => malos.slice(0, MAX_FRASES).map(m => `<li>${api.esc(razon(m.etiqueta, m.n, idi))}</li>`).join('');
    const mas = idi => (malos.length > MAX_FRASES ? `<p>${tt(x.fallo_mas)(malos.length - MAX_FRASES)}</p>` : '');
    const html = ({ tt: ttI, idioma: idi }) => `<p>${ttI(x.fallo_titulo)(malos.length)}</p><ul class="tp-razones">${frases(idi)}</ul>${mas(idi)}<p>${ttI(x.fallo_pie)}</p>`;
    api.intentoFallido({
      html,
      error: 'tabla-no-encaja',
      respuesta: malos.slice(0, MAX_FRASES).map(m => `${m.n}→${nombreEtiqueta(m.etiqueta, 'es')}`).join('; '),
    });
    feedback = `<div class="tp-fallo">${html({ tt, idioma })}</div>`;
    pintar();
  }

  // --- Entrada: infografías pendientes y después la tabla ---

  const pendientes = bloqueado ? [] : infografiasDe(item).filter(f => !sabe(f));
  function infografia(i) {
    if (i >= pendientes.length) return pintar();
    const f = pendientes[i];
    const T = TX.infografias[f];
    const dibujo = DIBUJOS[f];
    contenedor.innerHTML = `
      <div class="tarjeta tp-info">
        <h2>${tt(T.titulo)}</h2>
        ${tt(T.corta)}
        ${dibujo(true)}
        ${tt(T.pie_corta)}
        <p class="tp-pregunta"><strong>${tt(T.pregunta)}</strong></p>
        <div class="tp-botones">
          <button type="button" id="tp-si">${tt(TX.infografias.si)}</button>
          <button type="button" id="tp-no" class="secundario">${tt(TX.infografias.no)}</button>
        </div>
      </div>`;
    contenedor.querySelector('#tp-si').addEventListener('click', () => { recordarQueSabe(f); infografia(i + 1); });
    contenedor.querySelector('#tp-no').addEventListener('click', () => {
      contenedor.innerHTML = `
        <div class="tarjeta tp-info">
          <h2>${tt(T.titulo)}</h2>
          ${dibujo(true)}
          ${tt(T.larga)}
          <button type="button" class="ancho" id="tp-entendido">${tt(TX.infografias.entendido)}</button>
        </div>`;
      contenedor.querySelector('#tp-entendido').addEventListener('click', () => infografia(i + 1));
    });
  }
  infografia(0);
}

// --- La práctica -------------------------------------------------------------------

arrancar({
  slug: 'tabla-propiedades',
  ejercicios: [
    {
      nombre: TX.ejercicio.nombre,
      detalle: TX.ejercicio.detalle,
      objetivo: OBJETIVO,
      penalizacion: 0,
      sinVidas: true,
      sinAyuda: TX.ejercicio.sinAyuda,
      introduccion: TX.ejercicio.introduccion,
      generar,
      clave,
      montar,
      enunciado,
    },
  ],
});
