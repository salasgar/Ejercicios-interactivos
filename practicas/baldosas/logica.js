// Práctica «Baldosas y cuerdas»: lógica, pura (sin DOM ni red).
//
// Ejercicio 1: elegir el lado de la baldosa cuadrada más grande que cubre un
// rectángulo de a por b sin cortar ninguna, es decir, el m.c.d.(a, b).
// Ejercicio 2: con esa baldosa ya elegida, cuántas hacen falta: (a/g)·(b/g).
// Ejercicio 3: cortar dos o tres cuerdas en trozos iguales lo más largos
// posible (de nuevo el m.c.d.) y decir cuánto mide cada trozo y cuántos salen
// en total (se suman los trozos de cada cuerda, porque son cuerdas distintas).

import { mcd, divisores, factorizar, mcdFact, htmlFact, valorDe } from '../_comun/aritmetica.js';
import { TX } from './textos.js';

const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// --- Ejercicio 1: la baldosa más grande -----------------------------------------

/**
 * Ítem: { tipo: 'baldosa', a, b, g, candidatos }. a, b entre 12 y 90, a ≠ b,
 * g = m.c.d.(a, b) ≥ 2. `candidatos` (hasta 8, ordenados) incluye siempre g,
 * al menos un divisor común menor que g (al menos el 1) y al menos un lado
 * que no divide a a o a b.
 */
export function generarBaldosa(rng) {
  let a, b, g, divA, divB, comunes, intentos = 0;
  do {
    a = rng.entero(12, 90);
    b = rng.entero(12, 90);
    g = mcd(a, b);
    divA = divisores(a);
    divB = divisores(b);
    comunes = divA.filter(d => divB.includes(d)); // = divisores(g)
    intentos++;
  } while (intentos < 300 && (a === b || g < 2 || comunes.length > 5));

  const soloA = divA.filter(d => !divB.includes(d));
  const soloB = divB.filter(d => !divA.includes(d));
  const puros = []; // no dividen ni a a ni a b
  for (let x = 2; x <= 15 && puros.length < 3; x++) {
    if (a % x !== 0 && b % x !== 0) puros.push(x);
  }

  const comunMenor = comunes.filter(d => d !== g).at(-1) ?? 1;
  const candidatosSet = new Set([g, comunMenor]);
  const fallan = rng.barajar([...soloA, ...soloB, ...puros]);
  if (fallan.length) candidatosSet.add(fallan[0]); // garantiza un lado que falla en algún lado
  const resto = rng.barajar([...comunes, ...fallan]).filter(x => !candidatosSet.has(x));
  for (const x of resto) {
    if (candidatosSet.size >= 8) break;
    candidatosSet.add(x);
  }
  const candidatos = [...candidatosSet].sort((x, y) => x - y);
  return { tipo: 'baldosa', a, b, g, candidatos };
}

/** ¿Es `s` la baldosa más grande para este ítem? */
export function esLaMasGrande(item, s) {
  return s === item.g;
}

/** Cómo queda el lado `valor` al cubrirlo con baldosas de lado `lado`. */
export function cabeEnLado(valor, lado) {
  const cociente = Math.floor(valor / lado);
  const resto = valor % lado;
  return { cociente, resto, cabe: resto === 0 };
}

// --- Ejercicio 2: ¿cuántas baldosas? ---------------------------------------------

/**
 * Ítem: { tipo: 'cuantas', a, b, g, cuantas, errorSuma }. Mismo tipo de
 * rectángulo que el ejercicio 1, con el recuento de baldosas de lado g ya
 * resuelto (a/g · b/g ≤ 72, para que la cuadrícula se vea entera en el móvil).
 */
export function generarCuantas(rng) {
  let a, b, g, p, q, intentos = 0;
  do {
    a = rng.entero(12, 90);
    b = rng.entero(12, 90);
    g = mcd(a, b);
    p = a / g;
    q = b / g;
    intentos++;
  } while (intentos < 300 && (a === b || g < 2 || p * q > 72));
  const cuantas = p * q;
  const errorSuma = p + q;
  return { tipo: 'cuantas', a, b, g, cuantas, errorSuma };
}

export function esNumeroDeBaldosas(item, respuesta) {
  return respuesta === item.cuantas;
}

// --- Ejercicio 3: cuerdas ---------------------------------------------------------

