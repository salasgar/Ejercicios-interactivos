// Recta numérica horizontal y termómetro vertical para las prácticas de la unidad 3
// (PU2, tarea 79), en SVG. La parte pura (qué marcas hay, cuáles llevan número,
// dónde cae cada valor y qué marca está más cerca de un toque) va en funciones
// exportadas, probadas en `tests/practicas-enteros.test.js`; `crearRecta` es lo
// único que necesita el navegador. Los estilos van en una hoja propia que se añade
// sola una vez (clases `re-…`, con los colores de `css/estilos.css`): una práctica
// los cambia en su `estilos.css`.
//
//   const recta = crearRecta(contenedor, {
//     tipo: 'recta',              // o 'termometro' (vertical, con su columna de líquido)
//     min: -10, max: 10,          // múltiplos del paso
//     paso: 1,                    // separación entre marcas: 1, 2, 5…
//     numeros: 'algunas',         // qué marcas llevan número: 'todas', 'algunas'
//                                 // (el 0, los extremos y los múltiplos de `cada`),
//                                 // 'cero' o una lista de valores
//     cada: 5,                    // con 'algunas' (por defecto, 5 con paso 1 y 10 con paso 2 o 5)
//     puntos: [{ valor: -3, etiqueta: 'A', clase: 're-punto--bien' }],
//     nivel: 12,                  // solo termómetro: hasta dónde llega el líquido
//     unidad: '°C',               // solo termómetro: detrás de cada número
//     alTocar: valor => …,        // si se da, las marcas se pueden tocar (y con el teclado)
//     nombre: 'Recta numérica',   // para el lector de pantalla
//   });
//   recta.ponerPuntos([{ valor, etiqueta, clase }]);  // sustituye los puntos
//   recta.marcar(valor, clase); recta.desmarcar(valor);  // una marca tocada (re-toque--bien…)
//   await recta.saltar({ desde: -3, hasta: 4, etiqueta: '+7', clase, animar: true });
//   recta.borrarSaltos();
//   recta.ponerNivel(valor, { animar });     // termómetro
//   recta.bloquear();                        // tras responder: ya no se toca
//
// El menos de los números es U+2212 (`fmt` de `enteros.js`). Probado a 375 px con
// 21 marcas en la recta y 30 en el termómetro: la letra es la más grande (de 14 a 9)
// con la que los números no se montan, y si así cabe más grande, van en dos filas
// alternas. Las zonas de toque son tan anchas como la separación entre marcas
// (unos 15 px con 21 marcas en un móvil): con más marcas, mejor de 2 en 2.

import { fmt } from './enteros.js';

// ─── Parte pura ────────────────────────────────────────────────────────────────

/** Ancho del dibujo de la recta (unidades del viewBox; el SVG se estira al ancho de la tarjeta). */
export const ANCHO_RECTA = 360;
const MARGEN = 20;
/** Separación entre marcas del termómetro, y su ancho. */
export const SEPARACION_TERMOMETRO = 13;
export const ANCHO_TERMOMETRO = 150;

/** Las marcas, de `min` a `max` de `paso` en `paso`. */
export function marcas({ min, max, paso = 1 }) {
  if (!(paso > 0) || max <= min) throw new Error(`Recta sin marcas: de ${min} a ${max} de ${paso} en ${paso}`);
  const salida = [];
  for (let v = min; v <= max; v += paso) salida.push(v);
  return salida;
}

/** Con 'algunas', cada cuánto va un número. */
const cadaPorDefecto = paso => (paso === 1 ? 5 : 10);

/** ¿Lleva número la marca `valor`? */
export function conNumero(valor, { min, max, paso = 1, numeros = 'algunas', cada = null }) {
  if (Array.isArray(numeros)) return numeros.includes(valor);
  if (numeros === 'todas') return true;
  if (numeros === 'cero') return valor === 0;
  const k = cada ?? cadaPorDefecto(paso);
  return valor === 0 || valor === min || valor === max || valor % k === 0;
}

