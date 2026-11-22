// Práctica «Caza el error» de la unidad 7: textos de la interfaz. Los nombres de los errores salen de
// `ERRORES_TIPICOS` (proporcion.js) y las explicaciones con números, de las plantillas de logica.js.
// Reglas: producto con «·», división «:», inglés sencillo.

import { ERRORES_TIPICOS } from '../_comun/proporcion.js';
import { aTexto } from '../_comun/proporcion.js';
import { htmlLinea, lineaBuena, lineasBuenas, porque, resultadoBueno } from './logica.js';
import { errorEnLinea, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';

/** La regla que rompe cada error, en negrita en el feedback y en el «No lo sé» (JL, 22-11). */
export const REGLAS = {
  'razonar-sumando': { es: 'En una proporción directa, si una cantidad se multiplica por un número, la otra también: no se suma.', en: 'In direct proportion, if one amount is multiplied by a number, so is the other: you do not add.' },
  'porcentaje-entre-mil': { es: 'El tanto por ciento es entre 100: el 20 % es 20 : 100 = 0,2.', en: 'Per cent means divided by 100: 20% is 20 : 100 = 0.2.' },
  'porcentaje-entre-diez': { es: 'El tanto por ciento es entre 100: el 20 % es 20 : 100 = 0,2.', en: 'Per cent means divided by 100: 20% is 20 : 100 = 0.2.' },
  'dividir-entre-el-porcentaje': { es: 'Para calcular un porcentaje de una cantidad, se multiplica: el 20 % de 150 es 0,2 · 150.', en: 'To find a percentage of an amount, multiply: 20% of 150 is 0.2 · 150.' },
  'restar-el-porcentaje-como-numero': { es: 'Para aplicar un descuento, primero se calcula el porcentaje de la cantidad y después se resta.', en: 'To apply a discount, first find the percentage of the amount and then take it away.' },
  'descuento-por-precio-final': { es: 'Lo que se paga es el precio menos el descuento.', en: 'What you pay is the price minus the discount.' },
  'escala-sin-cambio-de-unidad': { es: 'Los dos números de una escala van en la misma unidad: luego hay que pasar a la que pide el problema.', en: 'Both numbers of a scale are in the same unit: then change to the unit the problem asks for.' },
};

export const TX = {
  nombre: {
    donde: { es: '¿Dónde está el error?', en: 'Where is the mistake?' },
    que: { es: '¿Qué error es?', en: 'What went wrong?' },
    corrige: { es: 'Corrígelo', en: 'Fix it' },
  },
  detalle: {
    donde: { es: 'Un problema resuelto paso a paso: toca la línea mala, o «Todo está bien»', en: 'A problem solved step by step: tap the wrong line, or “All correct”' },
    que: { es: 'Una resolución con un error: elige cómo se llama', en: 'A solution with a mistake: choose its name' },
    corrige: { es: 'Una resolución con un error: escribe el resultado bien', en: 'A solution with a mistake: write the right answer' },
  },
  instruccion: {
    donde: { es: 'Toca la línea donde está el error. Si todo está bien, toca «Todo está bien».', en: 'Tap the line where the mistake is. If everything is right, tap “All correct”.' },
    que: { es: 'Hay un error. ¿Qué ha hecho mal el compañero?', en: 'There is a mistake. What did the student do wrong?' },
    corrige: { es: 'Hay un error. Escribe el resultado bien.', en: 'There is a mistake. Write the right answer.' },
  },
  introduccion: {
    donde: {
      es: `<p>Verás un problema que ha resuelto un compañero, línea a línea. La primera es el enunciado. A veces tiene un paso mal y a veces está todo bien.</p><p><strong>Ejemplo:</strong><br>2 cuadernos cuestan 5,00 €. ¿Cuánto cuestan 4?<br>Son 2 cuadernos más, así que cuestan 2,00 € más.<br>5,00 € + 2,00 € = 7,00 €</p><p>El error está en la <strong>segunda línea</strong>: 4 cuadernos son el doble de 2, así que cuestan el doble: 2 · 5,00 € = 10,00 €. No se suma.</p><p>Toca la línea mala. Si todo está bien, toca «Todo está bien».</p>`,
      en: `<p>You will see a problem solved by a student, line by line. The first line is the question. Sometimes one step is wrong and sometimes everything is right.</p><p><strong>Example:</strong><br>2 notebooks cost €5.00. How much do 4 cost?<br>There are 2 more notebooks, so they cost €2.00 more.<br>€5.00 + €2.00 = €7.00</p><p>The mistake is in <strong>the second line</strong>: 4 notebooks are twice as many as 2, so they cost twice as much: 2 · €5.00 = €10.00. You do not add.</p><p>Tap the wrong line. If everything is right, tap “All correct”.</p>`,
    },
    que: {
      es: `<p>Verás un problema resuelto por un compañero con un error. Tienes que elegir <strong>cómo se llama el error</strong>.</p><p><strong>Ejemplo:</strong><br>El 5 % de 200 alumnos…<br>5 % = 5 : 10 = 0,5<br>0,5 · 200 = 100</p><p>El error es: <em>Ha dividido entre 10: el tanto por ciento es entre 100</em>.</p><p>Solo un nombre es verdadero; los otros son errores que el compañero no ha cometido.</p>`,
      en: `<p>You will see a problem solved by a student with a mistake. You have to choose <strong>the name of the mistake</strong>.</p><p><strong>Example:</strong><br>5% of 200 students…<br>5% = 5 : 10 = 0.5<br>0.5 · 200 = 100</p><p>The mistake is: <em>Divided by 10: per cent means divided by 100</em>.</p><p>Only one name is true; the others are mistakes that the student did not make.</p>`,
    },
    corrige: {
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás una resolución con un error y escribirás el resultado bien.</p><p><strong>Ejemplo:</strong><br>Un jersey cuesta 50,00 € y tiene un 20 % de descuento. ¿Cuánto se paga?<br>20 % de 50,00 € = 20,00 €<br>50,00 € − 20,00 € = 30,00 €</p><p>El 20 % de 50,00 € son 10,00 €, no 20,00 €. Bien hecho: 50,00 € − 10,00 € = 40,00 €. Escribe 40.</p><p>Escribe solo el número; la unidad ya está puesta.</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a solution with a mistake and you will write the right answer.</p><p><strong>Example:</strong><br>A jumper costs €50.00 and has a 20% discount. How much do you pay?<br>20% of €50.00 = €20.00<br>€50.00 − €20.00 = €30.00</p><p>20% of €50.00 is €10.00, not €20.00. The right way: €50.00 − €10.00 = €40.00. Write 40.</p><p>Write only the number; the unit is already there.</p>`,
    },
  },
  todo_bien: { es: 'Todo está bien', en: 'All correct' },
  todo_bien_es: { es: 'Está todo bien: cada línea sale de la anterior sin ningún fallo.', en: 'Everything is right: each line follows from the one before with no mistake.' },
  resultado_bien: { es: 'El resultado correcto es:', en: 'The right answer is:' },
  has_escrito: { es: 'Has escrito', en: 'You wrote' },
  repite: { es: 'Es el mismo resultado equivocado.', en: 'That is the same wrong result.' },
  nombre_resultado: { es: 'Resultado', en: 'Answer' },
  en_blanco: { es: 'Escribe un número', en: 'Write a number' },
};

export const nombreError = (id, tt) => tt(ERRORES_TIPICOS[id].nombre);
export const cuenta = html => `<span class="cuenta">${html}</span>`;
const linea = (l, idioma) => cuenta(htmlLinea(l, idioma));

/** El nombre del error como frase, sin «Se llama:» delante (JL, 22-11). */
const frase = (id, tt) => `${nombreError(id, tt)}.`;

/** La explicación: la línea con ordinal, qué error es, la regla rota en negrita, por qué y lo correcto (JL, 22-11). */
export function explicacion(item, { tt, idioma }, { escrito = null, resultado = null } = {}) {
  if (item.falsa === null) return tt(TX.todo_bien_es);
  const tuyo = escrito !== null ? `${tt(TX.has_escrito)} ${cuenta(aTexto(escrito, idioma))}. ` : '';
  const aviso = resultado?.error === 'repite-el-error' ? `${tt(TX.repite)} ` : '';
  return `${tuyo}${aviso}${errorEnLinea(item.falsa, idioma)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${frase(item.error, tt)}${reglaEnNegrita(tt(REGLAS[item.error]))}${porque(item, idioma)}`
    + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">${linea(lineaBuena(item), idioma)}</span>`;
}

/** Ejercicio 1: ¿dónde está el error? */
export function explicaDonde(item, ctx) {
  const regla = ctx.tt({
    es: 'Mira las líneas de una en una: cada una tiene que salir de la anterior con una cuenta bien hecha y con sentido para lo que pregunta el problema.',
    en: 'Look at the lines one at a time: each one must follow from the one before with a correct calculation that makes sense for what the problem asks.',
  });
  const consejo = item.falsa === null ? '' : ` ${ctx.tt({ es: 'Consejo: en caso de duda, rehaz tú la cuenta.', en: 'Tip: if you are not sure, do the calculation yourself.' })}`;
  return `${regla}<br>${explicacion(item, ctx)}${consejo}`;
}

/** Ejercicio 2: ¿qué error es? */
export function explicaQue(item, ctx) {
  const regla = ctx.tt({
    es: 'Busca la línea que no sale bien de la anterior y piensa qué se ha hecho distinto de lo correcto: ese es el nombre del error.',
    en: 'Find the line that does not follow correctly from the one before and think what was done differently from the right way: that is the name of the mistake.',
  });
  return `${regla}<br>${explicacion(item, ctx)}`;
}

/** Ejercicio 3: corrígelo (la explicación acaba en el resultado). */
export function explicaCorrige(item, ctx) {
  const { tt, idioma } = ctx;
  const regla = tt({
    es: 'Encuentra la línea mala, hazla bien y sigue desde ahí hasta el resultado.',
    en: 'Find the wrong line, do it right and carry on from there to the answer.',
  });
  const despues = lineasBuenas(item).slice(item.falsa + 1);
  const sigue = despues.length
    ? `<br>${tt({ es: 'Desde ahí:', en: 'From there:' })} ${despues.map(l => linea(l, idioma)).join(' → ')}`
    : '';
  const fin = `${tt({ es: 'La respuesta es', en: 'The answer is' })} ${cuenta(aTexto(resultadoBueno(item), idioma))}.`;
  return `${regla}<br>${explicacion(item, ctx)}${sigue}<br>${fin}`;
}
