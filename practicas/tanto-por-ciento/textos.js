// «El tanto por ciento de una cantidad»: textos propios, siempre { es, en }. Producto con «·», división con «:».
// Solo se pide la parte (el p % de una cantidad): nada de «qué porcentaje es», totales ni descuentos (otras sesiones).
// El inglés, sencillo, y la palabra no matemática que decide la respuesta, aclarada entre paréntesis.

import { enunciado, porcentajeDe, cantidad, aTexto, numeroATexto } from '../_comun/proporcion.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';
import {
  ctxDe, datosDe, parteDe, cuentaDe, textoParte, unidadDeProblema,
} from './logica.js';

const MENOS = '−';
const cuentaHtml = c => `<span class="cuenta">${c}</span>`;
const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const num = (f, idioma) => numeroATexto(f, idioma);
const n = (x, idioma) => numeroATexto(fraccion(x), idioma);
const pc = (p, idioma) => aTexto(cantidad(p, '%'), idioma);
const lista = items => `<ol class="pasos-ayuda">${items.map(l => `<li>${cuentaHtml(l)}</li>`).join('')}</ol>`;

const FALLO = {
  'dividir-entre-el-porcentaje': {
    es: 'Has dividido la cantidad entre el porcentaje: el porcentaje no es por lo que se divide, es una parte de cada 100',
    en: 'You divided the amount by the percentage: the percentage is not a divisor, it is a part out of every 100',
  },
  'porcentaje-sin-dividir': {
    es: 'Has multiplicado sin dividir entre 100: el 15 % no es 15 veces la cantidad, es 15 de cada 100',
    en: 'You multiplied without dividing by 100: 15% is not 15 times the amount, it is 15 out of every 100',
  },
  'porcentaje-entre-mil': {
    es: 'La coma se ha ido una cifra de más: el 15 % es 0,15, no 0,015',
    en: 'The point is one place too far: 15% is 0.15, not 0.015',
  },
  'porcentaje-entre-diez': {
    es: 'La coma se ha quedado una cifra de menos: el 8 % es 0,08, no 0,8',
    en: 'The point is one place short: 8% is 0.08, not 0.8',
  },
  'restar-el-porcentaje': {
    es: 'Has restado el porcentaje como si fuera un número: el 15 % de 80 no es 80 menos 15',
    en: 'You subtracted the percentage as if it were a number: 15% of 80 is not 80 minus 15',
  },
  'dar-el-resto': {
    es: 'Has dado lo que queda, y se pide la parte',
    en: 'You gave what is left over, and the question asks for the part',
  },
  'mitad-por-cuarto': {
    es: 'El 25 % es la cuarta parte, no la mitad',
    en: '25% is a quarter, not a half',
  },
  'dividir-por-el-decimal': {
    es: 'Has dividido entre el decimal: para calcular el porcentaje se multiplica por él',
    en: 'You divided by the decimal: to find the percentage you multiply by it',
  },
};
const falloDe = (error, idioma) => FALLO[error]?.[idioma] ?? '';

// ─── Ejercicio 1: de cabeza ────────────────────────────────────────────────────

export function enunciadoCabeza(item, idioma) {
  return idioma === 'es'
    ? `Calcula el ${pc(item.p, idioma)} de ${n(item.N, idioma)}.`
    : `Work out ${pc(item.p, idioma)} of ${n(item.N, idioma)}.`;
}

