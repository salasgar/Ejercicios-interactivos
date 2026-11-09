// Práctica «Paréntesis» (unidad 6): textos propios, siempre { es, en }.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Quita el paréntesis', en: 'Expand the brackets' },
      detalle: { es: 'Escribir una expresión sin paréntesis', en: 'Write an expression without brackets' },
      introduccion: {
        es: `<h3>Quita el paréntesis</h3>
          <p>Un número delante de un paréntesis multiplica a <strong>todos</strong> los términos de dentro: <span class="cuenta">3(<i>x</i> − 2) = 3<i>x</i> − 6</span>.</p>
          <p>Si delante hay un signo menos, cambia el signo de todos los términos: <span class="cuenta">−(<i>x</i> − 2) = −<i>x</i> + 2</span>.</p>
          <p>Si hay algo antes del paréntesis, se queda como está y después se juntan los términos semejantes: <span class="cuenta">4 + 2(<i>x</i> + 1) = 4 + 2<i>x</i> + 2 = 2<i>x</i> + 6</span>.</p>
          <p>Escribe el resultado sin paréntesis. Para menos, teclea «-». Vale cualquier orden.</p>`,
        en: `<h3>Expand the brackets</h3>
          <p>A number in front of brackets multiplies <strong>every</strong> term inside: <span class="cuenta">3(<i>x</i> − 2) = 3<i>x</i> − 6</span>.</p>
          <p>If there is a minus sign in front, it changes the sign of every term: <span class="cuenta">−(<i>x</i> − 2) = −<i>x</i> + 2</span>.</p>
          <p>If there is something before the brackets, it stays as it is and then you put the like terms together: <span class="cuenta">4 + 2(<i>x</i> + 1) = 4 + 2<i>x</i> + 2 = 2<i>x</i> + 6</span>.</p>
          <p>Write the result without brackets. For minus, type “-”. Any order is fine.</p>`,
      },
    },
    {
      nombre: { es: '¿Cuál es el desarrollo?', en: 'Which expansion?' },
      detalle: { es: 'Elegir la expresión sin paréntesis que es igual', en: 'Choose the expression without brackets that is equal' },
      introduccion: {
        es: `<h3>¿Cuál es el desarrollo?</h3>
          <p>Verás una expresión con paréntesis y cuatro expresiones sin paréntesis. Solo una es igual a la primera.</p>
          <p>Piensa: ¿por quién se multiplica cada término de dentro? <span class="cuenta">2(<i>x</i> + 5) = 2<i>x</i> + 10</span>.</p>`,
        en: `<h3>Which expansion?</h3>
          <p>You will see an expression with brackets and four expressions without brackets. Only one is equal to the first.</p>
          <p>Think: what is every term inside multiplied by? <span class="cuenta">2(<i>x</i> + 5) = 2<i>x</i> + 10</span>.</p>`,
      },
    },
    {
      nombre: { es: 'Resuelve con paréntesis', en: 'Solve with brackets' },
      detalle: { es: 'Resolver una ecuación con paréntesis', en: 'Solve an equation with brackets' },
      introduccion: {
        es: `<h3>Resuelve con paréntesis</h3>
          <p>Primero se quitan los paréntesis; después se resuelve como siempre.</p>
          <p><span class="cuenta">3(<i>x</i> − 2) = 12</span> → <span class="cuenta">3<i>x</i> − 6 = 12</span> → <span class="cuenta">3<i>x</i> = 18</span> → <span class="cuenta"><i>x</i> = 6</span>.</p>
          <p>Escribe solo el número: <span class="cuenta">6</span>, <span class="cuenta">−2</span> o <span class="cuenta">1/3</span>. Puedes escribir «x = 6».</p>`,
        en: `<h3>Solve with brackets</h3>
          <p>First remove the brackets; then solve as usual.</p>
          <p><span class="cuenta">3(<i>x</i> − 2) = 12</span> → <span class="cuenta">3<i>x</i> − 6 = 12</span> → <span class="cuenta">3<i>x</i> = 18</span> → <span class="cuenta"><i>x</i> = 6</span>.</p>
          <p>Write just the number: <span class="cuenta">6</span>, <span class="cuenta">−2</span> or <span class="cuenta">1/3</span>. You can write “x = 6”.</p>`,
      },
    },
    {
      nombre: { es: 'Caza el error', en: 'Spot the mistake' },
      detalle: { es: 'Decir si se han quitado bien los paréntesis o qué error hay', en: 'Say whether the brackets were removed correctly, or what the mistake is' },
      introduccion: {
        es: `<h3>Caza el error</h3>
          <p>Verás un paréntesis y cómo alguien lo ha quitado. Puede estar bien o tener un error.</p>
          <p>Por ejemplo, <span class="cuenta">3(<i>x</i> − 2) = 3<i>x</i> − 2</span> está mal: el 3 no ha multiplicado al segundo término.</p>
          <p>Elige «No hay error» si está bien, o el error que ves.</p>`,
        en: `<h3>Spot the mistake</h3>
          <p>You will see brackets and how someone removed them. It may be right or have a mistake.</p>
          <p>For example, <span class="cuenta">3(<i>x</i> − 2) = 3<i>x</i> − 2</span> is wrong: the 3 did not multiply the second term.</p>
          <p>Choose “No mistake” if it is right, or the mistake you see.</p>`,
      },
    },
  ],
  instrucciones: {
    quita: { es: 'Quita el paréntesis y reduce.', en: 'Expand the brackets and simplify.' },
    desarrollo: { es: '¿Cuál es el resultado de quitar el paréntesis?', en: 'What do you get when you expand the brackets?' },
    resuelve: { es: 'Resuelve la ecuación.', en: 'Solve the equation.' },
    errores: { es: 'Se han quitado los paréntesis así. ¿Está bien o tiene un error?', en: 'The brackets were removed like this. Is it right, or does it have a mistake?' },
  },
  campos: {
    expresion: { es: 'Tu expresión', en: 'Your expression' },
    solucion: { es: 'Tu solución', en: 'Your solution' },
    placeholderExpresion: '3x - 6',
    placeholderSolucion: 'x = 6',
  },
  errores: {
    ninguno: { es: 'No hay error', en: 'No mistake' },
    'un-termino': { es: 'Ha multiplicado solo un término del paréntesis', en: 'Multiplied only one term in the brackets' },
    signo: { es: 'Se ha equivocado en un signo', en: 'Got a sign wrong' },
    'sin-multiplicar': { es: 'Ha quitado el paréntesis sin multiplicar', en: 'Removed the brackets without multiplying' },
    haError: { es: 'Sí tiene un error.', en: 'It does have a mistake.' },
    otroError: { es: 'Ese no es el error.', en: 'That is not the mistake.' },
    noHayError: { es: 'No hay ningún error.', en: 'There is no mistake.' },
  },
};
