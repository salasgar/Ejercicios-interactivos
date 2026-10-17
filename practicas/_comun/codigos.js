// Códigos de las prácticas: el del alumno (4 caracteres, el mismo que en
// `divisores/`) y el de resultado de una tarea de la semana (20 caracteres).
// Los antiguos de resultado de `divisores/` tienen 12 y se siguen leyendo. La
// longitud dice qué es cada uno. (Hubo también un código de resultado por
// práctica, de 16 caracteres; existió hasta el 2026-10-16 y se eliminó: el
// progreso viaja por la nube y el de la tarea es el único respaldo.)
//
// El de una tarea de la semana son 100 bits en 20 símbolos: versión (5, hoy 1),
// tarea (10), número de alumno mezclado (10), qué ★ están terminados (10: un
// bit por ★, en el orden de `tareas.js`), qué ejercicios de elegir están
// terminados (15: igual), fallos de todos los ejercicios de la tarea (10, hasta
// 1023), día (10) y control (30). Ver docs/practicas-unidad2.md, §2.
//
// Va enmascarado para que no se lea a simple vista. No es criptografía: este
// archivo es público, así que quien lo lea puede fabricarse un código. Basta
// para que no se invente a ojo ni se copie el de un compañero (el código dice
// de quién es y de qué tarea).

import { leerCodigoResultado as leerCodigoDivisores } from '../../divisores/logica.js';
import { tareaPorId, TAREAS, MAX_ESTRELLA, MAX_ELEGIR } from './tareas.js';

/** Sin I, O, 0 ni 1, que se confunden al copiar a mano. */
export const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const MAX_ALUMNOS = 1024;

// El código de alumno usa la sal de `divisores/` a propósito: los alumnos
// entran en todas las prácticas con el código que ya tienen.
const SAL_ALUMNO = 'divisores/1eso/2026-27';
const PASO = 389;      // impar: recorre los 1024 valores sin repetir
const DESFASE = 517;

