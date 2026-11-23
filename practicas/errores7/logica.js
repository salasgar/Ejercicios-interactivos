// Práctica «Caza el error» de la unidad 7, Proporcionalidad y porcentajes (PU2, tarea 225): lógica pura.
//
// Cada plantilla es UN error típico de `ERRORES_TIPICOS` (proporcion.js) con sus números. Da una resolución de
// tres líneas: la 1 (el enunciado) siempre está bien; si hay error, está en UNA línea y las siguientes SIGUEN de
// ella. Los ítems son DATOS (JSON): las líneas se guardan ya escritas en {es, en}, así que la base puede volver a
// montar el mismo ítem al cambiar de idioma.
//
// Ítem de los ej. 2 y 3: { tipo: 'que' | 'corrige', plantilla, params, lineas: [{es, en}], falsa, error,
//         [opciones, solucion] (ej. 2) }.
// Ítem del ej. 1 (en columnas, JL 22-11): { tipo: 'donde', plantilla (la base de la familia), familia, params,
//         enunciado: {es, en}, columnas: [{ ruta, lineas, falsa, error, porque, corregida }], preguntas, solucion }.
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
  { es: 'cuadernos', en: 'notebooks', uno: { es: 'Un cuaderno', en: 'One notebook' }, u: [2, 5] },
  { es: 'bolígrafos', en: 'pens', uno: { es: 'Un bolígrafo', en: 'One pen' }, u: [2, 4] },
  { es: 'entradas', en: 'tickets', uno: { es: 'Una entrada', en: 'One ticket' }, u: [3, 9] },
  { es: 'bocadillos', en: 'sandwiches', uno: { es: 'Un bocadillo', en: 'One sandwich' }, u: [3, 6] },
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
      ? `${A(pct(p.p), i)} = ${p.p} : 100 = ${N(fraccion(p.p, 100), i)}, not ${p.p} : ${divisor}. Then ${N(fraccion(p.p, 100), i)} · ${A(cantidadDe(p, p.c), i)} = ${A(bienPorcentaje(p), i)}.`
      : `${A(pct(p.p), i)} = ${p.p} : 100 = ${N(fraccion(p.p, 100), i)}, no ${p.p} : ${divisor}. Después ${N(fraccion(p.p, 100), i)} · ${A(cantidadDe(p, p.c), i)} = ${A(bienPorcentaje(p), i)}.`),
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
    ? `${A(pct(p.p), i)} means ${p.p} out of every 100: first divide by 100 and then multiply by ${p.p}. ${A(cantidadDe(p, p.c), i)} : 100 · ${p.p} = ${A(bienPorcentaje(p), i)}.`
    : `${A(pct(p.p), i)} son ${p.p} de cada 100: se divide entre 100 y se multiplica por ${p.p}. ${A(cantidadDe(p, p.c), i)} : 100 · ${p.p} = ${A(bienPorcentaje(p), i)}.`),
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

/**
 * El contexto según la escala (JL, 23-11): con 1 : 10 000 y 1 : 25 000 la distancia real puede bajar a 0,2 km, que
 * no son dos pueblos: es un plano de la ciudad, con el instituto y la biblioteca (de 0,2 a 3,75 km). Con las
 * escalas de mapa (1 : 50 000 en adelante), dos pueblos (de 1 a 30 km).
 */
function enunciadoEscala(p, plano, i) {
  const e = escalaATexto(p.n), d = A(plano, i);
  if (p.n <= 25000) {
    return i === 'en' ? `On a town map with scale ${e}, the school and the library are ${d} apart. How far apart are they in real life, in km?`
      : `En un plano de la ciudad a escala ${e}, el instituto y la biblioteca están a ${d}. ¿Qué distancia real hay, en km?`;
  }
  return i === 'en' ? `On a map with scale ${e}, two towns are ${d} apart. How far apart are they in real life, in km?`
    : `En un mapa a escala ${e}, dos pueblos están a ${d}. ¿Qué distancia real hay, en km?`;
}

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
        i => enunciadoEscala(p, plano, i),
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

