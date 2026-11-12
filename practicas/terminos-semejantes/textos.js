// Práctica «Términos semejantes» (unidad 6): textos propios, siempre { es, en }.

import { leerExpresion } from '../_comun/algebra.js';

export const TX = {
  ejercicios: [
    {
      nombre: { es: '¿Semejantes?', en: 'Like terms?' },
      detalle: { es: 'Reconocer si dos términos son semejantes', en: 'Tell whether two terms are like terms' },
      introduccion: {
        es: `<h3>¿Semejantes?</h3>
          <p>Un <strong>término</strong> es una parte de una expresión: <span class="cuenta">3<i>x</i></span>, <span class="cuenta">−5<i>x</i></span> o <span class="cuenta">7</span>.</p>
          <p>Dos términos son <strong>semejantes</strong> si tienen la misma <strong>parte literal</strong> (la misma letra). Lo que puede cambiar es el número.</p>
          <p><span class="cuenta">3<i>x</i></span> y <span class="cuenta">−5<i>x</i></span> son semejantes: los dos llevan <i>x</i>. <span class="cuenta">3<i>x</i></span> y <span class="cuenta">3</span> no lo son: uno lleva letra y el otro no.</p>
          <p>Los números sin letra son semejantes entre sí.</p>`,
        en: `<h3>Like terms?</h3>
          <p>A <strong>term</strong> is a part of an expression: <span class="cuenta">3<i>x</i></span>, <span class="cuenta">−5<i>x</i></span> or <span class="cuenta">7</span>.</p>
          <p>Two terms are <strong>like terms</strong> if they have the same <strong>variable part</strong> (the same letter). Only the number can change.</p>
          <p><span class="cuenta">3<i>x</i></span> and <span class="cuenta">−5<i>x</i></span> are like terms: both have <i>x</i>. <span class="cuenta">3<i>x</i></span> and <span class="cuenta">3</span> are not: one has a letter and the other does not.</p>
          <p>Numbers with no letter are like terms with each other.</p>`,
      },
    },
    {
      nombre: { es: 'Coeficiente y parte literal', en: 'Coefficient and variable part' },
      detalle: { es: 'Qué es el número y qué es la letra de un término', en: 'Which is the number and which is the letter in a term' },
      introduccion: {
        es: `<h3>Coeficiente y parte literal</h3>
          <p>En <span class="cuenta">−4<i>x</i></span>, el <strong>coeficiente</strong> es el número, con su signo: <strong>−4</strong>. La <strong>parte literal</strong> es la letra: <i>x</i>.</p>
          <p>Si no se ve ningún número, el coeficiente es 1: <span class="cuenta"><i>x</i></span> es 1<i>x</i>, y <span class="cuenta">−<i>x</i></span> es −1<i>x</i>.</p>`,
        en: `<h3>Coefficient and variable part</h3>
          <p>In <span class="cuenta">−4<i>x</i></span>, the <strong>coefficient</strong> is the number, with its sign: <strong>−4</strong>. The <strong>variable part</strong> is the letter: <i>x</i>.</p>
          <p>If you cannot see a number, the coefficient is 1: <span class="cuenta"><i>x</i></span> is 1<i>x</i>, and <span class="cuenta">−<i>x</i></span> is −1<i>x</i>.</p>`,
      },
    },
    {
      nombre: { es: 'Reduce', en: 'Simplify' },
      detalle: { es: 'Juntar los términos semejantes', en: 'Put the like terms together' },
      introduccion: {
        es: `<h3>Reduce</h3>
          <p>Para <strong>reducir</strong> una expresión se juntan los términos semejantes: se suman sus coeficientes y la parte literal se queda igual.</p>
          <p><span class="cuenta">5<i>x</i> + 2 − 3<i>x</i> + 4</span>: con la <i>x</i>, 5 − 3 = 2; con los números, 2 + 4 = 6. Queda <span class="cuenta">2<i>x</i> + 6</span>.</p>
          <p>Escribe el resultado. Para menos, teclea «-». Vale cualquier orden, pero tiene que quedar reducida.</p>`,
        en: `<h3>Simplify</h3>
          <p>To <strong>simplify</strong> an expression you put the like terms together: add their coefficients and keep the variable part.</p>
          <p><span class="cuenta">5<i>x</i> + 2 − 3<i>x</i> + 4</span>: with <i>x</i>, 5 − 3 = 2; with the numbers, 2 + 4 = 6. You get <span class="cuenta">2<i>x</i> + 6</span>.</p>
          <p>Write the result. For minus, type “-”. Any order is fine, but it has to be fully simplified.</p>`,
      },
    },
    {
      nombre: { es: 'Caza el error', en: 'Spot the mistake' },
      detalle: { es: 'Decir si una reducción está bien o qué error tiene', en: 'Say whether a simplification is right, or what mistake it has' },
      introduccion: {
        es: `<h3>Caza el error</h3>
          <p>Verás una expresión reducida. Puede estar bien o tener un error.</p>
          <p>Por ejemplo, <span class="cuenta">3<i>x</i> + 2 = 5<i>x</i></span> está mal: se ha sumado un término con <i>x</i> y un número, que no son semejantes.</p>
          <p>Elige «No hay error» si está bien, o el error que ves.</p>`,
        en: `<h3>Spot the mistake</h3>
          <p>You will see a simplified expression. It may be right or have a mistake.</p>
          <p>For example, <span class="cuenta">3<i>x</i> + 2 = 5<i>x</i></span> is wrong: a term with <i>x</i> and a number were added, and they are not like terms.</p>
          <p>Choose “No mistake” if it is right, or the mistake you see.</p>`,
      },
    },
  ],
  instrucciones: {
    semejantes: { es: '¿Son semejantes estos dos términos?', en: 'Are these two terms like terms?' },
    coeficiente: { es: '¿Cuál es el coeficiente de este término?', en: 'What is the coefficient of this term?' },
    literal: { es: '¿Cuál es la parte literal de este término?', en: 'What is the variable part of this term?' },
    reduce: { es: 'Reduce la expresión.', en: 'Simplify the expression.' },
    errores: { es: 'Esta reducción, ¿está bien o tiene un error?', en: 'Is this simplification right, or does it have a mistake?' },
  },
  semejantes: {
    si: { es: 'Sí, son semejantes', en: 'Yes, like terms' },
    no: { es: 'No son semejantes', en: 'Not like terms' },
  },
  reduce: {
    campo: { es: 'Tu expresión', en: 'Your expression' },
    placeholder: '5x + 2y',
  },
  errores: {
    ninguno: { es: 'No hay error', en: 'No mistake' },
    'suma-no-semejantes': { es: 'Ha sumado términos que no son semejantes', en: 'Added terms that are not like terms' },
    'perder-signo': { es: 'Ha perdido un signo', en: 'Lost a sign' },
    'x-sin-coeficiente': { es: 'Ha contado como 0 una letra sin número', en: 'Counted a letter with no number as 0' },
    haError: { es: 'Sí tiene un error.', en: 'It does have a mistake.' },
    otroError: { es: 'Ese no es el error.', en: 'That is not the mistake.' },
    noHayError: { es: 'No hay ningún error.', en: 'There is no mistake.' },
  },
};

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const LA_RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const cuentaH = h => `<span class="cuenta">${h}</span>`;

