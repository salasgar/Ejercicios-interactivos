// Dibujos de fracciones para las prácticas de la unidad 4 (PU2, tarea 98), en SVG:
// barras divididas en partes iguales, círculos en sectores («pizzas»),
// cuadrículas y una recta con marcas en los múltiplos de 1/d. La parte pura (dónde
// va cada parte o marca y qué parte o marca está más cerca de un toque) va en
// funciones exportadas, probadas en `tests/practicas-fracciones.test.js`; `crearFigura`
// y `crearRectaFracciones` son lo único que necesita el navegador. Los estilos van en
// una hoja propia que se añade sola una vez (clases `fd-…`, con los colores de
// `css/estilos.css`): una práctica los cambia en su `estilos.css`.
//
//   const fig = crearFigura(contenedor, {
//     tipo: 'barra',          // 'barra', 'pizza' o 'cuadricula'
//     partes: 8,              // partes iguales de cada figura (barra y pizza: de 1 a 12)
//     filas: 3, columnas: 4,  // solo la cuadrícula (partes = filas · columnas)
//     sombreadas: 3,          // las 3 primeras, o una lista de índices [0, 5, 6]
//     figuras: 2,             // cuántas figuras iguales (para las impropias: 7/4 son 2 barras);
//                             // por defecto, las que hagan falta para las sombreadas
//     alTocar: i => …,        // si se da, las partes se tocan (también con el teclado);
//                             // i va de 0 a figuras · partes − 1, por orden
//     nombre: '3/8',          // para el lector de pantalla
//   });
//   fig.alternar(i); fig.sombrear(i, true|false); fig.sombreadas();   // → [índices]
//   fig.marcar(i, 'fd-parte--bien'); fig.desmarcar(i);               // los cuatro estados
//   fig.bloquear();
//
//   const recta = crearRectaFracciones(contenedor, {
//     min: 0, max: 1,         // enteros; de 0 a 1, de 0 a 2, de −1 a 1…
//     den: 4,                 // marcas en los múltiplos de 1/4 (de 2 a 12)
//     numeros: 'enteros',     // qué marcas llevan número: 'enteros', 'todas' o una lista de fracciones
//     puntos: [{ valor: '3/4', etiqueta: 'A', clase: 'fd-punto--bien' }],
//     alTocar: f => …,        // si se da, las marcas se tocan: f es una Fraccion (sin simplificar: k/den)
//     nombre: 'Recta numérica',
//   });
//   recta.ponerPuntos([…]); recta.marcar(f, 'fd-toque--bien'); recta.desmarcar(f); recta.bloquear();
//
// Probado a 375 px: una barra con 12 partes (28 unidades de ancho cada una) y una recta
// de 0 a 2 con 24 marcas, donde cada zona de toque mide unos 12 px en el móvil (es lo
// justo: con más marcas, mejor partir la recta). Los números de la recta van con la
// letra más grande (13 a 8) con la que no se montan, y si no caben, en dos filas alternas.
// En un SVG lo que se dibuja encima se queda el clic: las capas de dibujo llevan
// `pointer-events: none` (lección de la 79) y las zonas de toque van debajo.

import { Fraccion, aFraccion } from './fracciones.js';
import { MENOS } from './enteros.js';

// ─── Parte pura: figuras ───────────────────────────────────────────────────────

/** Ancho del dibujo (unidades del viewBox; el SVG se estira al ancho de la tarjeta). */
export const ANCHO = 360;
const MARGEN_X = 10;
const ALTO_BARRA = 46, HUECO = 12, RADIO_PIZZA = 54;

/** Cuántas figuras hacen falta para sombrear `k` partes de `n` (al menos una). */
export function figurasPara(k, n) {
  return Math.max(1, Math.ceil(k / n));
}

/**
 * Las medidas de una figura: { ancho, alto, partes: [{ i, figura, … }] }. Cada parte de
 * una barra o una cuadrícula es un rectángulo { x, y, w, h }; la de una pizza, un sector
 * { cx, cy, r, a0, a1 } (ángulos en radianes, desde arriba y en el sentido de las agujas)
 * con su `d` (el camino SVG).
 */
