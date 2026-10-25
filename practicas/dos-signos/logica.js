// «Dos signos seguidos» (unidad 3, tarea 84): generadores y explicaciones, PUROS (sin DOM),
// probados en `tests/practicas-dos-signos.test.js`. Los signos se guardan como '+' y '-'
// (el guion es solo un nombre interno); lo que se ve en pantalla se escribe con `MENOS` (U+2212).
//
// Cotas de realismo: aquí no hay contexto, solo cuentas. Primer número, de 1 a 20 (en el
// ejercicio 2, a veces negativo, de −20 a −1); número entre paréntesis, de 1 a 9; resultado,
// siempre entre −30 y 30. Nada de productos, potencias ni paréntesis que envuelvan una operación.

import { MENOS, fmt, distractores, ERRORES_TIPICOS } from '../_comun/enteros.js';

export const A_MAX = 20;
export const B_MAX = 9;
export const TOPE = 30;

/** Errores propios de esta práctica (no están en `ERRORES_TIPICOS` de la base; se proponen en la terminada). */
export const ERROR_DOS_SIGNOS = 'dos-signos-seguidos';
export const ERROR_OTRO = 'otro-error';

/** El signo como se ve: '+' o '−'. */
export const ver = s => (s === '+' ? '+' : MENOS);
/** Signo de un producto de signos: igual con igual da '+'. */
export const mult = (s, t) => (s === t ? '+' : '-');
const veces = s => (s === '+' ? 1 : -1);
/** El entero con su signo, para escribir cuentas: fmt. */
const num = fmt;

// ─── Ejercicio 1: un solo signo ────────────────────────────────────────────────

/**
 * `−(−9)`, `+(−4)`, `−(+6)` (solo) o `5 − (−3)` (con un número delante). El alumno elige el
 * signo que queda y escribe el resultado.
 */
export function generarUnSigno(rng) {
  const op = rng.elegir(['+', '-']);
  const interno = rng.elegir(['+', '-']);
  const b = rng.entero(1, B_MAX);
  const solo = rng.azar() < 0.55;
  const a = solo ? null : rng.entero(1, A_MAX);
  const signo = mult(op, interno);
  const termino = veces(signo) * b;
  const valor = solo ? termino : a + termino;
  const texto = `${solo ? (op === '+' ? '+' : MENOS) : `${a} ${ver(op)} `}(${ver(interno)}${b})`;
  return { tipo: 'unsigno', solo, a, op, interno, b, signo, valor, texto, reescrita: reescritaUnSigno({ solo, a, signo, b }) };
}

/** `5 + 3`, `5 − 3`, `+9`, `−4`: lo que queda al quitar el paréntesis. */
function reescritaUnSigno({ solo, a, signo, b }) {
  return solo ? (signo === '+' ? `${b}` : `${MENOS}${b}`) : `${a} ${ver(signo)} ${b}`;
}

/** Las dos opciones del primer paso: el signo que queda. */
export const SIGNOS_OPCION = ['+', '-'];

/** El error de elegir mal el signo (el contrario del bueno). */
export function errorDeSigno(item) {
  if (!item.solo && item.op === '-' && item.interno === '-') return 'restar-negativo';
  if (!item.solo && item.op === '+' && item.interno === '-') return 'sumar-negativo';
  if (item.solo && item.op === '-' && item.interno === '-') return 'opuesto-del-opuesto';
  return 'signo-cambiado';
}

/** El error que explica un resultado equivocado (o 'otro-error'). */
export function errorDeValor(item, respuesta) {
  const termino = veces(item.signo) * item.b;
  if (!item.solo) {
    const b = veces(item.interno) * item.b;
    const id = item.interno === '-' ? (item.op === '-' ? 'restar-negativo' : 'sumar-negativo') : null;
    if (id && distractores([[id, item.a, b]], item.valor).some(d => d.valor === respuesta)) return id;
  } else if (item.op === '-' && item.interno === '-' && respuesta === -item.b) {
    return 'opuesto-del-opuesto';
  }
  if (respuesta === (item.solo ? -termino : item.a - termino)) return 'signo-cambiado';
  return ERROR_OTRO;
}

// ─── Ejercicio 2: sumar o restar un negativo ───────────────────────────────────

/** `5 + (−3)` o `5 − (−3)`; el primer número, a veces negativo (`−12 − (−9)`). */
export function generarNegativo(rng) {
  const op = rng.elegir(['+', '-']);
  const b = rng.entero(1, B_MAX);
  const a = (rng.azar() < 0.25 ? -1 : 1) * rng.entero(1, A_MAX);
  const signo = op === '+' ? '-' : '+'; // el signo que queda delante de b
  const valor = a + veces(signo) * b;
  return { tipo: 'negativo', a, op, b, signo, valor, texto: `${num(a)} ${ver(op)} (${MENOS}${b})`, reescrita: `${num(a)} ${ver(signo)} ${b}` };
}

