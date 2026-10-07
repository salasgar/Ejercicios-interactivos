// Árbol de factores: lógica. Todo puro (sin DOM ni red), para probarlo con
// `npm test`. Los generadores devuelven DATOS, nunca HTML ni funciones.
//
// Un árbol es { valor, hijos }: `hijos` tiene dos árboles (el nodo se ha
// partido en un producto) o ninguno (es una hoja). En un árbol terminado
// todas las hojas son primas. Un nodo se nombra por su ruta desde la raíz:
// '' es la raíz, '0' su hijo izquierdo, '01' el hijo derecho de este…

import { esPrimo, factorizar, parejasDivisores, valorDe, PRIMOS } from '../_comun/aritmetica.js';

// --- Árboles ---------------------------------------------------------------------

/** Parejas de divisores propias de n (sin «1 · n»): parejasPropias(12) → [[2, 6], [3, 4]]. */
export function parejasPropias(n) {
  return parejasDivisores(n).filter(([a]) => a > 1);
}

/** Un árbol de factores de n, eligiendo al azar la pareja de cada nodo. */
export function arbolAlAzar(n, rng) {
  const parejas = parejasPropias(n);
  if (!parejas.length) return { valor: n, hijos: [] };
  const [a, b] = rng.elegir(parejas);
  return { valor: n, hijos: [arbolAlAzar(a, rng), arbolAlAzar(b, rng)] };
}

/** Las hojas de un árbol, de menor a mayor (en un árbol terminado, sus factores primos). */
export function hojasPrimas(arbol) {
  const hojas = a => (a.hijos.length ? a.hijos.flatMap(hojas) : [a.valor]);
  return hojas(arbol).sort((x, y) => x - y);
}

/** La factorización que se lee en las hojas: [[primo, exponente], …], bases de menor a mayor. */
export function factorizacionDe(arbol) {
  const f = [];
  for (const p of hojasPrimas(arbol)) {
    if (f.length && f.at(-1)[0] === p) f.at(-1)[1]++;
    else f.push([p, 1]);
  }
  return f;
}

/** Texto que identifica la forma de un árbol sin importar el orden de las ramas. */
export function formaDe(arbol) {
  return arbol.hijos.length ? `${arbol.valor}(${arbol.hijos.map(formaDe).sort().join(',')})` : `${arbol.valor}`;
}

/** ¿Tiene n más de un árbol de factores? (8 = 2 · 4 solo tiene uno; 12 tiene dos.) */
export function tieneVariosArboles(n) {
  const parejas = parejasPropias(n);
  return parejas.length > 1 || parejas.some(pareja => pareja.some(tieneVariosArboles));
}

/** Las rutas de todos los nodos de un árbol, la raíz ('') primero. */
export function rutasDe(arbol, ruta = '') {
  return [ruta, ...arbol.hijos.flatMap((hijo, i) => rutasDe(hijo, ruta + i))];
}

/** El nodo que hay en una ruta. */
export function nodoEn(arbol, ruta) {
  return [...ruta].reduce((nodo, i) => nodo.hijos[Number(i)], arbol);
}

/** Por qué un compuesto no es primo: su primo más pequeño y el otro factor. porQueCompuesto(121) → [11, 11]. */
export function porQueCompuesto(n) {
  const p = factorizar(n)[0][0];
  return [p, n / p];
}

/** Para explicar que n es primo: los primos p con p · p ≤ n (los que hay que probar) y el siguiente. */
export function primosAProbar(n) {
  const hasta = PRIMOS.findIndex(p => p * p > n);
  return { probados: PRIMOS.slice(0, hasta), siguiente: PRIMOS[hasta] };
}

/** Cuántos factores primos tiene n contando los repetidos (las hojas de su árbol). */
export function numeroDeHojas(n) {
  return factorizar(n).reduce((suma, [, e]) => suma + e, 0);
}

const entre = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);
const mayorPrimo = n => factorizar(n).at(-1)[0];
const conOnceOTrece = n => n % 11 === 0 || n % 13 === 0;

// --- Ejercicio 1: construye el árbol ------------------------------------------------

/** Como mucho 6 hojas: es lo que cabe en una fila en un móvil de 375 px (384 = 2⁷ · 3 tendría 8). */
export const MAXIMO_DE_HOJAS = 6;

const sirveParaArbol = n => numeroDeHojas(n) >= 3 && numeroDeHojas(n) <= MAXIMO_DE_HOJAS && mayorPrimo(n) <= 19;

/** Con factor 11 o 13 (242, 286, 338, 363, 385…): un ítem de cada cuatro. */
export const CONSTRUIR_ONCE_TRECE = [...entre(24, 400), 429, 455, 507].filter(n => sirveParaArbol(n) && conOnceOTrece(n));
export const CONSTRUIR_RESTO = entre(24, 400).filter(n => sirveParaArbol(n) && !conOnceOTrece(n));

