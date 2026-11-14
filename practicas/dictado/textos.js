// Dictado de números: textos propios, siempre { es, en }.
// Los números en palabras («six thousand and fourteen», «dos mil ochenta y uno») vienen de
// logica.js y no se traducen: son el contenido que se practica.

import { agrupar, enNum, esNum, gruposConValor } from './logica.js';

export const TX = {
  voz: {
    escuchar_en: { es: '▶ Listen', en: '▶ Listen' },
    escuchar_es: { es: '▶ Escuchar', en: '▶ Escuchar' },
    sin_voz: {
      es: 'Tu dispositivo no tiene voz: léelo.',
      en: 'Your device has no voice: read it.',
    },
  },
  dictado: {
    nombre: { es: 'Dictado en inglés', en: 'Dictation in English' },
    detalle: { es: 'Escucha un número en inglés y escríbelo con cifras', en: 'Listen to a number in English and write it in figures' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Pulsa <strong>▶ Listen</strong> y escucha un número en inglés. Escríbelo con cifras con el teclado.</p>
        <p>Atención a los ceros: <strong>six thousand and fourteen</strong> es 6&nbsp;014. Puedes volver a escuchar todas las veces que quieras.</p>`,
      en: `<h2>How it works</h2>
        <p>Press <strong>▶ Listen</strong> and listen to a number in English. Write it in figures with the keypad.</p>
        <p>Watch the zeros: <strong>six thousand and fourteen</strong> is 6&nbsp;014. You can listen again as many times as you want.</p>`,
    },
    instruccion: { es: 'Escribe con cifras el número que oyes.', en: 'Write in figures the number you hear.' },
    instruccion_sin_voz: { es: 'Escribe con cifras este número.', en: 'Write this number in figures.' },
    borrar: { es: 'Borrar', en: 'Delete' },
    tu_respuesta: {
      es: n => `Has escrito <span class="cuenta">${n}</span>, que no es.`,
      en: n => `You wrote <span class="cuenta">${n}</span>, which is not right.`,
    },
    grupos: {
      es: 'Por grupos',
      en: 'By groups',
    },
  },
  teen: {
    nombre: { es: '-teen o -ty, y cómo se escribe', en: '-teen or -ty, and how to spell it' },
    detalle: { es: 'Distingue fourteen de forty y escribe bien los números ingleses', en: 'Tell fourteen from forty and spell English numbers correctly' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>A veces oirás un número y tendrás que decidir cuál es. <strong>fourteen</strong> (14) acaba en <strong>-teen</strong> y suena fuerte al final; <strong>forty</strong> (40) acaba en <strong>-ty</strong> y suena fuerte al principio.</p>
        <p>Otras veces tendrás que elegir cómo se escribe un número en inglés.</p>`,
      en: `<h2>How it works</h2>
        <p>Sometimes you will hear a number and you have to decide which one it is. <strong>fourteen</strong> (14) ends in <strong>-teen</strong> and is stressed at the end; <strong>forty</strong> (40) ends in <strong>-ty</strong> and is stressed at the start.</p>
        <p>Other times you choose how a number is spelled in English.</p>`,
    },
    instruccion: { es: '¿Qué número oyes?', en: 'Which number do you hear?' },
    instruccion_sin_voz: { es: '¿Qué número es?', en: 'Which number is it?' },
    // pt y pty: las dos palabras del ítem con el acento marcado (six<strong>TEEN</strong>, <strong>SIX</strong>ty)
    diferencia: {
      es: (a, b, texto, pt, pty) => `${texto} = <span class="cuenta">${a}</span> (no ${b}).<br>-teen: acento al final (${pt}); -ty: acento al principio (${pty}).`,
      en: (a, b, texto, pt, pty) => `${texto} = <span class="cuenta">${a}</span> (not ${b}).<br>-teen: stress at the end (${pt}); -ty: stress at the start (${pty}).`,
    },
    escritura: {
      es: n => `¿Cómo se escribe <strong>${n}</strong> en inglés?`,
      en: n => `How do you write <strong>${n}</strong> in English?`,
    },
    escritura_ok: {
      es: (n, texto) => `${texto} = <span class="cuenta">${n}</span>`,
      en: (n, texto) => `${texto} = <span class="cuenta">${n}</span>`,
    },
    nota_compuesto: {
      es: 'Del 21 al 99, la decena y la unidad van unidas con un guion.',
      en: 'From 21 to 99, the tens and the units are joined with a hyphen.',
    },
    // buena: la palabra bien escrita; malas: las escrituras erróneas que salían en este ítem
    nota_decena: {
      es: (buena, malas) => `Ojo con la ortografía: se escribe ${buena}, no ${malas}.`,
      en: (buena, malas) => `Watch the spelling: it is ${buena}, not ${malas}.`,
    },
    // buena: «three hundred»; conS: «three hundreds»
    nota_plural: {
      es: (buena, conS) => `Después de un número, hundred y thousand no llevan -s: ${buena}, no ${conS}.`,
      en: (buena, conS) => `After a number, hundred and thousand have no -s: ${buena}, not ${conS}.`,
    },
  },
  fichas: {
    nombre: { es: 'Ortografía española', en: 'Spanish spelling' },
    detalle: { es: 'Ordena fichas para escribir números en español, y dictado en español', en: 'Put tiles in order to write numbers in Spanish, and dictation in Spanish' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Verás un número y varias fichas con palabras. Toca las fichas en orden para escribirlo. <strong>Sobran fichas</strong>: algunas están mal escritas.</p>
        <p>Otras veces oirás un número en español y lo escribirás con cifras.</p>`,
      en: `<h2>How it works</h2>
        <p>You will see a number and several tiles with words. Tap the tiles in order to write it in Spanish. <strong>Some tiles are extra</strong>: some are misspelled.</p>
        <p>Other times you will hear a number in Spanish and write it in figures.</p>`,
    },
    instruccion: {
      es: n => `Escribe <strong>${n}</strong> con palabras: toca las fichas en orden. Toca una ficha de tu línea para quitarla.`,
      en: n => `Write <strong>${n}</strong> in Spanish words: tap the tiles in order. Tap a tile in your line to remove it.`,
    },
    linea_vacia: { es: 'Toca las fichas…', en: 'Tap the tiles…' },
    correcta: { es: 'Se escribe', en: 'It is written' },
    tu_respuesta: { es: 'Has puesto', en: 'You put' },
    // Cada nota recibe (texto, pre): el número del ítem en palabras y lo que va delante de «mil» ('' si es solo «mil»)
    notas: {
      miles: {
        es: (texto, pre) => (pre ? `«mil» no tiene plural: ${pre} mil, no ${pre} miles.` : '«mil» no tiene plural: se dice mil, no miles.'),
        en: (texto, pre) => (pre ? `"mil" has no plural: ${pre} mil, not ${pre} miles.` : '"mil" has no plural: we say mil, not miles.'),
      },
      un: {
        es: texto => `Aquí no hace falta «un»: ${texto}.`,
        en: texto => `There is no "un" here: ${texto}.`,
      },
      y: {
        es: texto => `Aquí no va «y»: la «y» solo va entre las decenas y las unidades (treinta y dos); este número es ${texto}.`,
        en: texto => `There is no "y" here: "y" only goes between tens and units (treinta y dos); this number is ${texto}.`,
      },
      sietecientos: {
        es: () => 'Es «setecientos», no «sietecientos».',
        en: () => 'It is "setecientos", not "sietecientos".',
      },
      nuevecientos: {
        es: () => 'Es «novecientos», no «nuevecientos».',
        en: () => 'It is "novecientos", not "nuevecientos".',
      },
      cincocientos: {
        es: () => 'Es «quinientos», no «cincocientos».',
        en: () => 'It is "quinientos", not "cincocientos".',
      },
    },
    dictado_instruccion: { es: 'Escucha el número en español y escríbelo con cifras.', en: 'Listen to the number in Spanish and write it in figures.' },
    dictado_instruccion_sin_voz: { es: 'Escribe con cifras este número.', en: 'Write this number in figures.' },
  },
};

// ─── «No lo sé»: la explicación de cada ítem ─────────────────────────────────

const AYUDA = {
  respuesta: { es: 'La respuesta es', en: 'The answer is' },
  // Revisión 193: la regla anterior («si un grupo no aparece, pon ceros») no cubría el caso típico,
  // el cero DENTRO del grupo (17 095), y los grupos iban separados con «·», que en la U1 es el producto.
  // mil: la palabra que separa los dos grupos («thousand» o «mil»), ya entre comillas.
  pasos: {
    es: mil => `Separa el número en dos grupos: lo que va delante de ${mil} y lo que va detrás, que siempre se escribe con tres cifras; si falta alguna, pon un 0 en su sitio.`,
    en: mil => `Split the number into two groups: the part before ${mil} and the part after it, which is always written with three digits; if a digit is missing, put a 0 in its place.`,
  },
  pasos3: {
    es: 'Un número de tres cifras se escribe con sus centenas, decenas y unidades; si falta alguna, pon un 0 en su sitio.',
    en: 'A three-digit number is written with its hundreds, tens and units; if one is missing, put a 0 in its place.',
  },
  cifras3: {
    es: (c, d, u) => `${c} ${c === '1' ? 'centena' : 'centenas'}, ${d} ${d === '1' ? 'decena' : 'decenas'} y ${u} ${u === '1' ? 'unidad' : 'unidades'}`,
    en: (c, d, u) => `${c} ${c === '1' ? 'hundred' : 'hundreds'}, ${d} ${d === '1' ? 'ten' : 'tens'} and ${u} ${u === '1' ? 'unit' : 'units'}`,
  },
  nada_detras: { es: 'detrás no hay nada', en: 'nothing after it' },
  pasosFichas: {
    es: 'Pon las fichas en el orden en que se dice el número; las que no van en él sobran.',
    en: 'Put the tiles in the order we say the number; the tiles that are not in it are extra.',
  },
  sobran: { es: 'Sobran', en: 'Extra tiles' },
  // Por qué sobra cada ficha errónea (texto: el número en palabras; pre: lo que va delante de «mil»)
  notas: {
    miles: {
      es: (texto, pre) => `«mil» no tiene plural (${pre ? `${pre} mil, no ${pre} miles` : 'mil, no miles'})`,
      en: (texto, pre) => `“mil” has no plural (${pre ? `${pre} mil, not ${pre} miles` : 'mil, not miles'})`,
    },
    un: {
      es: texto => (texto.startsWith('mil') ? 'se dice «mil», no «un mil»' : 'este número no lleva «un»'),
      en: texto => (texto.startsWith('mil') ? 'we say “mil”, not “un mil”' : 'this number has no “un”'),
    },
    y: {
      es: () => 'la «y» solo va entre las decenas y las unidades (treinta y dos), y este número no la lleva',
      en: () => '“y” only goes between the tens and the units (treinta y dos), and this number has none',
    },
    sietecientos: { es: () => 'se escribe «setecientos»', en: () => 'the right word is “setecientos”' },
    nuevecientos: { es: () => 'se escribe «novecientos»', en: () => 'the right word is “novecientos”' },
    cincocientos: { es: () => 'se escribe «quinientos»', en: () => 'the right word is “quinientos”' },
  },
};

const comillas = { es: x => `«${x}»`, en: x => `“${x}”` };

/** Lo que va delante de «mil» en el texto español ('' si el número empieza por «mil»). */
export const prefijoMil = texto => (texto.startsWith('mil') ? '' : texto.split(' mil')[0]);

/** La palabra del ítem con el acento marcado: six<strong>TEEN</strong> (al final) o <strong>SIX</strong>ty (al principio). */
export function acentuada(n, sufijo) {
  const palabra = enNum(n);
  const raiz = palabra.slice(0, -sufijo.length);
  return sufijo === 'teen' ? `${raiz}<strong>TEEN</strong>` : `<strong>${raiz.toUpperCase()}</strong>${sufijo}`;
}

/** Explicación de un dictado: el número en palabras y por grupos (inglés) o solo el número (español). */
export function explicarDictado(item, { tt, esc }) {
  let html = `${esc(item.texto)} = <span class="cuenta">${agrupar(item.n)}</span>`;
  if (item.tipo === 'dictado') {
    const grupos = gruposConValor(item.n).map(g => `${g.texto} = ${agrupar(g.valor)}`);
    if (grupos.length > 1) html += `<br>${tt(TX.dictado.grupos)}: ${grupos.join(' · ')}`;
  }
  return html;
}

/**
 * «No lo sé» de un dictado (en inglés o en español): los dos grupos, delante y detrás de
 * «thousand»/«mil», con el de detrás a tres cifras (17 095: seventeen thousand → 17; ninety-five → 095).
 * Sin «thousand» (solo en inglés, de 100 a 999): centenas, decenas y unidades.
 */
export function explicaDictado(item, { tt, esc }) {
  const ingles = item.tipo === 'dictado';
  const nombre = ingles ? enNum : esNum;
  const n = item.n, k = Math.floor(n / 1000), u = n % 1000;
  const cifra = x => `<span class="cuenta">${x}</span>`;
  let regla, pasos;
  if (k === 0) {
    regla = tt(AYUDA.pasos3);
    const [c, d, un] = String(n);
    pasos = `${esc(item.texto)}: ${tt(AYUDA.cifras3)(c, d, un)} → ${cifra(n)}`;
  } else {
    regla = tt(AYUDA.pasos)(tt(comillas)(ingles ? 'thousand' : 'mil'));
    const detras = u ? `${esc(nombre(u))} → ${cifra(String(u).padStart(3, '0'))}` : `${tt(AYUDA.nada_detras)} → ${cifra('000')}`;
    pasos = `${esc(item.texto)}<br>${esc(nombre(k * 1000))} → ${cifra(k)}; ${detras}`;
  }
  return `<p>${regla}</p><p>${pasos}</p><p><strong>${tt(AYUDA.respuesta)} ${agrupar(n)}.</strong></p>`;
}

/** La nota de la escritura inglesa: guion, ortografía de la decena o plural. */
export function notaEscritura(item, { tt, esc }) {
  const buena = item.opciones[item.solucion];
  const malas = item.opciones.filter((_, i) => i !== item.solucion);
  return {
    compuesto: () => tt(TX.teen.nota_compuesto),
    decena: () => tt(TX.teen.nota_decena)(esc(buena), esc(malas.join(', '))),
    plural: () => tt(TX.teen.nota_plural)(esc(buena), esc(malas.find(o => o.endsWith('s')))),
  }[item.clase]();
}

/** «No lo sé» del ejercicio 2: -teen o -ty (oído), o cómo se escribe un número en inglés. */
export function explicaTeenOEscritura(item, ctx) {
  const { tt, esc } = ctx;
  if (item.tipo === 'teen') {
    const otro = item.opciones[1 - item.solucion];
    return `<p>${tt(TX.teen.diferencia)(agrupar(item.n), agrupar(otro), esc(item.texto), acentuada(item.base[0], 'teen'), acentuada(item.base[1], 'ty'))}</p><p><strong>${tt(AYUDA.respuesta)} ${agrupar(item.n)}.</strong></p>`;
  }
  // La regla (la nota) delante; el feedback la pone detrás, pegada a «fifty = 50» sin punto.
  const buena = item.opciones[item.solucion];
  return `<p>${notaEscritura(item, ctx)}</p><p>${tt(TX.teen.escritura_ok)(agrupar(item.n), esc(buena))}</p><p><strong>${tt(AYUDA.respuesta)} ${esc(buena)}.</strong></p>`;
}

/** «No lo sé» del ejercicio 3: ordenar las fichas del número en español, o dictado en español. */
export function explicaFichasODictadoEs(item, ctx) {
  if (item.tipo !== 'fichas') return explicaDictado(item, ctx);
  const { tt, esc } = ctx;
  const pre = prefijoMil(item.texto);
  const q = tt(comillas);
  const notas = item.sobran.map(s => `<br>${q(esc(s))}: ${tt(AYUDA.notas[s])(esc(item.texto), esc(pre))}.`).join('');
  return `<p>${tt(AYUDA.pasosFichas)}</p><p>${esc(item.texto)} = <span class="cuenta">${agrupar(item.n)}</span></p>`
    + `<p>${tt(AYUDA.sobran)}:${notas}</p><p><strong>${tt(AYUDA.respuesta)} ${esc(item.texto)}.</strong></p>`;
}
