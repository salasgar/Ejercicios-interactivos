// Práctica «El exponente y su base»: textos propios, siempre { es, en }.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): producto con «·»,
// nunca «×»; inglés sencillo; el feedback dice qué pasa con los números de
// ese ítem; sin letras ni ecuaciones (el hueco es «□»).

export const TX = {
  alcance: {
    nombre: { es: '¿A qué afecta el exponente?', en: 'What does the exponent apply to?' },
    detalle: { es: 'Toca la parte que se eleva', en: 'Tap the part that is raised to the power' },
    instruccion_una: { es: 'Toca la base del exponente: la parte que de verdad se eleva.', en: 'Tap the base of the exponent: the part that is really raised to the power.' },
    instruccion_dos: { es: 'Toca la base del exponente marcado.', en: 'Tap the base of the marked exponent.' },
    bien: {
      es: (c, e) => `Correcto: el exponente solo afecta a esa parte. <span class="cuenta">${c}</span>. Si afectara a otra, saldría otra cosa: <span class="cuenta">${e}</span>.`,
      en: (c, e) => `Correct: the exponent only applies to that part. <span class="cuenta">${c}</span>. If it applied to something else, you would get another result: <span class="cuenta">${e}</span>.`,
    },
    mal: {
      es: (c, e) => `El exponente solo afecta a la base que tiene justo delante (o a todo el paréntesis). Bien: <span class="cuenta">${c}</span>. Lo que has tocado daría: <span class="cuenta">${e}</span>.`,
      en: (c, e) => `The exponent only applies to the base right before it (or to the whole bracket). Right: <span class="cuenta">${c}</span>. What you tapped would give: <span class="cuenta">${e}</span>.`,
    },
  },
  repetida: {
    nombre: { es: 'Multiplicación repetida', en: 'Repeated multiplication' },
    detalle: { es: 'Construye la potencia con fichas y con los steppers', en: 'Build the power with tiles and with the steppers' },
    instruccion_construir: { es: n => `Escribe ${n} como producto, tocando las fichas en orden.`, en: n => `Write ${n} as a product, tapping the tiles in order.` },
    instruccion_deshacer: { es: 'Toca una ficha de la fila para quitarla.', en: 'Tap a tile in the row to remove it.' },
    bien: { es: (b, e, p) => `${b} elevado a ${e} es ${b} multiplicado por sí mismo ${e} veces: ${p}.`, en: (b, e, p) => `${b} to the power of ${e} is ${b} multiplied by itself ${e} times: ${p}.` },
    mal: { es: (p) => `Tiene que quedar: ${p}.`, en: (p) => `It should be: ${p}.` },
  },
  potencia: {
    nombre: { es: 'Del producto a la potencia', en: 'From the product to the power' },
    detalle: { es: 'Ajusta la base y el exponente', en: 'Adjust the base and the exponent' },
    instruccion: { es: 'Escribe este producto como una potencia: ajusta la base y el exponente.', en: 'Write this product as a power: adjust the base and the exponent.' },
    base: { es: 'Base', en: 'Base' },
    exponente: { es: 'Exponente', en: 'Exponent' },
    bien: { es: (b, e, p) => `${p} es ${b} multiplicado por sí mismo ${e} veces: ${b} elevado a ${e}.`, en: (b, e, p) => `${p} is ${b} multiplied by itself ${e} times: ${b} to the power of ${e}.` },
    mal: { es: (b, e, p) => `${p} es ${b} elevado a ${e}, no lo que has puesto.`, en: (b, e, p) => `${p} is ${b} to the power of ${e}, not what you entered.` },
  },
  valor: {
    nombre: { es: '¿Cuánto vale?', en: 'What is its value?' },
    detalle: { es: 'Elige el valor correcto de la potencia', en: 'Choose the correct value of the power' },
    pregunta: { es: (b, e) => `¿Cuánto vale ${b} elevado a ${e}?`, en: (b, e) => `What is ${b} to the power of ${e}?` },
    bien: { es: (b, e, p) => `${b} elevado a ${e} es ${b} multiplicado por sí mismo ${e} veces: ${p}.`, en: (b, e, p) => `${b} to the power of ${e} is ${b} multiplied by itself ${e} times: ${p}.` },
    mal: { es: (b, e, p) => `El valor correcto es ${p}: ${b} multiplicado por sí mismo ${e} veces.`, en: (b, e, p) => `The correct value is ${p}: ${b} multiplied by itself ${e} times.` },
  },
  areas: {
    nombre: { es: 'El cuadrado de la suma, con áreas', en: 'The square of a sum, with areas' },
    detalle: { es: 'Reparte el lado y compara las áreas', en: 'Split the side and compare the areas' },
    instruccion: { es: (a, b) => `El cuadrado tiene lado ${a} + ${b}. Repártelo y responde.`, en: (a, b) => `The square has side ${a} + ${b}. Split it and answer.` },
    pregunta1_suma: { es: (a, b) => `¿Cuánto vale (${a} + ${b}) elevado a 2?`, en: (a, b) => `What is (${a} + ${b}) to the power of 2?` },
    pregunta2_suma: { es: (a, b) => `¿Y ${a} al cuadrado + ${b} al cuadrado?`, en: (a, b) => `And ${a} squared + ${b} squared?` },
    pregunta1_prod: { es: (a, b) => `¿Cuánto vale (${a} · ${b}) elevado a 2?`, en: (a, b) => `What is (${a} · ${b}) to the power of 2?` },
    pregunta2_prod: { es: (a, b) => `¿Y ${a} al cuadrado · ${b} al cuadrado?`, en: (a, b) => `And ${a} squared · ${b} squared?` },
    bien_suma: {
      es: (a, b, ab) => `(${a} + ${b}) al cuadrado no es ${a} al cuadrado + ${b} al cuadrado: faltan los dos rectángulos de ${a} · ${b}, que valen ${2 * ab} en total.`,
      en: (a, b, ab) => `(${a} + ${b}) squared is not ${a} squared + ${b} squared: the two ${a} · ${b} rectangles are missing, worth ${2 * ab} in total.`,
    },
    bien_prod: {
      es: (a, b) => `Aquí sí vale lo mismo repartir el exponente: (${a} · ${b}) al cuadrado es ${a} al cuadrado · ${b} al cuadrado.`,
      en: (a, b) => `Here it does work to split the exponent: (${a} · ${b}) squared is ${a} squared · ${b} squared.`,
    },
    mal: {
      es: (p1, p2) => `Las respuestas correctas son ${p1} y ${p2}.`,
      en: (p1, p2) => `The correct answers are ${p1} and ${p2}.`,
    },
    mal_suma: {
      es: (a, b, p1, p2) => `Las respuestas correctas son ${p1} y ${p2}. Fíjate en el dibujo: (${a} + ${b}) al cuadrado = ${a * a} + ${a * b} + ${a * b} + ${b * b}, y ${a} al cuadrado + ${b} al cuadrado deja fuera los dos rectángulos de ${a} · ${b}.`,
      en: (a, b, p1, p2) => `The correct answers are ${p1} and ${p2}. Look at the picture: (${a} + ${b}) squared = ${a * a} + ${a * b} + ${a * b} + ${b * b}, and ${a} squared + ${b} squared leaves out the two ${a} · ${b} rectangles.`,
    },
  },
};
