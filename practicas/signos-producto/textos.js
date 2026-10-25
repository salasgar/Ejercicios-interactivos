// Textos de «La regla de los signos» (unidad 3, tarea 85), siempre { es, en }. Los feedback son
// funciones PURAS de (item, ctx) con `ctx.tt`: se prueban sin navegador y la base los puede dar
// también en el otro idioma. Todos los números son los del ítem.

import { MENOS, fmt, fmtPar } from '../_comun/enteros.js';
import { ver } from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;

export const TX = {
  nombres: {
    multiplica: { es: 'Multiplica', en: 'Multiply' },
    divide: { es: 'Divide', en: 'Divide' },
    falta: { es: 'El factor que falta', en: 'The missing factor' },
    mezcla: { es: '¿Suma o producto?', en: 'Sum or product?' },
    bien: { es: '¿Cuál está bien escrito?', en: 'Which one is written correctly?' },
  },
  detalles: {
    multiplica: { es: 'Elige el signo del producto y calcula', en: 'Choose the sign of the product and work it out' },
    divide: { es: 'Divide con la regla de los signos', en: 'Divide using the rule of signs' },
    falta: { es: 'Halla el número que falta en el producto', en: 'Find the missing number in the product' },
    mezcla: { es: 'No apliques la regla del producto a una suma', en: 'Do not use the product rule on a sum' },
    bien: { es: 'El negativo que no va el primero, entre paréntesis', en: 'A negative number that is not first goes in brackets' },
  },
  introduccion: {
    multiplica: {
      es: `<h2>Cómo se hace</h2>
        <p>Mira este patrón: cada vez que el primer factor baja una unidad, el resultado sube 2.</p>
        <p><strong>3 · (−2) = −6</strong><br><strong>2 · (−2) = −4</strong><br><strong>1 · (−2) = −2</strong><br><strong>0 · (−2) = 0</strong><br><strong>(−1) · (−2) = 2</strong></p>
        <p>Por eso: signos <strong>iguales</strong> dan <strong>+</strong>; signos <strong>distintos</strong> dan <strong>${MENOS}</strong>.</p>
        <p>Primero eliges el signo del resultado y después escribes el valor.</p>`,
      en: `<h2>How it works</h2>
        <p>Look at this pattern: each time the first factor goes down by one, the result goes up by 2.</p>
        <p><strong>3 · (−2) = −6</strong><br><strong>2 · (−2) = −4</strong><br><strong>1 · (−2) = −2</strong><br><strong>0 · (−2) = 0</strong><br><strong>(−1) · (−2) = 2</strong></p>
        <p>So: <strong>same</strong> signs give <strong>+</strong>; <strong>different</strong> signs give <strong>${MENOS}</strong>.</p>
        <p>First you choose the sign of the result, then you write the value.</p>`,
    },
    divide: {
      es: `<h2>Cómo se hace</h2>
        <p>La regla de los signos es la misma que en el producto: <strong>(−36) : (−9) = 4</strong> y <strong>(−12) : 4 = −3</strong>.</p>
        <p>El 0 entre un número es 0: <strong>0 : (−5) = 0</strong>. Pero <strong>no se puede dividir entre 0</strong>: si ves un 0 como divisor, pulsa «No se puede».</p>`,
      en: `<h2>How it works</h2>
        <p>The rule of signs is the same as in multiplication: <strong>(−36) : (−9) = 4</strong> and <strong>(−12) : 4 = −3</strong>.</p>
        <p>0 divided by a number is 0: <strong>0 : (−5) = 0</strong>. But <strong>you cannot divide by 0</strong>: if the divisor is 0, press “Not possible”.</p>`,
    },
    falta: {
      es: `<h2>Cómo se hace</h2>
        <p>Busca el número que falta: <strong>□ · (−4) = 20</strong>. Piensa: ¿qué número por (−4) da 20? La respuesta es <strong>−5</strong>, porque (−5) · (−4) = 20.</p>
        <p>Primero piensa en el signo y después en el número.</p>`,
      en: `<h2>How it works</h2>
        <p>Find the missing number: <strong>□ · (−4) = 20</strong>. Think: which number times (−4) gives 20? The answer is <strong>−5</strong>, because (−5) · (−4) = 20.</p>
        <p>First think about the sign, then about the number.</p>`,
    },
    mezcla: {
      es: `<h2>Cómo se hace</h2>
        <p>La regla de los signos es solo para el <strong>producto</strong>. En una suma o una resta no vale:</p>
        <p>(−3) · (−5) = 15, pero −3 − 5 = −8.<br>(−3) · 5 = −15, pero −3 + 5 = 2.</p>
        <p>Primero decide qué es la cuenta y después calcula.</p>`,
      en: `<h2>How it works</h2>
        <p>The rule of signs is only for the <strong>product</strong>. It does not work in an addition or a subtraction:</p>
        <p>(−3) · (−5) = 15, but −3 − 5 = −8.<br>(−3) · 5 = −15, but −3 + 5 = 2.</p>
        <p>First decide what the calculation is, then work it out.</p>`,
    },
    bien: {
      es: `<h2>Cómo se hace</h2>
        <p>En un producto, el número negativo que no va el primero lleva paréntesis.</p>
        <p>Está bien escrito: <strong>6 · (−3)</strong>. No está bien escrito: 6 · −3.</p>
        <p>Aquí no se calcula nada: solo se elige la cuenta bien escrita.</p>`,
      en: `<h2>How it works</h2>
        <p>In a product, a negative number that is not first goes in brackets.</p>
        <p>Written correctly: <strong>6 · (−3)</strong>. Not written correctly: 6 · −3.</p>
        <p>You do not work anything out here: you just choose the product that is written correctly.</p>`,
    },
  },
  enunciado: {
    multiplica: { es: '¿Qué signo tiene el producto?', en: 'What is the sign of the product?' },
    multiplica2: { es: 'Ahora escribe el producto.', en: 'Now write the product.' },
    divide: { es: 'Divide. Si no se puede, pulsa el botón.', en: 'Divide. If it is not possible, press the button.' },
    falta: { es: 'Escribe el número que falta (□).', en: 'Write the missing number (□).' },
    mezcla: { es: '¿Qué es esta cuenta?', en: 'What is this calculation?' },
    mezcla2: { es: 'Ahora calcula.', en: 'Now work it out.' },
    bien: { es: '¿Cuál de estos productos está bien escrito?', en: 'Which of these products is written correctly?' },
  },
  resultado: { es: 'Resultado', en: 'Result' },
  no_se_puede: { es: 'No se puede', en: 'Not possible' },
  es_producto: { es: 'Es un producto', en: 'It is a product' },
  es_suma: { es: 'Es una suma o una resta', en: 'It is an addition or a subtraction' },
};

