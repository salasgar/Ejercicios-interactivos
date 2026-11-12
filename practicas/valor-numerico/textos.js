// Práctica «Valor numérico»: textos propios, siempre { es, en }. Los comunes (Comprobar, Siguiente…)
// llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 6): sin «×» (el producto es «·»), sin
// «1x», sin «+ −» (un negativo detrás de una operación va entre paréntesis), sin x²; la coma en español
// y el punto en inglés; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM.

import { Fraccion } from '../_comun/fracciones.js';
import { F, numTexto, sustituido, htmlDe, valorDe } from './logica.js';

const MENOS = '−';
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = t => `<span class="cuenta">${t}</span>`;
const cl = t => `<span class="cuenta-frac">${t}</span>`;
const x_ = '<i>x</i>';

const fr = p => (p instanceof Fraccion ? p : F(p));
const pm = (op, n) => `${op === '+' ? '+' : MENOS} ${n}`;

/** La cuenta paso a paso: «3 · 4 + 2 = 12 + 2 = 14» (texto con HTML mínimo, sin envolver). */
export function cuenta(e, v, idioma) {
  const x = fr(v), sx = sustituido(x, idioma), nx = numTexto(x, idioma);
  const R = numTexto(valorDe(e, x), idioma);
  if (e.forma === 'parentesis') {
    const dentro = x.sumar(e.c);
    return `${e.k} · (${nx} ${pm(e.c < 0 ? '-' : '+', Math.abs(e.c))}) = ${e.k} · ${sustituido(dentro, idioma)} = ${R}`;
  }
  const a = Math.abs(e.a), prod = x.multiplicar(a).simplificar(), P = numTexto(prod, idioma), SP = sustituido(prod, idioma);
  if (e.a < 0) return `${e.b} ${MENOS} ${a} · ${sx} = ${e.b} ${MENOS} ${SP} = ${R}`;
  if (e.b < 0) return `${a} · ${sx} ${MENOS} ${-e.b} = ${P} ${MENOS} ${-e.b} = ${R}`;
  if (e.delante) return `${e.b} + ${a} · ${sx} = ${e.b} + ${SP} = ${R}`;
  return `${a} · ${sx} + ${e.b} = ${P} + ${e.b} = ${R}`;
}

/** «x = 4», con la x en cursiva. */
export const xIgual = (v, idioma) => `${x_} = ${numTexto(v, idioma)}`;

const exprYValor = (item, idioma) => `${htmlDe(item.e)} con ${xIgual(item.v, idioma)}`;

/** Una frase que dice qué hizo quien se equivocó (sin el número, que lo pone quien la usa). */
const hizo = {
  'yuxtaponer-al-sustituir': bi((i, e, v) => {
    const a = e.a, x = numTexto(v, i);
    return i === 'es' ? `escribir el ${x} pegado al ${a} (${a}${x}) en vez de multiplicar: ${a} · ${x}. `
      : `writing ${x} next to ${a} (${a}${x}) instead of multiplying: ${a} · ${x}. `;
  }),
  'signo-al-sustituir': bi((i, e, v) => {
    const f = fr(v);
    return i === 'es' ? `sustituir x por ${numTexto(f.opuesta(), i)} en vez de por ${numTexto(f, i)}. Un número negativo se sustituye entero y entre paréntesis: ${sustituido(f, i)}. `
      : `substituting x by ${numTexto(f.opuesta(), i)} instead of ${numTexto(f, i)}. A negative number is substituted whole, in brackets: ${sustituido(f, i)}. `;
  }),
  'jerarquia-al-sustituir': bi(i => (i === 'es'
    ? 'operar de izquierda a derecha. Primero se multiplica; después se suma o se resta. '
    : 'working from left to right. First multiply; then add or subtract. ')),
  'suma-en-vez-de-multiplicar': bi((i, e) => {
    const n = e.forma === 'parentesis' ? e.k : Math.abs(e.a);
    const q = e.forma === 'parentesis' ? '(…)' : 'x';
    return i === 'es' ? `sumar donde había una multiplicación: ${n}${q} significa ${n} · ${q}, no ${n} + ${q}. `
      : `adding where there is a multiplication: ${n}${q} means ${n} · ${q}, not ${n} + ${q}. `;
  }),
  'resta-al-reves': bi((i, e, v) => {
    const a = Math.abs(e.a), p = numTexto(fr(v).multiplicar(a), i);
    return i === 'es' ? `restar al revés: en ${e.b} ${MENOS} ${a}x primero se calcula ${a}x = ${a} · ${sustituido(v, i)} = ${p}, y eso se resta de ${e.b}. `
      : `subtracting the wrong way round: in ${e.b} ${MENOS} ${a}x first work out ${a}x = ${a} · ${sustituido(v, i)} = ${p}, and take that away from ${e.b}. `;
  }),
  'multiplica-solo-el-primero': bi((i, e) => (i === 'es'
    ? `multiplicar solo la x por ${e.k}. El ${e.k} multiplica a todo lo que hay dentro del paréntesis. `
    : `multiplying only the x by ${e.k}. The ${e.k} multiplies everything inside the brackets. `)),
  'olvida-el-factor': bi((i, e) => (i === 'es'
    ? `olvidar el ${e.k} de fuera: ${e.k}(…) significa ${e.k} · (…). `
    : `forgetting the ${e.k} outside: ${e.k}(…) means ${e.k} · (…). `)),
};

