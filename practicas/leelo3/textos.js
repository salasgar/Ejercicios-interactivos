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

// ─── «No lo sé»: la explicación de los cuatro ejercicios (todos son de elegir) ──────

// El consejo va por PLANTILLA y no por instrucción: «leer» o «completar» juntan ítems muy distintos
// (−(−39), 6², «−9 is ___ than 18», «The ___ of 12 and 4 is 8»…) y un consejo común salía falso o vacío
// en muchos. Cada consejo es verdad para todos los ítems de su plantilla.
const LEER_MENOS = { es: 'El menos de un número se lee «negative» o «minus».', en: 'The minus of a number is read “negative” or “minus”.' };
const CONSEJO = {
  leer_entero: LEER_MENOS,
  leer_expresion: LEER_MENOS,
  leer_producto: LEER_MENOS,
  leer_temperatura: { es: 'Bajo cero se dice «minus», «negative» o «… below zero».', en: 'Below zero you say “minus”, “negative” or “… below zero”.' },
  absoluto_opuesto: { es: '|…| se lee «the absolute value of …» y −(…), con el menos solo delante, «the opposite of …».', en: '|…| is read “the absolute value of …” and −(…), with only a minus in front, “the opposite of …”.' },
  palabras_a_entero: { es: '«Negative», «minus» y «below zero» dicen que el número lleva menos.', en: '“Negative”, “minus” and “below zero” tell you the number has a minus sign.' },
  take_away_from: { es: 'Con «from» los números van al revés de como se dicen.', en: 'With “from”, the numbers go the other way round from how they are said.' },
  comparar: item => (item.frase.includes('°C')
    ? { es: 'Warmer es «más cálido», la temperatura mayor; colder es «más frío», la menor.', en: 'Warmer means a higher temperature; colder means a lower one.' }
    : { es: 'Greater than es «mayor que» y less than, «menor que»; en la recta, el mayor está más a la derecha.', en: 'On the number line, the greater number is further to the right.' }),
  orden: { es: 'En la recta, cuanto más a la izquierda, menor: entre dos negativos, es menor el de mayor valor absoluto.', en: 'On the number line, the further left, the less: between two negative numbers, the one with the greater absolute value is less.' },
  nombre_resultado: { es: 'Haz la suma, la resta, el producto y el cociente de los dos números: solo uno da el resultado de la frase.', en: 'Work out the sum, the difference, the product and the quotient of the two numbers: only one gives the result in the sentence.' },
  regla_de_signos: { es: 'Al multiplicar o dividir, signos iguales dan positivo y signos distintos, negativo.', en: 'When you multiply or divide, the same signs give a positive result and different signs a negative one.' },
  leer_potencia: { es: 'El exponente 2 se lee «squared», el 3 «cubed» y los demás, «to the power of …».', en: 'An exponent of 2 is read “squared”, 3 “cubed” and any other “to the power of …”.' },
  base_exponente: { es: 'La base es el número que se multiplica; el exponente es el número pequeño de arriba.', en: 'The base is the number that is multiplied; the exponent is the small number at the top.' },
  par_impar: item => (item.notacion
    ? { es: 'Even (par) es 2, 4, 6…; odd (impar) es 3, 5, 7…', en: 'Even numbers are 2, 4, 6…; odd numbers are 3, 5, 7…' }
    : { es: 'Con base negativa, un exponente par da positivo y uno impar, negativo.', en: 'With a negative base, an even exponent gives a positive result and an odd one a negative result.' }),
  cuadrado_cubo: { es: 'Squared es «al cuadrado» (exponente 2) y cubed, «al cubo» (exponente 3).', en: 'Squared means to the power of 2 and cubed, to the power of 3.' },
  frase_potencia: { es: '«The opposite of» cambia el signo de todo lo que viene detrás; «negative» va con el número, y si se eleva, entre paréntesis.', en: '“The opposite of” changes the sign of everything after it; “negative” goes with the number, in brackets if it is raised to a power.' },
  frase_operacion: { es: 'Escribe cada palabra en el orden en que se dice; un negativo detrás de + o − va entre paréntesis.', en: 'Write each word in the order it is said; a negative number after + or − goes in brackets.' },
};
const CONSEJO_PROBLEMA = { es: 'Busca qué se pide (change, balance, difference…) y haz la cuenta con los números del texto.', en: 'Find what is asked (change, balance, difference…) and do the calculation with the numbers in the text.' };

/** El consejo del ítem: el de su plantilla (los problemas comparten uno). */
export function consejoDe(item) {
  const c = CONSEJO[item.plantilla] ?? (item.instruccion === 'problema' ? CONSEJO_PROBLEMA : null);
  if (!c) throw new Error(`leelo3: la plantilla «${item.plantilla}» no tiene consejo`);
  return typeof c === 'function' ? c(item) : c;
}

const NOMBRE_ES = { sum: 'una suma', difference: 'una resta', product: 'un producto', quotient: 'un cociente' };
const OPERA = { sum: (a, b) => [`${a} + ${b}`, a + b], difference: (a, b) => [`${a} − ${b}`, a - b], product: (a, b) => [`${a} · ${b}`, a * b], quotient: (a, b) => [`${a} : ${b}`, a / b] };

/**
 * Lo que se dice del ítem. Casi siempre es `item.solucion` (el feedback); en «The ___ of a and b is r»
 * el feedback español dice «es el difference (resta)», «es el sum (suma)», así que la tarjeta lo dice a
 * su manera: «12 − 4 = 8 es una resta: su resultado es la difference».
 */
function delItem(item, tt) {
  if (item.plantilla !== 'nombre_resultado') return tt(item.solucion);
  const [, a, b] = /^The ___ of (\d+) and (\d+) is /.exec(item.frase).map(Number);
  const palabra = item.opciones.find(o => o.correcta).texto;
  const [cuenta, r] = OPERA[palabra](a, b);
  return tt({ es: `${cuenta} = ${r} es ${NOMBRE_ES[palabra]}: su resultado se llama ${palabra}.`, en: `${cuenta} = ${r}: it is the ${palabra}.` });
}

/** Ejercicios 1-4: el consejo de la plantilla, lo que dice el ítem y la opción buena. */
export function explicaElegir(item, { tt, esc }) {
  const buena = item.opciones.find(o => o.correcta);
  const respuesta = tt({ es: 'La respuesta es', en: 'The answer is' });
  const [abre, cierra] = tt({ es: ['«', '»'], en: ['“', '”'] });
  return `${tt(consejoDe(item))} ${delItem(item, tt)} ${respuesta} <span class="cuenta">${abre}${buena.html ?? esc(buena.texto)}${cierra}</span>.`;
}
