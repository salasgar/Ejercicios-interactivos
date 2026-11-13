// Práctica «Distributiva con rectángulos»: textos propios, { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

import { fmt, igualdad, sumaDeProductos } from './logica.js';

// «1 celda», «2 celdas» / «1 cell», «2 cells».
const celdasEs = n => `${n} ${n === 1 ? 'celda' : 'celdas'}`;
const celdasEn = n => `${n} ${n === 1 ? 'cell' : 'cells'}`;

export const TX = {
  partir: {
    nombre: { es: 'Parte el rectángulo', en: 'Cut the rectangle' },
    detalle: { es: 'Arrastra el corte y calcula el total', en: 'Drag the cut and work out the total' },
    introduccion: {
      es: '<p>Un producto con un paréntesis es un rectángulo. Arrastra la raya hasta el sitio donde se parte el lado largo.</p>',
      en: '<p>A product with brackets is a rectangle. Drag the line to the place where the long side splits.</p>',
    },
    pregunta_suma: {
      es: (a, b, c) => `Parte el rectángulo de <strong>${a} · (${b} + ${c})</strong>.`,
      en: (a, b, c) => `Cut the rectangle of <strong>${a} · (${b} + ${c})</strong>.`,
    },
    pregunta_resta: {
      es: (a, b, c) => `Parte el rectángulo de <strong>${a} · (${b} − ${c})</strong>: el trozo de la derecha <strong>se quita</strong>.`,
      en: (a, b, c) => `Cut the rectangle of <strong>${a} · (${b} − ${c})</strong>: the piece on the right <strong>is taken away</strong>.`,
    },
    cortar: { es: 'Cortar aquí', en: 'Cut here' },
    izquierda: { es: 'Mover el corte a la izquierda', en: 'Move the cut left' },
    derecha: { es: 'Mover el corte a la derecha', en: 'Move the cut right' },
    corte_mal_suma: {
      es: (b, c) => `El corte va entre ${b} y ${c}: ${celdasEs(b)} a la izquierda y ${celdasEs(c)} a la derecha.`,
      en: (b, c) => `The cut goes between ${b} and ${c}: ${celdasEn(b)} on the left and ${celdasEn(c)} on the right.`,
    },
    corte_mal_resta: {
      es: (b, c, resto) => `El trozo que se quita tiene ${celdasEs(c)}; ${resto === 1 ? 'queda' : 'quedan'} ${b} − ${c} = ${celdasEs(resto)} a la izquierda.`,
      en: (b, c, resto) => `The piece taken away has ${celdasEn(c)}; ${b} − ${c} = ${celdasEn(resto)} ${resto === 1 ? 'is' : 'are'} left on the left.`,
    },
    corte_bien: { es: '¡Bien cortado!', en: 'Well cut!' },
    otro_orden: {
      es: (b, c) => `Aquí las dos partes están en el otro orden: ${c} + ${b}. Es la misma suma.`,
      en: (b, c) => `Here the two parts are in the other order: ${c} + ${b}. It is the same sum.`,
    },
    total_label: { es: 'Ahora escribe el total:', en: 'Now write the total:' },
    total_mal: {
      es: total => `El total es ${total}. Mira cada trozo por separado.`,
      en: total => `The total is ${total}. Look at each piece on its own.`,
    },
  },
  factor: {
    nombre: { es: 'Saca factor común', en: 'Take out the common factor' },
    detalle: { es: 'Junta dos rectángulos en uno', en: 'Join two rectangles into one' },
    introduccion: {
      es: '<p>Dos rectángulos con la misma altura se pueden juntar en uno. Escribe el producto con un paréntesis.</p>',
      en: '<p>Two rectangles with the same height can be joined into one. Write the product with brackets.</p>',
    },
    pregunta_juntar: {
      es: texto => `Junta los dos rectángulos: escribe ${texto} como <strong>un solo producto con paréntesis</strong>.`,
      en: texto => `Join the two rectangles: write ${texto} as <strong>one product with brackets</strong>.`,
    },
    pregunta_elegir: {
      es: texto => `¿Cuál es lo mismo que ${texto}?`,
      en: texto => `Which one is the same as ${texto}?`,
    },
    borrar: { es: 'Borrar', en: 'Delete' },
    vacio: { es: 'Toca las fichas', en: 'Tap the pieces' },
    es_igual: {
      es: (expr, texto, valor) => `${expr} = ${texto} = ${valor}: la altura común sale fuera del paréntesis.`,
      en: (expr, texto, valor) => `${expr} = ${texto} = ${valor}: the common height goes outside the brackets.`,
    },
    no_igual: {
      es: (expr, valor, otro) => `${expr} vale ${valor}, y tendría que valer ${otro}.`,
      en: (expr, valor, otro) => `${expr} is ${valor}, but it should be ${otro}.`,
    },
    tu_valor: {
      es: (expr, valor) => `Lo que has escrito, ${expr}, vale ${valor}.`,
      en: (expr, valor) => `What you wrote, ${expr}, is ${valor}.`,
    },
    mismo_valor: {
      es: (expr, valor) => `Lo que has escrito, ${expr}, también vale ${valor}, pero por casualidad: no junta los rectángulos en un solo producto con paréntesis.`,
      en: (expr, valor) => `What you wrote, ${expr}, is also ${valor}, but by chance: it does not join the rectangles into one product with brackets.`,
    },
    no_coincide: {
      es: expr => `Lo que has escrito, ${expr}, no da el mismo resultado: en una resta, el número mayor va delante.`,
      en: expr => `What you wrote, ${expr}, does not give the same result: in a subtraction, the bigger number comes first.`,
    },
    incompleta: {
      es: expr => `Lo que has escrito, ${expr}, no es una cuenta completa.`,
      en: expr => `What you wrote, ${expr}, is not a complete sum.`,
    },
    correcta: { es: 'Lo correcto es', en: 'The right answer is' },
  },
  compensar: {
    nombre: { es: 'Compensa con 99', en: 'Round to 100 and fix it' },
    detalle: { es: 'Multiplica y suma 99 o 98 en la cabeza', en: 'Multiply and add 99 or 98 in your head' },
    introduccion: {
      es: '<p>Multiplicar por 99 es multiplicar por 100 y quitar una vez el número. Sumar 99 es sumar 100 y quitar 1.</p>',
      en: '<p>Multiplying by 99 is multiplying by 100 and taking away the number once. Adding 99 is adding 100 and taking away 1.</p>',
    },
    pregunta: { es: texto => `Calcula ${texto}.`, en: texto => `Work out ${texto}.` },
    dibujo_filas: { es: n => `${n} filas`, en: n => `${n} rows` },
    dibujo_100: { es: k => `${k} columnas`, en: k => `${k} columns` },
    dibujo_resta: {
      es: (falta, n) => falta === 1 ? `1 columna que sobra (${n})` : `${falta} columnas que sobran (2 · ${n})`,
      en: (falta, n) => falta === 1 ? `1 extra column (${n})` : `${falta} extra columns (2 · ${n})`,
    },
    label: { es: 'Escribe el resultado:', en: 'Write the result:' },
    elige: { es: '¿Cuál es la <strong>escritura correcta</strong>?', en: 'Which is the <strong>correct way to write it</strong>?' },
    resultado_mal: {
      es: (texto, valor) => `${texto} = ${fmt(valor, 'es')}.`,
      en: (texto, valor) => `${texto} = ${fmt(valor, 'en')}.`,
    },
    explicacion_producto: {
      es: (n, k, falta, valor) => `${n} · ${k} = ${n} · 100 − ${falta === 1 ? n : `2 · ${n}`} = ${fmt(n * 100, 'es')} − ${falta * n} = ${fmt(valor, 'es')}: a ${n} filas de 100 se les quita ${falta === 1 ? 'una columna' : 'dos columnas'}.`,
      en: (n, k, falta, valor) => `${n} · ${k} = ${n} · 100 − ${falta === 1 ? n : `2 · ${n}`} = ${fmt(n * 100, 'en')} − ${falta * n} = ${fmt(valor, 'en')}: from ${n} rows of 100 we take away ${falta === 1 ? 'one column' : 'two columns'}.`,
    },
    explicacion_suma: {
      es: (n, k, falta, valor) => `${n} + ${k} = ${n} + 100 − ${falta} = ${n + 100} − ${falta} = ${valor}.`,
      en: (n, k, falta, valor) => `${n} + ${k} = ${n} + 100 − ${falta} = ${n + 100} − ${falta} = ${valor}.`,
    },
    escritura_mal: {
      es: (expr, valor, buena) => `${expr} vale ${fmt(valor, 'es')}, no ${fmt(buena, 'es')}.`,
      en: (expr, valor, buena) => `${expr} is ${fmt(valor, 'en')}, not ${fmt(buena, 'en')}.`,
    },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────

const RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const cuenta = s => `<span class="cuenta">${s}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;

/** Ejercicio 1: parte el rectángulo y calcula el total. */
export function explicaPartir(item, { tt }) {
  const { a, b, c, resta, largo, corte, solucion } = item;
  const corta = resta
    ? { es: `El lado largo mide ${largo} celdas. Se corta tras la celda ${corte}: el trozo de la derecha (${c} celdas) se quita.`,
        en: `The long side is ${largo} cells. Cut after cell ${corte}: the piece on the right (${c} cells) is taken away.` }
    : { es: `El lado largo mide ${largo} celdas: ${b} + ${c}. Se corta tras la celda ${corte}.`,
        en: `The long side is ${largo} cells: ${b} + ${c}. Cut after cell ${corte}.` };
  const calcula = { es: `Cada trozo es un rectángulo de ${a} filas: ${cuenta(igualdad(item))}.`, en: `Each piece is a rectangle with ${a} rows: ${cuenta(igualdad(item))}.` };
  return `${pasos([tt(corta), tt(calcula)])}${tt(RESPUESTA)} ${cuenta(solucion)}.`;
}

/** Ejercicio 2: junta los rectángulos (o elige la expresión) sacando el factor común. */
export function explicaFactor(item, { tt }) {
  const { a, b, c, resta, valor } = item;
  const op = resta ? '−' : '+';
  const juntos = `${a} · (${b} ${op} ${c})`;
  const sacar = {
    es: `En ${sumaDeProductos(item)} el ${a} se repite: es la altura de los dos rectángulos. Se escribe una vez, fuera del paréntesis, y dentro van las dos anchuras: ${b} ${op} ${c}.`,
    en: `In ${sumaDeProductos(item)} the ${a} is repeated: it is the height of both rectangles. Write it once, outside the brackets, and put the two widths inside: ${b} ${op} ${c}.`,
  };
  const comprueba = {
    es: `Se comprueba: ${cuenta(`${juntos} = ${a} · ${resta ? b - c : b + c} = ${valor}`)}, lo mismo que ${sumaDeProductos(item)}.`,
    en: `Check: ${cuenta(`${juntos} = ${a} · ${resta ? b - c : b + c} = ${valor}`)}, the same as ${sumaDeProductos(item)}.`,
  };
  return `${pasos([tt(sacar), tt(comprueba)])}${tt(RESPUESTA)} ${cuenta(juntos)}.`;
}

/** Ejercicio 3: compensar con 99 o 98. */
export function explicaCompensar(item, { tt, idioma }) {
  const { tipo, n, k, falta, valor } = item;
  const regla = tipo === 'producto'
    ? { es: `${k} es 100 − ${falta}: se multiplica por 100 y se quita ${falta === 1 ? 'una vez' : 'dos veces'} el ${n}.`, en: `${k} is 100 − ${falta}: multiply by 100 and take away ${n} ${falta === 1 ? 'once' : 'twice'}.` }
    : { es: `${k} es 100 − ${falta}: se suma 100 y se quita ${falta}.`, en: `${k} is 100 − ${falta}: add 100 and take away ${falta}.` };
  const x = TX.compensar;
  const cuentaTxt = (tipo === 'producto' ? x.explicacion_producto : x.explicacion_suma);
  return `${tt(regla)} ${tt(cuentaTxt)(n, k, falta, valor)} ${tt(RESPUESTA)} ${cuenta(fmt(valor, idioma))}.`;
}
