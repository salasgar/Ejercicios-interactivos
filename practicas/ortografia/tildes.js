// Ortografía española: tildes (ejercicios 8 y 9). Puro, como logica.js.
// Salen del análisis de los correos de los alumnos (2026-10-23).
//
//   8. Interrogativos y exclamativos: qué / que, cómo / como, dónde / donde,
//      cuándo / cuando, quién / quien, cuál / cual.
//   9. Tilde diacrítica: sé / se, sí / si, tú / tu, él / el, mí / mi, más.
//
// Cada frase: [texto con un hueco «_», la palabra buena, el motivo]. Los botones
// son la palabra sin tilde y con tilde. Regla de oro: con la otra palabra la
// frase tiene que quedar MAL, no solo rara. Por eso las preguntas indirectas
// son de las que no admiten otra lectura («No sé qué hacer»: «No sé que hacer»
// no se puede decir); nada de «Dime _ quieres», «Pregúntale _ viene» ni
// «Me gusta _ cantas», que valen de las dos maneras.

/** La pareja sin tilde / con tilde de cada palabra. */
export const PAREJA_DE = {
  que: ['que', 'qué'], como: ['como', 'cómo'], donde: ['donde', 'dónde'], cuando: ['cuando', 'cuándo'],
  quien: ['quien', 'quién'], cual: ['cual', 'cuál'],
  se: ['se', 'sé'], si: ['si', 'sí'], tu: ['tu', 'tú'], el: ['el', 'él'], mi: ['mi', 'mí'], mas: ['mas', 'más'],
};

/** Sin tilde → clave de la pareja. */
const quitarTilde = p => p.normalize('NFD').replace(/[́]/g, '').normalize('NFC').toLowerCase();
export const parejaDe = palabra => PAREJA_DE[quitarTilde(palabra)];

// Motivos del ejercicio 8: pregunta, indirecta, exclamacion, no (no pregunta ni exclama).
export const INTERROGATIVOS = [
  ['¿_ hora es?', 'qué', 'pregunta'],
  ['Oye, ¿_ has hecho el fin de semana?', 'qué', 'pregunta'],
  ['¿_ se escribe esta palabra?', 'cómo', 'pregunta'],
  ['Mamá, ¿_ están mis zapatillas?', 'dónde', 'pregunta'],
  ['¿Y _ es el examen?', 'cuándo', 'pregunta'],
  ['¿_ ha llamado por teléfono?', 'quién', 'pregunta'],
  ['¿_ de los dos te gusta más?', 'cuál', 'pregunta'],
  ['No sé _ hacer con este ejercicio.', 'qué', 'indirecta'],
  ['No sé _ se hace este problema.', 'cómo', 'indirecta'],
  ['No sé _ he dejado el móvil.', 'dónde', 'indirecta'],
  ['No sé _ ha sido.', 'quién', 'indirecta'],
  ['No sé _ elegir: los dos me gustan.', 'cuál', 'indirecta'],
  ['Mi hermana dice _ examen era difícil.', 'qué', 'indirecta'],
  ['¡_ frío hace hoy!', 'qué', 'exclamacion'],
  ['¡_ llueve!', 'cómo', 'exclamacion'],
  ['¡_ bonito es tu dibujo!', 'qué', 'exclamacion'],
  // Sin tilde, también dentro de una pregunta.
  ['El libro _ me prestaste es muy bueno.', 'que', 'no'],
  ['¿Sabes _ mañana no hay clase?', 'que', 'no'],
  ['¿Crees _ lloverá mañana?', 'que', 'no'],
  ['Mi hermana dice _ el examen era difícil.', 'que', 'no'],
  ['_ voy a ir, no me importa.', 'como', 'causa'],
  ['Lo he hecho _ me dijiste.', 'como', 'no'],
  ['Mi primo es alto _ su padre.', 'como', 'no'],
  ['Esta es la casa _ vive mi abuela.', 'donde', 'no'],
  ['Llámame _ llegues a casa.', 'cuando', 'no'],
  ['¿Vienes al parque _ acabes los deberes?', 'cuando', 'no'],
  ['Puedes jugar con _ quieras.', 'quien', 'no'],
  ['Hazlo _ quieras.', 'como', 'no'],
];

