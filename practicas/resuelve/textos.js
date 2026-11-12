// Práctica «Resuelve»: textos propios, siempre { es, en }. Los comunes (Comprobar, Siguiente…) llegan
// a `montar` en `api.t`. Reglas de contenido (reparto-practicas-u2/proyecto.md y la ficha 150): producto
// con «·», nunca «×»; inglés sencillo con la palabra clave aclarada; el feedback habla de LOS NÚMEROS
// DE ESE ÍTEM (las cuentas llegan ya escritas, en HTML, desde practica.js).

export const TX = {
  // --- Ejercicio 1: el primer paso ---------------------------------------------------------------
  ej1: {
    nombre: { es: 'El primer paso', en: 'The first step' },
    detalle: { es: 'Elige el paso que pasa bien los términos de un miembro al otro', en: 'Choose the step that moves the terms to the other side correctly' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para resolver una ecuación con <strong>x en los dos miembros</strong>, primero se pasan los términos con x a un miembro y los números al otro. Lo que cambia de miembro <strong>cambia de signo</strong>.</p>
        <p>Por ejemplo: <span class="cuenta">6x − 2 = 2x + 14</span> → <span class="cuenta">6x − 2x = 14 + 2</span>.</p>
        <p>Te damos cuatro líneas: elige la que está bien. Las otras tienen otra solución.</p>`,
      en: `<h2>How it works</h2>
        <p>To solve an equation with <strong>x on both sides</strong>, first you move the terms with x to one side and the numbers to the other side. A term that changes side <strong>changes sign</strong>.</p>
        <p>For example: <span class="cuenta">6x − 2 = 2x + 14</span> → <span class="cuenta">6x − 2x = 14 + 2</span>.</p>
        <p>You get four lines: choose the right one. The others have a different solution.</p>`,
    },
    instruccion: {
      es: 'Elige el paso que pasa bien los términos con x a la izquierda y los números a la derecha.',
      en: 'Choose the step that moves the terms with x to the left and the numbers to the right (side = miembro).',
    },
    bien: {
      es: b => `Bien: <span class="cuenta">${b}</span>. Los términos con x a la izquierda, los números a la derecha, y lo que cambia de miembro cambia de signo.`,
      en: b => `Right: <span class="cuenta">${b}</span>. The terms with x go to the left, the numbers go to the right, and a term that changes side changes sign.`,
    },
    mal: {
      'transponer-sin-signo': {
        es: b => `Al pasar un término al otro miembro hay que cambiarle el signo. El paso bueno es <span class="cuenta">${b}</span>.`,
        en: b => `When a term moves to the other side, its sign changes. The right step is <span class="cuenta">${b}</span>.`,
      },
      'x-sin-signo': {
        es: (b, t, o) => `El término <span class="cuenta">${t}</span> pasa al otro miembro como <span class="cuenta">${o}</span>: cambia de signo. El paso bueno es <span class="cuenta">${b}</span>.`,
        en: (b, t, o) => `The term <span class="cuenta">${t}</span> moves to the other side as <span class="cuenta">${o}</span>: its sign changes. The right step is <span class="cuenta">${b}</span>.`,
      },
      'numero-sin-signo': {
        es: (b, t) => `El número <span class="cuenta">${t}</span> pasa al otro miembro con el signo cambiado. El paso bueno es <span class="cuenta">${b}</span>.`,
        en: (b, t) => `The number <span class="cuenta">${t}</span> moves to the other side with its sign changed. The right step is <span class="cuenta">${b}</span>.`,
      },
      'pierde-un-termino': {
        es: (b, t) => `Se ha perdido el término <span class="cuenta">${t}</span>: al pasarlo al otro miembro no desaparece, cambia de signo. El paso bueno es <span class="cuenta">${b}</span>.`,
        en: (b, t) => `The term <span class="cuenta">${t}</span> has been lost: when it moves to the other side it does not disappear, its sign changes. The right step is <span class="cuenta">${b}</span>.`,
      },
    },
  },

  // --- Ejercicio 2: paso a paso -----------------------------------------------------------------
  ej2: {
    nombre: { es: 'Paso a paso', en: 'Step by step' },
    detalle: { es: 'Reduce los términos y despeja la x completando los huecos', en: 'Add up the terms and solve for x by filling in the gaps' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cuando ya tienes las x a un lado y los números al otro, <strong>sumas los términos semejantes</strong> y <strong>divides</strong> entre el número que acompaña a la x.</p>
        <p>Por ejemplo: <span class="cuenta">6x − 2x = 14 + 2</span> → <span class="cuenta">4x = 16</span> → <span class="cuenta">x = 16 : 4 = 4</span>.</p>
        <p>Rellena los tres huecos. Si la solución es una fracción, simplifícala.</p>`,
      en: `<h2>How it works</h2>
        <p>When the x terms are on one side and the numbers on the other side, you <strong>add the like terms</strong> (términos semejantes) and <strong>divide</strong> by the number in front of x.</p>
        <p>For example: <span class="cuenta">6x − 2x = 14 + 2</span> → <span class="cuenta">4x = 16</span> → <span class="cuenta">x = 16 : 4 = 4</span>.</p>
        <p>Fill in the three gaps. If the solution is a fraction, simplify it.</p>`,
    },
    instruccion: { es: 'Completa los tres huecos.', en: 'Fill in the three gaps.' },
    suma_x: { es: 'Número delante de la x', en: 'Number in front of x' },
    suma_n: { es: 'Número del segundo miembro', en: 'Number on the right-hand side' },
    solucion: { es: 'Valor de x', en: 'Value of x' },
    bien: {
      es: (l1, l2) => `Bien: <span class="cuenta">${l1}</span> y <span class="cuenta">${l2}</span>.`,
      en: (l1, l2) => `Right: <span class="cuenta">${l1}</span> and <span class="cuenta">${l2}</span>.`,
    },
    mal_x: {
      es: (cuenta, A, l1) => `Los términos con x se suman con su signo: <span class="cuenta">${cuenta} = ${A}</span>. La línea queda <span class="cuenta">${l1}</span>.`,
      en: (cuenta, A, l1) => `The terms with x are added with their signs: <span class="cuenta">${cuenta} = ${A}</span>. The line is <span class="cuenta">${l1}</span>.`,
    },
    mal_n: {
      es: (cuenta, C, l1) => `Los números se suman con su signo: <span class="cuenta">${cuenta} = ${C}</span>. La línea queda <span class="cuenta">${l1}</span>.`,
      en: (cuenta, C, l1) => `The numbers are added with their signs: <span class="cuenta">${cuenta} = ${C}</span>. The line is <span class="cuenta">${l1}</span>.`,
    },
    copia: {
      es: l1 => `El número del segundo miembro no cambia: se copia. La línea queda <span class="cuenta">${l1}</span>.`,
      en: l1 => `The number on the right-hand side does not change: you copy it. The line is <span class="cuenta">${l1}</span>.`,
    },
    mal_sol: {
      es: (l1, div, l2) => `El número de la x pasa <strong>dividiendo</strong>: <span class="cuenta">${div}</span>. De <span class="cuenta">${l1}</span> sale <span class="cuenta">${l2}</span>.`,
      en: (l1, div, l2) => `The number in front of x moves across as a <strong>division</strong>: <span class="cuenta">${div}</span>. From <span class="cuenta">${l1}</span> you get <span class="cuenta">${l2}</span>.`,
    },
  },

  // --- Ejercicio 3: resuélvela ------------------------------------------------------------------
  ej3: {
    nombre: { es: 'Resuélvela', en: 'Solve it' },
    detalle: { es: 'Resuelve la ecuación y da la solución', en: 'Solve the equation and give the solution' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Resuelve la ecuación en tu cuaderno (o de cabeza) y escribe o elige <strong>el valor de x</strong>. La solución puede ser <strong>negativa</strong> o una <strong>fracción</strong>, y a veces es <strong>0</strong>.</p>
        <p>Por ejemplo: <span class="cuenta">4x − 3 = 7x − 18</span> → <span class="cuenta">−3x = −15</span> → <span class="cuenta">x = 5</span>.</p>
        <p>Si es una fracción, escríbela con una barra (<strong>−5/2</strong>) y simplifícala. Al final, comprueba tu respuesta sustituyendo.</p>`,
      en: `<h2>How it works</h2>
        <p>Solve the equation in your notebook (or in your head) and write or choose <strong>the value of x</strong>. The solution can be <strong>negative</strong> or a <strong>fraction</strong>, and sometimes it is <strong>0</strong>.</p>
        <p>For example: <span class="cuenta">4x − 3 = 7x − 18</span> → <span class="cuenta">−3x = −15</span> → <span class="cuenta">x = 5</span>.</p>
        <p>If it is a fraction, write it with a slash (<strong>−5/2</strong>) and simplify it. At the end, check your answer by substituting.</p>`,
    },
    instruccion_escribir: { es: 'Resuelve la ecuación y escribe el valor de x.', en: 'Solve the equation and write the value of x.' },
    instruccion_elegir: { es: 'Resuelve la ecuación y elige el valor de x.', en: 'Solve the equation and choose the value of x.' },
    campo: { es: 'Valor de x', en: 'Value of x' },
    bien: {
      es: (res, comp) => `Bien. ${res} ${comp}`,
      en: (res, comp) => `Right. ${res} ${comp}`,
    },
    simplifica: {
      es: s => ` (Mejor simplificada: <span class="cuenta">${s}</span>.)`,
      en: s => ` (Better simplified: <span class="cuenta">${s}</span>.)`,
    },
    resolucion: { es: 'La resolución:', en: 'The working:' },
    comprobacion: { es: 'Comprobación', en: 'Check' },
    y: { es: 'y', en: 'and' },
    mal: {
      'transponer-sin-signo': {
        es: () => 'Al pasar un término al otro miembro hay que cambiarle el signo.',
        en: () => 'When a term moves to the other side, its sign changes.',
      },
      'pasar-factor-restando': {
        es: (A, C) => `El <span class="cuenta">${A}</span> que multiplica a la x pasa <strong>dividiendo</strong>, no restando: x = ${C} : ${A}.`,
        en: (A, C) => `The <span class="cuenta">${A}</span> in front of x moves across by <strong>dividing</strong>, not by subtracting: x = ${C} : ${A}.`,
      },
      'multiplicar-en-vez-de-dividir': {
        es: (A, C) => `El <span class="cuenta">${A}</span> pasa <strong>dividiendo</strong>, no multiplicando: x = ${C} : ${A}.`,
        en: (A, C) => `The <span class="cuenta">${A}</span> moves across by <strong>dividing</strong>, not by multiplying: x = ${C} : ${A}.`,
      },
      'invertir-coeficiente': {
        es: (A, C) => `Se divide el número del segundo miembro entre el de la x: ${C} : ${A}, no al revés.`,
        en: (A, C) => `You divide the number on the right-hand side by the one in front of x: ${C} : ${A}, not the other way round.`,
      },
      'signo-al-dividir': {
        es: (A, C, s) => `Al dividir entre un número negativo el signo cuenta: ${C} : ${A} = ${s}.`,
        en: (A, C, s) => `When you divide by a negative number the sign matters: ${C} : ${A} = ${s}.`,
      },
      'signo-de-la-solucion': {
        es: s => `Cuidado con el signo: la solución es ${s}.`,
        en: s => `Careful with the sign: the solution is ${s}.`,
      },
      'otra-respuesta': { es: () => '', en: () => '' },
    },
  },

  // --- Ejercicio 4: ¿está bien resuelta? --------------------------------------------------------
  ej4: {
    nombre: { es: '¿Está bien resuelta?', en: 'Is it solved correctly?' },
    detalle: { es: 'Encuentra el paso con el error (o di que no hay ninguno)', en: 'Find the step with the mistake (or say there is none)' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un compañero ha resuelto una ecuación en tres pasos. <strong>A veces se ha equivocado en un paso</strong> y otras veces está todo bien.</p>
        <p>Toca el paso donde está el error. Un paso solo está mal si <strong>no sale bien de la línea de arriba</strong>: lo que viene después puede estar bien a partir de ese error.</p>
        <p>Si todo está bien, toca <strong>«Todo está bien»</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>A classmate has solved an equation in three steps. <strong>Sometimes there is a mistake in one step</strong> and sometimes everything is right.</p>
        <p>Tap the step with the mistake. A step is wrong only if it <strong>does not follow correctly from the line above</strong>: the steps after it can be right from that mistake.</p>
        <p>If everything is right, tap <strong>“All correct”</strong>.</p>`,
    },
    instruccion: { es: 'Toca el paso que tiene el error.', en: 'Tap the step that has the mistake.' },
    paso: { es: n => `Paso ${n}`, en: n => `Step ${n}` },
    todoBien: { es: 'Todo está bien', en: 'All correct' },
    bien_ninguno: {
      es: (comp) => `Sí: todos los pasos están bien. ${comp}`,
      en: (comp) => `Yes: every step is right. ${comp}`,
    },
    bien_paso: {
      es: (k, correcta, nombre) => `Sí: el paso ${k} está mal. Tendría que ser <span class="cuenta">${correcta}</span>. Error: ${nombre}.`,
      en: (k, correcta, nombre) => `Yes: step ${k} is wrong. It should be <span class="cuenta">${correcta}</span>. Mistake: ${nombre}.`,
    },
    mal_paso_bueno: {
      es: (k, hay) => `El paso ${k} está bien: sale correctamente de la línea de arriba. ${hay}`,
      en: (k, hay) => `Step ${k} is right: it follows correctly from the line above. ${hay}`,
    },
    hay_error: {
      es: (k, correcta, nombre) => `El error está en el paso ${k}: tendría que ser <span class="cuenta">${correcta}</span>. Error: ${nombre}.`,
      en: (k, correcta, nombre) => `The mistake is in step ${k}: it should be <span class="cuenta">${correcta}</span>. Mistake: ${nombre}.`,
    },
    no_hay_error: { es: 'En realidad todos los pasos están bien.', en: 'In fact every step is right.' },
  },
};
