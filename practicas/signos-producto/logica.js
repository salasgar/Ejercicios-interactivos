// «La regla de los signos» (unidad 3, tarea 85): generadores y ayudas de error, PUROS (sin DOM),
// probados en `tests/practicas-signos-producto.test.js`. El menos que se ve es siempre U+2212.
//
// Cotas de realismo (aquí no hay contexto, solo cuentas): factores de 2 a 12 en valor absoluto
// (en el factor que falta, hasta 10), cocientes de 1 a 12, sumas y restas con números de 1 a 9.
// Productos y cocientes nunca salen antes de la sesión 6; en el ejercicio 4 (sesión 7) se mezclan
// con sumas y restas. Ni potencias ni paréntesis que envuelvan una operación.

import {
  MENOS, fmt, fmtPar, distractores,
  signoDelMayorEnProducto, signoDelMayorEnCociente, reglaSignosEnSuma,
} from '../_comun/enteros.js';

export const ERROR_OTRO = 'otro-error';
/** Errores propios de esta práctica (no están en `ERRORES_TIPICOS` de la base; se proponen en la terminada). */
export const ERROR_DOS_SIGNOS = 'dos-signos-seguidos';
export const ERROR_DIVIDE_ENTRE_0 = 'divide-entre-cero';

export const ver = s => (s === '+' ? '+' : MENOS);
const signoDe = n => (n < 0 ? '-' : '+');
const opuesto = s => (s === '+' ? '-' : '+');
const conSigno = (rng, min, max) => (rng.azar() < 0.5 ? -1 : 1) * rng.entero(min, max);

export const SIGNOS_OPCION = ['+', '-'];

// ─── Ejercicio 1: multiplica ───────────────────────────────────────────────────

/** `−3 · (−4)`, `5 · (−2)`: primero el signo del producto y después su valor. */
export function generarMultiplica(rng) {
  const a = conSigno(rng, 2, 12), b = conSigno(rng, 2, 12);
  const valor = a * b;
  return { tipo: 'multiplica', a, b, valor, signo: signoDe(valor), texto: `${fmt(a)} · ${fmtPar(b)}` };
}

/** El error de elegir mal el signo del producto. */
export function errorDeSignoProducto(item) {
  const c = signoDelMayorEnProducto(item.a, item.b);
  return c !== null && signoDe(c) === opuesto(item.signo) ? 'signo-del-mayor-producto' : 'signo-cambiado';
}

/** El error que explica un valor equivocado de un producto. */
export function errorDeValorProducto(item, r) {
  if (distractores([['signo-del-mayor-producto', item.a, item.b]], item.valor).some(d => d.valor === r)) return 'signo-del-mayor-producto';
  return r === -item.valor ? 'signo-cambiado' : ERROR_OTRO;
}

// ─── Ejercicio 2: divide ───────────────────────────────────────────────────────

/**
 * División exacta con la regla de los signos. Uno de cada seis ítems, `0 : (−4)` (vale 0);
 * uno de cada doce, `(−4) : 0` (no se puede: `valor` es null).
 */
export function generarDivide(rng) {
  const r = rng.azar();
  if (r < 1 / 12) {
    const a = conSigno(rng, 1, 12);
    return { tipo: 'divide', especial: 'entre-cero', a, b: 0, valor: null, texto: `${fmt(a)} : 0` };
  }
  if (r < 1 / 12 + 1 / 6) {
    const b = conSigno(rng, 2, 12);
    return { tipo: 'divide', especial: 'cero-entre', a: 0, b, valor: 0, texto: `0 : ${fmtPar(b)}` };
  }
  const b = conSigno(rng, 2, 12), q = conSigno(rng, 1, 12);
  return { tipo: 'divide', especial: null, a: q * b, b, valor: q, texto: `${fmt(q * b)} : ${fmtPar(b)}` };
}

/** El error que explica una respuesta equivocada (r es un entero, o 'no-se-puede'). */
export function errorDeDivide(item, r) {
  if (item.especial === 'entre-cero') return r === 'no-se-puede' ? null : ERROR_DIVIDE_ENTRE_0;
  if (r === 'no-se-puede') return ERROR_DIVIDE_ENTRE_0;
  if (item.especial === null && distractores([['signo-del-mayor-cociente', item.a, item.b]], item.valor).some(d => d.valor === r)) return 'signo-del-mayor-cociente';
  return item.valor !== 0 && r === -item.valor ? 'signo-cambiado' : ERROR_OTRO;
}

