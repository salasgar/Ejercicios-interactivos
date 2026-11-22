// Práctica «Caza el error» de la unidad 7, Proporcionalidad y porcentajes (PU2, tarea 225): lógica pura.
//
// Cada plantilla es UN error típico de `ERRORES_TIPICOS` (proporcion.js) con sus números. Da una resolución de
// tres líneas: la 1 (el enunciado) siempre está bien; si hay error, está en UNA línea y las siguientes SIGUEN de
// ella. Los ítems son DATOS (JSON): las líneas se guardan ya escritas en {es, en}, así que la base puede volver a
// montar el mismo ítem al cambiar de idioma.
//
// Ítem: { tipo: 'donde' | 'que' | 'corrige', plantilla, params, lineas: [{es, en}], falsa (índice o null), error,
//         [opciones, solucion] (ej. 2) }.
//
// Casos de la hoja y del examen: CASOS_HOJA y HUELLAS_EXAMEN están vacíos porque a 19-11-2026 no existen aún las
// hojas ni los exámenes de la unidad 7 (la tarea 231 los coteja y los rellena). Todos los generadores ya
// consultan `esReservado`, así que rellenarlos basta.

import {
  cantidad, mismoValor, aTexto, numeroATexto, leerCantidad, ERRORES_TIPICOS as E, huellaCaso,
  aplicarPorcentaje, porcentajeDe, realidad, escalaATexto,
} from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';

const MENOS = '−';
const C = (v, u = null) => cantidad(v, u);
const A = (x, i) => aTexto(x, i);
const N = (v, i) => numeroATexto(v, i);
const L = f => ({ es: f('es'), en: f('en') });
const T = (es, en) => i => (i === 'en' ? en : es);
const pct = p => C(p, '%');
const CM = d => C(fraccion(Math.round(d * 2), 2), 'cm');

// ─── Casos que no se pueden repetir ───────────────────────────────────────────

/** Claves de `huellaCaso` en claro de las hojas de la unidad 7 (vacío hasta que existan; lo rellena la tarea 231). */
export const CASOS_HOJA = new Set();
/** Huellas (FNV-1a) de los exámenes de la unidad 7 (vacío hasta que existan; lo rellena la tarea 231). */
export const HUELLAS_EXAMEN = new Set();
export const esReservado = (tipo, datos) => CASOS_HOJA.has(huellaCaso(tipo, datos)) || HUELLAS_EXAMEN.has(huellaCaso(tipo, datos));

// ─── Plantillas ────────────────────────────────────────────────────────────────
// id (= error típico), clase, corrige, params(rng) → números o null, caso(p) → [tipo, datos] (reserva),
// bien(p) y mal(p) → Cantidad (resultado final bueno y malo), cadena(p, mal) → { lineas: [i => texto ×3], falsa },
// hint(p, idioma) → cómo se hace bien, args(p) → argumentos de `E[id].fn`.

export const PLANTILLAS = [];
const nueva = p => { PLANTILLAS.push(p); return p; };

export const CLASES = {
  porcentaje: ['porcentaje-entre-mil', 'porcentaje-entre-diez', 'dividir-entre-el-porcentaje'],
  descuento: ['restar-el-porcentaje-como-numero', 'descuento-por-precio-final'],
  otros: ['razonar-sumando', 'escala-sin-cambio-de-unidad'],
};
export const CLASE_DE = Object.fromEntries(Object.entries(CLASES).flatMap(([c, ids]) => ids.map(id => [id, c])));
/** Errores que son el mismo que otro con otro nombre (no se mezclan como distractor). */
const VECINOS = { 'porcentaje-entre-mil': ['porcentaje-entre-diez'], 'porcentaje-entre-diez': ['porcentaje-entre-mil'] };

