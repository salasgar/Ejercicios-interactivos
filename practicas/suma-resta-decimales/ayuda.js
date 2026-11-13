// «No lo sé» de «Suma y resta decimales»: la explicación de cada ejercicio. La regla va delante, en una
// frase y sin repetirse; después la cuenta con las comas alineadas (la del feedback, `TX.exN.solucion`, o
// paso a paso cuando hay dos operaciones) y al final la respuesta. Funciones puras; se prueban en
// `tests/practicas-ayuda-suma-resta-decimales.test.js`.

import { aTexto, sumar, restar } from '../_comun/decimales.js';
import { D, CONTEXTOS_MEDIDAS } from './logica.js';
import { TX, cuentaAlineada, solucionAlinea, calculoMueve } from './textos.js';

const respuesta = (idioma, x) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${x}.</strong></p>`;
const valor = (item, idioma) => aTexto(D(item.respuesta ?? item.resultado), idioma);
const cuenta = x => `<span class="cuenta">${x}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const opera = (a, op, b) => (op === '+' ? sumar(a, b) : restar(a, b));
/** a ± b ± c en dos pasos, de izquierda a derecha, con las comas alineadas en cada uno. */
function dosPasos(terminos, ops, idioma, sufijo = '') {
  const [a, b, c] = terminos.map(D);
  const r1 = opera(a, ops[0], b);
  const r2 = opera(r1, ops[1], c);
  return pasos([
    `${cuenta(cuentaAlineada([a, b], [ops[0]], r1, idioma, sufijo))}.`,
    `${cuenta(cuentaAlineada([r1, c], [ops[1]], r2, idioma, sufijo))}.`,
  ]);
}

/** Ejercicio 1 · alinea la coma. */
export function explicaAlinea(item, { idioma }) {
  const es = idioma === 'es';
  const tres = item.tipo === 'tres';
  const verbo = tres ? (es ? 'opera' : 'work') : item.op === '+' ? (es ? 'suma' : 'add') : (es ? 'resta' : 'subtract');
  const regla = es
    ? `Pon las comas una debajo de otra, rellena con ceros las cifras que faltan y ${verbo} columna a columna, de derecha a izquierda.${tres ? ' Con tres números, primero la primera cuenta y después la segunda.' : ''}`
    : `Put the decimal points one under the other, fill the gaps with zeros and ${verbo} column by column, from right to left.${tres ? ' With three numbers, do the first operation and then the second.' : ''}`;
  const cuentas = tres ? dosPasos(item.terminos, item.ops, idioma) : `<p>${solucionAlinea(item, idioma)}.</p>`;
  return `<p>${regla}</p>${cuentas}${respuesta(idioma, valor(item, idioma))}`;
}

/** Ejercicio 2 · en el súper. */
export function explicaSuper(item, { idioma, tt }) {
  const es = idioma === 'es';
  const varios = item.importes.length > 1;
  const regla = item.pregunta === 'total'
    ? (es ? 'El total es la suma de los importes, con las comas una debajo de otra.' : 'The total is the sum of the amounts, with the decimal points one under the other.')
    : varios
      ? (es ? 'La vuelta es el billete menos el total: primero suma lo que cuesta todo y después réstalo del billete.'
        : 'The change (la vuelta) is the note minus the total: first add up what everything costs, then take it away from the note.')
      : (es ? 'La vuelta es el billete menos lo que cuesta.' : 'The change (la vuelta) is the note minus what it costs.');
  const unidad = es ? ' €' : ' euros';
  return `<p>${regla}</p><p>${tt(TX.ej2.solucion)(item)}</p>${respuesta(idioma, `${valor(item, idioma)}${unidad}`)}`;
}

/** Ejercicio 3 · medidas. */
export function explicaMedidas(item, { idioma, tt }) {
  const es = idioma === 'es';
  const regla = {
    resto2: es ? 'Lo que queda es lo que había menos lo que se quita: resta una cantidad y después la otra, con las comas alineadas.'
      : 'What is left is what you had minus what is taken away: subtract one amount and then the other, with the decimal points lined up.',
    diferencia: es ? '«Cuánto más» es la medida mayor menos la menor, con las comas alineadas.'
      : '“How much more” is the bigger measure minus the smaller one, with the decimal points lined up.',
    suma2: es ? '«Juntos» es la suma, con las comas alineadas.' : '“Together” means add, with the decimal points lined up.',
  }[item.forma];
  const unidad = CONTEXTOS_MEDIDAS[item.contexto].unidad;
  const cuentas = item.forma === 'resto2' ? dosPasos(item.datos, ['−', '−'], idioma, ` ${unidad}`) : `<p>${tt(TX.ej3.solucion)(item)}</p>`;
  return `<p>${regla}</p>${cuentas}${respuesta(idioma, `${valor(item, idioma)} ${unidad}`)}`;
}

/** Ejercicio 4 · mueve la coma. La regla delante; con un número sin coma, dónde está la coma. */
export function explicaMueve(item, { idioma }) {
  const es = idioma === 'es';
  const por = item.op === 'por';
  const p = 10 ** item.n;
  const d = D(item.d);
  const lugares = es ? (item.n === 1 ? '1 lugar' : `${item.n} lugares`) : (item.n === 1 ? '1 place' : `${item.n} places`);
  const regla = es
    ? `${por ? 'Por' : 'Entre'} ${p}, la coma se mueve ${lugares} a la ${por ? 'derecha' : 'izquierda'}, ${item.n === 1 ? 'porque' : 'uno por cada cero de'} ${p}${item.n === 1 ? ' tiene un cero' : ''}.`
    : `${por ? 'Times' : 'Divided by'} ${p}, the point moves ${lugares} to the ${por ? 'right' : 'left'}, ${item.n === 1 ? 'because' : 'one for each zero in'} ${p}${item.n === 1 ? ' has one zero' : ''}.`;
  const notas = [];
  if (d.k === 0) {
    notas.push(es ? `${aTexto(d, idioma)} no tiene coma: está al final (${aTexto(d, idioma)} = ${aTexto(d, idioma, 1)}).`
      : `${aTexto(d, idioma)} has no point: it is at the end (${aTexto(d, idioma)} = ${aTexto(d, idioma, 1)}).`);
  }
  const enteras = String(Math.abs(d.m)).length - d.k;   // cifras delante de la coma (0,7 → 1)
  if (por && item.n > d.k) notas.push(es ? 'Faltan cifras a la derecha: se ponen ceros.' : 'There are not enough digits on the right: add zeros.');
  if (!por && item.n === enteras) notas.push(es ? 'Delante de la coma no queda ninguna cifra: se pone un 0.' : 'No digit is left in front of the point: write a 0.');
  if (!por && item.n > enteras) notas.push(es ? 'Faltan cifras a la izquierda: se ponen ceros delante.' : 'There are not enough digits on the left: add zeros in front.');
  const R = aTexto(D(item.respuesta).normalizar(), idioma);
  return `<p>${regla}</p>${notas.length ? `<p>${notas.join(' ')}</p>` : ''}<p>${cuenta(`${calculoMueve(item, idioma)} = ${R}`)}.</p>`
    + respuesta(idioma, valor(item, idioma));
}
