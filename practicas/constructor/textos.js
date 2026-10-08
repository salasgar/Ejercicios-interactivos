// Constructor de números: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente…) llegan a `montar` en `api.t`. Los números ya vienen formateados desde practica.js.

/** Nombre de cada posición, de las unidades (0) hacia arriba. */
export const POSICION = [
  { es: 'unidades', en: 'units' },
  { es: 'decenas', en: 'tens' },
  { es: 'centenas', en: 'hundreds' },
  { es: 'millares', en: 'thousands' },
  { es: 'decenas de millar', en: 'ten thousands' },
];
/** Los mismos nombres con «las» en español, para las frases («está en las centenas»). */
export const EN_POSICION = [
  { es: 'las unidades', en: 'the units' },
  { es: 'las decenas', en: 'the tens' },
  { es: 'las centenas', en: 'the hundreds' },
  { es: 'los millares', en: 'the thousands' },
  { es: 'las decenas de millar', en: 'the ten thousands' },
];

export const TX = {
  construir: {
    nombre: { es: 'Construye el número', en: 'Build the number' },
    detalle: { es: 'Coloca las cifras para cumplir la consigna', en: 'Place the digits to match the instruction' },
    introduccion: {
      es: '<h2>Cómo se hace</h2><p>Tienes unas cifras y unas casillas con nombre. <strong>Toca una cifra</strong> y se coloca en la primera casilla libre; <strong>toca una casilla</strong> para quitar su cifra. Hay que usar todas las cifras. Un número no puede empezar por 0.</p>',
      en: '<h2>How it works</h2><p>You have some digits and some boxes with names. <strong>Tap a digit</strong> and it goes into the first free box; <strong>tap a box</strong> to take its digit out. Use all the digits. A number cannot start with 0.</p>',
    },
    consigna: {
      mayor: { es: 'Construye el número MAYOR posible.', en: 'Build the GREATEST number you can.' },
      menor: { es: 'Construye el número MENOR posible (no puede empezar por 0).', en: 'Build the SMALLEST number you can (it cannot start with 0).' },
      menor_par: { es: 'Construye el número PAR más pequeño posible.', en: 'Build the smallest EVEN number you can.' },
      mayor_impar: { es: 'Construye el número IMPAR más grande posible.', en: 'Build the greatest ODD number you can.' },
      cercano: { es: o => `Construye el número más cercano a ${o}.`, en: o => `Build the number closest to ${o}.` },
    },
    quitar: { es: 'Quitar', en: 'Remove' },
    // feedback: el número construido y el que tocaba, con la cifra que decide
    hecho: {
      es: (mio, buena) => `Has construido <span class="cuenta">${mio}</span>. El correcto es <span class="cuenta">${buena}</span>`,
      en: (mio, buena) => `You built <span class="cuenta">${mio}</span>. The right number is <span class="cuenta">${buena}</span>`,
    },
    bien: { es: buena => `<span class="cuenta">${buena}</span>`, en: buena => `<span class="cuenta">${buena}</span>` },
    por_que: {
      mayor: { es: () => ': las cifras de mayor a menor.', en: () => ': digits from greatest to smallest.' },
      menor: {
        es: (cero) => (cero ? ': las cifras de menor a mayor, pero el 0 no puede ir delante: va el menor que no es 0 y después el 0.' : ': las cifras de menor a mayor.'),
        en: (cero) => (cero ? ': digits from smallest to greatest, but 0 cannot go first: the smallest digit that is not 0 goes first, then the 0.' : ': digits from smallest to greatest.'),
      },
      menor_par: {
        es: ult => `: tiene que acabar en cifra par, y la mejor es el ${ult}; el resto, de menor a mayor.`,
        en: ult => `: it has to end in an even digit, and the best one is ${ult}; the other digits go from smallest to greatest.`,
      },
      mayor_impar: {
        es: ult => `: tiene que acabar en cifra impar, y la mejor es el ${ult}; el resto, de mayor a menor.`,
        en: ult => `: it has to end in an odd digit, and the best one is ${ult}; the other digits go from greatest to smallest.`,
      },
      cercano: {
        es: (obj, dist) => `: está a ${dist} de ${obj}, y ningún otro número con esas cifras está tan cerca.`,
        en: (obj, dist) => `: it is ${dist} away from ${obj}, and no other number with these digits is that close.`,
      },
    },
  },
  descomposicion: {
    nombre: { es: 'Valor de las cifras', en: 'Value of the digits' },
    detalle: { es: 'Descompón números y di cuánto vale cada cifra', en: 'Break numbers into parts and say what each digit is worth' },
    introduccion: {
      es: '<h2>Cómo se hace</h2><p>Una cifra vale más o menos según su <strong>posición</strong>: en 8 274, el 2 está en las centenas y vale <strong>200</strong>. Un número se descompone como suma de lo que vale cada cifra: 8 274 = 8 000 + 200 + 70 + 4. Ojo con los ceros: 5 032 = 5 000 + 30 + 2.</p>',
      en: '<h2>How it works</h2><p>A digit is worth more or less depending on its <strong>position</strong>: in 8,274, the 2 is in the hundreds and it is worth <strong>200</strong>. A number breaks into a sum of what each digit is worth: 8,274 = 8,000 + 200 + 70 + 4. Watch the zeros: 5,032 = 5,000 + 30 + 2.</p>',
    },
    a_suma_instr: {
      es: n => `Elige las fichas que forman ${n}: una por cada posición que no sea cero.`,
      en: n => `Choose the tiles that make ${n}: one for each position that is not zero.`,
    },
    tu_suma: { es: s => `Tu suma: ${s}`, en: s => `Your sum: ${s}` },
    a_suma_fb: {
      es: (n, partes) => `<span class="cuenta">${n} = ${partes}</span>: cada cifra se escribe con lo que vale en su posición.`,
      en: (n, partes) => `<span class="cuenta">${n} = ${partes}</span>: each digit is written with what it is worth in its position.`,
    },
    a_numero_instr: { es: 'Escribe el número que resulta.', en: 'Write the number you get.' },
    a_numero_fb: {
      es: (n, partes) => `<span class="cuenta">${partes} = ${n}</span>.`,
      en: (n, partes) => `<span class="cuenta">${partes} = ${n}</span>.`,
    },
    pegado: {
      es: (n, pegado) => ` Ojo con los ceros: ${pegado} no es ${n}. Una posición que no aparece en la suma vale 0, y ese 0 hay que escribirlo.`,
      en: (n, pegado) => ` Watch the zeros: ${pegado} is not ${n}. A position that is not in the sum is worth 0, and you have to write that 0.`,
    },
    valor_pregunta: { es: (c, n) => `¿Cuánto vale el ${c} en ${n}?`, en: (c, n) => `What is the ${c} worth in ${n}?` },
    valor_fb: {
      es: (n, c, pos, valor) => `En ${n} el ${c} está en ${EN_POSICION[pos].es}: <span class="cuenta">${c} ${POSICION[pos].es} = ${valor}</span>.`,
      en: (n, c, pos, valor) => `In ${n} the ${c} is in ${EN_POSICION[pos].en}: <span class="cuenta">${c} ${POSICION[pos].en} = ${valor}</span>.`,
    },
    posicion_pregunta: { es: (c, n) => `¿En qué posición está el ${c} de ${n}?`, en: (c, n) => `Which position is the ${c} in ${n} in?` },
    posicion_fb: {
      es: (n, c, pos) => `En ${n}, el ${c} está en ${EN_POSICION[pos].es}.`,
      en: (n, c, pos) => `In ${n}, the ${c} is in ${EN_POSICION[pos].en}.`,
    },
  },
  coma: {
    nombre: { es: 'Comas, puntos y palabras', en: 'Commas, points and words' },
    detalle: { es: 'Cómo se escribe un número en inglés y en español, y números en palabras', en: 'How a number is written in English and in Spanish, and numbers in words' },
    introduccion: {
      es: '<h2>Cómo se hace</h2><p><strong>En inglés</strong> la coma separa los grupos de tres cifras (12,500 = doce mil quinientos) y el punto es el decimal (12.5 = doce y medio). <strong>En español</strong> es al revés: punto o espacio entre los grupos (12.500, 12 500) y coma decimal (12,5). Además, tendrás que escribir con cifras números que te dicen con palabras.</p>',
      en: '<h2>How it works</h2><p><strong>In English</strong> the comma separates groups of three digits (12,500 = twelve thousand five hundred) and the point is the decimal (12.5 = twelve and a half). <strong>In Spanish</strong> it is the other way round: a point or a space between the groups (12.500, 12 500) and a decimal comma (12,5). You will also write numbers with digits when they are given in words.</p>',
    },
    pregunta: {
      en_es: { es: 'En inglés se escribe así. ¿Cómo se escribe el mismo número en español?', en: 'This is how it is written in English. How is the same number written in Spanish?' },
      es_en: { es: 'En español se escribe así. ¿Cómo se escribe el mismo número en inglés?', en: 'This is how it is written in Spanish. How is the same number written in English?' },
    },
    fb_miles: {
      en_es: {
        es: (dado, ok) => `En inglés la coma separa los grupos de tres cifras: <span class="cuenta">${dado}</span> (inglés) es <span class="cuenta">${ok}</span> en español.`,
        en: (dado, ok) => `In English the comma separates groups of three digits: <span class="cuenta">${dado}</span> (English) is <span class="cuenta">${ok}</span> in Spanish.`,
      },
      es_en: {
        es: (dado, ok) => `En español el punto (o el espacio) separa los grupos de tres cifras: <span class="cuenta">${dado}</span> es <span class="cuenta">${ok}</span> en inglés.`,
        en: (dado, ok) => `In Spanish the point (or the space) separates groups of three digits: <span class="cuenta">${dado}</span> is <span class="cuenta">${ok}</span> in English.`,
      },
    },
    fb_decimal: {
      en_es: {
        es: (dado, ok) => `En inglés el punto es el decimal: <span class="cuenta">${dado}</span> (inglés) es <span class="cuenta">${ok}</span> en español, con coma decimal.`,
        en: (dado, ok) => `In English the point is the decimal: <span class="cuenta">${dado}</span> (English) is <span class="cuenta">${ok}</span> in Spanish, with a decimal comma.`,
      },
      es_en: {
        es: (dado, ok) => `En español la coma es el decimal: <span class="cuenta">${dado}</span> es <span class="cuenta">${ok}</span> en inglés, con punto decimal.`,
        en: (dado, ok) => `In Spanish the comma is the decimal: <span class="cuenta">${dado}</span> is <span class="cuenta">${ok}</span> in English, with a decimal point.`,
      },
    },
    trampa: {
      es: (dado, otro) => ` Si lo leyeras con las reglas del otro idioma, ${dado} sería <span class="cuenta">${otro}</span>: otro número distinto.`,
      en: (dado, otro) => ` If you read it with the rules of the other language, ${dado} would be <span class="cuenta">${otro}</span>: a different number.`,
    },
    palabras_instr: { es: 'Escribe con cifras este número:', en: 'Write this number with digits:' },
    palabras_fb: {
      es: (n, grupos) => `<span class="cuenta">${n}</span>. Por grupos: ${grupos}. Un grupo del que no se dice nada se escribe 000.`,
      en: (n, grupos) => `<span class="cuenta">${n}</span>. By groups: ${grupos}. A group that is not said at all is written 000.`,
    },
    grupos_nombres: {
      es: (m, k, u) => `millones ${m} · millares ${k} · unidades ${u}`,
      en: (m, k, u) => `millions ${m} · thousands ${k} · units ${u}`,
    },
    falta: { es: 'Escribe el número.', en: 'Write the number.' },
  },
};
