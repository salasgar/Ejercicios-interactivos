// Práctica «Quita denominadores» (unidad 6): textos propios, siempre { es, en }.

export const TX = {
  ejercicios: [
    {
      nombre: { es: '¿Por cuánto multiplico?', en: 'What do I multiply by?' },
      detalle: { es: 'Elegir el m.c.m. de los denominadores', en: 'Choose the LCM of the denominators' },
      introduccion: {
        es: `<h3>¿Por cuánto multiplico?</h3>
          <p>Para quitar los denominadores se multiplica por el <strong>m.c.m.</strong> de todos ellos: el menor número que es múltiplo de todos.</p>
          <p>En <span class="cuenta"><i>x</i>/3 + <i>x</i>/4 = 14</span> los denominadores son 3 y 4, y el m.c.m. es <strong>12</strong>.</p>
          <p>Elige el menor número por el que hay que multiplicar para que no quede ningún denominador.</p>`,
        en: `<h3>What do I multiply by?</h3>
          <p>To clear the denominators you multiply by the <strong>LCM</strong> of all of them: the smallest number that is a multiple of all of them.</p>
          <p>In <span class="cuenta"><i>x</i>/3 + <i>x</i>/4 = 14</span> the denominators are 3 and 4, and the LCM is <strong>12</strong>.</p>
          <p>Choose the smallest number you can multiply by so that no denominator is left.</p>`,
      },
    },
    {
      nombre: { es: 'Sin denominadores', en: 'Without fractions' },
      detalle: { es: 'Elegir la ecuación que sale al multiplicar por el m.c.m.', en: 'Choose the equation you get after multiplying by the LCM' },
      introduccion: {
        es: `<h3>Sin denominadores</h3>
          <p>Se multiplican los <strong>dos miembros</strong>, <strong>todos los términos</strong>, por el m.c.m.: <span class="cuenta">12 · <i>x</i>/3 = 4<i>x</i></span>, <span class="cuenta">12 · <i>x</i>/4 = 3<i>x</i></span>, <span class="cuenta">12 · 14 = 168</span>.</p>
          <p><span class="cuenta"><i>x</i>/3 + <i>x</i>/4 = 14</span> → <span class="cuenta">4<i>x</i> + 3<i>x</i> = 168</span>.</p>
          <p>Cuidado con los términos que no llevan denominador: también se multiplican.</p>`,
        en: `<h3>Without fractions</h3>
          <p>You multiply <strong>both sides</strong>, <strong>every term</strong>, by the LCM: <span class="cuenta">12 · <i>x</i>/3 = 4<i>x</i></span>, <span class="cuenta">12 · <i>x</i>/4 = 3<i>x</i></span>, <span class="cuenta">12 · 14 = 168</span>.</p>
          <p><span class="cuenta"><i>x</i>/3 + <i>x</i>/4 = 14</span> → <span class="cuenta">4<i>x</i> + 3<i>x</i> = 168</span>.</p>
          <p>Be careful with the terms that have no denominator: they are multiplied too.</p>`,
      },
    },
    {
      nombre: { es: 'Resuélvela', en: 'Solve it' },
      detalle: { es: 'Resolver una ecuación con denominadores', en: 'Solve an equation with denominators' },
      introduccion: {
        es: `<h3>Resuélvela</h3>
          <p>Primero se quitan los denominadores; después se resuelve como siempre.</p>
          <p><span class="cuenta"><i>x</i>/3 + <i>x</i>/4 = 14</span> → <span class="cuenta">4<i>x</i> + 3<i>x</i> = 168</span> → <span class="cuenta">7<i>x</i> = 168</span> → <span class="cuenta"><i>x</i> = 24</span>.</p>
          <p>Escribe solo el número: <span class="cuenta">24</span> o <span class="cuenta">−6</span>. Puedes escribir «x = 24».</p>`,
        en: `<h3>Solve it</h3>
          <p>First clear the denominators; then solve as usual.</p>
          <p><span class="cuenta"><i>x</i>/3 + <i>x</i>/4 = 14</span> → <span class="cuenta">4<i>x</i> + 3<i>x</i> = 168</span> → <span class="cuenta">7<i>x</i> = 168</span> → <span class="cuenta"><i>x</i> = 24</span>.</p>
          <p>Write just the number: <span class="cuenta">24</span> or <span class="cuenta">−6</span>. You can write “x = 24”.</p>`,
      },
    },
    {
      nombre: { es: 'Paso a paso', en: 'Step by step' },
      detalle: { es: 'El m.c.m., la ecuación sin denominadores y la solución', en: 'The LCM, the equation without denominators and the solution' },
      introduccion: {
        es: `<h3>Paso a paso</h3>
          <p>Rellena los tres huecos y pulsa «Comprobar»:</p>
          <p>1. El m.c.m. de los denominadores: <span class="cuenta">12</span>.</p>
          <p>2. La ecuación sin denominadores: <span class="cuenta">4x + 3x = 168</span>. Vale cualquier ecuación equivalente, por ejemplo <span class="cuenta">7x = 168</span>. Teclea la x y el «=».</p>
          <p>3. La solución: <span class="cuenta">x = 24</span>.</p>`,
        en: `<h3>Step by step</h3>
          <p>Fill in the three gaps and press “Check”:</p>
          <p>1. The LCM of the denominators: <span class="cuenta">12</span>.</p>
          <p>2. The equation without denominators: <span class="cuenta">4x + 3x = 168</span>. Any equivalent equation is fine, for example <span class="cuenta">7x = 168</span>. Type the x and the “=”.</p>
          <p>3. The solution: <span class="cuenta">x = 24</span>.</p>`,
      },
    },
  ],
  instrucciones: {
    mcm: { es: '¿Cuál es el menor número por el que hay que multiplicar los dos miembros para que desaparezcan todos los denominadores?', en: 'What is the smallest number you must multiply both sides by to clear every denominator?' },
    sin: { es: 'Multiplicas los dos miembros por el m.c.m. de los denominadores. ¿Qué ecuación sale?', en: 'You multiply both sides by the LCM of the denominators. Which equation do you get?' },
    resuelve: { es: 'Resuelve la ecuación.', en: 'Solve the equation.' },
    pasos: { es: 'Resuélvela paso a paso.', en: 'Solve it step by step.' },
  },
  campos: {
    solucion: { es: 'Tu solución', en: 'Your solution' },
    placeholderSolucion: 'x = 24',
    mcm: { es: '1. El m.c.m. de los denominadores', en: '1. The LCM of the denominators' },
    placeholderMcm: '12',
    cerrada: { es: '2. La ecuación sin denominadores', en: '2. The equation without denominators' },
    placeholderCerrada: '4x + 3x = 168',
    final: { es: '3. La solución', en: '3. The solution' },
    placeholderFinal: 'x = 24',
  },
};
