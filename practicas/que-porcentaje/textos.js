// «¿Qué porcentaje? ¿De cuánto?»: textos propios, siempre { es, en }. Producto con «·», división con «:».
// Solo la parte, el porcentaje y el total en un paso: nada de descuentos, rebajas ni aumentos (sesión 12).
// El inglés, sencillo, y la palabra no matemática que decide la respuesta, aclarada entre paréntesis.

import { enunciado, cantidad, aTexto, numeroATexto } from '../_comun/proporcion.js';
import { fraccion, htmlRaya } from '../_comun/fracciones.js';
import {
  mcd, ctxDe, datosDe, textoDato, respuestaDe, trioDe, parteDe,
} from './logica.js';

const MENOS = '−';
const cuentaHtml = c => `<span class="cuenta">${c}</span>`;
const lista = items => `<ol class="pasos-ayuda">${items.map(l => `<li>${cuentaHtml(l)}</li>`).join('')}</ol>`;
const pc = (p, idioma) => aTexto(cantidad(p, '%'), idioma);
const n = (x, idioma) => numeroATexto(typeof x === 'number' ? fraccion(x) : x, idioma);
const respuesta = (texto, idioma) => `${idioma === 'es' ? 'La respuesta es' : 'The answer is'}: ${texto}.`;
const dijo = (escrito, idioma) => (idioma === 'es' ? `Has escrito ${escrito}.` : `You wrote ${escrito}.`);
const limpio = s => s.replace(/[ \t\n\r]+/g, ' ').trim();

// ─── Lo que sale mal, con los números del ítem ────────────────────────────────