// ─── Ejercicio 1 en columnas (JL, 22-11) ────────────────────────────────────────
//
// El mismo problema resuelto por varios alumnos, uno por columna: de 2 a 4 columnas, 1 o 2 bien (de formas
// distintas) y 1 o 2 con un error (errores distintos). Antes era una sola resolución de tres líneas con «Todo está
// bien», y el error se deducía. Una FAMILIA es un tipo de problema: sus números tienen la forma de los de su
// plantilla `base` (que da el enunciado y la reserva de casos), pero salen de `params` y pasan su `cota` de
// realismo. Sus RUTAS son { id, error (null si está bien), vale?(p), cadena(p) → { lineas: [i => texto] (sin el
// enunciado), falsa (contando el enunciado) }, valor(p) → la cantidad con que acaba, porque(p, i), corregida?(p) →
// i => texto (la línea mala bien hecha) }. Las rutas con error son las plantillas de arriba (`dePlantilla`) o
// errores del catálogo sin plantilla, escritos aquí. En las columnas buenas ninguna igualdad es falsa y en las malas
// la línea mala es falsa de verdad (una cuenta mal o una frase falsa): lo comprueba el test evaluando cada igualdad.

const PL = id => PLANTILLA_POR_ID[id];
const lineasBien = (id, p) => PL(id).cadena(p, false).lineas.slice(1);
const valorNum = x => x.valor.num / x.valor.den;
const de = i => (i === 'en' ? 'of' : 'de');

/** Una ruta con error que es una plantilla de arriba, con los números de la familia. */
const dePlantilla = (id, vale = () => true) => ({
  id, error: id, vale,
  cadena(p) { const c = PL(id).cadena(p, true); return { lineas: c.lineas.slice(1), falsa: c.falsa }; },
  valor: p => PL(id).mal(p),
  porque: (p, i) => PL(id).hint(p, i),
  corregida: p => PL(id).cadena(p, false).lineas[PL(id).cadena(p, true).falsa],
});

// Proporción directa: «3 bolígrafos cuestan 6,00 €. ¿Cuánto cuestan 9?»
const dir = p => ({ o: COSAS[p.cosa], c: p.a * p.k, B: C(p.a * p.u, '€'), U: C(p.u, '€'), R: C(p.a * p.u * p.k, '€') });
const PARTE = {
  es: ['', '', 'la mitad', 'la tercera parte', 'la cuarta parte', 'la quinta parte', 'la sexta parte'],
  en: ['', '', 'half as much', 'a third as much', 'a quarter as much', 'a fifth as much', 'a sixth as much'],
};
const unoCuesta = p => i => {
  const { o, B, U } = dir(p);
  return i === 'en' ? `${o.uno.en} costs ${A(B, i)} : ${p.a} = ${A(U, i)}.` : `${o.uno.es} cuesta ${A(B, i)} : ${p.a} = ${A(U, i)}.`;
};
const porUno = p => i => { const { c, U, R } = dir(p); return `${c} · ${A(U, i)} = ${A(R, i)}`; };

