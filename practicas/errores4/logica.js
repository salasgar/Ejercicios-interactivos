// Práctica «Caza el error» de la unidad 4 (PU2, tarea 107): lógica pura (sin DOM ni red).
// Los generadores devuelven DATOS: la base vuelve a montar el mismo ítem al cambiar de idioma.
//
// Cada plantilla es un error típico de `ERRORES_TIPICOS` (fracciones.js) con sus números:
//   L0   el enunciado (una expresión que `analizar` entiende: «1/2 + 1/3»)
//   bien el resultado bueno (Fraccion, irreducible)
//   mala las tres líneas del cálculo del compañero y cuál es la mala (`falsa`, 1 o 2): una línea
//        es FALSA cuando su valor no es el de la anterior; solo una lo es. La última línea es
//        el resultado que ve el alumno en los ejercicios 1 y 3.
// Los ejercicios comparten plantillas: el 1 enseña `L0 = último resultado` (verdadero con `bien`,
// falso con el de la línea mala; las comparaciones, `a < b`, solo aquí), el 2 enseña las tres
// líneas y el 3, la igualdad falsa.
//
// Ítem: { tipo: 'bien-mal' | 'linea' | 'arregla', plantilla, params, ... } (ver cada generador).

import { mcd, mcm } from '../_comun/aritmetica.js';
import {
  fraccion, aTexto, analizar, evaluar, html as htmlExpr, htmlFraccion, comparar, ERRORES_TIPICOS,
} from '../_comun/fracciones.js';

const f = fraccion;
const E = ERRORES_TIPICOS;
const err = (id, ...args) => E[id].fn(...args);

/** HTML de una expresión («1/2 + 1/3»), con raya de fracción. */
export const ex = e => htmlExpr(analizar(e));
/** HTML de una fracción suelta. */
export const fr = x => htmlFraccion(x);
const L = (es, en) => ({ es, en });

/**
 * Grupos de errores. Un error nunca es opción de otro del mismo grupo: en cada grupo hay nombres
 * que podrían describir también el cálculo malo del compañero (`1/2 + 1/3 = 2/6` es «multiplicar
 * los denominadores» y casi «sumar arriba y abajo»). Entre grupos distintos el nombre habla de
 * otra operación y es inequívocamente falso para ese ítem.
 */
export const GRUPOS = {
  suma: ['suma-arriba-y-abajo', 'suma-multiplicando-denominadores'],
  simplificar: ['simplifica-solo-numerador', 'simplifica-solo-denominador'],
  deCantidad: ['se-queda-en-la-unitaria', 'multiplica-por-el-denominador', 'fraccion-de-al-reves'],
  division: ['invierte-la-primera', 'no-invierte', 'invierte-las-dos'],
  potencia: ['eleva-solo-el-numerador'],
  signo: ['signo-perdido', 'ignora-el-signo', 'compara-solo-numeradores', 'compara-solo-denominadores'],
};
export const GRUPO_DE = Object.fromEntries(Object.entries(GRUPOS).flatMap(([g, ids]) => ids.map(id => [id, g])));

// ─── Ayudas para los números ────────────────────────────────────────────────────

const coprimos = (a, b) => mcd(a, b) === 1;
/** Fracción propia irreducible con denominador en `dens` (y numerador ≥ `minNum`). */
function propia(rng, dens, minNum = 1) {
  for (let i = 0; i < 100; i++) {
    const q = rng.elegir(dens), p = rng.entero(minNum, q - 1);
    if (p >= minNum && p < q && coprimos(p, q)) return f(p, q);
  }
  return null;
}
const par = x => `${x.num}/${x.den}`;
/** Dos fracciones de denominadores distintos y su denominador común: { a, b, m, A, B }. */
function dosDistintas(rng, dens = [2, 3, 4, 5, 6, 8]) {
  const a = propia(rng, dens), b = propia(rng, dens);
  if (!a || !b || a.den === b.den) return null;
  const m = mcm(a.den, b.den);
  return { a, b, m, A: a.num * (m / a.den), B: b.num * (m / b.den) };
}
const noEntera = x => x.den !== 1;

