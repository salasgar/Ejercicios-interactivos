// Propiedades de las potencias y última cifra: textos propios, siempre { es, en }.
// Los exponentes llevan <sup>; el producto, «·»; la división, «:» en español y «÷» en inglés
// (el símbolo ya viene en la cadena que pinta practica.js).

import { efectivo, exponenteJunto, juntar, razonNoJunta, posicionEnCiclo } from './logica.js';

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
      es: (b, m, k, desarrollo, r) => `(${b}<sup>${m}</sup>)<sup>${k}</sup> = ${desarrollo} = ${b}<sup>${r}</sup>`,
      en: (b, m, k, desarrollo, r) => `(${b}<sup>${m}</sup>)<sup>${k}</sup> = ${desarrollo} = ${b}<sup>${r}</sup>`,
    },
    potencia_regla: {
      es: (m, k, r) => `Se multiplican los exponentes: ${m} · ${k} = ${r}.`,
      en: (m, k, r) => `Multiply the exponents: ${m} · ${k} = ${r}.`,
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
        <p>Primero rellena la tabla con la última cifra de cada potencia (calculando solo la última cifra de cada multiplicación). Después, di cuántas cifras tiene el patrón más corto que se repite y la cifra que se pide.</p>`,
      en: `<h2>Challenge: the last digit</h2>
        <p>What digit does <strong>7<sup>10</sup></strong> end in? You do not need to work it all out: the <strong>last digits</strong> of the powers of a base <strong>repeat</strong>.</p>
        <p>First fill in the table with the last digit of each power (working out only the last digit of each multiplication). Then say how many digits the shortest pattern that repeats has, and the digit you are asked for.</p>`,
    },
    pregunta: {
      es: (b, n) => `¿En qué cifra <strong>acaba ${b}<sup>${n}</sup></strong>?`,
      en: (b, n) => `What digit does <strong>${b}<sup>${n}</sup> end in</strong>?`,
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
      es: 'El patrón más corto que se repite tiene… cifras',
      en: 'The shortest pattern that repeats has… digits',
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
      es: L => `El patrón más corto tiene ${L} ${L === 1 ? 'cifra' : 'cifras'}.`,
      en: L => `The shortest pattern has ${L} ${L === 1 ? 'digit' : 'digits'}.`,
    },
    cifra_mal: {
      es: d => `La cifra es ${d}.`,
      en: d => `The digit is ${d}.`,
    },
  },
};

// ─── Cuentas y explicaciones (feedback y «No lo sé») ───────────────────────────

export const simbolo = (op, idioma) => (op === ':' && idioma === 'en' ? '÷' : op);

/** HTML de un término: b^e o (b^e)^k. */
export function pot(t) {
  const { base, exp, k = 1 } = t;
  return k > 1 ? `(${base}<sup>${exp}</sup>)<sup>${k}</sup>` : `${base}<sup>${exp}</sup>`;
}

/** Los términos con sus operadores como una cuenta que no se parte. */
export function cuentaDe(terminos, ops, idioma) {
  const trozos = terminos.map(pot);
  return `<span class="cuenta">${trozos.map((t, i) => (i ? `${simbolo(ops[i - 1], idioma)} ${t}` : t)).join(' ')}</span>`;
}

/** Una potencia desarrollada: 2 · 2 · 2 (solo si es corta). */
export const desarrollo = (base, exp) => Array(exp).fill(base).join(' · ');

/** Una cadena de igualdades que se parte por los «=» (cada tramo no se parte), para que quepa en 375 px. */
export const cadena = linea => linea.split(' = ').map(t => `<span class="cuenta">${t}</span>`).join(' = ');

/** Si es corto, la cuenta de los factores: (2 · 2 · 2) · (2 · 2 · 2 · 2) = 2 · 2 · 2 · 2 · 2 · 2 · 2. Texto que se parte donde haga falta. */
export function desarrolloJunto(base, ea, eb, suma, idioma) {
  if (ea + eb > 12) return '';
  const a = desarrollo(base, ea), b = desarrollo(base, eb);
  return suma
    ? ` (${a}) · (${b}) = ${desarrollo(base, ea + eb)}.`
    : ` (${a}) ${simbolo(':', idioma)} (${b}) = ${desarrollo(base, ea - eb)}.`;
}

/** La línea de explicación de juntar a · b (o a : b) con el exponente `bueno`, en el idioma que reciba. */
export function lineaJunta(a, b, op, bueno, { tt, idioma }) {
  const x = TX.juntar;
  const suma = op === '·';
  const ea = efectivo(a), eb = efectivo(b);
  const desarrolado = desarrolloJunto(a.base, ea, eb, suma, idioma);
  return suma
    ? `<span class="cuenta">${pot(a)} · ${pot(b)} = ${a.base}<sup>${bueno}</sup></span>: ${tt(x.suma)(ea, eb, bueno)}.${desarrolado}`
    : `<span class="cuenta">${pot(a)} ${simbolo(':', idioma)} ${pot(b)} = ${a.base}<sup>${bueno}</sup></span>: ${tt(x.resta)(ea, eb, bueno)}.${desarrolado}`;
}

/** La cuenta de una potencia de potencia o de una cadena; con `mio`, avisa si sumó en vez de multiplicar. */
export function cuentaPotencias(item, { tt, idioma }, mio = null) {
  const x = TX.potencia;
  const { terminos, operadores: ops, base, solucion: bueno } = item;
  if (item.tipo === 'potencia') {
    const { exp: m, k } = terminos[0];
    const des = Array(k).fill(`${base}<sup>${m}</sup>`).join(' · ');
    let html = `${cadena(tt(x.potencia_cuenta)(base, m, k, des, bueno))}. ${tt(x.potencia_regla)(m, k, bueno)}`;
    if (mio !== null && mio !== bueno && mio === m + k) html += ` ${tt(x.sumaste)(m, k)}`;
    return html;
  }
  // Cuenta de exponentes: 3 · 2 + 4 − 3 (los paréntesis se resuelven antes).
  const cuentaExp = terminos.map((t, i) => {
    const e = t.k > 1 ? `${t.exp} · ${t.k}` : `${t.exp}`;
    return i ? `${ops[i - 1] === '·' ? '+' : '−'} ${e}` : e;
  }).join(' ');
  const original = terminos.map((t, i) => (i ? `${simbolo(ops[i - 1], idioma)} ${pot(t)}` : pot(t))).join(' ');
  return cadena(tt(x.cadena_cuenta)(original, cuentaExp, bueno, base));
}

const AYUDA = {
  respuesta: { es: 'La respuesta es', en: 'The answer is' },
  juntar: {
    es: 'Con la misma base, en un producto se suman los exponentes y en un cociente se restan; las operaciones, de izquierda a derecha.',
    en: 'With the same base, in a product you add the exponents and in a quotient you subtract them; operations go from left to right.',
  },
  potencia: {
    es: 'Para escribir una sola potencia, mira primero si hay potencias de potencias.',
    en: 'To write a single power, first look for powers of powers.',
  },
  tabla: {
    es: (b, cifras) => `Últimas cifras de ${b}<sup>1</sup>, ${b}<sup>2</sup>, ${b}<sup>3</sup>…: ${cifras.join(', ')}.`,
    en: (b, cifras) => `Last digits of ${b}<sup>1</sup>, ${b}<sup>2</sup>, ${b}<sup>3</sup>…: ${cifras.join(', ')}.`,
  },
  ultima: {
    es: (b, n, d) => `${b}<sup>${n}</sup> acaba en ${d}`,
    en: (b, n, d) => `${b}<sup>${n}</sup> ends in ${d}`,
  },
};

/** «No lo sé» del ejercicio 1: se juntan las potencias de izquierda a derecha, con sus cuentas. */
export function explicaJuntar(item, ctx) {
  const { tt } = ctx;
  let terminos = item.terminos, ops = item.operadores;
  const lineas = [];
  for (;;) {
    const i = terminos.findIndex((_, j) => j < terminos.length - 1 && razonNoJunta(terminos, ops, j) === null);
    if (i < 0) break;
    const bueno = exponenteJunto(terminos, ops, i);
    lineas.push(lineaJunta(terminos[i], terminos[i + 1], ops[i], bueno, ctx));
    ({ terminos, ops } = juntar(terminos, ops, i, bueno));
  }
  const final = cuentaDe(terminos, ops, ctx.idioma);
  const nota = terminos.length > 1 ? ` ${tt(TX.juntar.ajena_nota)}` : '';
  return `<p>${tt(AYUDA.juntar)}</p><p>${lineas.join('<br>')}</p><p><strong>${tt(AYUDA.respuesta)} ${final}.</strong>${nota}</p>`;
}

/** «No lo sé» del ejercicio 2: la cuenta de los exponentes y la potencia resultante. */
export function explicaPotencias(item, ctx) {
  const { tt } = ctx;
  return `<p>${tt(AYUDA.potencia)}</p><p>${cuentaPotencias(item, ctx)}</p><p><strong>${tt(AYUDA.respuesta)} ${item.base}<sup>${item.solucion}</sup>.</strong></p>`;
}

/** «No lo sé» del ejercicio 3: la tabla de últimas cifras, el patrón y la cifra pedida. */
export function explicaUltima(item, { tt }) {
  const { base, exponente: n, ciclo: L, solucion: d } = item;
  const x = TX.ultima;
  let razon;
  if (L === 1) razon = tt(x.explica_uno)(base, n, d);
  else if (n % L === 0) razon = tt(x.explica_multiplo)(base, n, L, n / L, d);
  else razon = tt(x.explica_resto)(base, n, L, Math.floor(n / L), posicionEnCiclo(n, L), d);
  return `<p>${tt(AYUDA.tabla)(base, item.tabla)}</p><p>${razon}</p><p><strong>${tt(AYUDA.respuesta)}: ${tt(AYUDA.ultima)(base, n, d)}.</strong></p>`;
}