/** Ítem: { tipo: 'construir', n }. */
export function generarConstruir(rng) {
  return { tipo: 'construir', n: rng.elegir(rng.azar() < 0.25 ? CONSTRUIR_ONCE_TRECE : CONSTRUIR_RESTO) };
}

// --- Ejercicio 2: ¿está terminada? ----------------------------------------------------
//
// Una igualdad es una lista de factores [[base, exponente], …] cuyo producto
// es n SIEMPRE: lo que se juzga es si está terminada, o sea, si todas las
// bases son primas. La base compuesta, si la hay, va con exponente 1.

/** Compuestos «disfrazados» de primos: no los delata ningún criterio fácil. */
export const DISFRAZADOS = [49, 91, 121, 143, 169, 187, 209, 221];
/** Primos grandes, para que «un factor grande» no signifique siempre «sin terminar». */
export const PRIMOS_GRANDES = PRIMOS.filter(p => p >= 37 && p <= 131);
/** Lo que acompaña al factor grande: 2, 3, 5, 2², 2 · 3, 7 y 2 · 5. */
const ACOMPANANTES = [[[2, 1]], [[3, 1]], [[5, 1]], [[2, 2]], [[2, 1], [3, 1]], [[7, 1]], [[2, 1], [5, 1]]];
const NUMEROS_TERMINADA = entre(24, 400).filter(n => numeroDeHojas(n) >= 2 && numeroDeHojas(n) <= 6 && mayorPrimo(n) <= 13);
const NUMEROS_A_MEDIAS = NUMEROS_TERMINADA.filter(n => numeroDeHojas(n) >= 3 && numeroDeHojas(n) <= 5);

function conFactorGrande(rng, grandes) {
  for (;;) {
    const igualdad = [...rng.elegir(ACOMPANANTES), [rng.elegir(grandes), 1]];
    if (valorDe(igualdad) <= 999) return igualdad;
  }
}

/** Una factorización a medias: dos de los factores primos de n se quedan sin separar (60 = 4 · 3 · 5). */
function aMedias(rng) {
  for (;;) {
    const n = rng.elegir(NUMEROS_A_MEDIAS);
    const primos = rng.barajar(factorizar(n).flatMap(([p, e]) => Array(e).fill(p)));
    const compuesto = primos[0] * primos[1];
    if (compuesto > 60) continue;
    const resto = factorizar(valorDe(primos.slice(2).map(p => [p, 1])));
    return rng.barajar([...resto, [compuesto, 1]]);
  }
}

/** Ítem: { tipo: 'terminada', n, igualdad, terminada, compuesto } (compuesto = null si está terminada). */
export function generarTerminada(rng) {
  const r = rng.azar();
  let igualdad;
  if (r < 0.40) igualdad = conFactorGrande(rng, DISFRAZADOS);
  else if (r < 0.55) igualdad = aMedias(rng);
  else if (r < 0.70) igualdad = conFactorGrande(rng, PRIMOS_GRANDES);
  else igualdad = factorizar(rng.elegir(NUMEROS_TERMINADA));
  const compuesto = igualdad.map(([base]) => base).find(base => !esPrimo(base)) ?? null;
  return { tipo: 'terminada', n: valorDe(igualdad), igualdad, terminada: compuesto === null, compuesto };
}

// --- Ejercicio 3: completa el árbol ---------------------------------------------------

const NUMEROS_COMPLETAR = entre(24, 400).filter(n => numeroDeHojas(n) >= 3 && numeroDeHojas(n) <= 5 && mayorPrimo(n) <= 13);

const copiar = arbol => ({ valor: arbol.valor, hijos: arbol.hijos.map(copiar) });

/** El árbol del ítem con los números colocados en sus huecos (colocados[i] va en item.huecos[i]). */
export function arbolRelleno(item, colocados) {
  const arbol = copiar(item.arbol);
  item.huecos.forEach((ruta, i) => { nodoEn(arbol, ruta).valor = colocados[i]; });
  return arbol;
}

/**
 * Las ramas que no cuadran con esos números colocados: [{ ruta, a, b, producto, valor }],
 * donde a · b = producto pero el nodo de arriba (el de `ruta`) vale `valor`.
 */
export function ramasMal(item, colocados) {
  const arbol = arbolRelleno(item, colocados);
  return rutasDe(arbol).map(ruta => ({ ruta, nodo: nodoEn(arbol, ruta) }))
    .filter(({ nodo }) => nodo.hijos.length && nodo.hijos[0].valor * nodo.hijos[1].valor !== nodo.valor)
    .map(({ ruta, nodo }) => ({ ruta, a: nodo.hijos[0].valor, b: nodo.hijos[1].valor, producto: nodo.hijos[0].valor * nodo.hijos[1].valor, valor: nodo.valor }));
}

