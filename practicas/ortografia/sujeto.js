// Ortografía española: la coma entre sujeto y verbo (ejercicio 11). Puro, como
// logica.js. Lo pidió Juan Luis el 2026-10-25: sus alumnos separan con coma un
// sujeto largo de su verbo («El lápiz que te dejé, era rojo»), y hay que
// distinguirlo de la coma de un inciso («Aquel lápiz, el que yo te dejé, era rojo»).
//
// «¿Cuál está bien escrita?», dos tipos de ítem, mitad y mitad:
//   - «sujeto»: sujeto largo + verbo. Buena, sin coma; mala, con la coma entre los dos.
//   - «inciso»: una explicación metida en medio. Buena, entre dos comas; malas, con
//     una sola (la de delante o la de detrás).
//
// Regla de oro: en «sujeto», la mala es SOLO la de una coma. «El lápiz, que te
// dejé, era rojo», con dos, también es correcta (explicativa: solo había un
// lápiz), así que nunca sale como opción. Y en «inciso», nunca sale la versión
// sin comas, que en algunas frases también vale («Mi hermano que tiene quince
// años…», si tiene varios). Y ninguna frase de «inciso» empieza por el nombre
// de una persona: «Lucía, mi mejor amiga está en 1.º C», con una coma, se puede
// leer como vocativo y sería correcta.

/** «sujeto»: [sujeto, el resto de la frase (empieza por el verbo)]. */
export const SUJETOS = [
  ['El lápiz que te dejé', 'era rojo.'],
  ['Los alumnos que terminen el examen', 'pueden salir al patio.'],
  ['La chica que se sienta a mi lado', 'se llama Lucía.'],
  ['El libro que me regalaste por mi cumpleaños', 'me ha encantado.'],
  ['Todos los alumnos de 1.º A', 'van a la excursión.'],
  ['El perro de mis vecinos del tercero', 'ladra toda la noche.'],
  ['Lo que más me gusta de las Matemáticas', 'son los problemas.'],
  ['Ir en bici al instituto', 'es más rápido que ir andando.'],
  ['Los ejercicios que no terminéis en clase', 'son para casa.'],
  ['La profesora de Inglés que tuvimos el año pasado', 'se ha ido a otro instituto.'],
  ['El equipo que gane el torneo', 'recibirá una copa.'],
  ['Las fotos que hicimos en la excursión', 'han salido muy bien.'],
];

/** «inciso»: [lo de antes, el inciso, lo de después (empieza por el verbo)]. */
export const INCISOS = [
  ['Aquel lápiz', 'el que yo te dejé', 'era rojo.'],
  ['Mi hermano', 'que tiene quince años', 'juega al baloncesto.'],
  ['Madrid', 'la capital de España', 'tiene más de tres millones de habitantes.'],
  ['El Teide', 'que está en Tenerife', 'es la montaña más alta de España.'],
  ['Mi abuela', 'que vive en Murcia', 'viene a comer los domingos.'],
  ['La Luna', 'que gira alrededor de la Tierra', 'no tiene luz propia.'],
  ['Nuestro perro', 'un labrador muy grande', 'se llama Rayo.'],
  ['La biblioteca', 'que está en la planta baja', 'abre a las ocho y media.'],
  ['El examen', 'como ya sabéis', 'es el viernes.'],
  ['Mi padre', 'que es cocinero', 'hace unas croquetas buenísimas.'],
];

/** Las frases de un ítem: [buena, ...malas], cada una con lo que le falla. */
export function frases(item) {
  if (item.tipo === 'sujeto') {
    const [sujeto, resto] = SUJETOS[item.i];
    return [[`${sujeto} ${resto}`, null], [`${sujeto}, ${resto}`, 'coma-sujeto']];
  }
  const [antes, inciso, despues] = INCISOS[item.i];
  return [
    [`${antes}, ${inciso}, ${despues}`, null],
    [`${antes} ${inciso}, ${despues}`, 'falta-coma-delante'],
    [`${antes}, ${inciso} ${despues}`, 'falta-coma-detras'],
  ];
}

/** Ítem: { tipo, i, orden } (0 = la buena). */
export function generarSujeto(rng) {
  const tipo = rng.azar() < 0.5 ? 'sujeto' : 'inciso';
  const i = rng.entero(0, (tipo === 'sujeto' ? SUJETOS : INCISOS).length - 1);
  return { tipo, i, orden: rng.barajar(tipo === 'sujeto' ? [0, 1] : [0, 1, 2]) };
}

/** Las frases del ítem en el orden en que salen: [{ k, texto }]. */
export function opcionesSujeto(item) {
  const fs = frases(item);
  return item.orden.map(k => ({ k, texto: fs[k][0] }));
}

/** Explicación (HTML; los textos son nuestros): la buena, la regla con esa frase y, si falló, qué le pasa a la elegida. */
export function explicacionSujeto(item, elegida) {
  const buena = frases(item)[0][0];
  if (item.tipo === 'sujeto') {
    const [sujeto, resto] = SUJETOS[item.i];
    const verbo = resto.split(' ')[0];
    return `Bien escrita: <i>${buena}</i> «${sujeto}» es el sujeto, y «${verbo}…», lo que se dice de él. Aunque el sujeto sea largo, <b>no se separa del verbo con una coma</b>.`;
  }
  const [antes, inciso, despues] = INCISOS[item.i];
  const regla = `Bien escrita: <i>${buena}</i> «${inciso}» es una explicación metida en medio: se puede quitar y la frase sigue entera («${antes} ${despues}»). Por eso va <b>entre dos comas</b>, una delante y otra detrás.`;
  if (elegida === 1) return `${regla} A la que has elegido le falta la de delante, y así parece que la coma separa el sujeto del verbo.`;
  if (elegida === 2) return `${regla} A la que has elegido le falta la de detrás: el inciso se abre y se cierra.`;
  return regla;
}

/** Identificador del error para el panel. */
export const idErrorSujeto = (item, elegida) => frases(item)[elegida][1];
