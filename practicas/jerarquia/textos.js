// «¿Qué se hace primero?»: textos propios, siempre { es, en }. Los comunes
// (Comprobar, Siguiente…) llegan a `montar` en `api.t`.

const NIVELES = {
  1: { es: '+ y −', en: '+ and −' },
  2: { es: '· y :', en: '· and ÷' },
  3: { es: 'las potencias y las raíces', en: 'powers and roots' },
};

export const TX = {
  nombre1: { es: 'Sin paréntesis', en: 'No brackets' },
  detalle1: { es: 'Toca la operación que se hace primero', en: 'Tap the operation that comes first' },
  nombre2: { es: 'Potencias y raíces', en: 'Powers and roots' },
  detalle2: { es: 'Potencias y raíces antes que · : + −', en: 'Powers and roots before · ÷ + −' },
  nombre3: { es: 'Con paréntesis', en: 'With brackets' },
  detalle3: { es: 'Paréntesis dentro de paréntesis', en: 'Brackets inside brackets' },
  nombre4: { es: 'Agrupadores invisibles', en: 'Hidden brackets' },
  detalle4: { es: 'La raya de fracción y la raíz agrupan', en: 'The fraction line and the root group things' },

  intro1: {
    es: `<h2>Cómo se hace</h2>
      <p>Verás una cuenta con varias operaciones. <strong>Toca la operación que se hace primero</strong> (el signo). La app la calcula y la cuenta se acorta.</p>
      <p>Orden: primero <strong>· y :</strong>, después <strong>+ y −</strong>. Si hay dos <strong>seguidas</strong> del mismo tipo (como 20 : 4 · 5 o 10 − 4 + 3), <strong>de izquierda a derecha</strong>.</p>
      <p>Si dos operaciones no se estorban (como 3² y 5 · 4 en 3² + 5 · 4), puedes empezar por cualquiera de las dos.</p>`,
    en: `<h2>How it works</h2>
      <p>You will see a sum with several operations. <strong>Tap the operation that comes first</strong> (the sign). The app works it out and the sum gets shorter.</p>
      <p>Order: first <strong>· and ÷</strong>, then <strong>+ and −</strong>. If there are two of the same kind <strong>in a row</strong> (like 20 ÷ 4 · 5 or 10 − 4 + 3), go <strong>from left to right</strong>.</p>
      <p>If two operations do not get in each other's way (like 3² and 5 · 4 in 3² + 5 · 4), you can start with either one.</p>`,
  },
  intro2: {
    es: `<h2>Potencias y raíces</h2>
      <p>Ahora toca el exponente (el número pequeño) o el signo de la raíz √.</p>
      <p>Las <strong>potencias y las raíces</strong> van antes que · : + −. Si hay dos que no se estorban (como 4³ y √324 en 4³ + √324), puedes empezar por cualquiera.</p>`,
    en: `<h2>Powers and roots</h2>
      <p>Now tap the index (the small number) or the root sign √.</p>
      <p><strong>Powers and roots</strong> come before · ÷ + −. If there are two that do not get in each other's way (like 4³ and √324 in 4³ + √324), you can start with either one.</p>`,
  },
  intro3: {
    es: `<h2>Paréntesis</h2>
      <p>Se empieza por <strong>lo de dentro de los paréntesis</strong>, de dentro hacia fuera. Un exponente sobre un paréntesis se toca <strong>después</strong> de resolver el paréntesis.</p>`,
    en: `<h2>Brackets</h2>
      <p>Start with <strong>what is inside the brackets</strong>, from the inside out. An index on a bracket is tapped <strong>after</strong> the bracket is worked out.</p>`,
  },
  intro4: {
    es: `<h2>Agrupadores invisibles</h2>
      <p>La <strong>raya de fracción</strong> y la <strong>raíz</strong> agrupan sin paréntesis. Al escribir la cuenta en una línea hay que ponerlos.</p>
      <p>Toca un grupo para ponerle o quitarle el paréntesis, y pulsa Comprobar.</p>`,
    en: `<h2>Hidden brackets</h2>
      <p>The <strong>fraction line</strong> and the <strong>root</strong> group things without brackets. When you write the sum on one line you need to add them.</p>
      <p>Tap a group to add or remove its brackets, then press Check.</p>`,
  },

  instruccion: { es: 'Toca una operación que ya se pueda hacer.', en: 'Tap an operation you can already do.' },
  cuenta_dice: { es: 'La cuenta queda así:', en: 'The sum now reads:' },
  has_fallado: { es: 'No era esa. La app hace el paso correcto y sigues.', en: 'That was not it. The app does the right step and you carry on.' },

  motivo: {
    parentesis: {
      es: () => 'Primero se hace lo de dentro de los paréntesis (de dentro hacia fuera).',
      en: () => 'First do what is inside the brackets (from the inside out).',
    },
    prioridad: {
      es: (nivel, malo) => `${NIVELES[nivel].es[0].toUpperCase()}${NIVELES[nivel].es.slice(1)} van antes que ${NIVELES[malo].es}.`,
      en: (nivel, malo) => `${NIVELES[nivel].en[0].toUpperCase()}${NIVELES[nivel].en.slice(1)} come before ${NIVELES[malo].en}.`,
    },
    izquierda: {
      es: nivel => `${NIVELES[nivel].es[0].toUpperCase()}${NIVELES[nivel].es.slice(1)} seguidas se hacen de izquierda a derecha: antes va la de la izquierda.`,
      en: nivel => `${NIVELES[nivel].en[0].toUpperCase()}${NIVELES[nivel].en.slice(1)} in a row are done from left to right: the one on the left goes first.`,
    },
  },
  final: { es: 'Resultado', en: 'Result' },

  // Ejercicio 4
  instruccion4: {
    es: 'Escríbela en una línea: toca un grupo para ponerle o quitarle el paréntesis.',
    en: 'Write it on one line: tap a group to add or remove its brackets.',
  },
  tu_linea: { es: 'En una línea:', en: 'On one line:' },
  explicacion_raya: {
    es: 'La raya de fracción divide el numerador entre todo el denominador.',
    en: 'The fraction line divides the numerator by the whole denominator.',
  },
  explicacion_radical: {
    es: 'La raíz cubre todo lo que hay debajo del signo.',
    en: 'The root covers everything under the sign.',
  },
  falta_num: { es: 'Falta el paréntesis del numerador', en: 'The numerator is missing its brackets' },
  falta_den: { es: 'Falta el paréntesis del denominador', en: 'The denominator is missing its brackets' },
  falta_rad: { es: 'Falta el paréntesis debajo de la raíz', en: 'The part under the root is missing its brackets' },
  porque_num: {
    es: 'Lo de arriba de la raya es una suma o una resta y se hace antes de dividir.',
    en: 'What is above the line is an addition or a subtraction, and it is done before dividing.',
  },
  porque_den: {
    es: 'La raya divide entre todo lo de abajo, no solo entre su primer número.',
    en: 'The line divides by everything below it, not only by its first number.',
  },
  porque_rad: {
    es: 'La raíz cubre todo lo que hay debajo del signo.',
    en: 'The root covers everything under the sign.',
  },
  saldria: { es: n => `Así escrito sale ${n}, y no`, en: n => `Written like that you get ${n}, not` },
  no_da: { es: v => `Así escrito no da ${v}`, en: v => `Written like that it does not give ${v}` },
  sobran: {
    es: g => `Los paréntesis alrededor de ${g} no hacían falta, pero no es un error.`,
    en: g => `The brackets around ${g} were not needed, but that is not a mistake.`,
  },
  correcta: { es: 'La línea correcta es', en: 'The correct line is' },
  bien4: { es: 'Bien', en: 'Good' },
};
