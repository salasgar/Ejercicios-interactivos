// Práctica «¿Es solución?»: textos propios, siempre { es, en }. Los comunes (Comprobar, Siguiente…)
// llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 6): sin «×» (el producto es «·»), sin
// «1x», sin «+ −» (un negativo detrás de una operación va entre paréntesis), sin x²; la coma en español
// y el punto en inglés; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM.

import { Fraccion } from '../_comun/fracciones.js';
import {
  F, numTexto, sustituido, ecuacionDe, htmlDe, ecuacionesConSolucion, nombreError, valorMiembro, solucionDe, ecuacion3,
} from './logica.js';

const MENOS = '−';
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = t => `<span class="cuenta">${t}</span>`;
const cl = t => `<span class="cuenta-frac">${t}</span>`;
const x_ = '<i>x</i>';
const fr = p => (p instanceof Fraccion ? p : typeof p === 'number' ? new Fraccion(p, 1) : F(p));

/** «3 · 4 + 2 = 12 + 2 = 14»: la cuenta de un miembro (lista de términos) con x = v. */
export function cuentaMiembro(terminos, v, idioma) {
  const x = fr(v), sx = sustituido(x, idioma);
  const unir = partes => partes.map(([neg, cuerpo], i) => (i === 0 ? `${neg ? MENOS : ''}${cuerpo}` : ` ${neg ? MENOS : '+'} ${cuerpo}`)).join('').replace(/^ /, '');
  const paso1 = [], paso2 = [];
  for (const t of terminos) {
    const co = t.coef.simplificar(), neg = co.num < 0, abs = Math.abs(co.num);
    if (!t.letra) { paso1.push([neg, `${abs}`]); paso2.push([neg, `${abs}`]); continue; }
    paso1.push([neg, abs === 1 ? sx : `${abs} · ${sx}`]);
    const prod = x.multiplicar(abs).simplificar();
    paso2.push([neg, abs === 1 ? sx : paso2.length === 0 && !neg ? numTexto(prod, idioma) : sustituido(prod, idioma)]);
  }
  const R = numTexto(valorMiembro(terminos, x), idioma);
  const a = unir(paso1), b = unir(paso2);
  if (terminos.length === 1 && !terminos[0].letra) return R;
  return [...new Set([a, b])].join(' = ') + (b === R ? '' : ` = ${R}`);
}

const xIgual = (v, idioma) => `${x_} = ${numTexto(v, idioma)}`;

/** Izquierda y derecha de una ecuación con x = v, y si se cumple: devuelve { L, R, cumple, texto }. */
function comprobacion(q, v, idioma) {
  const x = fr(v);
  const L = valorMiembro(q.terminosIzq, x), R = valorMiembro(q.terminosDer, x);
  const cumple = L.equals(R);
  const lt = numTexto(L, idioma), rt = numTexto(R, idioma);
  const lado = (ts, valor) => cl(cuentaMiembro(ts, x, idioma));
  const izq = idioma === 'es' ? 'Izquierda' : 'Left';
  const der = idioma === 'es' ? 'Derecha' : 'Right';
  const cierre = cumple
    ? `${lt} = ${rt}`
    : `${lt} ≠ ${rt}`;
  return {
    L, R, cumple, lt, rt,
    texto: `${izq}: ${lado(q.terminosIzq)}. ${der}: ${lado(q.terminosDer)}. ${cierre}`,
  };
}

const eqEn = (e, idioma, v) => `${htmlDe(e)} ${idioma === 'es' ? 'con' : 'when'} ${xIgual(v, idioma)}`;

const SI = { es: 'Sí, es solución', en: 'Yes, it is a solution' };
const NO = { es: 'No, no es solución', en: 'No, it is not a solution' };

