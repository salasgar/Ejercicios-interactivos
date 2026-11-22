// Práctica «Caza el error» de la unidad 3: textos de la interfaz. Los nombres de los errores
// salen de `ERRORES_TIPICOS` (enteros.js) y las explicaciones con números, de las plantillas
// de logica.js. Reglas de contenido: producto con «·», división «:», sin letras, inglés sencillo.

export const TX = {
  nombre: {
    donde: { es: '¿Dónde está el error?', en: 'Where is the mistake?' },
    cual: { es: '¿Qué error es?', en: 'Which mistake is it?' },
    sino: { es: '¿Error o no?', en: 'Mistake or not?' },
  },
  detalle: {
    donde: { es: 'El mismo cálculo hecho de varias formas: toca el error de cada columna mala y di qué error es', en: 'The same calculation done in several ways: tap the mistake in each wrong column and say what it is' },
    cual: { es: 'Un cálculo con un error: elige cómo se llama', en: 'A calculation with a mistake: choose its name' },
    sino: { es: 'Un cálculo que puede estar bien o mal: ¿hay un error?', en: 'A calculation that may be right or wrong: is there a mistake?' },
  },
  instruccion: {
    donde: { es: 'Varios alumnos han hecho el mismo cálculo, cada uno en una columna. Algunas columnas tienen un error. Toca la línea del error en cada columna que esté mal y pulsa «Comprobar».', en: 'Some students did the same calculation, one in each column. Some columns have a mistake. Tap the wrong line in each column that has a mistake and press “Check”.' },
    cual: { es: 'Hay un error. ¿Qué error ha cometido?', en: 'There is a mistake. What mistake was made?' },
    sino: { es: 'Mira el cálculo. ¿Está bien o hay un error?', en: 'Look at the calculation. Is it right or is there a mistake?' },
  },
  introduccion: {
    donde: {
      es: '<p>Verás el mismo cálculo hecho por varios alumnos, cada uno en una columna. Unas columnas están bien y otras tienen <strong>un error</strong>; no se dice cuántas. Cada línea tiene que valer lo mismo que la anterior.</p><p><strong>Ejemplo:</strong> 5 − (3 − 7)<br>A: = 5 − 3 + 7 = 2 + 7 = 9<br>B: = 5 − 3 − 7 = 2 − 7 = −5<br>C: = 5 − (−4) = 5 + 4 = 9</p><p>A y C están bien: hay más de una forma de hacerlo. B está mal en «= 5 − 3 − 7»: el menos de delante del paréntesis cambia el signo de todo lo de dentro.</p><p>Toca la línea mala de cada columna que esté mal, deja sin tocar las que estén bien y pulsa «Comprobar». Después dirás qué error es.</p>',
      en: '<p>You will see the same calculation done by several students, one in each column. Some columns are right and some have <strong>a mistake</strong>; you are not told how many. Each line has to be worth the same as the line before.</p><p><strong>Example:</strong> 5 − (3 − 7)<br>A: = 5 − 3 + 7 = 2 + 7 = 9<br>B: = 5 − 3 − 7 = 2 − 7 = −5<br>C: = 5 − (−4) = 5 + 4 = 9</p><p>A and C are right: there is more than one way to do it. B is wrong in “= 5 − 3 − 7”: the minus in front of the brackets changes the sign of everything inside.</p><p>Tap the wrong line in each column that has a mistake, leave the right ones alone and press “Check”. Then you will say what the mistake is.</p>',
    },
    cual: {
      es: '<p>Ahora sabes dónde está el error; hay que ponerle <strong>nombre</strong>.</p><p><strong>Ejemplo:</strong> 5 − 2 = 3 y 7 − 9 = 2. En 7 − 9 el alumno ha restado bien (9 − 7 = 2), pero ha olvidado el signo menos del resultado: es −2.</p><p>Elige entre tres nombres: solo uno describe lo que ha hecho el alumno.</p>',
      en: '<p>Now you know where the mistake is; you have to <strong>name</strong> it.</p><p><strong>Example:</strong> 5 − 2 = 3 and 7 − 9 = 2. In 7 − 9 the student subtracted correctly (9 − 7 = 2), but forgot the minus sign of the result: it is −2.</p><p>Choose between three names: only one describes what the student did.</p>',
    },
    sino: {
      es: '<p>Hay cálculos con un error y cálculos <strong>sin ningún error</strong>. Ojo: hay cosas que parecen raras y no son un error. Por ejemplo, agrupar los positivos y los negativos en vez de ir de izquierda a derecha, o quitar un paréntesis en vez de operar dentro.</p><p><strong>Ejemplo:</strong> 2 − 9 + 4 = 6 − 9 = −3. Está bien: se han agrupado los positivos (2 + 4 = 6).</p>',
      en: '<p>Some calculations have a mistake and some have <strong>no mistake at all</strong>. Careful: some things look odd and are not a mistake. For example, grouping the positive and the negative numbers instead of going from left to right, or removing brackets instead of working inside them.</p><p><strong>Example:</strong> 2 − 9 + 4 = 6 − 9 = −3. It is right: the positive numbers were grouped (2 + 4 = 6).</p>',
    },
  },
  bien: { es: 'Está bien', en: 'It is right' },
  error: { es: 'Hay un error', en: 'There is a mistake' },
  esta_bien: { es: 'Está bien: no hay ningún error.', en: 'It is right: there is no mistake.' },
  la_linea_es: { es: 'El error está en esta línea:', en: 'The mistake is in this line:' },
  comprobar: { es: 'Comprobar', en: 'Check' },
  col_bien: { es: 'bien', en: 'right' },
  col_mal: { es: 'error', en: 'mistake' },
  columna: { es: 'Columna', en: 'Column' },
  pregunta_col: { es: l => `¿Qué error hay en la columna ${l}?`, en: l => `What is the mistake in column ${l}?` },
};

