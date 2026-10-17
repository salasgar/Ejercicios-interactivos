// Práctica «Multiplica y divide por primos»: lógica pura, probada en
// `tests/practicas-por-primos.test.js`. Las factorizaciones son listas
// [[primo, exponente], …] (ver `../_comun/aritmetica.js`); aquí solo hay
// primos 2, 3, 5 y 7.
//
// Los tres fallos del juego de Scratch en que se basa, evitados:
//   1. «: p» solo está activo si el número tiene el primo p (no hay decimales).
//   2. Nunca sale resuelto al empezar, y el objetivo nunca es 1.
//   3. Los «· p» se apagan si el número pasaría de TOPE.

import { htmlFact, valorDe, mcdFact, mcmFact, esMultiploFact, multiplicarFact, dividirFact } from '../_comun/aritmetica.js';
import { TX } from './textos.js';

export const BASES = [2, 3, 5, 7];
export const TOPE = 100000;
const OBJETIVO_MIN = 4, OBJETIVO_MAX = 300, PARTIDA_MIN = 2, PARTIDA_MAX = 300;
const MCM_MAX = 5000;

/** Exponentes de [2, 3, 5, 7] → factorización. */
export const factDe = exps => BASES.map((p, i) => [p, exps[i]]).filter(([, e]) => e > 0);
/** Factorización → exponentes de [2, 3, 5, 7]. */
export const expsDe = f => BASES.map(p => f.find(([q]) => q === p)?.[1] ?? 0);

/** Lo que se pide en cada ejercicio (1 múltiplo, 2 divisor, 3 m.c.m., 4 m.c.d.). */
export const EJERCICIOS = {
  1: { sube: true, baja: true },
  2: { sube: true, baja: true },
  3: { sube: true, baja: false },
  4: { sube: false, baja: true },
};

/** Cada primo con el exponente mínimo y máximo que vale en la respuesta. */
function limites(ejercicio, item) {
  const o = expsDe(item.objetivo);
  if (ejercicio === 1) return o.map(e => [e, Infinity]);
  if (ejercicio === 2) return o.map(e => [0, e]);
  const m = expsDe((ejercicio === 3 ? mcmFact : mcdFact)(item.objetivo, item.partida));
  return m.map(e => [e, e]);
}

/** Toques que hacen falta como mínimo (cada toque cambia un exponente en 1). */
export function toquesMinimos(item) {
  const o = expsDe(item.objetivo), p = expsDe(item.partida);
  const j = item.ejercicio;
  // Múltiplo y m.c.m.: subir lo que falta. Divisor y m.c.d.: bajar lo que sobra.
  return o.reduce((s, e, i) => s + (j === 1 || j === 3 ? Math.max(0, e - p[i]) : Math.max(0, p[i] - e)), 0);
}

/** ¿Vale este número? (`actual` es una factorización.) */
export function esCorrecta(item, actual) {
  const j = item.ejercicio;
  if (j === 1) return esMultiploFact(actual, item.objetivo);
  if (j === 2) return esMultiploFact(item.objetivo, actual);
  return valorDe(actual) === valorDe((j === 3 ? mcmFact : mcdFact)(item.objetivo, item.partida));
}

/**
 * Qué botones se pueden tocar: { mult, div }, cada uno una lista de cuatro
 * booleanos (2, 3, 5, 7) o `null` si ese ejercicio no tiene esa fila.
 */
export function botonesActivos(ejercicio, actual) {
  const v = valorDe(actual), e = expsDe(actual);
  const { sube, baja } = EJERCICIOS[ejercicio];
  return {
    mult: sube ? BASES.map(p => v * p <= TOPE) : null,
    div: baja ? BASES.map((p, i) => e[i] > 0) : null,
  };
}

/** Un toque: `signo` +1 multiplica por p, −1 divide. `null` si no se puede. */
export function tocar(ejercicio, actual, p, signo) {
  const a = botonesActivos(ejercicio, actual);
  const i = BASES.indexOf(p);
  if (signo > 0) return a.mult?.[i] ? multiplicarFact(actual, [[p, 1]]) : null;
  return a.div?.[i] ? dividirFact(actual, [[p, 1]]) : null;
}