const REGLAS = {
  semejantes: {
    es: 'Dos términos son semejantes si tienen la misma parte literal (la misma letra), o si los dos son números sin letra. El número no importa.',
    en: 'Two terms are like terms if they have the same variable part (the same letter), or if both are numbers with no letter. The number does not matter.',
  },
  coeficiente: {
    es: 'El coeficiente es el número que acompaña a la letra, con su signo; si no se ve ninguno, es 1 (o −1 si lleva un menos).',
    en: 'The coefficient is the number next to the letter, with its sign; if you cannot see one, it is 1 (or −1 if there is a minus).',
  },
  literal: {
    es: 'La parte literal es la letra del término, sin el número.',
    en: 'The variable part is the letter of the term, without the number.',
  },
  reduce: {
    es: 'Junta los términos semejantes: suma sus coeficientes y deja la parte literal igual.',
    en: 'Put the like terms together: add their coefficients and keep the variable part.',
  },
  errores: {
    es: 'Calcula tú la reducción, término a término, y compárala con la que te dan.',
    en: 'Work out the simplification yourself, term by term, and compare it with the one you are given.',
  },
};

/** «No lo sé» del ejercicio 1: la regla, el porqué de este par y el sí o el no al final. */
export function explicaSemejantes(item, { tt }) {
  return `${tt(REGLAS.semejantes)} ${tt(item.solucion)} ${tt(LA_RESPUESTA)} ${cuentaH(tt(TX.semejantes[item.correcta]))}.`;
}

/** «No lo sé» del ejercicio 2: coeficiente o parte literal, según lo que pida el ítem. */
export function explicaCoeficiente(item, { tt }) {
  const buena = item.opciones.find(o => o.correcta);
  return `${tt(REGLAS[item.pregunta])} ${tt(item.solucion)} ${tt(LA_RESPUESTA)} ${buena.html}.`;
}

/** «No lo sé» del ejercicio 3: el paso a paso de reducir y el resultado al final. */
export function explicaReduce(item, { tt }) {
  const resultado = leerExpresion(item.correcta, { variasLetras: true }).valor;
  return `${tt(REGLAS.reduce)} ${tt(item.solucion)} ${tt(LA_RESPUESTA)} ${cuentaH(resultado.aHtml())}.`;
}

/** «No lo sé» del ejercicio 4: dónde está el error (o que no lo hay) y la reducción bien hecha. */
export function explicaErrores(item, { idioma, tt }) {
  const opcion = tt(TX.errores[item.correcta]);
  return `${tt(REGLAS.errores)} ${tt(item.solucion)} ${tt(LA_RESPUESTA)} ${idioma === 'es' ? `«${opcion}»` : `“${opcion}”`}.`;
}
