// Práctica «Semáforo de divisibilidad»: lógica pura (sin DOM ni red).
//
// Cuatro ejercicios, un ítem distinto cada uno, todos con el mismo campo `tipo`:
//   'semaforo'  ejercicios 1 y 2: { tipo, n, divisores, correctos }
//               divisores: los botones que se ofrecen; correctos: los que dividen a n.
//   'sino'      ejercicio 3 (caso normal): { tipo, n, d, correctos: 'si' | 'no' }
//   'trampa'    ejercicio 3 (caso U2-1C-09): { tipo, n, correctos: 'no' }
//   'cifra'     ejercicio 4: { tipo, cifras, hueco, divisores, solucion }
//               cifras: dígitos de la solución (el de `hueco` también, para poder
//               reconstruir el número); `respuesta` del alumno es solo la cifra.

import { criterio, factorizar } from '../_comun/aritmetica.js';

const esDivisible = (n, d) => n % d === 0;

// --- Ejercicios 1 y 2: el semáforo -----------------------------------------------

/** Dos cifras a cuatro, sin forzar nada: 10..9999. */
function nAlAzar(rng) {
  return rng.entero(10, 9999);
}

/** Un múltiplo de 3 que no lo sea de 9 (nunca da «conjunto vacío»). */
function nDiv3No9(rng) {
  let n;
  do { n = 3 * rng.entero(4, 3333); } while (n % 9 === 0 || n > 9999);
  return n;
}

/** Un número que acaba en 0 (divisible entre 2, 5 y 10 a la vez). */
function nTerminaEn0(rng) {
  return rng.entero(1, 999) * 10;
}

/** Un múltiplo de 11 construido multiplicando (nunca por azar puro). */
function nDiv11(rng) {
  return 11 * rng.entero(1, 909);
}

/**
 * Ítem del ejercicio 1 (cinco botones: 2, 3, 5, 9, 10). El generador fuerza
 * variedad para que, en muchos ítems, al menos un 30 % sea divisible entre 3 y
 * no entre 9, al menos un 15 % acabe en 0 y nunca más de la mitad tenga el
 * conjunto vacío (las dos categorías forzadas nunca lo tienen).
 */
export function generarSemaforo1(rng) {
  const r = rng.azar();
  const n = r < 0.4 ? nDiv3No9(rng) : r < 0.65 ? nTerminaEn0(rng) : nAlAzar(rng);
  const divisores = [2, 3, 5, 9, 10];
  return { tipo: 'semaforo', n, divisores, correctos: divisores.filter(d => esDivisible(n, d)) };
}

/**
 * Ítem del ejercicio 2 (seis botones: añade el 11). Al menos un 25 % de los
 * números son divisibles entre 11, construidos multiplicando.
 */
export function generarSemaforo2(rng) {
  const r = rng.azar();
  const n = r < 0.35 ? nDiv11(rng) : r < 0.7 ? nDiv3No9(rng) : r < 0.9 ? nTerminaEn0(rng) : nAlAzar(rng);
  const divisores = [2, 3, 5, 9, 10, 11];
  return { tipo: 'semaforo', n, divisores, correctos: divisores.filter(d => esDivisible(n, d)) };
}

/** Las razones (criterios) de cada divisor de un ítem de semáforo, en orden. */
export function razonesSemaforo(item, idioma) {
  return item.divisores.map(d => ({ d, divisible: esDivisible(item.n, d), razon: criterio(item.n, d).razon[idioma] }));
}

// --- Ejercicio 3: criterios compuestos y la trampa del 4 y el 6 -----------------

export const DIVISORES_COMPUESTOS = [6, 15, 22, 30, 33];
/** Múltiplos de 12 que no lo son de 24: la trampa de U2-1C-09. */
export const NUMEROS_TRAMPA = [12, 36, 60, 84, 108];

function nMultiploDe(rng, d) {
  return d * rng.entero(2, Math.floor(9999 / d));
}

function nNoMultiploDe(rng, d) {
  let n;
  do { n = nAlAzar(rng); } while (n % d === 0);
  return n;
}