/** `c` = { P, A, T, idioma }: el porcentaje, la parte y el total como fracciones. */
const FALLO = {
  'decimal-sin-pasar': ({ P, idioma }) => (idioma === 'es'
    ? `${n(P.dividir(100), idioma)} es el decimal; para tenerlo en porcentaje se multiplica por 100: ${pc(P, idioma)}`
    : `${n(P.dividir(100), idioma)} is the decimal; to write it as a percentage you multiply by 100: ${pc(P, idioma)}`),
  'dividir-al-reves': ({ A, T, idioma }) => (idioma === 'es'
    ? `Has dividido al revés (${n(T, idioma)} : ${n(A, idioma)} = ${n(T.dividir(A), idioma)}): primero va la parte y luego el total, ${n(A, idioma)} : ${n(T, idioma)}`
    : `You divided the wrong way round (${n(T, idioma)} : ${n(A, idioma)} = ${n(T.dividir(A), idioma)}): the part goes first and then the total, ${n(A, idioma)} : ${n(T, idioma)}`),
  'la-parte-como-porcentaje': ({ A, idioma }) => (idioma === 'es'
    ? `${n(A, idioma)} es la parte, no el porcentaje`
    : `${n(A, idioma)} is the part, not the percentage`),
  restar: ({ A, T, idioma }) => (idioma === 'es'
    ? `${n(T, idioma)} ${MENOS} ${n(A, idioma)} = ${n(T.restar(A), idioma)} es lo que queda; el porcentaje compara la parte con el total`
    : `${n(T, idioma)} ${MENOS} ${n(A, idioma)} = ${n(T.restar(A), idioma)} is what is left; the percentage compares the part with the total`),
  'porcentaje-del-dato': ({ P, A, idioma }) => (idioma === 'es'
    ? `Has calculado el ${pc(P, idioma)} de ${n(A, idioma)}, pero ${n(A, idioma)} ya es el ${pc(P, idioma)} de la cantidad`
    : `You found ${pc(P, idioma)} of ${n(A, idioma)}, but ${n(A, idioma)} is already ${pc(P, idioma)} of the amount`),
  'multiplicar-por-el-porcentaje': ({ P, A, idioma }) => (idioma === 'es'
    ? `Has multiplicado ${n(A, idioma)} · ${n(P, idioma)} = ${n(A.multiplicar(P), idioma)}: el porcentaje no se multiplica por la cantidad`
    : `You multiplied ${n(A, idioma)} · ${n(P, idioma)} = ${n(A.multiplicar(P), idioma)}: the percentage is not multiplied by the amount`),
  'sumar-el-porcentaje': ({ P, A, idioma }) => (idioma === 'es'
    ? `Has sumado ${n(A, idioma)} + ${n(P, idioma)} = ${n(A.sumar(P), idioma)}: el porcentaje no es una cantidad que se sume`
    : `You added ${n(A, idioma)} + ${n(P, idioma)} = ${n(A.sumar(P), idioma)}: the percentage is not an amount you add`),
  'dividir-sin-el-cien': ({ P, A, idioma }) => (idioma === 'es'
    ? `Has dividido ${n(A, idioma)} : ${n(P, idioma)} = ${n(A.dividir(P), idioma)}, que es el ${pc(1, idioma)}: falta llegar al ${pc(100, idioma)}`
    : `You divided ${n(A, idioma)} : ${n(P, idioma)} = ${n(A.dividir(P), idioma)}, which is ${pc(1, idioma)}: you still have to get to ${pc(100, idioma)}`),
  'porcentaje-sin-dividir': ({ P, idioma }) => (idioma === 'es'
    ? `Has multiplicado sin dividir entre 100: el ${pc(P, idioma)} no es ${n(P, idioma)} veces la cantidad, es ${n(P, idioma)} de cada 100`
    : `You multiplied without dividing by 100: ${pc(P, idioma)} is not ${n(P, idioma)} times the amount, it is ${n(P, idioma)} out of every 100`),
  'dividir-entre-el-porcentaje': ({ P, T, idioma }) => (idioma === 'es'
    ? `Has dividido ${n(T, idioma)} : ${n(P, idioma)} = ${n(T.dividir(P), idioma)}: el ${pc(P, idioma)} no es por lo que se divide, es ${n(P, idioma)} de cada 100`
    : `You divided ${n(T, idioma)} : ${n(P, idioma)} = ${n(T.dividir(P), idioma)}: ${pc(P, idioma)} is not what you divide by, it is ${n(P, idioma)} out of every 100`),
  'restar-el-porcentaje': ({ P, T, idioma }) => (idioma === 'es'
    ? `Has restado ${n(T, idioma)} ${MENOS} ${n(P, idioma)} = ${n(T.restar(P), idioma)}: el ${pc(P, idioma)} es ${n(P, idioma)} de cada 100, no ${n(P, idioma)} unidades que se quitan`
    : `You subtracted ${n(T, idioma)} ${MENOS} ${n(P, idioma)} = ${n(T.restar(P), idioma)}: ${pc(P, idioma)} is ${n(P, idioma)} out of every 100, not ${n(P, idioma)} units to take away`),
  'dar-el-resto': ({ A, T, idioma }) => (idioma === 'es'
    ? `Has dado lo que queda (${n(T, idioma)} ${MENOS} ${n(A, idioma)}), y se pide la parte`
    : `You gave what is left over (${n(T, idioma)} ${MENOS} ${n(A, idioma)}), and the question asks for the part`),
};
const falloDe = (error, c) => (FALLO[error] ? FALLO[error](c) : '');

const conFallo = (item, error, idioma, explica) => {
  const { P, A, T } = trioDe(item);
  const causa = falloDe(error, { P, A, T, idioma });
  return limpio(`${causa ? `${causa}. ` : ''}${explica(item, idioma)}`);
};

// ─── Ejercicio 1: ¿qué porcentaje es? ─────────────────────────────────────────

export const enunciadoPorcentaje = (item, idioma) => (idioma === 'es'
  ? `¿Qué porcentaje es ${n(item.parte, idioma)} de ${n(item.N, idioma)}?`
  : `What percentage is ${n(item.parte, idioma)} of ${n(item.N, idioma)}?`);

