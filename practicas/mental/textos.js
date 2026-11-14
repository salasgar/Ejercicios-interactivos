// Práctica «Cálculo mental con estrategia»: textos propios, { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

import { lineaDescomponer } from './logica.js';

export const TX = {
  compensar: {
    nombre: { es: 'Compensar', en: 'Compensate' },
    detalle: { es: 'Redondea a 100 y ajusta', en: 'Round to 100 and adjust' },
    introduccion: {
      es: '<p>Para sumar o multiplicar por 99 es más fácil usar 100 y arreglar la diferencia después.</p>',
      en: '<p>To add or multiply by 99, it is easier to use 100 and fix the difference afterwards.</p>',
    },
    pregunta: { es: texto => `Calcula ${texto} con una estrategia.`, en: texto => `Work out ${texto} using a strategy.` },
    paso_redondeo: {
      es: k => `Paso 1. Redondea ${k} <strong>a la centena más cercana</strong>:`,
      en: k => `Step 1. Round ${k} <strong>to the nearest hundred</strong>:`,
    },
    paso_ajuste: { es: 'Paso 2. ¿Qué ajuste hay que hacer?', en: 'Step 2. What adjustment do you need?' },
    paso_resultado: { es: 'Paso 3. Escribe el resultado:', en: 'Step 3. Write the result:' },
    redondeo_mal: {
      es: (k, R) => `${k} está más cerca de ${R}: ${R} es la centena más cercana.`,
      en: (k, R) => `${k} is closer to ${R}: ${R} is the nearest hundred.`,
    },
    ajuste_mal: {
      es: (expr, valor, buena) => `${expr} vale ${valor}, no ${buena}.`,
      en: (expr, valor, buena) => `${expr} is ${valor}, not ${buena}.`,
    },
    explicacion_suma: {
      es: (n, k, R, falta, valor) => `${n} + ${k} = ${n} + ${R} − ${falta} = ${n + R} − ${falta} = ${valor}: se suma ${falta} de más, así que se quita.`,
      en: (n, k, R, falta, valor) => `${n} + ${k} = ${n} + ${R} − ${falta} = ${n + R} − ${falta} = ${valor}: we added ${falta} too much, so we take it away.`,
    },
    explicacion_producto: {
      es: (n, k, R, falta, valor) => `${n} · ${k} = ${n} · ${R} − ${falta === 1 ? n : `${falta} · ${n}`} = ${n * R} − ${falta * n} = ${valor}: sobra${falta === 1 ? ' una vez' : 'n dos veces'} el ${n}, no el ${falta}.`,
      en: (n, k, R, falta, valor) => `${n} · ${k} = ${n} · ${R} − ${falta === 1 ? n : `${falta} · ${n}`} = ${n * R} − ${falta * n} = ${valor}: we have ${falta === 1 ? `one ${n}` : `two ${n}s`} too many, not ${falta}.`,
    },
    resultado_mal: {
      es: valor => `El resultado es ${valor}.`,
      en: valor => `The result is ${valor}.`,
    },
  },
  descomponer: {
    nombre: { es: 'Descomponer', en: 'Break a number apart' },
    detalle: { es: 'Parte un factor para multiplicar fácil', en: 'Split a factor to multiply easily' },
    introduccion: {
      es: '<p>Si un factor se parte en otros números, a veces la cuenta sale en un momento: 25 · 4 = 100.</p>',
      en: '<p>If a factor is split into other numbers, the calculation can become quick: 25 · 4 = 100.</p>',
    },
    pregunta: { es: (a, b) => `Calcula ${a} · ${b}. Primero elige cómo partir el ${b}:`, en: (a, b) => `Work out ${a} · ${b}. First choose how to split ${b}:` },
    resultado: { es: 'Ahora escribe el resultado:', en: 'Now write the result:' },
    no_reconstruye: {
      es: (texto, valor, b) => `${texto} no es una forma de escribir ${b}: ${texto} = ${valor}.`,
      en: (texto, valor, b) => `${texto} is not a way to write ${b}: ${texto} = ${valor}.`,
    },
    cuenta_mal: { es: valor => `El resultado es ${valor}.`, en: valor => `The result is ${valor}.` },
    comoda: {
      es: (a, p, q, b) => `Esa suma también vale, pero ${p} · ${q} es más cómodo: ${a} · ${p} = ${a * p}.`,
      en: (a, p, q, b) => `That addition works too, but ${p} · ${q} is easier: ${a} · ${p} = ${a * p}.`,
    },
  },
};

const AYUDA = {
  // La regla dice QUÉ se quita: en la suma, lo que se ha sumado de más (1 o 2); en el producto,
  // las veces que sobra el otro factor (el n, no el 1): «corrige la diferencia» llevaba a restar 1.
  compensar_suma: {
    es: (k, R, falta) => `Suma ${R}, que es un número redondo, en vez de ${k}; así sumas ${falta} de más, y después lo quitas.`,
    en: (k, R, falta) => `Add ${R}, which is a round number, instead of ${k}; that adds ${falta} too much, so then take ${falta} away.`,
  },
  compensar_producto: {
    es: (n, k, R, falta) => `Multiplica por ${R}, que es un número redondo, en vez de por ${k}; así sobra${falta === 1 ? ' una vez' : 'n dos veces'} el ${n}, y después ${falta === 1 ? `restas ${n} (no 1)` : `restas 2 · ${n} (no 2)`}.`,
    en: (n, k, R, falta) => `Multiply by ${R}, which is a round number, instead of ${k}; that gives ${falta === 1 ? `one ${n}` : `two ${n}s`} too many, so then subtract ${falta === 1 ? `${n} (not 1)` : `2 · ${n} (not 2)`}.`,
  },
  descomponer: {
    es: (a, b, p, q) => `Parte el ${b} en ${p} · ${q}: así ${a} · ${p} da un número redondo y la cuenta sale rápido.`,
    en: (a, b, p, q) => `Split ${b} into ${p} · ${q}: then ${a} · ${p} is a round number and the calculation is quick.`,
  },
  respuesta: { es: 'La respuesta es', en: 'The answer is' },
};

/** «No lo sé» del ejercicio 1: redondear a la centena, ajustar y calcular. */
export function explicaCompensar(item, { tt }) {
  const { n, k, R, falta, valor } = item;
  let regla, cuenta;
  if (item.variante === 'producto') {
    regla = tt(AYUDA.compensar_producto)(n, k, R, falta);
    cuenta = `${n} · ${k} = ${n} · ${R} − ${falta === 1 ? n : `${falta} · ${n}`} = ${n * R} − ${falta * n} = ${valor}`;
  } else {
    regla = tt(AYUDA.compensar_suma)(k, R, falta);
    cuenta = `${n} + ${k} = ${n} + ${R} − ${falta} = ${n + R} − ${falta} = ${valor}`;
  }
  return `<p>${regla}</p><p><span class="cuenta">${cuenta}</span></p><p><strong>${tt(AYUDA.respuesta)} ${valor}.</strong></p>`;
}

/** «No lo sé» del ejercicio 2: partir el factor en un producto cómodo y calcular por pasos. */
export function explicaDescomponer(item, { tt }) {
  const op = item.opciones.find(o => o.correcta && o.clase === 'producto');
  const cuenta = lineaDescomponer(item, op).split(' = ').map(t => `<span class="cuenta">${t}</span>`).join(' = ');
  return `<p>${tt(AYUDA.descomponer)(item.a, item.b, item.p, item.q)}</p><p>${cuenta}</p><p><strong>${tt(AYUDA.respuesta)} ${item.valor}.</strong></p>`;
}