// ─── Plantillas ────────────────────────────────────────────────────────────────

const txt = x => aTexto(x);

export const PLANTILLAS = [
  // — Sumas y restas —
  {
    id: 'suma-arriba-y-abajo', error: 'suma-arriba-y-abajo',
    numeros(rng) { const d = dosDistintas(rng); return d && noEntera(d.a.sumar(d.b).simplificar()) ? [d.a.num, d.a.den, d.b.num, d.b.den] : null; },
    l0: ([p, q, r, s]) => `${p}/${q} + ${r}/${s}`,
    bien: ([p, q, r, s]) => f(p, q).sumar(f(r, s)).simplificar(),
    mala([p, q, r, s]) {
      const m = mcm(q, s), A = p * (m / q), B = r * (m / s);
      return { lineas: [`${p}/${q} + ${r}/${s}`, `${A}/${m} + ${B}/${m}`, txt(err('suma-arriba-y-abajo', f(A, m), f(B, m)))], falsa: 2 };
    },
    corregida: p => txt(PLANTILLAS[0].bien(p)),
    porque([p, q, r, s]) {
      const m = mcm(q, s), A = p * (m / q), B = r * (m / s);
      return L(`${ex(`${A}/${m} + ${B}/${m}`)}: con el mismo denominador, el denominador no se suma, se queda en ${m}. Se suman solo los numeradores, ${A} + ${B} = ${A + B}, y sale ${ex(txt(f(A + B, m).simplificar()))}.`,
        `${ex(`${A}/${m} + ${B}/${m}`)}: with the same denominator, the denominators are not added; the denominator stays ${m}. Only the numerators are added, ${A} + ${B} = ${A + B}, and the result is ${ex(txt(f(A + B, m).simplificar()))}.`);
    },
  },
  {
    id: 'signo-perdido', error: 'signo-perdido',
    numeros(rng) {
      const d = dosDistintas(rng);
      return d && comparar(d.a, d.b) < 0 && noEntera(d.a.restar(d.b).simplificar()) ? [d.a.num, d.a.den, d.b.num, d.b.den] : null;
    },
    l0: ([p, q, r, s]) => `${p}/${q} − ${r}/${s}`,
    bien: ([p, q, r, s]) => f(p, q).restar(f(r, s)).simplificar(),
    mala([p, q, r, s]) {
      const m = mcm(q, s), A = p * (m / q), B = r * (m / s);
      return { lineas: [`${p}/${q} − ${r}/${s}`, `${A}/${m} − ${B}/${m}`, txt(err('signo-perdido', f(p, q).restar(f(r, s)).simplificar()))], falsa: 2 };
    },
    corregida: p => txt(PLANTILLAS[1].bien(p)),
    porque([p, q, r, s]) {
      const m = mcm(q, s), A = p * (m / q), B = r * (m / s), d = f(p, q).restar(f(r, s)).simplificar();
      return L(`${ex(`${A}/${m} − ${B}/${m}`)}: ${A} es menor que ${B}, así que el resultado es negativo: ${A} − ${B} = −${B - A}. Sale ${ex(txt(d))}, con el menos delante.`,
        `${ex(`${A}/${m} − ${B}/${m}`)}: ${A} is less than ${B}, so the result is negative: ${A} − ${B} = −${B - A}. It is ${ex(txt(d))}, with the minus sign in front.`);
    },
  },
  {
    id: 'suma-multiplicando-denominadores', error: 'suma-multiplicando-denominadores',
    numeros(rng) {
      const d = dosDistintas(rng, [2, 3, 4, 5, 6]);
      if (!d || !noEntera(d.a.sumar(d.b).simplificar())) return null;
      const mal = err('suma-multiplicando-denominadores', d.a, d.b);
      return mal && !mal.esIrreducible() ? [d.a.num, d.a.den, d.b.num, d.b.den] : null;
    },
    l0: ([p, q, r, s]) => `${p}/${q} + ${r}/${s}`,
    bien: ([p, q, r, s]) => f(p, q).sumar(f(r, s)).simplificar(),
    mala([p, q, r, s]) {
      const mal = err('suma-multiplicando-denominadores', f(p, q), f(r, s));
      return { lineas: [`${p}/${q} + ${r}/${s}`, par(mal), txt(mal.simplificar())], falsa: 1 };
    },
    corregida([p, q, r, s]) { const m = mcm(q, s); return `${p * (m / q)}/${m} + ${r * (m / s)}/${m}`; },
    porque([p, q, r, s]) {
      const m = mcm(q, s), A = p * (m / q), B = r * (m / s);
      return L(`${ex(`${p}/${q} + ${r}/${s}`)}: los denominadores no se multiplican. Hay que ponerlos iguales, con denominador ${m}: ${ex(`${A}/${m} + ${B}/${m}`)} = ${ex(txt(f(p, q).sumar(f(r, s)).simplificar()))}.`,
        `${ex(`${p}/${q} + ${r}/${s}`)}: the denominators are not multiplied. They have to be made equal, with denominator ${m}: ${ex(`${A}/${m} + ${B}/${m}`)} = ${ex(txt(f(p, q).sumar(f(r, s)).simplificar()))}.`);
    },
  },

  // — Simplificar —
  simplifica('simplifica-solo-numerador', (n, d, p) => err('simplifica-solo-numerador', f(n, d), p), (n, d, p) => `${n / p}/${d}`,
    (n, d, p, mal) => L(`${ex(`${n}/${d}`)}: al simplificar se divide entre ${p} el numerador y también el denominador: ${ex(`${n / p}/${d / p}`)}. Dividir solo uno de los dos cambia la fracción.`,
      `${ex(`${n}/${d}`)}: when you simplify, you divide the numerator and also the denominator by ${p}: ${ex(`${n / p}/${d / p}`)}. Dividing only one of them changes the fraction.`)),
  simplifica('simplifica-solo-denominador', (n, d, p) => err('simplifica-solo-denominador', f(n, d), p), (n, d, p) => `${n}/${d / p}`,
    (n, d, p) => L(`${ex(`${n}/${d}`)}: al simplificar se divide entre ${p} el denominador y también el numerador: ${ex(`${n / p}/${d / p}`)}. Dividir solo uno de los dos cambia la fracción.`,
      `${ex(`${n}/${d}`)}: when you simplify, you divide the denominator and also the numerator by ${p}: ${ex(`${n / p}/${d / p}`)}. Dividing only one of them changes the fraction.`)),

  // — La fracción de una cantidad —
  {
    id: 'se-queda-en-la-unitaria', error: 'se-queda-en-la-unitaria', natural: true,
    numeros(rng) {
      const d = rng.elegir([3, 4, 5, 6, 8, 10]), p = propia2(rng, d);
      return p ? [p, d, d * rng.entero(2, Math.floor(100 / d))] : null;
    },
    l0: ([p, d, n]) => `${p}/${d} · ${n}`,
    bien: ([p, d, n]) => f(p, d).multiplicar(n).simplificar(),
    mala([p, d, n]) { return { lineas: [`${p}/${d} · ${n}`, `${n} : ${d}`, `${n / d}`], falsa: 1 }; },
    corregida: ([p, d, n]) => `${n} : ${d} · ${p}`,
    porque: ([p, d, n]) => L(`${ex(`${p}/${d} · ${n}`)}: primero ${n} : ${d} = ${n / d} (una parte), y hay que tomar ${p} partes: ${n / d} · ${p} = ${n / d * p}. Dividir entre ${d} no basta.`,
      `${ex(`${p}/${d} · ${n}`)}: first ${n} : ${d} = ${n / d} (one part), and you need ${p} parts: ${n / d} · ${p} = ${n / d * p}. Dividing by ${d} is not enough.`),
  },
  {
    id: 'multiplica-por-el-denominador', error: 'multiplica-por-el-denominador', natural: true,
    numeros(rng) { const d = rng.elegir([3, 4, 5, 6, 8, 10]); return [1, d, d * rng.entero(2, Math.floor(60 / d))]; },
    l0: ([p, d, n]) => `${p}/${d} · ${n}`,
    bien: ([p, d, n]) => f(p, d).multiplicar(n).simplificar(),
    mala([p, d, n]) { return { lineas: [`${p}/${d} · ${n}`, `${n} · ${d}`, `${n * d}`], falsa: 1 }; },
    corregida: ([, d, n]) => `${n} : ${d}`,
    porque: ([, d, n]) => L(`${ex(`1/${d} · ${n}`)}: una parte de ${d} iguales de ${n} es ${n} : ${d} = ${n / d}. Multiplicar por ${d} daría más que el total (${n * d}).`,
      `${ex(`1/${d} · ${n}`)}: one part out of ${d} equal parts of ${n} is ${n} : ${d} = ${n / d}. Multiplying by ${d} would give more than the whole (${n * d}).`),
  },
  {
    id: 'fraccion-de-al-reves', error: 'fraccion-de-al-reves', natural: true,
    numeros(rng) {
      const d = rng.elegir([3, 4, 5, 6, 8]), p = propia2(rng, d);
      if (!p) return null;
      const m = mcm(p, d), k = rng.entero(1, Math.floor(120 / m));
      return k >= 1 && m * k >= 2 * d ? [p, d, m * k] : null;
    },
    l0: ([p, d, n]) => `${p}/${d} · ${n}`,
    bien: ([p, d, n]) => f(p, d).multiplicar(n).simplificar(),
    mala([p, d, n]) { return { lineas: [`${p}/${d} · ${n}`, `${n} : ${p} · ${d}`, `${n / p * d}`], falsa: 1 }; },
    corregida: ([p, d, n]) => `${n} : ${d} · ${p}`,
    porque: ([p, d, n]) => L(`${ex(`${p}/${d} · ${n}`)}: se divide entre el denominador y se multiplica por el numerador: ${n} : ${d} · ${p} = ${n / d} · ${p} = ${n / d * p}. Al revés (${n} : ${p} · ${d}) sale ${n / p * d}, más que ${n}.`,
      `${ex(`${p}/${d} · ${n}`)}: you divide by the denominator and multiply by the numerator: ${n} : ${d} · ${p} = ${n / d} · ${p} = ${n / d * p}. The other way round (${n} : ${p} · ${d}) gives ${n / p * d}.`),
  },

  // — Cociente —
  division('invierte-la-primera', (a, b) => a.inversa().multiplicar(b), (a, b) => `${txt(a.inversa())} · ${txt(b)}`,
    (a, b) => L(`${ex(`${txt(a)} : ${txt(b)}`)}: se invierte la segunda fracción, la que divide: ${ex(`${txt(a)} · ${txt(b.inversa())}`)}. La primera se queda como está.`,
      `${ex(`${txt(a)} : ${txt(b)}`)}: you turn the second fraction upside down, the one you divide by: ${ex(`${txt(a)} · ${txt(b.inversa())}`)}. The first one stays as it is.`)),
  division('no-invierte', (a, b) => a.multiplicar(b), (a, b) => `${txt(a)} · ${txt(b)}`,
    (a, b) => L(`${ex(`${txt(a)} : ${txt(b)}`)}: dividir es multiplicar por la inversa de la segunda: ${ex(`${txt(a)} · ${txt(b.inversa())}`)}. Si no se le da la vuelta, es un producto.`,
      `${ex(`${txt(a)} : ${txt(b)}`)}: dividing is multiplying by the reciprocal of the second one: ${ex(`${txt(a)} · ${txt(b.inversa())}`)}. If you do not turn it upside down, it is a product.`)),
  division('invierte-las-dos', (a, b) => a.inversa().multiplicar(b.inversa()), (a, b) => `${txt(a.inversa())} · ${txt(b.inversa())}`,
    (a, b) => L(`${ex(`${txt(a)} : ${txt(b)}`)}: solo se invierte la segunda: ${ex(`${txt(a)} · ${txt(b.inversa())}`)}. La primera no se toca.`,
      `${ex(`${txt(a)} : ${txt(b)}`)}: only the second one is turned upside down: ${ex(`${txt(a)} · ${txt(b.inversa())}`)}. The first one is not touched.`)),

  // — Potencias de base positiva —
  {
    id: 'eleva-solo-el-numerador', error: 'eleva-solo-el-numerador',
    numeros(rng) {
      const b = propia(rng, [3, 4, 5, 6], 2);
      return b ? [b.num, b.den, rng.azar() < 0.8 ? 2 : 3] : null;
    },
    l0: ([p, q, n]) => `(${p}/${q})^${n}`,
    bien: ([p, q, n]) => f(p, q).potencia(n),
    mala([p, q, n]) { return { lineas: [`(${p}/${q})^${n}`, Array(n).fill(`${p}/${q}`).join(' · '), txt(err('eleva-solo-el-numerador', f(p, q), n))], falsa: 2 }; },
    corregida: p => txt(PLANTILLAS.find(t => t.id === 'eleva-solo-el-numerador').bien(p)),
    porque: ([p, q, n]) => L(`${ex(`(${p}/${q})^${n}`)}: el exponente afecta al numerador y al denominador: ${ex(Array(n).fill(`${p}/${q}`).join(' · '))} = ${ex(`${p ** n}/${q ** n}`)}. Elevar solo el numerador da ${ex(`${p ** n}/${q}`)}.`,
      `${ex(`(${p}/${q})^${n}`)}: the power affects the numerator and the denominator: ${ex(Array(n).fill(`${p}/${q}`).join(' · '))} = ${ex(`${p ** n}/${q ** n}`)}. Raising only the numerator gives ${ex(`${p ** n}/${q}`)}.`),
  },
];
export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));

