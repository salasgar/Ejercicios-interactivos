// Ortografía española: las comas (ejercicios 6 y 7). Puro, como logica.js.
//
//   6. La coma del vocativo. Dos tipos de ítem, mitad y mitad:
//      - «escrita»: ¿cuál está bien escrita? (la buena y una o dos sin alguna coma)
//      - «significado»: dos frases que solo se diferencian en las comas y dicen
//        cosas distintas; se da lo que quiere decir una y hay que elegirla.
//   7. Comas que cambian el significado (sin vocativo): solo «significado».
//
// Regla de oro: en «escrita», las malas son la buena con alguna coma de menos
// (no admiten otra lectura correcta); en «significado», cada sentido lo dice
// UNA sola de las dos frases. Los tests comprueban que las frases de un ítem
// solo se diferencian en las comas; el sentido hay que revisarlo a mano.

import { elegirNivel } from './logica.js';

// Niveles (tarea 143, 2026-11-06): cada ítem de los bancos lleva `nivel` (1-3), y los
// generadores eligen con `elegirNivel` (logica.js). Lo nuevo va siempre al FINAL de su lista.

/**
 * Ejercicio 6, tipo «escrita»: [la buena, ...malas], y el vocativo de la frase.
 * Nivel (tarea 143): 1, el vocativo al principio; 2, al final; 3, en medio (dos comas).
 */
export const VOCATIVO_ESCRITA = [
  { nivel: 1, voc: 'Lucía', frases: ['Lucía, ven aquí.', 'Lucía ven aquí.'] },
  { nivel: 1, voc: 'Mamá', frases: ['Mamá, ¿has visto mis zapatillas?', 'Mamá ¿has visto mis zapatillas?'] },
  { nivel: 2, voc: 'profesora', frases: ['Gracias por todo, profesora.', 'Gracias por todo profesora.'] },
  { nivel: 3, voc: 'Marcos', frases: ['Oye, Marcos, ¿me dejas un lápiz?', 'Oye, Marcos ¿me dejas un lápiz?', 'Oye Marcos ¿me dejas un lápiz?'] },
  { nivel: 2, voc: 'chicos', frases: ['Buenos días, chicos.', 'Buenos días chicos.'] },
  { nivel: 2, voc: 'papá', frases: ['¿Me ayudas con los deberes, papá?', '¿Me ayudas con los deberes papá?'] },
  { nivel: 2, voc: 'Pablo', frases: ['Hola, Pablo.', 'Hola Pablo.'] },
  { nivel: 1, voc: 'Pedro', frases: ['Pedro, no toques eso.', 'Pedro no toques eso.'] },
  { nivel: 3, voc: 'niños', frases: ['Venid aquí, niños, que empieza la película.', 'Venid aquí niños, que empieza la película.', 'Venid aquí, niños que empieza la película.'] },
  { nivel: 1, voc: 'Abuelo', frases: ['Abuelo, te quiero mucho.', 'Abuelo te quiero mucho.'] },
  { nivel: 3, voc: 'Sara', frases: ['Por favor, Sara, escúchame.', 'Por favor, Sara escúchame.', 'Por favor Sara, escúchame.'] },
  { nivel: 2, voc: 'Ana', frases: ['Feliz cumpleaños, Ana.', 'Feliz cumpleaños Ana.'] },
  { nivel: 2, voc: 'Laura', frases: ['¿Vienes al parque, Laura?', '¿Vienes al parque Laura?'] },
  { nivel: 3, voc: 'señor', frases: ['Perdone, señor, ¿qué hora es?', 'Perdone señor, ¿qué hora es?', 'Perdone, señor ¿qué hora es?'] },
];

/**
 * Parejas de «significado»: dos frases (solo cambian las comas), lo que dice
 * cada una y por qué. `contexto` (opcional) es lo que se ha dicho antes.
 */
