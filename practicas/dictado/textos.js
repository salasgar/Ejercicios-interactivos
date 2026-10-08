// Dictado de números: textos propios, siempre { es, en }.
// Los números en palabras («six thousand and fourteen», «dos mil ochenta y uno») vienen de
// logica.js y no se traducen: son el contenido que se practica.

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