/** El atajo de ese porcentaje: la regla en una frase y las cuentas, una por línea. */
export function atajo(p, N, idioma) {
  const R = parteDe(p, N), q = (d, N2 = N) => fraccion(N2, d).simplificar();
  const L = (a, b, r) => `${a} ${b} = ${r}`;
  const NT = n(N, idioma), RT = num(R, idioma);
  const es = idioma === 'es';
  const regla = {
    50: es ? 'El 50 % es la mitad.' : '50% is a half.',
    25: es ? 'El 25 % es la cuarta parte.' : '25% is a quarter.',
    75: es ? 'El 75 % son tres cuartas partes: se halla la cuarta parte y se multiplica por 3.' : '75% is three quarters: find a quarter and multiply by 3.',
    10: es ? 'El 10 % es la décima parte.' : '10% is a tenth.',
    5: es ? 'El 5 % es la mitad del 10 %.' : '5% is half of 10%.',
    1: es ? 'El 1 % es la centésima parte.' : '1% is a hundredth.',
  }[p] ?? (p % 10 === 0
    ? (es ? `El ${pc(p, idioma)} son ${p / 10} veces el 10 %, que es la décima parte.` : `${pc(p, idioma)} is ${p / 10} times 10%, which is a tenth.`)
    : (es ? `El ${pc(p, idioma)} son ${p} veces el 1 %, que es la centésima parte.` : `${pc(p, idioma)} is ${p} times 1%, which is a hundredth.`));
  let pasos;
  if (p === 50) pasos = [L(NT, ':', `2`).replace(/ = 2$/, ` = ${RT}`).replace(':', ': 2')];
  else if (p === 25) pasos = [`${NT} : 4 = ${RT}`];
  else if (p === 75) pasos = [`${NT} : 4 = ${num(q(4), idioma)}`, `3 · ${num(q(4), idioma)} = ${RT}`];
  else if (p === 10) pasos = [`${NT} : 10 = ${RT}`];
  else if (p === 5) pasos = [`${NT} : 10 = ${num(q(10), idioma)}`, `${num(q(10), idioma)} : 2 = ${RT}`];
  else if (p === 1) pasos = [`${NT} : 100 = ${RT}`];
  else if (p % 10 === 0) pasos = [`${NT} : 10 = ${num(q(10), idioma)}`, `${p / 10} · ${num(q(10), idioma)} = ${RT}`];
  else pasos = [`${NT} : 100 = ${num(q(100), idioma)}`, `${p} · ${num(q(100), idioma)} = ${RT}`];
  if (p === 50) pasos = [`${NT} : 2 = ${RT}`];
  return { regla, pasos, resultado: RT };
}

export function explicaCabeza(item, idioma) {
  const a = atajo(item.p, item.N, idioma);
  const resp = idioma === 'es' ? `La respuesta es: ${a.resultado}.` : `The answer is: ${a.resultado}.`;
  return `${a.regla}${lista(a.pasos)}${resp}`;
}

export function feedbackCabeza(item, { escrito, error }, idioma) {
  const dijo = idioma === 'es' ? `Has escrito ${escrito}.` : `You wrote ${escrito}.`;
  const causa = falloDe(error, idioma);
  return `${dijo} ${causa ? `${causa}. ` : ''}${explicaCabeza(item, idioma)}`.replace(/\s+/g, ' ').trim();
}

// ─── Ejercicio 2: con el decimal ───────────────────────────────────────────────

export const enunciadoDecimal = (item, idioma) => enunciadoCabeza(item, idioma);

export function explicaDecimal(item, idioma) {
  const r = porcentajeDe(item.p, cantidad(item.N), 'decimal');
  const regla = idioma === 'es'
    ? 'Se pasa el porcentaje a decimal (se divide entre 100) y se multiplica por la cantidad.'
    : 'Turn the percentage into a decimal (divide by 100) and multiply by the amount.';
  const resp = idioma === 'es' ? `La respuesta es: ${num(parteDe(item.p, item.N), idioma)}.` : `The answer is: ${num(parteDe(item.p, item.N), idioma)}.`;
  return `${regla}${lista(r.pasos.map(l => l[idioma]))}${resp}`;
}

export function feedbackDecimal(item, { escrito, error }, idioma) {
  const dijo = idioma === 'es' ? `Has escrito ${escrito}.` : `You wrote ${escrito}.`;
  const causa = falloDe(error, idioma);
  return `${dijo} ${causa ? `${causa}. ` : ''}${explicaDecimal(item, idioma)}`.replace(/\s+/g, ' ').trim();
}

// ─── Ejercicio 3: ¿qué operación? ──────────────────────────────────────────────

export const enunciadoOperacion = (item, idioma) => ({
  texto: idioma === 'es'
    ? `Quieres calcular el ${pc(item.p, idioma)} de ${n(item.N, idioma)}.`
    : `You want to work out ${pc(item.p, idioma)} of ${n(item.N, idioma)}.`,
  pregunta: idioma === 'es'
    ? '¿Con cuál de estas cuentas se calcula? No hace falta hacerla.'
    : 'Which of these calculations does it? You do not need to work it out.',
});

