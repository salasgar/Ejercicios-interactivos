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

import { nivelDe, nivelForzado } from '../_comun/nivel.js';
import { elegirNivel } from './logica.js';

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
//
// Niveles (tarea 143, 2026-11-06): cada frase es [texto, palabra buena, motivo, nivel].
// 1, lo que el alumno ve a simple vista (¿ ¡ o un relativo sencillo); 2, las preguntas
// metidas en la frase («No sé qué hacer») y los «que» que no preguntan nada; 3, lo fino
// (la pregunta indirecta dentro de otra pregunta, «quien» explicativo, «donde» de lugar).
// Lo nuevo va siempre al FINAL de su lista (la clave del ítem es la posición).
export const INTERROGATIVOS = [
  ['¿_ hora es?', 'qué', 'pregunta', 1],
  ['Oye, ¿_ has hecho el fin de semana?', 'qué', 'pregunta', 1],
  ['¿_ se escribe esta palabra?', 'cómo', 'pregunta', 1],
  ['Mamá, ¿_ están mis zapatillas?', 'dónde', 'pregunta', 1],
  ['¿Y _ es el examen?', 'cuándo', 'pregunta', 1],
  ['¿_ ha llamado por teléfono?', 'quién', 'pregunta', 1],
  ['¿_ de los dos te gusta más?', 'cuál', 'pregunta', 1],
  ['No sé _ hacer con este ejercicio.', 'qué', 'indirecta', 2],
  ['No sé _ se hace este problema.', 'cómo', 'indirecta', 2],
  ['No sé _ he dejado el móvil.', 'dónde', 'indirecta', 2],
  ['No sé _ ha sido.', 'quién', 'indirecta', 2],
  ['No sé _ elegir: los dos me gustan.', 'cuál', 'indirecta', 2],
  ['Mi hermana dice _ examen era difícil.', 'qué', 'indirecta', 3],
  ['¡_ frío hace hoy!', 'qué', 'exclamacion', 1],
  ['¡_ llueve!', 'cómo', 'exclamacion', 1],
  ['¡_ bonito es tu dibujo!', 'qué', 'exclamacion', 1],
  // Sin tilde, también dentro de una pregunta.
  ['El libro _ me prestaste es muy bueno.', 'que', 'no', 1],
  ['¿Sabes _ mañana no hay clase?', 'que', 'no', 2],
  ['¿Crees _ lloverá mañana?', 'que', 'no', 2],
  ['Mi hermana dice _ el examen era difícil.', 'que', 'no', 2],
  ['_ voy a ir, no me importa.', 'como', 'causa', 3],
  ['Lo he hecho _ me dijiste.', 'como', 'no', 1],
  ['Mi primo es alto _ su padre.', 'como', 'no', 1],
  ['Esta es la casa _ vive mi abuela.', 'donde', 'no', 1],
  ['Llámame _ llegues a casa.', 'cuando', 'no', 1],
  ['¿Vienes al parque _ acabes los deberes?', 'cuando', 'no', 2],
  ['Puedes jugar con _ quieras.', 'quien', 'no', 1],
  ['Hazlo _ quieras.', 'como', 'no', 1],
  // Añadidas en la tarea 143. Nivel 2:
  ['No sé _ me ha escrito esta nota.', 'quién', 'indirecta', 2],
  ['Mi madre dice _ la cena está lista.', 'que', 'no', 2],
  ['Mi amigo cree _ el partido es hoy.', 'que', 'no', 2],
  // Nivel 3: la pregunta indirecta dentro de una pregunta («¿Sabes qué…?»; «¿Sabes que…?» ya está en el nivel 2)…
  ['¿Sabes _ hora es?', 'qué', 'pregunta', 3],
  ['¿Sabes _ es la fiesta?', 'cuándo', 'pregunta', 3],
  ['¿Sabes _ ha dejado esta nota?', 'quién', 'pregunta', 3],
  ['¿Sabes _ está mi cuaderno?', 'dónde', 'pregunta', 3],
  ['¿Sabes _ se llama la profesora nueva?', 'cómo', 'pregunta', 3],
  // … y los relativos de lugar, de persona y de modo sin tilde.
  ['La casa _ nació mi madre es muy vieja.', 'donde', 'no', 3],
  ['La persona con _ hablé era muy amable.', 'quien', 'no', 3],
  ['Mi tío, _ vive en Madrid, vendrá mañana.', 'quien', 'no', 3],
  ['Hice la tarea tal _ me dijiste.', 'como', 'no', 3],
  ['Guardo el cuaderno _ me dijiste.', 'donde', 'no', 3],
];

