// «Las fichas de Pablo»: lógica pura (sin DOM ni red), para probarla con `npm test`.
//
// Un montón es un objeto { 2: a, 3: b, 5: c, 7: d, 11: e, 13: f } con exponentes enteros > 0
// (los colores que faltan no están): una ficha por cada factor primo de un número.
// verde = 2, azul = 3, amarilla = 5, roja = 7, y una ficha blanca con el número para el 11 y el 13.
// El 1 es «ninguna ficha» (el montón vacío). Los generadores devuelven DATOS (montones,
// listas de montones, índices), nunca HTML: la base vuelve a montar el mismo ítem al cambiar de idioma.
//
// Dos fichas del mismo color son indistinguibles: todo se compara por el número de fichas de
// cada color, nunca por posición.

import { factorizar } from '../_comun/aritmetica.js';

export const PRIMOS_FICHA = [2, 3, 5, 7, 11, 13];
export const PRIMOS_BASICOS = [2, 3, 5, 7];
/** Valor máximo de un montón que se toca o se construye de cabeza. */
export const TOPE_MONTON = 2000;
/** Valor máximo de un producto o un m.c.m. */
export const TOPE_GRANDE = 100000;
export const EXP_MAX = 3;
export const EXP_MAX_2 = 4;

// --- El montón ---------------------------------------------------------------------

export const exp = (m, p) => m?.[p] ?? 0;
export const limpiar = m => Object.fromEntries(PRIMOS_FICHA.filter(p => exp(m, p) > 0).map(p => [p, exp(m, p)]));
export const colores = m => PRIMOS_FICHA.filter(p => exp(m, p) > 0);
export const valor = m => PRIMOS_FICHA.reduce((v, p) => v * p ** exp(m, p), 1);
/** Un primo por ficha, de menor a mayor. */
export const fichas = m => PRIMOS_FICHA.flatMap(p => Array(exp(m, p)).fill(p));
export const nFichas = m => fichas(m).length;
export const expsDe = m => PRIMOS_FICHA.map(p => exp(m, p));
export const deExps = lista => limpiar(Object.fromEntries(PRIMOS_FICHA.map((p, i) => [p, lista[i] || 0])));
export const igual = (a, b) => PRIMOS_FICHA.every(p => exp(a, p) === exp(b, p));
export const claveMonton = m => expsDe(m).join('.');
const combina = (a, b, f) => limpiar(Object.fromEntries(PRIMOS_FICHA.map(p => [p, f(exp(a, p), exp(b, p))])));
/** Multiplicar: juntar las fichas. */
export const juntar = (a, b) => combina(a, b, (x, y) => x + y);
/** Dividir: quitar las fichas del divisor (solo tiene sentido si `contiene(a, b)`). */
export const quitar = (a, b) => combina(a, b, (x, y) => x - y);
/** ¿Tiene a tantas o más fichas de cada color que b? (a es divisible entre b) */
export const contiene = (a, b) => PRIMOS_FICHA.every(p => exp(a, p) >= exp(b, p));
/** m.c.d.: las fichas que tienen los dos (el menor número de cada color). */
export const comunes = (a, b) => combina(a, b, Math.min);
/** m.c.m.: el montón más pequeño que contiene a los dos (el mayor número de cada color). */
export const montonMinimo = (a, b) => combina(a, b, Math.max);
export const numeroDivisores = m => colores(m).reduce((n, p) => n * (exp(m, p) + 1), 1);

/** El montón de un número, o null si tiene algún primo que Pablo no tiene como ficha. */
export function deNumero(n) {
  if (!Number.isInteger(n) || n < 1) return null;
  const f = factorizar(n);
  if (f.some(([p]) => !PRIMOS_FICHA.includes(p))) return null;
  return limpiar(Object.fromEntries(f));
}

/** Todos los submontones de m (incluidos el vacío y el propio m). */
export function submontones(m) {
  let lista = [{}];
  for (const p of colores(m)) {
    lista = lista.flatMap(s => Array.from({ length: exp(m, p) + 1 }, (_, e) => ({ ...s, ...(e ? { [p]: e } : {}) })));
  }
  return lista.map(limpiar);
}

