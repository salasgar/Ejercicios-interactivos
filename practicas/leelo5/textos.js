// Práctica «Léelo en inglés» (unidad 5): textos propios, siempre { es, en }. Lo que se lee
// (frases, términos) está en inglés porque esa es la destreza; las órdenes y el feedback van en
// el idioma del ítem. Cada introducción lleva un ejemplo resuelto en los dos idiomas. Los
// números de los ejemplos no son casos de las hojas.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'La palabra', en: 'The word' },
      detalle: { es: 'Palabras de los decimales: del inglés al español y al revés', en: 'Decimal words: from English to Spanish and back' },
      introduccion: {
        es: `<h3>La palabra</h3>
          <p>En 3,75, el 7 está en las <strong>tenths</strong> (décimas) y el 5 en las <strong>hundredths</strong> (centésimas). Los <strong>decimal places</strong> son las cifras de después del <strong>decimal point</strong> (la coma decimal).</p>
          <p>Ojo con las que se parecen: <strong>tenths</strong> no es <strong>tens</strong> (decenas) y <strong>hundredths</strong> no es <strong>hundreds</strong> (centenas).</p>
          <p>Te sale una palabra en inglés y eliges su significado en español, o al revés.</p>`,
        en: `<h3>The word</h3>
          <p>In 3.75, the 7 is in the <strong>tenths</strong> place and the 5 in the <strong>hundredths</strong> place. The <strong>decimal places</strong> are the digits after the <strong>decimal point</strong>.</p>
          <p>Watch out for words that look alike: <strong>tenths</strong> is not <strong>tens</strong> and <strong>hundredths</strong> is not <strong>hundreds</strong>.</p>
          <p>You get a word in English and choose its Spanish meaning, or the other way round.</p>`,
      },
    },
    {
      nombre: { es: 'Léelo', en: 'Say it' },
      detalle: { es: 'Leer y escribir decimales, dinero y cuentas', en: 'Read and write decimals, money and calculations' },
      introduccion: {
        es: `<h3>Cómo se lee un decimal</h3>
          <p>3,75 se lee <strong>three point seven five</strong>: el número de antes del <strong>point</strong> y, después, <strong>las cifras una a una</strong>. Nunca «three point seventy-five». El 0 se lee <strong>nought</strong> o <strong>zero</strong> (las dos valen): 0,05 es <strong>nought point nought five</strong>.</p>
          <p>El dinero: 3,75 € es <strong>three euros seventy-five</strong>; 0,50 € es <strong>fifty cents</strong>.</p>
          <p>En inglés el decimal lleva <strong>punto</strong> (3.75) y en español, <strong>coma</strong> (3,75). En español también se lee con los órdenes: tres unidades y setenta y cinco centésimas.</p>`,
        en: `<h3>How to read a decimal</h3>
          <p>3.75 is read <strong>three point seven five</strong>: the number before the <strong>point</strong> and then <strong>the digits one by one</strong>. Never “three point seventy-five”. The 0 is read <strong>nought</strong> or <strong>zero</strong> (both are fine): 0.05 is <strong>nought point nought five</strong>.</p>
          <p>Money: €3.75 is <strong>three euros seventy-five</strong>; €0.50 is <strong>fifty cents</strong>.</p>
          <p>In English the decimal separator is a <strong>point</strong> (3.75) and in Spanish it is a <strong>comma</strong> (3,75). In Spanish it is also read with the places: tres unidades y setenta y cinco centésimas.</p>`,
      },
    },
    {
      nombre: { es: 'La consigna', en: 'The instruction' },
      detalle: { es: 'Entender qué pide una instrucción de examen en inglés', en: 'Understand what an English exam instruction asks' },
      introduccion: {
        es: `<h3>La consigna</h3>
          <p><em>Round 4.07 to one decimal place.</em> La palabra que decide es <strong>one decimal place</strong>: la décima. Se traduce: «Redondea 4,07 a la décima».</p>
          <p>Otras: <strong>to the nearest whole number</strong> = a la unidad más cercana; <strong>between</strong> = entre; <strong>in ascending order</strong> = de menor a mayor; <strong>in its simplest form</strong> = en su forma irreducible; <strong>quotient</strong> = cociente.</p>
          <p>No hay que calcular: elige la traducción en español que dice lo mismo que la consigna.</p>`,
        en: `<h3>The instruction</h3>
          <p><em>Round 4.07 to one decimal place.</em> The word that decides is <strong>one decimal place</strong>: the tenths. In Spanish: «Redondea 4,07 a la décima».</p>
          <p>More: <strong>to the nearest whole number</strong> = a la unidad más cercana; <strong>between</strong> = entre; <strong>in ascending order</strong> = de menor a mayor; <strong>in its simplest form</strong> = en su forma irreducible; <strong>quotient</strong> = cociente.</p>
          <p>You do not have to calculate: choose the Spanish translation that says the same as the instruction.</p>`,
      },
    },
    {
      nombre: { es: 'Completa', en: 'Fill in' },
      detalle: { es: 'La palabra que falta en una frase en inglés', en: 'The missing word in an English sentence' },
      introduccion: {
        es: `<h3>Completa</h3>
          <p><em>In 4.07, the 7 is in the ___ place.</em> El 7 es la segunda cifra después del punto: <strong>hundredths</strong>.</p>
          <p><em>The book costs €7.50 and Ana pays with €10. Her ___ is €2.50.</em> Lo que te devuelven al pagar es el <strong>change</strong> (la vuelta).</p>
          <p>Lee la frase entera y elige la palabra que encaja por el significado y por la gramática.</p>`,
        en: `<h3>Fill in</h3>
          <p><em>In 4.07, the 7 is in the ___ place.</em> The 7 is the second digit after the point: <strong>hundredths</strong>.</p>
          <p><em>The book costs €7.50 and Ana pays with €10. Her ___ is €2.50.</em> The money you get back is the <strong>change</strong>.</p>
          <p>Read the whole sentence and choose the word that fits by meaning and by grammar.</p>`,
      },
    },
  ],
  instrucciones: {
    palabra_en_es: { es: 'Elige el significado en español', en: 'Choose the meaning in Spanish' },
    palabra_es_en: { es: 'Elige la palabra en inglés', en: 'Choose the English word' },
    leer_decimal: { es: 'Elige cómo se lee en inglés', en: 'Choose how it is read in English' },
    leer_dinero: { es: 'Elige cómo se lee en inglés', en: 'Choose how it is read in English' },
    leer_cuenta: { es: 'Elige cómo se lee esta cuenta en inglés', en: 'Choose how this calculation is read in English' },
    leer_en_espanol: { es: 'Elige cómo se lee en español, con los órdenes', en: 'Choose how it is read in Spanish, with the places' },
    cifras_de_palabras: { es: 'Elige el número que dice la frase', en: 'Choose the number the sentence says' },
    consigna: { es: 'Elige la traducción de la consigna (en español)', en: 'Choose the translation of the instruction (in Spanish)' },
    completa: { es: 'Elige la palabra que falta', en: 'Choose the missing word' },
  },
};