/** Pasos de «qué porcentaje es A de T»: A : T = decimal, y el decimal es el porcentaje. */
export function pasosPorcentaje(A, T, P, idioma, f = x => n(x, idioma)) {
  const dec = n(P.dividir(100), idioma);
  return [`${f(A)} : ${f(T)} = ${dec}`, `${dec} = ${pc(P, idioma)}`];
}

export function explicaPorcentaje(item, idioma) {
  const { P, A, T } = trioDe(item);
  const regla = idioma === 'es'
    ? 'Se divide la parte entre el total y se pasa el decimal a porcentaje.'
    : 'Divide the part by the total and turn the decimal into a percentage.';
  return `${regla}${lista(pasosPorcentaje(A, T, P, idioma))}${respuesta(pc(P, idioma), idioma)}`;
}
export const feedbackPorcentaje = (item, { escrito, error }, idioma) =>
  limpio(`${dijo(escrito, idioma)} ${conFallo(item, error, idioma, explicaPorcentaje)}`);

// ─── Ejercicio 2: ¿de cuánto? ──────────────────────────────────────────────────

export const enunciadoTotal = (item, idioma) => (idioma === 'es'
  ? `El ${pc(item.p, idioma)} de una cantidad es ${n(item.parte, idioma)}. ¿Cuál es la cantidad?`
  : `${pc(item.p, idioma)} of an amount is ${n(item.parte, idioma)}. What is the amount?`);

/** El camino corto hasta el 100 %: { regla, pasos }. `f` da formato a una fracción (con su unidad si la hay). */
export function caminoTotal(P, A, T, idioma, f = x => n(x, idioma)) {
  const p = P.num, g = mcd(p, 100), es = idioma === 'es';
  if (g === p) {
    const veces = 100 / p;
    return {
      regla: es ? `El ${pc(p, idioma)} son ${f(A)}. Para llegar al ${pc(100, idioma)} hay que repetir el ${pc(p, idioma)} ${veces} veces.`
        : `${pc(p, idioma)} is ${f(A)}. To get to ${pc(100, idioma)} you repeat ${pc(p, idioma)} ${veces} times.`,
      pasos: [`100 : ${p} = ${veces}`, `${veces} · ${f(A)} = ${f(T)}`],
    };
  }
  const k = p / g, trozo = A.dividir(k).simplificar(), veces = 100 / g;
  return {
    regla: es ? `El ${pc(p, idioma)} son ${f(A)}. Se halla el ${pc(g, idioma)} y, de ahí, el ${pc(100, idioma)}.`
      : `${pc(p, idioma)} is ${f(A)}. Find ${pc(g, idioma)} first, and from there ${pc(100, idioma)}.`,
    pasos: [`${f(A)} : ${k} = ${f(trozo)}${es ? ` (el ${pc(g, idioma)})` : ` (${pc(g, idioma)})`}`, `${veces} · ${f(trozo)} = ${f(T)}`],
  };
}

/**
 * El método oficial (acta de la 02, puntos b e i): la tabla Porcentaje | Cantidad con el 100 % arriba, la proporción y los
 * productos cruzados. `pide` es 'total' o 'parte'; `f` da formato a una cantidad con su unidad. Devuelve { regla, pasos, otra }.
 */
