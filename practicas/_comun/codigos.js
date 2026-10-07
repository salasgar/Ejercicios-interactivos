// Códigos de las prácticas: el del alumno (4 caracteres, el mismo que en
// `divisores/`) y el de resultado (16 caracteres, uno por práctica).
//
// El código de resultado son 80 bits en 16 símbolos de 5 bits: práctica (5),
// número de alumno mezclado (10), seis ejercicios × 5 (terminado + fallos hasta
// 15), día (10) y control (25). Va enmascarado para que no se lea a simple
// vista.
//
// No es criptografía: este archivo es público, así que quien lo lea puede
// fabricarse un código. Basta para que no se invente a ojo ni se copie el de
// un compañero (el código de resultado dice de quién es y de qué práctica).

import { leerCodigoResultado as leerCodigoDivisores } from '../../divisores/logica.js';
import { MAX_EJERCICIOS, practicaPorId } from './catalogo.js';

/** Sin I, O, 0 ni 1, que se confunden al copiar a mano. */
export const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const MAX_ALUMNOS = 1024;

// El código de alumno usa la sal de `divisores/` a propósito: los alumnos
// entran en todas las prácticas con el código que ya tienen.
const SAL_ALUMNO = 'divisores/1eso/2026-27';
const SAL = 'practicas/1eso/2026-27';
const PASO = 389;      // impar: recorre los 1024 valores sin repetir
const DESFASE = 517;
const CONTROL = 2 ** 25;

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
const limpiar = texto => String(texto).toUpperCase().replace(/[^A-Z0-9]/g, '');
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

const mascara = (control, i) => hash(`${SAL}|mascara|${control}|${i}`) & 31;
const controlDe = datos => hash(`${SAL}|resultado|${datos.join(',')}`) % CONTROL;

/**
 * Código de resultado de una práctica. `ejercicios` son los suyos, en orden,
 * con `terminado` y `fallos` (se guardan hasta 15; los que la práctica no
 * tenga van a 0); `dia` es el del último que terminó.
 */
export function codigoResultado(practicaId, indice, ejercicios, dia) {
  const s = mezclado(indice);
  const datos = [
    practicaId & 31,
    s >> 5, s & 31,
    ...Array.from({ length: MAX_EJERCICIOS }, (_, n) => {
      const e = ejercicios[n];
      return e ? (e.terminado ? 16 : 0) | Math.min(e.fallos ?? 0, 15) : 0;
    }),
    (dia >> 5) & 31, dia & 31,
  ];
  const control = controlDe(datos);
  const cola = [20, 15, 10, 5, 0].map(d => Math.floor(control / 2 ** d) & 31);
  return agrupar(simbolos([...datos.map((d, i) => d ^ mascara(control, i)), ...cola]));
}

/**
 * Lo contrario: { practica, indice, ejercicios: [{ terminado, fallos }], dia }
 * o `null`. Los ejercicios se recortan a los que la práctica tiene en el
 * catálogo. Un código de 12 caracteres es de la práctica antigua `divisores/`
 * y se devuelve con `practica: 0`.
 */
export function leerCodigoResultado(texto) {
  const t = limpiar(texto);
  if (t.length === 12) {
    const viejo = leerCodigoDivisores(t);
    return viejo ? { practica: 0, ...viejo } : null;
  }
  if (t.length !== 16) return null;
  const v = valores(t);
  if (v.includes(-1)) return null;
  const control = v.slice(11).reduce((c, x) => c * 32 + x, 0);
  const datos = v.slice(0, 11).map((d, i) => d ^ mascara(control, i));
  if (controlDe(datos) !== control) return null;
  const practica = practicaPorId(datos[0]);
  if (!practica) return null;
  const ejercicios = datos.slice(3, 3 + practica.nEjercicios).map(d => ({ terminado: Boolean(d & 16), fallos: d & 15 }));
  return { practica: practica.id, indice: DESMEZCLADO.get((datos[1] << 5) | datos[2]), ejercicios, dia: (datos[9] << 5) | datos[10] };
}

/**
 * Todos los códigos de resultado (de 12 y de 16 caracteres) que aparezcan en
 * un texto cualquiera, escritos en grupos de cuatro con guiones. Salen también
 * los que tienen la forma pero no son válidos, para poder avisar de ellos.
 */
export function extraerCodigosResultado(texto) {
  const c = '[A-HJ-NP-Z2-9]';
  const patron = new RegExp(`(?<![A-Z0-9])${c}{4}(?:[- ]?${c}{4}){2,3}(?![A-Z0-9])`, 'g');
  const encontrados = (String(texto).toUpperCase().match(patron) ?? []).map(limpiar).map(t => {
    // Cuatro grupos que no son un código de 16 pueden ser uno de 12 seguido
    // (o precedido) de una palabra de cuatro letras: «… ABCD-EFGH-JKLM PARA …».
    if (t.length === 16 && !leerCodigoResultado(t)) {
      if (leerCodigoResultado(t.slice(0, 12))) return t.slice(0, 12);
      if (leerCodigoResultado(t.slice(4))) return t.slice(4);
    }
    return t;
  });
  return [...new Set(encontrados.map(agrupar))];
}