export function geometriaFigura({ tipo = 'barra', partes = 1, filas = 1, columnas = 1, figuras = 1 }) {
  const n = tipo === 'cuadricula' ? filas * columnas : partes;
  if (!Number.isInteger(n) || n < 1) throw new Error(`Figura sin partes: ${n}`);
  const lista = [];
  if (tipo === 'barra') {
    const w = (ANCHO - 2 * MARGEN_X) / n;
    for (let f = 0; f < figuras; f++) {
      const y = 6 + f * (ALTO_BARRA + HUECO);
      for (let j = 0; j < n; j++) lista.push({ i: f * n + j, figura: f, x: MARGEN_X + j * w, y, w, h: ALTO_BARRA });
    }
    return { tipo, n, ancho: ANCHO, alto: 12 + figuras * ALTO_BARRA + (figuras - 1) * HUECO, partes: lista };
  }
  if (tipo === 'pizza') {
    const porFila = Math.min(figuras, 3);
    const filasPizza = Math.ceil(figuras / porFila);
    const lado = 2 * RADIO_PIZZA + 14;
    const x0 = (ANCHO - porFila * lado) / 2;
    for (let f = 0; f < figuras; f++) {
      const cx = x0 + (f % porFila) * lado + lado / 2, cy = 6 + Math.floor(f / porFila) * lado + lado / 2;
      for (let j = 0; j < n; j++) {
        const a0 = (2 * Math.PI * j) / n, a1 = (2 * Math.PI * (j + 1)) / n;
        lista.push({ i: f * n + j, figura: f, cx, cy, r: RADIO_PIZZA, a0, a1, d: caminoSector(cx, cy, RADIO_PIZZA, a0, a1, n) });
      }
    }
    return { tipo, n, ancho: ANCHO, alto: 12 + filasPizza * lado, partes: lista };
  }
  if (tipo === 'cuadricula') {
    // Celdas cuadradas, tan grandes como quepan en 340 de ancho y 180 de alto por figura.
    const lado = Math.min(34, (ANCHO - 2 * MARGEN_X) / columnas, 180 / filas);
    const anchoFig = lado * columnas;
    const porFila = Math.max(1, Math.min(figuras, Math.floor((ANCHO - 2 * MARGEN_X + HUECO) / (anchoFig + HUECO))));
    const filasFig = Math.ceil(figuras / porFila);
    const x0 = (ANCHO - porFila * anchoFig - (porFila - 1) * HUECO) / 2;
    for (let f = 0; f < figuras; f++) {
      const ox = x0 + (f % porFila) * (anchoFig + HUECO), oy = 6 + Math.floor(f / porFila) * (lado * filas + HUECO);
      for (let j = 0; j < n; j++) {
        lista.push({ i: f * n + j, figura: f, x: ox + (j % columnas) * lado, y: oy + Math.floor(j / columnas) * lado, w: lado, h: lado });
      }
    }
    return { tipo, n, ancho: ANCHO, alto: 12 + filasFig * lado * filas + (filasFig - 1) * HUECO, partes: lista };
  }
  throw new Error(`Tipo de figura desconocido: ${tipo}`);
}

