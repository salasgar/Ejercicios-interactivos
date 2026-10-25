// Práctica «Opuesto y valor absoluto» (unidad 3, tarea 81): lógica pura (sin DOM ni red),
// probada en `tests/practicas-opuestos.test.js`. Los generadores devuelven DATOS.
// Destrezas: U3-1C-07 (ej. 1), U3-1C-08 (ej. 2), U3-1C-09 (ej. 3), U3-1C-10 (ej. 4).

/** Las rectas dibujadas: de −10 a 10 de 1 en 1 (el ejercicio 3 usa más: ver `rectaPara`). */
export const RECTA = { min: -10, max: 10, paso: 1 };

/** La recta (de 5 en 5 hasta 25 si hace falta) donde caben `valores` y sus opuestos. */
export function rectaPara(valores) {
  const m = Math.max(...valores.map(Math.abs));
  return m <= 10 ? { min: -10, max: 10, paso: 1 } : { min: -20, max: 20, paso: 2 };
}

// ─── Ejercicio 1: el opuesto ───────────────────────────────────────────────────────

/**
 * Ítem: { modo, n }. 'toca' (dos de cada tres): el punto n (de −9 a 9, no el 0) y el
 * alumno toca su opuesto. 'doble' (uno de cada tres): n negativo y se pregunta cuánto es −(n).
 */
export function generarOpuesto(rng) {
  if (rng.azar() < 1 / 3) return { modo: 'doble', n: -rng.entero(1, 9) };
  const n = rng.entero(1, 9) * (rng.azar() < 0.5 ? -1 : 1);
  return { modo: 'toca', n };
}

/** El opuesto del ítem (lo que hay que tocar o escribir). */
export const opuestoDe = item => -item.n;

/** Qué error explica `respuesta` (el valor tocado o escrito) en vez del opuesto. */
export function errorOpuesto(item, respuesta) {
  if (respuesta === item.n) return item.modo === 'doble' ? 'opuesto-del-opuesto' : 'sin-cambiar-el-signo';
  return 'opuesto-incorrecto';
}

// ─── Ejercicio 2: distancia al cero ────────────────────────────────────────────────

/** Ítem: { n } entre −10 y 10; la mitad, negativos; el 0, una de cada doce. */
export function generarDistancia(rng) {
  if (rng.azar() < 1 / 12) return { n: 0 };
  return { n: rng.entero(1, 10) * (rng.azar() < 0.55 ? -1 : 1) };
}

/** Error de `respuesta` en vez de |n|. */
export function errorDistancia(item, respuesta) {
  if (respuesta === item.n && item.n < 0) return 'valor-absoluto-negativo';
  if (respuesta === -Math.abs(item.n)) return 'valor-absoluto-negativo';
  return 'distancia-incorrecta';
}

// ─── Ejercicio 3: opuesto y valor absoluto ─────────────────────────────────────────

/** Ítem: { n } de 1 a 20 en valor absoluto, mitad positivos y mitad negativos. */
export function generarOpuestoYAbsoluto(rng) {
  return { n: rng.entero(1, 20) * (rng.azar() < 0.5 ? -1 : 1) };
}

/** Errores de cada hueco ('opuesto' o 'absoluto'), o null si está bien. */
export function errorHueco(item, hueco, respuesta) {
  const bien = hueco === 'opuesto' ? -item.n : Math.abs(item.n);
  if (respuesta === bien) return null;
  if (hueco === 'opuesto') return respuesta === item.n ? (item.n < 0 ? 'opuesto-del-opuesto' : 'sin-cambiar-el-signo') : 'opuesto-incorrecto';
  if (respuesta === -Math.abs(item.n)) return 'valor-absoluto-negativo';
  if (respuesta === -item.n && item.n > 0) return 'absoluto-como-opuesto';
  return 'distancia-incorrecta';
}

// ─── Ejercicio 4: ¿quiénes están a esa distancia? ──────────────────────────────────

/**
 * Ítem: { modo: 'marcar', k } con el valor absoluto k de 1 a 10 (hay que marcar k y −k),
 * o { modo: 'comparar', a, b } con dos negativos distintos de −1 a −10 (se pregunta cuál es mayor).
 */
export function generarDistancias(rng) {
  if (rng.azar() < 0.5) return { modo: 'marcar', k: rng.entero(1, 10) };
  let a, b;
  do { a = -rng.entero(1, 10); b = -rng.entero(1, 10); } while (a === b);
  return { modo: 'comparar', a, b };
}

/** Los enteros que hay que marcar. */
export const aMarcar = item => [-item.k, item.k];

/** El mayor de los dos negativos (el de menor valor absoluto). */
export const mayorDe = item => Math.max(item.a, item.b);

/** Error al marcar: { marcados } contra los dos buenos. */
export function errorMarcar(item, marcados) {
  const buenos = aMarcar(item);
  const aciertos = marcados.filter(v => buenos.includes(v));
  if (aciertos.length === marcados.length && marcados.length < 2) return 'solo-uno';
  return 'marca-mal';
}

/** ¿Están marcados exactamente los dos buenos? */
export const marcarBien = (item, marcados) => marcados.length === 2 && aMarcar(item).every(v => marcados.includes(v));