/** Numerador propio (2 ≤ p < d, coprimo con d) para «la fracción de una cantidad». */
function propia2(rng, d) {
  const ps = [];
  for (let p = 2; p < d; p++) if (coprimos(p, d)) ps.push(p);
  return ps.length ? rng.elegir(ps) : null;
}

/**
 * Plantilla de simplificar: f = n/d con m.c.d. g compuesto (4, 6, 9, 10 o 12) y p el menor primo de g;
 * el compañero divide solo uno de los términos entre p y deja una fracción que aún se puede simplificar.
 */
function simplifica(id, malo, lineaUno, porque) {
  const soloNum = id === 'simplifica-solo-numerador';
  return {
    id, error: id,
    numeros(rng) {
      const g = rng.elegir([4, 6, 9, 10, 12]), p = [2, 3].find(x => g % x === 0);
      const u = rng.entero(1, 7), v = rng.entero(2, 8);
      if (!coprimos(u, v) || u * g > 90 || v * g > 90) return null;
      const n = u * g, d = v * g, mal = malo(n, d, p);
      return mal && !mal.esIrreducible() && noEntera(f(n, d).simplificar()) ? [n, d, p] : null;
    },
    l0: ([n, d]) => `${n}/${d}`,
    bien: ([n, d]) => f(n, d).simplificar(),
    mala([n, d, p]) { const mal = malo(n, d, p); return { lineas: [`${n}/${d}`, par(mal), txt(mal.simplificar())], falsa: 1 }; },
    corregida: ([n, d, p]) => `${n / p}/${d / p}`,
    porque: ([n, d, p]) => porque(n, d, p, soloNum),
  };
}