export function metodoTabla(pide, P, A, T, idioma, f = x => n(x, idioma)) {
  const es = idioma === 'es', x = '<i>x</i>';
  const fila = (por, cant) => `${pc(por, idioma)} → ${cant}`;
  const raya = (arriba, abajo) => htmlRaya(arriba, abajo);
  if (pide === 'total') {
    const cruz = A.multiplicar(100);
    return {
      regla: es ? `Se hace la tabla Porcentaje → Cantidad, con el ${pc(100, idioma)} (el total) en la fila de la x, y se multiplica en cruz.`
        : `Make the table Percentage → Amount, with ${pc(100, idioma)} (the total) in the x row, and multiply across.`,
      pasos: [
        `${fila(100, x)}; ${fila(P, f(A))}`,
        `${raya(100, n(P, idioma))} = ${raya(x, n(A, idioma))}`,
        `${n(P, idioma)} · ${x} = 100 · ${n(A, idioma)} = ${n(cruz, idioma)}`,
        `${x} = ${n(cruz, idioma)} : ${n(P, idioma)} = ${f(T)}`,
      ],
      otra: caminoTotal(P, A, T, idioma, f).pasos.map(cuentaHtml),
    };
  }
  const cruz = P.multiplicar(T);
  return {
    regla: es ? `Se hace la tabla Porcentaje → Cantidad, con el ${pc(100, idioma)} (el total) arriba, y se multiplica en cruz.`
      : `Make the table Percentage → Amount, with ${pc(100, idioma)} (the total) on top, and multiply across.`,
    pasos: [
      `${fila(100, f(T))}; ${fila(P, x)}`,
      `${raya(n(P, idioma), 100)} = ${raya(x, n(T, idioma))}`,
      `100 · ${x} = ${n(P, idioma)} · ${n(T, idioma)} = ${n(cruz, idioma)}`,
      `${x} = ${n(cruz, idioma)} : 100 = ${f(A)}`,
    ],
    otra: [`${n(P.dividir(100), idioma)} · ${n(T, idioma)} = ${n(A, idioma)}`].map(cuentaHtml),
  };
}
const otraForma = (otra, idioma) => `${idioma === 'es' ? 'Otra forma:' : 'Another way:'} ${otra.join(idioma === 'es' ? ' y ' : ' and ')}.`;

export function explicaTotal(item, idioma) {
  const { P, A, T } = trioDe(item);
  const m = metodoTabla('total', P, A, T, idioma);
  return `${m.regla}${lista(m.pasos)}${otraForma(m.otra, idioma)} ${respuesta(n(T, idioma), idioma)}`;
}
export const feedbackTotal = (item, { escrito, error }, idioma) =>
  limpio(`${dijo(escrito, idioma)} ${conFallo(item, error, idioma, explicaTotal)}`);

// ─── Ejercicio 3: ¿cuál de los tres problemas es? ──────────────────────────────

export const enunciadoTipo = (item, idioma) => enunciado(ctxDe(item.ctx), datosDe(item), idioma, item.pregunta);

export const PIDEN = {
  parte: { es: 'Piden la parte', en: 'It asks for the part' },
  porcentaje: { es: 'Piden el porcentaje', en: 'It asks for the percentage' },
  total: { es: 'Piden el total', en: 'It asks for the total' },
};
const NOMBRE_DATO = {
  parte: { es: 'la parte', en: 'the part' },
  porcentaje: { es: 'el porcentaje', en: 'the percentage' },
  total: { es: 'el total', en: 'the total' },
};
const DATO = (item, clave, idioma) => (clave === 'porcentaje' ? pc(item.p, idioma) : textoDato(item, clave, idioma));

/** Qué dos datos da el enunciado y cuál falta. */
export function datosDelEnunciado(item, idioma) {
  const dados = PREGUNTAS_ORDEN.filter(k => k !== item.pregunta);
  const [a, b] = dados.map(k => `${NOMBRE_DATO[k][idioma]} (${DATO(item, k, idioma)})`);
  return idioma === 'es'
    ? `Te dan ${a} y ${b}: falta ${NOMBRE_DATO[item.pregunta].es}.`
    : `You are given ${a} and ${b}: ${NOMBRE_DATO[item.pregunta].en} is missing.`;
}
const PREGUNTAS_ORDEN = ['porcentaje', 'parte', 'total'];

export const explicaTipo = (item, idioma) => `${datosDelEnunciado(item, idioma)} ${respuesta(`«${PIDEN[item.pregunta][idioma]}»`, idioma)}`;
export function feedbackTipo(item, elegida, idioma) {
  const eligio = idioma === 'es' ? `Has elegido «${PIDEN[elegida][idioma]}».` : `You chose “${PIDEN[elegida][idioma]}”.`;
  return limpio(`${eligio} ${explicaTipo(item, idioma)}`);
}

// ─── Ejercicio 4: problemas ────────────────────────────────────────────────────