function hash(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

const simbolos = valores => valores.map(v => ALFABETO[v]).join('');
const valores = texto => [...texto].map(c => ALFABETO.indexOf(c));
// `null` y `undefined` son «nada» (con String() saldría 'NULL': 4 símbolos del alfabeto).
const limpiar = texto => String(texto ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const agrupar = texto => texto.match(/.{4}/g).join('-');

const mezclado = indice => (indice * PASO + DESFASE) % MAX_ALUMNOS;
const DESMEZCLADO = new Map(Array.from({ length: MAX_ALUMNOS }, (_, i) => [mezclado(i), i]));

/** Código del alumno número `indice` (0 = el primero de la lista). */
export function codigoAlumno(indice) {
  const s = mezclado(indice);
  const c = hash(`${SAL_ALUMNO}|alumno|${s}`) % 1024;
  return simbolos([s >> 5, s & 31, c >> 5, c & 31]);
}

/** Número de lista de un código de alumno, o `null` si no es válido. */
export function leerCodigoAlumno(texto) {
  const t = limpiar(texto);
  if (t.length !== 4) return null;
  const v = valores(t);
  if (v.includes(-1)) return null;
  const s = (v[0] << 5) | v[1];
  if (hash(`${SAL_ALUMNO}|alumno|${s}`) % 1024 !== ((v[2] << 5) | v[3])) return null;
  return DESMEZCLADO.get(s);
}

// --- Código secreto del alumno (varios profesores, tareas 62 y 72) ----------------
//
// En el sistema nuevo un código tiene 4 u 8 símbolos de `ALFABETO`; cada profesor
// elige la longitud de los que genera (por defecto 8). Los 1024 de 4 que pasan
// la comprobación de `leerCodigoAlumno` son los del modo antiguo («calculables»):
// los de Juan Luis pasan al sistema nuevo tal cual (tarea 70), así que con un
// código de 4 ya no se sabe el sistema sin preguntar a la nube (`resolverCodigo`,
// espacio.js). Aquí solo se mira el formato.

/** Símbolos de un código secreto: 8 por defecto, o 4 si el profesor lo elige. */
export const LONGITUD_SECRETO = 8;
export const LONGITUDES_SECRETO = [4, 8];

/**
 * Código secreto nuevo: `longitud` (4 u 8) símbolos de `ALFABETO` al azar, sin
 * fórmula ni sal (no se puede calcular a partir de nada). `azar` rellena con
 * bytes aleatorios el `Uint8Array` que recibe (como `crypto.getRandomValues`);
 * se inyecta en los tests. Con 32 símbolos y bytes de 256 valores, `byte & 31`
 * reparte parejo (256 es múltiplo de 32): no hay que descartar ningún byte ni
 * queda sesgo. De 4, se descartan los que serían un código antiguo válido (los
 * calculables: 1 de cada 1024) y se sortea otro.
 */
export function codigoSecreto(longitud = LONGITUD_SECRETO, azar = bytes => globalThis.crypto.getRandomValues(bytes)) {
  if (!LONGITUDES_SECRETO.includes(longitud)) throw new Error(`Un código secreto tiene 4 u 8 símbolos, no ${longitud}`);
  for (;;) {
    const codigo = simbolos(Array.from(azar(new Uint8Array(longitud)), b => b & 31));
    if (longitud !== 4 || leerCodigoAlumno(codigo) === null) return codigo;
  }
}

/** Los 4 u 8 símbolos en mayúsculas y sin guiones de un código, o `null` si no tiene ese formato. */
export function leerCodigoSecreto(texto) {
  const t = limpiar(texto);
  return LONGITUDES_SECRETO.includes(t.length) && !valores(t).includes(-1) ? t : null;
}

/** Un código para mostrarlo: `K7QM-P3XA` (uno de 4, tal cual: `K7QM`). */
export const mostrarCodigoSecreto = codigo => agrupar(limpiar(codigo));

/** ¿Es uno de los 1024 códigos del modo antiguo (4 símbolos con su comprobación)? */
export const esCodigoAntiguo = texto => leerCodigoAlumno(texto) !== null;

/**
 * Solo el formato de un código tecleado: `'4'`, `'8'` o `null` si no es un código.
 * No dice el sistema: un código de 4 puede ser del modo antiguo o del nuevo, y
 * eso lo decide `resolverCodigo` (espacio.js) preguntando a la nube.
 */
export function formatoDeCodigo(texto) {
  const t = leerCodigoSecreto(texto);
  return t === null ? null : String(t.length);
}

/**
 * Lo que dice un código de resultado antiguo de `divisores/` (12 caracteres):
 * { practica: 0, indice, ejercicios: [{ terminado, fallos }], dia } o `null`.
 * Cualquier otra longitud no es de práctica: el de 16 ya no existe.
 */
export function leerCodigoResultado(texto) {
  const t = limpiar(texto);
  if (t.length !== 12) return null;
  const viejo = leerCodigoDivisores(t);
  return viejo ? { practica: 0, ...viejo } : null;
}

// --- Código de resultado de una tarea de la semana --------------------------------

const SAL_TAREA = 'practicas/1eso/2026-27/tarea';
const VERSION_TAREA = 1;
const CONTROL_TAREA = 2 ** 30;
const MAX_FALLOS_TAREA = 1023;

const mascaraTarea = (control, i) => hash(`${SAL_TAREA}|mascara|${control}|${i}`) & 31;
const controlTarea = datos => hash(`${SAL_TAREA}|resultado|${datos.join(',')}`) % CONTROL_TAREA;
const bits = lista => lista.reduce((m, hecho, i) => m | (hecho ? 1 << i : 0), 0);
const trocear = (valor, n) => Array.from({ length: n }, (_, i) => Math.floor(valor / 32 ** (n - 1 - i)) & 31);
const juntar = simbolos => simbolos.reduce((v, s) => v * 32 + s, 0);

/**
 * Código de resultado de una tarea de la semana. `estrella` y `elegir` son
 * listas de booleanos (terminado o no), en el orden de la tarea en `tareas.js`;
 * `fallos`, los de todos sus ejercicios (se guardan hasta 1023); `dia`, el del
 * último ejercicio terminado.
 */
export function codigoTarea(tareaId, indice, { estrella = [], elegir = [], fallos = 0, dia = 0 }) {
  if (estrella.length > MAX_ESTRELLA || elegir.length > MAX_ELEGIR) throw new Error('La tarea tiene más ejercicios de los que caben en el código');
  const s = mezclado(indice);
  const datos = [
    VERSION_TAREA,
    ...trocear(tareaId, 2),
    ...trocear(s, 2),
    ...trocear(bits(estrella), 2),
    ...trocear(bits(elegir), 3),
    ...trocear(Math.max(0, Math.min(fallos, MAX_FALLOS_TAREA)), 2),
    ...trocear(dia, 2),
  ];
  const control = controlTarea(datos);
  return agrupar(simbolos([...datos.map((d, i) => d ^ mascaraTarea(control, i)), ...trocear(control, 6)]));
}

/**
 * Lo contrario: { tarea, indice, estrella: [bool], elegir: [bool], fallos,
 * tope, dia } o `null`. Las listas tienen la longitud de la tarea de
 * `tareas.js` (o de `tareas`, la lista de un profesor); un código de una tarea
 * que no existe, o con un ejercicio terminado que la tarea no tiene, no vale.
 */
export function leerCodigoTarea(texto, tareas = TAREAS) {
  const t = limpiar(texto);
  if (t.length !== 20) return null;
  const v = valores(t);
  if (v.includes(-1)) return null;
  const control = juntar(v.slice(14));
  const datos = v.slice(0, 14).map((d, i) => d ^ mascaraTarea(control, i));
  if (controlTarea(datos) !== control || datos[0] !== VERSION_TAREA) return null;
  const tarea = tareaPorId(juntar(datos.slice(1, 3)), tareas);
  if (!tarea) return null;
  const mEstrella = juntar(datos.slice(5, 7)), mElegir = juntar(datos.slice(7, 10));
  if (mEstrella >> tarea.estrella.length || mElegir >> tarea.elegir.length) return null;
  const fallos = juntar(datos.slice(10, 12));
  return {
    tarea: tarea.id,
    indice: DESMEZCLADO.get(juntar(datos.slice(3, 5))),
    estrella: tarea.estrella.map((_, i) => Boolean(mEstrella & (1 << i))),
    elegir: tarea.elegir.map((_, i) => Boolean(mElegir & (1 << i))),
    fallos,
    tope: fallos >= MAX_FALLOS_TAREA,
    dia: juntar(datos.slice(12, 14)),
  };
}

/**
 * Cualquier código de resultado: { tipo: 'tarea', …leerCodigoTarea } para los
 * de 20 caracteres, { tipo: 'practica', …leerCodigoResultado } para los de 12
 * de `divisores/`, o `null`.
 */
export function leerCualquierCodigo(texto) {
  const t = limpiar(texto);
  const dato = t.length === 20 ? leerCodigoTarea(t) : leerCodigoResultado(t);
  return dato ? { tipo: t.length === 20 ? 'tarea' : 'practica', ...dato } : null;
}

/**
 * Todos los códigos de resultado (de 12 y 20 caracteres) que aparezcan en
 * un texto cualquiera, escritos en grupos de cuatro con guiones. Salen también
 * los que tienen la forma pero no son válidos, para poder avisar de ellos.
 *
 * Se buscan tiras de grupos de cuatro (con guion, espacio o nada entre ellos)
 * y cada tira se recorre de izquierda a derecha probando primero el código más
 * largo: así un código seguido (o precedido) de una palabra de cuatro letras
 * («… ABCD-EFGH-JKLM PARA …») o dos códigos separados por un espacio no se
 * confunden con uno más largo.
 */
export function extraerCodigosResultado(texto) {
  const c = '[A-HJ-NP-Z2-9]';
  const patron = new RegExp(`(?<![A-Z0-9])${c}{4}(?:[- ]?${c}{4}){2,}(?![A-Z0-9])`, 'g');
  const encontrados = [];
  for (const tira of (String(texto).toUpperCase().match(patron) ?? []).map(limpiar)) {
    let p = 0, suelto = 0;   // `suelto`: desde dónde no se ha reconocido nada
    const avisar = hasta => {
      // Lo no reconocido entre dos códigos, si tiene la forma de uno, se avisa.
      const resto = tira.slice(suelto, hasta);
      const largo = [20, 12].find(l => resto.length >= l);
      if (largo) encontrados.push(resto.slice(0, largo));
    };
    while (p + 12 <= tira.length) {
      const largo = [20, 12].find(l => p + l <= tira.length && leerCualquierCodigo(tira.slice(p, p + l)));
      if (!largo) { p += 4; continue; }
      avisar(p);
      encontrados.push(tira.slice(p, p + largo));
      p += largo;
      suelto = p;
    }
    avisar(tira.length);
  }
  return [...new Set(encontrados.map(agrupar))];
}
