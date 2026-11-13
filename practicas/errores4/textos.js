// Práctica «Caza el error» de la unidad 4: textos de la interfaz. Los nombres de los errores salen
// de `ERRORES_TIPICOS` (fracciones.js) y las explicaciones con números, de las plantillas de
// logica.js. Reglas: producto con «·», división «:», sin letras, inglés sencillo.

import { ERRORES_TIPICOS, fraccion, aTexto } from '../_comun/fracciones.js';
import { mcd, mcm } from '../_comun/aritmetica.js';
import { ex, PLANTILLA_POR_ID, COMPARACION_POR_ID, GRUPO_DE, relacionBuena } from './logica.js';

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────────
// La tarjeta va así: la regla de esa operación delante; la cuenta bien hecha, paso a paso, con los
// números del ítem (`pasosBien`); y la respuesta al final, con el nombre del error entre comillas
// (tal como sale en el botón). No reutiliza el feedback de acierto/fallo (`explicacionBienMal`…).

const REL = { '<': '&lt;', '>': '&gt;', '=': '=' };
const esComparacion = item => Boolean(COMPARACION_POR_ID[item.plantilla]);
const lineaAyuda = (expr, i) => `${i ? '= ' : ''}${ex(expr)}`;
const cuenta = html => `<span class="cuenta">${html}</span>`;
const unir = exprs => cuenta(exprs.map(ex).join(' = '));

/** La regla de la operación de una plantilla, en una frase. */
function regla(id) {
  if (COMPARACION_POR_ID[id]) return { es: 'Para comparar dos fracciones, se ponen con el mismo denominador y se comparan los numeradores.', en: 'To compare two fractions, write them with the same denominator and compare the numerators.' };
  if (id === 'signo-perdido' || GRUPO_DE[id] === 'suma') return { es: 'Para sumar o restar fracciones, se ponen con el mismo denominador (el m.c.m.) y se suman o restan solo los numeradores.', en: 'To add or subtract fractions, write them with the same denominator (the LCM) and add or subtract only the numerators.' };
  if (GRUPO_DE[id] === 'simplificar') return { es: 'Para simplificar, se dividen el numerador y el denominador entre el mismo número; con su m.c.d., sale la irreducible de una vez.', en: 'To simplify, divide the numerator and the denominator by the same number; with their GCD you get lowest terms in one step.' };
  if (GRUPO_DE[id] === 'deCantidad') return { es: 'Para multiplicar una fracción por un número (la fracción de una cantidad), se divide entre el denominador y se multiplica por el numerador.', en: 'To multiply a fraction by a number (a fraction of an amount), divide by the denominator and multiply by the numerator.' };
  if (GRUPO_DE[id] === 'division') return { es: 'Para dividir, se multiplica la primera fracción por la inversa de la segunda.', en: 'To divide, multiply the first fraction by the reciprocal of the second one.' };
  return { es: 'Una potencia de una fracción se hace arriba y abajo: se elevan el numerador y el denominador.', en: 'A power of a fraction works on top and bottom: raise the numerator and the denominator.' };
}

/** La cuenta bien hecha de una plantilla (no de una comparación), paso a paso: [texto, …], el último es el resultado. */
export function pasosBien(id, params) {
  const p = PLANTILLA_POR_ID[id];
  const l0 = p.l0(params), bien = aTexto(p.bien(params));
  const conSimp = (pasos, ultimo) => (ultimo === bien ? pasos : [...pasos, bien]);   // aTexto no simplifica
  if (id === 'signo-perdido' || GRUPO_DE[id] === 'suma') {
    const [a, b, c, d] = params, m = mcm(b, d), A = a * (m / b), B = c * (m / d);
    const op = id === 'signo-perdido' ? '−' : '+';
    const res = aTexto(fraccion(op === '+' ? A + B : A - B, m));
    return conSimp([l0, `${A}/${m} ${op} ${B}/${m}`, res], res);
  }
  if (GRUPO_DE[id] === 'simplificar') return [l0, bien];
  if (GRUPO_DE[id] === 'deCantidad') {
    const [num, den, n] = params;
    return num === 1 ? [l0, `${n} : ${den}`, bien] : [l0, `${n} : ${den} · ${num}`, `${n / den} · ${num}`, bien];
  }
  if (GRUPO_DE[id] === 'division') {
    const [a, b, c, d] = params;
    const res = aTexto(fraccion(a * d, b * c));
    return conSimp([l0, `${a}/${b} · ${d}/${c}`, res], res);
  }
  return [l0, bien];
}