/** La cuenta de un tipo, sin hacer, en HTML (la fracción con raya). */
export function cuentaHtmlDe(item, tipo, idioma) {
  const c = cuentaDe(tipo, item.p, item.N);
  switch (c.forma) {
    case 'prod': return `${num(c.a, idioma)} · ${num(c.b, idioma)}`;
    case 'fraccion': return `${htmlFraccion(fraccion(c.p, 100))} · ${num(c.b, idioma)}`;
    case 'orden': return `${n(c.N, idioma)} : 100 · ${n(c.p, idioma)}`;
    case 'div': return `${num(c.a, idioma)} : ${num(c.b, idioma)}`;
    case 'resta': return `${num(c.a, idioma)} ${MENOS} ${num(c.b, idioma)}`;
    default: throw new Error(`Forma desconocida: ${c.forma}`);
  }
}

export function explicaOperacion(item, idioma) {
  const buena = item.opciones.find(o => o.error === null).tipo;
  const R = num(parteDe(item.p, item.N), idioma);
  const regla = idioma === 'es'
    ? `El ${pc(item.p, idioma)} es ${n(item.p, idioma)} de cada 100: se divide la cantidad entre 100 y se multiplica por ${n(item.p, idioma)}, o se multiplica por ${num(fraccion(item.p, 100).simplificar(), idioma)}.`
    : `${pc(item.p, idioma)} is ${n(item.p, idioma)} out of every 100: divide the amount by 100 and multiply by ${n(item.p, idioma)}, or multiply by ${num(fraccion(item.p, 100).simplificar(), idioma)}.`;
  const resp = idioma === 'es'
    ? `La respuesta es la cuenta ${cuentaHtml(cuentaHtmlDe(item, buena, idioma))}, que da ${R}.`
    : `The answer is the calculation ${cuentaHtml(cuentaHtmlDe(item, buena, idioma))}, which gives ${R}.`;
  return `${regla} ${resp}`;
}

export function feedbackOperacion(item, error, idioma) {
  const R = num(parteDe(item.p, item.N), idioma);
  const V = num(cuentaDe(error, item.p, item.N).valor, idioma);
  const causa = falloDe(error, idioma);
  const dijo = idioma === 'es'
    ? `Esa cuenta da ${V}, y el ${pc(item.p, idioma)} de ${n(item.N, idioma)} es ${R}.`
    : `That calculation gives ${V}, and ${pc(item.p, idioma)} of ${n(item.N, idioma)} is ${R}.`;
  return `${dijo} ${causa ? `${causa}. ` : ''}${explicaOperacion(item, idioma)}`.replace(/\s+/g, ' ').trim();
}

// ─── Ejercicio 4: problemas ────────────────────────────────────────────────────

export const enunciadoProblema = (item, idioma) => enunciado(ctxDe(item.ctx), datosDe(item), idioma, 'parte');

export function explicaProblema(item, idioma) {
  const d = datosDe(item);
  const r = porcentajeDe(item.p, d.total, 'decimal');
  const regla = idioma === 'es'
    ? `Se pide el ${pc(item.p, idioma)} de ${aTexto(d.total, idioma)}: se pasa el porcentaje a decimal y se multiplica por el total.`
    : `You are asked for ${pc(item.p, idioma)} of ${aTexto(d.total, idioma)}: turn the percentage into a decimal and multiply by the total.`;
  const resp = idioma === 'es'
    ? `La respuesta es: ${textoParte(item, idioma)}.`
    : `The answer is: ${textoParte(item, idioma)}.`;
  return `${regla}${lista(r.pasos.map(l => l[idioma]))}${resp}`;
}

export function feedbackProblema(item, { escrito, error }, idioma) {
  const dijo = idioma === 'es' ? `Has escrito ${escrito}.` : `You wrote ${escrito}.`;
  const causa = falloDe(error, idioma);
  return `${dijo} ${causa ? `${causa}. ` : ''}${explicaProblema(item, idioma)}`.replace(/\s+/g, ' ').trim();
}

export const unidadCampo = (item, idioma) => unidadDeProblema(item, idioma);

// ─── Textos de la práctica ─────────────────────────────────────────────────────

const no_se_hacerlo = { es: 'No sé hacerlo', en: 'I don’t know how' };

