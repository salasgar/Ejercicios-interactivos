// Cómo se escribe una ficha y un montón: cadenas de HTML, sin DOM (se prueba con `npm test`).
// Cada ficha es un círculo de su color con el primo escrito dentro, siempre: se lee también
// sin distinguir colores. Los nombres de los colores van siempre en los dos idiomas.

import { PRIMOS_FICHA, colores, exp, indice, productoFichas, valor } from './logica.js';

const ES = { 2: ['verde', 'verdes', 'verde'], 3: ['azul', 'azules', 'azul'], 5: ['amarilla', 'amarillas', 'amarillo'], 7: ['roja', 'rojas', 'rojo'] };
const EN = { 2: 'green', 3: 'blue', 5: 'yellow', 7: 'red' };

const blanca = p => p > 7;

/** «verde (green)» o «green (verde)»: un color, en los dos idiomas, para decir «de color …». */
export function colorTxt(p, idioma) {
  // Las notas de feedback se arman todas a la vez; en los errores sin color llega `undefined`.
  if (!(p in EN) && !blanca(p)) return '';
  if (blanca(p)) return idioma === 'en' ? 'white (blanco)' : 'blanco (white)';
  return idioma === 'en' ? `${EN[p]} (${ES[p][2]})` : `${ES[p][2]} (${EN[p]})`;
}

/** Las fichas de un color, contadas: «3 verdes (green)», «1 green (verde)»; la blanca lleva el número. */
export function colorContado(p, e, idioma) {
  if (idioma === 'en') return blanca(p) ? `${e} white ${p} (${e > 1 ? 'blancas' : 'blanca'})` : `${e} ${EN[p]} (${ES[p][e > 1 ? 1 : 0]})`;
  return blanca(p) ? `${e} ${e > 1 ? 'blancas' : 'blanca'} del ${p} (white)` : `${e} ${ES[p][e > 1 ? 1 : 0]} (${EN[p]})`;
}

/** «3 verdes (green), 1 amarilla (yellow)»; sin fichas, «ninguna ficha / no counters». */
export function desglose(m, idioma) {
  const cs = colores(m);
  if (!cs.length) return idioma === 'en' ? 'no counters (ninguna ficha)' : 'ninguna ficha (no counters)';
  return cs.map(p => colorContado(p, exp(m, p), idioma)).join(', ');
}

/** Una ficha: <span> (o <button> si se toca). `clases` y `atributos` son texto ya escrito. */
export function fichaHtml(p, { boton = false, clases = '', atributos = '' } = {}) {
  const c = `fp-ficha fp-ficha--${p}${clases ? ` ${clases}` : ''}`;
  return boton
    ? `<button type="button" class="${c}" ${atributos}>${p}</button>`
    : `<span class="${c}" ${atributos}>${p}</span>`;
}

/** Un montón: las fichas agrupadas por color, de menor a mayor. Vacío, una casilla «ninguna ficha». */
export function montonHtml(m, { clase = '' } = {}) {
  if (!PRIMOS_FICHA.some(p => exp(m, p) > 0)) {
    return `<span class="fp-monton fp-monton--vacio${clase ? ` ${clase}` : ''}">ninguna ficha / no counters (1)</span>`;
  }
  const grupos = colores(m).map(p => `<span class="fp-grupo">${fichaHtml(p).repeat(exp(m, p))}</span>`).join('');
  return `<span class="fp-monton${clase ? ` ${clase}` : ''}" role="img" aria-label="${productoFichas(m)}">${grupos}</span>`;
}

/** «2 · 2 · 2 · 5 = 2³ · 5 = 40»: el producto de las fichas, en potencias y su valor (sin repetir lo que sale igual). */
export function cuentaDe(m) {
  const partes = [productoFichas(m), indice(m), `${valor(m)}`];
  return partes.filter((x, i) => partes.indexOf(x) === i).join(' = ');
}