const DIRECTA_FACTOR = {
  id: 'directa-factor', error: null,
  cadena: p => ({ lineas: lineasBien('razonar-sumando', p) }),
  valor: p => dir(p).R,
  cuenta: p => [p.k, '·', valorNum(dir(p).B)],
  porque: (p, i) => (i === 'en' ? `It is right: ${dir(p).c} : ${p.a} = ${p.k}, so the price is also multiplied by ${p.k}.`
    : `Está bien: ${dir(p).c} : ${p.a} = ${p.k}, así que el precio también se multiplica por ${p.k}.`),
};
const DIRECTA_UNIDAD = {
  id: 'directa-unidad', error: null,
  cadena: p => ({ lineas: [unoCuesta(p), porUno(p)] }),
  valor: p => dir(p).R,
  cuenta: p => [dir(p).c, '·', p.u],
  porque: (p, i) => (i === 'en' ? `It is right: first the price of one, ${A(dir(p).U, i)}, and then times ${dir(p).c}.`
    : `Está bien: primero lo que cuesta uno, ${A(dir(p).U, i)}, y después por ${dir(p).c}.`),
};
const DIRECTA_REGLA = {
  // La regla de tres con la x, como en la práctica `regla-de-tres` de la unidad.
  id: 'directa-regla-de-tres', error: null,
  cadena(p) {
    const { o, c, B, R } = dir(p);
    return { lineas: [i => `${p.a} ${o[i]} → ${A(B, i)}`, i => `${c} ${o[i]} → x`, i => `x = ${A(B, i)} · ${c} : ${p.a} = ${A(R, i)}`] };
  },
  valor: p => dir(p).R,
  cuenta: p => [valorNum(dir(p).B), '·', dir(p).c, ':', p.a],
  porque: (p, i) => (i === 'en' ? `It is right: it is the rule of three; multiply across and divide by ${p.a}.`
    : `Está bien: es la regla de tres; se multiplica en cruz y se divide entre ${p.a}.`),
};
const DIRECTA_INVERSA = {
  // «9 es el triple de 3, así que cuestan la tercera parte»: la frase es falsa y la cuenta sigue de ella.
  id: 'inversa-en-directa', error: 'inversa-en-directa',
  cadena(p) {
    const { c, B } = dir(p), M = this.valor(p);
    return {
      lineas: [
        i => (i === 'en' ? `${c} is ${veces(p.k, 'en')} ${p.a}, so they cost ${PARTE.en[p.k]}.` : `${c} es ${veces(p.k, 'es')} ${p.a}, así que cuestan ${PARTE.es[p.k]}.`),
        i => `${A(B, i)} : ${p.k} = ${A(M, i)}`,
      ],
      falsa: 1,
    };
  },
  valor: p => E['inversa-en-directa'].fn(p.a, dir(p).B, dir(p).c),
  porque: (p, i) => PL('razonar-sumando').hint(p, i),
  corregida: p => lineasBien('razonar-sumando', p)[0],
};
const DIRECTA_PRECIO_DE_UNO = {
  // Calcula bien lo que cuesta uno y da eso como respuesta.
  id: 'contestar-precio-de-uno', error: 'contestar-otra-cosa',
  cadena(p) {
    const { o, c, U } = dir(p);
    return { lineas: [unoCuesta(p), i => (i === 'en' ? `Answer: ${c} ${o.en} cost ${A(U, i)}.` : `Respuesta: ${c} ${o.es} cuestan ${A(U, i)}.`)], falsa: 2 };
  },
  valor: p => E['contestar-otra-cosa'].fn(dir(p).U, dir(p).R),
  porque(p, i) {
    const { c, U, R } = dir(p);
    return i === 'en' ? `${A(U, i)} is the price of one, but the question asks for ${c}: ${c} · ${A(U, i)} = ${A(R, i)}.`
      : `${A(U, i)} es lo que cuesta uno, pero piden ${c}: ${c} · ${A(U, i)} = ${A(R, i)}.`;
  },
  corregida: p => porUno(p),
};

// El porcentaje de una cantidad: «En un centro hay 150 alumnos y el 20 % va en autobús.»
const pc = p => ({ P: pct(p.p), Cc: cantidadDe(p, p.c), prod: cantidadDe(p, p.p * p.c), R: bienPorcentaje(p) });
const PCT_DECIMAL = {
  id: 'porcentaje-decimal', error: null,
  cadena: p => ({ lineas: lineasBien('porcentaje-entre-mil', p) }),
  valor: bienPorcentaje,
  cuenta: p => [p.p / 100, '·', p.c],
  porque(p, i) {
    const { P, Cc } = pc(p), d = N(fraccion(p.p, 100), i);
    return i === 'en' ? `It is right: ${A(P, i)} is ${d}, multiplied by ${A(Cc, i)}.` : `Está bien: el ${A(P, i)} es ${d} y se multiplica por ${A(Cc, i)}.`;
  },
};
const PCT_UNO_POR_CIENTO = {
  id: 'porcentaje-uno-por-ciento', error: null,
  cadena: p => ({ lineas: lineasBien('dividir-entre-el-porcentaje', p) }),
  valor: bienPorcentaje,
  cuenta: p => [p.c, ':', 100, '·', p.p],
  porque: (p, i) => (i === 'en' ? `It is right: ${A(pc(p).Cc, i)} : 100 is ${A(pct(1), i)}, then times ${p.p}.`
    : `Está bien: ${A(pc(p).Cc, i)} : 100 es el ${A(pct(1), i)}, y se multiplica por ${p.p}.`),
};
const PCT_PRODUCTO = {
  id: 'porcentaje-producto', error: null,
  cadena(p) {
    const { P, Cc, prod, R } = pc(p);
    return { lineas: [i => `${A(P, i)} ${de(i)} ${A(Cc, i)} = ${p.p} · ${A(Cc, i)} : 100`, i => `${p.p} · ${A(Cc, i)} = ${A(prod, i)}`, i => `${A(prod, i)} : 100 = ${A(R, i)}`] };
  },
  valor: bienPorcentaje,
  cuenta: p => [p.p * p.c, ':', 100],
  porque: (p, i) => (i === 'en' ? `It is right: multiply by ${p.p} and divide by 100.` : `Está bien: se multiplica por ${p.p} y se divide entre 100.`),
};
const PCT_SIN_DIVIDIR = {
  id: 'porcentaje-sin-dividir', error: 'porcentaje-sin-dividir',
  cadena(p) {
    const { P, Cc, prod } = pc(p);
    return { lineas: [i => `${A(P, i)} ${de(i)} ${A(Cc, i)} = ${p.p} · ${A(Cc, i)}`, i => `${p.p} · ${A(Cc, i)} = ${A(prod, i)}`], falsa: 1 };
  },
  valor: p => E['porcentaje-sin-dividir'].fn(p.p, cantidadDe(p, p.c)),
  porque: (p, i) => `${p.p} · ${A(pc(p).Cc, i)} : 100 = ${A(pc(p).R, i)}.`,
  corregida: p => PCT_PRODUCTO.cadena(p).lineas[0],
};