export const TX = {
  no_se_hacerlo,
  cabeza: {
    nombre: { es: 'De cabeza', en: 'In your head' },
    detalle: { es: 'El 10 %, el 50 %, el 25 % y compañía, sin calculadora', en: '10%, 50%, 25% and friends, with no calculator' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Hay porcentajes que se hacen <strong>de cabeza</strong>: el <strong>50 %</strong> es la mitad; el <strong>25 %</strong>, la cuarta parte; el <strong>10 %</strong>, la décima parte; el <strong>1 %</strong>, la centésima parte. Con ellos salen los demás: el 20 % es el doble del 10 %, el 75 % son tres cuartas partes…</p>
        <p>Por ejemplo, el <strong>20 %</strong> de 80: el 10 % es <strong>80 : 10 = 8</strong>, y el 20 % es el doble: <strong>2 · 8 = 16</strong>.</p>
        <p>Escribe solo el número.</p>`,
      en: `<h2>How it works</h2>
        <p>Some percentages are done <strong>in your head</strong>: <strong>50%</strong> is a half; <strong>25%</strong>, a quarter; <strong>10%</strong>, a tenth; <strong>1%</strong>, a hundredth. The others come from them: 20% is double 10%, 75% is three quarters…</p>
        <p>For example, <strong>20%</strong> of 80: 10% is <strong>80 : 10 = 8</strong>, and 20% is double: <strong>2 · 8 = 16</strong>.</p>
        <p>Write only the number.</p>`,
    },
  },
  decimal: {
    nombre: { es: 'Con el decimal', en: 'Using the decimal' },
    detalle: { es: 'El 15 % de 80: pasa el porcentaje a decimal', en: '15% of 80: turn the percentage into a decimal' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un porcentaje es una parte <strong>de cada 100</strong>: el 15 % es <strong>15 : 100 = 0,15</strong>. Para calcular el 15 % de una cantidad, se <strong>multiplica</strong> la cantidad por 0,15.</p>
        <p>Por ejemplo, el <strong>15 %</strong> de 80: <strong>0,15 · 80 = 12</strong>. Con un porcentaje de una cifra, ojo con la coma: el 8 % es <strong>0,08</strong>, no 0,8.</p>
        <p>Puedes llegar por el camino que prefieras (con fracción, con el 1 %…): solo se mira el resultado.</p>`,
      en: `<h2>How it works</h2>
        <p>A percentage is a part <strong>out of every 100</strong>: 15% is <strong>15 : 100 = 0.15</strong>. To find 15% of an amount, <strong>multiply</strong> the amount by 0.15.</p>
        <p>For example, <strong>15%</strong> of 80: <strong>0.15 · 80 = 12</strong>. With a one-digit percentage, watch the point: 8% is <strong>0.08</strong>, not 0.8.</p>
        <p>You can use any method you like (with a fraction, with 1%…): only the result is checked.</p>`,
    },
  },
  operacion: {
    nombre: { es: '¿Qué operación?', en: 'Which calculation?' },
    detalle: { es: 'Elige la cuenta que calcula el porcentaje', en: 'Choose the calculation that finds the percentage' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para calcular el <strong>15 %</strong> de 80 se multiplica por <strong>0,15</strong>, o por la fracción <strong>15/100</strong>, o se divide entre 100 y se multiplica por 15. Cualquiera de esas cuentas da <strong>12</strong>.</p>
        <p>Aquí <strong>no calculas</strong>: te dan cuatro cuentas sin hacer y eliges la que calcula el porcentaje. Solo una vale.</p>`,
      en: `<h2>How it works</h2>
        <p>To find <strong>15%</strong> of 80 you multiply by <strong>0.15</strong>, or by the fraction <strong>15/100</strong>, or divide by 100 and multiply by 15. Any of those gives <strong>12</strong>.</p>
        <p>Here you <strong>do not calculate</strong>: you get four calculations that are not done, and you choose the one that finds the percentage. Only one is right.</p>`,
    },
  },
  problema: {
    nombre: { es: 'Problemas', en: 'Problems' },
    detalle: { es: 'Un problema con un porcentaje: la parte y su unidad', en: 'A problem with a percentage: the part and its unit' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lees qué te piden: <strong>el porcentaje de un total</strong>. Pasas el porcentaje a decimal y multiplicas por el total. Contestas con <strong>el número y su unidad</strong>.</p>
        <p>Por ejemplo: en una clase de 25 alumnos, el 20 % lleva gafas: <strong>0,20 · 25 = 5</strong>. La respuesta son <strong>5 alumnos</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Read what you are asked: <strong>a percentage of a total</strong>. Turn the percentage into a decimal and multiply by the total. Answer with <strong>the number and its unit</strong>.</p>
        <p>For example: in a class of 25 pupils, 20% wear glasses: <strong>0.20 · 25 = 5</strong>. The answer is <strong>5 pupils</strong>.</p>`,
    },
    campo: { es: 'Tu respuesta (número)', en: 'Your answer (number)' },
  },
  campo: { es: 'Tu respuesta (número)', en: 'Your answer (number)' },
};