/** «2 · 2 · 2 · 5»: las fichas como producto (el 1 si no hay ninguna). */
export const productoFichas = m => (nFichas(m) ? fichas(m).join(' · ') : '1');

/** «2<sup>3</sup> · 5»: la forma de potencias, bases de menor a mayor («1» si no hay fichas). */
export function indice(m) {
  const cs = colores(m);
  if (!cs.length) return '1';
  return cs.map(p => (exp(m, p) === 1 ? `${p}` : `${p}<sup>${exp(m, p)}</sup>`)).join(' · ');
}

// --- Azar ---------------------------------------------------------------------------

const topeExp = (p, maxExp, max2) => (p === 2 ? max2 : p > 7 ? Math.min(maxExp, 2) : maxExp);

/**
 * Un montón al azar. `incluir` obliga a que un color esté; `valida` es una condición más.
 * Si en 500 intentos no sale ninguno, devuelve un montón sencillo (los tests lo vigilan).
 */
function montonAzar(rng, { primos = PRIMOS_BASICOS, colores: [cMin, cMax] = [1, 3], fichas: [fMin, fMax] = [1, 5], tope = TOPE_MONTON, maxExp = EXP_MAX, max2 = EXP_MAX_2, incluir = null, valida = () => true } = {}) {
  for (let i = 0; i < 500; i++) {
    const n = rng.entero(cMin, Math.min(cMax, primos.length));
    const resto = rng.barajar(primos.filter(p => p !== incluir));
    const elegidos = incluir ? [incluir, ...resto.slice(0, n - 1)] : resto.slice(0, n);
    const m = limpiar(Object.fromEntries(elegidos.map(p => [p, rng.entero(1, topeExp(p, maxExp, max2))])));
    const f = nFichas(m);
    if (f >= fMin && f <= fMax && valor(m) <= tope && valida(m)) return m;
  }
  return limpiar({ 2: 1, 3: 1, 5: 1 });
}

/** Un submontón de m con entre fMin y fMax fichas, o null si no hay. */
function submontonAzar(rng, m, [fMin, fMax]) {
  for (let i = 0; i < 300; i++) {
    const s = limpiar(Object.fromEntries(colores(m).map(p => [p, rng.entero(0, exp(m, p))])));
    const n = nFichas(s);
    if (n >= fMin && n <= fMax) return s;
  }
  return null;
}

/** Un color de los básicos en el que d ya agota a a (exp(d) === exp(a)): añadirle una ficha deja a d sin divisor en a. */
const colorQueFalta = (rng, a, d) => {
  const c = PRIMOS_BASICOS.filter(p => exp(d, p) === exp(a, p));
  return c.length ? rng.elegir(c) : null;
};

const una = p => ({ [p]: 1 });

// --- Ejercicio 1: lee las fichas -------------------------------------------------------

/** Ítem: { m }. Un 8 % sin ninguna ficha; un 10 % con una ficha blanca (11 o 13). */
export function generarLee(rng) {
  if (rng.azar() < 0.08) return { m: {} };
  const blanca = rng.azar() < 0.1 ? rng.elegir([11, 13]) : null;
  const m = montonAzar(rng, { primos: blanca ? [...PRIMOS_BASICOS, blanca] : PRIMOS_BASICOS, colores: [1, 3], fichas: [1, 5], incluir: blanca });
  return { m };
}

/** Diagnóstico de lo que ha escrito el alumno: { acierto, error? }. */
export function diagnosticarLee(item, n) {
  const m = item.m;
  if (n === valor(m)) return { acierto: true };
  if (!nFichas(m) && n === 0) return { acierto: false, error: 'ninguna-es-cero' };
  // 2³ leído como 2 · 3: cada potencia como el producto de su base y su exponente.
  if (n === colores(m).reduce((q, p) => q * p * exp(m, p), 1)) return { acierto: false, error: 'exponente-como-producto' };
  if (n === fichas(m).reduce((s, p) => s + p, 0)) return { acierto: false, error: 'suma-de-fichas' };
  if (n === nFichas(m)) return { acierto: false, error: 'numero-de-fichas' };
  return { acierto: false, error: 'lectura-mal' };
}

