// Textos comunes de «Coloca los paréntesis» (PU2, tarea 199), siempre { es, en }: los de la
// interfaz que comparten las tres prácticas de la U3, la U4 y la U5 (los de la U1 están en
// `practicas/parentesis/textos.js`, que no se toca). Lo propio de cada práctica (las
// introducciones, la frase de cada razón de «no se puede», el consejo del «No lo sé») va en
// el `textos.js` de la práctica y se le pasa a `crearPantalla` (`parentesis-pantalla.js`),
// que lo mezcla por encima de esto. En inglés, «brackets» (inglés británico, como el material)
// y la división con «÷». Las expresiones no se escriben aquí: las pinta el motor.

export const TEXTOS = {
  instruccion_todos: {
    es: 'Toca los huecos para colocar paréntesis. Cada resultado nuevo se enciende.',
    en: 'Tap the spaces to place brackets. Each new result switches on.',
  },
  objetivo: { es: 'Coloca paréntesis para obtener', en: 'Place brackets to get' },
  hueco_abre: { es: 'abrir paréntesis antes del', en: 'open bracket before' },
  hueco_cierra: { es: 'cerrar paréntesis después del', en: 'close bracket after' },
  pista: { es: 'Pista', en: 'Hint' },
  borrar: { es: 'Borrar paréntesis', en: 'Clear brackets' },
  resultados: {
    es: (n, total) => `Resultados: ${n} de ${total}`,
    en: (n, total) => `Results: ${n} of ${total}`,
  },

  // Mensajes bajo la resolución
  desequilibrados: {
    es: 'Falta algún paréntesis: cada ( necesita su ).',
    en: 'A bracket is missing: every ( needs its ).',
  },
  nuevo: { es: '¡Resultado nuevo!', en: 'New result!' },
  ya_lo_tenias: {
    es: 'Ya lo tenías: estos paréntesis no cambian el resultado.',
    en: 'You already had it: these brackets do not change the result.',
  },
  ya_con_otros: {
    es: 'Ese resultado ya lo tenías, con otros paréntesis.',
    en: 'You already had that result, with other brackets.',
  },
  no_agrupan: {
    es: 'Estos paréntesis no cambian nada: las operaciones ya se hacían en ese orden.',
    en: 'These brackets change nothing: the operations were already done in that order.',
  },
  // Razones de una agrupación que no se puede calcular; reciben la operación en HTML («−7 : 2»).
  // Cada práctica puede cambiarlas (`imposible` de sus textos propios); `negativo` solo sale con
  // una aritmética sin negativos, y `grande`, nunca a la vista si el generador descarta esos ítems.
  imposible: {
    negativo: {
      es: op => `${op}: aquí no trabajamos con números negativos.`,
      en: op => `${op}: we do not use negative numbers here.`,
    },
    inexacta: {
      es: op => `${op} no es una división exacta.`,
      en: op => `${op} is not an exact division.`,
    },
    cero: {
      es: op => `${op}: no se puede dividir entre 0.`,
      en: op => `${op}: you cannot divide by 0.`,
    },
    grande: {
      es: () => 'El resultado es demasiado grande: aquí no llegamos tan lejos.',
      en: () => 'The result is too big: we do not go that far here.',
    },
  },
  // Lo mismo para el «No lo sé» (frase sin punto final): «… no cuenta: −7 : 2 no es una división exacta».
  motivo: {
    negativo: { es: op => `${op} da un número negativo`, en: op => `${op} gives a negative number` },
    inexacta: { es: op => `${op} no es una división exacta`, en: op => `${op} is not an exact division` },
    cero: { es: op => `${op} no se puede, porque no se divide entre 0`, en: op => `${op} is not possible, because you cannot divide by 0` },
  },

  // Final de los «encuentra todos»
  todos_titulo: { es: 'Los has encontrado todos:', en: 'You found them all:' },
  // La diana
  sin_cerrar: {
    es: 'Los paréntesis no están completos: cada ( necesita su ).',
    en: 'The brackets are not complete: every ( needs its ).',
  },
  tu_agrupacion: { es: 'Tus paréntesis:', en: 'Your brackets:' },
  da: { es: 'Eso da', en: 'That gives' },
  no: { es: 'no', en: 'not' },
  una_que_da: {
    es: n => `Una agrupación que da ${n}:`,
    en: n => `A grouping that gives ${n}:`,
  },

  // «No lo sé»
  la_respuesta_es: { es: 'La respuesta es', en: 'The answer is' },
  y: { es: 'y', en: 'and' },
  por_ejemplo: { es: 'Por ejemplo,', en: 'For example,' },
  no_cuenta: { es: 'no cuenta:', en: 'does not count:' },
  // Consejos por defecto (cada práctica puede dar el suyo)
  consejo_todos: {
    es: 'Lo de dentro del paréntesis se hace primero. Prueba a rodear dos números seguidos (o más) y calcula; cada resultado distinto es uno nuevo.',
    en: 'The inside of the brackets is worked out first. Try putting brackets around two or more numbers next to each other and work it out; each different result is a new one.',
  },
  consejo_diana: {
    es: n => `Lo de dentro del paréntesis se hace primero. Prueba a rodear dos números seguidos (o más) y calcula, hasta que salga ${n}; vale cualquier colocación que lo dé.`,
    en: n => `The inside of the brackets is worked out first. Try putting brackets around two or more numbers next to each other and work it out, until you get ${n}; any placement that gives it is right.`,
  },
};