const porQueDe = {};
for (const id of Object.keys(hizo)) {
  porQueDe[id] = bi((i, item, valor) => (i === 'es'
    ? `${numTexto(valor, i)} sale de ${hizo[id][i](item.e, item.v)}`
    : `${numTexto(valor, i)} comes from ${hizo[id][i](item.e, item.v)}`));
}
porQueDe['otra-respuesta'] = bi((i, item, valor) => (i === 'es' ? `${numTexto(valor, i)} no es la respuesta. ` : `${numTexto(valor, i)} is not the answer. `));

export const TX = {
  campos: {
    resultado: { es: 'Resultado', en: 'Result' },
    valorDe: bi((i, x) => (i === 'es' ? `Valor para x = ${numTexto(x, i)}` : `Value for x = ${numTexto(x, i)}`)),
  },

  // ─── Ejercicio 1 ───────────────────────────────────────────────────────────────────────────
  ej1: {
    nombre: { es: 'Sustituye y calcula', en: 'Substitute and work out' },
    detalle: { es: 'El valor de una expresión', en: 'The value of an expression' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Sustituye</strong> la letra por el número y calcula: primero se multiplica; después se suma o se resta.</p>
        <p>Ejemplo: 3${x_} + 2 con ${x_} = 4. Como 3${x_} significa 3 · ${x_}: ${c('3 · 4 + 2 = 12 + 2 = 14')}. (No es 34.)</p>
        <p>Un número negativo se sustituye <strong>entre paréntesis</strong>: 10 − 2${x_} con ${x_} = −3 es ${c('10 − 2 · (−3) = 10 − (−6) = 16')}.</p>
        <p>Resuelve cada ejercicio y pulsa <strong>Comprobar</strong>. Puedes escribir 2,5 o 5/2.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Substitute</strong> (sustituye) the letter by the number and work it out: first multiply; then add or subtract.</p>
        <p>Example: 3${x_} + 2 when ${x_} = 4. Since 3${x_} means 3 · ${x_}: ${c('3 · 4 + 2 = 12 + 2 = 14')}. (It is not 34.)</p>
        <p>A negative number is substituted <strong>in brackets</strong>: 10 − 2${x_} when ${x_} = −3 is ${c('10 − 2 · (−3) = 10 − (−6) = 16')}.</p>
        <p>Solve each exercise and press <strong>Check</strong>. You can write 2.5 or 5/2.</p>`,
    },
    instruccion: {
      escribir: { es: 'Calcula el valor de la expresión.', en: 'Work out the value of the expression.' },
      elegir: { es: '¿Cuál es el valor de la expresión?', en: 'What is the value of the expression?' },
    },
    correcto: bi((i, item) => `${cl(cuenta(item.e, item.v, i))}.`),
    solucion: bi((i, item) => `${cl(cuenta(item.e, item.v, i))}.`),
    por_que: porQueDe,
  },

  // ─── Ejercicio 2 ───────────────────────────────────────────────────────────────────────────
  ej2: {
    nombre: { es: 'La tabla', en: 'The table' },
    detalle: { es: 'Completa la tabla de valores', en: 'Fill in the table of values' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En una <strong>tabla de valores</strong> se calcula la expresión para cada valor de ${x_}. Cada columna es un cálculo distinto.</p>
        <p>Ejemplo: 2${x_} + 1. Con ${x_} = 3: ${c('2 · 3 + 1 = 6 + 1 = 7')}. Con ${x_} = 5: ${c('2 · 5 + 1 = 10 + 1 = 11')}.</p>
        <p>Rellena los huecos y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>In a <strong>table of values</strong> (tabla de valores) you work out the expression for each value of ${x_}. Each column is a different calculation.</p>
        <p>Example: 2${x_} + 1. With ${x_} = 3: ${c('2 · 3 + 1 = 6 + 1 = 7')}. With ${x_} = 5: ${c('2 · 5 + 1 = 10 + 1 = 11')}.</p>
        <p>Fill in the blanks and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Completa la tabla.', en: 'Fill in the table.' },
    correcto: bi((i, item) => solucionTabla(item, i)),
    solucion: bi((i, item) => solucionTabla(item, i)),
    por_que: porQueDe,
  },

  // ─── Ejercicio 3 ───────────────────────────────────────────────────────────────────────────
  ej3: {
    nombre: { es: '¿Qué valor?', en: 'Which value?' },
    detalle: { es: '¿Qué expresión vale N?', en: 'Which expression equals N?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Calcula el valor de <strong>cada</strong> expresión con el valor de ${x_} que te dan, y elige la que da el número pedido. Solo una lo da.</p>
        <p>Ejemplo: ¿cuál vale 11 con ${x_} = 3? Con 2${x_} + 5: ${c('2 · 3 + 5 = 11')}. Con 3${x_} + 4: ${c('3 · 3 + 4 = 13')}. Es la primera.</p>`,
      en: `<h2>How it works</h2>
        <p>Work out the value of <strong>each</strong> expression with the value of ${x_} you are given, and choose the one that gives the number they ask for. Only one does.</p>
        <p>Example: which one is equal to 11 when ${x_} = 3? With 2${x_} + 5: ${c('2 · 3 + 5 = 11')}. With 3${x_} + 4: ${c('3 · 3 + 4 = 13')}. It is the first one.</p>`,
    },
    instruccion: bi((i, item) => (i === 'es'
      ? `Con ${xIgual(item.v, i)}, ¿qué expresión vale <strong>${numTexto(item.N, i)}</strong>?`
      : `When ${xIgual(item.v, i)}, which expression is equal to <strong>${numTexto(item.N, i)}</strong>?`)),
    correcto: bi((i, item) => {
      const b = item.opciones.find(o => o.correcta).e;
      return `${htmlDe(b)}: ${cl(cuenta(b, item.v, i))}.`;
    }),
    solucion: bi((i, item) => {
      const b = item.opciones.find(o => o.correcta).e;
      return `${htmlDe(b)}: ${cl(cuenta(b, item.v, i))}.`;
    }),
    /** (item, elegida): la que el alumno ha elegido por error. */
    por_que: bi((i, item, elegida) => {
      const real = valorDe(elegida.e, item.v);
      const cabeza = i === 'es'
        ? `${htmlDe(elegida.e)} vale ${numTexto(real, i)}, no ${numTexto(item.N, i)}: ${cl(cuenta(elegida.e, item.v, i))}. `
        : `${htmlDe(elegida.e)} is ${numTexto(real, i)}, not ${numTexto(item.N, i)}: ${cl(cuenta(elegida.e, item.v, i))}. `;
      const causa = hizo[elegida.error];
      if (!causa) return cabeza;
      return cabeza + (i === 'es' ? `El ${numTexto(item.N, i)} sale de ` : `That ${numTexto(item.N, i)} comes from `) + causa[i](elegida.e, item.v);
    }),
  },
};

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const respuestaFinal = (tt, texto) => `${tt({ es: 'La respuesta es', en: 'The answer is' })} ${c(texto)}.`;