/** El error de elegir mal el signo del primer paso. */
export const errorDeNegativo = item => (item.op === '+' ? 'sumar-negativo' : 'restar-negativo');

/** El error que explica un resultado equivocado en el segundo paso. */
export function errorDeValorNegativo(item, respuesta) {
  const id = errorDeNegativo(item);
  if (distractores([[id, item.a, -item.b]], item.valor).some(d => d.valor === respuesta)) return id;
  return respuesta === -item.valor ? 'signo-cambiado' : ERROR_OTRO;
}

// ─── Ejercicio 3: quita los paréntesis y calcula ───────────────────────────────

/**
 * Entre tres y cinco números con paréntesis: `(−4) − (+6) + (−2) − (−9)`. Cada término
 * es { op, interno, mag, signo }: `op` es el signo de delante (null en el primero),
 * `interno` el del paréntesis y `signo` el que queda al quitar el paréntesis.
 */
export function generarQuita(rng) {
  for (;;) {
    const n = rng.entero(3, 5);
    const lista = [];
    for (let i = 0; i < n; i++) {
      const op = i === 0 ? null : rng.elegir(['+', '-']);
      const interno = rng.elegir(['+', '-']);
      lista.push({ op, interno, mag: rng.entero(1, B_MAX), signo: op === null ? interno : mult(op, interno) });
    }
    const valor = valorDe(lista);
    const buena = Math.abs(valor) <= TOPE
      && lista.some(t => t.signo === '-')
      && lista.some(t => t.interno === '+')
      && lista.some(t => t.interno === '-');
    if (buena) return { tipo: 'quita', terminos: lista, valor, texto: textoConParentesis(lista), reescrita: textoSinParentesis(lista.map(t => t.signo), lista) };
  }
}

const valorDe = lista => lista.reduce((suma, t) => suma + veces(t.signo) * t.mag, 0);

function textoConParentesis(lista) {
  return lista.map((t, i) => `${i === 0 ? '' : `${ver(t.op)} `}(${ver(t.interno)}${t.mag})`).join(' ');
}

/** El texto sin paréntesis con esos signos: `−4 − 6 − 2 + 9` (el + del primero no se escribe). */
export function textoSinParentesis(signos, lista) {
  return lista.map((t, i) => (i === 0 ? (signos[0] === '-' ? MENOS : '') + t.mag : `${ver(signos[i])} ${t.mag}`)).join(' ');
}

/** ¿Son los signos que quedan? */
export const esReescrituraCorrecta = (item, signos) => item.terminos.every((t, i) => signos[i] === t.signo);

/** El primer término mal reescrito, o null. */
export const primerFallo = (item, signos) => {
  const i = item.terminos.findIndex((t, k) => signos[k] !== t.signo);
  return i < 0 ? null : i;
};

/** El error de un término mal reescrito. */
export function errorDeTermino(t) {
  if (t.op === '-' && t.interno === '-') return 'restar-negativo';
  if (t.op === '+' && t.interno === '-') return 'sumar-negativo';
  return 'signo-cambiado';
}

/** El valor que da la reescritura del alumno. */
export const valorConSignos = (item, signos) => item.terminos.reduce((s, t, i) => s + veces(signos[i]) * t.mag, 0);

// ─── Ejercicio 4: ¿cuál está bien escrita? ─────────────────────────────────────

/**
 * Tres escrituras de la misma cuenta: solo una con el paréntesis (`5 − (−3)`); las otras,
 * con los dos signos seguidos (`5 − −3`, `5 − − 3`, `5 −− 3`). Es una convención de escritura,
 * así que solo se pregunta cuál está bien escrita, nunca cuánto vale.
 */
export function generarBienEscrita(rng) {
  const op = rng.elegir(['+', '-']);
  const interno = rng.azar() < 0.7 ? '-' : '+';
  const a = rng.entero(1, A_MAX);
  const b = rng.entero(1, B_MAX);
  const o = ver(op), i = ver(interno);
  const buena = `${a} ${o} (${i}${b})`;
  const malas = rng.barajar([`${a} ${o} ${i}${b}`, `${a} ${o} ${i} ${b}`, `${a} ${o}${i} ${b}`]).slice(0, 2);
  const opciones = rng.barajar([
    { texto: buena, bien: true, error: null },
    ...malas.map(texto => ({ texto, bien: false, error: ERROR_DOS_SIGNOS })),
  ]);
  return { tipo: 'bienescrita', a, op, interno, b, buena, opciones, valor: a + veces(mult(op, interno)) * b };
}

/** Las opciones como textos, para la clave y las pruebas. */
export const textosDeOpciones = item => item.opciones.map(o => o.texto);

export { ERRORES_TIPICOS };
