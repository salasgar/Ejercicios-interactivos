// Recta numérica de decimales para las prácticas de la unidad 5 (PU2, tarea 122), en SVG.
// Hermana de `recta-enteros.js`: la parte pura (qué marcas hay, cuáles son grandes, cuáles
// llevan número, dónde cae cada valor y qué marca está más cerca de un toque) va en funciones
// exportadas, probadas en `tests/practicas-decimales.test.js`; `crearRectaDecimales` es lo
// único que necesita el navegador. Los valores son siempre `Decimal` de `decimales.js`
// (enteros escalados): la posición en el dibujo se calcula por el índice de la marca, nunca
// sumando 0,1 en coma flotante.
//
//   const recta = crearRectaDecimales(contenedor, {
//     desde: '3', hasta: '4',     // Decimal, entero o texto; desde < hasta
//     cifras: 2,                  // las marcas más finas: 1 = décimas, 2 = centésimas, 3 = milésimas
//     grandes: 1,                 // las marcas grandes (por defecto, cifras − 1): aquí, las décimas
//     numeros: 'grandes',         // qué marcas llevan número: 'grandes', 'extremos', 'ninguno' o una lista de valores
//     idioma: 'es',               // coma (es) o punto (en) en los números
//     puntos: [{ valor: '3,45', etiqueta: 'A', clase: 'rd-punto--bien' }],
//     tocables: 'todas',          // qué marcas se pueden tocar: 'todas' o 'grandes'
//                                 // (por defecto, 'todas' si son 21 o menos; si no, 'grandes')
//     alTocar: valor => …,        // si se da, las marcas se pueden tocar (y con el teclado); recibe un Decimal
//     nombre: 'Recta numérica',   // para el lector de pantalla
//   });
//   recta.ponerPuntos([{ valor, etiqueta, clase }]);   // sustituye los puntos
//   recta.marcar(valor, clase); recta.desmarcar(valor);   // rd-toque--elegida | --bien | --mal | --falta
//   recta.bloquear();                                   // tras responder: ya no se toca
//
// Medidas a 375 px: hasta 10 marcas grandes con 10 pequeñas entre cada dos (101 marcas) se
// ven; los números van en las grandes, con la letra más grande (de 14 a 9) con la que no se
// montan. Tocar: con 11 marcas tocables, zonas de unos 30 px en el móvil; con 21, unos 15
// px (lo justo); con más, solo las grandes. En un SVG lo que se dibuja encima se queda el clic:
// todo lo que no es una zona de toque va en capas con `pointer-events: none` (lección de la 79).

import { Decimal, aDecimal, restar, sumar, comparar, aTexto } from './decimales.js';

// ─── Parte pura ────────────────────────────────────────────────────────────────

/** Ancho del dibujo (unidades del viewBox; el SVG se estira al ancho de la tarjeta). */
export const ANCHO_RECTA_DECIMALES = 360;
const MARGEN = 20;
const MAX_MARCAS = 101;
const Y_RECTA = 56, ALTO = 92;

/** Las opciones con los valores ya como Decimal y los de por defecto puestos. */
export function opcionesRecta(opciones) {
  const desde = aDecimal(opciones.desde), hasta = aDecimal(opciones.hasta);
  const cifras = opciones.cifras ?? 1;
  const grandes = opciones.grandes ?? Math.max(0, cifras - 1);
  if (comparar(desde, hasta) >= 0) throw new Error(`Recta de decimales sin tramo: de ${aTexto(desde)} a ${aTexto(hasta)}`);
  if (!Number.isInteger(cifras) || cifras < 0 || cifras > 3) throw new Error(`cifras = ${cifras}: de 0 a 3`);
  if (!Number.isInteger(grandes) || grandes < 0 || grandes > cifras) throw new Error(`grandes = ${grandes}: de 0 a cifras`);
  const a = desde.conCifras(cifras), b = hasta.conCifras(cifras);
  if (!a || !b) throw new Error(`Los extremos tienen que caer en una marca (${cifras} cifras)`);
  const n = b.m - a.m + 1;
  if (n > MAX_MARCAS) throw new Error(`${n} marcas: como mucho ${MAX_MARCAS}`);
  const tocables = opciones.tocables ?? (n <= 21 ? 'todas' : 'grandes');
  return { ...opciones, desde: a, hasta: b, cifras, grandes, n, tocables, numeros: opciones.numeros ?? 'grandes', idioma: opciones.idioma ?? 'es' };
}