/**
 * Las medidas del dibujo: `coord(valor)` es la x (recta) o la y (termómetro) de una
 * marca; `valorEn(coord)` es la marca más cercana a esa coordenada (dentro del
 * rango); `fuente` es el tamaño de la letra de los números. En la recta, si los
 * números no caben en una fila sin montarse, van en dos, alternos: `filaDe(valor)`.
 */
export function geometria(opciones) {
  const { tipo = 'recta', min, max, paso = 1 } = opciones;
  const lista = marcas({ min, max, paso });
  const n = lista.length;
  const valorEn = coord => {
    const t = tipo === 'recta' ? (coord - MARGEN) / (ANCHO_RECTA - 2 * MARGEN) : (coord - ARRIBA) / (n - 1) / SEPARACION_TERMOMETRO;
    const v = tipo === 'recta' ? min + t * (max - min) : max - t * (max - min);
    const k = Math.round((v - min) / paso);
    return min + Math.max(0, Math.min(n - 1, k)) * paso;
  };
  if (tipo === 'termometro') {
    const alto = ARRIBA + (n - 1) * SEPARACION_TERMOMETRO + ABAJO;
    return {
      tipo, n, ancho: ANCHO_TERMOMETRO, alto, separacion: SEPARACION_TERMOMETRO, fuente: 11,
      coord: v => ARRIBA + ((max - v) / paso) * SEPARACION_TERMOMETRO,
      valorEn,
      filaDe: () => 0,
    };
  }
  const separacion = (ANCHO_RECTA - 2 * MARGEN) / (n - 1);
  const coord = v => MARGEN + ((v - min) / (max - min)) * (ANCHO_RECTA - 2 * MARGEN);
  const numerados = lista.filter(v => conNumero(v, opciones));
  // La letra más grande (de 14 a 9) con la que los números no se montan, en una fila o en dos alternas.
  const caben = (f, filas) => numerados.every((v, i) => i < filas
    || coord(v) - coord(numerados[i - filas]) >= (anchoNumero(v, f) + anchoNumero(numerados[i - filas], f)) / 2 + 2);
  const mayor = filas => { for (let f = 14; f >= 9; f--) if (caben(f, filas)) return f; return 0; };
  const enUna = mayor(1), enDos = mayor(2);
  const filas = enUna >= 11 || enUna >= enDos ? 1 : 2;
  const fuente = (filas === 1 ? enUna : enDos) || 9;
  return {
    tipo, n, ancho: ANCHO_RECTA, alto: ALTO_RECTA + (filas - 1) * (fuente + 3), separacion, fuente, filas,
    coord,
    valorEn,
    filaDe: v => (filas === 1 ? 0 : Math.max(0, numerados.indexOf(v)) % 2),
  };
}
const ARRIBA = 16, ABAJO = 44;
/** Altura de la línea de la recta dentro del dibujo (debajo, los números; encima, los saltos). */
const Y_RECTA = 72, ALTO_RECTA = 106;

/** La marca más cercana a una coordenada (x en la recta, y en el termómetro). */
export function marcaMasCercana(coord, opciones) {
  return geometria(opciones).valorEn(coord);
}

/** Ancho aproximado de un número escrito con esa letra (para que no se monten). */
export function anchoNumero(valor, fuente) {
  return fmt(valor).length * fuente * 0.62;
}

// ─── Dibujo ────────────────────────────────────────────────────────────────────

const SVG = 'http://www.w3.org/2000/svg';
let instancias = 0;