// --- Ejercicio 2: construye el montón ---------------------------------------------------

export const MAX_FICHAS_COLOR = 4;

/** Ítem: { m } con valor(m) entre 4 y 500, de 1 a 4 colores; un 10 % con 11 o 13. */
export function generarConstruye(rng) {
  const blanca = rng.azar() < 0.1 ? rng.elegir([11, 13]) : null;
  const m = montonAzar(rng, {
    primos: blanca ? [...PRIMOS_BASICOS, blanca] : PRIMOS_BASICOS,
    colores: [1, 4], fichas: [1, 8], tope: 500, incluir: blanca, valida: q => valor(q) >= 4,
  });
  return { m };
}

/** `st` es el montón que ha construido el alumno. */
export function diagnosticarConstruye(item, st) {
  const m = item.m;
  if (igual(st, m)) return { acierto: true };
  const leidoComoProducto = deNumero(colores(m).reduce((q, p) => q * p * exp(m, p), 1));
  if (leidoComoProducto && igual(st, leidoComoProducto)) return { acierto: false, error: 'potencia-como-producto' };
  const dif = PRIMOS_FICHA.filter(p => exp(st, p) !== exp(m, p));
  const faltan = dif.filter(p => exp(st, p) < exp(m, p)), sobran = dif.filter(p => exp(st, p) > exp(m, p));
  if (faltan.length && !sobran.length) return { acierto: false, error: 'faltan-fichas', color: faltan[0] };
  if (sobran.length && !faltan.length) return { acierto: false, error: 'sobran-fichas', color: sobran[0] };
  return { acierto: false, error: 'monton-equivocado', color: dif[0] };
}

// --- Ejercicio 3: multiplicar es juntar ---------------------------------------------------

export const FACTORES_ANADIR = [2, 3, 4, 5, 6, 9, 10];
export const MAX_FICHAS_PRODUCTO = 6;

/**
 * Cuatro montones pequeños para «¿qué fichas añade Pablo?»: el bueno y tres que salen de un error
 * con nombre (una ficha de más, una de menos, una ficha de otro color).
 */
function opcionesAnadir(rng, k) {
  const bueno = deNumero(k);
  const candidatos = [];
  for (const p of PRIMOS_BASICOS) candidatos.push({ m: juntar(bueno, una(p)), error: 'una-de-mas' });
  if (nFichas(bueno) >= 2) for (const p of colores(bueno)) candidatos.push({ m: quitar(bueno, una(p)), error: 'una-de-menos' });
  for (const p of colores(bueno)) {
    for (const q of PRIMOS_BASICOS.filter(x => x !== p)) candidatos.push({ m: juntar(quitar(bueno, una(p)), una(q)), error: 'otro-color' });
  }
  const vistos = new Set([claveMonton(bueno)]);
  const malos = [];
  for (const c of rng.barajar(candidatos)) {
    if (vistos.has(claveMonton(c.m))) continue;
    vistos.add(claveMonton(c.m));
    malos.push(c);
  }
  const todas = rng.barajar([{ m: bueno, error: null }, ...malos.slice(0, 3)]);
  return { opciones: todas.map(c => c.m), errores: todas.map(c => c.error), buena: todas.findIndex(c => c.error === null) };
}

/**
 * Ítem: { tipo: 'construir', a, b } (construir el montón de a · b; comparten algún color, así que el
 * producto no es ni el mayor ni el menor de cada color) o
 * { tipo: 'anadir', a, k, opciones, errores, buena } (¿qué fichas añade Pablo al multiplicar por k?).
 */