// Descuentos: «Un jersey cuesta 50,00 € y tiene un 20 % de descuento. ¿Cuánto se paga?»
const sePaga = (p, signo) => i => {
  const cien = A(pct(100), i), P = A(pct(p.p), i), T = A(pct(100 + signo * p.p), i), op = signo < 0 ? MENOS : '+';
  return i === 'en' ? `You pay ${cien} ${op} ${P} = ${T}.` : `Se paga el ${cien} ${op} ${P} = ${T}.`;
};
const DESC_RESTANDO = {
  id: 'descuento-restando', error: null,
  cadena: p => ({ lineas: lineasBien('restar-el-porcentaje-como-numero', p) }),
  valor: p => descuento(p).final,
  cuenta: p => [p.c, '−', valorNum(descuento(p).cambio)],
  porque: (p, i) => (i === 'en' ? `It is right: the discount is ${A(descuento(p).cambio, i)}, taken away from the price.`
    : `Está bien: el descuento son ${A(descuento(p).cambio, i)} y se restan del precio.`),
};
const DESC_LO_QUE_SE_PAGA = {
  id: 'descuento-lo-que-se-paga', error: null,
  cadena: p => ({ lineas: [sePaga(p, -1), i => `${A(pct(100 - p.p), i)} ${de(i)} ${A(C(p.c, '€'), i)} = ${A(descuento(p).final, i)}`] }),
  valor: p => descuento(p).final,
  cuenta: p => [(100 - p.p) / 100, '·', p.c],
  porque: (p, i) => (i === 'en' ? `It is right: with a ${A(pct(p.p), i)} discount you pay ${A(pct(100 - p.p), i)} of the price.`
    : `Está bien: con un ${A(pct(p.p), i)} de descuento se paga el ${A(pct(100 - p.p), i)} del precio.`),
};
const DESC_SUMANDO = {
  // «Se paga el 100 % + 20 % = 120 %»: suma el descuento.
  id: 'descuento-sumando', error: 'aumento-por-descuento',
  cadena(p) {
    const M = this.valor(p);
    return { lineas: [sePaga(p, 1), i => `${A(pct(100 + p.p), i)} ${de(i)} ${A(C(p.c, '€'), i)} = ${A(M, i)}`], falsa: 1 };
  },
  valor: p => E['aumento-por-descuento'].fn(C(p.c, '€'), p.p, 'descuento'),
  porque: (p, i) => `${A(pct(100 - p.p), i)} ${de(i)} ${A(C(p.c, '€'), i)} = ${A(descuento(p).final, i)}.`,
  corregida: p => sePaga(p, -1),
};

