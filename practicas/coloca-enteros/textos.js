// Coloca los paréntesis. Con enteros: textos propios, siempre { es, en }. Los de la interfaz
// (pista, borrar, «¡Resultado nuevo!»…) son los comunes de `../_comun/parentesis-textos.js`;
// aquí van las introducciones, la frase de «no se puede» de esta unidad y el consejo del «No lo
// sé». ESQUELETO de la tarea 199: la 200 los reescribe. En inglés, «brackets» (como la U1).

import { crearPantalla } from '../_comun/parentesis-pantalla.js';
import { M } from './logica.js';

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Tres números', en: 'Three numbers' },
      detalle: { es: 'Con paréntesis, ¿qué resultados salen?', en: 'With brackets, which results can you get?' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Verás una operación con enteros como <strong>−4 · 3 + 7</strong>. Si colocas paréntesis, el orden de las operaciones puede cambiar y el resultado también.</p>
          <p>Toca el hueco que hay a la izquierda de un número para poner <strong>(</strong> y el de la derecha para poner <strong>)</strong>. Tócalo otra vez para poner dos, y otra más para quitarlos.</p>
          <p>Debajo están los <strong>resultados posibles</strong>, apagados. Cada vez que consigas uno, se enciende. ¡Encuéntralos todos!</p>`,
        en: `<h2>How it works</h2>
          <p>You will see a calculation with integers like <strong>−4 · 3 + 7</strong>. If you place brackets, the order of the operations can change, and so can the result.</p>
          <p>Tap the space on the left of a number to put <strong>(</strong>, and the one on the right to put <strong>)</strong>. Tap again for two, and once more to remove them.</p>
          <p>Below you will see the <strong>possible results</strong>, switched off. Each time you get one, it switches on. Find them all!</p>`,
      },
    },
    {
      nombre: { es: 'Con una potencia', en: 'With a power' },
      detalle: { es: 'El exponente se aplica a lo que tiene delante', en: 'The index applies to what comes before it' },
      introduccion: {
        es: `<h2>Cuidado con el exponente</h2>
          <p>El <strong>²</strong> (o el <strong>³</strong>) del final se aplica a lo que tiene justo delante: a un número, o a todo lo que haya dentro de un paréntesis que se cierre antes de él.</p>
          <p>Si dentro del paréntesis sale un negativo, la base es negativa: <strong>(3 − 5)² = (−2)² = 4</strong>.</p>`,
        en: `<h2>Careful with the index</h2>
          <p>The <strong>²</strong> (or <strong>³</strong>) at the end applies to what is right before it: a number, or everything inside a bracket that closes before it.</p>
          <p>If the bracket gives a negative number, the base is negative: <strong>(3 − 5)² = (−2)² = 4</strong>.</p>`,
      },
    },
    {
      nombre: { es: 'Con división', en: 'With division' },
      detalle: { es: 'Algunas agrupaciones no se pueden calcular', en: 'Some groupings cannot be worked out' },
      introduccion: {
        es: `<h2>Restar siempre se puede; dividir, no</h2>
          <p>Con los números naturales, <strong>8 − 15</strong> no se podía. Con los enteros, sí: da <strong>−7</strong>.</p>
          <p>Pero una división tiene que dar un número entero: <strong>−7 : 2</strong> no se puede, y entre 0 nunca se divide. Si una agrupación no se puede calcular, la resolución se para y te dice por qué.</p>`,
        en: `<h2>You can always subtract, but not always divide</h2>
          <p>With natural numbers, <strong>8 − 15</strong> was not possible. With integers, it is: it gives <strong>−7</strong>.</p>
          <p>But a division has to give an integer: <strong>−7 ÷ 2</strong> is not possible, and you can never divide by 0. If a grouping cannot be worked out, the solution stops and tells you why.</p>`,
      },
    },
  ],
};

/** Lo que manda sobre los textos comunes: la división que no da un entero. */
export const PROPIOS = {
  imposible: {
    inexacta: {
      es: op => `${op} no da un número entero.`,
      en: op => `${op} does not give an integer.`,
    },
  },
  motivo: {
    inexacta: { es: op => `${op} no da un número entero`, en: op => `${op} does not give an integer` },
  },
};

export const P = crearPantalla(M, PROPIOS);

const CONSEJO_POTENCIA = {
  es: 'El exponente se aplica a lo que tiene justo delante: a un número o a todo un paréntesis, y se hace antes que los productos y las sumas. Si la base es negativa, cuenta el signo.',
  en: 'The index applies to what is right before it: a number or a whole bracket, and it is done before products and sums. If the base is negative, watch the sign.',
};
const CONSEJO_DIVISION = {
  es: 'Prueba a rodear dos o tres números seguidos y calcula. Restar siempre se puede; si sale una división que no da un número entero, o entre 0, esa agrupación no cuenta.',
  en: 'Try putting brackets around two or three numbers next to each other and work it out. You can always subtract; if you get a division that does not give an integer, or a division by 0, that grouping does not count.',
};

/** «No lo sé» de cada ejercicio: todos los resultados con una agrupación que da cada uno. */
export const EXPLICACIONES = [
  (item, ctx) => P.explicaTodos(item, ctx),
  (item, ctx) => P.explicaTodos(item, ctx, { consejo: CONSEJO_POTENCIA }),
  (item, ctx) => P.explicaImposibles(item, ctx, { consejo: CONSEJO_DIVISION }),
];