const ESTILOS = `
.recta-enteros { display: block; width: 100%; height: auto; max-width: 560px; margin: .4rem auto .8rem; touch-action: manipulation; user-select: none; -webkit-user-select: none; overflow: visible; }
.recta-enteros--termometro { width: 150px; max-width: 150px; }
.re-linea { stroke: var(--texto, #1f2933); stroke-width: 2; }
.re-marca { stroke: var(--texto, #1f2933); stroke-width: 1.5; }
.re-marca--cero { stroke-width: 3; }
.re-num { fill: var(--texto, #1f2933); font-family: system-ui, sans-serif; font-weight: 600; text-anchor: middle; }
.recta-enteros--termometro .re-num { text-anchor: start; }
.re-num--cero { font-weight: 800; }
.re-capa { pointer-events: none; }
.re-toque { fill: transparent; cursor: pointer; outline: none; }
.re-toque:hover, .re-toque:focus-visible { fill: var(--primario-claro, #dbeafe); }
.re-toque--elegida { fill: var(--primario-claro, #dbeafe); }
.re-toque--bien { fill: var(--correcto-claro, #dcfce7); }
.re-toque--mal { fill: var(--error-claro, #fee2e2); }
.re-toque--falta { fill: transparent; stroke: var(--correcto, #15803d); stroke-width: 1.5; stroke-dasharray: 3 3; }
.recta-enteros--bloqueada .re-toque { cursor: default; pointer-events: none; }
.re-punto { fill: var(--primario, #1d4ed8); stroke: var(--tarjeta, #fff); stroke-width: 2; }
.re-punto--bien { fill: var(--correcto, #15803d); }
.re-punto--mal { fill: var(--error, #b91c1c); }
.re-punto--hueco { fill: var(--tarjeta, #fff); stroke: var(--primario, #1d4ed8); stroke-width: 2.5; }
.re-etiqueta { fill: var(--primario, #1d4ed8); font: 700 13px system-ui, sans-serif; text-anchor: middle; }
.re-salto { fill: none; stroke: var(--primario, #1d4ed8); stroke-width: 2.5; stroke-linecap: round; }
.re-salto-etiqueta { fill: var(--primario, #1d4ed8); font: 700 13px system-ui, sans-serif; text-anchor: middle; paint-order: stroke; stroke: var(--tarjeta, #fff); stroke-width: 4px; stroke-linejoin: round; }
.re-flecha { fill: var(--primario, #1d4ed8); }
.re-tubo { fill: var(--tarjeta, #fff); stroke: var(--texto, #1f2933); stroke-width: 2; }
.re-liquido { fill: #dc2626; }
`;

function ponerEstilos() {
  if (document.getElementById('estilos-recta-enteros')) return;
  const hoja = document.createElement('style');
  hoja.id = 'estilos-recta-enteros';
  hoja.textContent = ESTILOS;
  document.head.append(hoja);
}

function el(nombre, atributos = {}, padre = null) {
  const e = document.createElementNS(SVG, nombre);
  for (const [k, v] of Object.entries(atributos)) if (v !== null && v !== undefined) e.setAttribute(k, v);
  if (padre) padre.append(e);
  return e;
}

