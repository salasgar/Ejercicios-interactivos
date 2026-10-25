// Práctica «Léelo en inglés» (unidad 3): textos propios, siempre { es, en }. Lo que se lee
// (frases, opciones) está en inglés porque esa es la destreza; las órdenes y el feedback
// van en el idioma del ítem. Las introducciones llevan un ejemplo resuelto en los dos idiomas.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Los enteros', en: 'Integers' },
      detalle: { es: 'Leer −7, −3 °C, valor absoluto y orden', en: 'Read −7, −3 °C, absolute value and order' },
      introduccion: {
        es: `<h3>Los enteros en inglés</h3>
          <p>−7 se lee <strong>negative seven</strong> o <strong>minus seven</strong>: las dos valen.</p>
          <p>−3 °C se lee <strong>minus three degrees</strong> o <strong>three degrees below zero</strong>.</p>
          <p><strong>Greater than</strong> = mayor que; <strong>less than</strong> = menor que; <strong>opposite</strong> = opuesto; <strong>absolute value</strong> = valor absoluto.</p>`,
        en: `<h3>Integers in English</h3>
          <p>−7 is read <strong>negative seven</strong> or <strong>minus seven</strong>: both are fine.</p>
          <p>−3 °C is read <strong>minus three degrees</strong> or <strong>three degrees below zero</strong>.</p>
          <p><strong>Greater than</strong>, <strong>less than</strong>, <strong>opposite</strong> and <strong>absolute value</strong> are the words you need.</p>`,
      },
    },
    {
      nombre: { es: 'Sumas, restas y productos', en: 'Adding, subtracting, multiplying' },
      detalle: { es: 'Leer 5 − (−3), 5 · (−2) y el vocabulario de las operaciones', en: 'Read 5 − (−3), 5 · (−2) and the words for operations' },
      introduccion: {
        es: `<h3>Las operaciones en inglés</h3>
          <p>5 − (−3) se lee <strong>five minus negative three</strong>; también <strong>five take away negative three</strong>.</p>
          <p>5 · (−2) se lee <strong>five times negative two</strong> o <strong>five multiplied by negative two</strong>.</p>
          <p><strong>Sum</strong> = suma; <strong>difference</strong> = resta; <strong>product</strong> = producto; <strong>quotient</strong> = cociente. <strong>Subtract 9 from 4</strong> es 4 − 9.</p>`,
        en: `<h3>Operations in English</h3>
          <p>5 − (−3) is read <strong>five minus negative three</strong>; also <strong>five take away negative three</strong>.</p>
          <p>5 · (−2) is read <strong>five times negative two</strong> or <strong>five multiplied by negative two</strong>.</p>
          <p>The result of an addition is the <strong>sum</strong>, of a subtraction the <strong>difference</strong>, of a multiplication the <strong>product</strong> and of a division the <strong>quotient</strong>. <strong>Subtract 9 from 4</strong> is 4 − 9.</p>`,
      },
    },
    {
      nombre: { es: 'Potencias', en: 'Powers' },
      detalle: { es: 'Leer (−2)³, la base y el exponente', en: 'Read (−2)³, the base and the exponent' },
      introduccion: {
        es: `<h3>Las potencias en inglés</h3>
          <p>(−2)³ se lee <strong>negative two, cubed</strong> (o <strong>minus two, cubed</strong>). 3² es <strong>three squared</strong>. 2⁴ es <strong>two to the power of four</strong>.</p>
          <p>En (−2)³ la <strong>base</strong> es −2 y el <strong>exponent</strong> (también <strong>index</strong>) es 3.</p>
          <p>Exponente <strong>even</strong> (par) o <strong>odd</strong> (impar).</p>`,
        en: `<h3>Powers in English</h3>
          <p>(−2)³ is read <strong>negative two, cubed</strong> (or <strong>minus two, cubed</strong>). 3² is <strong>three squared</strong>. 2⁴ is <strong>two to the power of four</strong>.</p>
          <p>In (−2)³ the <strong>base</strong> is −2 and the <strong>exponent</strong> (also called <strong>index</strong>) is 3.</p>
          <p>An exponent can be <strong>even</strong> or <strong>odd</strong>.</p>`,
      },
    },
    {
      nombre: { es: 'Palabras y símbolos', en: 'Words and symbols' },
      detalle: { es: 'De la frase a la expresión y los problemas', en: 'From the sentence to the expression, and word problems' },
      introduccion: {
        es: `<h3>Palabras y símbolos</h3>
          <p><strong>The opposite of three squared</strong> es −3²; <strong>negative three, squared</strong> es (−3)².</p>
          <p><strong>Change</strong> = cambio (final − inicial); <strong>difference</strong> = diferencia; <strong>deeper</strong> = más profundo; <strong>balance</strong> = saldo; <strong>profit</strong> = beneficio; <strong>loss</strong> = pérdida; <strong>how much warmer / colder</strong> = cuánto más cálido / frío.</p>`,
        en: `<h3>Words and symbols</h3>
          <p><strong>The opposite of three squared</strong> is −3²; <strong>negative three, squared</strong> is (−3)².</p>
          <p>The <strong>change</strong> is the final value minus the start value. The <strong>balance</strong> is the money in your account. A <strong>profit</strong> is positive and a <strong>loss</strong> is negative. <strong>Deeper</strong> means more negative.</p>`,
      },
    },
  ],
  instrucciones: {
    leer: { es: 'Elige la lectura correcta en inglés', en: 'Choose the correct reading in English' },
    escribir: { es: 'Elige la expresión que dice la frase', en: 'Choose the expression the sentence says' },
    completar: { es: 'Elige la palabra que falta', en: 'Choose the missing word' },
    orden: { es: 'Elige la lista bien ordenada', en: 'Choose the list in the right order' },
    significa: { es: 'Elige lo que significa', en: 'Choose what it means' },
    simbolos: { es: 'Elige la expresión que dice la frase', en: 'Choose the expression the sentence says' },
    problema: { es: 'Lee el problema y elige la respuesta', en: 'Read the problem and choose the answer' },
  },
  escuchar: { es: '▶ Oír la frase', en: '▶ Hear the sentence' },
  era: { es: 'Era:', en: 'It was:' },
};