/** Plantilla de cociente a : b con las dos fracciones propias y de denominadores ≥ 2. */
function division(id, malo, lineaUno, porque) {
  return {
    id, error: id,
    numeros(rng) {
      const a = propia(rng, [2, 3, 4, 5, 6], 1), b = propia(rng, [2, 3, 4, 5, 6], 1);
      if (!a || !b || a.equals(b)) return null;
      const bien = a.dividir(b).simplificar();
      const mal = malo(a, b);
      return noEntera(bien) && noEntera(mal.simplificar()) && !bien.equals(mal) && a.num > 1 && b.num > 1 ? [a.num, a.den, b.num, b.den] : null;
    },
    l0: ([p, q, r, s]) => `${p}/${q} : ${r}/${s}`,
    bien: ([p, q, r, s]) => f(p, q).dividir(f(r, s)).simplificar(),
    mala([p, q, r, s]) {
      const a = f(p, q), b = f(r, s);
      return { lineas: [`${p}/${q} : ${r}/${s}`, lineaUno(a, b), txt(malo(a, b).simplificar())], falsa: 1 };
    },
    corregida: ([p, q, r, s]) => `${p}/${q} · ${s}/${r}`,
    porque: ([p, q, r, s]) => porque(f(p, q), f(r, s)),
  };
}