// Motivo del ejercicio 9: `null` (el motivo es la propia palabra buena: sé, se, sí, si…).
// Cada frase es [texto, palabra buena, null, nivel]. Niveles (tarea 143): 1, sé / se,
// tu / tú, el / él, mi / mí y más en frases corrientes; 2, sí / si y las que piden pensar
// quién es la persona; 3, el contraste («él sí quiere ir») y el «si» que pregunta.
export const DIACRITICAS = [
  ['Yo no _ nadar.', 'sé', null, 1],
  ['Ya _ la respuesta.', 'sé', null, 1],
  ['No lo _: pregúntale a Pablo.', 'sé', null, 1],
  ['El vaso _ ha roto.', 'se', null, 1],
  ['Mi hermano _ ha comprado una bici.', 'se', null, 1],
  ['¿Cómo _ llama tu perro?', 'se', null, 1],
  ['Le pregunté si venía y me dijo que _.', 'sí', null, 2],
  ['_ ha hecho los deberes; no le suspendas.', 'sí', null, 3],
  ['Eso _ que me gusta.', 'sí', null, 2],
  ['No vamos a la playa _ llueve.', 'si', null, 2],
  ['Te llamo _ necesito ayuda.', 'si', null, 2],
  ['Pregúntale _ quiere venir.', 'si', null, 3],
  ['¿Vienes _ también?', 'tú', null, 1],
  ['Eso lo has dicho _.', 'tú', null, 2],
  ['¿Dónde está _ mochila?', 'tu', null, 1],
  ['Ayer vi a _ hermano en el parque.', 'tu', null, 1],
  ['Este regalo es para _.', 'él', null, 1],
  ['Ayer hablé con _ por teléfono.', 'él', null, 2],
  ['Mañana es _ examen de Matemáticas.', 'el', null, 1],
  ['Dale _ libro a Marta.', 'el', null, 1],
  ['¿Esto es para _?', 'mí', null, 2],
  ['Siéntate al lado de _.', 'mí', null, 2],
  ['Esta es _ casa.', 'mi', null, 1],
  ['Me lo regaló _ abuela.', 'mi', null, 1],
  ['Quiero _ agua, por favor.', 'más', null, 1],
  ['Lucía corre _ que yo.', 'más', null, 1],
  ['Hoy tengo _ deberes que ayer.', 'más', null, 1],
  // Añadidas en la tarea 143. Nivel 2 (con «si» sin tilde):
  ['Iremos al parque _ no llueve.', 'si', null, 2],
  ['Te presto el balón _ me lo devuelves.', 'si', null, 2],
  // Nivel 3: «si» que pregunta…
  ['No sé _ vendrá mañana.', 'si', null, 3],
  ['Me preguntó _ tenía hambre.', 'si', null, 3],
  ['No recuerdo _ cerré la puerta.', 'si', null, 3],
  ['Comprueba _ está abierta la tienda.', 'si', null, 3],
  // … y el contraste con «sí» y «mí».
  ['Ayer no vino, pero hoy _ ha venido.', 'sí', null, 3],
  ['Tú dices que no, pero él _ quiere ir.', 'sí', null, 3],
  ['Nunca me llamas, pero ella _ me llama.', 'sí', null, 3],
  ['No es para ti, es para _.', 'mí', null, 3],
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

/**
 * Preguntas de sí o no (Juan Luis, 2026-10-25): qué contestar según la tilde de la pregunta.
 * El contexto dice de quién es la silla («de tu vecina», no solo «prestada»): si no,
 * se podría defender que la silla que usas es «tu silla» y que la respuesta es sí.
 */
export const PREGUNTAS = [
  {
    contexto: 'Tu vecina te ha prestado una silla suya, y te la llevarás para ver el desfile.',
    pregunta: '¿Llevarás tu silla?',
    respuesta: 'no',
    por: '«Tu silla», sin tilde, es la silla que es <b>tuya</b>. La que llevas es de tu vecina, así que la respuesta es <b>no</b>.',
  },
  {
    contexto: 'Tu vecina te ha prestado una silla suya, y te la llevarás para ver el desfile.',
    pregunta: '¿Llevarás tú silla?',
    respuesta: 'sí',
    por: '«Tú», con tilde, es la <b>persona</b>: te preguntan si <b>tú</b> llevarás una silla. La respuesta es <b>sí</b>: llevas la de tu vecina.',
  },
];

/** La frase n de un grupo: { antes, despues, buena, opciones: [sin, con], motivo, nivel }. */
export function frase(grupo, n) {
  const [texto, buena, motivo, nivel] = LISTAS[grupo][n];
  const [antes, despues] = texto.split('_');
  return { antes, despues, buena, motivo: motivo ?? buena, opciones: parejaDe(buena), nivel };
}

/** ¿Va al principio de la frase (tras ¿ o ¡)? Entonces los botones van con mayúscula. */
export const alPrincipio = (grupo, n) => /^[¿¡]?$/.test(frase(grupo, n).antes);
export const mayuscula = p => p.charAt(0).toUpperCase() + p.slice(1);

/**
 * Los ítems que no son de hueco de un grupo: pares de significado y, en el 9, las de sí o no.
 * Todos son del nivel 3 (tarea 143): hay que fijarse en la tilde y en lo que quiere decir.
 */
const extrasDe = grupo => [
  ...PARES[grupo].map((_, i) => ({ tipo: 'par', i, nivel: 3 })),
  ...(grupo === 'diacriticas' ? PREGUNTAS.map((_, i) => ({ tipo: 'pregunta', i, nivel: 3 })) : []),
];

/** Proporción de ítems que no son de hueco. */
export const PROPORCION_EXTRAS = 0.25;

/**
 * Generador. Hueco ({ tipo: 'hueco', grupo, n, nivel }): mitad con tilde y mitad sin,
 * para que contestar siempre lo mismo no sirva; dentro de cada mitad, por niveles. Uno
 * de cada cuatro, más o menos, es un par de significado ({ tipo: 'par', grupo, i, cual,
 * orden, nivel }) o una pregunta de sí o no ({ tipo: 'pregunta', grupo, i, nivel }); esos
 * son del nivel 3, así que solo salen a quien ha llegado al nivel 3 (o sin `sesion`).
 */
export function generadorTilde(grupo) {
  const lista = LISTAS[grupo];
  const banco = conTilde => lista
    .map(([, buena, , nivel], n) => ({ n, nivel, tilde: buena !== quitarTilde(buena) }))
    .filter(f => f.tilde === conTilde);
  const conTilde = banco(true);
  const sinTilde = banco(false);
  const extras = extrasDe(grupo);
  return (rng, sesion) => {
    // Sin `sesion` no hay nivel que respetar; con ella, los extras solo cuentan si el alumno llega al 3.
    const hayExtras = sesion === undefined || nivelDe(sesion, { forzado: nivelForzado() }) >= 3;
    if (hayExtras && rng.azar() < PROPORCION_EXTRAS) {
      const { item: e, nivel } = elegirNivel(rng, extras, sesion);
      return e.tipo === 'par'
        ? { tipo: 'par', grupo, i: e.i, cual: rng.entero(0, 1), orden: rng.barajar([0, 1]), nivel }
        : { tipo: 'pregunta', grupo, i: e.i, nivel };
    }
    // Sin extras (niveles 1 y 2) los huecos son todos: la proporción de los extras es la de los ítems que pueden salir.
    const { item, nivel } = elegirNivel(rng, rng.azar() < 0.5 ? conTilde : sinTilde, sesion);
    return { tipo: 'hueco', grupo, n: item.n, nivel };
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
