// Ortografía española: signos ¿ ¡ y espacios (ejercicio 10). Puro, como logica.js.
// Sale de los correos de los alumnos (2026-10-23): preguntas sin ¿, «¿ De verdad»,
// «Hola,Juan Luis», «.Dime».
//
// «¿Cuál está bien escrita?»: la buena y dos malas, cada una con lo que le falla.
// Regla de oro: cada mala tiene un fallo claro, y solo uno. Nada de casos que la
// norma deja elegir (el vocativo dentro o fuera de la pregunta, «¿Si llueve, qué
// hacemos?»): todas las buenas llevan el signo donde empieza la pregunta.

const FALTA_ABRE_P = 'le falta el ¿ del principio: en español la pregunta se abre y se cierra';
const FALTA_ABRE_E = 'le falta el ¡ del principio: en español la exclamación se abre y se cierra';
const ESPACIO_DENTRO = 'sobra un espacio: los signos ¿ ? ¡ ! van pegados a la primera y a la última palabra';
const CIERRE_AL_REVES = 'el signo del final está al revés: se abre con ¿ ¡ y se cierra con ? !';
const SIN_ESPACIO = 'falta un espacio: detrás de una coma, de un punto o de un signo de cierre va siempre un espacio';
const ESPACIO_ANTES = 'sobra un espacio: delante de una coma o de un punto no va espacio';

export const SIGNOS = [
  { bien: '¿Vienes al cine?', malas: [['Vienes al cine?', FALTA_ABRE_P], ['¿ Vienes al cine?', ESPACIO_DENTRO]] },
  { bien: '¡Qué frío hace!', malas: [['Qué frío hace!', FALTA_ABRE_E], ['¡ Qué frío hace !', ESPACIO_DENTRO]] },
  { bien: '¿Cuándo es el examen?', malas: [['Cuándo es el examen?', FALTA_ABRE_P], ['¿Cuándo es el examen¿', CIERRE_AL_REVES]] },
  { bien: '¡Feliz cumpleaños!', malas: [['Feliz cumpleaños!', FALTA_ABRE_E], ['¡Feliz cumpleaños¡', CIERRE_AL_REVES]] },
  { bien: 'Profe, ¿el examen es el viernes?', malas: [['Profe, el examen es el viernes?', FALTA_ABRE_P], ['Profe,¿el examen es el viernes?', SIN_ESPACIO]] },
  { bien: '¿Me ayudas? Es que no lo entiendo.', malas: [['Me ayudas? Es que no lo entiendo.', FALTA_ABRE_P], ['¿Me ayudas?Es que no lo entiendo.', SIN_ESPACIO]] },
  { bien: 'Gracias. ¡Eres el mejor!', malas: [['Gracias. Eres el mejor!', FALTA_ABRE_E], ['Gracias.¡Eres el mejor!', SIN_ESPACIO]] },
  { bien: '¿De verdad? ¡No me lo creo!', malas: [['¿ De verdad? ¡ No me lo creo!', ESPACIO_DENTRO], ['De verdad? No me lo creo!', 'le faltan los signos del principio: ¿ en la pregunta y ¡ en la exclamación']] },
  { bien: 'Hola, Pablo, ¿qué tal?', malas: [['Hola,Pablo,¿qué tal?', SIN_ESPACIO], ['Hola , Pablo , ¿qué tal?', ESPACIO_ANTES]] },
  { bien: 'He terminado. Mañana te lo enseño.', malas: [['He terminado.Mañana te lo enseño.', SIN_ESPACIO], ['He terminado .Mañana te lo enseño.', 'el espacio está en el lado equivocado: va detrás del punto, no delante']] },
  { bien: 'Compré pan, leche y huevos.', malas: [['Compré pan,leche y huevos.', SIN_ESPACIO], ['Compré pan , leche y huevos.', ESPACIO_ANTES]] },
  { bien: 'Vale, mañana te lo traigo.', malas: [['Vale,mañana te lo traigo.', SIN_ESPACIO], ['Vale ,mañana te lo traigo.', 'el espacio está en el lado equivocado: va detrás de la coma, no delante']] },
  { bien: '¿Qué tenemos de deberes para mañana?', malas: [['Qué tenemos de deberes para mañana?', FALTA_ABRE_P], ['¿Qué tenemos de deberes para mañana ?', ESPACIO_DENTRO]] },
  { bien: 'Mamá, ¡he aprobado!', malas: [['Mamá, he aprobado!', FALTA_ABRE_E], ['Mamá,¡he aprobado!', SIN_ESPACIO]] },
];

/** Ítem: { i, orden } (0 = la buena; 1 y 2, las malas). */
export function generarSignos(rng) {
  const i = rng.entero(0, SIGNOS.length - 1);
  return { i, orden: rng.barajar([0, 1, 2]) };
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