// 1 · 2 cuestan 5 €; 4 cuestan 5 + 2 = 7 € (en vez de 10 €)
const COSAS = [
  { es: 'cuadernos', en: 'notebooks', u: [2, 5] }, { es: 'bolígrafos', en: 'pens', u: [2, 4] },
  { es: 'entradas', en: 'tickets', u: [3, 9] }, { es: 'bocadillos', en: 'sandwiches', u: [3, 6] },
];
nueva({
  id: 'razonar-sumando', corrige: true,
  params(rng) {
    const cosa = rng.entero(0, COSAS.length - 1), [lo, hi] = COSAS[cosa].u;
    const a = rng.entero(2, 5), k = rng.entero(2, 6), u = rng.entero(lo, hi);
    return { cosa, a, k, u };
  },
  caso: p => ['directa', { a: p.a, b: p.a * p.u, c: p.a * p.k }],
  args: p => [p.a, C(p.a * p.u, '€'), p.a * p.k],
  bien: p => C(p.a * p.u * p.k, '€'),
  mal: p => E['razonar-sumando'].fn(...PLANTILLAS[0].args(p)),
  cadena(p, mal) {
    const o = COSAS[p.cosa], c = p.a * p.k, B = C(p.a * p.u, '€'), bien = this.bien(p), m = this.mal(p);
    // JL, 22-11: antes la línea «mala» era «9 − 3 = 6», que es verdad, y la 3.ª sumaba bolígrafos a euros
    // («6,00 € + 6»). Ahora la mala dice el razonamiento equivocado (falso: cada unidad cuesta 2 € o más, así que
    // «c − a más» no cuesta «c − a €» más), y la 3.ª sigue de ella con euros.
    const dif = C(c - p.a, '€');
    return {
      lineas: [
        i => (i === 'en' ? `${p.a} ${o.en} cost ${A(B, i)}. How much do ${c} cost?` : `${p.a} ${o.es} cuestan ${A(B, i)}. ¿Cuánto cuestan ${c}?`),
        mal
          ? i => (i === 'en' ? `There are ${c - p.a} more ${o.en}, so they cost ${A(dif, i)} more.` : `Son ${c - p.a} ${o.es} más, así que cuestan ${A(dif, i)} más.`)
          : i => (i === 'en' ? `${c} is ${veces(p.k, 'en')} ${p.a}, so they cost ${veces(p.k, 'en', p.a)}.` : `${c} es ${veces(p.k, 'es')} ${p.a}, así que cuestan ${veces(p.k, 'es', p.a)}.`),
        mal ? i => `${A(B, i)} + ${A(dif, i)} = ${A(m, i)}` : i => `${p.k} · ${A(B, i)} = ${A(bien, i)}`,
      ],
      falsa: 1,
    };
  },
  // Solo la cuenta: el razonamiento bueno ya es la línea que se enseña como «Lo correcto es:».
  hint: (p, i) => (i === 'en'
    ? `They cost ${p.k} · ${A(C(p.a * p.u, '€'), i)} = ${A(C(p.a * p.u * p.k, '€'), i)}.`
    : `Cuestan ${p.k} · ${A(C(p.a * p.u, '€'), i)} = ${A(C(p.a * p.u * p.k, '€'), i)}.`),
});

/**
 * «el triple de» / «three times» y, con `a` (lo que cuestan a unidades), «el triple» / «three times as much». Nunca
 * «k veces más», que en español es ambiguo (JL, 22-11): de 4 en adelante, «4 veces» y «4 veces lo que cuestan 3».
 */
function veces(k, i, a = null) {
  if (i === 'en') {
    const v = k === 2 ? 'twice' : `${['', '', '', 'three', 'four', 'five', 'six'][k]} times`;
    return a === null ? v : `${v} as much`;
  }
  if (k <= 3) return `${k === 2 ? 'el doble' : 'el triple'}${a === null ? ' de' : ''}`;
  return a === null ? `${k} veces` : `${k} veces lo que cuestan ${a}`;
}

