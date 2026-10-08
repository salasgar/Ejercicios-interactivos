// Coloca los paréntesis: textos propios, siempre { es, en }. Los comunes
// (Comprobar, Siguiente…) llegan en `api.t`. Los textos con números son funciones.
//
// En inglés «paréntesis» es «brackets» (inglés británico, como el material) y
// la división se escribe con «÷». Las expresiones con signos no se escriben aquí:
// las pinta `formatear` de logica.js.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Tres números', en: 'Three numbers' },
      detalle: { es: 'Con paréntesis, ¿qué resultados salen?', en: 'With brackets, which results can you get?' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Verás una operación como <strong>2 + 3 · 4</strong>. Si colocas paréntesis, el orden de las operaciones puede cambiar y el resultado también.</p>
          <p>Toca el hueco que hay a la izquierda de un número para poner <strong>(</strong> y el de la derecha para poner <strong>)</strong>. Tócalo otra vez para poner dos, y otra más para quitarlos.</p>
          <p>Debajo están los <strong>resultados posibles</strong>, apagados. Cada vez que consigas uno, se enciende. ¡Encuéntralos todos!</p>`,
        en: `<h2>How it works</h2>
          <p>You will see an operation like <strong>2 + 3 · 4</strong>. If you place brackets, the order of the operations can change, and so can the result.</p>
          <p>Tap the space on the left of a number to put <strong>(</strong>, and the one on the right to put <strong>)</strong>. Tap again for two, and once more to remove them.</p>
          <p>Below you will see the <strong>possible results</strong>, switched off. Each time you get one, it switches on. Find them all!</p>`,
      },
    },
    {
      nombre: { es: 'Con una potencia', en: 'With a power' },
      detalle: { es: 'El cuadrado se aplica a lo que tiene delante', en: 'The square applies to what comes before it' },
      introduccion: {
        es: `<h2>Cuidado con el exponente</h2>
          <p>El <strong>²</strong> (o el <strong>³</strong>) del final se aplica a lo que tiene justo delante: a un número, o a todo lo que haya dentro de un paréntesis que se cierre antes de él.</p>
          <p>Por ejemplo, en <strong>5 + 2 · 3²</strong> el cuadrado es del 3, pero en <strong>(5 + 2 · 3)²</strong> es de toda la suma.</p>`,
        en: `<h2>Careful with the index</h2>
          <p>The <strong>²</strong> (or <strong>³</strong>) at the end applies to what is right before it: a number, or everything inside a bracket that closes before it.</p>
          <p>For example, in <strong>5 + 2 · 3²</strong> the square is of the 3, but in <strong>(5 + 2 · 3)²</strong> it is of the whole sum.</p>`,
      },
    },
    {
      nombre: { es: 'Con resta y división', en: 'With subtraction and division' },
      detalle: { es: 'Algunos paréntesis no se pueden calcular', en: 'Some brackets cannot be worked out' },
      introduccion: {
        es: `<h2>Hay paréntesis imposibles</h2>
          <p>Trabajamos con números naturales: no hay restas que den negativo (<strong>8 − 15</strong>) ni divisiones inexactas (<strong>7 : 2</strong>).</p>
          <p>Prueba paréntesis distintos. Si una agrupación no se puede calcular, la resolución se para y te dice por qué. Solo cuentan los resultados que sí se pueden conseguir.</p>`,
        en: `<h2>Some brackets are impossible</h2>
          <p>We work with natural numbers: no subtractions with a negative answer (<strong>8 − 15</strong>) and no inexact divisions (<strong>7 ÷ 2</strong>).</p>
          <p>Try different brackets. If a grouping cannot be worked out, the solution stops and tells you why. Only the results that can be reached count.</p>`,
      },
    },
    {
      nombre: { es: 'Una sola diana', en: 'One target' },
      detalle: { es: 'Coloca paréntesis para obtener el número pedido', en: 'Place brackets to get the number you are asked for' },
      introduccion: {
        es: `<h2>Como en el examen</h2>
          <p>Te pedimos un número. Coloca los paréntesis para que la operación dé exactamente ese resultado y pulsa <strong>Comprobar</strong>.</p>`,
        en: `<h2>Like in the exam</h2>
          <p>We ask you for a number. Place the brackets so that the operation gives exactly that result, and press <strong>Check</strong>.</p>`,
      },
    },
  ],

  instruccion_todos: {
    es: 'Toca los huecos para colocar paréntesis. Cada resultado nuevo se enciende.',
    en: 'Tap the spaces to place brackets. Each new result switches on.',
  },
  objetivo: { es: 'Coloca paréntesis para obtener', en: 'Place brackets to get' },
  hueco_abre: { es: 'abrir paréntesis antes del', en: 'open bracket before' },
  hueco_cierra: { es: 'cerrar paréntesis después del', en: 'close bracket after' },
  pista: { es: 'Pista', en: 'Hint' },
  borrar: { es: 'Borrar paréntesis', en: 'Clear brackets' },
  resultados: {
    es: (n, total) => `Resultados: ${n} de ${total}`,
    en: (n, total) => `Results: ${n} of ${total}`,
  },

  // Mensajes bajo la resolución
  desequilibrados: {
    es: 'Falta algún paréntesis: cada ( necesita su ).',
    en: 'A bracket is missing: every ( needs its ).',
  },
  nuevo: { es: '¡Resultado nuevo!', en: 'New result!' },
  ya_lo_tenias: {
    es: 'Ya lo tenías: estos paréntesis no cambian el resultado.',
    en: 'You already had it: these brackets do not change the result.',
  },
  ya_con_otros: {
    es: 'Ese resultado ya lo tenías, con otros paréntesis.',
    en: 'You already had that result, with other brackets.',
  },
  no_agrupan: {
    es: 'Estos paréntesis no cambian nada: las operaciones ya se hacían en ese orden.',
    en: 'These brackets change nothing: the operations were already done in that order.',
  },
  // Razones de una agrupación imposible; reciben { a, b } con los números de esa operación (HTML)
  imposible: {
    negativo: {
      es: (op) => `${op}: no se puede en los números naturales.`,
      en: (op) => `${op}: not possible with natural numbers.`,
    },
    inexacta: {
      es: (op) => `${op} no es una división exacta.`,
      en: (op) => `${op} is not an exact division.`,
    },
    cero: {
      es: (op) => `${op}: no se puede dividir entre 0.`,
      en: (op) => `${op}: you cannot divide by 0.`,
    },
    grande: {
      es: () => 'El resultado pasa de 10 000: aquí no llegamos tan lejos.',
      en: () => 'The result is more than 10 000: we do not go that far here.',
    },
  },

  // Final de los ejercicios 1 a 3
  todos_titulo: {
    es: 'Los has encontrado todos:',
    en: 'You found them all:',
  },
  // Ejercicio 4
  sin_cerrar: {
    es: 'Los paréntesis no están completos: cada ( necesita su ).',
    en: 'The brackets are not complete: every ( needs its ).',
  },
  tu_agrupacion: { es: 'Tus paréntesis:', en: 'Your brackets:' },
  da: { es: 'Eso da', en: 'That gives' },
  no_se_puede: { es: 'Esa agrupación no se puede calcular.', en: 'That grouping cannot be worked out.' },
  una_que_da: {
    es: n => `Una agrupación que da ${n}:`,
    en: n => `A grouping that gives ${n}:`,
  },
};