export function generarProducto(rng) {
  if (rng.azar() < 0.25) {
    const a = montonAzar(rng, { colores: [1, 3], fichas: [1, 5], tope: 500 });
    const k = rng.elegir(FACTORES_ANADIR);
    return { tipo: 'anadir', a, k, ...opcionesAnadir(rng, k) };
  }
  const dos = { colores: [2, 3], fichas: [2, 5], max2: EXP_MAX };
  const a = montonAzar(rng, dos);
  const b = montonAzar(rng, {
    ...dos,
    valida: q => !igual(q, a) && colores(q).some(p => exp(a, p) > 0) && valor(juntar(a, q)) <= TOPE_GRANDE,
  });
  return { tipo: 'construir', a, b };
}

export function diagnosticarProducto(item, st) {
  const { a, b } = item;
  const bueno = juntar(a, b);
  if (igual(st, bueno)) return { acierto: true };
  if (igual(st, montonMinimo(a, b))) return { acierto: false, error: 'monton-mayor' };
  if (igual(st, comunes(a, b))) return { acierto: false, error: 'solo-comunes' };
  const suma = deNumero(valor(a) + valor(b));
  if (suma && igual(st, suma)) return { acierto: false, error: 'suma-en-vez-de-producto' };
  const dif = PRIMOS_FICHA.filter(p => exp(st, p) !== exp(bueno, p));
  return { acierto: false, error: 'fichas-mal', color: dif[0] };
}

/** La opción elegida en la variante «añadir». */
export function diagnosticarAnadir(item, i) {
  return i === item.buena ? { acierto: true } : { acierto: false, error: item.errores[i] };
}

// --- Ejercicio 4: dividir es quitar ------------------------------------------------------------

/**
 * Ítem: { a, d, divide, falta }. En el 70 % d divide a a: hay que quitar las fichas de d.
 * En el 30 % no: a a le falta justo un color (falta) para tener las fichas de d.
 */
export function generarQuita(rng) {
  const divide = rng.azar() < 0.7;
  for (let i = 0; i < 500; i++) {
    const a = montonAzar(rng, { colores: [2, 4], fichas: [3, 9] });
    if (divide) {
      const d = submontonAzar(rng, a, [1, 3]);
      if (d && !igual(d, a)) return { a, d, divide: true, falta: null };
    } else {
      const base = submontonAzar(rng, a, [0, 2]);
      const c = base && colorQueFalta(rng, a, base);
      if (c) return { a, d: juntar(base, una(c)), divide: false, falta: c };
    }
  }
  const a = limpiar({ 2: 2, 3: 1, 5: 1 });
  return { a, d: limpiar({ 2: 1, 3: 1 }), divide: true, falta: null };
}

/**
 * Lo que contesta el alumno: { tipo: 'quita', q } (las fichas de a que ha quitado, como montón)
 * o { tipo: 'atasca', color } (Pablo se atasca y le falta ese color; null si aún no lo ha dicho).
 */
export function diagnosticarQuita(item, resp) {
  const { a, d } = item;
  if (item.divide) {
    if (resp.tipo === 'atasca') return { acierto: false, error: 'se-atasca-sin-motivo' };
    const q = resp.q;
    if (igual(q, d)) return { acierto: true };
    const mas = PRIMOS_FICHA.filter(p => exp(q, p) > exp(d, p)), menos = PRIMOS_FICHA.filter(p => exp(q, p) < exp(d, p));
    if (mas.length && !menos.length) return { acierto: false, error: 'quita-de-mas', color: mas[0] };
    if (menos.length && !mas.length) return { acierto: false, error: 'quita-de-menos', color: menos[0] };
    return { acierto: false, error: 'color-equivocado', color: mas[0] };
  }
  if (resp.tipo === 'quita') return { acierto: false, error: 'divide-lo-indivisible' };
  return resp.color === item.falta ? { acierto: true } : { acierto: false, error: 'color-equivocado', color: resp.color };
}

/** Lo que queda en a cuando Pablo quita las fichas de d (solo si d divide a a). */
export const resto = item => quitar(item.a, item.d);