export const VOCATIVO_SIGNIFICADO = [
  {
    nivel: 1,
    frases: ['Vamos a comer, niños.', 'Vamos a comer niños.'],
    sentidos: ['Hablas con los niños: los llamas para comer.', 'Los niños son la comida.'],
    por: 'Con coma, «niños» son las personas a las que hablas (vocativo). Sin coma, «niños» es lo que se come.',
  },
  {
    nivel: 2,
    frases: ['Ahora pinta, Juan.', 'Ahora pinta Juan.'],
    sentidos: ['Hablas con Juan: le pides que pinte.', 'Cuentas que el que pinta ahora es Juan.'],
    por: 'Con coma, «Juan» es la persona a la que hablas (vocativo), y «pinta» es una orden. Sin coma, Juan es el que pinta.',
  },
  {
    nivel: 2,
    frases: ['Hoy juega, Pedro.', 'Hoy juega Pedro.'],
    sentidos: ['Hablas con Pedro: le dices que hoy juegue.', 'Cuentas que hoy el que juega es Pedro.'],
    por: 'Con coma, «Pedro» es la persona a la que hablas (vocativo). Sin coma, Pedro es el que juega.',
  },
  {
    nivel: 1,
    frases: ['Saluda, Lucía.', 'Saluda Lucía.'],
    sentidos: ['Hablas con Lucía: le pides que salude.', 'Cuentas que la que saluda es Lucía.'],
    por: 'Con coma, «Lucía» es la persona a la que hablas (vocativo). Sin coma, Lucía es la que saluda.',
  },
  {
    nivel: 3,
    frases: ['Llama, Marcos, a tu madre.', 'Llama Marcos a tu madre.'],
    sentidos: ['Hablas con Marcos: le pides que llame a su madre.', 'Cuentas que Marcos llama a tu madre.'],
    por: 'Con las dos comas, «Marcos» es la persona a la que hablas (vocativo). Sin comas, Marcos es el que llama.',
  },
  {
    nivel: 3,
    frases: ['Escucha, Ana, esta canción.', 'Escucha Ana esta canción.'],
    sentidos: ['Hablas con Ana: le pides que escuche la canción.', 'Cuentas que Ana escucha esta canción.'],
    por: 'Con las dos comas, «Ana» es la persona a la que hablas (vocativo). Sin comas, Ana es la que escucha.',
  },
  {
    nivel: 2,
    frases: ['Sigue, Pablo.', 'Sigue Pablo.'],
    sentidos: ['Hablas con Pablo: le pides que siga.', 'Cuentas que el siguiente es Pablo.'],
    por: 'Con coma, «Pablo» es la persona a la que hablas (vocativo). Sin coma, quiere decir que ahora le toca a Pablo.',
  },
];

