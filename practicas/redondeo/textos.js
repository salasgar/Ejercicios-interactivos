// Redondeo y estimación: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente…) llegan a `montar` en `api.t`. Los números ya vienen formateados
// (fmt) desde practica.js; aquí solo se compone la frase.

/** «a la decena», «a la centena», «al millar». */
export const A_ORDEN = {
  10: { es: 'a la decena', en: 'to the nearest ten' },
  100: { es: 'a la centena', en: 'to the nearest hundred' },
  1000: { es: 'al millar', en: 'to the nearest thousand' },
};
export const ETIQUETA_ORDEN = {
  10: { es: 'Decena', en: 'Ten' },
  100: { es: 'Centena', en: 'Hundred' },
  1000: { es: 'Millar', en: 'Thousand' },
};
/** La cifra que decide, nombrada por su lugar. */
export const CIFRA_ORDEN = {
  10: { es: 'las unidades', en: 'the units digit' },
  100: { es: 'las decenas', en: 'the tens digit' },
  1000: { es: 'las centenas', en: 'the hundreds digit' },
};

const REGLA_ES = '<p>Para redondear, mira la cifra de la derecha del orden: si es <strong>5 o más</strong>, subes a la marca de arriba; si es <strong>menos de 5</strong>, te quedas en la de abajo. Si el número está justo en medio (4 750 entre 4 700 y 4 800), se sube.</p>';
const REGLA_EN = '<p>To round, look at the digit just to the right of the order: if it is <strong>5 or more</strong>, go up to the upper mark; if it is <strong>less than 5</strong>, stay on the lower mark. If the number is exactly in the middle (4,750 between 4,700 and 4,800), you go up.</p>';

