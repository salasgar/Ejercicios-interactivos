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
};
