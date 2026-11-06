// Ortografía española: signos ¿ ¡ y espacios (ejercicio 10). Puro, como logica.js.
// Sale de los correos de los alumnos (2026-10-23): preguntas sin ¿, «¿ De verdad»,
// «Hola,Juan Luis», «.Dime».
//
// «¿Cuál está bien escrita?»: la buena y dos malas, cada una con lo que le falla.
// Regla de oro: cada mala tiene un fallo claro, y solo uno. Nada de casos que la
// norma deja elegir (el vocativo dentro o fuera de la pregunta, «¿Si llueve, qué
// hacemos?»): todas las buenas llevan el signo donde empieza la pregunta.

import { elegirNivel } from './logica.js';

const FALTA_ABRE_P = 'le falta el ¿ del principio: en español la pregunta se abre y se cierra';
const FALTA_ABRE_E = 'le falta el ¡ del principio: en español la exclamación se abre y se cierra';
const ESPACIO_DENTRO = 'sobra un espacio: los signos ¿ ? ¡ ! van pegados a la primera y a la última palabra';
const CIERRE_AL_REVES = 'el signo del final está al revés: se abre con ¿ ¡ y se cierra con ? !';
const SIN_ESPACIO = 'falta un espacio: detrás de una coma, de un punto o de un signo de cierre va siempre un espacio';
const ESPACIO_ANTES = 'sobra un espacio: delante de una coma o de un punto no va espacio';

// Niveles (tarea 143, 2026-11-06): 1, una frase sola con ¿? o ¡!; 2, un vocativo o dos
// frases seguidas con un solo signo; 3, la coma y el punto, o ¿? y ¡! en la misma frase.
// Lo nuevo va al FINAL de la lista (la clave del ítem es la posición).
export const SIGNOS = [
  { nivel: 1, bien: '¿Vienes al cine?', malas: [['Vienes al cine?', FALTA_ABRE_P], ['¿ Vienes al cine?', ESPACIO_DENTRO]] },
  { nivel: 1, bien: '¡Qué frío hace!', malas: [['Qué frío hace!', FALTA_ABRE_E], ['¡ Qué frío hace !', ESPACIO_DENTRO]] },
  { nivel: 1, bien: '¿Cuándo es el examen?', malas: [['Cuándo es el examen?', FALTA_ABRE_P], ['¿Cuándo es el examen¿', CIERRE_AL_REVES]] },
  { nivel: 1, bien: '¡Feliz cumpleaños!', malas: [['Feliz cumpleaños!', FALTA_ABRE_E], ['¡Feliz cumpleaños¡', CIERRE_AL_REVES]] },
  { nivel: 2, bien: 'Profe, ¿el examen es el viernes?', malas: [['Profe, el examen es el viernes?', FALTA_ABRE_P], ['Profe,¿el examen es el viernes?', SIN_ESPACIO]] },
  { nivel: 2, bien: '¿Me ayudas? Es que no lo entiendo.', malas: [['Me ayudas? Es que no lo entiendo.', FALTA_ABRE_P], ['¿Me ayudas?Es que no lo entiendo.', SIN_ESPACIO]] },
  { nivel: 2, bien: 'Gracias. ¡Eres el mejor!', malas: [['Gracias. Eres el mejor!', FALTA_ABRE_E], ['Gracias.¡Eres el mejor!', SIN_ESPACIO]] },
  { nivel: 3, bien: '¿De verdad? ¡No me lo creo!', malas: [['¿ De verdad? ¡ No me lo creo!', ESPACIO_DENTRO], ['De verdad? No me lo creo!', 'le faltan los signos del principio: ¿ en la pregunta y ¡ en la exclamación']] },
  { nivel: 3, bien: 'Hola, Pablo, ¿qué tal?', malas: [['Hola,Pablo,¿qué tal?', SIN_ESPACIO], ['Hola , Pablo , ¿qué tal?', ESPACIO_ANTES]] },
  { nivel: 3, bien: 'He terminado. Mañana te lo enseño.', malas: [['He terminado.Mañana te lo enseño.', SIN_ESPACIO], ['He terminado .Mañana te lo enseño.', 'el espacio está en el lado equivocado: va detrás del punto, no delante']] },
  { nivel: 3, bien: 'Compré pan, leche y huevos.', malas: [['Compré pan,leche y huevos.', SIN_ESPACIO], ['Compré pan , leche y huevos.', ESPACIO_ANTES]] },
  { nivel: 3, bien: 'Vale, mañana te lo traigo.', malas: [['Vale,mañana te lo traigo.', SIN_ESPACIO], ['Vale ,mañana te lo traigo.', 'el espacio está en el lado equivocado: va detrás de la coma, no delante']] },
  { nivel: 2, bien: '¿Qué tenemos de deberes para mañana?', malas: [['Qué tenemos de deberes para mañana?', FALTA_ABRE_P], ['¿Qué tenemos de deberes para mañana ?', ESPACIO_DENTRO]] },
  { nivel: 2, bien: 'Mamá, ¡he aprobado!', malas: [['Mamá, he aprobado!', FALTA_ABRE_E], ['Mamá,¡he aprobado!', SIN_ESPACIO]] },
  // Añadidas en la tarea 143. Nivel 1:
  { nivel: 1, bien: '¿Qué hora es?', malas: [['Qué hora es?', FALTA_ABRE_P], ['¿Qué hora es ?', ESPACIO_DENTRO]] },
  { nivel: 1, bien: '¡Cuidado con el escalón!', malas: [['Cuidado con el escalón!', FALTA_ABRE_E], ['¡Cuidado con el escalón¡', CIERRE_AL_REVES]] },
  { nivel: 1, bien: '¿Dónde está mi mochila?', malas: [['Dónde está mi mochila?', FALTA_ABRE_P], ['¿ Dónde está mi mochila?', ESPACIO_DENTRO]] },
  { nivel: 1, bien: '¡Qué bonito dibujo!', malas: [['Qué bonito dibujo!', FALTA_ABRE_E], ['¡Qué bonito dibujo¡', CIERRE_AL_REVES]] },
  // Nivel 2:
  { nivel: 2, bien: 'Sara, ¿has visto mi estuche?', malas: [['Sara, has visto mi estuche?', FALTA_ABRE_P], ['Sara,¿has visto mi estuche?', SIN_ESPACIO]] },
  { nivel: 2, bien: '¡Hola! ¿Cómo estás?', malas: [['Hola! ¿Cómo estás?', FALTA_ABRE_E], ['¡Hola!¿Cómo estás?', SIN_ESPACIO]] },
  { nivel: 2, bien: 'Ven aquí. ¡Corre!', malas: [['Ven aquí. Corre!', FALTA_ABRE_E], ['Ven aquí.¡Corre!', SIN_ESPACIO]] },
  // Nivel 3:
  { nivel: 3, bien: 'Mira, mamá, ¡qué grande es!', malas: [['Mira, mamá, qué grande es!', FALTA_ABRE_E], ['Mira,mamá, ¡qué grande es!', SIN_ESPACIO]] },
  { nivel: 3, bien: 'Tengo un hermano, una hermana y un perro.', malas: [['Tengo un hermano,una hermana y un perro.', SIN_ESPACIO], ['Tengo un hermano , una hermana y un perro.', ESPACIO_ANTES]] },
  { nivel: 3, bien: 'Hoy hay examen. ¿Has estudiado?', malas: [['Hoy hay examen. Has estudiado?', FALTA_ABRE_P], ['Hoy hay examen .¿Has estudiado?', 'el espacio está en el lado equivocado: va detrás del punto, no delante']] },
];