/**
 * Ítem: { tipo: 'cuerdas', longitudes, g, porCuerda, trozosTotal }.
 * Dos cuerdas (70 % de las veces) o tres, de longitudes con m.c.d. ≥ 3 (cada
 * una ≤ 160). `porCuerda[i]` = longitudes[i] / g; `trozosTotal` es su suma
 * (se suman porque son cuerdas distintas, no se multiplican).
 */
export function generarCuerdas(rng) {
  const n = rng.azar() < 0.3 ? 3 : 2;
  let longitudes, g, intentos = 0;
  do {
    const base = rng.entero(3, 15);
    longitudes = Array.from({ length: n }, () => rng.entero(2, 12) * base);
    g = mcd(...longitudes);
    intentos++;
  } while (intentos < 300 && (new Set(longitudes).size !== n || g < 3 || Math.max(...longitudes) > 160));
  const porCuerda = longitudes.map(l => l / g);
  const trozosTotal = porCuerda.reduce((s, x) => s + x, 0);
  return { tipo: 'cuerdas', longitudes, g, porCuerda, trozosTotal };
}

export function esCorteDeCuerdas(item, trozo, totalTrozos) {
  return trozo === item.g && totalTrozos === item.trozosTotal;
}

export { rango };

// «No lo sé»: cómo se resuelve este ítem, con sus números, y la solución al final (revisión 193: qué se pide,
// el m.c.d. con el método de los apuntes, las cuentas con sus unidades y la frase de respuesta).

const pasosAyuda = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const enLista = (cosas, idioma) => `${cosas.slice(0, -1).join(', ')} ${TX.ayuda.y[idioma]} ${cosas.at(-1)}`;
/** Hasta aquí, listas de divisores; con números mayores, factorización (el mismo corte que el feedback de acierto). */
export const LISTAS_HASTA = 50;

/** Los dos pasos del m.c.d. por factorización: descomponer y quedarse con los primos comunes, con el menor exponente. */
function mcdPorFactorizacion(numeros, idioma) {
  const x = TX.ayuda;
  const fs = numeros.map(factorizar);
  const comun = mcdFact(...fs);
  const sola = comun.length === 1 && comun[0][1] === 1;
  const cuenta = `${sola ? '' : `${htmlFact(comun)} = `}${valorDe(comun)}`;
  return [
    x.descompon[idioma](enLista(numeros.map((n, i) => `<span class="cuenta">${n} = ${htmlFact(fs[i])}</span>`), idioma)),
    x.mcd_fact[idioma](numeros.join(', '), cuenta),
  ];
}

export function explicaBaldosa(item, idioma) {
  const { a, b, g } = item;
  const x = TX.ayuda;
  const pasos = Math.max(a, b) <= LISTAS_HASTA
    ? [x.divisores[idioma](a, divisores(a)), x.divisores[idioma](b, divisores(b)), x.comunes[idioma](a, b, divisores(g), g)]
    : mcdPorFactorizacion([a, b], idioma);
  return `<p>${x.pide_baldosa[idioma](a, b)}</p>${pasosAyuda(pasos)}<p>${x.fin_baldosa[idioma](g)}</p>`;
}

export function explicaCuantas(item, idioma) {
  const { a, b, g, cuantas } = item;
  const x = TX.ayuda;
  const p = a / g, q = b / g;
  return `<p>${x.pide_cuantas[idioma](g)}</p>`
    + pasosAyuda([x.a_lo_largo[idioma](a, g, p), x.a_lo_ancho[idioma](b, g, q), x.filas[idioma](p, q, cuantas)])
    + `<p>${x.fin_cuantas[idioma](cuantas)} ${x.consejo_cuantas[idioma]}</p>`;
}

export function explicaCuerdas(item, idioma) {
  const x = TX.ayuda;
  const { longitudes, g, porCuerda, trozosTotal } = item;
  const divisiones = longitudes.map((l, i) => `<span class="cuenta">${l} : ${g} = ${porCuerda[i]}</span>`).join('; ');
  return `<p>${x.pide_cuerdas[idioma]}</p>`
    + pasosAyuda([...mcdPorFactorizacion(longitudes, idioma), x.trozos[idioma](divisiones, porCuerda, trozosTotal)])
    + `<p>${x.fin_cuerdas[idioma](g, trozosTotal)}</p>`;
}