/** «La cuenta bien hecha» de un ítem (plantilla o comparación), en HTML y en un idioma, con su porqué corto. */
function bienHecha(item, es) {
  if (esComparacion(item)) {
    const [p, q, r, s] = item.params;
    const rel = REL[relacionBuena(item.params)];
    const fr2 = (n, d) => ex(aTexto(fraccion(n, d)));
    const ent = n => (n < 0 ? `−${-n}` : `${n}`);
    const m = mcm(q, s), A = p * (m / q), B = r * (m / s);
    // Con negativas, el numerador mayor es el que está más cerca del 0 (unidad 3).
    const cerca = p < 0 ? (es ? `, porque ${ent(Math.max(A, B))} está más cerca del 0` : `, because ${ent(Math.max(A, B))} is closer to 0`) : '';
    const nums = `${cuenta(`${ent(A)} ${rel} ${ent(B)}`)}${cerca}`;
    const final = cuenta(`${fr2(p, q)} ${rel} ${fr2(r, s)}`);
    if (q === s) return es ? `Ya tienen el mismo denominador: ${nums}, así que ${final}.` : `They already have the same denominator: ${nums}, so ${final}.`;
    const lista = `${cuenta(`${fr2(p, q)} = ${fr2(A, m)}`)} ${es ? 'y' : 'and'} ${cuenta(`${fr2(r, s)} = ${fr2(B, m)}`)}`;
    return es ? `Con denominador ${m}: ${lista}; ${nums}, así que ${final}.` : `With denominator ${m}: ${lista}; ${nums}, so ${final}.`;
  }
  const pasos = unir(pasosBien(item.plantilla, item.params));
  const [n, d] = item.params;
  const entre = GRUPO_DE[item.plantilla] === 'simplificar' ? (es ? `, dividiendo arriba y abajo entre ${mcd(n, d)}` : `, dividing top and bottom by ${mcd(n, d)}`) : '';
  return es ? `Bien hecha: ${pasos}${entre}.` : `Done right: ${pasos}${entre}.`;
}

const nombre = (item, es) => ERRORES_TIPICOS[item.error].nombre[es ? 'es' : 'en'];

/** Ejercicio 1: la regla, la cuenta (o la comparación) bien hecha y si es verdadera o falsa (y el error). */
export function explicaBienMal(item, { idioma, tt }) {
  const es = idioma === 'es';
  // Lo que dice el ítem cuando es falso: en una igualdad, su resultado; en una comparación, el signo.
  const dice = esComparacion(item) ? cuenta(`${ex(item.izq)} ${REL[item.rel]} ${ex(item.der)}`) : cuenta(ex(item.der));
  const fin = item.verdadera
    ? (es ? `Es justo lo que dice. La respuesta es «${TX.verdadera.es}».` : `That is exactly what it says. The answer is “${TX.verdadera.en}”.`)
    : (es ? `No es lo que dice (${dice}). La respuesta es «${TX.falsa.es}», y el error, «${nombre(item, es)}».`
      : `That is not what it says (${dice}). The answer is “${TX.falsa.en}”, and the mistake is “${nombre(item, es)}”.`);
  return `${tt(regla(item.plantilla))} ${bienHecha(item, es)} ${fin}`;
}

/** Ejercicio 2: la regla de las líneas, por qué cambia el valor la mala, cómo quedaba bien y cuál es. */
export function explicaLinea(item, { idioma, tt }) {
  const es = idioma === 'es';
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  const n = item.falsa + 1;
  const consejo = es ? 'Cada línea tiene que valer lo mismo que la anterior: la mala es la primera que cambia el valor.' : 'Each line has to be worth the same as the line before: the wrong one is the first that changes the value.';
  const bien = cuenta(lineaAyuda(plantilla.corregida(item.params), item.falsa));
  const linea = es ? `Bien hecha, la línea ${n} queda así: ${bien}.` : `Done right, line ${n} reads ${bien}.`;
  const fin = es ? `La respuesta es la línea ${n}.` : `The answer is line ${n}.`;
  return `${consejo} ${tt(plantilla.porque(item.params))} ${linea} ${fin}`;
}

/** Ejercicio 3: la regla, la cuenta bien hecha paso a paso, el error que había y el resultado irreducible. */
export function explicaArregla(item, { idioma, tt }) {
  const es = idioma === 'es';
  const bien = aTexto(fraccion(item.bien.num, item.bien.den));
  const error = es ? `El error era: «${nombre(item, es)}».` : `The mistake was: “${nombre(item, es)}”.`;
  const fin = es ? `La respuesta es ${cuenta(ex(bien))}.` : `The answer is ${cuenta(ex(bien))}.`;
  return `${tt(regla(item.plantilla))} ${bienHecha(item, es)} ${error} ${fin}`;
}

