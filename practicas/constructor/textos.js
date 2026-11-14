// Constructor de números: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente…) llegan a `montar` en `api.t`. Los números ya vienen formateados desde practica.js.

import { fmt, errorPegado, escribir, permutaciones } from './logica.js';

/** Nombre de cada posición, de las unidades (0) hacia arriba. */
export const POSICION = [
  { es: 'unidades', en: 'units' },
  { es: 'decenas', en: 'tens' },
  { es: 'centenas', en: 'hundreds' },
  { es: 'millares', en: 'thousands' },
  { es: 'decenas de millar', en: 'ten thousands' },
];
/** Los nombres en singular, para «1 centena = 100» (y no «1 centenas»). */
export const POSICION_UNO = [
  { es: 'unidad', en: 'unit' },
  { es: 'decena', en: 'ten' },
  { es: 'centena', en: 'hundred' },
  { es: 'millar', en: 'thousand' },
  { es: 'decena de millar', en: 'ten thousand' },
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
      mayor: { es: 'Construye el <strong>número MAYOR</strong> posible.', en: 'Build the <strong>GREATEST number</strong> you can.' },
      menor: { es: 'Construye el <strong>número MENOR</strong> posible (no puede empezar por 0).', en: 'Build the <strong>SMALLEST number</strong> you can (it cannot start with 0).' },
      menor_par: { es: 'Construye el número <strong>PAR más pequeño</strong> posible.', en: 'Build the <strong>smallest EVEN number</strong> you can.' },
      mayor_impar: { es: 'Construye el número <strong>IMPAR más grande</strong> posible.', en: 'Build the <strong>greatest ODD number</strong> you can.' },
      cercano: { es: o => `Construye el número <strong>más cercano a ${o}</strong>.`, en: o => `Build the number <strong>closest to ${o}</strong>.` },
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
      cercano: {
        es: (obj, dist) => `: está a ${dist} de ${obj}, y ningún otro número con esas cifras está tan cerca.`,
        en: (obj, dist) => `: it is ${dist} away from ${obj}, and no other number with these digits is that close.`,
      },
    },
    // Cómo se elige la última cifra (relevo de la revisión 193): la usan la tarjeta del «No lo sé» y el feedback (`explicaUltima`).
    ayuda_ultima: {
      menor_par: {
        es: (ult, cero) => `Tiene que acabar en cifra par. Al final se deja la par más grande, el ${ult}, para que las pequeñas vayan delante; el resto, de menor a mayor${cero ? ', pero el 0 no puede ir delante: va en segundo lugar' : ''}.`,
        en: (ult, cero) => `It has to end in an even digit. Leave the greatest even digit, ${ult}, for the end, so the small digits go first; the other digits go from smallest to greatest${cero ? ', but 0 cannot go first: it goes second' : ''}.`,
      },
      // Con el 0: dejar al final la par más grande puede obligar a poner delante una cifra más grande.
      menor_par_cero: {
        es: (mayorPar, conMayor, solucion) => `Tiene que acabar en cifra par. Con el ${mayorPar} al final saldría ${conMayor}, porque el 0 no puede ir delante; con el 0 al final, las demás van de menor a mayor y sale ${solucion}, que es menor.`,
        en: (mayorPar, conMayor, solucion) => `It has to end in an even digit. With ${mayorPar} at the end you would get ${conMayor}, because 0 cannot go first; with 0 at the end, the other digits go from smallest to greatest and you get ${solucion}, which is smaller.`,
      },
      mayor_impar: {
        es: ult => `Tiene que acabar en cifra impar. Al final se deja la impar más pequeña, el ${ult}, para que las grandes vayan delante; el resto, de mayor a menor.`,
        en: ult => `It has to end in an odd digit. Leave the smallest odd digit, ${ult}, for the end, so the big digits go first; the other digits go from greatest to smallest.`,
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
      es: (n, c, pos, valor) => `En ${n} el ${c} está en ${EN_POSICION[pos].es}: <span class="cuenta">${c} ${(c === 1 ? POSICION_UNO : POSICION)[pos].es} = ${valor}</span>.`,
      en: (n, c, pos, valor) => `In ${n} the ${c} is in ${EN_POSICION[pos].en}: <span class="cuenta">${c} ${(c === 1 ? POSICION_UNO : POSICION)[pos].en} = ${valor}</span>.`,
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
      en_es: { es: '<strong>En inglés</strong> se escribe así. ¿Cómo se escribe el mismo número <strong>en español</strong>?', en: 'This is how it is written <strong>in English</strong>. How is the same number written <strong>in Spanish</strong>?' },
      es_en: { es: '<strong>En español</strong> se escribe así. ¿Cómo se escribe el mismo número <strong>en inglés</strong>?', en: 'This is how it is written <strong>in Spanish</strong>. How is the same number written <strong>in English</strong>?' },
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
    trampa_decimal: {
      es: (es, en) => ` En español el punto no separa los decimales: los separa la coma (<span class="cuenta">${es}</span>). En inglés es al revés: <span class="cuenta">${en}</span>.`,
      en: (es, en) => ` In Spanish the decimal separator is a comma (<span class="cuenta">${es}</span>); in English it is a point: <span class="cuenta">${en}</span>.`,
    },
    malagrupado: {
      es: 'Ese número no está bien escrito: los grupos de tres cifras se separan con punto, coma o espacio (4.730), y sin decimales.',
      en: 'That number is not written correctly: groups of three digits are separated with a point, a comma or a space (4,730), and there are no decimals.',
    },
    palabras_instr: { es: 'Escribe con cifras este número:', en: 'Write this number with digits:' },
    palabras_fb: {
      es: (n, grupos) => `<span class="cuenta">${n}</span>. Por grupos: ${grupos}. Un grupo del que no se dice nada se escribe 000.`,
      en: (n, grupos) => `<span class="cuenta">${n}</span>. By groups: ${grupos}. A group that is not said at all is written 000.`,
    },
    grupos_nombres: {
      es: (m, k, u) => `millones ${m}; millares ${k}; unidades ${u}`,
      en: (m, k, u) => `millions ${m}; thousands ${k}; units ${u}`,
    },
    falta: { es: 'Escribe el número.', en: 'Write the number.' },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────

const RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const cuentaHtml = s => `<span class="cuenta">${s}</span>`;

const mayuscula = s => s[0].toUpperCase() + s.slice(1);

/**
 * «Más cercano a…»: el más cercano siempre es el más próximo por debajo o el más próximo por encima
 * (revisión 193: antes solo decía que «ningún otro está tan cerca», sin un método para el siguiente).
 */
function explicaCercano(item, { tt, idioma }) {
  const num = n => fmt(n, idioma);
  const todas = permutaciones(item.cifras);
  const debajo = todas.filter(n => n < item.objetivo);
  const encima = todas.filter(n => n > item.objetivo);
  const lado = (n, es) => (es
    ? `${cuentaHtml(num(n))} (está a ${num(Math.abs(n - item.objetivo))})`
    : `${cuentaHtml(num(n))} (${num(Math.abs(n - item.objetivo))} away)`);
  const o = num(item.objetivo);
  const c = item.cifras.join(', ');
  let caso;
  if (debajo.length && encima.length) {
    const d = Math.max(...debajo), e = Math.min(...encima);
    caso = {
      es: `Con las cifras ${c}, el más próximo por debajo de ${o} es ${lado(d, true)} y el más próximo por encima, ${lado(e, true)}.`,
      en: `With the digits ${c}, the closest below ${o} is ${lado(d, false)} and the closest above is ${lado(e, false)}.`,
    };
  } else {
    const n = debajo.length ? Math.max(...debajo) : Math.min(...encima);
    const donde = debajo.length ? { es: 'por debajo', en: 'below' } : { es: 'por encima', en: 'above' };
    caso = {
      es: `Con las cifras ${c}, todos quedan ${donde.es} de ${o}; el más próximo es ${lado(n, true)}.`,
      en: `With the digits ${c}, they are all ${donde.en} ${o}; the closest is ${lado(n, false)}.`,
    };
  }
  const regla = { es: 'Busca el más próximo por debajo y el más próximo por encima: gana el que está más cerca.', en: 'Find the closest number below and the closest number above: the nearer one wins.' };
  return `${tt(regla)} ${tt(caso)} ${tt(RESPUESTA)} ${cuentaHtml(num(item.solucion))}.`;
}

/**
 * Par/impar: cómo se elige la última cifra (relevo de la revisión 193). Lo usan la tarjeta del «No lo sé» y el feedback,
 * para que digan lo mismo (reabierta del 14-11 de la tarea 26).
 */
export function explicaUltima(item, { tt, idioma }) {
  const A = TX.construir.ayuda_ultima;
  const ultima = item.solucion % 10;
  const resto = [...item.cifras];
  resto.splice(resto.indexOf(ultima), 1);
  if (item.consigna === 'mayor_impar') return tt(A.mayor_impar)(ultima);
  const mayorPar = Math.max(...item.cifras.filter(d => d % 2 === 0));
  if (ultima === mayorPar) return tt(A.menor_par)(ultima, resto.includes(0));
  const conMayor = Math.min(...permutaciones(item.cifras).filter(n => n % 10 === mayorPar));
  return tt(A.menor_par_cero)(mayorPar, cuentaHtml(fmt(conMayor, idioma)), cuentaHtml(fmt(item.solucion, idioma)));
}

/**
 * Feedback del ejercicio 1 (acierto o fallo). Con par/impar dice lo mismo que la tarjeta del «No lo sé»
 * (reabierta del 14-11 de la tarea 26): cómo se elige la última cifra, y el caso del 0.
 */
export function feedbackConstruir(item, mias, acierto, textos) {
  const { tt, idioma } = textos;
  const T = TX.construir;
  const num = n => fmt(n, idioma);
  const buena = num(item.solucion);
  const mio = Number(mias.join(''));
  const cabecera = acierto ? tt(T.bien)(buena) : tt(T.hecho)(mias[0] === 0 ? mias.join('') : num(mio), buena);
  if (item.consigna === 'menor_par' || item.consigna === 'mayor_impar') return `${cabecera}. ${explicaUltima(item, textos)}`;
  const porQue = {
    mayor: () => tt(T.por_que.mayor)(),
    menor: () => tt(T.por_que.menor)(item.hayCero),
    cercano: () => tt(T.por_que.cercano)(num(item.objetivo), num(Math.abs(item.solucion - item.objetivo))),
  }[item.consigna]();
  return `${cabecera}${porQue}`;
}

/** Ejercicio 1: construye el número. Revisión 193: la razón delante y la respuesta al final (antes, «La respuesta es X: razón»). */
export function explicaConstruir(item, ctx) {
  const { tt, idioma } = ctx;
  if (item.consigna === 'cercano') return explicaCercano(item, ctx);
  const T = TX.construir;
  const porQue = {
    mayor: () => tt(T.por_que.mayor)(),
    menor: () => tt(T.por_que.menor)(item.hayCero),
    menor_par: () => explicaUltima(item, ctx),
    mayor_impar: () => explicaUltima(item, ctx),
  }[item.consigna]();
  const cifras = { es: `Tienes las cifras ${item.cifras.join(', ')}.`, en: `You have the digits ${item.cifras.join(', ')}.` };
  // «: las cifras de mayor a menor.» (mayor, menor) no es una frase por sí sola: se le pone el verbo.
  const razon = porQue.replace(/^: /, '');
  const frase = ['mayor', 'menor'].includes(item.consigna) ? `${tt({ es: 'Se ponen', en: 'Put the' })} ${razon}` : razon;
  return `${tt(cifras)} ${frase} ${tt(RESPUESTA)} ${cuentaHtml(fmt(item.solucion, idioma))}.`;
}

/** Ejercicio 2: valor de las cifras (cuatro tipos de ítem). */
export function explicaDescomposicion(item, { tt, idioma }) {
  const T = TX.descomposicion;
  const num = n => fmt(n, idioma);
  // Revisión 193: en a_suma la regla salía dos veces (la de delante y la del feedback); en a_suma, a_numero y
  // posicion faltaba «La respuesta es …» al final.
  if (item.tipo === 'a_suma') {
    const regla = { es: 'Cada cifra se escribe con lo que vale en su posición; las posiciones con 0 no se ponen.', en: 'Each digit is written with what it is worth in its position; positions with 0 are left out.' };
    const fichas = item.correctas.map(v => cuentaHtml(num(v)));
    const lista = fichas.length === 1
      ? { es: fichas[0], en: fichas[0] }
      : { es: `${fichas.slice(0, -1).join(', ')} y ${fichas.at(-1)}`, en: `${fichas.slice(0, -1).join(', ')} and ${fichas.at(-1)}` };
    return `${tt(regla)} ${cuentaHtml(`${num(item.n)} = ${item.correctas.map(num).join(' + ')}`)}. ${tt(RESPUESTA)} ${tt(lista)}.`;
  }
  if (item.tipo === 'a_numero') {
    const regla = { es: 'Se suman los valores de cada posición.', en: 'Add the values of each position.' };
    const pegado = errorPegado(item);
    const aviso = pegado === null ? '' : tt(T.pegado)(num(item.n), num(pegado));
    return `${tt(regla)} ${tt(T.a_numero_fb)(num(item.n), item.sumandos.map(num).join(' + '))}${aviso} ${tt(RESPUESTA)} ${cuentaHtml(num(item.n))}.`;
  }
  if (item.tipo === 'valor') {
    const regla = { es: 'Una cifra vale según la posición en la que está.', en: 'A digit is worth what its position says.' };
    return `${tt(regla)} ${tt(T.valor_fb)(num(item.n), item.cifra, item.pos, num(item.correcto))} ${tt(RESPUESTA)} ${cuentaHtml(num(item.correcto))}.`;
  }
  const regla = { es: 'Se cuenta desde la derecha: unidades, decenas, centenas, millares…', en: 'Count from the right: units, tens, hundreds, thousands…' };
  const orden = ORDINAL[item.pos];
  const caso = { es: `En ${num(item.n)}, el ${item.cifra} es la ${orden.es} cifra por la derecha.`, en: `In ${num(item.n)}, the ${item.cifra} is the ${orden.en} digit from the right.` };
  const sol = { es: `«${POSICION[item.pos].es}»`, en: `“${POSICION[item.pos].en}”` };
  return `${tt(regla)} ${tt(caso)} ${tt(RESPUESTA)} ${tt(sol)}.`;
}

const ORDINAL = [
  { es: 'primera', en: 'first' }, { es: 'segunda', en: 'second' }, { es: 'tercera', en: 'third' },
  { es: 'cuarta', en: 'fourth' }, { es: 'quinta', en: 'fifth' },
];

/** Ejercicio 3: comas y puntos, o un número dicho con palabras. */
export function explicaComaPalabras(item, { tt, idioma }) {
  // Revisión 193: la tarjeta de los decimales repetía la regla dos veces y el número tres; la de palabras
  // daba la respuesta delante y separaba los grupos con «·», que en esta unidad es el signo de multiplicar.
  if (item.tipo === 'coma') {
    const sol = `${tt(RESPUESTA)} ${cuentaHtml(item.correcto)}.`;
    if (item.sub === 'decimal') {
      const regla = item.dir === 'en_es'
        ? { es: 'En inglés el punto separa los decimales; en español los separa la coma.', en: 'In English a point separates the decimals; in Spanish a comma does.' }
        : { es: 'En español la coma separa los decimales; en inglés los separa el punto.', en: 'In Spanish a comma separates the decimals; in English a point does.' };
      return `${tt(regla)} ${sol}`;
    }
    const regla = item.dir === 'en_es'
      ? { es: 'En inglés la coma separa los grupos de tres cifras; en español se separan con un punto o un espacio.', en: 'In English a comma separates groups of three digits; in Spanish you use a point or a space.' }
      : { es: 'En español los grupos de tres cifras se separan con un punto o un espacio; en inglés, con una coma.', en: 'In Spanish groups of three digits are separated with a point or a space; in English, with a comma.' };
    // La trampa (leerlo con las reglas del otro idioma), solo si cambia la escritura: «75.443 sería 75.443» no dice nada.
    const escrito = escribir(item.c, item.dir === 'en_es' ? 'en' : 'es', 'punto');
    const trampa = item.mal !== null && item.mal !== item.correcto && item.mal !== escrito
      ? (item.dir === 'en_es'
        ? { es: ` Ojo: leído a la española, ${escrito} sería ${cuentaHtml(item.mal)}, otro número.`, en: ` Careful: read the Spanish way, ${escrito} would be ${cuentaHtml(item.mal)}, a different number.` }
        : { es: ` Ojo: leído a la inglesa, ${escrito} sería ${cuentaHtml(item.mal)}, otro número.`, en: ` Careful: read the English way, ${escrito} would be ${cuentaHtml(item.mal)}, a different number.` })
      : null;
    return `${tt(regla)} ${sol}${trampa ? tt(trampa) : ''}`;
  }
  const m = Math.floor(item.n / 1000000), k = Math.floor(item.n / 1000) % 1000, u = item.n % 1000;
  const g = x => String(x).padStart(3, '0');
  const regla = { es: 'Se escribe por grupos de tres cifras: millones, millares y unidades.', en: 'Write it in groups of three digits: millions, thousands and units.' };
  // Lo que suele fallar: un grupo corto lleva ceros delante (87 → 087) y un grupo que no se dice es 000.
  const corto = [k, u].find(x => x > 0 && x < 100);
  const ojo = [
    corto === undefined ? null : { es: `cada grupo lleva tres cifras (${corto} → ${g(corto)})`, en: `each group has three digits (${corto} → ${g(corto)})` },
    k === 0 || u === 0 ? { es: 'un grupo que no se dice es 000', en: 'a group that is not said is 000' } : null,
  ].filter(Boolean);
  const aviso = ojo.length ? ` ${mayuscula(ojo.map(tt).join(idioma === 'es' ? ', y ' : ', and '))}.` : '';
  const grupos = { es: `Aquí: millones ${m}; millares ${g(k)}; unidades ${g(u)}.`, en: `Here: millions ${m}; thousands ${g(k)}; units ${g(u)}.` };
  return `${tt(regla)}${aviso} ${tt(grupos)} ${tt(RESPUESTA)} ${cuentaHtml(fmt(item.n, idioma))}.`;
}