/** El valor de la marca i (0 = `desde`), con `cifras` cifras decimales. */
export function valorDeMarca(i, opciones) {
  const o = opciones.n ? opciones : opcionesRecta(opciones);
  return new Decimal(o.desde.m + i, o.cifras);
}

/** El índice de la marca de ese valor, o null si no cae en una marca. */
export function indiceDe(valor, opciones) {
  const o = opciones.n ? opciones : opcionesRecta(opciones);
  const v = aDecimal(valor).conCifras(o.cifras);
  if (!v) return null;
  const i = v.m - o.desde.m;
  return i >= 0 && i < o.n ? i : null;
}

/** Las marcas: [{ i, valor, grande, numero, tocable }]. */
export function marcasDecimales(opciones) {
  const o = opciones.n ? opciones : opcionesRecta(opciones);
  const paso = 10 ** (o.cifras - o.grandes);
  const lista = Array.isArray(o.numeros) ? o.numeros.map(aDecimal) : null;
  return Array.from({ length: o.n }, (_, i) => {
    const valor = valorDeMarca(i, o);
    const grande = valor.m % paso === 0;
    const extremo = i === 0 || i === o.n - 1;
    const numero = lista ? lista.some(x => comparar(x, valor) === 0)
      : o.numeros === 'grandes' ? grande : o.numeros === 'extremos' ? extremo : false;
    return { i, valor, grande, numero, tocable: o.tocables === 'todas' || grande };
  });
}

/** El número de una marca como se escribe en la recta: sin ceros finales (3 y 3,4, no 3,0 ni 3,40). */
export function textoDeMarca(valor, opciones) {
  const o = opciones.n ? opciones : opcionesRecta(opciones);
  return aTexto(aDecimal(valor).normalizar(), o.idioma);
}

/** Ancho aproximado de un texto con esa letra (para que los números no se monten). */
export const anchoTexto = (texto, fuente) => String(texto).length * fuente * 0.6;

/**
 * Las medidas: `coord(valor)` es la x de un valor (esté o no en una marca), `x(i)` la de la
 * marca i, `indiceEn(x)` la marca más cercana a una x (dentro del tramo), `separacion` la
 * distancia entre dos marcas tocables y `fuente` el tamaño de los números.
 */
export function geometriaDecimales(opciones) {
  const o = opciones.n ? opciones : opcionesRecta(opciones);
  const util = ANCHO_RECTA_DECIMALES - 2 * MARGEN;
  const x = i => MARGEN + (i / (o.n - 1)) * util;
  // La posición de un valor cualquiera: la fracción exacta del tramo, pasada a coordenada solo para dibujar.
  const total = restar(o.hasta, o.desde);
  const coord = valor => {
    const parte = restar(aDecimal(valor), o.desde);
    const k = Math.max(parte.k, total.k);
    return MARGEN + ((parte.m * 10 ** (k - parte.k)) / (total.m * 10 ** (k - total.k))) * util;
  };
  const indiceEn = cx => Math.max(0, Math.min(o.n - 1, Math.round(((cx - MARGEN) / util) * (o.n - 1))));
  const marcas = marcasDecimales(o);
  const tocables = marcas.filter(m => m.tocable);
  const separacion = tocables.length > 1 ? x(tocables[1].i) - x(tocables[0].i) : util;
  const numerados = marcas.filter(m => m.numero);
  const caben = f => numerados.every((m, j) => j === 0
    || x(m.i) - x(numerados[j - 1].i) >= (anchoTexto(textoDeMarca(m.valor, o), f) + anchoTexto(textoDeMarca(numerados[j - 1].valor, o), f)) / 2 + 2);
  let fuente = 9;
  for (let f = 14; f >= 9; f--) if (caben(f)) { fuente = f; break; }
  return { n: o.n, ancho: ANCHO_RECTA_DECIMALES, alto: ALTO, x, coord, indiceEn, separacion, fuente, marcas };
}