/** «No lo sé» del ejercicio 1: sustituir y calcular. */
export function explicaSustituye(item, { idioma, tt }) {
  const regla = tt({
    es: `Sustituye la letra por el número y calcula: primero se multiplica; después se suma o se resta.${fr(item.v).num < 0 ? ' Un número negativo se sustituye entre paréntesis.' : ''}`,
    en: `Substitute the letter by the number and work it out: first multiply; then add or subtract.${fr(item.v).num < 0 ? ' A negative number is substituted in brackets.' : ''}`,
  });
  return `${regla} ${tt(TX.ej1.solucion)(item)} ${respuestaFinal(tt, numTexto(item.resultado, idioma))}`;
}

/** «No lo sé» del ejercicio 2: la tabla, hueco a hueco. */
export function explicaTabla(item, { idioma, tt }) {
  const regla = tt({
    es: 'En cada hueco, sustituye la x de esa columna en la expresión y calcula.',
    en: 'In each gap, substitute the x of that column in the expression and work it out.',
  });
  const valores = item.huecos.map(col => numTexto(item.valores[col], idioma)).join(idioma === 'es' ? ' y ' : ' and ');
  return `${regla} ${solucionTabla(item, idioma)} ${tt({ es: 'Los huecos valen', en: 'The gaps are' })} ${c(valores)}.`;
}

/** «No lo sé» del ejercicio 3: probar cada expresión hasta dar con la que vale N. */
export function explicaQueValor(item, { idioma, tt }) {
  const regla = tt({
    es: `Calcula cada expresión con ${xIgual(item.v, idioma)} hasta encontrar la que vale ${numTexto(item.N, idioma)}.`,
    en: `Work out each expression with ${xIgual(item.v, idioma)} until you find the one that is ${numTexto(item.N, idioma)}.`,
  });
  return `${regla} ${tt(TX.ej3.solucion)(item)} ${tt({ es: 'La respuesta es', en: 'The answer is' })} ${htmlDe(item.opciones.find(o => o.correcta).e)}.`;
}

/** La tabla resuelta: «x = 1: 3 · 1 + 2 = 5» en cada hueco. */
export function solucionTabla(item, idioma) {
  return item.huecos.map(col => `${x_} = ${numTexto({ num: item.xs[col], den: 1 }, idioma)}: ${cl(cuenta(item.e, { num: item.xs[col], den: 1 }, idioma))}`).join('; ') + '.';
}