function caminoSector(cx, cy, r, a0, a1, n) {
  const punto = a => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  if (n === 1) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  const [x0, y0] = punto(a0), [x1, y1] = punto(a1);
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

/** La parte que hay en el punto (x, y) del dibujo, o null si el toque cae fuera de todas. */
export function parteEn(x, y, opciones) {
  const geo = opciones.partes && Array.isArray(opciones.partes) ? opciones : geometriaFigura(opciones);
  for (const p of geo.partes) {
    if (p.d) {
      const dx = x - p.cx, dy = y - p.cy;
      if (dx * dx + dy * dy > p.r * p.r) continue;
      let a = Math.atan2(dx, -dy);
      if (a < 0) a += 2 * Math.PI;
      if (a >= p.a0 && a < p.a1) return p.i;
    } else if (x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h) {
      return p.i;
    }
  }
  return null;
}

/** Los índices sombreados a partir de `sombreadas` (un número: las primeras; o una lista). */
export function indicesSombreados(sombreadas, total) {
  if (Array.isArray(sombreadas)) return [...new Set(sombreadas)].filter(i => Number.isInteger(i) && i >= 0 && i < total).sort((a, b) => a - b);
  const k = Math.max(0, Math.min(total, sombreadas ?? 0));
  return Array.from({ length: k }, (_, i) => i);
}

// ─── Parte pura: la recta ──────────────────────────────────────────────────────

const MARGEN_RECTA = 22, Y_RECTA = 46;

/** Las marcas de `min` a `max` (enteros) de 1/den en 1/den, como fracciones k/den (sin simplificar). */
export function marcasRecta({ min = 0, max = 1, den }) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || max <= min) throw new Error(`Recta de ${min} a ${max}`);
  if (!Number.isInteger(den) || den < 1) throw new Error(`Recta con denominador ${den}`);
  const salida = [];
  for (let k = min * den; k <= max * den; k++) salida.push(new Fraccion(k, den));
  return salida;
}

/** ¿Lleva número la marca f? Con 'enteros', las que valen un entero; con 'todas', todas; o las de una lista. */
export function conNumeroRecta(f, { numeros = 'enteros' } = {}) {
  if (Array.isArray(numeros)) return numeros.some(x => aFraccion(x).equals(f));
  if (numeros === 'todas') return true;
  return f.esEntera();
}

/** Ancho aproximado de una etiqueta de fracción con esa letra (la del número más largo de los dos). */
export function anchoEtiqueta(f, fuente) {
  const cifras = f.esEntera() ? String(Math.abs(f.aEntero())).length + (f.num < 0 ? 1 : 0)
    : Math.max(String(Math.abs(f.num)).length, String(f.den).length) + (f.num < 0 ? 1.2 : 0);
  return cifras * fuente * 0.62;
}

/**
 * Las medidas de la recta: `coord(f)` es la x de una fracción; `fraccionEn(x)` la marca
 * más cercana (k/den, dentro de la recta); `separacion` entre marcas; `fuente` de los
 * números; `filas` (1 o 2) y `filaDe(f)` si los números van en dos filas alternas.
 */
export function geometriaRecta(opciones) {
  const { min = 0, max = 1, den } = opciones;
  const lista = marcasRecta({ min, max, den });
  const largo = ANCHO - 2 * MARGEN_RECTA;
  const coord = x => { const f = aFraccion(x); return MARGEN_RECTA + ((f.num / f.den - min) / (max - min)) * largo; };
  const separacion = largo / (lista.length - 1);
  const fraccionEn = x => {
    const k = Math.round(((x - MARGEN_RECTA) / largo) * (max - min) * den);
    return new Fraccion(min * den + Math.max(0, Math.min(lista.length - 1, k)), den);
  };
  const numerados = lista.filter(f => conNumeroRecta(f, opciones));
  const caben = (fuente, filas) => numerados.every((f, i) => i < filas
    || coord(f) - coord(numerados[i - filas]) >= (anchoEtiqueta(f, fuente) + anchoEtiqueta(numerados[i - filas], fuente)) / 2 + 2);
  const mayor = filas => { for (let t = 13; t >= 8; t--) if (caben(t, filas)) return t; return 0; };
  const enUna = mayor(1), enDos = mayor(2);
  const filas = enUna >= 10 || enUna >= enDos ? 1 : 2;
  const fuente = (filas === 1 ? enUna : enDos) || 8;
  const altoEtiqueta = numerados.some(f => !f.esEntera()) ? 2.3 * fuente : 1.2 * fuente;
  return {
    n: lista.length, ancho: ANCHO, alto: Y_RECTA + 16 + filas * (altoEtiqueta + 3) + 4,
    separacion, fuente, filas, altoEtiqueta, coord, fraccionEn,
    filaDe: f => (filas === 1 ? 0 : Math.max(0, numerados.findIndex(g => g.equals(f))) % 2),
  };
}

