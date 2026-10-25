// Textos de «Dos signos seguidos» (unidad 3, tarea 84), siempre { es, en }. Los comunes
// (Comprobar, Siguiente…) llegan en `api.t`. Los feedback son funciones PURAS de (item, ctx)
// con `ctx.tt` (elige el idioma): así se prueban sin navegador y la base los puede dar
// también en el otro idioma. Todos los números son los del ítem.

import { MENOS, fmt } from '../_comun/enteros.js';
import { ver, textoSinParentesis } from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;
const iguales = (s, t) => s === t;

export const TX = {
  nombres: {
    unsigno: { es: 'Un solo signo', en: 'Just one sign' },
    negativo: { es: 'Sumar o restar un negativo', en: 'Adding or subtracting a negative' },
    quita: { es: 'Quita los paréntesis y calcula', en: 'Remove the brackets and work it out' },
    bien: { es: '¿Cuál está bien escrita?', en: 'Which one is written correctly?' },
  },
  detalles: {
    unsigno: { es: 'Dos signos seguidos se convierten en uno', en: 'Two signs in a row become one' },
    negativo: { es: 'Sumar un negativo es restar; restar un negativo es sumar', en: 'Adding a negative is subtracting; subtracting a negative is adding' },
    quita: { es: 'Reescribe la cuenta sin paréntesis y calcúlala', en: 'Rewrite the sum without brackets and work it out' },
    bien: { es: 'Los dos signos no van seguidos sin paréntesis', en: 'Two signs never go together without brackets' },
  },
  introduccion: {
    unsigno: {
      es: `<h2>Cómo se hace</h2>
        <p>Cuando hay dos signos seguidos, se convierten en uno solo. Por ejemplo: <strong>7 − (−4) = 7 + 4 = 11</strong>.</p>
        <p>Signos <strong>iguales</strong> dan <strong>+</strong>. Signos <strong>distintos</strong> dan <strong>${MENOS}</strong>.</p>
        <p>Primero eliges el signo que queda y después escribes el resultado.</p>`,
      en: `<h2>How it works</h2>
        <p>When two signs come one after the other, they become one sign. For example: <strong>7 − (−4) = 7 + 4 = 11</strong>.</p>
        <p><strong>Same</strong> signs give <strong>+</strong>. <strong>Different</strong> signs give <strong>${MENOS}</strong>.</p>
        <p>First you choose the sign that is left, then you write the result.</p>`,
    },
    negativo: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Sumar</strong> un número negativo es <strong>restar</strong>: 9 + (−6) = 9 − 6 = 3.</p>
        <p><strong>Restar</strong> un número negativo es <strong>sumar</strong>: 9 − (−6) = 9 + 6 = 15.</p>
        <p>Primero eliges en qué se convierte la cuenta y después la calculas.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Adding</strong> a negative number is <strong>subtracting</strong>: 9 + (−6) = 9 − 6 = 3.</p>
        <p><strong>Subtracting</strong> a negative number is <strong>adding</strong>: 9 − (−6) = 9 + 6 = 15.</p>
        <p>First you choose what the sum becomes, then you work it out.</p>`,
    },
    quita: {
      es: `<h2>Cómo se hace</h2>
        <p>Quita los paréntesis de cada número y calcula. Por ejemplo:</p>
        <p><strong>(−5) + (+2) − (−7) = −5 + 2 + 7 = 4</strong></p>
        <p>Con los botones eliges el signo que queda delante de cada número. Después escribes el resultado.</p>`,
      en: `<h2>How it works</h2>
        <p>Remove the brackets around each number and work it out. For example:</p>
        <p><strong>(−5) + (+2) − (−7) = −5 + 2 + 7 = 4</strong></p>
        <p>Use the buttons to choose the sign in front of each number. Then write the result.</p>`,
    },
    bien: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos signos <strong>nunca</strong> van seguidos sin paréntesis. El segundo signo va con su número, entre paréntesis.</p>
        <p>Está bien escrito: <strong>8 + (−5)</strong>. No está bien escrito: 8 + −5.</p>
        <p>Aquí no se calcula nada: solo se elige la cuenta bien escrita.</p>`,
      en: `<h2>How it works</h2>
        <p>Two signs <strong>never</strong> go together without brackets. The second sign goes with its number, inside brackets.</p>
        <p>Written correctly: <strong>8 + (−5)</strong>. Not written correctly: 8 + −5.</p>
        <p>You do not work anything out here: you just choose the sum that is written correctly.</p>`,
    },
  },
  enunciado: {
    unsigno: { es: 'Quita el paréntesis: ¿qué signo queda?', en: 'Remove the brackets: which sign is left?' },
    unsigno2: { es: 'Ahora escribe el resultado.', en: 'Now write the result.' },
    negativo: { es: '¿En qué se convierte esta cuenta?', en: 'What does this sum become?' },
    negativo2: { es: 'Ahora calcúlala.', en: 'Now work it out.' },
    quita: { es: 'Elige el signo de cada número al quitar el paréntesis.', en: 'Choose the sign of each number when you remove the brackets.' },
    quita2: { es: 'Ahora calcula la cuenta sin paréntesis.', en: 'Now work out the sum without brackets.' },
    bien: { es: '¿Cuál de estas cuentas está bien escrita?', en: 'Which of these sums is written correctly?' },
  },
  resultado: { es: 'Resultado', en: 'Result' },
  signo_de: { es: 'Signo del número', en: 'Sign of the number' },
  comprobar_signos: { es: 'Comprobar los signos', en: 'Check the signs' },
};

