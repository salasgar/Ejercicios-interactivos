// Práctica «Operar con factorizaciones»: lógica pura (sin DOM ni red).
//
// Ítem: { tipo: 'producto' | 'multiplo' | 'cociente', fa, fb, a, b,
//         solucion: [[p, e]…], esMultiplo, primoQueFalla: { p, ea, eb } | null,
//         categoria }
//   fa, fb  factorizaciones de a y de b
//   solucion  producto: fa·fb · multiplo (si lo es): fa:fb · cociente: fa:fb
//             (en un «multiplo» que no lo es, la lista vacía)
//   categoria  solo en el cociente: 'igual' | 'desaparece' | 'pasa' | 'general'

import { multiplicarFact, dividirFact, esMultiploFact, htmlFact, valorDe } from '../_comun/aritmetica.js';
import { TX } from './textos.js';

/** Los primos con que se construyen los ítems (también el 11). */
export const POOL = [2, 3, 5, 7, 11];
export const MAX_PRODUCTO = 100000;
export const MAX_NUMERO = 10000;
/** Tope de los steppers donde no hay que delatar la respuesta. */
export const EXPONENTE_MAXIMO = 6;

const factDeMapa = mapa => [...mapa].filter(([, e]) => e > 0).sort((x, y) => x[0] - y[0]);
const exp = (f, p) => f.find(([q]) => q === p)?.[1] ?? 0;

function itemDe(tipo, ea, eb, extra = {}) {
  const fa = factDeMapa(ea), fb = factDeMapa(eb);
  const a = valorDe(fa), b = valorDe(fb);
  const esMultiplo = esMultiploFact(fa, fb);
  let primoQueFalla = null;
  for (const [p, e] of fb) if (exp(fa, p) < e) { primoQueFalla = { p, ea: exp(fa, p), eb: e }; break; }
  const solucion = tipo === 'producto' ? multiplicarFact(fa, fb) : (esMultiplo ? dividirFact(fa, fb) : []);
  return { tipo, fa, fb, a, b, solucion, esMultiplo, primoQueFalla, categoria: null, ...extra };
}

const mapaDe = pares => new Map(pares);
const varios = (rng, n) => rng.barajar(POOL).slice(0, n);

// --- Ejercicio 1: el producto --------------------------------------------------

/** a y b con a lo sumo tres primos distintos entre los dos, exponentes ≤ 3, algún primo en común. */
export function generarProducto(rng) {
  for (;;) {
    const primos = varios(rng, rng.elegir([2, 2, 3]));
    const ea = new Map(), eb = new Map();
    for (const p of primos) {
      ea.set(p, rng.entero(0, 3));
      eb.set(p, rng.entero(0, 3));
      if (!ea.get(p) && !eb.get(p)) (rng.azar() < 0.5 ? ea : eb).set(p, rng.entero(1, 3));
    }
    const item = itemDe('producto', ea, eb);
    const compartidos = item.fa.filter(([p]) => exp(item.fb, p) > 0).length;
    if (item.a < 2 || item.b < 2 || !compartidos || item.a * item.b > MAX_PRODUCTO) continue;
    return item;
  }
}

// --- Ejercicio 2: ¿es múltiplo? ----------------------------------------------------

/**
 * Mitad «sí» y mitad «no». Los «no» se reparten entre «falta un primo de b en
 * a» y «un primo está, pero con exponente menor»; solo falla un primo.
 */
export function generarMultiplo(rng) {
  const si = rng.azar() < 0.5;
  const kindFalta = rng.azar() < 0.5;
  for (;;) {
    const primos = varios(rng, rng.elegir([2, 3, 3]));
    const ea = new Map(), eb = new Map();
    if (si) {
      for (const p of primos) {
        const b = rng.entero(0, 3);
        eb.set(p, b);
        ea.set(p, b + rng.entero(0, 2));
        if (!ea.get(p)) { eb.set(p, 1); ea.set(p, 1 + rng.entero(0, 1)); }
      }
    } else {
      const [f, ...otros] = primos;
      if (kindFalta) { ea.set(f, 0); eb.set(f, rng.entero(1, 3)); }
      else { const b = rng.entero(2, 3); eb.set(f, b); ea.set(f, rng.entero(1, b - 1)); }
      for (const p of otros) {
        if (rng.azar() < 0.5) { eb.set(p, 0); ea.set(p, rng.entero(1, 3)); }
        else { const b = rng.entero(1, 3); eb.set(p, b); ea.set(p, b + rng.entero(0, 2)); }
      }
    }
    const item = itemDe('multiplo', ea, eb);
    if (item.a < 2 || item.b < 2 || item.a > MAX_NUMERO || item.esMultiplo !== si) continue;
    if (si && item.a === item.b) continue;
    return item;
  }
}

// --- Ejercicio 3: el cociente ------------------------------------------------------

/**
 * a múltiplo de b: 10 % con a = b, 20 % con algún exponente que queda en 0, 20 %
 * con un primo de a que no está en b, y el resto «generales» (todos los
 * exponentes de b bajan pero ninguno llega a 0). Las cuatro categorías son
 * excluyentes.
 */