// ─── Comparaciones (solo ejercicio 1) ──────────────────────────────────────────

export const COMPARACIONES = [
  { id: 'compara-solo-numeradores', numeros(rng) { return par2(rng, [3, 4, 5, 6, 7, 8], false); } },
  { id: 'compara-solo-denominadores', numeros(rng) { return par2(rng, [3, 4, 5, 6, 7, 8], false); } },
  { id: 'ignora-el-signo', numeros(rng) { return par2(rng, [3, 4, 5, 6, 7], true); } },
].map(c => ({ ...c, error: c.id, comparacion: true }));
export const COMPARACION_POR_ID = Object.fromEntries(COMPARACIONES.map(c => [c.id, c]));
const REL = { '-1': '<', '0': '=', '1': '>' };
const relDe = c => REL[String(c)];

/** Dos fracciones propias [p, q, r, s] (negativas las dos si `neg`) que no valen lo mismo. */
function par2(rng, dens, neg) {
  const a = propia(rng, dens), b = propia(rng, dens);
  if (!a || !b || a.equals(b)) return null;
  return neg ? [-a.num, a.den, -b.num, b.den] : [a.num, a.den, b.num, b.den];
}
const cmpFr = ([p, q, r, s]) => [f(p, q), f(r, s)];

/** La relación equivocada de la comparación (o null si el error da lo mismo que la buena). */
export function relacionMala(id, params) {
  const [a, b] = cmpFr(params);
  const c = err(id, a, b);
  return c === null ? null : relDe(c);
}
export const relacionBuena = params => { const [a, b] = cmpFr(params); return relDe(comparar(a, b)); };