/** La marca más cercana a una x del dibujo (k/den). */
export function marcaMasCercanaRecta(x, opciones) {
  return geometriaRecta(opciones).fraccionEn(x);
}

// ─── Dibujo ────────────────────────────────────────────────────────────────────

const SVG = 'http://www.w3.org/2000/svg';

const ESTILOS = `
.dibujo-fracciones { display: block; width: 100%; height: auto; max-width: 520px; margin: .4rem auto .8rem; touch-action: manipulation; user-select: none; -webkit-user-select: none; overflow: visible; }
.fd-capa { pointer-events: none; }
.fd-parte { fill: var(--tarjeta, #fff); stroke: var(--texto, #1f2933); stroke-width: 1.5; stroke-linejoin: round; }
.fd-parte--sombreada { fill: var(--primario, #1d4ed8); fill-opacity: .55; }
.fd-parte--tocable { cursor: pointer; outline: none; }
.fd-parte--tocable:hover, .fd-parte--tocable:focus-visible { stroke-width: 3; }
.fd-parte--bien { stroke: var(--correcto, #15803d); stroke-width: 3.5; }
.fd-parte--mal { stroke: var(--error, #b91c1c); stroke-width: 3.5; }
.fd-parte--falta { stroke: var(--correcto, #15803d); stroke-width: 2.5; stroke-dasharray: 4 3; }
.dibujo-fracciones--bloqueado .fd-parte--tocable { cursor: default; pointer-events: none; }
.fd-linea { stroke: var(--texto, #1f2933); stroke-width: 2; }
.fd-flecha { fill: var(--texto, #1f2933); }
.fd-marca { stroke: var(--texto, #1f2933); stroke-width: 1.5; }
.fd-marca--entera { stroke-width: 2.5; }
.fd-num { fill: var(--texto, #1f2933); font-family: system-ui, sans-serif; font-weight: 600; text-anchor: middle; }
.fd-raya { stroke: var(--texto, #1f2933); stroke-width: 1; }
.fd-toque { fill: transparent; cursor: pointer; outline: none; }
.fd-toque:hover, .fd-toque:focus-visible, .fd-toque--elegida { fill: var(--primario-claro, #dbeafe); }
.fd-toque--bien { fill: var(--correcto-claro, #dcfce7); }
.fd-toque--mal { fill: var(--error-claro, #fee2e2); }
.fd-toque--falta { fill: transparent; stroke: var(--correcto, #15803d); stroke-width: 1.5; stroke-dasharray: 3 3; }
.dibujo-fracciones--bloqueado .fd-toque { cursor: default; pointer-events: none; }
.fd-punto { fill: var(--primario, #1d4ed8); stroke: var(--tarjeta, #fff); stroke-width: 2; }
.fd-punto--bien { fill: var(--correcto, #15803d); }
.fd-punto--mal { fill: var(--error, #b91c1c); }
.fd-punto--hueco { fill: var(--tarjeta, #fff); stroke: var(--primario, #1d4ed8); stroke-width: 2.5; }
.fd-etiqueta { fill: var(--primario, #1d4ed8); font: 700 13px system-ui, sans-serif; text-anchor: middle; }
`;

function ponerEstilos() {
  if (document.getElementById('estilos-dibujo-fracciones')) return;
  const hoja = document.createElement('style');
  hoja.id = 'estilos-dibujo-fracciones';
  hoja.textContent = ESTILOS;
  document.head.append(hoja);
}

function el(nombre, atributos = {}, padre = null) {
  const e = document.createElementNS(SVG, nombre);
  for (const [k, v] of Object.entries(atributos)) if (v !== null && v !== undefined) e.setAttribute(k, v);
  if (padre) padre.append(e);
  return e;
}

