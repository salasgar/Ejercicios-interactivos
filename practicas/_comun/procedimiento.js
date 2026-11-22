// Piezas comunes de las prácticas «Caza el error» (errores, errores1, errores3…errores7), 2026-11-22.
//
// Tres decisiones de Juan Luis al probarlas:
//  · Las líneas NO llevan número: dentro del recuadro se confundía con los números de la cuenta
//    («2= 212 · 9»). Para nombrar una línea se usan ordinales: «la tercera línea».
//  · La primera línea es el enunciado y NO se puede pulsar: en el enunciado no hay error.
//  · El feedback dice la línea con ordinal, el error como frase, la regla rota en negrita y lo correcto.
//
// Puro salvo `lineasPulsables`, que necesita el DOM (y se apoya en `elecciones` de piezas.js).

import { elecciones } from './piezas.js';

const ORDINALES = {
  es: ['primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta', 'séptima', 'octava', 'novena', 'décima'],
  en: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'],
};

/** «tercera» / «third» para el índice 2 (las líneas se cuentan desde 0, y la 0 es el enunciado). */
export function ordinal(i, idioma) {
  const o = ORDINALES[idioma === 'en' ? 'en' : 'es'][i];
  if (!o) throw new Error(`ordinal: no hay ordinal para la línea ${i}`);
  return o;
}

/** «la tercera línea» / «the third line». */
export const lineaN = (i, idioma) => (idioma === 'en' ? `the ${ordinal(i, 'en')} line` : `la ${ordinal(i, 'es')} línea`);

/** «El error está en la tercera línea:» / «The mistake is in the third line:». */
export const errorEnLinea = (i, idioma) => (idioma === 'en' ? `The mistake is in ${lineaN(i, 'en')}:` : `El error está en ${lineaN(i, 'es')}:`);

/** «entre la segunda y la tercera línea» / «between the second and the third line». */
export const entreLineas = (i, j, idioma) => (idioma === 'en'
  ? `between the ${ordinal(i, 'en')} and the ${ordinal(j, 'en')} line`
  : `entre la ${ordinal(i, 'es')} y la ${ordinal(j, 'es')} línea`);

/** «Lo correcto es:» / «The right way is:». */
export const LO_CORRECTO = { es: 'Lo correcto es:', en: 'The right way is:' };

/** La regla rota, en negrita y en su propio renglón. */
export const reglaEnNegrita = html => `<strong class="regla-rota">${html}</strong>`;

/**
 * El cálculo como lista, sin números: `lineasHtml[0]` es el enunciado (va marcado, para que se vea que no es
 * un paso del alumno) y el resto, los pasos.
 */
export function lista(lineasHtml) {
  const filas = lineasHtml.map((h, i) =>
    `<li class="procedimiento__linea${i === 0 ? ' procedimiento__enunciado' : ''}">${h}</li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
}

/**
 * El enunciado fijo (no se puede pulsar) y debajo los pasos como botones. `extra` son opciones que van al
 * final («Todo está bien»). Los valores de los pasos son sus índices en `lineasHtml` (desde 1).
 * Devuelve lo mismo que `elecciones`.
 */
export function lineasPulsables(contenedor, { lineasHtml, alElegir, extra = [] }) {
  const enunciado = document.createElement('div');
  enunciado.className = 'procedimiento__linea procedimiento__enunciado';
  enunciado.innerHTML = lineasHtml[0];
  contenedor.append(enunciado);
  return elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: [...lineasHtml.slice(1).map((h, k) => ({ valor: k + 1, html: h })), ...extra],
    alElegir,
  });
}
