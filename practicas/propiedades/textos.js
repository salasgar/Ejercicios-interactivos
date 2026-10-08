// Propiedades de las potencias y última cifra: textos propios, siempre { es, en }.
// Los exponentes llevan <sup>; el producto, «·»; la división, «:» en español y «÷» en inglés
// (el símbolo ya viene en la cadena que pinta practica.js).

export const TX = {
  juntar: {
    nombre: { es: 'Junta las potencias', en: 'Join the powers' },
    detalle: { es: 'Misma base: suma o resta los exponentes', en: 'Same base: add or subtract the exponents' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca <strong>dos potencias vecinas</strong> para juntarlas en una sola y elige su exponente con <strong>+</strong> y <strong>−</strong>.</p>
        <p>Por ejemplo: <strong>2<sup>3</sup> · 2<sup>4</sup> = 2<sup>7</sup></strong>. Sigue hasta que no puedas juntar más.</p>
        <p>Ojo: solo se juntan potencias que tienen <strong>la misma base</strong>, y las operaciones se hacen de izquierda a derecha.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap <strong>two neighbouring powers</strong> to join them into one and choose its exponent with <strong>+</strong> and <strong>−</strong>.</p>
        <p>For example: <strong>2<sup>3</sup> · 2<sup>4</sup> = 2<sup>7</sup></strong>. Keep going until you cannot join any more.</p>
        <p>Careful: you can only join powers with <strong>the same base</strong>, and operations are done from left to right.</p>`,
    },
    instruccion: {
      es: 'Toca dos potencias vecinas para juntarlas.',
      en: 'Tap two neighbouring powers to join them.',
    },
    primera: { es: 'Has tocado la primera. Toca la vecina.', en: 'You tapped the first one. Now tap its neighbour.' },
    bases: {
      es: (a, b) => `No se pueden juntar: ${a} y ${b} tienen bases distintas.`,
      en: (a, b) => `You cannot join them: ${a} and ${b} have different bases.`,
    },
    orden: {
      es: 'Las operaciones se hacen de izquierda a derecha: junta primero las de la izquierda.',
      en: 'Operations are done from left to right: join the ones on the left first.',
    },
    juntarlas: { es: 'Juntar', en: 'Join' },
    cancelar: { es: 'Cancelar', en: 'Cancel' },
    exponente: { es: 'Exponente', en: 'Exponent' },
    suma: {
      es: (a, b, c) => `se suman los exponentes: ${a} + ${b} = ${c}`,
      en: (a, b, c) => `add the exponents: ${a} + ${b} = ${c}`,
    },
    resta: {
      es: (a, b, c) => `se restan los exponentes: ${a} − ${b} = ${c}`,
      en: (a, b, c) => `subtract the exponents: ${a} − ${b} = ${c}`,
    },
    no_multiplica: {
      es: 'No se multiplican los exponentes: en un producto de la misma base se suman.',
      en: 'Do not multiply the exponents: in a product with the same base you add them.',
    },
    no_divide: {
      es: 'No se dividen los exponentes: en un cociente de la misma base se restan.',
      en: 'Do not divide the exponents: in a quotient with the same base you subtract them.',
    },
    correcta: { es: 'Lo correcto es', en: 'The right answer is' },
    en_total: { es: 'Queda', en: 'You get' },
    ajena_nota: {
      es: 'Las potencias de bases distintas no se juntan.',
      en: 'Powers with different bases cannot be joined.',
    },
  },
  potencia: {
    nombre: { es: 'Potencia de potencia y cadenas', en: 'Power of a power and chains' },
    detalle: { es: 'Multiplica exponentes, suma o resta: elige el exponente final', en: 'Multiply, add or subtract: choose the final exponent' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Escribe todo como <strong>una sola potencia</strong> eligiendo el exponente con <strong>+</strong> y <strong>−</strong>.</p>
        <p><strong>(2<sup>3</sup>)<sup>2</sup> = 2<sup>3 · 2</sup> = 2<sup>6</sup></strong>: en una potencia de una potencia se <strong>multiplican</strong> los exponentes.</p>
        <p>En una cadena, primero resuelve cada paréntesis y después suma o resta los exponentes de izquierda a derecha: <strong>5<sup>4</sup> · 5<sup>2</sup> : 5<sup>3</sup> = 5<sup>4 + 2 − 3</sup> = 5<sup>3</sup></strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Write everything as <strong>one single power</strong> by choosing the exponent with <strong>+</strong> and <strong>−</strong>.</p>
        <p><strong>(2<sup>3</sup>)<sup>2</sup> = 2<sup>3 · 2</sup> = 2<sup>6</sup></strong>: in a power of a power you <strong>multiply</strong> the exponents.</p>
        <p>In a chain, first work out each bracket, then add or subtract the exponents from left to right: <strong>5<sup>4</sup> · 5<sup>2</sup> : 5<sup>3</sup> = 5<sup>4 + 2 − 3</sup> = 5<sup>3</sup></strong>.</p>`,
    },
    instruccion_potencia: { es: 'Escribe como una sola potencia.', en: 'Write it as a single power.' },
    instruccion_cadena: { es: 'Escribe como una sola potencia.', en: 'Write it as a single power.' },
    exponente: { es: 'Exponente', en: 'Exponent' },
    comprobar: { es: 'Comprobar', en: 'Check' },
    potencia_cuenta: {
      es: (b, m, k, desarrollo, r) => `(${b}<sup>${m}</sup>)<sup>${k}</sup> = ${desarrollo} = ${b}<sup>${r}</sup>: se multiplican los exponentes, ${m} · ${k} = ${r}.`,
      en: (b, m, k, desarrollo, r) => `(${b}<sup>${m}</sup>)<sup>${k}</sup> = ${desarrollo} = ${b}<sup>${r}</sup>: multiply the exponents, ${m} · ${k} = ${r}.`,
    },
    sumaste: {
      es: (m, k) => `${m} + ${k} sería para un producto. Aquí hay una potencia de una potencia: se multiplican.`,
      en: (m, k) => `${m} + ${k} would be for a product. Here there is a power of a power: multiply.`,
    },
    cadena_cuenta: {
      es: (original, cuentaExp, r, b) => `${original} = ${b}<sup>${cuentaExp}</sup> = ${b}<sup>${r}</sup>.`,
      en: (original, cuentaExp, r, b) => `${original} = ${b}<sup>${cuentaExp}</sup> = ${b}<sup>${r}</sup>.`,
    },
    tu_respuesta: { es: 'Tu respuesta:', en: 'Your answer:' },
    no_da: { es: 'no coincide.', en: 'is not right.' },
  },
  ultima: {
    nombre: { es: '★ La última cifra', en: '★ The last digit' },
    detalle: { es: 'Reto: descubre el patrón de las últimas cifras', en: 'Challenge: find the pattern in the last digits' },
    introduccion: {
      es: `<h2>Reto: la última cifra</h2>
        <p>¿En qué cifra acaba <strong>7<sup>10</sup></strong>? No hace falta calcularlo entero: las <strong>últimas cifras</strong> de las potencias de una base <strong>se repiten</strong>.</p>
        <p>Primero rellena la tabla con la última cifra de cada potencia (calculando solo la última cifra de cada multiplicación). Después, di cada cuántas potencias se repite el patrón y la cifra que se pide.</p>`,
      en: `<h2>Challenge: the last digit</h2>
        <p>What digit does <strong>7<sup>10</sup></strong> end in? You do not need to work it all out: the <strong>last digits</strong> of the powers of a base <strong>repeat</strong>.</p>
        <p>First fill in the table with the last digit of each power (working out only the last digit of each multiplication). Then say how many powers the pattern takes to repeat and the digit you are asked for.</p>`,
    },
    pregunta: {
      es: (b, n) => `¿En qué cifra acaba ${b}<sup>${n}</sup>?`,
      en: (b, n) => `What digit does ${b}<sup>${n}</sup> end in?`,
    },
    tabla_titulo: {
      es: 'Rellena la última cifra de cada potencia',
      en: 'Fill in the last digit of each power',
    },
    comprobar_tabla: { es: 'Comprobar la tabla', en: 'Check the table' },
    tabla_mal: {
      es: 'Alguna cifra no es correcta (en rojo). Multiplica la última cifra de la potencia anterior por la base y quédate con la última cifra.',
      en: 'Some digits are wrong (in red). Multiply the last digit of the previous power by the base and keep only the last digit.',
    },
    ciclo_pregunta: {
      es: 'El patrón se repite cada… potencias',
      en: 'The pattern repeats every… powers',
    },
    cifra_pregunta: {
      es: (b, n) => `Entonces ${b}<sup>${n}</sup> acaba en la cifra…`,
      en: (b, n) => `So ${b}<sup>${n}</sup> ends in the digit…`,
    },
    comprobar: { es: 'Comprobar', en: 'Check' },
    explica_uno: {
      es: (b, n, d) => `Las potencias de ${b} acaban siempre en ${d}: ${b}<sup>${n}</sup> acaba en ${d}.`,
      en: (b, n, d) => `Powers of ${b} always end in ${d}: ${b}<sup>${n}</sup> ends in ${d}.`,
    },
    explica_resto: {
      es: (b, n, L, q, r, d) => `El patrón se repite cada ${L}. ${n} = ${L} · ${q} + ${r}, así que ${b}<sup>${n}</sup> acaba como ${b}<sup>${r}</sup>: en ${d}.`,
      en: (b, n, L, q, r, d) => `The pattern repeats every ${L}. ${n} = ${L} · ${q} + ${r}, so ${b}<sup>${n}</sup> ends like ${b}<sup>${r}</sup>: in ${d}.`,
    },
    explica_multiplo: {
      es: (b, n, L, q, d) => `El patrón se repite cada ${L}. ${n} = ${L} · ${q} es múltiplo de ${L}, así que ${b}<sup>${n}</sup> acaba como ${b}<sup>${L}</sup>: en ${d}.`,
      en: (b, n, L, q, d) => `The pattern repeats every ${L}. ${n} = ${L} · ${q} is a multiple of ${L}, so ${b}<sup>${n}</sup> ends like ${b}<sup>${L}</sup>: in ${d}.`,
    },
    ciclo_mal: {
      es: L => `El ciclo es ${L}.`,
      en: L => `The cycle is ${L}.`,
    },
    cifra_mal: {
      es: d => `La cifra es ${d}.`,
      en: d => `The digit is ${d}.`,
    },
  },
};