// --- Ejercicio 5: la regla ---------------------------------------------------------------------

/** Tres cocientes malos para el ítem divisible, cada uno de un error con nombre. */
function opcionesCociente(rng, a, d) {
  const q = quitar(a, d);
  const candidatos = [{ m: comunes(a, d), error: 'cociente-con-el-menor' }, { m: a, error: 'cociente-sin-quitar' }];
  for (const p of colores(a)) {
    for (const delta of [1, -1]) {
      const e = exp(q, p) + delta;
      if (e < 0) continue;
      candidatos.push({ m: limpiar({ ...q, [p]: e }), error: 'exponente-mal' });
    }
  }
  const vistos = new Set([claveMonton(q)]);
  const malos = [];
  for (const c of rng.barajar(candidatos)) {
    if (vistos.has(claveMonton(c.m))) continue;
    vistos.add(claveMonton(c.m));
    malos.push(c);
  }
  if (malos.length < 3) return null;   // hay que cambiar de ítem: no salen tres cocientes malos distintos
  const todas = rng.barajar([{ m: q, error: null }, ...malos.slice(0, 3)]);
  return { opciones: todas.map(c => c.m), errores: todas.map(c => c.error), buena: todas.findIndex(c => c.error === null) };
}

/** Fichas que le sobran a a en los colores que no son el que falta. */
const sobrantes = (a, d, falta) => colores(a).filter(p => p !== falta).reduce((s, p) => s + Math.max(0, exp(a, p) - exp(d, p)), 0);

/**
 * Ítem: { a, d, divisible, ... }. La mitad divisibles (con cuatro cocientes: opciones, errores, buena);
 * la otra mitad no, con a (falta, caso 'mayor' si a > d o 'menor', sobra) a la que le falta un solo color.
 */
export function generarRegla(rng) {
  if (rng.azar() < 0.5) {
    for (let i = 0; i < 200; i++) {
      const a = montonAzar(rng, { colores: [1, 3], fichas: [3, 8] });
      const d = submontonAzar(rng, a, [1, nFichas(a) - 1]);
      const opc = d && opcionesCociente(rng, a, d);
      if (opc) return { a, d, divisible: true, ...opc };
    }
  }
  const quiereMayor = rng.azar() < 0.5, quiereSobra = rng.azar() < 0.5;
  let mejor = null;
  for (let i = 0; i < 800; i++) {
    const a = montonAzar(rng, { colores: [1, 3], fichas: [2, 8] });
    const base = submontonAzar(rng, a, [1, 2]);
    const c = base && colorQueFalta(rng, a, base);
    if (!c) continue;
    const d = juntar(base, una(c));
    if (colores(d).length < 2 || valor(d) > TOPE_MONTON) continue;
    const item = { a, d, divisible: false, falta: c, caso: valor(a) > valor(d) ? 'mayor' : 'menor', sobra: sobrantes(a, d, c) >= 2, ausente: exp(a, c) === 0 };
    mejor ??= item;
    if ((item.caso === 'mayor') === quiereMayor && item.sobra === quiereSobra) return item;
  }
  return mejor ?? { a: limpiar({ 2: 3, 3: 1 }), d: limpiar({ 2: 1, 5: 1 }), divisible: false, falta: 5, caso: 'mayor', sobra: true, ausente: true };
}

/** Paso 1: Sí / No (dice: 'si' | 'no'). */
export function diagnosticarDivisible(item, dice) {
  if (item.divisible) return dice === 'si' ? { acierto: true } : { acierto: false, error: 'cree-que-no-se-puede' };
  if (dice === 'no') return { acierto: true };
  if (valor(item.a) > valor(item.d)) return { acierto: false, error: 'mayor-es-divisible' };
  if (item.ausente) return { acierto: false, error: 'ninguna-ficha-de-ese-color' };
  return { acierto: false, error: 'mira-solo-un-color' };
}

/** Paso 2 (divisible): el cociente elegido (índice en `opciones`). */
export function diagnosticarCociente(item, i) {
  return i === item.buena ? { acierto: true } : { acierto: false, error: item.errores[i] };
}