// Escalas: «En un plano a escala 1 : 50 000, dos pueblos están a 3 cm. ¿Qué distancia real hay, en km?»
const dPlano = p => fraccion(Math.round(p.d * 2), 2);
const realKm = p => realidad(CM(p.d), p.n, 'km').resultado;
const ESCALA_AL_FINAL = {
  id: 'escala-al-final', error: null,
  cadena: p => ({ lineas: lineasBien('escala-sin-cambio-de-unidad', p) }),
  valor: realKm,
  cuenta: p => [Math.round(p.d * 2) / 2 * p.n, ':', 100000],
  porque: (p, i) => (i === 'en' ? `It is right: ${A(CM(p.d), i)} · ${N(p.n, i)} gives centimetres, then they are changed to km.`
    : `Está bien: ${A(CM(p.d), i)} · ${N(p.n, i)} da centímetros, y después se pasan a km.`),
};
const ESCALA_PRIMERO = {
  id: 'escala-primero', error: null,
  cadena(p) {
    const k1 = C(fraccion(p.n, 100000), 'km');
    return {
      lineas: [
        i => (i === 'en' ? `1 cm on the map is ${N(p.n, i)} cm = ${A(k1, i)}.` : `1 cm del plano son ${N(p.n, i)} cm = ${A(k1, i)}.`),
        i => `${N(dPlano(p), i)} · ${A(k1, i)} = ${A(realKm(p), i)}`,
      ],
    };
  },
  valor: realKm,
  cuenta: p => [Math.round(p.d * 2) / 2, '·', p.n / 100000],
  porque: (p, i) => (i === 'en' ? `It is right: first change what 1 cm on the map is worth to km, then multiply by ${N(dPlano(p), i)}.`
    : `Está bien: primero se pasa a km lo que vale 1 cm del plano y después se multiplica por ${N(dPlano(p), i)}.`),
};

/** Los porcentajes del ejercicio 1: los de las tres plantillas de porcentaje juntos (cada error elige los suyos con `vale`). */
const PCT_COLUMNAS = [2, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80];

export const FAMILIAS = [
  {
    id: 'directa', base: 'razonar-sumando', peso: 3,
    params: rng => PL('razonar-sumando').params(rng),
    cota: () => true,   // las de `razonar-sumando`: de 2 a 5 unidades, hasta 30, y el precio de cada cosa
    bien: [DIRECTA_FACTOR, DIRECTA_UNIDAD, DIRECTA_REGLA],
    mal: [dePlantilla('razonar-sumando'), DIRECTA_INVERSA, DIRECTA_PRECIO_DE_UNO],
  },
  {
    id: 'porcentaje', base: 'porcentaje-entre-mil', peso: 3,
    params: rng => ({ ctx: rng.entero(0, CONTEXTOS_PORCENTAJE.length - 1), p: rng.elegir(PCT_COLUMNAS), c: rng.elegir(multiplos(20, 100, 800)) }),
    // Un centro de 100 a 800 alumnos y una clase que recauda de 100 a 800 €; alumnos enteros, dinero al céntimo.
    cota: p => decimales(bienPorcentaje(p)) <= (CONTEXTOS_PORCENTAJE[p.ctx].unidad ? 2 : 0),
    bien: [PCT_DECIMAL, PCT_UNO_POR_CIENTO, PCT_PRODUCTO],
    // Como en las plantillas: 20 % = 0,02 con porcentajes de dos cifras, 5 % = 0,5 con los de una, y 150 : 20 desde el 20 %.
    mal: [dePlantilla('porcentaje-entre-mil', p => p.p >= 10), dePlantilla('porcentaje-entre-diez', p => p.p < 10),
      dePlantilla('dividir-entre-el-porcentaje', p => p.p >= 20), PCT_SIN_DIVIDIR],
  },
  {
    id: 'descuento', base: 'restar-el-porcentaje-como-numero', peso: 2,
    // Ropa, mochilas y relojes de 20 a 150 € con descuentos del 10 al 60 %.
    params: rng => ({ art: rng.entero(0, ARTICULOS.length - 1), p: rng.elegir([10, 15, 20, 25, 30, 40, 50, 60]), c: rng.elegir(multiplos(10, 20, 150)) }),
    cota: p => decimales(descuento(p).final) <= 2,
    bien: [DESC_RESTANDO, DESC_LO_QUE_SE_PAGA],
    mal: [dePlantilla('restar-el-porcentaje-como-numero', p => p.c > p.p), dePlantilla('descuento-por-precio-final'), DESC_SUMANDO],
  },
  {
    id: 'escala', base: 'escala-sin-cambio-de-unidad', peso: 1,
    params: rng => PL('escala-sin-cambio-de-unidad').params(rng),
    // Desde el 23-11 el enunciado cambia de contexto con la escala (`enunciadoEscala`): el instituto y la biblioteca
    // de 0,2 a 3,75 km en un plano de la ciudad, y dos pueblos de 1 a 30 km. Ya no hace falta la cota de 1 km.
    cota: p => decimales(realKm(p)) <= 2 && valorNum(realKm(p)) <= 30,
    bien: [ESCALA_AL_FINAL, ESCALA_PRIMERO],
    mal: [dePlantilla('escala-sin-cambio-de-unidad')],
  },
];
export const FAMILIA_POR_ID = Object.fromEntries(FAMILIAS.map(fa => [fa.id, fa]));
const SORTEO = FAMILIAS.flatMap(fa => Array(fa.peso).fill(fa));

