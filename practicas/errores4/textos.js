// Práctica «Caza el error» de la unidad 4: textos de la interfaz. Los nombres de los errores salen
// de `ERRORES_TIPICOS` (fracciones.js) y las explicaciones con números, de las plantillas de
// logica.js. Reglas: producto con «·», división «:», sin letras, inglés sencillo.

import { ex } from './logica.js';

export const TX = {
  nombre: {
    bienmal: { es: '¿Bien o mal?', en: 'Right or wrong?' },
    linea: { es: 'La línea mala', en: 'The wrong line' },
    arregla: { es: 'Arréglalo', en: 'Fix it' },
  },
  detalle: {
    bienmal: { es: 'Una igualdad: ¿es verdadera o falsa? Si es falsa, di qué error es', en: 'An equality: is it true or false? If it is false, name the mistake' },
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
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás una igualdad falsa y escribirás el resultado bien.</p><p><strong>Ejemplo:</strong> ${ex('2/3 : 4/5')} = ${ex('8/15')} es falsa (no se ha invertido la segunda fracción). Bien hecho: ${ex('2/3 · 5/4')} = ${ex('10/12')} = ${ex('5/6')}. Escribe 5 arriba y 6 abajo.</p><p>El resultado tiene que ser una fracción irreducible. Si es negativo, pulsa «+/−».</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a false equality and you will write the right result.</p><p><strong>Example:</strong> ${ex('2/3 : 4/5')} = ${ex('8/15')} is false (the second fraction was not turned upside down). The right way: ${ex('2/3 · 5/4')} = ${ex('10/12')} = ${ex('5/6')}. Write 5 on top and 6 on the bottom.</p><p>The result has to be a fraction in lowest terms. If it is negative, press «+/−».</p>`,
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
  repite: { es: 'Es el resultado del error de la igualdad.', en: 'That is the wrong result of the equality.' },
  nombre_arriba: { es: 'Numerador', en: 'Numerator' },
  nombre_abajo: { es: 'Denominador', en: 'Denominator' },
  nombre_resultado: { es: 'Resultado', en: 'Result' },
  verdadera_cmp: { es: 'La comparación bien hecha es:', en: 'The right comparison is:' },
};