export const TX = {
  campos: {
    ecuacion: { es: 'Tu ecuación', en: 'Your equation' },
  },
  botones: { si: SI, no: NO, identidad: { es: 'Identidad', en: 'Identity' }, ecuacion: { es: 'Ecuación', en: 'Equation' } },

  // ─── Ejercicio 1 ───────────────────────────────────────────────────────────────────────────
  ej1: {
    nombre: { es: 'Compruébalo', en: 'Check it' },
    detalle: { es: '¿Es solución o no?', en: 'Is it a solution or not?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un número es <strong>solución</strong> de una ecuación si, al sustituir la ${x_} por ese número, <strong>los dos miembros valen lo mismo</strong>. No hay que resolver nada: solo comprobar.</p>
        <p>Ejemplo: ¿es ${x_} = 4 solución de 3${x_} + 2 = 14? Izquierda: ${c('3 · 4 + 2 = 12 + 2 = 14')}. Derecha: 14. Como 14 = 14, <strong>sí</strong> es solución.</p>
        <p>¿Y ${x_} = 5? Izquierda: ${c('3 · 5 + 2 = 17')}. Derecha: 14. Como 17 ≠ 14, <strong>no</strong> es solución.</p>`,
      en: `<h2>How it works</h2>
        <p>A number is a <strong>solution</strong> (solución) of an equation if, when you substitute ${x_} by that number, <strong>both sides are equal</strong>. You do not have to solve anything: just check.</p>
        <p>Example: is ${x_} = 4 a solution of 3${x_} + 2 = 14? Left: ${c('3 · 4 + 2 = 12 + 2 = 14')}. Right: 14. Since 14 = 14, <strong>yes</strong>, it is a solution.</p>
        <p>What about ${x_} = 5? Left: ${c('3 · 5 + 2 = 17')}. Right: 14. Since 17 ≠ 14, <strong>no</strong>, it is not a solution.</p>`,
    },
    instruccion: bi((i, item) => (i === 'es'
      ? `¿Es ${xIgual(item.v, i)} solución de la ecuación?`
      : `Is ${xIgual(item.v, i)} a solution of the equation?`)),
    correcto: bi((i, item) => {
      const k = comprobacion(ecuacionDe(item), item.v, i);
      return item.esSolucion
        ? `${k.texto}. ${i === 'es' ? 'Son iguales: sí es solución.' : 'They are equal: it is a solution.'}`
        : `${k.texto}. ${i === 'es' ? 'No son iguales: no es solución.' : 'They are not equal: it is not a solution.'}`;
    }),
    por_que: bi((i, item, error) => {
      const k = comprobacion(ecuacionDe(item), item.v, i);
      if (item.esSolucion) {
        return `${k.texto}. ${i === 'es' ? 'Los dos miembros son iguales, así que sí es solución. ' : 'Both sides are equal, so it is a solution. '}`;
      }
      const n = nombreError(error);
      return `${k.texto}. ${i === 'es'
        ? `Los miembros no son iguales, así que ${numTexto(item.v, i)} no es solución (viene de: ${n.es.charAt(0).toLowerCase()}${n.es.slice(1)}). La solución es ${xIgual(item.s, i)}. `
        : `The sides are not equal, so ${numTexto(item.v, i)} is not a solution (it comes from: ${n.en.charAt(0).toLowerCase()}${n.en.slice(1)}). The solution is ${xIgual(item.s, i)}. `}`;
    }),
  },

  // ─── Ejercicio 2 ───────────────────────────────────────────────────────────────────────────
  ej2: {
    nombre: { es: '¿Qué ecuación?', en: 'Which equation?' },
    detalle: { es: 'La que tiene esa solución', en: 'The one with that solution' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Te dan un valor de ${x_} y cuatro ecuaciones. Solo en <strong>una</strong> los dos miembros valen lo mismo con ese valor. Compruébalas una a una.</p>
        <p>Ejemplo: ¿cuál tiene por solución ${x_} = 3? Con ${x_} + 4 = 7: ${c('3 + 4 = 7')}, se cumple. Con 2${x_} = 9: ${c('2 · 3 = 6')} y 6 ≠ 9, no se cumple.</p>`,
      en: `<h2>How it works</h2>
        <p>You are given a value of ${x_} and four equations. In only <strong>one</strong> of them both sides are equal with that value. Check them one by one.</p>
        <p>Example: which one has the solution ${x_} = 3? With ${x_} + 4 = 7: ${c('3 + 4 = 7')}, it works. With 2${x_} = 9: ${c('2 · 3 = 6')} and 6 ≠ 9, it does not work.</p>`,
    },
    instruccion: bi((i, item) => (i === 'es'
      ? `¿Cuál de estas ecuaciones tiene por solución ${xIgual(item.s, i)}?`
      : `Which of these equations has the solution ${xIgual(item.s, i)}?`)),
    correcto: bi((i, item) => {
      const b = item.opciones.find(o => o.correcta).e;
      return `${htmlDe(b)}: ${comprobacion(ecuacionDe(b), item.s, i).texto}.`;
    }),
    /** (item, elegida) */
    por_que: bi((i, item, elegida) => {
      const q = ecuacionDe(elegida.e), sol = solucionDe(elegida.e);
      const k = comprobacion(q, item.s, i);
      const n = nombreError(elegida.error);
      const b = item.opciones.find(o => o.correcta).e;
      return i === 'es'
        ? `${htmlDe(elegida.e)} con ${xIgual(item.s, i)}: ${k.texto}. Su solución es ${xIgual(sol, i)}; el ${numTexto(item.s, i)} sale de: ${n.es.charAt(0).toLowerCase()}${n.es.slice(1)}. La buena es ${htmlDe(b)}. `
        : `${htmlDe(elegida.e)} when ${xIgual(item.s, i)}: ${k.texto}. Its solution is ${xIgual(sol, i)}; the ${numTexto(item.s, i)} comes from: ${n.en.charAt(0).toLowerCase()}${n.en.slice(1)}. The right one is ${htmlDe(b)}. `;
    }),
  },

  // ─── Ejercicio 3 ───────────────────────────────────────────────────────────────────────────
  ej3: {
    nombre: { es: '¿Identidad o ecuación?', en: 'Identity or equation?' },
    detalle: { es: '¿Se cumple siempre?', en: 'Is it always true?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una <strong>ecuación</strong> solo se cumple con algunos valores de ${x_} (su solución). Una <strong>identidad</strong> se cumple con <strong>cualquier</strong> valor, porque los dos miembros son lo mismo escrito de otra manera.</p>
        <p>Ejemplo: 2${x_} + 3${x_} = 5${x_}. Con ${x_} = 1: ${c('2 + 3 = 5')}. Con ${x_} = 4: ${c('8 + 12 = 20')}. Siempre coinciden: es una identidad.</p>
        <p>Ejemplo: ${x_} + 5 = 9. Con ${x_} = 4 se cumple, con ${x_} = 6 no: es una ecuación.</p>`,
      en: `<h2>How it works</h2>
        <p>An <strong>equation</strong> (ecuación) is true only for some values of ${x_} (its solution). An <strong>identity</strong> (identidad) is true for <strong>any</strong> value, because both sides are the same thing written in a different way.</p>
        <p>Example: 2${x_} + 3${x_} = 5${x_}. When ${x_} = 1: ${c('2 + 3 = 5')}. When ${x_} = 4: ${c('8 + 12 = 20')}. They always match: it is an identity.</p>
        <p>Example: ${x_} + 5 = 9. It is true when ${x_} = 4, not when ${x_} = 6: it is an equation.</p>`,
    },
    instruccion: {
      es: '¿Se cumple con cualquier valor de x (identidad) o solo con algunos (ecuación)?',
      en: 'Is it true for any value of x (identity) or only for some (equation)?',
    },
    correcto: bi((i, item) => explica3(item, i)),
    por_que: bi((i, item) => explica3(item, i)),
  },

  // ─── Ejercicio 4 ───────────────────────────────────────────────────────────────────────────
  ej4: {
    nombre: { es: 'Inventa una', en: 'Make one up' },
    detalle: { es: 'Escribe una ecuación con esa solución', en: 'Write an equation with that solution' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Ahora al revés: te dan la solución y <strong>tú inventas la ecuación</strong>. Elige una operación con ${x_}, calcula cuánto da con la solución, y eso es el segundo miembro.</p>
        <p>Ejemplo: solución ${x_} = 5. Elijo 3${x_} + 2. Con ${x_} = 5 da ${c('3 · 5 + 2 = 17')}. La ecuación es 3${x_} + 2 = 17.</p>
        <p>Escribe la ecuación entera, con el signo =, y pulsa <strong>Comprobar</strong>. Para el producto escribe 3x (sin signo).</p>`,
      en: `<h2>How it works</h2>
        <p>Now the other way round: you are given the solution and <strong>you make up the equation</strong>. Choose an operation with ${x_}, work out what it gives with the solution, and that is the right-hand side.</p>
        <p>Example: solution ${x_} = 5. I choose 3${x_} + 2. When ${x_} = 5 it gives ${c('3 · 5 + 2 = 17')}. The equation is 3${x_} + 2 = 17.</p>
        <p>Type the whole equation, with the = sign, and press <strong>Check</strong>. For the product type 3x (no sign).</p>`,
    },
    instruccion: bi((i, item) => {
      const base = i === 'es'
        ? `Escribe una ecuación cuya solución sea ${xIgual(item.s, i)}.`
        : `Write an equation whose solution is ${xIgual(item.s, i)}.`;
      const extra = item.requisito === 'coeficiente'
        ? (i === 'es' ? ' Que tenga un número delante de la x (como 3x).' : ' Put a number in front of the x (like 3x).')
        : '';
      return base + extra;
    }),
    correcto: bi((i, item, q) => {
      const k = comprobacion(q, item.s, i);
      return `${htmlDe0(q)} ${i === 'es' ? 'con' : 'when'} ${xIgual(item.s, i)}: ${k.texto}. ${i === 'es' ? 'Se cumple: vale.' : 'It works.'}`;
    }),
    /** (item, q, error) */
    por_que: bi((i, item, q, error) => {
      const k = comprobacion(q, item.s, i);
      if (error === 'solucion-distinta') {
        const sol = q.resolver();
        return i === 'es'
          ? `${htmlDe0(q)} con ${xIgual(item.s, i)}: ${k.texto}. Esa ecuación tiene por solución ${xIgual(sol, i)}, no ${xIgual(item.s, i)}. `
          : `${htmlDe0(q)} when ${xIgual(item.s, i)}: ${k.texto}. That equation has the solution ${xIgual(sol, i)}, not ${xIgual(item.s, i)}. `;
      }
      return i === 'es'
        ? `${htmlDe0(q)} no tiene una única solución: con ${xIgual(item.s, i)}, ${k.texto}. Hace falta que la ${x_} aparezca y que su valor cambie la igualdad. `
        : `${htmlDe0(q)} does not have a single solution: when ${xIgual(item.s, i)}, ${k.texto}. The ${x_} has to appear and its value has to change the equality. `;
    }),
    /** Un ejemplo bueno, para la solución. */
    ejemplo: bi((i, item) => {
      const e = ecuacionesConSolucion(item.s).find(o => o.a >= 2 && o.b > 0 && !o.delante);
      return i === 'es' ? `Por ejemplo: ${htmlDe(e)}. ` : `For example: ${htmlDe(e)}. `;
    }),
  },
};

