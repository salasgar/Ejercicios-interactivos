// Potencias de 10 y números grandes: textos propios, siempre { es, en }.
// Los nombres de número («one hundred thousand»…) vienen de logica.js y no se traducen:
// son el contenido que se practica.

const pot = (c, e) => (c > 1 ? `${c} · 10<sup>${e}</sup>` : `10<sup>${e}</sup>`);

export const TX = {
  pot,
  desl: {
    nombre: { es: 'El deslizador de ceros', en: 'The zeros slider' },
    detalle: { es: 'Mueve el deslizador: la potencia de 10, sus ceros y su nombre', en: 'Move the slider: the power of 10, its zeros and its name' },
    cifras: {
      es: nombre => `Mueve el deslizador hasta el número <strong>${nombre}</strong>.`,
      en: nombre => `Move the slider to the number <strong>${nombre}</strong>.`,
    },
    potencia: {
      es: cifras => `¿Qué potencia de 10 es <strong>${cifras}</strong>? Mueve el deslizador hasta encontrarla.`,
      en: cifras => `Which power of 10 is <strong>${cifras}</strong>? Move the slider to find it.`,
    },
    ceros: {
      es: n => `¿Cuántos ceros tiene 10<sup>${n}</sup>? Mueve el deslizador hasta 10<sup>${n}</sup> y cuéntalos.`,
      en: n => `How many zeros does 10<sup>${n}</sup> have? Move the slider to 10<sup>${n}</sup> and count them.`,
    },
    este: { es: 'Este', en: 'This one' },
    ceros_dice: { es: n => (n === 1 ? '1 cero' : `${n} ceros`), en: n => (n === 1 ? '1 zero' : `${n} zeros`) },
    etiqueta: { es: 'Exponente', en: 'Exponent' },
    tiene: { es: 'tiene', en: 'has' },
    tu_respuesta: {
      es: n => `Has dejado el deslizador en 10<sup>${n}</sup>.`,
      en: n => `You left the slider at 10<sup>${n}</sup>.`,
    },
    gb: { es: 'en inglés británico', en: 'in British English' },
  },
  and: {
    nombre: { es: 'El «and» y los ceros', en: 'The "and" and the zeros' },
    detalle: { es: 'Emparejar nombres y escribir números con ceros en cada grupo', en: 'Match names and write numbers with zeros in each group' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En inglés, la posición del <strong>and</strong> cambia el número: <strong>four hundred thousand and twenty</strong> es 400&nbsp;020, pero <strong>four hundred and twenty thousand</strong> es 420&nbsp;000.</p>
        <p>A veces tendrás que emparejar dos nombres con dos números y otras escribir con cifras un número grande. Cada grupo de tres cifras se rellena con ceros si hace falta.</p>`,
      en: `<h2>How it works</h2>
        <p>In English, the position of <strong>and</strong> changes the number: <strong>four hundred thousand and twenty</strong> is 400&nbsp;020, but <strong>four hundred and twenty thousand</strong> is 420&nbsp;000.</p>
        <p>Sometimes you match two names with two numbers, and sometimes you write a big number in figures. Each group of three digits is filled with zeros when needed.</p>`,
    },
    empareja: {
      es: 'Elige el número que corresponde a cada nombre.',
      en: 'Choose the number that matches each name.',
    },
    escribe: {
      es: texto => `Escribe con cifras: <strong>${texto}</strong>`,
      en: texto => `Write in figures: <strong>${texto}</strong>`,
    },
    borrar: { es: 'Borrar', en: 'Delete' },
    vacio: { es: 'Pulsa las cifras', en: 'Press the digits' },
    grupos: {
      es: g => `${g.millones ? `millones: ${g.millones} · ` : ''}miles: ${g.miles} · unidades: ${g.unidades}`,
      en: g => `${g.millones ? `millions: ${g.millones} · ` : ''}thousands: ${g.miles} · units: ${g.unidades}`,
    },
    tu_respuesta: {
      es: n => `Has escrito <span class="cuenta">${n}</span>, que no es.`,
      en: n => `You wrote <span class="cuenta">${n}</span>, which is not right.`,
    },
    pista_grupos: {
      es: 'Cada grupo de tres cifras se rellena con ceros: «two thousand» → 002.',
      en: 'Each group of three digits is filled with zeros: "two thousand" → 002.',
    },
    pista_grupos_es: {
      es: 'Cada grupo de tres cifras se rellena con ceros: «dos mil» → 002.',
      en: 'Each group of three digits is filled with zeros: "dos mil" → 002.',
    },
  },
  billion: {
    nombre: { es: 'Billion, million y trillion', en: 'Billion, million and trillion' },
    detalle: { es: 'Nombres de números muy grandes en inglés y en español', en: 'Names of very big numbers in English and Spanish' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Hoy, en inglés, <strong>one billion</strong> es 10<sup>9</sup> (mil millones). También se dice <strong>one thousand million</strong> (inglés británico): es el mismo número.</p>
        <p><strong>One trillion</strong> es 10<sup>12</sup>, que en español es <strong>un billón</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Today, in English, <strong>one billion</strong> is 10<sup>9</sup> (mil millones in Spanish). It is also called <strong>one thousand million</strong> (British English): it is the same number.</p>
        <p><strong>One trillion</strong> is 10<sup>12</sup>, which is <strong>un billón</strong> in Spanish.</p>`,
    },
    potencia: {
      es: (nombre, uso) => `¿Cuánto vale <strong>${nombre}</strong>${uso ? ` (${uso})` : ''}?`,
      en: (nombre, uso) => `What is <strong>${nombre}</strong>${uso ? ` (${uso})` : ''} equal to?`,
    },
    en_ingles: {
      es: (cifras, p) => `¿Cómo se dice en inglés <strong>${cifras}</strong> (${p})?`,
      en: (cifras, p) => `How do you say <strong>${cifras}</strong> (${p}) in English?`,
    },
    en_espanol: {
      es: (nombre, uso) => `¿Cómo se dice en español <strong>${nombre}</strong>${uso ? ` (${uso})` : ''}?`,
      en: (nombre, uso) => `How do you say <strong>${nombre}</strong>${uso ? ` (${uso})` : ''} in Spanish?`,
    },
    mismo: {
      es: (a, b) => `¿Nombran el mismo número <strong>${a}</strong> y <strong>${b}</strong>?`,
      en: (a, b) => `Do <strong>${a}</strong> and <strong>${b}</strong> name the same number?`,
    },
    es_igual: { es: 'son el mismo número', en: 'are the same number' },
    es_distinto: { es: 'son números distintos', en: 'are different numbers' },
    nota_billion: {
      es: 'Hoy, en inglés, billion es 10<sup>9</sup> (mil millones); thousand million es lo mismo.',
      en: 'Today, in English, billion is 10<sup>9</sup> (mil millones in Spanish); thousand million is the same.',
    },
    nota_trillion: {
      es: 'Trillion es 10<sup>12</sup>, que en español es «billón»; billion y billón no son lo mismo.',
      en: 'Trillion is 10<sup>12</sup>, which is "billón" in Spanish; billion and billón are not the same.',
    },
  },
};
