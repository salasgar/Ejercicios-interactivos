// Práctica «Del enunciado al álgebra» (unidad 6): textos propios, siempre { es, en }.
// Cada introducción lleva un ejemplo resuelto en los dos idiomas.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Elige la expresión', en: 'Choose the expression' },
      detalle: { es: 'De una frase a su expresión con letra', en: 'From a phrase to its expression with a letter' },
      introduccion: {
        es: `<h3>Elige la expresión</h3>
          <p>Un número que no conocemos se llama <strong>x</strong>.</p>
          <p>«El doble de un número, más tres» es <span class="cuenta">2x + 3</span>: el doble de x es 2x, y después se suma 3.</p>
          <p>Lee la frase con calma y elige la expresión que dice lo mismo. Ojo: <span class="cuenta">2x + 3</span> y <span class="cuenta">3 + 2x</span> son la misma.</p>`,
        en: `<h3>Choose the expression</h3>
          <p>A number we do not know is called <strong>x</strong>.</p>
          <p>“Twice a number, plus three” is <span class="cuenta">2x + 3</span>: twice x is 2x, and then you add 3.</p>
          <p>Read the phrase carefully and choose the expression that says the same. Careful: <span class="cuenta">2x + 3</span> and <span class="cuenta">3 + 2x</span> are the same.</p>`,
      },
    },
    {
      nombre: { es: 'Escríbela', en: 'Write it' },
      detalle: { es: 'Escribir con letra lo que dice una frase', en: 'Write with a letter what a phrase says' },
      introduccion: {
        es: `<h3>Escríbela</h3>
          <p>«Cinco menos un número» es <span class="cuenta">5 − x</span>. Escribe la expresión con la letra <strong>x</strong>.</p>
          <p>Teclea 2x (sin espacios si quieres), x/2 para la mitad y 3 + 2x o 2x + 3, como prefieras: vale cualquier forma equivalente. Para menos, escribe «-».</p>`,
        en: `<h3>Write it</h3>
          <p>“Five minus a number” is <span class="cuenta">5 − x</span>. Write the expression with the letter <strong>x</strong>.</p>
          <p>Type 2x (no spaces needed), x/2 for half, and 3 + 2x or 2x + 3, as you like: any equivalent form is fine. For minus, type “-”.</p>`,
      },
    },
    {
      nombre: { es: 'Elige la frase', en: 'Choose the words' },
      detalle: { es: 'De una expresión a su frase', en: 'From an expression to its phrase' },
      introduccion: {
        es: `<h3>Elige la frase</h3>
          <p><span class="cuenta">x − 3</span> se lee «tres menos que un número»: ojo, <em>menos que</em> resta al número, no a 3.</p>
          <p>Pero <span class="cuenta">3 − x</span> es «tres menos un número». Fíjate en cuál va primero.</p>`,
        en: `<h3>Choose the words</h3>
          <p><span class="cuenta">x − 3</span> is “three less than a number”: careful, <em>less than</em> takes away from the number, not from 3.</p>
          <p>But <span class="cuenta">3 − x</span> is “three minus a number”. Look at which one comes first.</p>`,
      },
    },
    {
      nombre: { es: 'Situaciones', en: 'Real-life situations' },
      detalle: { es: 'Edades, precios y tarifas con una letra', en: 'Ages, prices and charges with a letter' },
      introduccion: {
        es: `<h3>Situaciones</h3>
          <p>Un taxi cobra 3,00 € por empezar y 2,00 € por cada kilómetro. Con <strong>k</strong> kilómetros se paga <span class="cuenta">3 + 2k</span>: la parte fija (3) y 2 por cada kilómetro (2k).</p>
          <p>Con 5 kilómetros: <span class="cuenta">3 + 2 · 5 = 3 + 10 = 13</span>. Primero se multiplica, después se suma.</p>`,
        en: `<h3>Real-life situations</h3>
          <p>A taxi charges €3.00 to start and €2.00 for each kilometre. With <strong>k</strong> kilometres you pay <span class="cuenta">3 + 2k</span>: the fixed part (3) and 2 for each kilometre (2k).</p>
          <p>With 5 kilometres: <span class="cuenta">3 + 2 · 5 = 3 + 10 = 13</span>. First multiply, then add.</p>`,
      },
    },
  ],
  instrucciones: {
    elige: { es: 'Elige la expresión que dice lo mismo que la frase.', en: 'Choose the expression that says the same as the phrase.' },
    escribe: { es: 'Escribe la expresión con la letra x.', en: 'Write the expression with the letter x.' },
    frase: { es: 'Elige la frase que dice lo mismo que la expresión.', en: 'Choose the phrase that says the same as the expression.' },
    'situacion-expresion': { es: 'Escribe lo que se paga con la letra del enunciado. Elige la expresión.', en: 'Write what is paid with the letter in the problem. Choose the expression.' },
    'situacion-valor': { es: 'Calcula lo que se paga. Elige el número.', en: 'Work out what is paid. Choose the number.' },
    'situacion-cantidad': { es: 'Elige la expresión.', en: 'Choose the expression.' },
  },
  escribe: {
    campo: { es: 'Tu expresión', en: 'Your expression' },
    correcta: { es: 'Se escribe', en: 'It is written' },
    glosa: { es: 'Vocabulario', en: 'Vocabulary' },
  },
};