/** Ítem del ejercicio 3: un 20 % trampa, el resto V/F sobre un divisor compuesto, mitad sí y mitad no. */
export function generarSinoOTrampa(rng) {
  if (rng.azar() < 0.2) {
    return { tipo: 'trampa', n: rng.elegir(NUMEROS_TRAMPA), correctos: 'no' };
  }
  const d = rng.elegir(DIVISORES_COMPUESTOS);
  const si = rng.azar() < 0.5;
  const n = si ? nMultiploDe(rng, d) : nNoMultiploDe(rng, d);
  return { tipo: 'sino', n, d, correctos: si ? 'si' : 'no' };
}

/** Los primos de un divisor compuesto (6, 15, 22, 30 o 33), sin repetir y de menor a mayor. */
export function primosDe(d) {
  return factorizar(d).map(([p]) => p);
}

// --- Ejercicio 4: la cifra que falta ---------------------------------------------

/** Los juegos de divisores que puede pedir el ejercicio 4. */
const JUEGOS_DIVISORES = [[9], [11], [2, 9], [5, 3]];

function digitosAlAzar(rng, longitud) {
  const cifras = [rng.entero(1, 9)];
  for (let i = 1; i < longitud; i++) cifras.push(rng.entero(0, 9));
  return cifras;
}

function valorDeCifras(cifras) {
  return cifras.reduce((n, c) => n * 10 + c, 0);
}

/** Las cifras X (0-9) en `pos` que hacen que el número cumpla todos los divisores. */
function candidatas(cifras, pos, divisores) {
  const buenas = [];
  for (let x = 0; x <= 9; x++) {
    if (pos === 0 && x === 0) continue; // no hay cero a la izquierda
    const prueba = [...cifras];
    prueba[pos] = x;
    const n = valorDeCifras(prueba);
    if (divisores.every(d => esDivisible(n, d))) buenas.push(x);
  }
  return buenas;
}

/**
 * Ítem del ejercicio 4: un número de 3 o 4 cifras con una cifra oculta, y el
 * divisor (o los dos divisores) que tiene que cumplir. Se reintenta hasta que
 * la cifra que falta sea única.
 */
export function generarCifra(rng) {
  for (let intento = 0; intento < 500; intento++) {
    const longitud = rng.entero(3, 4);
    const divisores = rng.elegir(JUEGOS_DIVISORES);
    const cifras = digitosAlAzar(rng, longitud);
    const hueco = rng.entero(0, longitud - 1);
    const buenas = candidatas(cifras, hueco, divisores);
    // Hueco en la primera cifra: si el 0 también cumpliría, el alumno lo daría por bueno
    // y se le diría que falla sin motivo visible; ese ítem no se propone.
    if (hueco === 0 && divisores.every(d => esDivisible(valorDeCifras([0, ...cifras.slice(1)]), d))) continue;
    if (buenas.length === 1) {
      return { tipo: 'cifra', cifras, hueco, divisores, solucion: buenas[0] };
    }
  }
  throw new Error('No se ha encontrado una cifra única: revisa generarCifra');
}

// --- Funciones comunes a los cuatro ejercicios -----------------------------------

/** `generar(ejercicio, rng)`: ejercicio es 1, 2, 3 o 4. */
export function generar(ejercicio, rng) {
  if (ejercicio === 1) return generarSemaforo1(rng);
  if (ejercicio === 2) return generarSemaforo2(rng);
  if (ejercicio === 3) return generarSinoOTrampa(rng);
  if (ejercicio === 4) return generarCifra(rng);
  throw new Error(`Ejercicio desconocido: ${ejercicio}`);
}

/**
 * `esCorrecta(item, respuesta)`: respuesta es un array de divisores encendidos
 * (semáforo), 'si' | 'no' (sino, trampa) o una cifra 0-9 (cifra).
 */
export function esCorrecta(item, respuesta) {
  if (item.tipo === 'semaforo') {
    const encendidos = [...respuesta].sort((a, b) => a - b);
    const buenos = [...item.correctos].sort((a, b) => a - b);
    return encendidos.length === buenos.length && encendidos.every((d, i) => d === buenos[i]);
  }
  if (item.tipo === 'sino' || item.tipo === 'trampa') return respuesta === item.correctos;
  if (item.tipo === 'cifra') return Number(respuesta) === item.solucion;
  throw new Error(`Tipo de ítem desconocido: ${item.tipo}`);
}