/** Una recta o un termómetro dentro de `contenedor` (ver arriba). */
export function crearRecta(contenedor, opciones) {
  ponerEstilos();
  const { tipo = 'recta', min, max, paso = 1, unidad = '', nombre = '', alTocar = null } = opciones;
  const geo = geometria(opciones);
  const id = `re${++instancias}`;
  const vertical = tipo === 'termometro';
  const svg = el('svg', {
    class: `recta-enteros recta-enteros--${tipo}`, viewBox: `0 0 ${geo.ancho} ${geo.alto}`,
    role: alTocar ? 'group' : 'img', 'aria-label': nombre || null,
  });
  const defs = el('defs', {}, svg);
  const flecha = el('marker', { id: `${id}-flecha`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 're-flecha' }, flecha);

  // Las zonas de toque van debajo del dibujo, y el dibujo no se queda los toques (`re-capa`).
  const capaToques = el('g', {}, svg);
  const capaFondo = el('g', { class: 're-capa' }, svg);
  const capaSaltos = el('g', { class: 're-capa' }, svg);
  const capaEtiquetas = el('g', { class: 're-capa' }, svg);   // encima de los arcos: un salto nunca tapa la etiqueta de otro
  const capaPuntos = el('g', { class: 're-capa' }, svg);
  const lista = marcas({ min, max, paso });
  // El tubo, a la izquierda del centro: a su izquierda van los saltos y a su derecha, los números.
  const xTubo = 62, anchoTubo = 16;
  let liquido = null;

  if (vertical) {
    const yArriba = geo.coord(max) - 8, yAbajo = geo.coord(min) + 8;
    el('rect', { class: 're-tubo', x: xTubo - anchoTubo / 2, y: yArriba, width: anchoTubo, height: yAbajo - yArriba + 14, rx: anchoTubo / 2 }, capaFondo);
    el('circle', { class: 're-tubo', cx: xTubo, cy: yAbajo + 20, r: 14 }, capaFondo);
    el('circle', { class: 're-liquido', cx: xTubo, cy: yAbajo + 20, r: 10 }, capaFondo);
    liquido = el('rect', { class: 're-liquido', x: xTubo - 4, width: 8, y: yAbajo + 12, height: 0 }, capaFondo);
  } else {
    el('line', { class: 're-linea', x1: 6, x2: geo.ancho - 6, y1: Y_RECTA, y2: Y_RECTA }, capaFondo);
    el('path', { class: 're-flecha', d: `M ${geo.ancho - 2} ${Y_RECTA} l -9 -5 v 10 z` }, capaFondo);
  }

  const toques = new Map();
  for (const v of lista) {
    const c = geo.coord(v);
    const cero = v === 0 ? ' re-marca--cero' : '';
    if (vertical) {
      el('line', { class: `re-marca${cero}`, x1: xTubo + anchoTubo / 2, x2: xTubo + anchoTubo / 2 + (v === 0 ? 12 : 8), y1: c, y2: c }, capaFondo);
    } else {
      el('line', { class: `re-marca${cero}`, x1: c, x2: c, y1: Y_RECTA - (v === 0 ? 9 : 6), y2: Y_RECTA + (v === 0 ? 9 : 6) }, capaFondo);
    }
    if (conNumero(v, opciones)) {
      const t = el('text', vertical
        ? { class: `re-num${v === 0 ? ' re-num--cero' : ''}`, x: xTubo + anchoTubo / 2 + 16, y: c + geo.fuente * 0.36, 'font-size': geo.fuente }
        : { class: `re-num${v === 0 ? ' re-num--cero' : ''}`, x: c, y: Y_RECTA + 12 + geo.fuente + geo.filaDe(v) * (geo.fuente + 3), 'font-size': geo.fuente }, capaFondo);
      t.textContent = `${fmt(v)}${unidad}`;
    }
    if (alTocar) {
      const s = geo.separacion;
      const toque = el('rect', vertical
        ? { class: 're-toque', x: 0, y: c - s / 2, width: geo.ancho, height: s, rx: 3 }
        : { class: 're-toque', x: c - s / 2, y: Y_RECTA - 26, width: s, height: 52, rx: 4 }, capaToques);
      toque.setAttribute('tabindex', '0');
      toque.setAttribute('role', 'button');
      toque.setAttribute('aria-label', `${fmt(v)}${unidad}`);
      toque.addEventListener('click', () => { if (!bloqueada) alTocar(v); });
      toque.addEventListener('keydown', ev => {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        ev.preventDefault();
        if (!bloqueada) alTocar(v);
      });
      toques.set(v, toque);
    }
  }

  let bloqueada = false;
  let nSaltos = 0;
  let nivelActual = null;

  function ponerPuntos(puntos = []) {
    capaPuntos.replaceChildren();
    for (const p of puntos) {
      const c = geo.coord(p.valor);
      const [cx, cy] = vertical ? [xTubo + anchoTubo / 2 + 4, c] : [c, Y_RECTA];
      el('circle', { class: `re-punto ${p.clase ?? ''}`.trim(), cx, cy, r: 6.5 }, capaPuntos);
      if (p.etiqueta) {
        const t = el('text', vertical ? { class: 're-etiqueta', x: 12, y: cy + 4 } : { class: 're-etiqueta', x: cx, y: Y_RECTA - 14 }, capaPuntos);
        t.textContent = p.etiqueta;
      }
    }
  }

  function ponerNivel(valor, { animar = false } = {}) {
    if (!liquido) return Promise.resolve();
    const yAbajo = geo.coord(min) + 20;
    const y = geo.coord(valor);
    const destino = { y, height: Math.max(0, yAbajo - y) };
    nivelActual = valor;
    if (!animar || typeof liquido.animate !== 'function' || reducido()) {
      liquido.setAttribute('y', destino.y);
      liquido.setAttribute('height', destino.height);
      return Promise.resolve();
    }
    const y0 = Number(liquido.getAttribute('y')), h0 = Number(liquido.getAttribute('height'));
    return new Promise(listo => {
      const inicio = performance.now(), duracion = 600;
      const cuadro = ahora => {
        const t = Math.min(1, (ahora - inicio) / duracion);
        liquido.setAttribute('y', y0 + (destino.y - y0) * t);
        liquido.setAttribute('height', h0 + (destino.height - h0) * t);
        if (t < 1) requestAnimationFrame(cuadro); else listo();
      };
      requestAnimationFrame(cuadro);
    });
  }

  /** Un salto: arco con flecha de `desde` a `hasta` (en el termómetro, además, sube o baja el líquido). */
  function saltar({ desde, hasta, etiqueta = '', clase = '', animar = true, duracion = 600 } = {}) {
    const a = geo.coord(desde), b = geo.coord(hasta);
    const k = nSaltos++;
    let d, xEt, yEt;
    if (vertical) {
      const ancho = 18 + 6 * (k % 3);
      const x = xTubo - anchoTubo / 2 - 4;
      d = `M ${x} ${a} C ${x - ancho} ${a}, ${x - ancho} ${b}, ${x} ${b}`;
      xEt = x - ancho - 2; yEt = (a + b) / 2 + 4;
    } else {
      // Saltos seguidos, cada uno más alto que el anterior (de tres en tres), para que no se monten las etiquetas.
      const alto = Math.min(26, 10 + Math.abs(b - a) * 0.25) + 14 * (k % 3);
      d = `M ${a} ${Y_RECTA - 3} Q ${(a + b) / 2} ${Y_RECTA - 3 - 2 * alto} ${b} ${Y_RECTA - 3}`;
      xEt = (a + b) / 2; yEt = Y_RECTA - 3 - alto - 6;
    }
    const camino = el('path', { class: `re-salto ${clase}`.trim(), d, 'marker-end': `url(#${id}-flecha)` }, capaSaltos);
    if (etiqueta) {
      const t = el('text', { class: 're-salto-etiqueta', x: xEt, y: Math.max(12, yEt), 'text-anchor': vertical ? 'end' : null }, capaEtiquetas);
      t.textContent = etiqueta;
    }
    const nivel = vertical ? ponerNivel(hasta, { animar }) : Promise.resolve();
    if (!animar || typeof camino.getTotalLength !== 'function' || typeof camino.animate !== 'function' || reducido()) return nivel;
    const largo = camino.getTotalLength();
    camino.style.strokeDasharray = `${largo}`;
    const animacion = camino.animate([{ strokeDashoffset: largo }, { strokeDashoffset: 0 }], { duration: duracion, easing: 'ease-out' });
    return Promise.all([nivel, animacion.finished.catch(() => {})]).then(() => { camino.style.strokeDasharray = ''; });
  }

  ponerPuntos(opciones.puntos);
  if (vertical && opciones.nivel !== undefined) ponerNivel(opciones.nivel);
  contenedor.append(svg);

  return {
    elemento: svg,
    geometria: geo,
    ponerPuntos,
    ponerNivel,
    get nivel() { return nivelActual; },
    saltar,
    borrarSaltos() { capaSaltos.replaceChildren(); capaEtiquetas.replaceChildren(); nSaltos = 0; },
    marcar(valor, clase = 're-toque--elegida') { toques.get(valor)?.classList.add(clase); },
    desmarcar(valor) { const t = toques.get(valor); if (t) t.setAttribute('class', 're-toque'); },
    bloquear() { bloqueada = true; svg.classList.add('recta-enteros--bloqueada'); for (const t of toques.values()) t.setAttribute('tabindex', '-1'); },
  };
}

const reducido = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