/** La regla que rompe cada error, en negrita en el feedback y en el «No lo sé» (JL, 22-11). */
export const REGLAS = {
  'regla-signos-en-suma': { es: 'La regla de los signos es para multiplicar y dividir, no para sumar: dos negativos que se suman dan un negativo.', en: 'The rule of signs is for multiplying and dividing, not for adding: two negative numbers added together give a negative number.' },
  'suma-valores-absolutos': { es: 'Con signos distintos, se restan los valores absolutos y se pone el signo del de mayor valor absoluto.', en: 'With different signs, subtract the absolute values and keep the sign of the one with the greater absolute value.' },
  'olvida-el-signo': { es: 'El resultado lleva el signo del número de mayor valor absoluto.', en: 'The result has the sign of the number with the greater absolute value.' },
  'signo-del-primero': { es: 'El resultado lleva el signo del número de mayor valor absoluto, no el del primero.', en: 'The result has the sign of the number with the greater absolute value, not the sign of the first one.' },
  'restar-negativo': { es: 'Restar un número negativo es sumar su opuesto: − (−4) = + 4.', en: 'Subtracting a negative number is adding its opposite: − (−4) = + 4.' },
  'sumar-negativo': { es: 'Sumar un número negativo es restar: + (−4) = − 4.', en: 'Adding a negative number is subtracting: + (−4) = − 4.' },
  'opuesto-del-opuesto': { es: 'El opuesto de un número negativo es positivo: −(−4) = 4.', en: 'The opposite of a negative number is positive: −(−4) = 4.' },
  'menos-solo-al-primero': { es: 'Un menos delante de un paréntesis cambia el signo de todo lo que hay dentro.', en: 'A minus in front of brackets changes the sign of everything inside.' },
  'mismo-signo-dos-veces': { es: 'El menos de una resta se escribe una sola vez: primero el producto y después se resta.', en: 'The minus of a subtraction is written only once: first the product, then you subtract it.' },
  'signo-del-mayor-producto': { es: 'Al multiplicar, signos iguales dan positivo y signos distintos dan negativo.', en: 'When you multiply, equal signs give a positive number and different signs give a negative number.' },
  'signo-del-mayor-cociente': { es: 'Al dividir, signos iguales dan positivo y signos distintos dan negativo.', en: 'When you divide, equal signs give a positive number and different signs give a negative number.' },
  'potencia-par-negativa': { es: 'Un número negativo elevado a un exponente par da positivo.', en: 'A negative number to an even power gives a positive number.' },
  'potencia-impar-positiva': { es: 'Un número negativo elevado a un exponente impar da negativo.', en: 'A negative number to an odd power gives a negative number.' },
  'potencia-positiva-negativa': { es: 'Una potencia de base positiva siempre es positiva.', en: 'A power with a positive base is always positive.' },
  'base-por-exponente': { es: 'Una potencia es un producto de factores iguales: el exponente dice cuántas veces se multiplica la base.', en: 'A power is a product of equal factors: the exponent says how many times you multiply the base.' },
  'menos-en-la-base': { es: 'Sin paréntesis, el menos no forma parte de la base: primero la potencia y después el menos.', en: 'Without brackets, the minus is not part of the base: first the power, then the minus.' },
  'signos-antes-de-la-potencia': { es: 'Primero la potencia y después el signo de delante.', en: 'First the power, then the sign in front.' },
  'derecha-a-izquierda': { es: 'Las sumas y las restas se hacen de izquierda a derecha.', en: 'Additions and subtractions go from left to right.' },
  'sin-jerarquia': { es: 'La multiplicación y la división van antes que la suma y la resta.', en: 'Multiplication and division come before addition and subtraction.' },
};