const SI_NO = { es: { si: 'sí', no: 'no' }, en: { si: 'yes', no: 'no' } };

function explicarSemaforo(item, idioma) {
  const lineas = razonesSemaforo(item, idioma).map(({ d, divisible, razon }) => `${d}: ${SI_NO[idioma][divisible ? 'si' : 'no']} (${razon})`);
  const cierre = item.correctos.length === 0
    ? `<p class="frase">${idioma === 'es' ? 'No es divisible entre ninguno de ellos.' : 'It is not divisible by any of them.'}</p>`
    : '';
  return `<ul class="explicacion">${lineas.map(l => `<li>${l}</li>`).join('')}</ul>${cierre}`;
}

function explicarSino(item, idioma) {
  const primos = primosDe(item.d).map(p => `${p}: ${SI_NO[idioma][esDivisible(item.n, p) ? 'si' : 'no']} (${criterio(item.n, p).razon[idioma]})`);
  const cuenta = `<span class="cuenta">${item.d} = ${primosDe(item.d).join(' · ')}</span>`;
  return idioma === 'es'
    ? `${item.n} ${item.correctos === 'si' ? 'sí' : 'no'} es divisible entre ${item.d} (${cuenta}): ${primos.join('; ')}.`
    : `${item.n} is ${item.correctos === 'si' ? '' : 'not '}divisible by ${item.d} (${cuenta}): ${primos.join('; ')}.`;
}

function explicarTrampa(item, idioma) {
  const resto = item.n % 24;
  return idioma === 'es'
    ? `${item.n} es divisible entre 4 y entre 6, pero no entre 24: <span class="cuenta">${item.n} : 24</span> no es exacta (sobran ${resto}).`
    : `${item.n} is divisible by 4 and by 6, but not by 24: <span class="cuenta">${item.n} : 24</span> is not exact (${resto} left over).`;
}

const sumar = valores => valores.reduce((s, v) => s + v, 0);
const cuenta = texto => `<span class="cuenta">${texto}</span>`;

/**
 * Ejercicio 4: el criterio de cada divisor aplicado con el hueco dentro, como en los apuntes
 * («4□7 divisible entre 9 → 11 + □ múltiplo de 9 → □ = 7»), y la respuesta al final.
 * Revisión 193: antes decía «prueba cifras hasta que se cumpla», daba la cifra al principio (el feedback empieza
 * por «La cifra que falta es…») y no cerraba con «La respuesta es»; el criterio del 11 hablaba de «las cifras» que
 * se diferencian, no de sus sumas. Que la cifra sea «la única» lo garantiza `generarCifra` (y lo comprueba el test).
 */
