// Práctica «Divisiones sucesivas guiadas»: lógica pura (sin DOM ni red).
//
// Tres ejercicios:
//   'escalera'   ejercicio 1: dividir paso a paso por el menor primo, hasta 1.
//                { tipo, n, pasos: [[numero, primo], …] } — pasos es la solución
//                de referencia; el alumno la reconstruye pulsando botones.
//   'potencias'  ejercicio 2: escribir la factorización dada como potencias.
//                { tipo, n, lista: [primos…], factorizacion: [[p,e]…], bases: [primos candidatos] }
//   'valor'      ejercicio 3 (60 %): ¿cuánto vale la factorización?
//                { tipo, factorizacion, opciones: [números], solucion }
//   'sino'       ejercicio 3 (40 %): ¿es correcta esta igualdad?
//                { tipo, factorizacion, valorMostrado, igualdadCorrecta }

import { factorizar, valorDe, criterio, htmlFact } from '../_comun/aritmetica.js';

export const PRIMOS_ESCALERA = [2, 3, 5, 7, 11, 13];
// 2, 3 y 5 tienen un criterio de divisibilidad sencillo (aritmetica.js); para
// el 7, el 11 y el 13 en esta práctica se prueba dividiendo (no hay criterio
// rápido que valga la pena enseñar aquí para ellos).
const CON_CRITERIO = [2, 3, 5];

// --- Ejercicio 1: la escalera de divisiones --------------------------------------

// Los primos que se añaden "de relleno": sin 11 ni 13, para que la cuota de la
// ficha (30 % con 11 o 13) la ponga solo `nCon11o13`.
const PRIMOS_PEQUENOS = [2, 3, 5, 7];

/**
 * Construye un n a partir de una lista de factores iniciales, añadiendo más al
 * azar sin pasar de `maxN`. Siempre acaba con al menos dos factores (un primo
 * solo sería una escalera de un único paso).
 */
function construirDesde(rng, factoresIniciales, maxN, pool = PRIMOS_PEQUENOS) {
  const factores = [...factoresIniciales];
  let n = factores.reduce((a, b) => a * b, 1);
  while (true) {
    const candidatos = pool.filter(p => n * p <= maxN);
    if (!candidatos.length) break;
    if (factores.length >= 2 && rng.azar() < 0.5) break;
    const p = rng.elegir(candidatos);
    factores.push(p);
    n *= p;
  }
  return { n, factores: factores.sort((a, b) => a - b) };
}

function nAlAzar(rng, maxN) {
  return construirDesde(rng, [rng.elegir(PRIMOS_PEQUENOS)], maxN);
}

/** Un múltiplo de 11 o de 13, construido multiplicando (no por azar puro). */
function nCon11o13(rng, maxN) {
  return construirDesde(rng, [rng.elegir([11, 13])], maxN, PRIMOS_ESCALERA);
}

/** Un número con un factor (2 o 3) repetido tres veces o más. */
function nFactorRepetido(rng, maxN) {
  const p = rng.elegir([2, 3]);
  let veces = 3;
  let base = p ** veces;
  while (base * p <= maxN && rng.azar() < 0.4) { veces++; base *= p; }
  return construirDesde(rng, Array(veces).fill(p), maxN);
}

/**
 * Ítem del ejercicio 1: n de 2 o 3 cifras (hasta 600). Al menos un 30 % con
 * factor 11 o 13, al menos un 15 % con un factor repetido 3+ veces.
 */
export function generarEscalera(rng, intentos = 0) {
  if (intentos > 50) throw new Error('No se ha podido generar un n de 2 o 3 cifras');
  const r = rng.azar();
  const { n, factores } = r < 0.3 ? nCon11o13(rng, 600) : r < 0.45 ? nFactorRepetido(rng, 600) : nAlAzar(rng, 600);
  if (n < 10) return generarEscalera(rng, intentos + 1);
  return { tipo: 'escalera', n, pasos: pasosDesde(n, factores) };
}

/** Los pasos de referencia: dividir, en orden, por cada primo de la lista (ya ordenada). */
export function pasosDesde(n, factoresOrdenados) {
  const pasos = [];
  let m = n;
  for (const p of factoresOrdenados) { pasos.push([m, p]); m /= p; }
  return pasos;
}

/** El menor primo de PRIMOS_ESCALERA que divide a m (siempre existe si m salió de un generador de aquí). */
export function pasoCorrecto(m) {
  return PRIMOS_ESCALERA.find(p => m % p === 0);
}

