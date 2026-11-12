// Práctica «Caza el error» de la unidad 6: textos de la interfaz. Los nombres de los errores salen de
// `ERRORES_TIPICOS` (algebra.js) y las explicaciones con números, de las plantillas de logica.js.
// Reglas: producto con «·», división «:», una sola letra (x), inglés sencillo, ni % ni x².

import { ERRORES_TIPICOS } from '../_comun/algebra.js';
import { aTexto as fracATexto, htmlFraccion } from '../_comun/fracciones.js';
import { htmlLinea, lineaBuena, lineasBuenas, porque, resultadoBueno } from './logica.js';

export const TX = {
  nombre: {
    donde: { es: '¿Dónde está el error?', en: 'Where is the mistake?' },
    que: { es: '¿Qué error es?', en: 'What went wrong?' },
    corrige: { es: 'Corrígelo', en: 'Fix it' },
  },
  detalle: {
    donde: { es: 'Una ecuación resuelta paso a paso: toca la línea mala, o «Todo está bien»', en: 'An equation solved step by step: tap the wrong line, or “All correct”' },
    que: { es: 'Una resolución con un error: elige cómo se llama', en: 'A solution with a mistake: choose its name' },
    corrige: { es: 'Una resolución con un error: escribe el valor de x bien', en: 'A solution with a mistake: write the right value of x' },
  },
  instruccion: {
    donde: { es: 'Toca la línea donde está el error. Si todo está bien, toca «Todo está bien».', en: 'Tap the line where the mistake is. If everything is right, tap “All correct”.' },
    que: { es: 'Hay un error. ¿Qué ha hecho mal el compañero?', en: 'There is a mistake. What did the student do wrong?' },
    corrige: { es: 'Hay un error. Escribe el valor de x bien.', en: 'There is a mistake. Write the right value of x.' },
  },
  introduccion: {
    donde: {
      es: `<p>Verás una ecuación que ha resuelto un compañero, con las líneas numeradas. A veces tiene un paso mal y a veces está todo bien.</p><p><strong>Ejemplo:</strong><br>1. 2x + 3 = 11<br>2. 2x = 11 + 3<br>3. 2x = 14<br>4. x = 7</p><p>El error está en la <strong>línea 2</strong>: el 3 suma, así que al pasar al otro lado cambia de signo y resta: 2x = 11 − 3 = 8, y x = 4.</p><p>Toca la línea mala. Si todo está bien, toca «Todo está bien». Ojo: hay varias formas de resolver una ecuación; si cada línea es igual que la anterior, no hay error.</p>`,
      en: `<p>You will see an equation solved by a student, with numbered lines. Sometimes one step is wrong and sometimes everything is right.</p><p><strong>Example:</strong><br>1. 2x + 3 = 11<br>2. 2x = 11 + 3<br>3. 2x = 14<br>4. x = 7</p><p>The mistake is in <strong>line 2</strong>: 3 is added, so it changes sign on the other side and it is subtracted: 2x = 11 − 3 = 8, and x = 4.</p><p>Tap the wrong line. If everything is right, tap “All correct”. Careful: there are several ways to solve an equation; if each line is equal to the one before, there is no mistake.</p>`,
    },
    que: {
      es: `<p>Verás una ecuación resuelta por un compañero con un error. Tienes que elegir <strong>cómo se llama el error</strong>.</p><p><strong>Ejemplo:</strong><br>1. 2x + 3 = 11<br>2. 2x = 11 + 3<br>3. 2x = 14<br>4. x = 7</p><p>El error se llama: <em>Ha pasado un término al otro miembro sin cambiarle el signo</em>.</p><p>Solo un nombre es verdadero; los otros son errores que el compañero no ha cometido.</p>`,
      en: `<p>You will see an equation solved by a student with a mistake. You have to choose <strong>the name of the mistake</strong>.</p><p><strong>Example:</strong><br>1. 2x + 3 = 11<br>2. 2x = 11 + 3<br>3. 2x = 14<br>4. x = 7</p><p>The mistake is called: <em>Moved a term to the other side without changing its sign</em>.</p><p>Only one name is true; the others are mistakes that the student did not make.</p>`,
    },
    corrige: {
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás una resolución con un error y escribirás el valor de x bien.</p><p><strong>Ejemplo:</strong><br>1. x + 9 = 4<br>2. x = 4 − 9<br>3. x = 5</p><p>Se ha perdido el signo: 4 − 9 = −5. Bien hecho: x = −5. Escribe −5.</p><p>Puedes escribir un número entero (−5) o una fracción (3/4).</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a solution with a mistake and you will write the right value of x.</p><p><strong>Example:</strong><br>1. x + 9 = 4<br>2. x = 4 − 9<br>3. x = 5</p><p>The sign was lost: 4 − 9 = −5. The right way: x = −5. Write −5.</p><p>You can write a whole number (−5) or a fraction (3/4).</p>`,
    },
  },
  todo_bien: { es: 'Todo está bien', en: 'All correct' },
  todo_bien_es: { es: 'Está todo bien: cada línea es igual que la anterior.', en: 'Everything is right: each line is equal to the one before.' },
  la_linea_es: { es: n => `El error está en la línea ${n}:`, en: n => `The mistake is in line ${n}:` },
  se_llama: { es: 'Se llama:', en: 'It is called:' },
  bien_es: { es: 'Bien hecho es:', en: 'The right way is:' },
  resultado_bien: { es: 'El valor de x bien es:', en: 'The right value of x is:' },
  has_escrito: { es: 'Has escrito', en: 'You wrote' },
  repite: { es: 'Es el mismo resultado equivocado.', en: 'That is the same wrong result.' },
  nombre_resultado: { es: 'Valor de x', en: 'Value of x' },
  en_blanco: { es: 'Escribe un número o una fracción', en: 'Write a number or a fraction' },
};

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────────────

export const nombreError = (id, tt) => tt(ERRORES_TIPICOS[id].nombre);
export const cuenta = html => `<span class="cuenta">${html}</span>`;
const linea = (l, idioma) => cuenta(htmlLinea(l, idioma));

/** La explicación: qué línea, cómo se llama, por qué y cómo se hace bien. */
export function explicacion(item, { tt, idioma }, { escrito = null, resultado = null } = {}) {
  if (item.falsa === null) return tt(TX.todo_bien_es);
  const tuyo = escrito !== null ? `${tt(TX.has_escrito)} ${cuenta(fracATexto(escrito))}. ` : '';
  const aviso = resultado?.error === 'repite-el-error' ? `${tt(TX.repite)} ` : '';
  return `${tuyo}${aviso}${tt(TX.la_linea_es)(item.falsa + 1)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}`
    + `<br>${porque(item, idioma)}`
    + `<br>${tt(TX.bien_es)} <span class="linea-mala">${linea(lineaBuena(item), idioma)}</span>`;
}

/** Ejercicio 1: ¿dónde está el error? */
export function explicaDonde(item, ctx) {
  const { tt } = ctx;
  const regla = tt({
    es: 'Mira las líneas de dos en dos: cada una tiene que salir de la anterior haciendo lo mismo a los dos lados (lo que suma pasa restando, lo que multiplica pasa dividiendo).',
    en: 'Look at the lines two at a time: each one must come from the one before by doing the same to both sides (what is added moves across as a subtraction, what multiplies moves across as a division).',
  });
  const consejo = item.falsa === null ? '' : ` ${tt({ es: 'Consejo: en caso de duda, rehaz tú el paso.', en: 'Tip: if you are not sure, do the step yourself.' })}`;
  return `${regla}<br>${sinDosSignos(explicacion(item, ctx))}${consejo}`;
}

// Revisión 191: el porqué de algunos errores (compartido con el feedback) escribe «−4 · −6»; en la tarjeta, «−4 · (−6)».
const sinDosSignos = html => html.replace(/· −(\d+)/g, '· (−$1)');

/** Ejercicio 2: ¿qué error es? */
export function explicaQue(item, ctx) {
  const regla = ctx.tt({
    es: 'Busca la línea que no sale de la anterior y piensa qué se ha hecho distinto de lo correcto: ese es el nombre del error.',
    en: 'Find the line that does not come from the one before and think what was done differently from the right way: that is the name of the mistake.',
  });
  return `${regla}<br>${sinDosSignos(explicacion(item, ctx))}`;
}

/** Ejercicio 3: corrígelo (la explicación acaba en el valor de x). */
export function explicaCorrige(item, ctx) {
  const { tt, idioma } = ctx;
  const regla = tt({
    es: 'Encuentra la línea mala, hazla bien y sigue desde ahí hasta dejar la x sola.',
    en: 'Find the wrong line, do it right and carry on from there until x is alone.',
  });
  // Revisión 191: se enseña cómo se sigue desde la línea buena (antes saltaba de ella a la respuesta),
  // y la solución con raya si es fracción.
  const despues = lineasBuenas(item).slice(item.falsa + 1).filter(l => !l.t);
  const sigue = despues.length
    ? `<br>${tt({ es: 'Desde ahí:', en: 'From there:' })} ${despues.map(l => linea(l, idioma)).join(' → ')}`
    : '';
  const fin = `${tt({ es: 'La respuesta es', en: 'The answer is' })} ${cuenta(`<i>x</i> = ${htmlFraccion(resultadoBueno(item))}`)}.`;
  return `${regla}<br>${sinDosSignos(explicacion(item, ctx))}${sigue}<br>${fin}`;
}
