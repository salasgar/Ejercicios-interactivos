// «No lo sé» de «Suma y resta decimales»: la explicación de cada ejercicio. Reutiliza la cuenta que ya
// da el feedback (`TX.exN.solucion`, con los números del ítem) y le pone delante la regla y detrás la
// respuesta. Funciones puras; se prueban en `tests/practicas-ayuda-suma-resta-decimales.test.js`.

import { aTexto } from '../_comun/decimales.js';
import { D, CONTEXTOS_MEDIDAS } from './logica.js';
import { TX } from './textos.js';

const respuesta = (idioma, x) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${x}.</strong></p>`;
const valor = (item, idioma) => aTexto(D(item.respuesta ?? item.resultado), idioma);

/** Ejercicio 1 · alinea la coma. */
export function explicaAlinea(item, { idioma, tt }) {
  const regla = idioma === 'en'
    ? 'Write the numbers with the decimal points one under the other, then add or subtract column by column.'
    : 'Escribe los números con las comas una debajo de otra y suma o resta columna a columna.';
  return `<p>${regla}</p><p>${tt(TX.ej1.solucion)(item)}</p>${respuesta(idioma, valor(item, idioma))}`;
}

/** Ejercicio 2 · en el súper. */
export function explicaSuper(item, { idioma, tt }) {
  const es = idioma === 'es';
  const regla = item.pregunta === 'total'
    ? (es ? 'Suma los importes con las comas una debajo de otra.' : 'Add the amounts with the decimal points one under the other.')
    : (es ? 'Primero suma lo que has gastado; después réstalo al billete (la vuelta).' : 'First add up what you spent; then subtract it from the note (la vuelta).');
  const unidad = es ? ' €' : ' euros';
  return `<p>${regla}</p><p>${tt(TX.ej2.solucion)(item)}</p>${respuesta(idioma, `${valor(item, idioma)}${unidad}`)}`;
}

/** Ejercicio 3 · medidas. */
export function explicaMedidas(item, { idioma, tt }) {
  const es = idioma === 'es';
  const regla = {
    resto2: es ? 'Lo que queda es lo que había menos cada trozo: resta uno y luego el otro, con las comas alineadas.'
      : 'What is left is what you had minus each piece: subtract one and then the other, with the decimal points lined up.',
    diferencia: es ? 'La diferencia es la medida mayor menos la menor, con las comas alineadas.'
      : 'The difference is the bigger measure minus the smaller one, with the decimal points lined up.',
    suma2: es ? 'Juntos es la suma, con las comas alineadas.' : 'Together means add, with the decimal points lined up.',
  }[item.forma];
  const unidad = CONTEXTOS_MEDIDAS[item.contexto].unidad;
  return `<p>${regla}</p><p>${tt(TX.ej3.solucion)(item)}</p>${respuesta(idioma, `${valor(item, idioma)} ${unidad}`)}`;
}

/** Ejercicio 4 · mueve la coma. */
export function explicaMueve(item, { idioma, tt }) {
  return `<p>${tt(TX.ej4.solucion)(item)}</p>${respuesta(idioma, valor(item, idioma))}`;
}
