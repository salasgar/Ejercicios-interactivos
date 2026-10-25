// Práctica «La recta y el termómetro» (unidad 3, tarea 80): lógica pura (sin DOM ni red),
// probada en `tests/practicas-termometro.test.js`. Los generadores devuelven DATOS.
// Destrezas: U3-1C-02 (ej. 5), U3-1C-03 (ej. 1), U3-1C-04 (ej. 2), U3-1C-05 (ej. 3), U3-1C-06 (ej. 4).

import { fmt, comparaComoNaturales, ordenaComoNaturales, signoCambiado } from '../_comun/enteros.js';

// ─── Ejercicio 1: coloca el entero ────────────────────────────────────────────────
//
// Dos rectas: de −10 a 10 de 1 en 1 (21 marcas) y de −20 a 20 de 2 en 2 (también 21:
// con 41 marcas la zona de toque no llega a 15 px en un móvil). En ambas van escritos
// el 0, los extremos y los múltiplos de 5 (o de 10): el entero pedido nunca lleva su
// número escrito, y no es el 0.

export const RECTAS = [
  { min: -10, max: 10, paso: 1, cada: 5 },
  { min: -20, max: 20, paso: 2, cada: 10 },
];

/** Los valores con número escrito en una recta (el 0, los extremos y los múltiplos de `cada`). */
export function escritos({ min, max, paso, cada }) {
  const lista = [];
  for (let v = min; v <= max; v += paso) if (v === 0 || v === min || v === max || v % cada === 0) lista.push(v);
  return lista;
}

/** Ítem: { min, max, paso, cada, numeros, objetivo }. Seis de cada diez, negativos. */
export function generarColoca(rng) {
  const recta = rng.azar() < 0.65 ? RECTAS[0] : RECTAS[1];
  const escrita = escritos(recta);
  const candidatos = [];
  for (let v = recta.min; v <= recta.max; v += recta.paso) if (!escrita.includes(v)) candidatos.push(v);
  const signo = rng.azar() < 0.6 ? -1 : 1;
  const objetivo = rng.elegir(candidatos.filter(v => Math.sign(v) === signo));
  return { ...recta, numeros: escrita, objetivo };
}

/** Qué ha hecho el alumno al tocar `toque` en vez de `objetivo`: 'signo-cambiado', 'vecina' (una marca al lado) o 'otra'. */
export function errorColoca(item, toque) {
  if (toque === signoCambiado(item.objetivo)) return 'signo-cambiado';
  if (Math.abs(toque - item.objetivo) === item.paso) return 'marca-vecina';
  return 'otra-marca';
}

// ─── Ejercicio 2: ¿qué temperatura marca? ─────────────────────────────────────────

/** Contextos con su cota creíble (temperatura que puede marcar el termómetro). */
export const CONTEXTOS_TEMPERATURA = {
  ciudad: { min: -30, max: 45 },
  montana: { min: -30, max: 20 },
};

/** Termómetros: hasta dónde llega la escala (de −lim a lim) según de cuánto en cuánto va. */
export const TERMOMETROS = [
  { paso: 1, lim: 10 },
  { paso: 1, lim: 15 },
  { paso: 2, lim: 20 },
  { paso: 5, lim: 30 },
  { paso: 5, lim: 40 },
];

/** Ítem: { contexto, min, max, paso, valor }. Dos de cada tres, de 1 en 1; el resto, de 2 en 2 o de 5 en 5. */
export function generarTemperatura(rng) {
  const t = rng.azar() < 0.65 ? rng.elegir(TERMOMETROS.filter(x => x.paso === 1)) : rng.elegir(TERMOMETROS.filter(x => x.paso > 1));
  const contexto = rng.elegir(Object.keys(CONTEXTOS_TEMPERATURA));
  const cota = CONTEXTOS_TEMPERATURA[contexto];
  const posibles = [];
  for (let v = -t.lim + t.paso; v < t.lim; v += t.paso) {
    if (v >= cota.min && v <= cota.max && (v !== 0 || rng.azar() < 0.15)) posibles.push(v);
  }
  // Sobre todo valores negativos: es lo que cuesta.
  const negativos = posibles.filter(v => v < 0);
  const valor = rng.elegir(rng.azar() < 0.6 && negativos.length ? negativos : posibles);
  return { contexto, min: -t.lim, max: t.lim, paso: t.paso, valor };
}

/** Qué error explica `respuesta` en vez de `valor`. */
export function errorTemperatura(item, respuesta) {
  if (respuesta === signoCambiado(item.valor)) return 'signo-cambiado';
  if (item.paso > 1 && Math.abs(respuesta) === Math.abs(item.valor) / item.paso) return 'cuenta-marcas';
  return 'lectura-incorrecta';
}

// ─── Ejercicio 3: mayor o menor ───────────────────────────────────────────────────

/** Tipos de pareja y su peso: dos negativos (≥ 30 %), con el 0 (≥ 10 %), un positivo y un negativo de mayor valor absoluto, y dos positivos. */
const REPARTO_PAREJAS = [['negativos', 0.4], ['con-cero', 0.15], ['mixta-absoluto', 0.3], ['positivos', 0.15]];
const LIMITE = 10;

function elegirTipo(rng) {
  let r = rng.azar();
  for (const [tipo, peso] of REPARTO_PAREJAS) { if (r < peso) return tipo; r -= peso; }
  return 'positivos';
}