/** La marca más cercana a una x: { i, valor }; con `soloTocables`, la tocable más cercana. */
export function marcaMasCercanaDecimales(cx, opciones, { soloTocables = false } = {}) {
  const o = opciones.n ? opciones : opcionesRecta(opciones);
  const geo = geometriaDecimales(o);
  if (!soloTocables) { const i = geo.indiceEn(cx); return { i, valor: valorDeMarca(i, o) }; }
  let mejor = null;
  for (const m of geo.marcas) if (m.tocable && (!mejor || Math.abs(geo.x(m.i) - cx) < Math.abs(geo.x(mejor.i) - cx))) mejor = m;
  return { i: mejor.i, valor: mejor.valor };
}

/** El punto medio entre dos marcas grandes vecinas, por si una práctica quiere un valor «en medio» (exacto). */
export const puntoMedio = (a, b) => { const s = sumar(a, b); return new Decimal(s.m * 5, s.k + 1).normalizar(); };

// ─── Dibujo ────────────────────────────────────────────────────────────────────

const SVG = 'http://www.w3.org/2000/svg';

const ESTILOS = `
.recta-decimales { display: block; width: 100%; height: auto; max-width: 560px; margin: .4rem auto .8rem; touch-action: manipulation; user-select: none; -webkit-user-select: none; overflow: visible; }
.rd-linea { stroke: var(--texto, #1f2933); stroke-width: 2; }
.rd-marca { stroke: var(--texto, #1f2933); stroke-width: 1; }
.rd-marca--grande { stroke-width: 2; }
.rd-num { fill: var(--texto, #1f2933); font-family: system-ui, sans-serif; font-weight: 600; text-anchor: middle; }
.rd-capa { pointer-events: none; }
.rd-toque { fill: transparent; cursor: pointer; outline: none; }
.rd-toque:hover, .rd-toque:focus-visible { fill: var(--primario-claro, #dbeafe); }
.rd-toque--elegida { fill: var(--primario-claro, #dbeafe); }
.rd-toque--bien { fill: var(--correcto-claro, #dcfce7); }
.rd-toque--mal { fill: var(--error-claro, #fee2e2); }
.rd-toque--falta { fill: transparent; stroke: var(--correcto, #15803d); stroke-width: 1.5; stroke-dasharray: 3 3; }
.recta-decimales--bloqueada .rd-toque { cursor: default; pointer-events: none; }
.rd-punto { fill: var(--primario, #1d4ed8); stroke: var(--tarjeta, #fff); stroke-width: 2; }
.rd-punto--bien { fill: var(--correcto, #15803d); }
.rd-punto--mal { fill: var(--error, #b91c1c); }
.rd-punto--hueco { fill: var(--tarjeta, #fff); stroke: var(--primario, #1d4ed8); stroke-width: 2.5; }
.rd-etiqueta { fill: var(--primario, #1d4ed8); font: 700 13px system-ui, sans-serif; text-anchor: middle; }
`;

function ponerEstilos() {
  if (document.getElementById('estilos-recta-decimales')) return;
  const hoja = document.createElement('style');
  hoja.id = 'estilos-recta-decimales';
  hoja.textContent = ESTILOS;
  document.head.append(hoja);
}