export function porqueComparacion(id, params) {
  const [a, b] = cmpFr(params);
  const T = x => ex(txt(x));
  const bien = comparar(a, b);
  const gana = bien < 0 ? b : a, pierde = bien < 0 ? a : b;
  const comun = a.den === b.den ? null : mcm(a.den, b.den);
  const [A, B] = comun ? [a.num * (comun / a.den), b.num * (comun / b.den)] : [a.num, b.num];
  const enComun = comun ? ex(`${A}/${comun}`) + ' ' + relDe(bien).replace('<', '&lt;').replace('>', '&gt;') + ' ' + ex(`${B}/${comun}`) : '';
  if (id === 'ignora-el-signo') {
    return L(`${T(a)} y ${T(b)} son negativas: ${T(gana)} está más cerca del 0, así que es la mayor. ${enComun ? `Con el mismo denominador: ${enComun}.` : ''}`,
      `${T(a)} and ${T(b)} are negative: ${T(gana)} is closer to 0, so it is the greater. ${enComun ? `With the same denominator: ${enComun}.` : ''}`);
  }
  return L(`${T(a)} y ${T(b)}: para comparar hay que mirar los dos términos, no solo uno. ${enComun ? `Con el mismo denominador: ${enComun}.` : ''}`,
    `${T(a)} and ${T(b)}: to compare you have to look at both terms, not only one. ${enComun ? `With the same denominator: ${enComun}.` : ''}`);
}