function tocable(nodo, etiqueta, accion, estaBloqueado) {
  nodo.setAttribute('tabindex', '0');
  nodo.setAttribute('role', 'button');
  nodo.setAttribute('aria-label', etiqueta);
  nodo.addEventListener('click', () => { if (!estaBloqueado()) accion(); });
  nodo.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    if (!estaBloqueado()) accion();
  });
}

/** Una barra, una pizza o una cuadrícula (o varias iguales) dentro de `contenedor` (ver arriba). */
export function crearFigura(contenedor, opciones) {
  ponerEstilos();
  const { tipo = 'barra', partes = 1, filas = 1, columnas = 1, sombreadas = 0, nombre = '', alTocar = null } = opciones;
  const n = tipo === 'cuadricula' ? filas * columnas : partes;
  const nSombreadas = Array.isArray(sombreadas) ? Math.max(0, ...sombreadas.map(i => i + 1)) : sombreadas;
  const figuras = opciones.figuras ?? figurasPara(nSombreadas, n);
  const geo = geometriaFigura({ tipo, partes, filas, columnas, figuras });
  const svg = el('svg', {
    class: `dibujo-fracciones dibujo-fracciones--${tipo}`, viewBox: `0 0 ${geo.ancho} ${geo.alto}`,
    role: alTocar ? 'group' : 'img', 'aria-label': nombre || null,
  });
  let bloqueada = false;
  const nodos = geo.partes.map(p => {
    const clase = `fd-parte${alTocar ? ' fd-parte--tocable' : ''}`;
    const nodo = p.d ? el('path', { class: clase, d: p.d }, svg) : el('rect', { class: clase, x: p.x, y: p.y, width: p.w, height: p.h }, svg);
    if (alTocar) tocable(nodo, `${p.i + 1}`, () => alTocar(p.i), () => bloqueada);
    return nodo;
  });
  const marcadas = new Map();
  const pintarClase = i => {
    const nodo = nodos[i];
    if (!nodo) return;
    const s = estado.has(i) ? ' fd-parte--sombreada' : '';
    nodo.setAttribute('class', `fd-parte${alTocar ? ' fd-parte--tocable' : ''}${s}${marcadas.has(i) ? ` ${marcadas.get(i)}` : ''}`);
  };
  const estado = new Set(indicesSombreados(sombreadas, geo.partes.length));
  for (let i = 0; i < nodos.length; i++) pintarClase(i);
  contenedor.append(svg);
  return {
    elemento: svg,
    geometria: geo,
    sombrear(i, si = true) { if (si) estado.add(i); else estado.delete(i); pintarClase(i); },
    alternar(i) { if (estado.has(i)) estado.delete(i); else estado.add(i); pintarClase(i); return estado.has(i); },
    sombreadas() { return [...estado].sort((a, b) => a - b); },
    marcar(i, clase = 'fd-parte--bien') { marcadas.set(i, clase); pintarClase(i); },
    desmarcar(i) { marcadas.delete(i); pintarClase(i); },
    bloquear() { bloqueada = true; svg.classList.add('dibujo-fracciones--bloqueado'); for (const nodo of nodos) nodo.setAttribute('tabindex', '-1'); },
  };
}

