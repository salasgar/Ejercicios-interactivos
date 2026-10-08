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
    diferencia: {
      es: (a, b, texto) => `<span class="cuenta">${texto} = ${a}</span> (no ${b}). ${'-teen'}: acento al final (four<strong>TEEN</strong>); -ty: acento al principio (<strong>FOR</strong>ty).`,
      en: (a, b, texto) => `<span class="cuenta">${texto} = ${a}</span> (not ${b}). -teen: stress at the end (four<strong>TEEN</strong>); -ty: stress at the start (<strong>FOR</strong>ty).`,
    },
    escritura: {
      es: n => `¿Cómo se escribe <strong>${n}</strong> en inglés?`,
      en: n => `How do you write <strong>${n}</strong> in English?`,
    },
    escritura_ok: {
      es: (n, texto) => `<span class="cuenta">${n} = ${texto}</span>`,
      en: (n, texto) => `<span class="cuenta">${n} = ${texto}</span>`,
    },
    nota_compuesto: {
      es: 'Del 21 al 99, la decena y la unidad van unidas con un guion.',
      en: 'From 21 to 99, the tens and the units are joined with a hyphen.',
    },
    nota_decena: {
      es: 'Ojo con la ortografía: forty (no fourty), fourteen (con la u de four), eighty (no eigthy).',
      en: 'Watch the spelling: forty (not fourty), fourteen (with the u of four), eighty (not eigthy).',
    },
    nota_plural: {
      es: 'Después de un número, hundred y thousand no llevan -s: three hundred, five thousand.',
      en: 'After a number, hundred and thousand have no -s: three hundred, five thousand.',
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
    notas: {
      miles: { es: '«mil» no tiene plural: seis mil, no seis miles.', en: '"mil" has no plural: seis mil, not seis miles.' },
      un: { es: 'No se dice «un mil»: mil, tres mil…', en: 'We do not say "un mil": mil, tres mil…' },
      y: { es: 'La «y» solo va entre las decenas y las unidades: treinta y dos.', en: 'The "y" is only between tens and units: treinta y dos.' },
      sietecientos: { es: 'Es «setecientos», no «sietecientos».', en: 'It is "setecientos", not "sietecientos".' },
      nuevecientos: { es: 'Es «novecientos», no «nuevecientos».', en: 'It is "novecientos", not "nuevecientos".' },
      cincocientos: { es: 'Es «quinientos», no «cincocientos».', en: 'It is "quinientos", not "cincocientos".' },
    },
    dictado_instruccion: { es: 'Escucha el número en español y escríbelo con cifras.', en: 'Listen to the number in Spanish and write it in figures.' },
    dictado_instruccion_sin_voz: { es: 'Escribe con cifras este número.', en: 'Write this number in figures.' },
  },
};