/**
 * Las columnas posibles de una familia con unos números: { bien: [...], mal: [...] }, cada una { ruta, lineas (con
 * el enunciado, en {es, en}), falsa, error, porque, corregida }, sin dos iguales ni dos con el mismo error. Las
 * buenas acaban en el resultado bueno y las malas en otro, exacto y con dos decimales como mucho.
 */
export function columnasPosibles(familia, p) {
  const base = PL(familia.base), bien = base.bien(p), enunciado = base.cadena(p, false).lineas[0];
  const vistas = new Set(), errores = new Set();
  const columna = r => {
    if (r.vale && !r.vale(p)) return null;
    let cadena, valor;
    try { cadena = r.cadena(p); valor = r.valor(p); } catch { return null; }
    if (!valor || !valor.esExacta() || decimales(valor) > 2 || mismoValor(valor, bien) === Boolean(r.error)) return null;
    const lineas = [enunciado, ...cadena.lineas].map(L), k = JSON.stringify(lineas);
    if (vistas.has(k)) return null;
    vistas.add(k);
    return {
      ruta: r.id, lineas, falsa: r.error ? cadena.falsa : null, error: r.error,
      porque: L(i => r.porque(p, i)), corregida: r.error ? L(r.corregida(p)) : null,
    };
  };
  const buenas = familia.bien.map(columna).filter(Boolean);
  const malas = familia.mal.map(columna).filter(c => c && !errores.has(c.error) && errores.add(c.error));
  return { bien: buenas, mal: malas };
}

/** El tipo de problema de cada error de las columnas: los distractores de una pregunta son de OTRO tipo. */
export const CLASE_COLUMNA = {
  'razonar-sumando': 'directa', 'inversa-en-directa': 'directa', 'contestar-otra-cosa': 'directa',
  'porcentaje-entre-mil': 'porcentaje', 'porcentaje-entre-diez': 'porcentaje', 'dividir-entre-el-porcentaje': 'porcentaje', 'porcentaje-sin-dividir': 'porcentaje',
  'restar-el-porcentaje-como-numero': 'descuento', 'descuento-por-precio-final': 'descuento', 'aumento-por-descuento': 'descuento',
  'escala-sin-cambio-de-unidad': 'escala',
};
/**
 * Nombres que nunca son distractor porque podrían describir columnas de otro tipo: «Ha contestado otra cosa» (dar
 * el descuento por el precio también lo es), «Ha restado donde había que sumar (o al revés)» y «La ha resuelto como
 * inversa» (150 : 20 en vez de 0,2 · 150 se podría leer así).
 */
export const NUNCA_DISTRACTOR = new Set(['contestar-otra-cosa', 'aumento-por-descuento', 'inversa-en-directa']);
/** Y los que no van con un error concreto: en «Se paga el 100 % + 20 %» ha sumado, aunque no «en vez de multiplicar». */
const NO_PARA = { 'aumento-por-descuento': ['razonar-sumando'] };

/** ¿Daría el error `d` la línea mala de la columna? Solo «20 % de 50,00 € = 20,00 €» parece un porcentaje mal calculado. */
function podriaSer(d, c, p) {
  if (c.error !== 'restar-el-porcentaje-como-numero' || CLASE_COLUMNA[d] !== 'porcentaje') return false;
  const v = E[d].fn(p.p, C(p.c, '€'));
  return v !== null && mismoValor(v, C(p.p, '€'));
}

/** Los distractores posibles de la pregunta de una columna mala. */
export const distractoresDe = (c, p) => Object.keys(CLASE_COLUMNA).filter(d => CLASE_COLUMNA[d] !== CLASE_COLUMNA[c.error]
  && !NUNCA_DISTRACTOR.has(d) && !(NO_PARA[c.error] ?? []).includes(d) && !podriaSer(d, c, p));