/** ¿Está bien completado? Se comprueba el producto de cada rama, no la posición. */
export function esCorrectaCompletar(item, colocados) {
  return colocados.length === item.huecos.length && colocados.every(Number.isInteger) && ramasMal(item, colocados).length === 0;
}

/** Los números que faltan, en el orden de item.huecos. */
export function solucionCompletar(item) {
  return item.huecos.map(ruta => nodoEn(item.arbol, ruta).valor);
}

/** Todas las formas de repartir fichas del banco en los huecos (sin repetir ficha). */
function repartos(banco, cuantos, usados = []) {
  if (usados.length === cuantos) return [usados.map(i => banco[i])];
  return banco.flatMap((_, i) => (usados.includes(i) ? [] : repartos(banco, cuantos, [...usados, i])));
}

/**
 * Las soluciones distintas de un ítem con ese banco. Dos repartos que solo
 * cambian de sitio dos huecos hermanos cuentan como el mismo.
 */
export function solucionesCompletar(item, banco = item.banco) {
  const hermano = item.huecos.map(ruta => item.huecos.indexOf(ruta.slice(0, -1) + (1 - Number(ruta.at(-1)))));
  const unicas = new Map();
  for (const reparto of repartos(banco, item.huecos.length)) {
    if (!esCorrectaCompletar(item, reparto)) continue;
    const ordenado = reparto.map((v, i) => (hermano[i] < 0 ? v : i < hermano[i] ? Math.min(v, reparto[hermano[i]]) : Math.max(v, reparto[hermano[i]])));
    unicas.set(ordenado.join(','), ordenado);
  }
  return [...unicas.values()];
}

/** Números que podrían tentar: sumar en vez de multiplicar, restar en vez de dividir, el vecino, otro primo. */
function tentaciones(item, faltan) {
  const lista = [2, 3, 5, 7, 11, 13];
  for (const ruta of item.huecos) {
    const v = nodoEn(item.arbol, ruta).valor;
    const padre = nodoEn(item.arbol, ruta.slice(0, -1));
    const [a, b] = padre.hijos.map(h => h.valor);
    lista.push(v + 1, v - 1, a + b, padre.valor - a, padre.valor - b);
  }
  // Del tamaño de los que faltan: un 280 entre fichas de una cifra se descarta sin pensar.
  const tope = Math.max(13, 2 * Math.max(...faltan));
  return [...new Set(lista)].filter(x => x > 1 && x <= tope && !faltan.includes(x));
}

/** Otro árbol del mismo número con otra forma, o null si no lo hay. */
function otroArbol(n, arbol, rng) {
  if (!tieneVariosArboles(n)) return null;
  for (let i = 0; i < 40; i++) {
    const otro = arbolAlAzar(n, rng);
    if (formaDe(otro) !== formaDe(arbol)) return otro;
  }
  return null;
}

/**
 * Ítem: { tipo: 'completar', n, arbol, huecos, banco, otro }. `huecos` son las
 * rutas de dos o tres nodos en blanco (nunca la raíz); `banco`, los números que
 * faltan más dos que no encajan en ningún hueco; `otro`, en la mitad de los
 * ítems, un árbol distinto del mismo n para enseñarlo tras el acierto.
 */
export function generarCompletar(rng) {
  for (;;) {
    const n = rng.elegir(NUMEROS_COMPLETAR);
    const arbol = arbolAlAzar(n, rng);
    const rutas = rutasDe(arbol).slice(1);
    const cuantos = rutas.length >= 6 ? rng.elegir([2, 3]) : 2;
    const huecos = rng.barajar(rutas).slice(0, cuantos).sort();
    const item = { tipo: 'completar', n, arbol, huecos };
    const faltan = solucionCompletar(item);
    const sobran = rng.barajar(tentaciones(item, faltan)).slice(0, 2);
    const banco = rng.barajar([...faltan, ...sobran]);
    // Tiene que haber una sola solución, y sin los dos que sobran.
    if (sobran.length < 2 || solucionesCompletar(item, banco).length !== 1) continue;
    return { ...item, banco, otro: rng.azar() < 0.5 ? otroArbol(n, arbol, rng) : null };
  }
}

// --- Común -----------------------------------------------------------------------------

const GENERADORES = { construir: generarConstruir, terminada: generarTerminada, completar: generarCompletar };

/** El ítem de un ejercicio: generar('construir' | 'terminada' | 'completar', rng). */
export function generar(tipo, rng) {
  return GENERADORES[tipo](rng);
}

/**
 * Los datos de la explicación de un ítem (los textos los pone textos.js):
 * { n, factorizacion, compuesto, pareja } — `pareja` es el producto que
 * demuestra que `compuesto` no es primo (121 → [11, 11]).
 */
export function explicar(item) {
  const compuesto = item.compuesto ?? null;
  return { n: item.n, factorizacion: factorizar(item.n), compuesto, pareja: compuesto === null ? null : porQueCompuesto(compuesto) };
}
