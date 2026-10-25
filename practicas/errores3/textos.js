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
    donde: { es: 'Un cálculo con un error: toca la línea donde está', en: 'A calculation with a mistake: tap the line where it is' },
    cual: { es: 'Un cálculo con un error: elige cómo se llama', en: 'A calculation with a mistake: choose its name' },
    sino: { es: 'Un cálculo que puede estar bien o mal: ¿hay un error?', en: 'A calculation that may be right or wrong: is there a mistake?' },
  },
  instruccion: {
    donde: { es: 'Hay un error en una línea. Toca la línea donde está.', en: 'There is a mistake in one line. Tap the line where it is.' },
    cual: { es: 'Hay un error. ¿Qué error ha cometido?', en: 'There is a mistake. What mistake was made?' },
    sino: { es: 'Mira el cálculo. ¿Está bien o hay un error?', en: 'Look at the calculation. Is it right or is there a mistake?' },
  },
  introduccion: {
    donde: {
      es: '<p>Cada ejercicio te enseña el cálculo de un alumno, con las líneas numeradas. Cada línea tiene que valer lo mismo que la anterior.</p><p><strong>Ejemplo:</strong><br>1. 6 + 4 · 2<br>2. = 10 · 2<br>3. = 20</p><p>El error está en la <strong>línea 2</strong>: el producto va antes que la suma. Lo bien hecho es 6 + 8 = 14.</p><p>Toca la línea donde está el error.</p>',
      en: '<p>Each exercise shows a student\'s calculation, with numbered lines. Each line has to be worth the same as the line before.</p><p><strong>Example:</strong><br>1. 6 + 4 · 2<br>2. = 10 · 2<br>3. = 20</p><p>The mistake is in <strong>line 2</strong>: multiplication comes before addition. The right way is 6 + 8 = 14.</p><p>Tap the line where the mistake is.</p>',
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
  la_linea_es: { es: n => `El error está en la línea ${n}:`, en: n => `The mistake is in line ${n}:` },
  correcta: { es: 'Bien hecho sería:', en: 'The right way is:' },
  se_llama: { es: 'Se llama:', en: 'It is called:' },
};