/** Paso 2 (no divisible): el color que le falta. */
export function diagnosticarColorFalta(item, color) {
  return color === item.falta ? { acierto: true } : { acierto: false, error: 'color-equivocado', color };
}

// --- Ejercicio 6: los divisores son elecciones ------------------------------------------------------

/**
 * Ítem: { tipo: 'contar' | 'elegir' | 'ninguna', a, d? }. a tiene 2 o 3 colores y como mucho 12 divisores.
 * 'elegir': tocar las fichas del divisor d (en un 10 %, d = 1, «ninguna ficha»).
 */
export function generarDivisores(rng) {
  const a = montonAzar(rng, { colores: [2, 3], fichas: [2, 6], valida: q => numeroDivisores(q) <= 12 });
  const r = rng.azar();
  if (r < 0.45) return { tipo: 'contar', a };
  if (r < 0.9) {
    if (rng.azar() < 0.1) return { tipo: 'elegir', a, d: {} };
    return { tipo: 'elegir', a, d: submontonAzar(rng, a, [1, nFichas(a)]) };
  }
  return { tipo: 'ninguna', a };
}

export function diagnosticarContar(item, n) {
  const a = item.a;
  if (n === numeroDivisores(a)) return { acierto: true };
  const es = colores(a).map(p => exp(a, p));
  if (n === es.reduce((q, e) => q * e, 1)) return { acierto: false, error: 'sin-el-mas-uno' };
  if (n === es.reduce((s, e) => s + e, 0)) return { acierto: false, error: 'numero-de-fichas' };
  if (n === es.reduce((s, e) => s + e + 1, 0)) return { acierto: false, error: 'suma-de-los-mas-uno' };
  return { acierto: false, error: 'cuenta-mal' };
}

export function diagnosticarNinguna(n) {
  if (n === 1) return { acierto: true };
  return { acierto: false, error: n === 0 ? 'ninguna-es-cero' : 'ninguna-mal' };
}

export function diagnosticarElige(item, q) {
  return igual(q, item.d) ? { acierto: true } : { acierto: false, error: 'eleccion-mal' };
}

// --- Ejercicios 7 y 8: parejas de montones --------------------------------------------------------

export const CASOS_PAREJA = ['normal', 'sin-comunes', 'divide', 'exclusivo'];
const PESOS_CASO = [0.55, 0.15, 0.15, 0.15];
export const elegirCaso = rng => {
  let r = rng.azar();
  for (let i = 0; i < CASOS_PAREJA.length; i++) { r -= PESOS_CASO[i]; if (r < 0) return CASOS_PAREJA[i]; }
  return CASOS_PAREJA[0];
};

/**
 * Dos montones a y b (valor ≤ 2000 cada uno, de 2 a 3 colores, exponentes ≤ 3, el del 2 ≤ 4):
 *  - 'normal': comparten algún color y a los dos les sobran fichas;
 *  - 'sin-comunes': ningún color en común (49 y 45);
 *  - 'divide': a divide a b y es distinto de b;
 *  - 'exclusivo': como 'normal', y además hay un color que solo tiene uno de los dos.
 * `topeMcm` limita el m.c.m. (ejercicio 8).
 */