/** Una recta con marcas en los múltiplos de 1/den dentro de `contenedor` (ver arriba). */
export function crearRectaFracciones(contenedor, opciones) {
  ponerEstilos();
  const { min = 0, max = 1, den, nombre = '', alTocar = null } = opciones;
  const geo = geometriaRecta(opciones);
  const svg = el('svg', {
    class: 'dibujo-fracciones dibujo-fracciones--recta', viewBox: `0 0 ${geo.ancho} ${geo.alto}`,
    role: alTocar ? 'group' : 'img', 'aria-label': nombre || null,
  });
  const capaToques = el('g', {}, svg);
  const capaFondo = el('g', { class: 'fd-capa' }, svg);
  const capaPuntos = el('g', { class: 'fd-capa' }, svg);
  el('line', { class: 'fd-linea', x1: 6, x2: geo.ancho - 6, y1: Y_RECTA, y2: Y_RECTA }, capaFondo);
  el('path', { class: 'fd-flecha', d: `M ${geo.ancho - 2} ${Y_RECTA} l -9 -5 v 10 z` }, capaFondo);
  let bloqueada = false;
  const toques = new Map();
  const claveDe = f => aFraccion(f).clave();
  for (const f of marcasRecta({ min, max, den })) {
    const x = geo.coord(f);
    const entera = f.esEntera();
    el('line', { class: `fd-marca${entera ? ' fd-marca--entera' : ''}`, x1: x, x2: x, y1: Y_RECTA - (entera ? 10 : 6), y2: Y_RECTA + (entera ? 10 : 6) }, capaFondo);
    if (conNumeroRecta(f, opciones)) pintarEtiqueta(capaFondo, f, x, Y_RECTA + 14 + geo.filaDe(f) * (geo.altoEtiqueta + 3), geo.fuente);
    if (alTocar) {
      const s = geo.separacion;
      const toque = el('rect', { class: 'fd-toque', x: x - s / 2, y: Y_RECTA - 26, width: s, height: 52, rx: 4 }, capaToques);
      tocable(toque, f.esEntera() ? textoEntero(f) : `${f.num < 0 ? MENOS : ''}${Math.abs(f.num)}/${f.den}`, () => alTocar(f), () => bloqueada);
      toques.set(claveDe(f), toque);
    }
  }
  function ponerPuntos(puntos = []) {
    capaPuntos.replaceChildren();
    for (const p of puntos) {
      const x = geo.coord(p.valor);
      el('circle', { class: `fd-punto ${p.clase ?? ''}`.trim(), cx: x, cy: Y_RECTA, r: 6.5 }, capaPuntos);
      if (p.etiqueta) {
        const t = el('text', { class: 'fd-etiqueta', x, y: Y_RECTA - 14 }, capaPuntos);
        t.textContent = p.etiqueta;
      }
    }
  }
  ponerPuntos(opciones.puntos);
  contenedor.append(svg);
  return {
    elemento: svg,
    geometria: geo,
    ponerPuntos,
    marcar(f, clase = 'fd-toque--elegida') { toques.get(claveDe(f))?.classList.add(clase); },
    desmarcar(f) { const t = toques.get(claveDe(f)); if (t) t.setAttribute('class', 'fd-toque'); },
    bloquear() { bloqueada = true; svg.classList.add('dibujo-fracciones--bloqueado'); for (const t of toques.values()) t.setAttribute('tabindex', '-1'); },
  };
}

const textoEntero = f => { const v = f.aEntero(); return v < 0 ? `${MENOS}${-v}` : `${v}`; };

/** Un número de la recta: un entero en una línea; una fracción, con su raya (y el menos delante). */
function pintarEtiqueta(capa, f, x, y, fuente) {
  if (f.esEntera()) {
    const t = el('text', { class: 'fd-num', x, y: y + fuente, 'font-size': fuente }, capa);
    t.textContent = textoEntero(f);
    return;
  }
  const n = Math.abs(f.num);
  const ancho = Math.max(String(n).length, String(f.den).length) * fuente * 0.62 + 2;
  const xRaya = f.num < 0 ? x + fuente * 0.3 : x;
  const arriba = el('text', { class: 'fd-num', x: xRaya, y: y + fuente * 0.95, 'font-size': fuente }, capa);
  arriba.textContent = String(n);
  el('line', { class: 'fd-raya', x1: xRaya - ancho / 2, x2: xRaya + ancho / 2, y1: y + fuente * 1.15, y2: y + fuente * 1.15 }, capa);
  const abajo = el('text', { class: 'fd-num', x: xRaya, y: y + fuente * 2.2, 'font-size': fuente }, capa);
  abajo.textContent = String(f.den);
  if (f.num < 0) {
    const menos = el('text', { class: 'fd-num', x: xRaya - ancho / 2 - fuente * 0.35, y: y + fuente * 1.5, 'font-size': fuente }, capa);
    menos.textContent = MENOS;
  }
}
