// Práctica «Caza el error» de la unidad 4: textos de la interfaz. Los nombres de los errores salen
// de `ERRORES_TIPICOS` (fracciones.js) y las explicaciones con números, de las plantillas de
// logica.js. Reglas: producto con «·», división «:», sin letras, inglés sencillo.

import { ERRORES_TIPICOS, fraccion, aTexto } from '../_comun/fracciones.js';
import { mcd, mcm } from '../_comun/aritmetica.js';
import { ex, PLANTILLA_POR_ID, COMPARACION_POR_ID, GRUPO_DE, relacionBuena, LETRAS, CUENTA, explicaColumna } from './logica.js';
import { LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────────
// La tarjeta va así: la regla de esa operación delante; la cuenta bien hecha, paso a paso, con los
// números del ítem (`pasosBien`); y la respuesta al final, con el nombre del error entre comillas
// (tal como sale en el botón). No reutiliza el feedback de acierto/fallo (`explicacionBienMal`…).

const REL = { '<': '&lt;', '>': '&gt;', '=': '=' };
const esComparacion = item => Boolean(COMPARACION_POR_ID[item.plantilla]);
const lineaAyuda = (expr, i) => `${i ? '= ' : ''}${ex(expr)}`;
const cuenta = html => `<span class="cuenta">${html}</span>`;
const unir = exprs => cuenta(exprs.map(ex).join(' = '));

/** La regla de la operación de una plantilla, en una frase (también va en negrita en el feedback). */
export function regla(id) {
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

// ─── Ejercicio 2 en columnas (JL, 22-11) ─────────────────────────────────────────────────────────────

const frase = (id, tt) => `${tt(ERRORES_TIPICOS[id].nombre)}.`;
/** Una línea en columna, como en clase: «= 6/9 =» (la última, sin el «=» del final). */
export const lineaColumna = (expr, ultima) => `= ${ex(expr)}${ultima ? '' : ' ='}`;
export const enunciadoColumnas = item => `${ex(item.enunciado)} =`;
export const columnasDe = item => item.columnas.map((c, j) => ({
  letra: LETRAS[j], lineasHtml: c.lineas.slice(1).map((l, k, todas) => lineaColumna(l, k === todas.length - 1)),
}));

/** Columna a columna: si está bien (y por qué) o dónde está el error, cuál es, la regla rota y lo correcto. */
export function explicacionColumnas(item, { tt }) {
  return item.columnas.map((c, j) => {
    const { porque, corregida } = explicaColumna(c);
    const cabeza = `<strong>${tt(TX.columna)} ${LETRAS[j]}.</strong>`;
    if (!c.error) return `<p class="columna-explica">${cabeza} ${tt(porque)}</p>`;
    // El fallo de cuenta no tiene nombre en el catálogo ni regla rota: solo la cuenta bien hecha (JL, 23-11).
    const que = c.error === CUENTA ? `${tt(TX.fallo_cuenta)}<br>` : `${frase(c.error, tt)}${reglaEnNegrita(tt(regla(c.error)))}`;
    return `<p class="columna-explica">${cabeza} ${tt(TX.la_linea_es)} <span class="linea-mala">${lineaAyuda(c.lineas[c.falsa], c.falsa)}</span>`
      + `<br>${que}${tt(porque)}`
      + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">${lineaAyuda(corregida, c.falsa)}</span></p>`;
  }).join('');
}

/** Las columnas malas: «la columna B» / «las columnas B y D» (en inglés, «column B» / «columns B and D»). */
function columnasMalas(item, idioma) {
  const l = item.columnas.map((c, j) => (c.error ? LETRAS[j] : null)).filter(Boolean);
  const lista = l.length === 1 ? l[0] : `${l.slice(0, -1).join(', ')} ${idioma === 'en' ? 'and' : 'y'} ${l.at(-1)}`;
  return idioma === 'en' ? `${l.length > 1 ? 'columns' : 'column'} ${lista}` : `${l.length > 1 ? 'las columnas' : 'la columna'} ${lista}`;
}

/** «No lo sé»: el consejo, todas las columnas explicadas y dónde está el error. */
export function explicaLinea(item, { idioma, tt }) {
  const consejo = { es: 'Repasa cada columna línea a línea: cada línea tiene que valer lo mismo que la anterior. Una columna puede estar bien aunque lo haga de otra forma.', en: 'Check each column line by line: each line has to be worth the same as the line before. A column can be right even if it does it another way.' };
  return `${tt(consejo)}${explicacionColumnas(item, { tt })}${tt({ es: 'El error está en', en: 'The mistake is in' })} <strong>${columnasMalas(item, idioma)}</strong>.`;
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
    linea: { es: 'El mismo cálculo hecho por varios alumnos: toca el error de cada columna mala y di qué error es', en: 'The same calculation done by several students: tap the mistake in each wrong column and say what it is' },
    arregla: { es: 'Una igualdad falsa: escribe el resultado bien, irreducible', en: 'A false equality: write the right result in lowest terms' },
  },
  instruccion: {
    bienmal: { es: '¿Es verdadera o falsa esta igualdad?', en: 'Is this equality true or false?' },
    bienmal_cmp: { es: '¿Es verdadera o falsa esta comparación?', en: 'Is this comparison true or false?' },
    nombre: { es: 'Es falsa. ¿Qué error ha cometido el compañero?', en: 'It is false. What mistake did the student make?' },
    linea: { es: 'Varios alumnos han hecho el mismo cálculo, cada uno en una columna. Algunas columnas tienen un error. Toca la línea del error en cada columna que esté mal y pulsa «Comprobar».', en: 'Some students did the same calculation, one in each column. Some columns have a mistake. Tap the wrong line in each column that has a mistake and press “Check”.' },
    arregla: { es: 'Esta igualdad es falsa. Escribe el resultado bien, como fracción irreducible.', en: 'This equality is false. Write the right result as a fraction in lowest terms.' },
    arregla_nat: { es: 'Esta igualdad es falsa. Escribe el resultado bien.', en: 'This equality is false. Write the right result.' },
  },
  introduccion: {
    bienmal: {
      es: `<p>Verás una igualdad con fracciones. A veces está bien y a veces tiene un error.</p><p><strong>Ejemplo:</strong> ${ex('1/2 + 1/3')} = ${ex('2/5')}. Es <strong>falsa</strong>: se han sumado los numeradores y también los denominadores. Bien hecho: ${ex('3/6 + 2/6')} = ${ex('5/6')}.</p><p>Si es falsa, elige después el nombre del error. Ojo: si el resultado es correcto, la igualdad es verdadera.</p>`,
      en: `<p>You will see an equality with fractions. Sometimes it is right and sometimes it has a mistake.</p><p><strong>Example:</strong> ${ex('1/2 + 1/3')} = ${ex('2/5')}. It is <strong>false</strong>: the numerators were added and the denominators too. The right way: ${ex('3/6 + 2/6')} = ${ex('5/6')}.</p><p>If it is false, then choose the name of the mistake. Careful: if the result is right, the equality is true.</p>`,
    },
    linea: {
      es: `<p>Verás el mismo cálculo hecho por varios alumnos, cada uno en una columna. Unas columnas están bien y otras tienen <strong>un error</strong>; no se dice cuántas. Cada línea tiene que valer lo mismo que la anterior.</p><p><strong>Ejemplo:</strong> ${ex('12/18')}<br>A: = ${ex('6/9')} = ${ex('2/3')}<br>B: = ${ex('6/18')} = ${ex('1/3')}<br>C: = ${ex('2/3')}</p><p>A y C están bien: hay más de una forma de hacerlo. B está mal en «= ${ex('6/18')}»: se ha dividido solo el numerador y la fracción ha cambiado.</p><p>Toca la línea mala de cada columna que esté mal, deja sin tocar las que estén bien y pulsa «Comprobar». Después dirás qué error es.</p>`,
      en: `<p>You will see the same calculation done by several students, one in each column. Some columns are right and some have <strong>a mistake</strong>; you are not told how many. Each line has to be worth the same as the line before.</p><p><strong>Example:</strong> ${ex('12/18')}<br>A: = ${ex('6/9')} = ${ex('2/3')}<br>B: = ${ex('6/18')} = ${ex('1/3')}<br>C: = ${ex('2/3')}</p><p>A and C are right: there is more than one way to do it. B is wrong at “= ${ex('6/18')}”: only the numerator was divided and the fraction changed.</p><p>Tap the wrong line in each column that is wrong, leave the right ones alone and press “Check”. Then you will say what the mistake is.</p>`,
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
  es_irreducible: { es: 'Es lo mismo, pero hay que simplificarla hasta la irreducible:', en: 'It is the same value, but it has to be simplified to lowest terms:' },
  tu_resultado: { es: 'Has escrito', en: 'You wrote' },
  repite: { es: 'Es el mismo resultado equivocado.', en: 'That is the same wrong result as in the equality.' },
  nombre_arriba: { es: 'Numerador', en: 'Numerator' },
  nombre_abajo: { es: 'Denominador', en: 'Denominator' },
  nombre_resultado: { es: 'Resultado', en: 'Result' },
  comprobar: { es: 'Comprobar', en: 'Check' },
  col_bien: { es: 'bien', en: 'right' },
  col_mal: { es: 'error', en: 'mistake' },
  columna: { es: 'Columna', en: 'Column' },
  la_linea_es: { es: 'La línea del error es', en: 'The line with the mistake is' },
  pregunta_col: { es: l => `¿Qué error hay en la columna ${l}?`, en: l => `What is the mistake in column ${l}?` },
  fallo_cuenta: { es: 'Se ha equivocado al hacer la cuenta.', en: 'Made a mistake in the calculation.' },
  verdadera_cmp: { es: 'La comparación bien hecha es:', en: 'The right comparison is:' },
};