function parAzar(rng, caso, topeMcm = Infinity) {
  for (let i = 0; i < 1500; i++) {
    let a, b;
    if (caso === 'sin-comunes') {
      const mezcla = rng.barajar(PRIMOS_BASICOS);
      const k = rng.entero(1, 3), j = rng.entero(1, 4 - k);
      const para = cs => limpiar(Object.fromEntries(cs.map(p => [p, rng.entero(1, topeExp(p, EXP_MAX, EXP_MAX_2))])));
      a = para(mezcla.slice(0, k));
      b = para(mezcla.slice(k, k + j));
      if (rng.azar() < 0.5) [a, b] = [b, a];
    } else if (caso === 'divide') {
      b = montonAzar(rng, { colores: [2, 3], fichas: [3, 7] });
      a = submontonAzar(rng, b, [1, nFichas(b) - 1]);
      if (!a) continue;
    } else {
      a = montonAzar(rng, { colores: [2, 3], fichas: [2, 6] });
      b = montonAzar(rng, { colores: [2, 3], fichas: [2, 6] });
      const g = comunes(a, b);
      if (!nFichas(g) || igual(g, a) || igual(g, b)) continue;
      const unico = PRIMOS_BASICOS.some(p => (exp(a, p) > 0) !== (exp(b, p) > 0));
      if (caso === 'exclusivo' && !unico) continue;
    }
    if (igual(a, b) || valor(a) > TOPE_MONTON || valor(b) > TOPE_MONTON || valor(montonMinimo(a, b)) > topeMcm) continue;
    return { a, b, caso };
  }
  return { a: limpiar({ 2: 3, 5: 1 }), b: limpiar({ 2: 1, 5: 1, 7: 2 }), caso };
}

export const generarMcd = rng => parAzar(rng, elegirCaso(rng));
export const generarMcm = rng => parAzar(rng, elegirCaso(rng), TOPE_GRANDE);

/**
 * Ejercicio 7. Lo que contesta el alumno:
 *   { tipo: 'marca', sel }  las fichas de a que ha marcado, como montón;
 *   { tipo: 'ninguna', mcd } «Ninguna pareja» y su m.c.d. (1 o 0; null si aún no lo ha dicho).
 */
export function diagnosticarMcd(item, resp) {
  const { a, b } = item;
  const g = comunes(a, b);
  if (resp.tipo === 'ninguna') {
    if (nFichas(g)) return { acierto: false, error: 'olvida-pareja' };
    return resp.mcd === 1 ? { acierto: true } : { acierto: false, error: 'mcd-cero' };
  }
  const sel = resp.sel;
  if (igual(sel, g)) return { acierto: true };
  const ajeno = PRIMOS_FICHA.filter(p => exp(sel, p) > 0 && exp(b, p) === 0);
  if (ajeno.length) return { acierto: false, error: 'incluye-no-comunes', color: ajeno[0] };
  const demas = PRIMOS_FICHA.filter(p => exp(sel, p) > exp(g, p));
  if (demas.length) return { acierto: false, error: 'coge-el-mayor', color: demas[0] };
  const faltan = PRIMOS_FICHA.filter(p => exp(sel, p) < exp(g, p));
  return { acierto: false, error: faltan.length ? 'olvida-pareja' : 'parejas-mal', color: faltan[0] };
}

/** Las fichas de b que se emparejan cuando en a se marcan `sel`: por color, lo menor de lo marcado y lo que hay en b. */
export const parejasEn = (b, sel) => combina(b, sel, Math.min);

/** Ejercicio 8: `st` es el montón que ha construido el alumno. */
export function diagnosticarMcm(item, st) {
  const { a, b } = item;
  const bueno = montonMinimo(a, b);
  if (igual(st, bueno)) return { acierto: true };
  if (igual(st, juntar(a, b))) return { acierto: false, error: 'junta-todo' };
  const g = comunes(a, b);
  if (igual(st, g)) return { acierto: false, error: 'solo-comunes' };
  // El menor exponente en los colores comunes, y los demás colores enteros.
  const menorExponente = combina(a, b, (x, y) => (x && y ? Math.min(x, y) : x + y));
  if (igual(st, menorExponente)) return { acierto: false, error: 'menor-exponente' };
  const noComunes = PRIMOS_FICHA.filter(p => (exp(a, p) > 0) !== (exp(b, p) > 0));
  const sinColor = noComunes.filter(p => exp(st, p) === 0);
  if (sinColor.length) return { acierto: false, error: 'falta-color', color: sinColor[0] };
  const dif = PRIMOS_FICHA.filter(p => exp(st, p) !== exp(bueno, p));
  return { acierto: false, error: 'fichas-mal', color: dif[0] };
}