export const TX = {
  recta: {
    nombre: { es: 'En la recta', en: 'On the number line' },
    detalle: { es: 'Sitúa el número y elige la marca más cercana', en: 'Place the number and pick the nearest mark' },
    introduccion: {
      es: `<h2>Cómo se hace</h2><p>Verás dos marcas de una recta. Primero <strong>toca la recta</strong> donde creas que está el número. Después <strong>toca la marca más cercana</strong>: ese es el redondeo.</p>${REGLA_ES}`,
      en: `<h2>How it works</h2><p>You will see two marks on a number line. First <strong>tap the line</strong> where you think the number is. Then <strong>tap the nearest mark</strong>: that is the rounded number.</p>${REGLA_EN}`,
    },
    pregunta: { es: (n, orden) => `Redondea ${n} ${A_ORDEN[orden].es}.`, en: (n, orden) => `Round ${n} ${A_ORDEN[orden].en}.` },
    paso1: { es: '1. Toca la recta donde está el número', en: '1. Tap the line where the number is' },
    paso2: { es: '2. Toca la marca más cercana', en: '2. Tap the nearest mark' },
    falta_posicion: { es: 'Primero toca la recta donde está el número.', en: 'First tap the line where the number is.' },
    entre: { es: (n, a, b) => `${n} está entre ${a} y ${b}`, en: (n, a, b) => `${n} is between ${a} and ${b}` },
    baja: {
      es: (r, c) => `, más cerca de ${r} (la cifra decisiva es ${c}, menos de 5): redondeo por defecto.`,
      en: (r, c) => `, closer to ${r} (the deciding digit is ${c}, less than 5): rounded down.`,
    },
    sube: {
      es: (r, c) => `, más cerca de ${r} (la cifra decisiva es ${c}, 5 o más): redondeo por exceso.`,
      en: (r, c) => `, closer to ${r} (the deciding digit is ${c}, 5 or more): rounded up.`,
    },
    medio: {
      es: r => `, justo en medio. Por convenio se sube: ${r} (por exceso).`,
      en: r => `, exactly in the middle. By agreement we go up: ${r} (rounded up).`,
    },
    posicion_mal: {
      es: n => ` Tu toque en la recta no estaba cerca de ${n} (la marca verde).`,
      en: n => ` Your tap was not close to ${n} (the green mark).`,
    },
  },
  tres: {
    nombre: { es: 'A tres órdenes', en: 'To three orders' },
    detalle: { es: 'Decena, centena y millar, y si es por exceso o por defecto', en: 'Ten, hundred and thousand, and rounded up or down' },
    introduccion: {
      es: `<h2>Cómo se hace</h2><p>Redondea el mismo número a la decena, a la centena y al millar. Después di, en cada caso, si el redondeo es <strong>por exceso</strong> (mayor que el número) o <strong>por defecto</strong> (menor).</p>${REGLA_ES}`,
      en: `<h2>How it works</h2><p>Round the same number to the nearest ten, hundred and thousand. Then say, each time, if the rounded number is <strong>bigger</strong> than the number (rounded up) or <strong>smaller</strong> (rounded down).</p>${REGLA_EN}`,
    },
    pregunta: { es: n => `Redondea ${n}:`, en: n => `Round ${n}:` },
    leyenda: {
      es: '↑ por exceso: el redondeo es mayor que el número · ↓ por defecto: es menor',
      en: '↑ up: the rounded number is bigger than the number · ↓ down: it is smaller',
    },
    exceso: { es: '↑', en: '↑' },
    defecto: { es: '↓', en: '↓' },
    exceso_aria: { es: 'Por exceso (mayor que el número)', en: 'Up (bigger than the number)' },
    defecto_aria: { es: 'Por defecto (menor que el número)', en: 'Down (smaller than the number)' },
    incompleto: { es: 'Rellena las tres filas y elige exceso o defecto en cada una.', en: 'Fill the three rows and choose up or down in each one.' },
    fila: {
      es: (n, orden, r, c) => `<strong>${ETIQUETA_ORDEN[orden].es}</strong>: ${n} → <span class="cuenta">${r}</span> (la cifra de ${CIFRA_ORDEN[orden].es} es ${c}: ${c >= 5 ? 'sube, por exceso' : 'baja, por defecto'})`,
      en: (n, orden, r, c) => `<strong>${ETIQUETA_ORDEN[orden].en}</strong>: ${n} → <span class="cuenta">${r}</span> (${CIFRA_ORDEN[orden].en} is ${c}: ${c >= 5 ? 'goes up' : 'goes down'})`,
    },
  },
  estimar: {
    nombre: { es: 'Estimar y cazar el error', en: 'Estimate and catch the mistake' },
    detalle: { es: 'Estima, mira si un resultado es razonable y elige cantidades redondeadas', en: 'Estimate, check if a result is reasonable and choose rounded amounts' },
    introduccion: {
      es: `<h2>Cómo se hace</h2><p>Estimar es calcular <strong>aproximadamente</strong>: se redondea cada número y se opera con los redondeados. Sirve para ver si un resultado tiene sentido. Saldrán tres tipos de preguntas: estimar una cuenta, decidir si un resultado es razonable, y elegir una cantidad redondeada.</p>${REGLA_ES}`,
      en: `<h2>How it works</h2><p>To estimate is to calculate <strong>roughly</strong>: round each number and work with the rounded ones. It helps you see if a result makes sense. There are three kinds of questions: estimate a calculation, decide if a result is reasonable, and choose a rounded amount.</p>${REGLA_EN}`,
    },
    // estimar
    instr_elige: {
      es: 'Estima el resultado. Elige a qué orden redondeas cada número y escribe tu estimación.',
      en: 'Estimate the result. Choose which order you round each number to, and write your estimate.',
    },
    instr_fijo: {
      es: 'Estima el resultado: redondea cada número a la decena y escribe tu estimación.',
      en: 'Estimate the result: round each number to the nearest ten and write your estimate.',
    },
    orden_btn: { es: o => `Redondeo ${A_ORDEN[o].es}`, en: o => `Round ${A_ORDEN[o].en}` },
    est_label: { es: 'Mi estimación', en: 'My estimate' },
    dif_label: { es: 'Diferencia entre el resultado exacto y mi estimación', en: 'Difference between the exact result and my estimate' },
    falta: { es: 'Elige el orden y rellena los dos números.', en: 'Choose the order and fill in both numbers.' },
    estimar_fb: {
      es: (o, cuenta, exacto, dif) => `Redondeando ${A_ORDEN[o].es}: <span class="cuenta">${cuenta}</span>. El resultado exacto es ${exacto}; la diferencia es <span class="cuenta">${dif}</span>.`,
      en: (o, cuenta, exacto, dif) => `Rounding ${A_ORDEN[o].en}: <span class="cuenta">${cuenta}</span>. The exact result is ${exacto}; the difference is <span class="cuenta">${dif}</span>.`,
    },
    // razonable
    pregunta_razonable: {
      es: (cuenta, propuesto) => `Un alumno ha calculado ${cuenta} = ${propuesto}. ¿Es razonable?`,
      en: (cuenta, propuesto) => `A student calculated ${cuenta} = ${propuesto}. Is it reasonable?`,
    },
    pista_razonable: { es: 'Estima primero, sin hacer la cuenta exacta.', en: 'Estimate first; do not do the exact calculation.' },
    razonable_si: {
      es: (est, propuesto) => `<span class="cuenta">${est}</span>: ${propuesto} tiene el tamaño esperado (y es, de hecho, el resultado exacto).`,
      en: (est, propuesto) => `<span class="cuenta">${est}</span>: ${propuesto} has the size we expect (and it is, in fact, the exact result).`,
    },
    razonable_no: {
      mas: {
        es: (est, propuesto, exacto) => `<span class="cuenta">${est}</span>, pero ${propuesto} es unas diez veces mayor: tiene una cifra de más. El resultado exacto es ${exacto}.`,
        en: (est, propuesto, exacto) => `<span class="cuenta">${est}</span>, but ${propuesto} is about ten times bigger: it has one digit too many. The exact result is ${exacto}.`,
      },
      menos: {
        es: (est, propuesto, exacto) => `<span class="cuenta">${est}</span>, pero ${propuesto} es unas diez veces menor: tiene una cifra de menos. El resultado exacto es ${exacto}.`,
        en: (est, propuesto, exacto) => `<span class="cuenta">${est}</span>, but ${propuesto} is about ten times smaller: it has one digit too few. The exact result is ${exacto}.`,
      },
      suma: {
        es: (est, propuesto, exacto, a, b) => `<span class="cuenta">${est}</span>, pero ${propuesto} es ${a} + ${b}: ha sumado en vez de multiplicar. El resultado exacto es ${exacto}.`,
        en: (est, propuesto, exacto, a, b) => `<span class="cuenta">${est}</span>, but ${propuesto} is ${a} + ${b}: the student added instead of multiplying. The exact result is ${exacto}.`,
      },
    },
    // contexto
    pregunta_contexto: {
      es: orden => `Elige el número que va en el hueco: redondea ${A_ORDEN[orden].es}.`,
      en: orden => `Choose the number for the gap: round ${A_ORDEN[orden].en}.`,
    },
    contexto_fb: {
      es: (n, orden, correcto, c) => `${n} redondeado ${A_ORDEN[orden].es} es <span class="cuenta">${correcto}</span> (la cifra decisiva es ${c}).`,
      en: (n, orden, correcto, c) => `${n} rounded ${A_ORDEN[orden].en} is <span class="cuenta">${correcto}</span> (the deciding digit is ${c}).`,
    },
    contextos: [
      { es: (n, h) => `Al partido fueron ${n} personas. El periódico dice: «fueron unas ${h} personas».`, en: (n, h) => `${n} people went to the match. The newspaper says: "about ${h} people went".` },
      { es: (n, h) => `El coche ha hecho ${n} km. El vendedor dice: «tiene aproximadamente ${h} km».`, en: (n, h) => `The car has driven ${n} km. The seller says: "it has approximately ${h} km".` },
      { es: (n, h) => `El museo recibió ${n} visitantes este año. La web dice: «alrededor de ${h} visitantes».`, en: (n, h) => `The museum had ${n} visitors this year. The website says: "roughly ${h} visitors".` },
      { es: (n, h) => `La biblioteca tiene ${n} libros. Un cartel dice: «cerca de ${h} libros».`, en: (n, h) => `The library has ${n} books. A sign says: "around ${h} books".` },
      { es: (n, h) => `Un pueblo tiene ${n} habitantes. El mapa dice: «unos ${h} habitantes».`, en: (n, h) => `A town has ${n} people. The map says: "about ${h} people".` },
    ],
  },
};