// 2, 3 y 4 · el porcentaje de una cantidad con un decimal mal pasado
const CONTEXTOS_PORCENTAJE = [
  { id: 'alumnos', unidad: null, es: (c, P) => `En un centro hay ${c} alumnos y el ${P} va en autobús. ¿Cuántos van en autobús?`, en: (c, P) => `A school has ${c} students and ${P} come by bus. How many come by bus?` },
  { id: 'euros', unidad: '€', es: (c, P) => `Una clase recauda ${c} y gasta el ${P} en una excursión. ¿Cuánto gasta?`, en: (c, P) => `A class raises ${c} and spends ${P} on a trip. How much does it spend?` },
];
const cantidadDe = (p, c) => C(c, CONTEXTOS_PORCENTAJE[p.ctx].unidad);
const enunciadoPorcentaje = p => i => {
  const x = CONTEXTOS_PORCENTAJE[p.ctx], Cc = cantidadDe(p, p.c);
  return i === 'en' ? x.en(A(Cc, i), A(pct(p.p), i)) : x.es(A(Cc, i), A(pct(p.p), i));
};
const bienPorcentaje = p => porcentajeDe(pct(p.p), cantidadDe(p, p.c)).resultado;

function porcentajeDecimal(id, ps, cs, divisor) {
  nueva({
    id, corrige: true,
    params(rng) { return { ctx: rng.entero(0, 1), p: rng.elegir(ps), c: rng.elegir(cs) }; },
    caso: p => ['porcentaje', { p: pct(p.p), c: p.c }],
    args: p => [p.p, cantidadDe(p, p.c)],
    bien: bienPorcentaje,
    mal(p) { return E[id].fn(...this.args(p)); },
    cadena(p, mal) {
      const bien = this.bien(p), m = this.mal(p), d = divisor / 100 === 1 ? 100 : divisor;
      const dBien = fraccion(p.p, 100), dMal = fraccion(p.p, d), Cc = cantidadDe(p, p.c);
      return {
        lineas: [
          enunciadoPorcentaje(p),
          i => `${A(pct(p.p), i)} = ${p.p} : ${mal ? d : 100} = ${N(mal ? dMal : dBien, i)}`,
          i => `${N(mal ? dMal : dBien, i)} · ${A(Cc, i)} = ${A(mal ? m : bien, i)}`,
        ],
        falsa: 1,
      };
    },
    hint: (p, i) => (i === 'en'
      ? `${p.p}% = ${p.p} : 100 = ${N(fraccion(p.p, 100), i)}, not ${p.p} : ${divisor}. Then ${N(fraccion(p.p, 100), i)} · ${A(cantidadDe(p, p.c), i)} = ${A(bienPorcentaje(p), i)}.`
      : `${p.p} % = ${p.p} : 100 = ${N(fraccion(p.p, 100), i)}, no ${p.p} : ${divisor}. Después ${N(fraccion(p.p, 100), i)} · ${A(cantidadDe(p, p.c), i)} = ${A(bienPorcentaje(p), i)}.`),
  });
}
const multiplos = (paso, desde, hasta) => Array.from({ length: Math.floor((hasta - desde) / paso) + 1 }, (_, k) => desde + k * paso);
porcentajeDecimal('porcentaje-entre-mil', [10, 15, 20, 25, 30, 40, 50, 60, 75, 80], multiplos(20, 100, 600), 1000);
porcentajeDecimal('porcentaje-entre-diez', [2, 3, 4, 5, 6, 8], multiplos(100, 100, 800), 10);

// 4 · el 20 % de 150 como 150 : 20
nueva({
  id: 'dividir-entre-el-porcentaje', corrige: true,
  params(rng) { return { ctx: rng.entero(0, 1), p: rng.elegir([20, 25, 30, 40, 50, 60, 75, 80]), c: rng.elegir(multiplos(20, 100, 600)) }; },
  caso: p => ['porcentaje', { p: pct(p.p), c: p.c }],
  args: p => [p.p, cantidadDe(p, p.c)],
  bien: bienPorcentaje,
  mal(p) { return E['dividir-entre-el-porcentaje'].fn(...this.args(p)); },
  cadena(p, mal) {
    const Cc = cantidadDe(p, p.c), bien = this.bien(p), m = this.mal(p);
    return {
      lineas: [
        enunciadoPorcentaje(p),
        mal ? i => `${A(pct(p.p), i)} ${i === 'en' ? 'of' : 'de'} ${A(Cc, i)} = ${A(Cc, i)} : ${p.p}`
          : i => `${A(pct(p.p), i)} ${i === 'en' ? 'of' : 'de'} ${A(Cc, i)} = ${A(Cc, i)} : 100 · ${p.p}`,
        mal ? i => `${A(Cc, i)} : ${p.p} = ${A(m, i)}` : i => `${A(Cc, i)} : 100 · ${p.p} = ${A(bien, i)}`,
      ],
      falsa: 1,
    };
  },
  hint: (p, i) => (i === 'en'
    ? `${p.p}% means ${p.p} out of every 100: first divide by 100 and then multiply by ${p.p}. ${A(cantidadDe(p, p.c), i)} : 100 · ${p.p} = ${A(bienPorcentaje(p), i)}.`
    : `${p.p} % son ${p.p} de cada 100: se divide entre 100 y se multiplica por ${p.p}. ${A(cantidadDe(p, p.c), i)} : 100 · ${p.p} = ${A(bienPorcentaje(p), i)}.`),
});