function explicarCifra(item, idioma) {
  const es = idioma === 'es';
  const s = item.solucion;
  const completas = item.cifras.map((c, i) => (i === item.hueco ? s : c));
  const n = Number(completas.join(''));
  const ultima = item.hueco === item.cifras.length - 1;
  const conocidas = item.cifras.filter((_, i) => i !== item.hueco);
  let filtro = null; // el 2 o el 5 con el hueco al final: ya solo valen unas cifras
  const pasos = item.divisores.map(d => {
    if (d === 2 || d === 5) {
      if (ultima) {
        filtro = d;
        return es
          ? `Para el ${d}, el hueco es la última cifra: tiene que ser ${d === 2 ? 'par (0, 2, 4, 6 u 8)' : '0 o 5'}.`
          : `For ${d}, the gap is the last digit: it has to be ${d === 2 ? 'even (0, 2, 4, 6 or 8)' : '0 or 5'}.`;
      }
      return es ? `Para el ${d}: ${criterio(n, d).razon.es}; eso ya se cumple.` : `For ${d}: ${criterio(n, d).razon.en}; that is already true.`;
    }
    if (d === 3 || d === 9) {
      const suma = sumar(conocidas);
      const cual = es
        ? { 2: 'la única cifra par que', 5: 'de las dos, la única que' }[filtro] ?? 'la única cifra que'
        : { 2: 'the only even digit that', 5: 'of the two, the only one that' }[filtro] ?? 'the only digit that';
      return es
        ? `Para el ${d}, suma las cifras que ves: ${cuenta(`${conocidas.join(' + ')} = ${suma}`)}. Con el hueco, la suma tiene que ser múltiplo de ${d}, y ${cual} lo consigue es ${s}: ${cuenta(`${suma} + ${s} = ${suma + s}`)}.`
        : `For ${d}, add the digits you can see: ${cuenta(`${conocidas.join(' + ')} = ${suma}`)}. With the gap, the sum has to be a multiple of ${d}, and ${cual} does it is ${s}: ${cuenta(`${suma} + ${s} = ${suma + s}`)}.`;
    }
    // 11: lugar impar = 1.ª, 3.ª… cifra desde la izquierda, como en `criterio`.
    const lugar = p => (p === 0 ? (es ? 'de lugar impar' : 'in odd places') : (es ? 'de lugar par' : 'in even places'));
    const conHueco = item.hueco % 2, sinHueco = 1 - conHueco;
    const terminos = p => item.cifras.map((c, i) => (i === item.hueco ? '□' : String(c))).filter((_, i) => i % 2 === p);
    const sumaDe = p => sumar(completas.filter((_, i) => i % 2 === p));
    const otra = sumaDe(sinHueco), esta = sumaDe(conHueco);
    const resta = `${Math.max(otra, esta)} − ${Math.min(otra, esta)} = ${Math.abs(otra - esta)}`;
    // Con una sola cifra en el grupo (números de tres cifras), «la cifra … es 5», no «las cifras … suman 5».
    const grupo = (p, texto) => (terminos(p).length > 1
      ? (es ? `las cifras ${lugar(p)} suman ${texto}` : `the digits ${lugar(p)} add up to ${texto}`)
      : (es ? `la cifra ${lugar(p)} es ${texto}` : `the digit ${lugar(p)} is ${texto}`));
    const textoOtra = terminos(sinHueco).length > 1 ? `${terminos(sinHueco).join(' + ')} = ${otra}` : `${otra}`;
    return es
      ? `Para el 11: ${grupo(sinHueco, cuenta(textoOtra))}, y ${grupo(conHueco, cuenta(terminos(conHueco).join(' + ')))}. La diferencia tiene que ser múltiplo de 11 (0, 11, 22…), y la única cifra que lo consigue es ${s}: entonces ${grupo(conHueco, esta)}, y ${cuenta(resta)}.`
      : `For 11: ${grupo(sinHueco, cuenta(textoOtra))}, and ${grupo(conHueco, cuenta(terminos(conHueco).join(' + ')))}. The difference has to be a multiple of 11 (0, 11, 22…), and the only digit that does it is ${s}: then ${grupo(conHueco, esta)}, and ${cuenta(resta)}.`;
  });
  const regla = item.divisores.length === 1
    ? (es ? `La cifra del hueco tiene que cumplir el criterio del ${item.divisores[0]}:` : `The digit in the gap has to pass the rule for ${item.divisores[0]}:`)
    : (es ? `La cifra del hueco tiene que cumplir el criterio del ${item.divisores[0]} y el del ${item.divisores[1]}:` : `The digit in the gap has to pass the rules for ${item.divisores[0]} and for ${item.divisores[1]}:`);
  const fin = es ? `La respuesta es ${s} (el número es ${n}).` : `The answer is ${s} (the number is ${n}).`;
  return `<p>${regla}</p><ol class="pasos-ayuda">${pasos.map(p => `<li>${p}</li>`).join('')}</ol><p>${fin}</p>`;
}

/** `explicar(item, respuesta, idioma)`: el HTML de la explicación, con los números del ítem. */
export function explicar(item, respuesta, idioma) {
  if (item.tipo === 'semaforo') return explicarSemaforo(item, idioma);
  if (item.tipo === 'sino') return explicarSino(item, idioma);
  if (item.tipo === 'trampa') return explicarTrampa(item, idioma);
  if (item.tipo === 'cifra') return explicarCifra(item, idioma);
  throw new Error(`Tipo de ítem desconocido: ${item.tipo}`);
}
