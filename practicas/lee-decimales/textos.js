// Práctica «Lee y escribe decimales» (unidad 5): textos propios, siempre { es, en }. Los comunes
// (Comprobar, Siguiente, ¡Bien!…) están en `../_comun/textos.js` y llegan a `montar` en `api.t`.
// Un texto con números es una función en cada idioma; los números llegan ya escritos en el idioma
// del texto (coma en español, punto en inglés). Producto con «·», nunca «×»; ni porcentajes ni letras.
// Las fracciones llegan como HTML (`htmlFraccion`).

import { htmlFraccion, fraccion } from '../_comun/fracciones.js';

const H = (n, d) => htmlFraccion(fraccion(n, d), { compacta: true });

export const TX = {
  ejercicios: [
    {
      nombre: { es: 'Léelo', en: 'Say it' },
      detalle: { es: 'Leer un decimal y escribir con cifras uno que se lee', en: 'Read a decimal and write in figures one you read' },
      introduccion: {
        es: `<h3>Cómo se lee un decimal</h3>
          <p>En español se lee la parte entera, «coma» y la parte decimal: <strong>3,75</strong> es <em>tres coma setenta y cinco</em> o <em>tres unidades y setenta y cinco centésimas</em>. Las dos valen.</p>
          <p>En inglés se escribe un <strong>punto</strong> (<strong>3.75</strong>) y después del punto se lee <strong>cifra a cifra</strong>: <em>three point seven five</em>. El 0 se lee <em>nought</em> (o <em>zero</em>): <em>0.05</em> es <em>nought point nought five</em>.</p>
          <p>Unas veces verás el número y elegirás cómo se lee; otras verás cómo se lee y elegirás el número.</p>`,
        en: `<h3>How to read a decimal</h3>
          <p>In English we write a <strong>point</strong> (<strong>3.75</strong>) and after the point we read <strong>one digit at a time</strong>: <em>three point seven five</em>. We read 0 as <em>nought</em> (or <em>zero</em>): <em>0.05</em> is <em>nought point nought five</em>.</p>
          <p>In Spanish we write a comma (3,75) and we read <em>tres coma setenta y cinco</em> or <em>tres unidades y setenta y cinco centésimas</em>. Both are fine.</p>
          <p>Sometimes you will see the number and choose how it is read; other times you will see how it is read and choose the number.</p>`,
      },
    },
    {
      nombre: { es: '¿Qué vale esta cifra?', en: 'What is this digit worth?' },
      detalle: { es: 'El valor de una cifra y la descomposición de un decimal', en: 'The value of a digit and breaking a decimal down' },
      introduccion: {
        es: `<h3>El valor de cada cifra</h3>
          <p>Cada cifra vale según el lugar que ocupa. En <strong>4,507</strong>: el 5 son 5 <strong>décimas</strong> (0,5), el 0 son 0 <strong>centésimas</strong> y el 7 son 7 <strong>milésimas</strong> (0,007).</p>
          <p>Descomponer es escribir el número como suma de lo que vale cada cifra: <strong>4,507 = 4 + 0,5 + 0,007</strong>.</p>
          <p>Unas veces te preguntamos cuánto vale una cifra marcada; otras, qué suma es la descomposición del número.</p>`,
        en: `<h3>The value of each digit</h3>
          <p>Each digit is worth something depending on its place. In <strong>4.507</strong>: the 5 is 5 <strong>tenths</strong> (0.5), the 0 is 0 <strong>hundredths</strong> and the 7 is 7 <strong>thousandths</strong> (0.007).</p>
          <p>To break a number down is to write it as a sum of what each digit is worth: <strong>4.507 = 4 + 0.5 + 0.007</strong>.</p>
          <p>Sometimes we ask how much a marked digit is worth; other times, which sum is the breakdown of the number.</p>`,
      },
    },
    {
      nombre: { es: 'La fracción decimal', en: 'Decimal fractions' },
      detalle: { es: 'Pasar de decimal a fracción decimal y al revés', en: 'Change a decimal into a decimal fraction and back' },
      introduccion: {
        es: `<h3>Fracciones decimales</h3>
          <p>Una <strong>fracción decimal</strong> tiene como denominador 10, 100 o 1000. Para pasar de decimal a fracción, escribe todas las cifras sin la coma arriba, y abajo un 1 con tantos ceros como cifras decimales: <strong>3,75 = ${H(375, 100)}</strong> (dos cifras decimales, dos ceros).</p>
          <p>Al revés: <strong>${H(7, 10)} = 0,7</strong>. Los ceros del denominador te dicen cuántas cifras decimales hay.</p>
          <p>Aquí no se simplifica todavía: ${H(375, 100)} se queda así.</p>`,
        en: `<h3>Decimal fractions</h3>
          <p>A <strong>decimal fraction</strong> has 10, 100 or 1000 as its denominator. To change a decimal into a fraction, write all the digits without the point on top, and a 1 with as many zeros as decimal places at the bottom: <strong>3.75 = ${H(375, 100)}</strong> (two decimal places, two zeros).</p>
          <p>The other way round: <strong>${H(7, 10)} = 0.7</strong>. The zeros of the denominator tell you how many decimal places there are.</p>
          <p>We do not simplify yet: ${H(375, 100)} stays as it is.</p>`,
      },
    },
    {
      nombre: { es: 'En la recta', en: 'On the number line' },
      detalle: { es: 'Tocar un decimal en la recta y leer el que marca un punto', en: 'Touch a decimal on the number line and read the one a point shows' },
      introduccion: {
        es: `<h3>Decimales en la recta</h3>
          <p>Entre dos números la recta se parte en <strong>10 huecos iguales</strong>. Entre 2 y 3, cada hueco vale 0,1: la séptima marca después del 2 es <strong>2,7</strong>.</p>
          <p>Cuenta <strong>huecos</strong>, no marcas: la marca del 2 es la de salida (0 huecos).</p>
          <p>Unas veces tienes que tocar la marca de un número; otras, escribir el número que marca el punto.</p>`,
        en: `<h3>Decimals on the number line</h3>
          <p>Between two numbers the line is split into <strong>10 equal gaps</strong>. Between 2 and 3, each gap is 0.1: the seventh mark after 2 is <strong>2.7</strong>.</p>
          <p>Count <strong>gaps</strong>, not marks: the mark at 2 is the starting point (0 gaps).</p>
          <p>Sometimes you have to touch the mark of a number; other times, write the number the point shows.</p>`,
      },
    },
  ],

  instrucciones: {
    lectura: { es: 'Elige cómo se lee este número', en: 'Choose how this number is read' },
    cifras: { es: 'Elige el número que se lee así', en: 'Choose the number that is read like this' },
    valor: { es: 'Elige lo que vale la cifra marcada', en: 'Choose what the marked digit is worth' },
    suma: { es: 'Elige la descomposición de este número', en: 'Choose the breakdown of this number' },
    a_fraccion: { es: 'Elige la fracción decimal de este número (sin simplificar)', en: 'Choose the decimal fraction of this number (do not simplify)' },
    a_decimal: { es: 'Elige el decimal que es igual a esta fracción', en: 'Choose the decimal that is equal to this fraction' },
    tocar: { es: n => `Toca la marca de ${n} en la recta`, en: n => `Touch the mark of ${n} on the number line` },
    leer: { es: 'Escribe el número que marca el punto', en: 'Write the number the point shows' },
  },

  campos: {
    numero: { es: 'Número', en: 'Number' },
    escribe: { es: 'Escríbelo con coma o con punto', en: 'Write it with a comma or a point' },
  },

  // ─── Feedback con los números del ítem ───────────────────────────────────────────────────
  leelo: {
    se_lee: { es: (n, l) => `${n} se lee «${l}».`, en: (n, l) => `${n} is read “${l}”.` },
    lectura_dice: { es: (n, l) => `«${l}» es ${n}.`, en: (n, l) => `“${l}” is ${n}.` },
    motivo: {
      'decimas-por-centesimas': { es: (n, e) => `Has movido la coma un lugar: ${e} no es ${n}.`, en: (n, e) => `You moved the point one place: ${e} is not ${n}.` },
      'coma-mal-colocada': { es: (n, e) => `La coma no está donde toca: ${e} no es ${n}.`, en: (n, e) => `The point is not where it should be: ${e} is not ${n}.` },
      'lee-sin-coma': { es: (n, e) => `${n} tiene coma; ${e} no la tiene en cuenta.`, en: (n, e) => `${n} has a point; ${e} ignores it.` },
      'cifras-intercambiadas': { es: (n, e) => `Las cifras de ${e} están en otro orden que las de ${n}.`, en: (n, e) => `The digits of ${e} are in a different order from those of ${n}.` },
      'cero-saltado': { es: (n, e) => `${n} tiene un 0 en medio que ${e} no tiene.`, en: (n, e) => `${n} has a zero in the middle that ${e} does not have.` },
    },
  },
  cifra: {
    // `lugar` («las décimas») y `cantidad` («7 décimas», «1 décima») llegan ya compuestos por el idioma.
    vale: {
      es: (n, cifra, lugar, cantidad, valor) => `En ${n}, el ${cifra} está en ${lugar}: son ${cantidad}, es decir, ${valor}.`,
      en: (n, cifra, lugar, cantidad, valor) => `In ${n}, the ${cifra} is in ${lugar}: it is ${cantidad}, that is, ${valor}.`,
    },
    suma: { es: (n, s) => `${n} = ${s}: cada cifra vale según su lugar.`, en: (n, s) => `${n} = ${s}: each digit is worth what its place says.` },
    marcada: { es: 'la cifra marcada', en: 'the marked digit' },
  },
  fraccion: {
    a_fraccion: {
      es: (n, k, fr) => `${n} tiene ${k} ${k === 1 ? 'cifra decimal' : 'cifras decimales'}: el denominador lleva ${k} ${k === 1 ? 'cero' : 'ceros'} (1${'0'.repeat(k)}) y el numerador son todas las cifras sin la coma. ${n} = ${fr}.`,
      en: (n, k, fr) => `${n} has ${k} decimal ${k === 1 ? 'place' : 'places'}: the denominator has ${k} ${k === 1 ? 'zero' : 'zeros'} (1${'0'.repeat(k)}) and the numerator is all the digits without the point. ${n} = ${fr}.`,
    },
    a_decimal: {
      es: (fr, j, n) => `${fr}: el denominador lleva ${j} ${j === 1 ? 'cero' : 'ceros'}, así que el decimal tiene ${j} ${j === 1 ? 'cifra decimal' : 'cifras decimales'}. ${fr} = ${n}.`,
      en: (fr, j, n) => `${fr}: the denominator has ${j} ${j === 1 ? 'zero' : 'zeros'}, so the decimal has ${j} decimal ${j === 1 ? 'place' : 'places'}. ${fr} = ${n}.`,
    },
  },
  recta: {
    huecos: {
      es: (valor, desde, hasta, paso, huecos) => `De ${desde} a ${hasta} hay 10 huecos iguales y cada uno vale ${paso}. ${valor} está a ${huecos} ${huecos === 1 ? 'hueco' : 'huecos'} de ${desde}.`,
      en: (valor, desde, hasta, paso, huecos) => `From ${desde} to ${hasta} there are 10 equal gaps and each one is worth ${paso}. ${valor} is ${huecos} ${huecos === 1 ? 'gap' : 'gaps'} after ${desde}.`,
    },
    tocaste: { es: n => `Has tocado ${n}.`, en: n => `You touched ${n}.` },
    escribiste: { es: n => `Has escrito ${n}.`, en: n => `You wrote ${n}.` },
    cuenta_marcas: { es: 'Has contado marcas en vez de huecos: la marca de salida es el hueco 0.', en: 'You counted marks instead of gaps: the starting mark is gap 0.' },
  },
  no_se_hacerlo: { es: 'No sé hacerlo', en: 'I don’t know how' },
  sin_elegir: { es: 'Toca una marca de la recta', en: 'Touch a mark on the number line' },
};
