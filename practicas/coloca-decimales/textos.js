// Coloca los paréntesis. Con decimales: textos propios, siempre { es, en }. Los de la interfaz
// son los comunes de `../_comun/parentesis-textos.js`; aquí van las introducciones y los consejos
// del «No lo sé». ESQUELETO de la tarea 199: la 202 los reescribe. En inglés, «brackets» y el
// punto decimal (lo pone el motor según el idioma). Sin agrupaciones imposibles a la vista.

import { crearPantalla } from '../_comun/parentesis-pantalla.js';
import { M } from './logica.js';

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Tres números', en: 'Three numbers' },
      detalle: { es: 'Con paréntesis, ¿qué resultados salen?', en: 'With brackets, which results can you get?' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Verás una operación con decimales como <strong>1,5 + 0,5 · 2</strong>. Si colocas paréntesis, el orden de las operaciones puede cambiar y el resultado también.</p>
          <p>Toca el hueco que hay a la izquierda de un número para poner <strong>(</strong> y el de la derecha para poner <strong>)</strong>. Tócalo otra vez para poner dos, y otra más para quitarlos.</p>
          <p>Debajo están los <strong>resultados posibles</strong>, apagados. Cada vez que consigas uno, se enciende. ¡Encuéntralos todos!</p>`,
        en: `<h2>How it works</h2>
          <p>You will see a calculation with decimals like <strong>1.5 + 0.5 · 2</strong>. If you place brackets, the order of the operations can change, and so can the result.</p>
          <p>Tap the space on the left of a number to put <strong>(</strong>, and the one on the right to put <strong>)</strong>. Tap again for two, and once more to remove them.</p>
          <p>Below you will see the <strong>possible results</strong>, switched off. Each time you get one, it switches on. Find them all!</p>`,
      },
    },
    {
      nombre: { es: 'Con un cuadrado', en: 'With a square' },
      detalle: { es: 'El exponente se aplica a lo que tiene delante', en: 'The index applies to what comes before it' },
      introduccion: {
        es: `<h2>Cuidado con el exponente</h2>
          <p>El <strong>²</strong> (o el <strong>³</strong>) del final se aplica a lo que tiene justo delante: a un número, o a todo lo que haya dentro de un paréntesis que se cierre antes de él.</p>
          <p>Por ejemplo, en <strong>1 + 0,5 · 2²</strong> el cuadrado es del 2, pero en <strong>(1 + 0,5 · 2)²</strong> es de todo el paréntesis.</p>`,
        en: `<h2>Careful with the index</h2>
          <p>The <strong>²</strong> (or <strong>³</strong>) at the end applies to what is right before it: a number, or everything inside a bracket that closes before it.</p>
          <p>For example, in <strong>1 + 0.5 · 2²</strong> the square is of the 2, but in <strong>(1 + 0.5 · 2)²</strong> it is of the whole bracket.</p>`,
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

const CONSEJO_CUADRADO = {
  es: 'El exponente se aplica a lo que tiene justo delante: a un número o a todo un paréntesis, y se hace antes que los productos y las sumas.',
  en: 'The index applies to what is right before it: a number or a whole bracket, and it is done before products and sums.',
};

/** «No lo sé» de cada ejercicio. */
export const EXPLICACIONES = [
  (item, ctx) => P.explicaTodos(item, ctx),
  (item, ctx) => P.explicaTodos(item, ctx, { consejo: CONSEJO_CUADRADO }),
  (item, ctx) => P.explicaDiana(item, ctx),
];
