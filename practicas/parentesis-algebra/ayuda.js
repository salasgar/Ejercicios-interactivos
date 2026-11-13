// «No lo sé» en «Paréntesis» (tarea 176): la explicación de cada ejercicio, con los números del ítem.

import { TX } from './textos.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';

const cuenta = h => `<span class="cuenta">${h}</span>`;
const respuesta = (idioma, t) => (idioma === 'es' ? `La respuesta es ${t}.` : `The answer is ${t}.`);

const REGLA = {
  es: 'Regla: el número de delante multiplica a cada término del paréntesis, con su signo; si delante hay un «−», todos los signos de dentro cambian.',
  en: 'Rule: the number in front multiplies every term in the brackets, sign included; if there is a “−” in front, every sign inside changes.',
};

export function explicaQuita(item, { idioma, tt }) {
  return `${REGLA[idioma]} ${tt(item.solucion)} ${respuesta(idioma, cuenta(item.htmlCorrecta))}`;
}

export function explicaDesarrollo(item, { idioma, tt }) {
  const buena = item.opciones.find(o => o.correcta);
  return `${REGLA[idioma]} ${tt(item.solucion)} ${respuesta(idioma, cuenta(buena.html))}`;
}

/** «−29/6» → la fracción con raya. */
const conRaya = texto => texto.replace(/(−?)(\d+)\/(\d+)/g, (_, menos, n, d) => htmlFraccion(fraccion(menos ? -Number(n) : Number(n), Number(d))));

export function explicaResuelve(item, { idioma, tt }) {
  // Revisión 191: sin el «Primero…» dos veces, ni «La solución es −29/6» (con barra) justo antes de la respuesta.
  const regla = idioma === 'es'
    ? 'Quita los paréntesis; después pasa los términos con x a un miembro y los números al otro (cambian de signo), suma lo semejante y divide entre el número de la x.'
    : 'Remove the brackets; then move the terms with x to one side and the numbers to the other (their sign changes), add the like terms and divide by the number in front of x.';
  const pasos = tt(item.explicacion).replace(/ (La solución es|The solution is) <strong>[^<]*<\/strong>\.$/, '');
  return `${regla} ${pasos} ${respuesta(idioma, cuenta(`<i>x</i> = ${conRaya(item.solucion)}`))}`;
}

export function explicaErrores(item, { idioma, tt }) {
  const consejo = idioma === 'es'
    ? 'Consejo: haz tú el desarrollo y compáralo con el resultado.'
    : 'Tip: do the expansion yourself and compare it with the result.';
  const nombre = tt(TX.errores[item.correcta]);
  // «Está bien: En 5(−4 + x)…» → «Está bien. En 5(−4 + x)…» (tras «:», minúscula).
  const solucion = tt(item.solucion).replace(/^(Está bien|It is right): /, '$1. ');
  return `${solucion} ${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${idioma === 'es' ? `«${nombre}»` : `“${nombre}”`}. ${consejo}`;
}
