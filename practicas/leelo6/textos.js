// Práctica «Léelo en inglés» de la unidad 6 (Algebra): textos propios, siempre { es, en }. Lo que
// se lee está en inglés porque esa es la destreza; las órdenes y el feedback van en el idioma del
// ítem. Los números de los ejemplos no son casos de las hojas.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'La palabra', en: 'The word' },
      detalle: { es: 'Palabras del álgebra: del inglés al español y al revés', en: 'Algebra words: from English to Spanish and back' },
      introduccion: {
        es: `<h3>La palabra</h3>
          <p>En 3x + 2, la x es la <strong>unknown</strong> (incógnita), el 3 es el <strong>coefficient</strong> (el número que multiplica a la letra) y el 2 es el <strong>constant term</strong> (el término sin letra).</p>
          <p>Ojo con las que se parecen: una <strong>expression</strong> (expresión) no tiene signo igual y una <strong>equation</strong> (ecuación) sí; <strong>numerator</strong> es el de arriba y <strong>denominator</strong> el de abajo.</p>
          <p>Te sale una palabra en inglés y eliges su significado en español, o al revés.</p>`,
        en: `<h3>The word</h3>
          <p>In 3x + 2, x is the <strong>unknown</strong>, 3 is the <strong>coefficient</strong> (the number that multiplies the letter) and 2 is the <strong>constant term</strong> (the term without a letter).</p>
          <p>Watch out for words that look alike: an <strong>expression</strong> has no equals sign and an <strong>equation</strong> has one; the <strong>numerator</strong> is on top and the <strong>denominator</strong> is at the bottom.</p>
          <p>You get a word in English and choose its Spanish meaning, or the other way round.</p>`,
      },
    },
    {
      nombre: { es: 'Léelo', en: 'Say it' },
      detalle: { es: 'Leer y escribir expresiones y ecuaciones', en: 'Read and write expressions and equations' },
      introduccion: {
        es: `<h3>Cómo se lee</h3>
          <p>2x se lee <strong>two x</strong> (o <strong>two times x</strong>); x/3 se lee <strong>x over three</strong> (o <strong>x divided by three</strong>); 3x + 5 se lee <strong>three x plus five</strong>; 4x − 1 se lee <strong>four x minus one</strong>.</p>
          <p>Una ecuación añade <strong>equals</strong> (o <strong>is equal to</strong>): 2x + 1 = 7 es <strong>two x plus one equals seven</strong>.</p>
          <p>En español: 2x es «dos equis» o «el doble de x»; 3x + 5 es «el triple de x más cinco». Fíjate en los signos y en el orden de los números.</p>`,
        en: `<h3>How to read it</h3>
          <p>2x is read <strong>two x</strong> (or <strong>two times x</strong>); x/3 is read <strong>x over three</strong> (or <strong>x divided by three</strong>); 3x + 5 is read <strong>three x plus five</strong>; 4x − 1 is read <strong>four x minus one</strong>.</p>
          <p>An equation adds <strong>equals</strong> (or <strong>is equal to</strong>): 2x + 1 = 7 is <strong>two x plus one equals seven</strong>.</p>
          <p>In Spanish: 2x is «dos equis» or «el doble de x»; 3x + 5 is «el triple de x más cinco». Look at the signs and the order of the numbers.</p>`,
      },
    },
    {
      nombre: { es: 'La consigna', en: 'The instruction' },
      detalle: { es: 'Entender qué pide una instrucción de examen en inglés', en: 'Understand what an English exam instruction asks' },
      introduccion: {
        es: `<h3>La consigna</h3>
          <p><em>Solve the equation.</em> La palabra que decide es <strong>solve</strong>: resolver. <em>Simplify</em> es simplificar, <em>evaluate</em> es calcular el valor, <em>check</em> es comprobar, <em>expand the brackets</em> es quitar los paréntesis multiplicando.</p>
          <p><em>Subtract 3 from both sides</em>: resta 3 a los dos miembros. Cuidado con la operación: <strong>subtract</strong> resta, <strong>add</strong> suma, <strong>divide</strong> divide, <strong>multiply</strong> multiplica.</p>
          <p>No hay que calcular: elige la traducción en español que dice lo mismo que la consigna.</p>`,
        en: `<h3>The instruction</h3>
          <p><em>Solve the equation.</em> The word that decides is <strong>solve</strong>: resolver. <em>Simplify</em> is simplificar, <em>evaluate</em> is calcular el valor, <em>check</em> is comprobar, <em>expand the brackets</em> is quitar los paréntesis multiplicando.</p>
          <p><em>Subtract 3 from both sides</em>: resta 3 a los dos miembros. Mind the operation: <strong>subtract</strong> takes away, <strong>add</strong> puts together, <strong>divide</strong> shares out, <strong>multiply</strong> times.</p>
          <p>You do not have to calculate: choose the Spanish translation that says the same as the instruction.</p>`,
      },
    },
    {
      nombre: { es: 'Completa', en: 'Fill in' },
      detalle: { es: 'La palabra que falta en una frase en inglés', en: 'The missing word in an English sentence' },
      introduccion: {
        es: `<h3>Completa</h3>
          <p><em>In 5x − 2, the ___ of x is 5.</em> El 5 es el número que multiplica a la x: <strong>coefficient</strong>.</p>
          <p><em>Ana is 12 now. Three years ___ Ana was 9.</em> «Hace tres años» es <strong>ago</strong>.</p>
          <p>Lee la frase entera y elige la palabra que encaja por el significado y por la gramática.</p>`,
        en: `<h3>Fill in</h3>
          <p><em>In 5x − 2, the ___ of x is 5.</em> 5 is the number that multiplies x: <strong>coefficient</strong>.</p>
          <p><em>Ana is 12 now. Three years ___ Ana was 9.</em> “Hace tres años” is <strong>ago</strong>.</p>
          <p>Read the whole sentence and choose the word that fits by meaning and by grammar.</p>`,
      },
    },
  ],
  instrucciones: {
    palabra_en_es: { es: 'Elige el significado en español', en: 'Choose the meaning in Spanish' },
    palabra_es_en: { es: 'Elige la palabra en inglés', en: 'Choose the English word' },
    leer_expresion: { es: 'Elige cómo se lee en inglés', en: 'Choose how it is read in English' },
    leer_ecuacion: { es: 'Elige cómo se lee esta ecuación en inglés', en: 'Choose how this equation is read in English' },
    leer_en_espanol: { es: 'Elige cómo se lee en español', en: 'Choose how it is read in Spanish' },
    escribir_expresion: { es: 'Elige la expresión que dice la frase', en: 'Choose the expression the sentence says' },
    escribir_ecuacion: { es: 'Elige la ecuación que dice la frase', en: 'Choose the equation the sentence says' },
    consigna: { es: 'Elige la traducción de la consigna (en español)', en: 'Choose the translation of the instruction (in Spanish)' },
    completa: { es: 'Elige la palabra que falta', en: 'Choose the missing word' },
  },
};