/** Estado de cada primo al corregir: 'bien', 'falta' (le falta exponente) o 'mal' (le sobra). */
export function estadoPrimos(item, actual) {
  const lim = limites(item.ejercicio, item), e = expsDe(actual);
  return BASES.map((p, i) => {
    if (e[i] === 0 && lim[i][0] === 0) return null;     // ni está ni hace falta
    if (e[i] < lim[i][0]) return { p, e: e[i], estado: 'falta' };
    if (e[i] > lim[i][1]) return { p, e: e[i], estado: 'mal' };
    return { p, e: e[i], estado: 'bien' };
  }).filter(Boolean);
}

// ─── Generador ─────────────────────────────────────────────────────────────────

export function generar(ejercicio, rng) {
  // Cuotas: del ejercicio 3, el 20 % con m.c.m. = objetivo (la partida lo divide);
  // del 4, el 10 % con m.c.d. = 1.
  const raro = rng.azar() < (ejercicio === 3 ? 0.2 : 0.1);
  for (;;) {
    const usados = rng.barajar(BASES).slice(0, rng.entero(1, 3));
    const o = BASES.map(p => (usados.includes(p) ? rng.entero(0, 3) : 0));
    const q = BASES.map(p => (usados.includes(p) ? rng.entero(0, 3) : 0));
    const objetivo = factDe(o), partida = factDe(q);
    const vo = valorDe(objetivo), vp = valorDe(partida);
    if (vo < OBJETIVO_MIN || vo > OBJETIVO_MAX || vp < PARTIDA_MIN || vp > PARTIDA_MAX || vo === vp) continue;
    const item = { ejercicio, objetivo, partida };
    const toques = toquesMinimos(item);
    if (toques < 1 || toques > 4) continue;             // nunca resuelto al salir
    if (ejercicio === 3) {
      const m = mcmFact(objetivo, partida);
      if (valorDe(m) > MCM_MAX || (valorDe(m) === vo) !== raro) continue;
    }
    if (ejercicio === 4 && (valorDe(mcdFact(objetivo, partida)) === 1) !== raro) continue;
    return item;
  }
}

// ─── Feedback ──────────────────────────────────────────────────────────────────

/**
 * La explicación del ítem con sus números, comparando exponentes y sin
 * dividir. `actual` es la factorización con que responde el alumno.
 */
export function explicar(item, actual, idioma) {
  const x = TX.expl, j = item.ejercicio;
  const t = obj => obj[idioma];
  const b = valorDe(item.objetivo), fb = htmlFact(item.objetivo);
  const a = valorDe(actual), fa = htmlFact(actual);
  const o = expsDe(item.objetivo), e = expsDe(actual);

  const faltan = () => BASES.map((p, i) => [p, e[i], o[i]]).filter(([, tiene, hace]) => tiene < hace);
  const sobran = () => BASES.map((p, i) => [p, e[i], o[i]]).filter(([, tiene, tope]) => tiene > tope);

  if (j === 1) {
    return esCorrecta(item, actual)
      ? t(x.esMultiplo)(a, fa, b, fb)
      : t(x.noMultiplo)(b, fb, a, fa, faltan());
  }
  if (j === 2) {
    return esCorrecta(item, actual)
      ? t(x.esDivisor)(a, fa, b, fb)
      : t(x.noDivisor)(b, fb, a, fa, sobran());
  }
  const sv = valorDe(item.partida);
  if (j === 3) {
    const m = mcmFact(item.objetivo, item.partida), em = expsDe(m);
    if (esCorrecta(item, actual)) return t(x.mcmBien)(a, fa, sv, b);
    if (!esMultiploFact(actual, item.objetivo)) return t(x.noMultiplo)(b, fb, a, fa, faltan());
    const demas = BASES.map((p, i) => [p, e[i] - em[i]]).filter(([, n]) => n > 0);
    return t(x.mcmSobra)(b, demas, valorDe(m), htmlFact(m), sv);
  }
  const m = mcdFact(item.objetivo, item.partida), em = expsDe(m);
  if (esCorrecta(item, actual)) return t(x.mcdBien)(a, fa, sv, b) + (a === 1 ? t(x.mcdUno)(sv, b) : '');
  if (!esMultiploFact(item.objetivo, actual)) return t(x.noDivisor)(b, fb, a, fa, sobran());
  const quitados = BASES.map((p, i) => [p, em[i] - e[i]]).filter(([, n]) => n > 0);
  return t(x.mcdDeMas)(b, quitados, valorDe(m), htmlFact(m), sv);
}