function el(nombre, atributos = {}, padre = null) {
  const e = document.createElementNS(SVG, nombre);
  for (const [k, v] of Object.entries(atributos)) if (v !== null && v !== undefined) e.setAttribute(k, v);
  if (padre) padre.append(e);
  return e;
}

/** Una recta de decimales dentro de `contenedor` (ver arriba). */
export function crearRectaDecimales(contenedor, opciones) {
  ponerEstilos();
  const o = opcionesRecta(opciones);
  const { nombre = '', alTocar = null } = opciones;
  const geo = geometriaDecimales(o);
  const svg = el('svg', {
    class: 'recta-decimales', viewBox: `0 0 ${geo.ancho} ${geo.alto}`,
    role: alTocar ? 'group' : 'img', 'aria-label': nombre || null,
  });
  // Las zonas de toque van debajo del dibujo, y el dibujo no se queda los toques (`rd-capa`).
  const capaToques = el('g', {}, svg);
  const capaFondo = el('g', { class: 'rd-capa' }, svg);
  const capaPuntos = el('g', { class: 'rd-capa' }, svg);
  el('line', { class: 'rd-linea', x1: 6, x2: geo.ancho - 6, y1: Y_RECTA, y2: Y_RECTA }, capaFondo);
  el('path', { class: 'rd-linea', d: `M ${geo.ancho - 2} ${Y_RECTA} l -9 -5 v 10 z`, fill: 'currentColor' }, capaFondo);

  let bloqueada = false;
  const toques = new Map();
  for (const m of geo.marcas) {
    const cx = geo.x(m.i);
    const alto = m.grande ? 8 : 4;
    el('line', { class: `rd-marca${m.grande ? ' rd-marca--grande' : ''}`, x1: cx, x2: cx, y1: Y_RECTA - alto, y2: Y_RECTA + alto }, capaFondo);
    if (m.numero) {
      const t = el('text', { class: 'rd-num', x: cx, y: Y_RECTA + 12 + geo.fuente, 'font-size': geo.fuente }, capaFondo);
      t.textContent = textoDeMarca(m.valor, o);
    }
    if (alTocar && m.tocable) {
      const s = geo.separacion;
      const toque = el('rect', { class: 'rd-toque', x: cx - s / 2, y: Y_RECTA - 24, width: s, height: 48, rx: 4 }, capaToques);
      toque.setAttribute('tabindex', '0');
      toque.setAttribute('role', 'button');
      toque.setAttribute('aria-label', aTexto(m.valor.normalizar(), o.idioma));
      const tocar = () => { if (!bloqueada) alTocar(m.valor); };
      toque.addEventListener('click', tocar);
      toque.addEventListener('keydown', ev => {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        ev.preventDefault();
        tocar();
      });
      toques.set(m.i, toque);
    }
  }

  function ponerPuntos(puntos = []) {
    capaPuntos.replaceChildren();
    for (const p of puntos) {
      const cx = geo.coord(p.valor);
      el('circle', { class: `rd-punto ${p.clase ?? ''}`.trim(), cx, cy: Y_RECTA, r: 6.5 }, capaPuntos);
      if (p.etiqueta) {
        const t = el('text', { class: 'rd-etiqueta', x: cx, y: Y_RECTA - 14 }, capaPuntos);
        t.textContent = p.etiqueta;
      }
    }
  }

  ponerPuntos(opciones.puntos);
  contenedor.append(svg);
  const toqueDe = valor => { const i = indiceDe(valor, o); return i === null ? null : toques.get(i); };

  return {
    elemento: svg,
    geometria: geo,
    ponerPuntos,
    marcar(valor, clase = 'rd-toque--elegida') { toqueDe(valor)?.classList.add(clase); },
    desmarcar(valor) { const t = toqueDe(valor); if (t) t.setAttribute('class', 'rd-toque'); },
    bloquear() { bloqueada = true; svg.classList.add('recta-decimales--bloqueada'); for (const t of toques.values()) t.setAttribute('tabindex', '-1'); },
  };
}
