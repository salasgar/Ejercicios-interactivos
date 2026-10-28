// Práctica «Léelo en inglés» (unidad 4): textos propios, siempre { es, en }. Lo que se lee
// (frases, opciones) está en inglés porque esa es la destreza; las órdenes y el feedback van
// en el idioma del ítem. Cada introducción lleva un ejemplo resuelto en los dos idiomas.
// Las fracciones se escriben con raya (`htmlFraccion`), salvo en las frases inglesas habladas.

import { fraccion, htmlFraccion, htmlCuenta } from '../_comun/fracciones.js';

const H = (n, d) => htmlFraccion(fraccion(n, d), { compacta: true });
const C = (...partes) => htmlCuenta(partes.map(p => (Array.isArray(p) ? fraccion(p[0], p[1]) : p)), { compacta: true });

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Emparejar', en: 'Match' },
      detalle: { es: 'Palabras de las fracciones: del inglés al español', en: 'Fraction words: from English to Spanish' },
      introduccion: {
        es: `<h3>Emparejar</h3>
          <p>En ${H(3, 5)}, el <strong>numerator</strong> (numerador) es 3 y el <strong>denominator</strong> (denominador) es 5.</p>
          <p>Toca un término en inglés y después su traducción: se quedan unidos con el mismo número. Tócalos otra vez para deshacer. Cuando estén los cinco, pulsa «Comprobar».</p>`,
        en: `<h3>Match</h3>
          <p>In ${H(3, 5)}, the <strong>numerator</strong> is 3 and the <strong>denominator</strong> is 5.</p>
          <p>Tap an English term and then its Spanish translation: they get the same number. Tap them again to undo. When all five are paired, press “Check”.</p>`,
      },
    },
    {
      nombre: { es: 'La lectura', en: 'Reading fractions' },
      detalle: { es: 'Leer fracciones y cuentas con fracciones en inglés', en: 'Read fractions and sums with fractions in English' },
      introduccion: {
        es: `<h3>Cómo se leen las fracciones</h3>
          <p>${H(3, 5)} se lee <strong>three fifths</strong>: el numerador con un número normal y el denominador con un <strong>ordinal</strong> (fifth = quinto), en plural si el numerador no es 1.</p>
          <p>${H(1, 2)} es <strong>a half</strong> (o <strong>one half</strong>) y ${H(3, 4)} es <strong>three quarters</strong> (o <strong>three fourths</strong>): las dos valen.</p>
          <p>${C([2, 3], '+', [1, 6], '=', [5, 6])} se lee <strong>two thirds plus one sixth equals five sixths</strong>. En un producto, <strong>times</strong> y <strong>multiplied by</strong> valen las dos.</p>`,
        en: `<h3>How to read fractions</h3>
          <p>${H(3, 5)} is read <strong>three fifths</strong>: the numerator is a normal number and the denominator is an <strong>ordinal</strong> (fifth), in the plural if the numerator is not 1.</p>
          <p>${H(1, 2)} is <strong>a half</strong> (or <strong>one half</strong>) and ${H(3, 4)} is <strong>three quarters</strong> (or <strong>three fourths</strong>): both are fine.</p>
          <p>${C([2, 3], '+', [1, 6], '=', [5, 6])} is read <strong>two thirds plus one sixth equals five sixths</strong>. In a product, <strong>times</strong> and <strong>multiplied by</strong> are both fine.</p>`,
      },
    },
    {
      nombre: { es: '¿Qué pide?', en: 'What does it ask?' },
      detalle: { es: 'Entender qué pregunta un enunciado en inglés', en: 'Understand what an English problem asks' },
      introduccion: {
        es: `<h3>¿Qué pide el enunciado?</h3>
          <p><em>Ana has 30 euros and spends ${H(2, 5)} of the money. How much money is left?</em></p>
          <p><strong>Left</strong> = que queda; <strong>the rest</strong> = el resto; <strong>shaded</strong> = sombreado; <strong>out of</strong> = de cada; <strong>of</strong> = de (${H(2, 5)} of 30 es ${H(2, 5)} de 30). Aquí pide lo que le <strong>queda</strong>, no lo que gasta.</p>
          <p>No hay que calcular: elige la pregunta, en español, que hace el enunciado.</p>`,
        en: `<h3>What does the problem ask?</h3>
          <p><em>Ana has 30 euros and spends ${H(2, 5)} of the money. How much money is left?</em></p>
          <p><strong>Left</strong> means what remains; <strong>the rest</strong> is what remains of the whole; <strong>shaded</strong> means coloured in; <strong>out of</strong>: 3 out of 5 is ${H(3, 5)}; <strong>of</strong> = de: ${H(2, 5)} of 30 is ${H(2, 5)} de 30. Here it asks for the money that is <strong>left</strong>, not the money spent.</p>
          <p>You do not have to calculate: choose the question, in Spanish, that the problem asks.</p>`,
      },
    },
    {
      nombre: { es: 'Dictado', en: 'Dictation' },
      detalle: { es: 'Escribir con fracciones una frase en inglés', en: 'Write with fractions a sentence in English' },
      introduccion: {
        es: `<h3>Dictado</h3>
          <p><strong>Three quarters of twenty is fifteen</strong> se escribe ${C([3, 4], '·', 20, '=', 15)}: <strong>of</strong> es multiplicar.</p>
          <p><strong>Subtract one sixth from two thirds</strong> es ${C([2, 3], '−', [1, 6])}: se resta lo que va después de «subtract» a lo que va después de «from». <strong>Divided by</strong> es «:».</p>
          <p>Escribe cada fracción como 3/4 (o un número, como 20) y elige la operación. Si quieres, pulsa ▶ para oír la frase.</p>`,
        en: `<h3>Dictation</h3>
          <p><strong>Three quarters of twenty is fifteen</strong> is written ${C([3, 4], '·', 20, '=', 15)}: <strong>of</strong> means multiply.</p>
          <p><strong>Subtract one sixth from two thirds</strong> is ${C([2, 3], '−', [1, 6])}: you take the first number away from the second one. <strong>Divided by</strong> is “:”.</p>
          <p>Write each fraction like 3/4 (or a number, like 20) and choose the operation. If you like, press ▶ to hear the sentence.</p>`,
      },
    },
  ],
  instrucciones: {
    emparejar: { es: 'Empareja cada término en inglés con su traducción', en: 'Match each English term with its Spanish translation' },
    leer_fraccion: { es: 'Elige la lectura correcta en inglés', en: 'Choose the correct reading in English' },
    leer_cuenta: { es: 'Elige cómo se lee esta cuenta en inglés', en: 'Choose how this calculation is read in English' },
    que_pide: { es: 'Elige la pregunta del enunciado (en español)', en: 'Choose the question the problem asks (in Spanish)' },
    dictado: { es: 'Escribe la cuenta que dice la frase', en: 'Write the calculation the sentence says' },
  },
  emparejar: {
    inglés: { es: 'Inglés', en: 'English' },
    español: { es: 'Español', en: 'Spanish' },
    par: { es: 'pareja', en: 'pair' },
    correctas: { es: 'Las parejas correctas:', en: 'The right pairs:' },
    sin_pareja: { es: 'sin pareja', en: 'not paired' },
  },
  dictado: {
    campo: { es: 'Fracción', en: 'Fraction' },
    operacion: { es: 'Operación', en: 'Operation' },
    correcta: { es: 'La frase se escribe:', en: 'The sentence is written:' },
    escuchar: { es: '▶ Oír la frase', en: '▶ Hear the sentence' },
    sin_voz: { es: 'Este aparato no puede leer en voz alta: lee la frase.', en: 'This device cannot read aloud: read the sentence.' },
    consejo: { es: 'Escribe las fracciones como 3/4 o 20; elige la operación.', en: 'Write fractions like 3/4 or 20; choose the operation.' },
  },
};