// ─── Generadores ───────────────────────────────────────────────────────────────

function conParams(plantilla, rng) {
  for (let i = 0; i < 400; i++) {
    const params = plantilla.numeros(rng);
    if (params) return params;
  }
  throw new Error(`La plantilla «${plantilla.id}» no encuentra números`);
}

/** El último resultado de la línea mala (lo que ve el alumno en la igualdad falsa). */
const ultima = lineas => lineas.at(-1);

/** Tres nombres de error: el bueno y dos de otros grupos. */
export function opcionesDeNombre(rng, error) {
  const posibles = Object.values(GRUPOS).flat().filter(id => GRUPO_DE[id] !== GRUPO_DE[error]);
  return rng.barajar([error, ...rng.barajar(posibles).slice(0, 2)]);
}

/** Ejercicio 1: ¿bien o mal? Mitad verdaderas. Comparaciones: una de cada cinco ítems. */
export function generarBienMal(rng) {
  const verdadera = rng.azar() < 0.5;
  if (rng.azar() < 0.2) {
    const c = rng.elegir(COMPARACIONES);
    let params, mal;
    for (let i = 0; i < 400; i++) {
      params = conParams(c, rng);
      mal = relacionMala(c.id, params);
      if (mal !== null) break;
    }
    const [a, b] = cmpFr(params);
    return {
      tipo: 'bien-mal', plantilla: c.id, params, izq: txt(a), der: txt(b),
      rel: verdadera ? relacionBuena(params) : mal, verdadera,
      error: verdadera ? null : c.id, opciones: verdadera ? null : opcionesDeNombre(rng, c.id),
      solucion: verdadera ? 'verdadera' : c.id,
    };
  }
  const p = rng.elegir(PLANTILLAS);
  const params = conParams(p, rng);
  const mala = p.mala(params);
  return {
    tipo: 'bien-mal', plantilla: p.id, params, izq: p.l0(params), rel: '=',
    der: verdadera ? txt(p.bien(params)) : ultima(mala.lineas), verdadera,
    error: verdadera ? null : p.error, opciones: verdadera ? null : opcionesDeNombre(rng, p.error),
    solucion: verdadera ? 'verdadera' : p.error,
  };
}

/** Ejercicio 2: la línea mala. Tres líneas, una falsa (la 2 o la 3). */
export function generarLinea(rng) {
  const p = rng.elegir(PLANTILLAS);
  const params = conParams(p, rng);
  const { lineas, falsa } = p.mala(params);
  return { tipo: 'linea', plantilla: p.id, params, lineas, falsa, error: p.error, opciones: lineas.map((_, i) => i), solucion: falsa };
}

/** Ejercicio 3: arréglalo. La igualdad falsa y el alumno escribe el resultado bueno. */
export function generarArregla(rng) {
  const p = rng.elegir(PLANTILLAS);
  const params = conParams(p, rng);
  const mala = p.mala(params);
  const bien = p.bien(params);
  return {
    tipo: 'arregla', plantilla: p.id, params, izq: p.l0(params), der: ultima(mala.lineas),
    bien: { num: bien.num, den: bien.den }, natural: Boolean(p.natural), error: p.error,
  };
}

/**
 * Corrige lo que escribe el alumno en el ejercicio 3. `respuesta` es una Fraccion (o null).
 * Devuelve { acierto, error } (error: id corto del tipo de fallo, solo si falla).
 */
export function corregirArregla(item, respuesta) {
  const bien = f(item.bien.num, item.bien.den);
  const mala = evaluar(analizar(item.der));
  if (respuesta.equals(bien) && respuesta.esIrreducible()) return { acierto: true, error: null };
  if (respuesta.equals(bien)) return { acierto: false, error: 'sin-simplificar' };
  if (respuesta.equals(mala)) return { acierto: false, error: 'repite-el-error' };
  return { acierto: false, error: 'otro-resultado' };
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = item => `${item.plantilla}|${item.params.join(',')}|${item.verdadera ?? ''}`;