/** Ítem: { tipo, a, b } con a ≠ b, entre −10 y 10. */
export function generarComparar(rng) {
  const tipo = elegirTipo(rng);
  let a, b;
  if (tipo === 'negativos') {
    do { a = -rng.entero(1, LIMITE); b = -rng.entero(1, LIMITE); } while (a === b);
  } else if (tipo === 'con-cero') {
    a = 0; b = rng.entero(1, LIMITE) * (rng.azar() < 0.6 ? -1 : 1);
  } else if (tipo === 'mixta-absoluto') {
    const neg = rng.entero(4, LIMITE);
    b = -neg; a = rng.entero(1, neg - 1);
  } else {
    do { a = rng.entero(1, LIMITE); b = rng.entero(1, LIMITE); } while (a === b);
  }
  return rng.azar() < 0.5 ? { tipo, a, b } : { tipo, a: b, b: a };
}

/** El símbolo que va entre a y b: '<' o '>'. */
export const simbolo = ({ a, b }) => (a < b ? '<' : '>');

/** El error de contestar `elegido`: comparar como naturales (dos negativos) o por valor absoluto (un negativo grande frente a un positivo). */
export function errorComparar(item, elegido) {
  if (elegido === simbolo(item)) return null;
  if (comparaComoNaturales(item.a, item.b) === elegido) return 'compara-como-naturales';
  return 'compara-valor-absoluto';
}

// ─── Ejercicio 4: ordena ──────────────────────────────────────────────────────────

/** Ítem: { numeros, creciente }: de cuatro a seis enteros distintos entre −15 y 15, al menos dos negativos y uno positivo. */
export function generarOrden(rng) {
  const cuantos = rng.entero(4, 6);
  const negativos = rng.entero(2, Math.min(4, cuantos - 1));
  const cero = rng.azar() < 0.4 && cuantos - negativos >= 2;
  const usados = new Set();
  const poner = (min, max) => { let v; do { v = rng.entero(min, max); } while (usados.has(v)); usados.add(v); };
  for (let i = 0; i < negativos; i++) poner(-15, -1);
  if (cero) usados.add(0);
  while (usados.size < cuantos) poner(1, 15);
  return { numeros: rng.barajar([...usados]), creciente: rng.azar() < 0.55 };
}

/** La lista bien ordenada. */
export const ordenCorrecto = ({ numeros, creciente }) => [...numeros].sort((x, y) => (creciente ? x - y : y - x));

/** ¿Es correcto el orden del alumno? */
export const ordenBien = (item, lista) => lista.length === item.numeros.length && lista.join() === ordenCorrecto(item).join();

/** El error de un orden equivocado. */
export function errorOrden(item, lista) {
  const naturales = ordenaComoNaturales(item.numeros, item.creciente);
  if (naturales && naturales.join() === lista.join()) return 'ordena-como-naturales';
  const revés = [...ordenCorrecto(item)].reverse();
  if (revés.join() === lista.join()) return 'orden-al-reves';
  return 'orden-incorrecto';
}

/** La lista con el símbolo entre cada par: «−7 < −2 < 0». */
export const cadenaOrden = item => ordenCorrecto(item).map(fmt).join(item.creciente ? ' &lt; ' : ' &gt; ');

// ─── Ejercicio 5: ¿positivo, negativo o ninguno? ──────────────────────────────────

/** La caja que le toca a un entero. */
export const cajaDe = v => (v > 0 ? 'positivo' : v < 0 ? 'negativo' : 'ninguno');

/**
 * Ítem: { numeros: [{ valor, mas }] } con ocho enteros distintos, siempre el 0 (que
 * nunca lleva más), al menos dos positivos y dos negativos. En la mitad de los ítems,
 * uno o dos positivos se escriben con el signo (`+5`): `mas` es true.
 */
export function generarClases(rng) {
  const positivos = rng.entero(2, 5);
  const negativos = 7 - positivos;
  const usados = new Set([0]);
  const poner = (signo, cuantos) => {
    for (let i = 0; i < cuantos; i++) { let v; do { v = signo * rng.entero(1, 20); } while (usados.has(v)); usados.add(v); }
  };
  poner(1, positivos);
  poner(-1, negativos);
  const lista = rng.barajar([...usados]).map(valor => ({ valor, mas: false }));
  if (rng.azar() < 0.5) {
    const ps = lista.filter(x => x.valor > 0);
    const cuantos = Math.min(ps.length, rng.entero(1, 2));
    for (const x of rng.barajar(ps).slice(0, cuantos)) x.mas = true;
  }
  return { numeros: lista };
}

/** Cómo se escribe un número del ejercicio 5: `+5` si lleva el más, si no, `fmt`. */
export const escribe = ({ valor, mas }) => (mas && valor > 0 ? `+${valor}` : fmt(valor));

/** Los fallos de una respuesta { índice → caja }: lista de { numero, puesto, correcto }. */
export function fallosClases(item, respuesta) {
  const fallos = [];
  item.numeros.forEach((n, i) => {
    const correcto = cajaDe(n.valor);
    if (respuesta[i] !== correcto) fallos.push({ numero: n, puesto: respuesta[i], correcto });
  });
  return fallos;
}

/** El error del primer fallo: el 0 en positivos o negativos, un +5 en otra caja, u otro. */
export function errorClases(fallos) {
  if (fallos.some(f => f.numero.valor === 0)) return 'cero-con-signo';
  if (fallos.some(f => f.numero.mas)) return 'mas-no-es-positivo';
  return 'caja-equivocada';
}