// Motivos del ejercicio 9: el nombre de la palabra buena (sé, se, sí, si…).
export const DIACRITICAS = [
  ['Yo no _ nadar.', 'sé'],
  ['Ya _ la respuesta.', 'sé'],
  ['No lo _: pregúntale a Pablo.', 'sé'],
  ['El vaso _ ha roto.', 'se'],
  ['Mi hermano _ ha comprado una bici.', 'se'],
  ['¿Cómo _ llama tu perro?', 'se'],
  ['Le pregunté si venía y me dijo que _.', 'sí'],
  ['_ ha hecho los deberes; no le suspendas.', 'sí'],
  ['Eso _ que me gusta.', 'sí'],
  ['No vamos a la playa _ llueve.', 'si'],
  ['Te llamo _ necesito ayuda.', 'si'],
  ['Pregúntale _ quiere venir.', 'si'],
  ['¿Vienes _ también?', 'tú'],
  ['Eso lo has dicho _.', 'tú'],
  ['¿Dónde está _ mochila?', 'tu'],
  ['Ayer vi a _ hermano en el parque.', 'tu'],
  ['Este regalo es para _.', 'él'],
  ['Ayer hablé con _ por teléfono.', 'él'],
  ['Mañana es _ examen de Matemáticas.', 'el'],
  ['Dale _ libro a Marta.', 'el'],
  ['¿Esto es para _?', 'mí'],
  ['Siéntate al lado de _.', 'mí'],
  ['Esta es _ casa.', 'mi'],
  ['Me lo regaló _ abuela.', 'mi'],
  ['Quiero _ agua, por favor.', 'más'],
  ['Lucía corre _ que yo.', 'más'],
  ['Hoy tengo _ deberes que ayer.', 'más'],
];

const LISTAS = { interrogativos: INTERROGATIVOS, diacriticas: DIACRITICAS };
export const listaDe = grupo => LISTAS[grupo];

// Pares de Juan Luis (2026-10-25): dos frases correctas que dicen cosas distintas
// según la tilde. Van como «¿Qué frase dice esto?», no como hueco, porque en
// el hueco valdrían las dos. Solo los que no admiten otra lectura están también
// como hueco, arriba («Mi hermana dice _ examen…», «_ voy a ir, no me importa»,
// «_ ha hecho los deberes; no le suspendas»). «Cómo voy a ir no me importa» y
// «Si ha hecho los deberes, no le suspendas» no van como hueco: sin la coma, o
// con ella, la otra palabra se podría defender.
export const PARES = {
  interrogativos: [
    {
      frases: ['Mi hermana dice qué examen era difícil.', 'Mi hermana dice que el examen era difícil.'],
      sentidos: ['Tu hermana cuenta cuál de los exámenes era el difícil.', 'Tu hermana opina que el examen era difícil.'],
      por: '«Dice qué examen…» cuenta cuál (¿qué examen?): pregunta metida en la frase, con tilde. En «dice que el examen…», el «que» solo une: sin tilde.',
    },
    {
      frases: ['Como voy a ir, no me importa.', 'Cómo voy a ir no me importa.'],
      sentidos: ['No te importa porque de todas formas vas a ir.', 'Te da igual la manera de ir: andando, en coche o en autobús.'],
      por: 'En «Como voy a ir, no me importa», «como» quiere decir «ya que»: sin tilde. En «Cómo voy a ir no me importa» está la pregunta «¿cómo voy a ir?», metida en la frase: con tilde.',
    },
  ],
  diacriticas: [
    {
      frases: ['Sí ha hecho los deberes; no le suspendas.', 'Si ha hecho los deberes, no le suspendas.'],
      sentidos: ['Sabes que ha hecho los deberes, y por eso pides que no le suspendan.', 'No sabes si ha hecho los deberes: pides que no le suspendan solo en el caso de que los haya hecho.'],
      por: '«Sí ha hecho…»: «sí» afirma (sí que los ha hecho), con tilde. «Si ha hecho…»: pone una condición, sin tilde.',
    },
  ],
};

/** Preguntas de sí o no (Juan Luis, 2026-10-25): qué contestar según la tilde de la pregunta. */
export const PREGUNTAS = [
  {
    contexto: 'Has pedido prestada una silla y te la llevarás para ver el desfile.',
    pregunta: '¿Llevarás tu silla?',
    respuesta: 'no',
    por: '«Tu silla», sin tilde, es la silla que es <b>tuya</b>. La que llevas es prestada, así que la respuesta es <b>no</b>.',
  },
  {
    contexto: 'Has pedido prestada una silla y te la llevarás para ver el desfile.',
    pregunta: '¿Llevarás tú silla?',
    respuesta: 'sí',
    por: '«Tú», con tilde, es la <b>persona</b>: te preguntan si <b>tú</b> llevarás una silla. La respuesta es <b>sí</b>: llevas la prestada.',
  },
];

/** La frase n de un grupo: { antes, despues, buena, opciones: [sin, con], motivo }. */
export function frase(grupo, n) {
  const [texto, buena, motivo = buena] = LISTAS[grupo][n];
  const [antes, despues] = texto.split('_');
  return { antes, despues, buena, motivo, opciones: parejaDe(buena) };
}

/** ¿Va al principio de la frase (tras ¿ o ¡)? Entonces los botones van con mayúscula. */
export const alPrincipio = (grupo, n) => /^[¿¡]?$/.test(frase(grupo, n).antes);
export const mayuscula = p => p.charAt(0).toUpperCase() + p.slice(1);

/** Los ítems que no son de hueco de un grupo: pares de significado y, en el 9, las de sí o no. */
const extrasDe = grupo => [
  ...PARES[grupo].map((_, i) => ({ tipo: 'par', i })),
  ...(grupo === 'diacriticas' ? PREGUNTAS.map((_, i) => ({ tipo: 'pregunta', i })) : []),
];