/** Las LETRAS de las columnas. */
export const LETRAS = ['A', 'B', 'C', 'D'];

// ─── El fallo de cuenta (JL, 23-11) ─────────────────────────────────────────────
//
// Un error que no está en el catálogo, así que no tiene nombre y su columna no lleva pregunta tipo test: una ruta
// buena que no sale en el ítem, con la última cuenta mal hecha. El resultado queda cerca del bueno y es creíble en
// su contexto (en euros, 10 céntimos o un euro; en alumnos, uno o dos; en km, una décima o un kilómetro), y nunca es
// lo que daría un error con nombre: ni el resultado de otra columna posible, ni el de un error del catálogo con los
// números del problema, ni la última cuenta con otra operación («3 · 2,00 € = 5,00 €» es «ha sumado en vez de
// multiplicar»), ni un número que ya sale en la columna («ha contestado otra cosa»).

export const CUENTA = 'fallo-de-cuenta';
/** Lo que se aparta del bueno, en la unidad del resultado (null: alumnos). */
const CERCANOS = { '€': [1, -1, 0.1, -0.1], null: [1, -1, 2, -2], km: [0.1, -0.1, 1, -1] };
const centesimas = x => Math.round((typeof x === 'number' ? x : valorNum(x)) * 100);

/** Errores del catálogo que no son columnas, pero que con los números del problema dan un resultado con nombre. */
const OTROS_CON_NOMBRE = {
  descuento: p => [E['sumar-el-porcentaje-como-numero'].fn(C(p.c, '€'), p.p), E['precio-final-por-descuento'].fn(C(p.c, '€'), p.p)],
  escala: p => [E['escala-al-reves'].fn(CM(p.d), p.n, 'realidad', 'km'), E['subir-por-bajar'].fn(C(fraccion(Math.round(p.d * 2) * p.n, 2), 'cm'), 'km')],
};

const OPERAR = { '+': (a, b) => a + b, '−': (a, b) => a - b, '·': (a, b) => a * b, ':': (a, b) => a / b };
/** La cuenta `[a, op, b, op, c…]` de izquierda a derecha y, con tres números, también agrupando los dos últimos. */
function evaluaciones(t) {
  let v = t[0];
  for (let k = 1; k < t.length; k += 2) v = OPERAR[t[k]](v, t[k + 1]);
  return t.length === 5 ? [v, OPERAR[t[1]](t[0], OPERAR[t[3]](t[2], t[4]))] : [v];
}
/** Lo que da la última cuenta con una operación cambiada (o la división al revés), y el bueno por o entre 10, 100 y 1000. */
function cuentasConNombre(t, bien) {
  const valores = [bien * 10, bien / 10, bien * 100, bien / 100, bien * 1000, bien / 1000];
  for (let k = 1; k < t.length; k += 2) {
    for (const op of Object.keys(OPERAR)) if (op !== t[k]) valores.push(...evaluaciones([...t.slice(0, k), op, ...t.slice(k + 1)]));
    if (t[k] === ':') valores.push(...evaluaciones([...t.slice(0, k - 1), t[k + 1], ':', t[k - 1], ...t.slice(k + 2)]));
  }
  return valores;
}
/** Los números que salen en unas líneas (en español: «150 000», «6,00», «0,2»). */
const numerosDe = lineas => lineas.flatMap(l => [...l.es.replace(/[   ]/g, ' ').replace(/(\d) (?=\d{3}(?!\d))/g, '$1')
  .matchAll(/\d+(?:,\d+)?/g)].map(m => Number(m[0].replace(',', '.'))));

/**
 * La columna del fallo de cuenta, sacada de la primera de `libres` (columnas buenas que no salen en el ítem) que
 * tenga un resultado cercano seguro; null si ninguna lo tiene (ese ítem va sin fallo de cuenta).
 */
