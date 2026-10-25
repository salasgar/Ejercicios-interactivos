// Textos propios de «Paréntesis y corchetes», siempre { es, en }. Los comunes
// (Comprobar, Siguiente…) están en `../_comun/textos.js`.
//
// Reglas (proyecto.md): producto con «·», nunca «×»; el menos que se ve es «−»
// (U+2212); inglés sencillo; el paréntesis «+(» solo existe como (+) delante de un
// paréntesis de agrupación; y el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.
// Los ejemplos de las introducciones no son los de las hojas ni los de los exámenes.

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Quita el paréntesis', en: 'Remove the brackets' },
      detalle: { es: 'Reescribe sin paréntesis, con los signos que toquen', en: 'Rewrite it without brackets, with the right signs' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Tienes que escribir la cuenta <strong>sin paréntesis</strong>. Lo que cambia depende del signo que hay <strong>delante</strong> del paréntesis:</p>
          <p>Con un <strong>+</strong> delante, los signos de dentro <strong>no cambian</strong>: <strong>7 + (4 − 9) = 7 + 4 − 9</strong>.</p>
          <p>Con un <strong>−</strong> delante, <strong>cambian todos</strong> los signos de dentro: <strong>7 − (4 − 9) = 7 − 4 + 9</strong>.</p>
          <p>Toca el signo de un número para cambiarlo.</p>`,
        en: `<h2>How it works</h2>
          <p>You have to write the sum <strong>without brackets</strong>. What changes depends on the sign <strong>in front of</strong> the brackets:</p>
          <p>With a <strong>+</strong> in front, the signs inside <strong>stay the same</strong>: <strong>7 + (4 − 9) = 7 + 4 − 9</strong>.</p>
          <p>With a <strong>−</strong> in front, <strong>every</strong> sign inside <strong>changes</strong>: <strong>7 − (4 − 9) = 7 − 4 + 9</strong>.</p>
          <p>Tap the sign of a number to change it.</p>`,
      },
    },
    {
      nombre: { es: 'Calcula', en: 'Work it out' },
      detalle: { es: 'Sumas y restas con paréntesis: opera dentro o quítalos', en: 'Additions and subtractions with brackets: work inside or remove them' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Hay dos caminos y los dos dan el mismo resultado. Por ejemplo, <strong>20 − (6 − 11 + 4) + (−3 + 5)</strong>:</p>
          <p><strong>Opero dentro:</strong> 20 − (−1) + 2 = 21 + 2 = 23.</p>
          <p><strong>Quito los paréntesis:</strong> 20 − 6 + 11 − 4 − 3 + 5 = 23.</p>
          <p>Escribe el resultado. Si dudas, los botones de ayuda te enseñan cada camino (cuentan como pista).</p>`,
        en: `<h2>How it works</h2>
          <p>There are two ways and both give the same answer. For example, <strong>20 − (6 − 11 + 4) + (−3 + 5)</strong>:</p>
          <p><strong>Work inside:</strong> 20 − (−1) + 2 = 21 + 2 = 23.</p>
          <p><strong>Remove the brackets:</strong> 20 − 6 + 11 − 4 − 3 + 5 = 23.</p>
          <p>Write the answer. If you are not sure, the help buttons show you each way (they count as a hint).</p>`,
      },
    },
    {
      nombre: { es: '¿Al paréntesis o al número?', en: 'The whole bracket or one number?' },
      detalle: { es: 'La potencia y el producto cerca de un paréntesis', en: 'Powers and products next to brackets' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Mira dónde está la potencia. <strong>2 − (4 + 2)<sup>2</sup></strong> es 2 − 6<sup>2</sup> = 2 − 36 = −34: el exponente es de <strong>todo el paréntesis</strong>.</p>
          <p><strong>2 − (4 + 2<sup>2</sup>)</strong> es 2 − (4 + 4) = 2 − 8 = −6: el exponente es <strong>solo del 2</strong>.</p>
          <p>Calcula cada cuenta y escribe su resultado.</p>`,
        en: `<h2>How it works</h2>
          <p>Look at where the power is. <strong>2 − (4 + 2)<sup>2</sup></strong> is 2 − 6<sup>2</sup> = 2 − 36 = −34: the exponent belongs to <strong>the whole brackets</strong>.</p>
          <p><strong>2 − (4 + 2<sup>2</sup>)</strong> is 2 − (4 + 4) = 2 − 8 = −6: the exponent belongs <strong>only to the 2</strong>.</p>
          <p>Work out each sum and write its answer.</p>`,
      },
    },
    {
      nombre: { es: 'De dentro afuera', en: 'From the inside out' },
      detalle: { es: 'Paréntesis dentro de corchetes: se empieza por el de más adentro', en: 'Brackets inside square brackets: start with the innermost' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Si un paréntesis está dentro de unos corchetes, se calcula <strong>primero el de más adentro</strong>:</p>
          <p><strong>[12 − (9 − 4)] − 3</strong> = [12 − 5] − 3 = 7 − 3 = 4.</p>
          <p>Toca el paréntesis o los corchetes que se calculan primero, escribe cuánto valen y sigue hasta el final.</p>`,
        en: `<h2>How it works</h2>
          <p>If a pair of round brackets is inside square brackets, work out <strong>the innermost first</strong>:</p>
          <p><strong>[12 − (9 − 4)] − 3</strong> = [12 − 5] − 3 = 7 − 3 = 4.</p>
          <p>Tap the brackets to work out first, write what they are worth and go on until the end.</p>`,
      },
    },
    {
      nombre: { es: 'Coloca los paréntesis', en: 'Place the brackets' },
      detalle: { es: 'Pon un par de paréntesis para conseguir el resultado', en: 'Put one pair of brackets to get the result' },
      introduccion: {
        es: `<h2>Cómo se hace</h2>
          <p>Sin paréntesis, <strong>3 + 4 · 5 = 23</strong>. Para que dé <strong>35</strong> hay que poner <strong>(3 + 4) · 5</strong> = 7 · 5 = 35.</p>
          <p>Toca un hueco para poner «(» y otro para poner «)». Vale cualquier colocación que dé el resultado.</p>`,
        en: `<h2>How it works</h2>
          <p>With no brackets, <strong>3 + 4 · 5 = 23</strong>. To get <strong>35</strong> you have to write <strong>(3 + 4) · 5</strong> = 7 · 5 = 35.</p>
          <p>Tap one gap to put «(» and another to put «)». Any place that gives the answer is fine.</p>`,
      },
    },
  ],

  // ─── 1 ───
  quita: {
    instruccion: { es: 'Escribe la cuenta sin paréntesis. Toca el signo de los números de dentro para cambiarlo.', en: 'Write the sum without brackets. Tap the sign of the numbers inside to change it.' },
    fichas: { es: 'Sin paréntesis', en: 'Without brackets' },
    cambiar: { es: 'Cambiar el signo de', en: 'Change the sign of' },
    razon_mas: {
      es: 'Delante del paréntesis hay un +: los signos de dentro no cambian.',
      en: 'There is a + in front of the brackets: the signs inside stay the same.',
    },
    razon_menos: {
      es: 'Delante del paréntesis hay un −: cambian todos los signos de dentro.',
      en: 'There is a − in front of the brackets: every sign inside changes.',
    },
    error: {
      'cambia-con-mas': { es: 'Has cambiado signos, pero con un + delante no cambia ninguno.', en: 'You changed signs, but with a + in front none of them changes.' },
      'ignora-el-menos-de-delante': { es: 'Has dejado los signos como estaban, pero el − de delante los cambia.', en: 'You left the signs as they were, but the − in front changes them.' },
      'menos-solo-al-primero': { es: 'Solo has cambiado el signo del primer número: el − de delante afecta a todos los de dentro.', en: 'You only changed the sign of the first number: the − in front affects every number inside.' },
      'signos-a-medias': { es: 'Faltan signos por cambiar: con un − delante cambian todos los de dentro.', en: 'Some signs are not changed: with a − in front, every sign inside changes.' },
    },
    tuya: { es: 'Lo que has escrito', en: 'What you wrote' },
    original: { es: 'La cuenta original', en: 'The original sum' },
    vale: { es: 'vale', en: 'is worth' },
    bien: { es: 'Bien escrita', en: 'Written correctly' },
  },

  // ─── 2 ───
  calcula: {
    instruccion: { es: 'Calcula. Puedes operar dentro de los paréntesis o quitarlos.', en: 'Work it out. You can work inside the brackets or remove them.' },
    resultado: { es: 'Resultado', en: 'Answer' },
    ayuda_dentro: { es: 'Ayuda: opero dentro', en: 'Help: work inside' },
    ayuda_quito: { es: 'Ayuda: quito los paréntesis', en: 'Help: remove the brackets' },
    camino_dentro: { es: 'Operando dentro', en: 'Working inside' },
    camino_quito: { es: 'Quitando los paréntesis', en: 'Removing the brackets' },
    mismo: { es: 'Los dos caminos dan el mismo resultado.', en: 'Both ways give the same answer.' },
    tuyo: { es: v => `Has escrito ${v}`, en: v => `You wrote ${v}` },
    error: {
      'menos-solo-al-primero': { es: 'Parece que al quitar un paréntesis precedido de − solo has cambiado el signo del primer número.', en: 'It looks like, after a −, you only changed the sign of the first number when removing the brackets.' },
      'ignora-el-menos-de-delante': { es: 'Parece que has olvidado el − de delante de un paréntesis.', en: 'It looks like you forgot the − in front of some brackets.' },
      'cambia-con-mas': { es: 'Parece que has cambiado los signos de un paréntesis con un + delante.', en: 'It looks like you changed the signs inside brackets with a + in front.' },
      'restar-negativo': { es: 'Parece que has restado un número negativo como si fuera positivo.', en: 'It looks like you subtracted a negative number as if it were positive.' },
    },
  },

  // ─── 3 ───
  potencia: {
    instruccion_pareja: { es: 'Calcula las dos cuentas. Fíjate en dónde está el exponente.', en: 'Work out both sums. Look at where the exponent is.' },
    instruccion_sola: { es: 'Calcula. Haz primero lo de dentro del paréntesis.', en: 'Work it out. Do the inside of the brackets first.' },
    cuenta_a: { es: 'Cuenta A', en: 'Sum A' },
    cuenta_b: { es: 'Cuenta B', en: 'Sum B' },
    resultado: { es: 'Resultado', en: 'Answer' },
    // meta de la pareja: { c, a, b, n, o, s }
    nota_par_pot: {
      es: ({ a, b, n, o }) => `En la A, el exponente ${n} es de todo el paréntesis: primero ${a} ${o} ${b}, y después se eleva. En la B, el ${n} es solo de ${b}: primero ${b}<sup>${n}</sup> y después se opera dentro.`,
      en: ({ a, b, n, o }) => `In A, the exponent ${n} belongs to the whole brackets: first ${a} ${o} ${b}, then raise it. In B, the ${n} belongs only to ${b}: first ${b}<sup>${n}</sup>, then work inside.`,
    },
    nota_prod_neg: {
      es: ({ a, b, n }) => `En la A, el exponente ${n} afecta a todo el paréntesis, con su signo: (−${a} · ${b})<sup>${n}</sup>. En la B, solo afecta a ${b}: −${a} · ${b}<sup>${n}</sup> es −${a} por ${b}<sup>${n}</sup>.`,
      en: ({ a, b, n }) => `In A, the exponent ${n} affects the whole brackets, with its sign: (−${a} · ${b})<sup>${n}</sup>. In B, it only affects ${b}: −${a} · ${b}<sup>${n}</sup> is −${a} times ${b}<sup>${n}</sup>.`,
    },
    error: {
      'confunde-las-dos': { es: 'Has dado el resultado de la otra cuenta: no son iguales.', en: 'You gave the answer of the other sum: they are not the same.' },
      'ignora-el-parentesis': { es: 'Parece que no has tenido en cuenta el paréntesis.', en: 'It looks like you ignored the brackets.' },
      'sin-jerarquia': { es: 'Parece que has sumado o restado antes de multiplicar o elevar.', en: 'It looks like you added or subtracted before multiplying or raising to a power.' },
      'derecha-a-izquierda': { es: 'Parece que has operado de derecha a izquierda.', en: 'It looks like you worked from right to left.' },
    },
    tus_respuestas: { es: (a, b) => `Has escrito ${a} y ${b}`, en: (a, b) => `You wrote ${a} and ${b}` },
    tu_respuesta: { es: v => `Has escrito ${v}`, en: v => `You wrote ${v}` },
  },

  // ─── 4 ───
  corchetes: {
    toca: { es: 'Toca el paréntesis o los corchetes que se calculan primero.', en: 'Tap the brackets that are worked out first.' },
    cuanto: { es: '¿Cuánto vale?', en: 'What is it worth?' },
    final: { es: 'Ya no quedan paréntesis. ¿Cuánto vale la cuenta?', en: 'No brackets left. What is the sum worth?' },
    primero_dentro: { es: 'Ese tiene otro dentro: empieza por el de más adentro.', en: 'That one has another inside: start with the innermost.' },
    valor_de: { es: 'Valor', en: 'Value' },
    historial: { es: 'Hasta ahora', en: 'So far' },
    en_ese: { es: (trozo, bien) => `${trozo} vale ${bien}`, en: (trozo, bien) => `${trozo} is worth ${bien}` },
    error: {
      'derecha-a-izquierda': { es: 'Parece que has operado de derecha a izquierda.', en: 'It looks like you worked from right to left.' },
      'olvida-el-signo': { es: 'Parece que se te ha olvidado el signo menos del resultado.', en: 'It looks like you forgot the minus sign of the answer.' },
      'suma-valores-absolutos': { es: 'Parece que has sumado los números aunque tienen signos distintos.', en: 'It looks like you added the numbers although their signs are different.' },
      'signo-cambiado': { es: 'Tienes bien el número, pero no el signo.', en: 'The number is right, but not the sign.' },
    },
    tu_respuesta: { es: v => `Has escrito ${v}`, en: v => `You wrote ${v}` },
  },

  // ─── 5 ───
  colocar: {
    instruccion: { es: 'Pon un par de paréntesis para que la cuenta dé el resultado.', en: 'Put one pair of brackets so that the sum gives the answer.' },
    hueco_abre: { es: 'Abrir paréntesis antes de', en: 'Open bracket before' },
    hueco_cierra: { es: 'Cerrar paréntesis después de', en: 'Close bracket after' },
    borrar: { es: 'Borrar', en: 'Clear' },
    falta: { es: 'Pon un «(» y un «)».', en: 'Put a «(» and a «)».' },
    orden: { es: 'El «(» tiene que ir antes que el «)», con dos números o más dentro.', en: 'The «(» has to come before the «)», with two numbers or more inside.' },
    todo: { es: 'Los paréntesis no pueden rodear toda la cuenta: no cambiarían nada.', en: 'The brackets cannot go around the whole sum: they would change nothing.' },
    tu_colocacion: { es: 'Tu colocación', en: 'Your brackets' },
    da: { es: 'da', en: 'gives' },
    no: { es: 'no', en: 'not' },
    una_vale: { es: 'Una que sirve', en: 'One that works' },
    sin_paren: { es: 'Sin paréntesis', en: 'Without brackets' },
  },
};