// ─── Feedback ──────────────────────────────────────────────────────────────────

const mismosOdistintos = (tt, s, t) => (iguales(s, t)
  ? tt({ es: `los signos son iguales (${ver(s)} y ${ver(t)})`, en: `the signs are the same (${ver(s)} and ${ver(t)})` })
  : tt({ es: `los signos son distintos (${ver(s)} y ${ver(t)})`, en: `the signs are different (${ver(s)} and ${ver(t)})` }));

const queda = (tt, signo) => tt({ es: `se queda ${ver(signo)}`, en: `${ver(signo)} is left` });

/** Ejercicio 1, signo mal elegido. */
export function feedbackSigno(item, ctx) {
  return feedbackUnSigno(item, ctx, false);
}

/** Ejercicio 1, signo bien y resultado mal (o todo bien). */
export function feedbackUnSigno(item, { tt }, acierto) {
  const cab = `${mismosOdistintos(tt, item.op, item.interno)}: ${queda(tt, item.signo)}.`;
  const cuentaBuena = cuenta(item.solo ? `${item.texto} = ${fmt(item.valor)}` : `${item.texto} = ${item.reescrita} = ${fmt(item.valor)}`);
  return acierto ? `${cuentaBuena}.` : `${cab} ${tt({ es: 'El resultado es', en: 'The result is' })} ${cuentaBuena}.`;
}

/** Ejercicio 2, la reescritura mal elegida. */
export function feedbackNegativo(item, { tt }) {
  const regla = item.op === '+'
    ? tt({ es: `Sumar ${MENOS}${item.b} es restar ${item.b}`, en: `Adding ${MENOS}${item.b} is subtracting ${item.b}` })
    : tt({ es: `Restar ${MENOS}${item.b} es sumar ${item.b}`, en: `Subtracting ${MENOS}${item.b} is adding ${item.b}` });
  return `${regla}: ${cuenta(`${item.texto} = ${item.reescrita} = ${fmt(item.valor)}`)}.`;
}

/** Ejercicio 2, reescritura bien y resultado mal (o todo bien). */
export function feedbackValorNegativo(item, { tt }, acierto) {
  const buena = cuenta(`${item.texto} = ${item.reescrita} = ${fmt(item.valor)}`);
  return acierto ? `${buena}.` : `${tt({ es: 'Está bien la reescritura; la cuenta es', en: 'The rewriting is right; the sum is' })} ${buena}.`;
}

/** Ejercicio 3, signos mal elegidos: se señala el primer término mal reescrito. */
export function feedbackQuita(item, { tt }, signosAlumno, indice) {
  const buena = cuenta(`${item.texto} = ${textoSinParentesis(item.terminos.map(t => t.signo), item.terminos)} = ${fmt(item.valor)}`);
  const t = item.terminos[indice];
  const trozo = indice === 0
    ? `(${ver(t.interno)}${t.mag})`
    : `${ver(t.op)} (${ver(t.interno)}${t.mag})`;
  const queda_ = indice === 0 ? `${t.signo === '-' ? MENOS : ''}${t.mag}` : `${ver(t.signo)} ${t.mag}`;
  const razon = indice === 0
    ? tt({ es: `un solo signo: ${ver(t.interno)}`, en: `just one sign: ${ver(t.interno)}` })
    : mismosOdistintos(tt, t.op, t.interno);
  return `${tt({ es: 'Mira', en: 'Look at' })} ${cuenta(`${trozo} → ${queda_}`)} (${razon}). ${tt({ es: 'La cuenta buena', en: 'The right sum' })}: ${buena}.`;
}

/** Ejercicio 3, signos bien y resultado mal (o todo bien). */
export function feedbackValorQuita(item, { tt }, acierto) {
  const buena = cuenta(`${item.texto} = ${textoSinParentesis(item.terminos.map(t => t.signo), item.terminos)} = ${fmt(item.valor)}`);
  return acierto ? `${buena}.` : `${tt({ es: 'Están bien los signos; la cuenta es', en: 'The signs are right; the sum is' })} ${buena}.`;
}

/** Ejercicio 4. */
export function feedbackBien(item, { tt }, elegida) {
  const buena = cuenta(item.buena);
  if (!elegida || elegida === item.buena) {
    return tt({ es: `${buena}: el signo del número va con su número, entre paréntesis.`, en: `${buena}: the sign of the number goes with its number, inside brackets.` });
  }
  return tt({
    es: `${cuenta(elegida)} tiene dos signos seguidos, sin paréntesis. Bien escrita: ${buena}.`,
    en: `${cuenta(elegida)} has two signs in a row, without brackets. Written correctly: ${buena}.`,
  });
}