export const COMAS_SIGNIFICADO = [
  {
    nivel: 1,
    contexto: '—¿Has comido ya?',
    frases: ['—No, tengo hambre.', '—No tengo hambre.'],
    sentidos: ['Contestas que todavía no has comido y que tienes hambre.', 'Dices que no tienes hambre.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «tengo hambre». Sin coma, el «no» va con «tengo hambre» y lo niega.',
  },
  {
    nivel: 1,
    contexto: '—¿Te ayudo a cruzar la piscina?',
    frases: ['—No, sé nadar.', '—No sé nadar.'],
    sentidos: ['No quieres ayuda, porque sabes nadar.', 'Dices que no sabes nadar.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «sé nadar». Sin coma, el «no» va con «sé nadar» y lo niega.',
  },
  {
    nivel: 1,
    contexto: '—¿Te quedas en casa?',
    frases: ['—No, voy a ir.', '—No voy a ir.'],
    sentidos: ['No te quedas en casa: sí que vas a ir.', 'Dices que no vas a ir.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «voy a ir». Sin coma, el «no» va con «voy a ir» y lo niega.',
  },
  {
    nivel: 1,
    contexto: '—¿Te molesta la música?',
    frases: ['—No, me gusta.', '—No me gusta.'],
    sentidos: ['No te molesta: te gusta.', 'Dices que la música no te gusta.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «me gusta». Sin coma, el «no» va con «me gusta» y lo niega.',
  },
  {
    nivel: 2,
    contexto: '—¿Te ayudo con la mochila?',
    frases: ['—No, puedo yo solo.', '—No puedo yo solo.'],
    sentidos: ['No quieres ayuda: puedes tú solo.', 'Dices que tú solo no puedes.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «puedo yo solo». Sin coma, el «no» va con «puedo» y lo niega.',
  },
  {
    nivel: 3,
    contexto: 'Un rey escribe una nota sobre un preso.',
    frases: ['Perdón imposible, que cumpla su condena.', 'Perdón, imposible que cumpla su condena.'],
    sentidos: ['El rey no perdona al preso.', 'El rey perdona al preso.'],
    por: 'La coma separa las ideas. «Perdón imposible, que cumpla su condena»: no hay perdón. «Perdón, imposible que cumpla su condena»: hay perdón, y es imposible que cumpla la condena.',
  },
  {
    nivel: 3,
    frases: ['Los alumnos, que estudiaron, aprobaron.', 'Los alumnos que estudiaron aprobaron.'],
    sentidos: ['Todos los alumnos estudiaron, y todos aprobaron.', 'Solo aprobaron los alumnos que estudiaron; otros no.'],
    por: 'Entre comas, «que estudiaron» explica algo de TODOS los alumnos. Sin comas, dice CUÁLES: solo los que estudiaron.',
  },
  {
    nivel: 3,
    frases: ['Las niñas, que llevaban abrigo, no pasaron frío.', 'Las niñas que llevaban abrigo no pasaron frío.'],
    sentidos: ['Todas las niñas llevaban abrigo, y ninguna pasó frío.', 'Solo las niñas con abrigo no pasaron frío; otras sí.'],
    por: 'Entre comas, «que llevaban abrigo» explica algo de TODAS las niñas. Sin comas, dice CUÁLES: solo las que llevaban abrigo.',
  },
  {
    nivel: 3,
    frases: ['Los perros, que ladraban, despertaron al vecino.', 'Los perros que ladraban despertaron al vecino.'],
    sentidos: ['Todos los perros ladraban, y despertaron al vecino.', 'Solo los perros que ladraban despertaron al vecino; otros estaban callados.'],
    por: 'Entre comas, «que ladraban» explica algo de TODOS los perros. Sin comas, dice CUÁLES: solo los que ladraban.',
  },
  // Añadidas en la tarea 143 (nivel 2): la misma coma tras el «no», con una respuesta algo más larga.
  {
    nivel: 2,
    contexto: '—¿Te da miedo la película?',
    frases: ['—No, me divierte.', '—No me divierte.'],
    sentidos: ['No te da miedo: te divierte.', 'Dices que la película no te divierte.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «me divierte». Sin coma, el «no» va con «me divierte» y lo niega.',
  },
  {
    nivel: 2,
    contexto: '—¿Te molesta que abra la ventana?',
    frases: ['—No, me gusta el aire.', '—No me gusta el aire.'],
    sentidos: ['No te molesta: te gusta el aire.', 'Dices que no te gusta el aire.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «me gusta el aire». Sin coma, el «no» va con «me gusta el aire» y lo niega.',
  },
  {
    nivel: 2,
    contexto: '—¿Tienes frío?',
    frases: ['—No, tengo calor.', '—No tengo calor.'],
    sentidos: ['No tienes frío: tienes calor.', 'Dices que no tienes calor.'],
    por: 'Con coma, el «no» contesta a la pregunta y después viene otra idea: «tengo calor». Sin coma, el «no» va con «tengo calor» y lo niega.',
  },
];

const GRUPOS = { vocativo: VOCATIVO_SIGNIFICADO, comas: COMAS_SIGNIFICADO };
export const grupo = nombre => GRUPOS[nombre];

/** El banco de `elegirNivel`: el índice y el nivel de cada ítem de una lista. */
const bancoDe = lista => lista.map(({ nivel }, i) => ({ i, nivel }));

/**
 * Ítem «significado»: { tipo, grupo, i, cual, orden, nivel } (cual = la frase que hay que elegir;
 * orden = cómo salen). Cada pareja da dos preguntas distintas, una por `cual`.
 */
function itemSignificado(rng, nombre, sesion) {
  const { item, nivel } = elegirNivel(rng, bancoDe(GRUPOS[nombre]), sesion);
  return { tipo: 'significado', grupo: nombre, i: item.i, cual: rng.entero(0, 1), orden: rng.barajar([0, 1]), nivel };
}

/** Ítem «escrita»: { tipo, i, orden, nivel } (frase 0 = la buena). */
function itemEscrita(rng, sesion) {
  const { item, nivel } = elegirNivel(rng, bancoDe(VOCATIVO_ESCRITA), sesion);
  return { tipo: 'escrita', i: item.i, orden: rng.barajar(VOCATIVO_ESCRITA[item.i].frases.map((_, k) => k)), nivel };
}

/** Ejercicio 6: la coma del vocativo (mitad «escrita», mitad «significado»; dentro de cada una, por niveles). */
export function generarVocativo(rng, sesion) {
  return rng.azar() < 0.5 ? itemEscrita(rng, sesion) : itemSignificado(rng, 'vocativo', sesion);
}

/** Ejercicio 7: comas que cambian el significado. */
export function generarComas(rng, sesion) {
  return itemSignificado(rng, 'comas', sesion);
}

/** Las opciones del ítem, en el orden en que salen: [{ k, texto }]. */
export function opciones(item) {
  const frases = item.tipo === 'escrita' ? VOCATIVO_ESCRITA[item.i].frases : GRUPOS[item.grupo][item.i].frases;
  return item.orden.map(k => ({ k, texto: frases[k] }));
}

/** La opción buena (su índice k). */
export const buena = item => (item.tipo === 'escrita' ? 0 : item.cual);

/** Explicación (HTML sin escapar: los textos son nuestros). */
export function explicacionComa(item) {
  if (item.tipo === 'escrita') {
    const { voc, frases } = VOCATIVO_ESCRITA[item.i];
    const dos = frases.length > 2 ? ' Como va en medio de la frase, lleva una coma delante y otra detrás.' : '';
    return `Bien escrita: <i>${frases[0]}</i> «${voc}» es a quien se habla (vocativo), y se separa con coma del resto de la frase.${dos}`;
  }
  const p = GRUPOS[item.grupo][item.i];
  return `<i>${p.frases[item.cual]}</i> ${p.por}`;
}

/** Identificador del error para el panel. */
export function idErrorComa(item) {
  if (item.tipo === 'escrita') return 'vocativo-sin-coma';
  return item.grupo === 'vocativo' ? 'vocativo-significado' : 'coma-significado';
}