export function generarCociente(rng) {
  const r = rng.azar();
  const categoria = r < 0.1 ? 'igual' : r < 0.3 ? 'desaparece' : r < 0.5 ? 'pasa' : 'general';
  for (;;) {
    const ea = new Map(), eb = new Map();
    const nb = categoria === 'desaparece' ? 2 : rng.elegir([1, 2, 2]);
    const primos = varios(rng, nb + (categoria === 'pasa' ? 1 : 0));
    primos.forEach((p, i) => {
      if (categoria === 'pasa' && i === primos.length - 1) { ea.set(p, rng.entero(1, 3)); eb.set(p, 0); return; }
      const b = rng.entero(1, 3);
      eb.set(p, b);
      if (categoria === 'igual') ea.set(p, b);
      else if (categoria === 'desaparece') ea.set(p, i === 0 ? b : b + rng.entero(1, 2));
      else ea.set(p, b + rng.entero(1, 2));
    });
    const item = itemDe('cociente', ea, eb, { categoria });
    if (item.a < 2 || item.b < 2 || item.a > MAX_NUMERO || !item.esMultiplo) continue;
    return item;
  }
}

// --- Comprobación ------------------------------------------------------------------

/** Los primos que se ofrecen en los steppers del ítem: los de la solución posible. */
export function primosDe(item) {
  const f = item.tipo === 'producto' ? multiplicarFact(item.fa, item.fb) : item.fa;
  return f.map(([p]) => p);
}

/** Factorización que construye el alumno: exponentes en el orden de `primosDe(item)`. */
export function factDe(primos, exponentes) {
  return primos.map((p, i) => [p, exponentes[i]]).filter(([, e]) => e > 0);
}

/** ¿Coincide lo construido con la solución? (La factorización en primos es única.) */
export function esCorrecta(item, exponentes) {
  const mia = factDe(primosDe(item), exponentes);
  return JSON.stringify(mia) === JSON.stringify(item.solucion);
}

// --- Explicaciones -----------------------------------------------------------------

const cuenta = html => `<span class="cuenta">${html}</span>`;
const pot = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);

function lineasProducto(item, l) {
  const { expl } = TX;
  return [...new Set([...item.fa, ...item.fb].map(([p]) => p))].sort((x, y) => x - y).map(p => {
    const ea = exp(item.fa, p), eb = exp(item.fb, p);
    if (ea && eb) return expl.suma[l](p, ea, eb);
    return ea ? expl.solo_en[l](p, ea, item.a) : expl.solo_en[l](p, eb, item.b);
  });
}

function lineasCociente(item, l) {
  const { expl } = TX;
  if (item.a === item.b) return [expl.cociente_uno[l](item.a, item.b)];
  return item.fa.map(([p, ea]) => {
    const eb = exp(item.fb, p);
    return eb ? expl.resta[l](p, ea, eb) : expl.pasa_entero[l](p, ea, item.b);
  });
}

/** Explicación de por qué no es múltiplo (el primo que falla, con sus exponentes). */
export function explicarNoMultiplo(item, idioma) {
  const { expl } = TX;
  const { p, ea, eb } = item.primoQueFalla;
  const frase = ea === 0 ? expl.falta_primo[idioma](item.a, item.b, p) : expl.exponente_menor[idioma](item.a, item.b, p, ea, eb);
  return `${frase}. ${expl.sin_dividir[idioma]}`;
}

/**
 * El feedback del ítem, con sus números. `exponentes` es lo que construyó el
 * alumno (o `null` si no llegó a construir nada): si se equivocó, se dice
 * cuánto vale lo suyo.
 */
export function explicar(item, exponentes, idioma) {
  const { expl } = TX;
  const l = idioma;
  const tuya = exponentes && !esCorrecta(item, exponentes) && factDe(primosDe(item), exponentes).length
    ? (f => `${expl.tuya[l](htmlFact(f), valorDe(f))} `)(factDe(primosDe(item), exponentes))
    : '';
  if (item.tipo === 'multiplo' && !item.esMultiplo) return explicarNoMultiplo(item, l);
  const lineas = (item.tipo === 'producto' ? lineasProducto(item, l) : lineasCociente(item, l))
    .map(t => `${cuenta(t)}`).join('; ');
  const sol = item.solucion;
  if (item.tipo === 'producto') {
    const partes = sol.map(([p, e]) => p ** e).join(' · ');
    return `${tuya}${lineas}. ${expl.compruebalo[l]} ${cuenta(`${partes || 1} = ${valorDe(sol)}`)}.`;
  }
  const q = valorDe(sol);
  const prefijo = item.tipo === 'multiplo' ? `${expl.es_multiplo[l](item.a, item.b)}. ` : '';
  return `${tuya}${prefijo}${lineas}. ${cuenta(`${item.a} : ${item.b} = ${htmlFact(sol)} = ${q}`)}. ${expl.compruebalo[l]} ${cuenta(`${q} · ${item.b} = ${item.a}`)}.`;
}

export { multiplicarFact, dividirFact, esMultiploFact, htmlFact, valorDe };