// 5 y 6 · descuentos
const ARTICULOS = [
  { es: 'un jersey', en: 'a jumper' }, { es: 'una chaqueta', en: 'a jacket' },
  { es: 'una mochila', en: 'a backpack' }, { es: 'un reloj', en: 'a watch' },
];
const enunciadoDescuento = p => i => {
  const a = ARTICULOS[p.art], Cc = C(p.c, '€');
  return i === 'en' ? `${a.en[0].toUpperCase()}${a.en.slice(1)} costs ${A(Cc, i)} and has a ${A(pct(p.p), i)} discount. How much do you pay?`
    : `${a.es[0].toUpperCase()}${a.es.slice(1)} cuesta ${A(Cc, i)} y tiene un ${A(pct(p.p), i)} de descuento. ¿Cuánto se paga?`;
};
const descuento = p => aplicarPorcentaje(C(p.c, '€'), pct(p.p), 'descuento');
const hintDescuento = (p, i) => {
  const r = descuento(p), Cc = C(p.c, '€');
  return i === 'en'
    ? `${A(pct(p.p), i)} of ${A(Cc, i)} = ${A(r.cambio, i)} is the discount. You pay ${A(Cc, i)} ${MENOS} ${A(r.cambio, i)} = ${A(r.final, i)}.`
    : `El ${A(pct(p.p), i)} de ${A(Cc, i)} = ${A(r.cambio, i)} es el descuento. Se pagan ${A(Cc, i)} ${MENOS} ${A(r.cambio, i)} = ${A(r.final, i)}.`;
};

nueva({
  id: 'restar-el-porcentaje-como-numero', corrige: true,
  params(rng) {
    const c = rng.elegir(multiplos(10, 30, 150).filter(v => v !== 100));
    return { art: rng.entero(0, ARTICULOS.length - 1), p: rng.elegir([10, 15, 20, 25, 30, 40, 50]), c };
  },
  caso: p => ['descuento', { p: pct(p.p), c: C(p.c, '€') }],
  args: p => [C(p.c, '€'), p.p],
  bien: p => descuento(p).final,
  mal(p) { return E['restar-el-porcentaje-como-numero'].fn(...this.args(p)); },
  cadena(p, mal) {
    const Cc = C(p.c, '€'), r = descuento(p), m = this.mal(p), pe = C(p.p, '€');
    return {
      lineas: [
        enunciadoDescuento(p),
        i => `${A(pct(p.p), i)} ${i === 'en' ? 'of' : 'de'} ${A(Cc, i)} = ${A(mal ? pe : r.cambio, i)}`,
        i => `${A(Cc, i)} ${MENOS} ${A(mal ? pe : r.cambio, i)} = ${A(mal ? m : r.final, i)}`,
      ],
      falsa: 1,
    };
  },
  hint: hintDescuento,
});