const htmlDe0 = q => q.aHtml();

function explica3(item, idioma) {
  const q = ecuacion3(item);
  const [v1, v2] = item.valores;
  const k1 = comprobacion(q, v1, idioma), k2 = comprobacion(q, v2, idioma);
  const con = (v, k) => `${idioma === 'es' ? 'Con' : 'When'} ${xIgual(v, idioma)}: ${k.texto}.`;
  if (item.tipo === 'identidad') {
    return idioma === 'es'
      ? `${con(v1, k1)} ${con(v2, k2)} Coinciden siempre: es una identidad. `
      : `${con(v1, k1)} ${con(v2, k2)} They always match: it is an identity. `;
  }
  return idioma === 'es'
    ? `${con(v1, k1)} ${con(v2, k2)} Solo se cumple con ${xIgual(item.solucion, idioma)}: es una ecuación. `
    : `${con(v1, k1)} ${con(v2, k2)} It is true only when ${xIgual(item.solucion, idioma)}: it is an equation. `;
}

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const LA_RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const sinEspacioFinal = t => t.trim();

const REGLAS = {
  comprueba: {
    es: 'Sustituye la x por el número en cada miembro y calcula. Si los dos miembros valen lo mismo, es solución; si no, no.',
    en: 'Substitute the x by the number in each side and work it out. If both sides are equal, it is a solution; if not, it is not.',
  },
  queEcuacion: {
    es: 'Sustituye la x por ese valor en la ecuación buena y comprueba que los dos miembros valen lo mismo; en las otras no pasa.',
    en: 'Substitute the x by that value in the right equation and check that both sides are equal; in the others they are not.',
  },
  identidad: {
    es: 'Prueba con dos valores de x. Si los dos miembros coinciden siempre, es una identidad; si solo coinciden con uno, es una ecuación.',
    en: 'Try two values of x. If both sides always match, it is an identity; if they match for only one, it is an equation.',
  },
  inventa: {
    es: 'Elige una operación con la x, calcula cuánto da con la solución, y eso es el segundo miembro.',
    en: 'Choose an operation with the x, work out what it gives with the solution, and that is the right-hand side.',
  },
};