// ─── Explicaciones (la explicación del ítem y el botón «No lo sé») ─────────────
//
// JL, 22-11: sin «Se llama:» ni números de línea. Con error: la línea (con ordinal, o citada en las columnas), el
// error como frase, la regla rota en negrita, la explicación con los números y lo correcto.

import { esc } from '../_comun/textos.js';
import { html as htmlEntero, ERRORES_TIPICOS } from '../_comun/enteros.js';
import { errorEnLinea, lineaN, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';
import { PLANTILLA_POR_ID, VALIDA_POR_ID, LETRAS, explicaColumna } from './logica.js';

/** Texto con números a HTML seguro, con los exponentes `2^3` como <sup>. */
export const texto = t => esc(t).replace(/\^(\d+)/g, '<sup>$1</sup>');
export const nombreError = (id, tt) => texto(tt(ERRORES_TIPICOS[id].nombre));
/** El nombre del error como frase («Ha sumado los números aunque tienen signos distintos.»). */
const frase = (id, tt) => `${nombreError(id, tt)}.`;
const regla = (id, tt) => reglaEnNegrita(texto(tt(REGLAS[id])));
/** Una línea del cálculo: la primera tal cual y las demás con «= » delante. */
export const linea = (expr, i) => `${i ? '= ' : ''}${htmlEntero(expr)}`;
/** Una línea en columna, como en clase: «= 5 − 3 + 7 =» (la última, sin el «=» del final). */
export const lineaColumna = (expr, ultima) => `= ${htmlEntero(expr)}${ultima ? '' : ' ='}`;
export const enunciadoColumnas = item => `${htmlEntero(item.enunciado)} =`;
export const columnasDe = item => item.columnas.map((c, j) => ({
  letra: LETRAS[j], lineasHtml: c.lineas.slice(1).map((l, k, todas) => lineaColumna(l, k === todas.length - 1)),
}));

/** Ejercicios 2 y 3: dónde está el error, qué error es, la regla, por qué y cómo sería bien (o por qué no era error). */
export function explicacion(item, { tt, idioma }) {
  if (item.falsa === null) return texto(tt(VALIDA_POR_ID[item.plantilla].porque(item.params)));
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  return `${errorEnLinea(item.falsa, idioma)} <span class="linea-mala">${linea(item.lineas[item.falsa], item.falsa)}</span>`
    + `<br>${frase(item.error, tt)}${regla(item.error, tt)}${texto(tt(plantilla.porque(item.params)))}`
    + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">= ${htmlEntero(plantilla.corregida(item.params))}</span>`;
}

/** Ejercicio 1: columna a columna, si está bien (y por qué) o dónde está el error, cuál es, la regla y lo correcto. */
export function explicacionColumnas(item, { tt }) {
  return item.columnas.map((c, j) => {
    const { porque, corregida } = explicaColumna(c);
    const cabeza = `<strong>${tt(TX.columna)} ${LETRAS[j]}.</strong>`;
    if (!c.error) return `<p class="columna-explica">${cabeza} ${texto(tt(porque))}</p>`;
    return `<p class="columna-explica">${cabeza} ${tt(TX.la_linea_es)} <span class="linea-mala">= ${htmlEntero(c.lineas[c.falsa])}</span>`
      + `<br>${frase(c.error, tt)}${regla(c.error, tt)}${texto(tt(porque))}`
      + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">= ${htmlEntero(corregida)}</span></p>`;
  }).join('');
}

const REGLA = {
  donde: { es: 'Repasa cada columna línea a línea: cada línea tiene que valer lo mismo que la anterior. Una columna puede estar bien aunque lo haga de otra forma.', en: 'Check each column line by line: each line has to be worth the same as the line before. A column can be right even if it does it another way.' },
  cual: { es: 'Busca la línea que está mal y mira qué se ha hecho distinto de lo correcto: eso da el nombre del error.', en: 'Find the wrong line and see what was done differently from the right way: that gives the name of the mistake.' },
  sino: { es: 'Repite cada paso con sus números. Si alguna línea no cuadra, hay un error; si todas cuadran, está bien.', en: 'Repeat each step with its numbers. If a line does not fit, there is a mistake; if all of them fit, it is right.' },
};
const FIN = { es: 'La respuesta es', en: 'The answer is' };
const fin = (tt, respuesta) => `<br>${tt(FIN)} <strong>${respuesta}</strong>.`;

/**
 * Lo que dice la tarjeta en los ej. 2 y 3: la línea mala, por qué y cómo queda bien (o por qué no hay error).
 * Sin el nombre del error: en el ej. 2 es la respuesta del final (saldría dos veces) y en el 3 no se pregunta;
 * además, en −5 − 7 = 12 valen dos nombres del mismo grupo («regla de los signos» y «olvida el signo»).
 */
function cuerpo(item, tt) {
  if (item.falsa === null) return texto(tt(VALIDA_POR_ID[item.plantilla].porque(item.params)));
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  return `${tt(TX.la_linea_es)} <span class="linea-mala">${linea(item.lineas[item.falsa], item.falsa)}</span>`
    + `${regla(item.error, tt)}${texto(tt(plantilla.porque(item.params)))}`
    + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">= ${htmlEntero(plantilla.corregida(item.params))}</span>`;
}

/** Las columnas malas: «la columna B» / «las columnas B y D» (en inglés, «column B» / «columns B and D»). */
function columnasMalas(item, idioma) {
  const l = item.columnas.map((c, j) => (c.error ? LETRAS[j] : null)).filter(Boolean);
  const lista = l.length === 1 ? l[0] : `${l.slice(0, -1).join(', ')} ${idioma === 'en' ? 'and' : 'y'} ${l.at(-1)}`;
  return idioma === 'en' ? `${l.length > 1 ? 'columns' : 'column'} ${lista}` : `${l.length > 1 ? 'las columnas' : 'la columna'} ${lista}`;
}

export const explicaDonde = (item, { tt, idioma }) =>
  `${tt(REGLA.donde)}${explicacionColumnas(item, { tt })}${tt({ es: 'El error está en', en: 'The mistake is in' })} <strong>${columnasMalas(item, idioma)}</strong>.`;

/** La opción entre comillas: «…» en español y “…” en inglés. */
const cita = (tt, t) => tt({ es: `«${t}»`, en: `“${t}”` });

export const explicaCual = (item, { tt }) =>
  `${tt(REGLA.cual)}<br>${cuerpo(item, tt)}${fin(tt, cita(tt, nombreError(item.solucion, tt)))}`;

export const explicaSiNo = (item, { tt }) =>
  `${tt(REGLA.sino)}<br>${cuerpo(item, tt)}${fin(tt, cita(tt, tt(item.solucion === 'bien' ? TX.bien : TX.error)))}`;

export { lineaN };