nueva({
  id: 'descuento-por-precio-final', corrige: true,
  params(rng) {
    return { art: rng.entero(0, ARTICULOS.length - 1), p: rng.elegir([10, 15, 20, 25, 30, 40, 60]), c: rng.elegir(multiplos(10, 20, 150)) };
  },
  caso: p => ['descuento', { p: pct(p.p), c: C(p.c, '€') }],
  args: p => [C(p.c, '€'), p.p],
  bien: p => descuento(p).final,
  mal(p) { return E['descuento-por-precio-final'].fn(...this.args(p)); },
  cadena(p, mal) {
    const Cc = C(p.c, '€'), r = descuento(p);
    return {
      lineas: [
        enunciadoDescuento(p),
        i => `${A(pct(p.p), i)} ${i === 'en' ? 'of' : 'de'} ${A(Cc, i)} = ${A(r.cambio, i)}`,
        mal ? i => (i === 'en' ? `You pay ${A(r.cambio, i)}` : `Se pagan ${A(r.cambio, i)}`)
          : i => (i === 'en' ? `You pay ${A(Cc, i)} ${MENOS} ${A(r.cambio, i)} = ${A(r.final, i)}` : `Se pagan ${A(Cc, i)} ${MENOS} ${A(r.cambio, i)} = ${A(r.final, i)}`),
      ],
      falsa: 2,
    };
  },
  hint: hintDescuento,
});

// 7 · 3 cm a 1 : 50 000 → «150 000 km» (son 1,5 km)
nueva({
  id: 'escala-sin-cambio-de-unidad', corrige: true,
  params(rng) { return { n: rng.elegir([10000, 25000, 50000, 100000, 200000]), d: rng.elegir([2, 2.5, 3, 4, 4.5, 5, 6, 7.5, 8, 10, 12, 15]) }; },
  caso: p => ['escala', { plano: CM(p.d), n: p.n }],
  args: p => [CM(p.d), p.n, 'realidad', 'km'],
  bien: p => realidad(CM(p.d), p.n, 'km').resultado,
  mal(p) { return E['escala-sin-cambio-de-unidad'].fn(...this.args(p)); },
  cadena(p, mal) {
    const plano = CM(p.d), cm = C(fraccion(Math.round(p.d * 2) * p.n, 2), 'cm'), bien = this.bien(p), m = this.mal(p);
    return {
      lineas: [
        i => (i === 'en' ? `On a map with scale ${escalaATexto(p.n)}, two towns are ${A(plano, i)} apart. How far apart are they in real life, in km?`
          : `En un plano a escala ${escalaATexto(p.n)}, dos pueblos están a ${A(plano, i)}. ¿Qué distancia real hay, en km?`),
        i => `${A(plano, i)} · ${N(p.n, i)} = ${A(cm, i)}`,
        i => `${A(cm, i)} = ${A(mal ? m : bien, i)}`,
      ],
      falsa: 2,
    };
  },
  hint: (p, i) => {
    const cm = C(fraccion(Math.round(p.d * 2) * p.n, 2), 'cm'), bien = realidad(CM(p.d), p.n, 'km').resultado;
    return i === 'en' ? `The result is in cm, so you must change the unit: 1 km = 100 000 cm, so ${A(cm, i)} = ${A(bien, i)}.`
      : `El resultado está en cm y hay que cambiar de unidad: 1 km = 100 000 cm, así que ${A(cm, i)} = ${A(bien, i)}.`;
  },
});

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));

// ─── Opciones del ejercicio 2 ──────────────────────────────────────────────────

/** ¿Daría `id` el mismo resultado malo que el del ítem? (solo se compara dentro de la misma clase: mismos argumentos). */
function mismoMal(pl, id, p) {
  if (CLASE_DE[id] !== CLASE_DE[pl.id]) return false;
  try { const mm = E[id].fn(...pl.args(p)); return mm !== null && mismoValor(mm, pl.mal(p)); } catch { return false; }
}

/** El error bueno y tres que no se han cometido (los de su clase primero, sin vecinos semánticos); barajados. */
export function opcionesDeNombre(rng, plantilla, p) {
  const todos = PLANTILLAS.map(x => x.id).filter(id => id !== plantilla.id && !(VECINOS[plantilla.id] ?? []).includes(id)
    && !mismoMal(plantilla, id, p));
  const mismos = rng.barajar(todos.filter(id => CLASE_DE[id] === CLASE_DE[plantilla.id]));
  const resto = rng.barajar(todos.filter(id => CLASE_DE[id] !== CLASE_DE[plantilla.id]));
  return rng.barajar([plantilla.id, ...[...mismos.slice(0, 1), ...resto].slice(0, 3)]);
}

// ─── Generadores ───────────────────────────────────────────────────────────────