export const TX = {
  nombre: {
    bienmal: { es: '¿Bien o mal?', en: 'Right or wrong?' },
    linea: { es: 'La línea mala', en: 'The wrong line' },
    arregla: { es: 'Arréglalo', en: 'Fix it' },
  },
  detalle: {
    bienmal: { es: 'Una igualdad o una comparación: ¿es verdadera o falsa? Si es falsa, di qué error es', en: 'An equality or a comparison: is it true or false? If it is false, name the mistake' },
    linea: { es: 'Un cálculo con un solo paso mal: toca la línea mala', en: 'A calculation with one wrong step: tap the wrong line' },
    arregla: { es: 'Una igualdad falsa: escribe el resultado bien, irreducible', en: 'A false equality: write the right result in lowest terms' },
  },
  instruccion: {
    bienmal: { es: '¿Es verdadera o falsa esta igualdad?', en: 'Is this equality true or false?' },
    bienmal_cmp: { es: '¿Es verdadera o falsa esta comparación?', en: 'Is this comparison true or false?' },
    nombre: { es: 'Es falsa. ¿Qué error ha cometido el compañero?', en: 'It is false. What mistake did the student make?' },
    linea: { es: 'Hay un paso mal. Toca la línea donde está el error.', en: 'One step is wrong. Tap the line where the mistake is.' },
    arregla: { es: 'Esta igualdad es falsa. Escribe el resultado bien, como fracción irreducible.', en: 'This equality is false. Write the right result as a fraction in lowest terms.' },
    arregla_nat: { es: 'Esta igualdad es falsa. Escribe el resultado bien.', en: 'This equality is false. Write the right result.' },
  },
  introduccion: {
    bienmal: {
      es: `<p>Verás una igualdad con fracciones. A veces está bien y a veces tiene un error.</p><p><strong>Ejemplo:</strong> ${ex('1/2 + 1/3')} = ${ex('2/5')}. Es <strong>falsa</strong>: se han sumado los numeradores y también los denominadores. Bien hecho: ${ex('3/6 + 2/6')} = ${ex('5/6')}.</p><p>Si es falsa, elige después el nombre del error. Ojo: si el resultado es correcto, la igualdad es verdadera.</p>`,
      en: `<p>You will see an equality with fractions. Sometimes it is right and sometimes it has a mistake.</p><p><strong>Example:</strong> ${ex('1/2 + 1/3')} = ${ex('2/5')}. It is <strong>false</strong>: the numerators were added and the denominators too. The right way: ${ex('3/6 + 2/6')} = ${ex('5/6')}.</p><p>If it is false, then choose the name of the mistake. Careful: if the result is right, the equality is true.</p>`,
    },
    linea: {
      es: `<p>Verás el cálculo de un compañero, con las líneas numeradas. Cada línea tiene que valer lo mismo que la anterior. Una no.</p><p><strong>Ejemplo:</strong><br>1. ${ex('12/18')}<br>2. = ${ex('6/18')}<br>3. = ${ex('1/3')}</p><p>El error está en la <strong>línea 2</strong>: se ha dividido solo el numerador, y la fracción ha cambiado. Bien hecho: ${ex('6/9')}.</p><p>Toca la línea donde está el error.</p>`,
      en: `<p>You will see a student's calculation, with numbered lines. Each line has to be worth the same as the line before. One is not.</p><p><strong>Example:</strong><br>1. ${ex('12/18')}<br>2. = ${ex('6/18')}<br>3. = ${ex('1/3')}</p><p>The mistake is in <strong>line 2</strong>: only the numerator was divided, and the fraction changed. The right way: ${ex('6/9')}.</p><p>Tap the line where the mistake is.</p>`,
    },
    arregla: {
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás una igualdad falsa y escribirás el resultado bien.</p><p><strong>Ejemplo:</strong> ${ex('5/6 : 10/9')} = ${ex('25/27')} es falsa (no se ha invertido la segunda fracción). Bien hecho: ${ex('5/6 · 9/10')} = ${ex('45/60')} = ${ex('3/4')}. Escribe 3 arriba y 4 abajo.</p><p>El resultado tiene que ser una fracción irreducible. Si es negativo, pulsa «+/−».</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a false equality and you will write the right result.</p><p><strong>Example:</strong> ${ex('5/6 : 10/9')} = ${ex('25/27')} is false (the second fraction was not turned upside down). The right way: ${ex('5/6 · 9/10')} = ${ex('45/60')} = ${ex('3/4')}. Write 3 on top and 4 on the bottom.</p><p>The result has to be a fraction in lowest terms. If it is negative, press «+/−».</p>`,
    },
  },
  verdadera: { es: 'Verdadera', en: 'True' },
  falsa: { es: 'Falsa', en: 'False' },
  es_verdadera: { es: 'Es verdadera:', en: 'It is true:' },
  es_falsa: { es: 'Es falsa:', en: 'It is false:' },
  la_linea_es: { es: n => `El error está en la línea ${n}:`, en: n => `The mistake is in line ${n}:` },
  se_llama: { es: 'Se llama:', en: 'It is called:' },
  bien_es: { es: 'Bien hecho es:', en: 'The right way is:' },
  es_irreducible: { es: 'Es lo mismo, pero hay que simplificarla hasta la irreducible:', en: 'It is the same value, but it has to be simplified to lowest terms:' },
  tu_resultado: { es: 'Has escrito', en: 'You wrote' },
  repite: { es: 'Es el mismo resultado equivocado.', en: 'That is the same wrong result as in the equality.' },
  nombre_arriba: { es: 'Numerador', en: 'Numerator' },
  nombre_abajo: { es: 'Denominador', en: 'Denominator' },
  nombre_resultado: { es: 'Resultado', en: 'Result' },
  verdadera_cmp: { es: 'La comparación bien hecha es:', en: 'The right comparison is:' },
};