/** Proporción de ítems que no son de hueco. */
export const PROPORCION_EXTRAS = 0.25;

/**
 * Generador. Hueco ({ tipo: 'hueco', grupo, n }): mitad con tilde y mitad sin,
 * para que contestar siempre lo mismo no sirva. Uno de cada cuatro, más o
 * menos, es un par de significado ({ tipo: 'par', grupo, i, cual, orden }) o
 * una pregunta de sí o no ({ tipo: 'pregunta', grupo, i }).
 */
export function generadorTilde(grupo) {
  const lista = LISTAS[grupo];
  const conTilde = lista.map((f, n) => (f[1] !== quitarTilde(f[1]) ? n : -1)).filter(n => n >= 0);
  const sinTilde = lista.map((f, n) => (f[1] === quitarTilde(f[1]) ? n : -1)).filter(n => n >= 0);
  const extras = extrasDe(grupo);
  return rng => {
    if (rng.azar() < PROPORCION_EXTRAS) {
      const e = rng.elegir(extras);
      return e.tipo === 'par'
        ? { tipo: 'par', grupo, i: e.i, cual: rng.entero(0, 1), orden: rng.barajar([0, 1]) }
        : { tipo: 'pregunta', grupo, i: e.i };
    }
    return { tipo: 'hueco', grupo, n: rng.elegir(rng.azar() < 0.5 ? conTilde : sinTilde) };
  };
}

/** Explicación de un par o de una pregunta de sí o no. */
export function explicacionExtra(item) {
  if (item.tipo === 'pregunta') return PREGUNTAS[item.i].por;
  const p = PARES[item.grupo][item.i];
  return `<i>${p.frases[item.cual]}</i> ${p.por}`;
}

const SIGNIFICA = {
  que: 'une dos partes de la frase', como: 'quiere decir «de la manera en que» o «igual que»',
  donde: 'quiere decir «en el sitio en que»', cuando: 'quiere decir «en el momento en que»',
  quien: 'quiere decir «la persona que»',
};

const DIACRITICA = {
  'sé': 'del verbo <b>saber</b> (yo sé, tú sabes). Truco: se puede cambiar por «sabes»',
  se: 'la palabra de «se ha roto», «se llama»: no es del verbo saber',
  'sí': 'para <b>afirmar</b> (sí = lo contrario de no)',
  si: 'pone una <b>condición</b> («si llueve…») o pregunta algo («pregúntale si quiere»)',
  'tú': 'la <b>persona</b> (tú vienes). Truco: se puede cambiar por «yo»',
  tu: 'va delante de una cosa y dice de quién es (tu mochila). Truco: se puede cambiar por «mi»',
  'él': 'la <b>persona</b> (él vino). Truco: se puede cambiar por «ella»',
  el: 'el artículo, delante de un nombre (el perro, el examen)',
  'mí': 'la <b>persona</b>, detrás de «para», «a», «de»… (para mí). Truco: se puede cambiar por «ti»',
  mi: 'va delante de una cosa y dice de quién es (mi casa). Truco: se puede cambiar por «tu»',
  'más': 'de <b>cantidad</b> (más agua, más alto). Lleva tilde',
};

/** La explicación (HTML; los textos son nuestros). */
export function explicacionTilde(grupo, n) {
  const { buena, motivo, despues } = frase(grupo, n);
  const b = alPrincipio(grupo, n) ? mayuscula(buena) : buena;
  if (grupo === 'interrogativos') {
    if (motivo === 'pregunta') return `Va <b>${b}</b>, con tilde: está preguntando.`;
    if (motivo === 'indirecta') {
      // La pregunta que lleva dentro: «Mi hermana dice qué examen era difícil» → «¿Qué examen era difícil?».
      const pregunta = `¿${mayuscula(buena)}${despues.split(/[:;,.]/)[0]}?`;
      return `Va <b>${b}</b>, con tilde: aunque no lleve ¿?, lleva dentro una pregunta: «${pregunta}».`;
    }
    if (motivo === 'exclamacion') return `Va <b>${b}</b>, con tilde: es una exclamación.`;
    if (motivo === 'causa') return `Va <b>${b}</b>, sin tilde: aquí no pregunta; quiere decir «ya que» («Ya que${despues}»).`;
    return `Va <b>${b}</b>, sin tilde: aquí no pregunta ni exclama; ${SIGNIFICA[buena]}.`;
  }
  return `Va <b>${b}</b>: ${DIACRITICA[buena]}.`;
}

/** Identificador del error de un par o de una pregunta de sí o no. */
export const idErrorExtra = item => (item.tipo === 'pregunta' ? 'tu-tu-significado' : 'tilde-significado');

/** Identificador del error de un hueco: «que-sin-tilde», «que-con-tilde-de-mas». */
export function idErrorTilde(grupo, n) {
  const { buena } = frase(grupo, n);
  const conTilde = buena !== quitarTilde(buena);
  return `${quitarTilde(buena)}-${conTilde ? 'sin-tilde' : 'con-tilde-de-mas'}`;
}