const mismos = (tt, a, b) => {
  const sa = a < 0 ? MENOS : '+', sb = b < 0 ? MENOS : '+';
  return a < 0 === b < 0
    ? tt({ es: `Los signos son iguales (${sa} y ${sb}), así que el signo es +`, en: `The signs are the same (${sa} and ${sb}), so the sign is +` })
    : tt({ es: `Los signos son distintos (${sa} y ${sb}), así que el signo es ${MENOS}`, en: `The signs are different (${sa} and ${sb}), so the sign is ${MENOS}` });
};

/** Ejercicio 1, signo mal elegido, y también valor mal (o todo bien). */
export function feedbackMultiplica(item, { tt }, acierto) {
  const buena = cuenta(`${item.texto} = ${fmt(item.valor)}`);
  if (acierto) return `${buena}.`;
  return `${mismos(tt, item.a, item.b)}: ${buena}.`;
}

/** Ejercicio 2. */
export function feedbackDivide(item, { tt }, acierto) {
  if (item.especial === 'entre-cero') {
    return tt({ es: `${cuenta(item.texto)}: no se puede dividir entre 0.`, en: `${cuenta(item.texto)}: you cannot divide by 0.` });
  }
  if (item.especial === 'cero-entre') {
    return tt({ es: `${cuenta(`${item.texto} = 0`)}: 0 entre cualquier número distinto de 0 es 0.`, en: `${cuenta(`${item.texto} = 0`)}: 0 divided by any number other than 0 is 0.` });
  }
  const buena = cuenta(`${item.texto} = ${fmt(item.valor)}`);
  return acierto ? `${buena}.` : `${mismos(tt, item.a, item.b)}: ${buena}.`;
}

/** Ejercicio 3: la comprobación con el número que falta. */
export function feedbackFalta(item, { tt }, acierto) {
  const lleno = item.hueco === 'izq' ? `${fmtPar(item.valor)} · ${fmtPar(item.k)}` : `${fmtPar(item.k)} · ${fmtPar(item.valor)}`;
  const buena = cuenta(`${lleno} = ${fmt(item.p)}`);
  return acierto
    ? `${buena}.`
    : `${tt({ es: 'Prueba con', en: 'Try with' })} ${fmt(item.valor)}: ${buena}.`;
}

/** Ejercicio 4, mal decidido: se dice qué es y se da la cuenta. */
export function feedbackClase(item, { tt }) {
  const buena = cuenta(`${item.texto} = ${fmt(item.valor)}`);
  return item.producto
    ? tt({ es: `Es un producto (hay un punto ·): se usa la regla de los signos. ${buena}.`, en: `It is a product (there is a dot ·): use the rule of signs. ${buena}.` })
    : tt({ es: `Es ${item.clase === 'suma' ? 'una suma' : 'una resta'}: aquí no vale la regla de los signos del producto. ${buena}.`, en: `It is ${item.clase === 'suma' ? 'an addition' : 'a subtraction'}: the product rule of signs does not work here. ${buena}.` });
}

/** Ejercicio 4, bien decidido: valor. */
export function feedbackValorSumaProducto(item, ctx, acierto) {
  const buena = cuenta(`${item.texto} = ${fmt(item.valor)}`);
  if (acierto) return `${buena}.`;
  return ctx.tt({ es: `Está bien lo que has decidido; la cuenta es`, en: 'You decided right; the result is' }) + ` ${buena}.`;
}

/** Ejercicio 5. */
export function feedbackBien(item, { tt }, elegida) {
  const buena = cuenta(item.buena);
  if (!elegida || elegida === item.buena) {
    return tt({ es: `${buena}: el negativo que no va el primero lleva paréntesis.`, en: `${buena}: a negative number that is not first goes in brackets.` });
  }
  return tt({
    es: `${cuenta(elegida)} tiene dos signos seguidos, sin paréntesis. Bien escrito: ${buena}.`,
    en: `${cuenta(elegida)} has two signs in a row, without brackets. Written correctly: ${buena}.`,
  });
}

export { ver };