/** Ítem: { i, orden, nivel } (0 = la buena; 1 y 2, las malas). */
export function generarSignos(rng, sesion) {
  const { item, nivel } = elegirNivel(rng, SIGNOS.map(({ nivel }, i) => ({ i, nivel })), sesion);
  return { i: item.i, orden: rng.barajar([0, 1, 2]), nivel };
}

/** Las frases del ítem en el orden en que salen: [{ k, texto }]. */
export function opcionesSignos(item) {
  const { bien, malas } = SIGNOS[item.i];
  const textos = [bien, ...malas.map(m => m[0])];
  return item.orden.map(k => ({ k, texto: textos[k] }));
}

/** Explicación: la buena y, si eligió una mala, qué le falla a esa. */
export function explicacionSignos(item, elegida) {
  const { bien, malas } = SIGNOS[item.i];
  const fallo = elegida > 0 ? ` A la que has elegido ${malas[elegida - 1][1]}.` : '';
  const otras = elegida > 0 ? '' : ` A las otras: ${malas.map(m => m[1]).join('; y ')}.`;
  return `Bien escrita: <i>${bien}</i>${fallo}${otras}`;
}

/** Identificador del error para el panel, según lo que falla en la elegida. */
export function idErrorSignos(item, elegida) {
  const motivo = SIGNOS[item.i].malas[elegida - 1][1];
  if (motivo.includes('le falta el ¿') || motivo.includes('le falta el ¡') || motivo.includes('le faltan')) return 'falta-signo-de-apertura';
  if (motivo === CIERRE_AL_REVES) return 'signo-de-cierre-al-reves';
  if (motivo === SIN_ESPACIO) return 'falta-espacio-tras-signo';
  return 'espacio-mal-puesto';
}