function conParams(plantilla, rng) {
  for (let i = 0; i < 800; i++) {
    const p = plantilla.params(rng);
    const [tipo, datos] = plantilla.caso(p);
    if (esReservado(tipo, datos)) continue;
    const bien = plantilla.bien(p), mal = plantilla.mal(p);
    if (!mal || mismoValor(mal, bien)) continue;
    if (!pasaCotas(plantilla, p, bien, mal)) continue;
    return p;
  }
  throw new Error(`La plantilla «${plantilla.id}» no encuentra números`);
}

/** Cotas de exactitud de cada plantilla (las de realismo están en los rangos de sus `params`). */
export function pasaCotas(pl, p, bien, mal) {
  if (!bien.esExacta() || !mal.esExacta()) return false;
  if (pl.id === 'restar-el-porcentaje-como-numero') return p.c > p.p;
  return decimales(bien) <= 2 && decimales(mal) <= 2;
}
function decimales(x) {
  const t = numeroATexto(x.valor, 'en');
  const k = t.indexOf('.');
  return k < 0 ? 0 : t.length - k - 1;
}

const baseItem = (tipo, plantilla, p, mal, extra = {}) => {
  const { lineas, falsa } = plantilla.cadena(p, mal);
  return { tipo, plantilla: plantilla.id, params: p, lineas: lineas.map(L), falsa: mal ? falsa : null, error: mal ? plantilla.id : null, ...extra };
};

/** Ejercicio 1: ¿dónde está el error? Un tercio de los ítems no tiene ninguno. */
export function generarDonde(rng) {
  const pl = rng.elegir(PLANTILLAS), p = conParams(pl, rng);
  return baseItem('donde', pl, p, rng.azar() >= 1 / 3);
}

/** Ejercicio 2: ¿qué error es? Siempre hay error; cuatro nombres, uno solo verdadero. */
export function generarQue(rng) {
  const pl = rng.elegir(PLANTILLAS), p = conParams(pl, rng);
  return baseItem('que', pl, p, true, { opciones: opcionesDeNombre(rng, pl, p), solucion: pl.id });
}

/** Ejercicio 3: corrígelo (se teclea el resultado bueno). */
export function generarCorrige(rng) {
  const pl = rng.elegir(PLANTILLAS.filter(x => x.corrige)), p = conParams(pl, rng);
  return baseItem('corrige', pl, p, true, {});
}

export const resultadoBueno = item => PLANTILLA_POR_ID[item.plantilla].bien(item.params);
export const resultadoMalo = item => PLANTILLA_POR_ID[item.plantilla].mal(item.params);

/** Lo que escribe el alumno en «Corrígelo»: la cantidad (con la unidad del resultado) o null. */
export function leerResultado(texto, item, idioma = 'es') {
  const bien = resultadoBueno(item);
  const r = leerCantidad(String(texto ?? ''), { unidad: bien.unidad ?? undefined, idioma });
  return r.ok ? r.valor : null;
}

/** { acierto, error }: 'repite-el-error' si pone el resultado malo del compañero, 'otro-resultado' en el resto. */
export function corregirCorrige(item, escrito) {
  if (mismoValor(escrito, resultadoBueno(item))) return { acierto: true, error: null };
  return { acierto: false, error: mismoValor(escrito, resultadoMalo(item)) ? 'repite-el-error' : 'otro-resultado' };
}

/** La explicación con los números del ítem: cómo se hace bien. */
export const porque = (item, idioma) => PLANTILLA_POR_ID[item.plantilla].hint(item.params, idioma);

/** Las líneas de la resolución bien hecha. */
export const lineasBuenas = item => PLANTILLA_POR_ID[item.plantilla].cadena(item.params, false).lineas.map(L);
export const lineaBuena = item => lineasBuenas(item)[item.falsa];

export const claveItem = item => `${item.plantilla}|${JSON.stringify(item.params)}|${item.falsa ?? 'x'}`;

// ─── Pintar las líneas ─────────────────────────────────────────────────────────

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = s => String(s).replace(/[&<>]/g, c => ESCAPE[c]);
export const htmlLinea = (l, idioma) => esc(l[idioma]);
