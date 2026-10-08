// Práctica «Cálculo mental con estrategia»: textos propios, { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

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
      es: k => `Paso 1. Redondea ${k} a la centena más cercana:`,
      en: k => `Step 1. Round ${k} to the nearest hundred:`,
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
  estrategia: {
    nombre: { es: '¿Qué conviene?', en: 'What is best?' },
    detalle: { es: 'Elige la estrategia para cada cuenta', en: 'Choose the strategy for each calculation' },
    introduccion: {
      es: '<p>Mira la cuenta y elige una estrategia que se pueda usar. Lápiz y papel siempre se puede, pero a veces hay un camino más corto.</p>',
      en: '<p>Look at the calculation and choose a strategy you can use. Pencil and paper always works, but sometimes there is a shorter way.</p>',
    },
    pregunta: { es: '¿Qué estrategia usas?', en: 'Which strategy do you use?' },
    boton: {
      compensar: { es: 'Compenso (redondeo a un número redondo y ajusto)', en: 'Compensate (round to a round number and adjust)' },
      descomponer: { es: 'Descompongo un factor en producto', en: 'Split a factor into a product' },
      papel: { es: 'Lápiz y papel', en: 'Pencil and paper' },
      calculadora: { es: 'Calculadora', en: 'Calculator' },
    },
    no_compensar: {
      es: (a, b) => `En ${a} y ${b} ningún número está a una o dos unidades de una decena redonda: no hay nada que compensar.`,
      en: (a, b) => `In ${a} and ${b}, no number is one or two away from a round ten: there is nothing to compensate.`,
    },
    no_descomponer_suma: {
      es: (a, b) => `${a} + ${b} es una suma: no tiene factores que descomponer.`,
      en: (a, b) => `${a} + ${b} is an addition: it has no factors to split.`,
    },
    papel_con_atajo: {
      es: 'Sirve, pero había un atajo. Cuenta como una ayuda.',
      en: 'That works, but there was a shortcut. It counts as help.',
    },
    no_descomponer_primos: {
      es: (a, b) => `${a} y ${b} son primos: no se pueden partir en un producto.`,
      en: (a, b) => `${a} and ${b} are prime: they cannot be split into a product.`,
    },
    vale: { es: 'Sirve.', en: 'That works.' },
    mejor: {
      compensar: { es: 'La más corta es compensar:', en: 'The shortest is to compensate:' },
      descomponer: { es: 'La más corta es descomponer:', en: 'The shortest is to split a factor:' },
      papel: { es: 'Aquí lo normal es lápiz y papel.', en: 'Here pencil and paper is the usual way.' },
      calculadora: { es: 'Con números tan grandes, lápiz y papel o calculadora.', en: 'With such big numbers: pencil and paper or a calculator.' },
    },
    problemas: {
      suma_k: {
        es: (m, k) => `Un libro cuesta ${k} euros y un cuaderno cuesta ${m} euros. ¿Cuánto cuestan los dos?`,
        en: (m, k) => `A book costs ${k} euros and a notebook costs ${m} euros. How much do they cost together?`,
      },
      producto_k: {
        es: (n, k) => `Una entrada cuesta ${k} euros. Compran ${n} entradas. ¿Cuánto pagan?`,
        en: (n, k) => `A ticket costs ${k} euros. They buy ${n} tickets. How much do they pay?`,
      },
      cajas: {
        es: (a, b) => `Cada caja tiene ${a} caramelos. Hay ${b} cajas. ¿Cuántos caramelos hay?`,
        en: (a, b) => `Each box has ${a} sweets. There are ${b} boxes. How many sweets are there?`,
      },
      cromos: {
        es: (a, b) => `Ana tiene ${a} cromos y Pablo tiene ${b}. ¿Cuántos tienen entre los dos?`,
        en: (a, b) => `Ana has ${a} stickers and Pablo has ${b}. How many do they have together?`,
      },
      sillas: {
        es: (a, b) => `Hay ${a} filas con ${b} sillas en cada fila. ¿Cuántas sillas hay?`,
        en: (a, b) => `There are ${a} rows with ${b} chairs in each row. How many chairs are there?`,
      },
      arboles: {
        es: (a, b) => `Un campo tiene ${a} árboles y otro campo tiene ${b}. ¿Cuántos árboles hay en total?`,
        en: (a, b) => `One field has ${a} trees and another field has ${b}. How many trees are there in total?`,
      },
      piezas: {
        es: (a, b) => `Una fábrica hace ${a} piezas al día durante ${b} días. ¿Cuántas piezas hace?`,
        en: (a, b) => `A factory makes ${a} parts a day for ${b} days. How many parts does it make?`,
      },
    },
  },
};