/** Por qué `primo` NO divide a `numero`: criterio si lo hay, división con resto si no. */
export function razonNoDivide(numero, primo, idioma) {
  if (CON_CRITERIO.includes(primo)) {
    const { razon } = criterio(numero, primo);
    return idioma === 'es' ? `${primo} no divide a ${numero}: ${razon.es}` : `${primo} does not divide ${numero}: ${razon.en}`;
  }
  const resto = numero % primo;
  return idioma === 'es'
    ? `${numero} : ${primo} no es exacta (sobran ${resto})`
    : `${numero} : ${primo} is not exact (${resto} left over)`;
}

/** El primo elegido divide, pero no es el menor: se dice cuál era. */
export function razonNoMenor(numero, primoElegido, primoCorrecto, idioma) {
  return idioma === 'es'
    ? `Sí, ${primoElegido} divide a ${numero}, pero ${primoCorrecto} también y es más pequeño; empezamos siempre por el menor.`
    : `Yes, ${primoElegido} divides ${numero}, but ${primoCorrecto} also does and it is smaller; we always start with the smallest.`;
}

/** Qué pasa si el alumno elige `primo` cuando el número actual es `m`. */
export function evaluarEleccion(m, primo) {
  const correcto = pasoCorrecto(m);
  if (m % primo !== 0) return { resultado: 'no_divide', correcto };
  if (primo !== correcto) return { resultado: 'no_menor', correcto };
  return { resultado: 'correcto', correcto };
}

/** La explicación final, con la escalera completa y la factorización. */
export function explicarEscalera(n, pasosRealizados, idioma) {
  const lineas = pasosRealizados.map(([m, p]) => (idioma === 'es' ? `${m} : ${p} = ${m / p}` : `${m} ÷ ${p} = ${m / p}`));
  const f = factorizar(n);
  const cuenta = `<span class="cuenta">${n} = ${htmlFact(f)}</span>`;
  return `<ul class="explicacion">${lineas.map(l => `<li>${l}</li>`).join('')}</ul>${cuenta}.`;
}

// --- Ejercicio 2: la forma de potencias ------------------------------------------

const PRIMOS_POTENCIAS = [2, 3, 5, 7, 11];
const POTENCIAS_DE_10 = [10, 100, 1000, 10000];

function construirFactorizacionAcotada(rng, { nPrimos, maxExp }) {
  const bases = rng.barajar(PRIMOS_POTENCIAS).slice(0, nPrimos).sort((a, b) => a - b);
  const exponentes = bases.map(() => rng.entero(1, maxExp));
  return bases.map((p, i) => [p, exponentes[i]]);
}

/** El primer primo (de una lista pequeña) que no aparece ya en la factorización: el decoy de los steppers. */
function primoDecoy(factorizacion) {
  const usados = new Set(factorizacion.map(([p]) => p));
  return [2, 3, 5, 7, 11, 13].find(p => !usados.has(p));
}

/**
 * Ítem del ejercicio 2. Un 20 % son potencias de 10 (10, 100, 1000, 10000:
 * 2ⁿ · 5ⁿ, «se factorizan solas»). El resto, 2 o 3 primos con exponente 1-4.
 */
export function generarPotencias(rng) {
  const factorizacion = rng.azar() < 0.2
    ? factorizar(rng.elegir(POTENCIAS_DE_10))
    : construirFactorizacionAcotada(rng, { nPrimos: rng.azar() < 0.5 ? 2 : 3, maxExp: 4 });
  const n = valorDe(factorizacion);
  const decoy = primoDecoy(factorizacion);
  const bases = [...factorizacion.map(([p]) => p), decoy].filter(p => p !== undefined).sort((a, b) => a - b);
  const lista = factorizacion.flatMap(([p, e]) => Array(e).fill(p));
  return { tipo: 'potencias', n, lista, factorizacion, bases };
}

/** Feedback del ejercicio 2: cuántas veces aparece cada primo, con su potencia. */
export function explicarPotencias(factorizacion, idioma) {
  const lineas = factorizacion.map(([p, e]) => (idioma === 'es'
    ? `el ${p} aparece ${e} ${e === 1 ? 'vez' : 'veces'}: ${p}${e === 1 ? '' : `<sup>${e}</sup>`}`
    : `${p} appears ${e} time${e === 1 ? '' : 's'}: ${p}${e === 1 ? '' : `<sup>${e}</sup>`}`));
  return `<ul class="explicacion">${lineas.map(l => `<li>${l}</li>`).join('')}</ul>`;
}

/** El exponente de `p` en una factorización (0 si no aparece). */
export function exponenteDe(factorizacion, p) {
  const fila = factorizacion.find(([pp]) => pp === p);
  return fila ? fila[1] : 0;
}

/** ¿Los exponentes puestos por el alumno (uno por cada base de `item.bases`, en ese orden) forman la factorización del ítem? */
export function esFactorizacionCorrecta(item, exponentes) {
  return item.bases.every((p, i) => exponentes[i] === exponenteDe(item.factorizacion, p));
}