// ─── Ejercicio 3: el factor que falta ──────────────────────────────────────────

/** `□ · (−4) = 20` o `(−3) · □ = −21`. Factores de 2 a 10 en valor absoluto. */
export function generarFalta(rng) {
  const k = conSigno(rng, 2, 10), x = conSigno(rng, 2, 10);
  const p = k * x;
  const hueco = rng.azar() < 0.5 ? 'izq' : 'der';
  const texto = hueco === 'izq' ? `□ · ${fmtPar(k)} = ${fmt(p)}` : `${fmtPar(k)} · □ = ${fmt(p)}`;
  return { tipo: 'falta', k, p, hueco, valor: x, texto };
}

export function errorDeFalta(item, r) {
  if (distractores([['signo-del-mayor-cociente', item.p, item.k]], item.valor).some(d => d.valor === r)) return 'signo-del-mayor-cociente';
  return r === -item.valor ? 'signo-cambiado' : ERROR_OTRO;
}

// ─── Ejercicio 4: ¿suma o producto? ────────────────────────────────────────────

/** `−2 − 3`, `−2 + 3`, `(−2) · (−3)`, `(−2) · 3`: primero qué es y después el valor. */
export function generarSumaOProducto(rng) {
  const clase = rng.elegir(['resta', 'suma', 'producto']);
  if (clase === 'producto') {
    let a, b;
    do { a = conSigno(rng, 2, 9); b = conSigno(rng, 2, 9); } while (a > 0 && b > 0);
    return { tipo: 'sumaproducto', clase, producto: true, a, b, valor: a * b, texto: `${fmtPar(a)} · ${fmtPar(b)}` };
  }
  const a = (clase === 'suma' || rng.azar() < 0.6 ? -1 : 1) * rng.entero(1, 9), b = rng.entero(1, 9);
  const valor = clase === 'suma' ? a + b : a - b;
  return { tipo: 'sumaproducto', clase, producto: false, a, b, valor, texto: `${fmt(a)} ${clase === 'suma' ? '+' : MENOS} ${b}` };
}

/** El error de decidir mal qué es. */
export function errorDeClase(item) {
  if (item.producto) return signoDelMayorEnProducto(item.a, item.b) !== null ? 'signo-del-mayor-producto' : 'signo-cambiado';
  return item.clase === 'resta' && reglaSignosEnSuma(item.a, -item.b) !== null ? 'regla-signos-en-suma' : 'signo-cambiado';
}

/** El error que explica un valor equivocado. */
export function errorDeValorSumaProducto(item, r) {
  const candidatos = item.producto
    ? [['signo-del-mayor-producto', item.a, item.b]]
    : [['regla-signos-en-suma', item.a, item.clase === 'suma' ? item.b : -item.b]];
  const d = distractores(candidatos, item.valor).find(x => x.valor === r);
  if (d) return d.error;
  return r === -item.valor ? 'signo-cambiado' : ERROR_OTRO;
}

// ─── Ejercicio 5: ¿cuál está bien escrito? ─────────────────────────────────────

/** `5 · (−2)` bien; `5 · −2`, `5 · − 2`, `5 ·− 2` mal. Solo se pregunta cuál está bien escrito. */
export function generarBienEscrito(rng) {
  const a = conSigno(rng, 2, 9), b = rng.entero(2, 9);
  const buena = `${fmt(a)} · (${MENOS}${b})`;
  const malas = rng.barajar([`${fmt(a)} · ${MENOS}${b}`, `${fmt(a)} · ${MENOS} ${b}`, `${fmt(a)} ·${MENOS} ${b}`]).slice(0, 2);
  const opciones = rng.barajar([
    { texto: buena, bien: true, error: null },
    ...malas.map(texto => ({ texto, bien: false, error: ERROR_DOS_SIGNOS })),
  ]);
  return { tipo: 'bienescrito', a, b, buena, opciones, valor: -a * b };
}