export const enunciadoProblema = (item, idioma) => enunciado(ctxDe(item.ctx), datosDe(item), idioma, item.pregunta);

/** La respuesta como texto con su unidad: «20 %», «5 alumnos», «12,00 €». */
export const textoRespuesta = (item, idioma) => (item.pregunta === 'porcentaje' ? pc(item.p, idioma) : textoDato(item, item.pregunta, idioma));

export function explicaProblema(item, idioma) {
  const { P, A, T } = trioDe(item);
  const ctx = ctxDe(item.ctx);
  const euros = (ctx.datos.total.unidad ?? null) === '€';
  const f = x => (euros ? aTexto(cantidad(x, '€'), idioma) : n(x, idioma));
  const es = idioma === 'es';
  if (item.pregunta === 'porcentaje') {
    const regla = es ? `Se pide el porcentaje: se divide la parte, ${textoDato(item, 'parte', idioma)}, entre el total, ${textoDato(item, 'total', idioma)}.`
      : `You are asked for the percentage: divide the part, ${textoDato(item, 'parte', idioma)}, by the total, ${textoDato(item, 'total', idioma)}.`;
    return `${regla}${lista(pasosPorcentaje(A, T, P, idioma, f))}${respuesta(textoRespuesta(item, idioma), idioma)}`;
  }
  const m = metodoTabla(item.pregunta, P, A, T, idioma, f);
  const pide = item.pregunta === 'total'
    ? (es ? `Se pide el total: el ${pc(item.p, idioma)} son ${textoDato(item, 'parte', idioma)}.` : `You are asked for the total: ${pc(item.p, idioma)} is ${textoDato(item, 'parte', idioma)}.`)
    : (es ? `Se pide la parte: el ${pc(item.p, idioma)} de ${textoDato(item, 'total', idioma)}.` : `You are asked for the part: ${pc(item.p, idioma)} of ${textoDato(item, 'total', idioma)}.`);
  return `${pide} ${m.regla}${lista(m.pasos)}${otraForma(m.otra, idioma)} ${respuesta(textoRespuesta(item, idioma), idioma)}`;
}
export const feedbackProblema = (item, { escrito, error }, idioma) =>
  limpio(`${dijo(escrito, idioma)} ${conFallo(item, error, idioma, explicaProblema)}`);

// ─── Textos de la práctica ─────────────────────────────────────────────────────

const no_se_hacerlo = { es: 'No sé hacerlo', en: 'I don’t know how' };
const campo = { es: 'Tu respuesta (número)', en: 'Your answer (number)' };

