// Coloca los paréntesis. Con fracciones: textos propios, siempre { es, en }. Los de la interfaz
// son los comunes de `../_comun/parentesis-textos.js`; aquí van las introducciones y el consejo
// del «No lo sé». En inglés, «brackets».
// En esta práctica no hay agrupaciones imposibles a la vista (el generador las descarta).

import { crearPantalla } from '../_comun/parentesis-pantalla.js';
import { M } from './logica.js';

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Tres números', en: 'Three numbers' },
      detalle: { es: 'Con paréntesis, ¿qué resultados salen?', en: 'With brackets, which results can you get?' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Verás una operación con fracciones. Si colocas paréntesis, el orden de las operaciones puede cambiar y el resultado también.</p>
          <p>Toca el hueco que hay a la izquierda de un número para poner <strong>(</strong> y el de la derecha para poner <strong>)</strong>. Tócalo otra vez para poner dos, y otra más para quitarlos.</p>
          <p>Debajo están los <strong>resultados posibles</strong>, apagados y simplificados. Cada vez que consigas uno, se enciende. ¡Encuéntralos todos!</p>`,
        en: `<h2>How it works</h2>
          <p>You will see a calculation with fractions. If you place brackets, the order of the operations can change, and so can the result.</p>
          <p>Tap the space on the left of a number to put <strong>(</strong>, and the one on the right to put <strong>)</strong>. Tap again for two, and once more to remove them.</p>
          <p>Below you will see the <strong>possible results</strong>, switched off and simplified. Each time you get one, it switches on. Find them all!</p>`,
      },
    },
    {
      nombre: { es: 'Con división', en: 'With division' },
      detalle: { es: 'Cuatro números y alguna división', en: 'Four numbers and a division' },
      introduccion: {
        es: `<h2>Con cuatro números</h2>
          <p>Ahora hay cuatro números y alguna división. Recuerda: primero lo de dentro del paréntesis; después, productos y divisiones, de izquierda a derecha; al final, sumas y restas.</p>
          <p>Dos resultados equivalentes son el mismo resultado: cada uno sale una sola vez, simplificado.</p>`,
        en: `<h2>With four numbers</h2>
          <p>Now there are four numbers and a division. Remember: first the inside of the brackets; then products and divisions, from left to right; last, sums and subtractions.</p>
          <p>Two equivalent results are the same result: each one appears only once, simplified.</p>`,
      },
    },
    {
      nombre: { es: 'Una sola diana', en: 'One target' },
      detalle: { es: 'Coloca paréntesis para obtener el número pedido', en: 'Place brackets to get the number you are asked for' },
      introduccion: {
        es: `<h2>Como en el examen</h2>
          <p>Te pedimos un número. Coloca los paréntesis para que la operación dé exactamente ese resultado y pulsa <strong>Comprobar</strong>.</p>`,
        en: `<h2>Like in the exam</h2>
          <p>We ask you for a number. Place the brackets so that the calculation gives exactly that result, and press <strong>Check</strong>.</p>`,
      },
    },
  ],
};

export const PROPIOS = {};
export const P = crearPantalla(M, PROPIOS);

/** «No lo sé» de cada ejercicio. */
export const EXPLICACIONES = [
  (item, ctx) => P.explicaTodos(item, ctx),
  (item, ctx) => P.explicaTodos(item, ctx),
  (item, ctx) => P.explicaDiana(item, ctx),
];