/** «No lo sé» del ejercicio 1: la sustitución en los dos miembros y el sí o el no. */
export function explicaComprueba(item, { idioma, tt }) {
  const k = comprobacion(ecuacionDe(item), item.v, idioma);
  return `${tt(REGLAS.comprueba)} ${k.texto}. ${tt(LA_RESPUESTA)} ${c(tt(item.esSolucion ? SI : NO))}.`;
}

/** «No lo sé» del ejercicio 2: la comprobación de la ecuación buena. */
export function explicaQueEcuacion(item, { idioma, tt }) {
  const b = item.opciones.find(o => o.correcta).e;
  return `${tt(REGLAS.queEcuacion)} ${htmlDe(b)}: ${comprobacion(ecuacionDe(b), item.s, idioma).texto}. ${tt(LA_RESPUESTA)} ${htmlDe(b)}.`;
}

/** «No lo sé» del ejercicio 3: los dos valores de prueba y lo que concluyen. */
export function explicaIdentidad(item, { idioma, tt }) {
  const respuesta = tt(item.tipo === 'identidad' ? { es: 'Identidad', en: 'Identity' } : { es: 'Ecuación', en: 'Equation' });
  return `${tt(REGLAS.identidad)} ${sinEspacioFinal(explica3(item, idioma))} ${tt(LA_RESPUESTA)} ${c(respuesta)}.`;
}

/** «No lo sé» del ejercicio 4: la regla y una ecuación buena, comprobada con la solución. */
export function explicaInventa(item, { idioma, tt }) {
  const e = ecuacionesConSolucion(item.s).find(o => o.a >= 2 && o.b > 0 && !o.delante);
  const k = comprobacion(ecuacionDe(e), item.s, idioma);
  const una = idioma === 'es' ? 'Una ecuación que sirve es' : 'An equation that works is';
  return `${tt(REGLAS.inventa)} ${idioma === 'es' ? 'Con' : 'When'} ${xIgual(item.s, idioma)}: ${k.texto}. ${una} ${htmlDe(e)}.`;
}
