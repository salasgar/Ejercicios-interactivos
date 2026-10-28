// Textos propios de «¿Qué se hace primero? Con fracciones», siempre { es, en }. Los comunes
// (Comprobar, Siguiente…) llegan en `api.t`. Producto con «·», nunca «×»; división con «:» (en
// inglés también vale «÷»); el menos es U+2212; las fracciones llevan raya (`html` de
// fracciones.js), nunca «3/5» fuera de una frase en inglés hablado. Las operaciones
// (`1/2 + 1/3`) llegan ya escritas por `fracciones.js`.

import { html as cuentaFrac } from '../_comun/fracciones.js';

// `html` no entiende «=»: una igualdad se pinta como sus miembros unidos por el signo.
const c = texto => texto.split(' = ').map(parte => cuentaFrac(parte)).join(' = ');

// Las operaciones del feedback llegan como texto (`1/2 + 1/3`) o ya pintadas (`<span…`): se pintan con raya.
const h = x => (typeof x === 'string' && !x.startsWith('<') ? c(x) : x);

export const TX = {
  toca: { es: 'Toca la operación que se hace primero.', en: 'Tap the operation that comes first.' },
  toca_paso: { es: 'Toca la operación que va ahora.', en: 'Tap the operation that comes now.' },
  cuanto: {
    es: op => `¿Cuánto vale <span class="cuenta">${h(op)}</span>? Elige la fracción irreducible.`,
    en: op => `What is <span class="cuenta">${h(op)}</span>? Choose the fraction in lowest terms.`,
  },

  // --- Avisos mientras se hace el ejercicio y explicaciones al terminar ---
  va_primero: { es: op => `Va primero <span class="cuenta">${h(op)}</span>`, en: op => `<span class="cuenta">${h(op)}</span> comes first` },
  podian: { es: lista => `Podían ir primero: ${lista}`, en: lista => `These could come first: ${lista}` },
  orden: {
    es: 'Primero lo que hay dentro de un paréntesis, después los productos y cocientes, y al final las sumas y restas.',
    en: 'First what is inside brackets, then products and quotients, and last additions and subtractions.',
  },
  mal_jerarquia: {
    es: op => `Ahí no: antes hay que hacer <span class="cuenta">${h(op)}</span>. Primero lo de dentro de un paréntesis, después los productos y cocientes, y al final las sumas y restas.`,
    en: op => `Not there: first you have to do <span class="cuenta">${h(op)}</span>. First what is inside brackets, then products and quotients, and last additions and subtractions.`,
  },
  mal_izquierda: {
    es: op => `Ahí no: si hay varias operaciones seguidas del mismo nivel, se hace antes la de la izquierda. Aquí va primero <span class="cuenta">${h(op)}</span>.`,
    en: op => `Not there: when there are several operations of the same level in a row, the one on the left comes first. Here <span class="cuenta">${h(op)}</span> comes first.`,
  },
  mal_resultado: {
    es: (op, bueno) => `<span class="cuenta">${h(op)} = ${h(bueno)}</span>.`,
    en: (op, bueno) => `<span class="cuenta">${h(op)} = ${h(bueno)}</span>.`,
  },
  resultado_en: { es: 'Resultado', en: 'Result' },

  // Una frase para cada error con nombre que puede salir como opción falsa o como error del ejercicio 3.
  pista: {
    'suma-arriba-y-abajo': { es: 'Para sumar, no se suman los denominadores: se busca un denominador común y se suman solo los numeradores.', en: 'To add, you do not add the denominators: find a common denominator and add only the numerators.' },
    'resta-arriba-y-abajo': { es: 'Para restar, no se restan los denominadores: se busca un denominador común y se restan solo los numeradores.', en: 'To subtract, you do not subtract the denominators: find a common denominator and subtract only the numerators.' },
    'en-cruz-al-sumar': { es: 'Multiplicar en cruz es para dividir, no para sumar o restar: aquí hay que buscar un denominador común.', en: 'Cross-multiplying is for dividing, not for adding or subtracting: here you need a common denominator.' },
    'suma-solo-cambia-denominador': { es: 'Si cambias el denominador, también hay que cambiar el numerador: es la misma fracción, escrita en partes más pequeñas.', en: 'If you change the denominator, you also have to change the numerator: it is the same fraction, written in smaller parts.' },
    'natural-al-numerador': { es: 'Un número entero no se suma solo al numerador: primero hay que escribirlo como fracción con el mismo denominador.', en: 'A whole number is not added to the numerator only: first write it as a fraction with the same denominator.' },
    'suma-multiplicando-denominadores': { es: 'Para sumar, las dos fracciones tienen que tener el mismo denominador, y ese denominador no se multiplica: se queda.', en: 'To add, both fractions need the same denominator, and that denominator is not multiplied: it stays.' },
    'signo-perdido': { es: 'Mira otra vez el signo del resultado: si lo que se resta es mayor, sale negativo.', en: 'Look at the sign of the result again: if you take away more than you have, it is negative.' },
    'signo-perdido-producto': { es: 'Mira otra vez el signo del resultado: signos iguales dan positivo, signos distintos dan negativo.', en: 'Look at the sign of the result again: equal signs give a positive, different signs give a negative.' },
    'signo-del-primero': { es: 'El signo del resultado no es el del primer número: es el del número con mayor valor absoluto.', en: 'The sign of the result is not the sign of the first number: it is the sign of the number with the greater absolute value.' },
    'producto-denominador-comun': { es: 'Al multiplicar no hay denominador común: se multiplican los numeradores y se multiplican los denominadores.', en: 'When multiplying there is no common denominator: multiply the numerators and multiply the denominators.' },
    'multiplica-en-cruz': { es: 'Multiplicar en cruz es para dividir. En un producto se multiplica arriba con arriba y abajo con abajo.', en: 'Cross-multiplying is for dividing. In a product you multiply top by top and bottom by bottom.' },
    'multiplica-sumando-denominadores': { es: 'En un producto los denominadores se multiplican, no se suman.', en: 'In a product the denominators are multiplied, not added.' },
    'suma-en-vez-de-multiplicar': { es: 'Fíjate en el signo: aquí hay que multiplicar, no sumar.', en: 'Look at the sign: here you have to multiply, not add.' },
    'natural-por-ambos': { es: 'Un número entero multiplica solo al numerador, no al denominador.', en: 'A whole number multiplies only the numerator, not the denominator.' },
    'invierte-la-primera': { es: 'Dividir es multiplicar por la inversa de la segunda fracción, no de la primera.', en: 'Dividing is multiplying by the reciprocal of the second fraction, not of the first one.' },
    'no-invierte': { es: 'Para dividir hay que dar la vuelta a la segunda fracción y multiplicar.', en: 'To divide you turn the second fraction upside down and multiply.' },
    'invierte-las-dos': { es: 'Solo se da la vuelta a la segunda fracción, la que divide; la primera se queda igual.', en: 'You turn only the second fraction upside down, the one you divide by; the first one stays the same.' },
    'confunde-la-operacion': { es: 'Fíjate en qué operación es.', en: 'Look at which operation it is.' },
    'izquierda-a-derecha': { es: 'No se puede ir de izquierda a derecha sin más: manda la jerarquía (y el paréntesis, si lo hay).', en: 'You cannot just go from left to right: the order of operations (and the brackets, if any) decides.' },
    'jerarquia-olvidada': { es: 'No se puede ir de izquierda a derecha sin más: manda la jerarquía (y el paréntesis, si lo hay).', en: 'You cannot just go from left to right: the order of operations (and the brackets, if any) decides.' },
    'derecha-a-izquierda': { es: 'No se va de derecha a izquierda: en las operaciones del mismo nivel se empieza por la izquierda.', en: 'You do not go from right to left: with operations of the same level, you start on the left.' },
  },

  // --- Ejercicio 1 ---
  ej1: {
    nombre: { es: '¿Cuál primero?', en: 'Which one first?' },
    detalle: { es: 'Toca la operación que se hace primero', en: 'Tap the operation that comes first' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El orden es el de siempre: primero lo que hay <strong>dentro de un paréntesis</strong>, después los <strong>productos y cocientes</strong> y al final las <strong>sumas y restas</strong>.</p>
        <p>Por ejemplo, en <strong>${c('5/6 − 1/4 · 2/3')}</strong> va primero el producto ${c('1/4 · 2/3')}; y en <strong>${c('(1/5 + 3/10) : 2/5')}</strong> va primero la suma del paréntesis. Toca el signo de la operación que va primero; si hay varias que pueden ir primero, vale cualquiera.</p>`,
      en: `<h2>How it works</h2>
        <p>The order is the usual one: first what is <strong>inside brackets</strong>, then <strong>products and quotients</strong>, and last <strong>additions and subtractions</strong>.</p>
        <p>For example, in <strong>${c('5/6 − 1/4 · 2/3')}</strong> the product ${c('1/4 · 2/3')} comes first; and in <strong>${c('(1/5 + 3/10) : 2/5')}</strong> the addition inside the brackets comes first. Tap the sign of the operation that comes first; if several can go first, any of them is right.</p>`,
    },
  },
  // --- Ejercicio 2 ---
  ej2: {
    nombre: { es: 'Un paso cada vez', en: 'One step at a time' },
    detalle: { es: 'Resuélvela operación a operación', en: 'Work it out one operation at a time' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca la operación que va ahora y elige cuánto vale (la fracción irreducible). La expresión se reescribe y sigues hasta quedarte con un solo número.</p>
        <p>Por ejemplo: <strong>${c('5/6 − 1/4 · 2/3')}</strong> → primero el producto, ${c('1/4 · 2/3 = 1/6')} → <strong>${c('5/6 − 1/6')}</strong> = <strong>${c('2/3')}</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap the operation that comes now and choose its value (the fraction in lowest terms). The expression is rewritten and you keep going until you have a single number.</p>
        <p>For example: <strong>${c('5/6 − 1/4 · 2/3')}</strong> → first the product, ${c('1/4 · 2/3 = 1/6')} → <strong>${c('5/6 − 1/6')}</strong> = <strong>${c('2/3')}</strong>.</p>`,
    },
  },
  // --- Ejercicio 3 ---
  ej3: {
    nombre: { es: 'Caza el error', en: 'Spot the mistake' },
    detalle: { es: 'Una línea está mal: ¿qué ha pasado?', en: 'One line is wrong: what happened?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Verás una combinada resuelta paso a paso. <strong>Una sola línea está mal</strong>. Tócala y di qué ha pasado: o se ha hecho una operación que <strong>no tocaba todavía</strong> (el orden), o la operación era la que tocaba pero el <strong>cálculo</strong> está mal hecho.</p>
        <p>Por ejemplo: <strong>${c('5/6 − 1/4 · 2/3')} = ${c('7/12 · 2/3')}</strong> está mal por el orden: se ha restado antes de multiplicar. Y <strong>${c('1/4 · 2/3 = 3/7')}</strong> está mal por el cálculo.</p>`,
      en: `<h2>How it works</h2>
        <p>You will see a calculation worked out step by step. <strong>Only one line is wrong</strong>. Tap it and say what happened: either an operation was done that <strong>was not its turn yet</strong> (the order), or it was the right operation but the <strong>calculation</strong> is wrong.</p>
        <p>For example: <strong>${c('5/6 − 1/4 · 2/3')} = ${c('7/12 · 2/3')}</strong> is wrong because of the order: the subtraction was done before the multiplication. And <strong>${c('1/4 · 2/3 = 3/7')}</strong> is wrong because of the calculation.</p>`,
    },
    pregunta: { es: 'Toca la línea que está mal.', en: 'Tap the line that is wrong.' },
    que_ha_pasado: { es: '¿Qué ha pasado en esa línea?', en: 'What happened on that line?' },
    es_orden: { es: 'Se ha hecho una operación que no tocaba todavía', en: 'An operation was done that was not its turn yet' },
    es_calculo: { es: 'La operación era la que tocaba, pero el cálculo está mal', en: 'It was the right operation, but the calculation is wrong' },
    linea_n: { es: n => `Línea ${n}`, en: n => `Line ${n}` },
    mal_linea: {
      es: (n, canonica) => `La línea mal era la ${n}. Aquí tocaba hacer <span class="cuenta">${h(canonica)}</span>.`,
      en: (n, canonica) => `The wrong line was line ${n}. Here you had to do <span class="cuenta">${h(canonica)}</span>.`,
    },
    bien_linea: {
      es: n => `Sí: la línea ${n} es la que está mal.`,
      en: n => `Yes: line ${n} is the wrong one.`,
    },
    era_orden: {
      es: (op, canonica) => `Se ha hecho <span class="cuenta">${h(op)}</span> antes de tiempo; tocaba <span class="cuenta">${h(canonica)}</span>.`,
      en: (op, canonica) => `<span class="cuenta">${h(op)}</span> was done too early; <span class="cuenta">${h(canonica)}</span> was the one to do.`,
    },
    era_calculo: {
      es: (op, bueno) => `La operación era buena, pero el cálculo no: <span class="cuenta">${h(op)} = ${h(bueno)}</span>.`,
      en: (op, bueno) => `It was the right operation, but the calculation is wrong: <span class="cuenta">${h(op)} = ${h(bueno)}</span>.`,
    },
  },
};

/** La pista de un error; para `signo-perdido` en un producto o un cociente es la regla de los signos. */
export const pistaDe = (error, operacion = '') => (error === 'signo-perdido' && /\s[·:]\s/.test(String(operacion).replace(/<[^>]*>/g, ''))
  ? TX.pista['signo-perdido-producto'] : TX.pista[error]);