function columnaDeCuenta(rng, familia, p, libres) {
  const nombrados = [...familia.bien, ...familia.mal].map(r => { try { return r.valor(p); } catch { return null; } });
  nombrados.push(...(OTROS_CON_NOMBRE[familia.id]?.(p) ?? []));
  const conNombre = nombrados.filter(v => v && !Array.isArray(v)).map(centesimas);
  for (const origen of libres) {
    const r = familia.bien.find(x => x.id === origen.ruta), bien = r.valor(p), cent = centesimas(bien), t = r.cuenta(p);
    // Sin los números de la última cuenta no se puede comprobar que el fallo no tenga nombre: esa ruta no vale.
    if (!t.every((x, k) => (k % 2 ? x in OPERAR : Number.isFinite(x)))) continue;
    const prohibidos = new Set([...conNombre, ...cuentasConNombre(t, valorNum(bien)).map(centesimas), ...numerosDe(origen.lineas).map(centesimas)]);
    const posibles = CERCANOS[bien.unidad].map(d => cent + Math.round(d * 100))
      .filter(x => x > 0 && Math.abs(x - cent) * 2 < cent && !prohibidos.has(x));
    const ultima = origen.lineas.at(-1), fin = i => ` = ${A(bien, i)}`;
    if (!posibles.length || !['es', 'en'].every(i => ultima[i].endsWith(fin(i)))) continue;
    const mal = C(fraccion(rng.elegir(posibles), 100), bien.unidad);
    const izq = i => ultima[i].slice(0, -fin(i).length);
    return {
      ruta: origen.ruta, lineas: [...origen.lineas.slice(0, -1), L(i => `${izq(i)} = ${A(mal, i)}`)], falsa: origen.lineas.length - 1, error: CUENTA,
      porque: L(i => `${izq(i)} = ${A(bien, i)}, ${i === 'en' ? 'not' : 'no'} ${A(mal, i)}.`), corregida: ultima,
      cuenta: { bien: cent / 100, mal: centesimas(mal) / 100 },
    };
  }
  return null;
}

/**
 * Ejercicio 1: el mismo problema en 2-4 columnas, 1-2 bien y 1-2 mal (como mucho una, con un fallo de cuenta). La
 * respuesta (`solucion`) es, por columna, el índice de la línea mala (contando el enunciado) o null; después, una
 * pregunta por cada columna mala con nombre, con el nombre bueno y dos de otro tipo de problema.
 */
export function generarDonde(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const familia = rng.elegir(SORTEO), p = familia.params(rng);
    if (esReservado(...PL(familia.base).caso(p)) || !familia.cota(p)) continue;
    const { bien, mal } = columnasPosibles(familia, p);
    if (!bien.length || !mal.length) continue;
    const dos = () => (rng.azar() < 0.6 ? 2 : 1);
    const buenas = rng.barajar(bien), nBien = Math.min(buenas.length, dos()), malas = rng.barajar(mal).slice(0, dos());
    const elegidas = [...buenas.slice(0, nBien), ...malas];
    // Con una sola columna mala con nombre, a veces otra con un fallo de cuenta, sacada de una ruta buena que no sale.
    if (malas.length === 1 && buenas.length > nBien && rng.azar() < 0.8) {
      const cuenta = columnaDeCuenta(rng, familia, p, buenas.slice(nBien));
      if (cuenta) elegidas.push(cuenta);
    }
    const columnas = rng.barajar(elegidas);
    // Pregunta tipo test solo para los errores con nombre: el fallo de cuenta no se puede nombrar (JL, 23-11).
    const preguntas = columnas.map((c, col) => ({ c, col })).filter(({ c }) => c.error && c.error !== CUENTA)
      .map(({ c, col }) => ({ col, opciones: rng.barajar([c.error, ...rng.barajar(distractoresDe(c, p)).slice(0, 2)]), solucion: c.error }));
    return {
      tipo: 'donde', plantilla: familia.base, familia: familia.id, params: p, enunciado: columnas[0].lineas[0], columnas, preguntas,
      solucion: columnas.map(c => c.falsa),
    };
  }
  throw new Error('generarDonde: no salen columnas');
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

export const claveItem = item => (item.columnas
  ? `${item.familia}|${JSON.stringify(item.params)}|${item.columnas.map(c => (c.error === CUENTA ? `${c.ruta}*${c.cuenta.mal}` : c.ruta)).join(',')}`
  : `${item.plantilla}|${JSON.stringify(item.params)}|${item.falsa ?? 'x'}`);

// ─── Pintar las líneas ─────────────────────────────────────────────────────────

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = s => String(s).replace(/[&<>]/g, c => ESCAPE[c]);
export const htmlLinea = (l, idioma) => esc(l[idioma]);