// --- Ejercicio 3: comprobar multiplicando ----------------------------------------

/** Factorización de 2 primos con exponentes 1-3 y SIEMPRE distintos entre sí
 * (si salen iguales, se cambia uno): así «intercambiar los exponentes» da
 * siempre un valor distinto del correcto, y al menos uno de los dos es ≥ 2. */
function construirFactorizacionParaEj3(rng) {
  const bases = rng.barajar(PRIMOS_POTENCIAS).slice(0, 2).sort((a, b) => a - b);
  const e1 = rng.entero(1, 3);
  let e2 = rng.entero(1, 3);
  if (e2 === e1) e2 = e1 === 3 ? 1 : e1 + 1;
  return [[bases[0], e1], [bases[1], e2]];
}

/**
 * Las tres opciones falsas clásicas para una factorización de 2 primos
 * [[p1,e1],[p2,e2]] con e1 ≠ e2: tratar cada potencia p^e como el producto
 * p·e («total»), intercambiar los exponentes entre las dos bases
 * («intercambio»: p1^e2 · p2^e1, el error de no fijarse en qué exponente va
 * con qué base) y el valor correcto ± uno de los factores («masMenos»).
 */
function valoresEj3(factorizacion) {
  const [[p1, e1], [p2, e2]] = factorizacion;
  const correcto = valorDe(factorizacion);
  const total = (p1 * e1) * (p2 * e2);
  const intercambio = p1 ** e2 * p2 ** e1;
  const bases = [p1, p2];
  const evitar = new Set([correcto, total, intercambio]);
  let masMenos;
  for (const signo of [1, -1]) {
    for (const p of bases) {
      const candidato = correcto + signo * p;
      if (candidato > 0 && !evitar.has(candidato)) { masMenos = candidato; break; }
    }
    if (masMenos !== undefined) break;
  }
  if (masMenos === undefined) masMenos = correcto + bases[0] * 3; // último recurso, siempre nuevo
  return { correcto, total, intercambio, masMenos };
}

/** Como `valoresEj3`, pero reintenta con una factorización nueva si no salen cuatro valores distintos. */
function valoresEj3SiempreDistintos(rng, intentos = 0) {
  if (intentos > 50) throw new Error('No se ha podido generar una factorización con cuatro valores distintos');
  const factorizacion = construirFactorizacionParaEj3(rng);
  const v = valoresEj3(factorizacion);
  if (new Set([v.correcto, v.total, v.intercambio, v.masMenos]).size !== 4) return valoresEj3SiempreDistintos(rng, intentos + 1);
  return { factorizacion, ...v };
}

/** Las tres opciones falsas clásicas para `factorizacion`, siempre distintas entre sí y del valor correcto. */
export function distractoresEj3(factorizacion) {
  const { total, intercambio, masMenos } = valoresEj3(factorizacion);
  return { total, intercambio, masMenos };
}

/** Ítem del ejercicio 3, variante «valor»: cuatro opciones numéricas, una correcta. */
export function generarValor(rng) {
  const { factorizacion, correcto, total, intercambio, masMenos } = valoresEj3SiempreDistintos(rng);
  const opciones = rng.barajar([correcto, total, intercambio, masMenos]);
  return { tipo: 'valor', factorizacion, opciones, solucion: correcto };
}

/** Ítem del ejercicio 3, variante «sino»: ¿es correcta esta igualdad? Mitad sí, mitad no. */
export function generarSino(rng) {
  const { factorizacion, correcto, total, intercambio, masMenos } = valoresEj3SiempreDistintos(rng);
  const si = rng.azar() < 0.5;
  const valorMostrado = si ? correcto : rng.elegir([total, intercambio, masMenos]);
  return { tipo: 'sino', factorizacion, valorMostrado, igualdadCorrecta: si };
}

/** Ítem del ejercicio 3: 60 % «valor», 40 % «sino». */
export function generarEjercicio3(rng) {
  return rng.azar() < 0.6 ? generarValor(rng) : generarSino(rng);
}

/** La explicación paso a paso: cada potencia calculada de verdad y el producto final. */
export function explicarEj3(factorizacion, idioma) {
  // Solo las potencias de verdad: con exponente 1 «3 = 3» no explica nada.
  const pasos = factorizacion.filter(([, e]) => e > 1).map(([p, e]) => `${p}<sup>${e}</sup> = ${p ** e}`);
  const correcto = valorDe(factorizacion);
  const productoTexto = factorizacion.map(([p, e]) => p ** e).join(' · ');
  const frase = idioma === 'es'
    ? `${pasos.join('; ')}; ${productoTexto} = ${correcto}`
    : `${pasos.join('; ')}; ${productoTexto} = ${correcto}`;
  return `<span class="cuenta">${frase}</span>`;
}