export const TX = {
  no_se_hacerlo,
  campo,
  porcentaje: {
    nombre: { es: '¿Qué porcentaje es?', en: 'What percentage is it?' },
    detalle: { es: '12 de 80: la parte entre el total, y a porcentaje', en: '12 out of 80: the part divided by the total, as a percentage' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para saber <strong>qué porcentaje</strong> es una cantidad de otra, se divide <strong>la parte entre el total</strong> y el decimal se pasa a porcentaje.</p>
        <p>Por ejemplo, ¿qué porcentaje es 12 de 80? <strong>12 : 80 = 0,15</strong> y <strong>0,15 = 15 %</strong>. La respuesta es 15 %.</p>
        <p>Escribe solo el número: el signo % ya está puesto.</p>`,
      en: `<h2>How it works</h2>
        <p>To find <strong>what percentage</strong> one amount is of another, divide <strong>the part by the total</strong> and turn the decimal into a percentage.</p>
        <p>For example, what percentage is 12 of 80? <strong>12 : 80 = 0.15</strong> and <strong>0.15 = 15%</strong>. The answer is 15%.</p>
        <p>Write only the number: the % sign is already there.</p>`,
    },
  },
  total: {
    nombre: { es: '¿De cuánto?', en: 'Of how much?' },
    detalle: { es: 'El 20 % de una cantidad es 30: ¿cuál es la cantidad?', en: '20% of an amount is 30: what is the amount?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Aquí te dan <strong>la parte</strong> y el porcentaje, y te piden <strong>el total</strong> (el 100 %).</p>
        <p>Por ejemplo, el 20 % de una cantidad es 30. Se hace la tabla Porcentaje → Cantidad: <strong>100 % → x</strong> y <strong>20 % → 30</strong>. Se multiplica en cruz: <strong>20 · x = 100 · 30 = 3000</strong> y <strong>x = 3000 : 20 = 150</strong>.</p>
        <p>Otra forma, más corta: si el 20 % son 30, el 10 % son 15 y <strong>el 100 % son 150</strong>.</p>
        <p>Puedes llegar por el camino que prefieras: solo se mira el resultado.</p>`,
      en: `<h2>How it works</h2>
        <p>Here you are given <strong>the part</strong> and the percentage, and you are asked for <strong>the total</strong> (100%).</p>
        <p>For example, 20% of an amount is 30. Make the table Percentage → Amount: <strong>100% → x</strong> and <strong>20% → 30</strong>. Multiply across: <strong>20 · x = 100 · 30 = 3000</strong> and <strong>x = 3000 : 20 = 150</strong>.</p>
        <p>Another way, shorter: if 20% is 30, then 10% is 15 and <strong>100% is 150</strong>.</p>
        <p>You can use any method you like: only the result is checked.</p>`,
    },
  },
  tipo: {
    nombre: { es: '¿Cuál de los tres problemas es?', en: 'Which of the three?' },
    detalle: { es: 'Piden la parte, el porcentaje o el total: no se calcula', en: 'It asks for the part, the percentage or the total: no calculating' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En un problema de porcentajes hay <strong>tres datos</strong>: <strong>el total</strong> (todo), <strong>la parte</strong> (lo que se lleva) y <strong>el porcentaje</strong>. El enunciado da dos, y <strong>el que falta</strong> es lo que piden.</p>
        <p>Por ejemplo: en una clase de 25 alumnos, el 20 % lleva gafas. ¿Cuántos llevan gafas? Te dan el total (25) y el porcentaje (20 %): <strong>piden la parte</strong>.</p>
        <p>Aquí <strong>no calculas</strong>: solo eliges qué piden.</p>`,
      en: `<h2>How it works</h2>
        <p>A percentage problem has <strong>three pieces of data</strong>: <strong>the total</strong> (the whole), <strong>the part</strong> (some of it) and <strong>the percentage</strong>. The problem gives two, and <strong>the missing one</strong> is what it asks for.</p>
        <p>For example: in a class of 25 pupils, 20% wear glasses. How many wear glasses? You are given the total (25) and the percentage (20%): <strong>it asks for the part</strong>.</p>
        <p>Here you <strong>do not calculate</strong>: you only choose what it asks for.</p>`,
    },
  },
  problema: {
    nombre: { es: 'Problemas', en: 'Problems' },
    detalle: { es: 'Un problema de un paso: el porcentaje, el total o la parte', en: 'A one-step problem: the percentage, the total or the part' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lees qué te piden: <strong>el porcentaje</strong> (parte entre total), <strong>el total</strong> (a partir de la parte y el porcentaje) o <strong>la parte</strong> (el porcentaje del total). Contestas con <strong>el número y su unidad</strong>.</p>
        <p>Por ejemplo: en una clase de 25 alumnos, 5 llevan gafas. ¿Qué porcentaje lleva gafas? <strong>5 : 25 = 0,2</strong> y <strong>0,2 = 20 %</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Read what you are asked: <strong>the percentage</strong> (part divided by total), <strong>the total</strong> (from the part and the percentage) or <strong>the part</strong> (the percentage of the total). Answer with <strong>the number and its unit</strong>.</p>
        <p>For example: in a class of 25 pupils, 5 wear glasses. What percentage wear glasses? <strong>5 : 25 = 0.2</strong> and <strong>0.2 = 20%</strong>.</p>`,
    },
  },
};

export { respuestaDe, parteDe };
