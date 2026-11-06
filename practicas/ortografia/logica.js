// Ortografía española: lógica. Todo puro (sin DOM ni red), para probarlo con
// `npm test`. Es la única práctica que no es de Matemáticas: los errores de
// ortografía que Juan Luis ve en sus alumnos (2026-10-23). Va solo en español.
//
// Siete ejercicios (un ejercicio nuevo va siempre al FINAL: el progreso se
// guarda por posición y las tareas de la U3 citan los cuatro primeros):
//   1. a / ha        2. e / he        3. echo / hecho
//   4. ¿Está bien escrita? (mezcla de las tres primeras parejas, con la palabra ya puesta)
//   5. porque / por qué
//   6-7. Comas (vocativo y comas que cambian el significado): en `comas.js`
//
// Cada frase tiene UN hueco (`_`) y una sola palabra posible de la pareja: la
// regla de oro de los distractores. Lo comprueban los tests con reglas de
// forma (qué palabra viene detrás del hueco), pero el significado hay que
// revisarlo a mano: al añadir una frase, léela con las dos palabras.
//
// Cuidado al añadir frases:
//   - Nada de «a ver» / «haber» ni de «ha de»: son otro error y otra regla.
//   - «e» solo delante de i- o hi- + consonante (hijo, historia, Isabel); delante
//     de hie- (hielo, hierro) se escribe «y», así que esas palabras no valen.
//   - Ninguna frase lleva «había»: es la palabra del truco de la explicación.
//   - El hueco nunca va al principio (los botones van en minúscula).
//   - «porque» / «por qué»: una pregunta indirecta solo vale si leída con «porque»
//     no tiene sentido («Dime _ te ríes» sí; «No sé _ llora» no, porque «No sé,
//     porque llora» también se puede decir). Ninguna frase con «el porqué».
//
// Niveles (tarea 143, 2026-11-06): cada frase es [texto, palabra buena, nivel]; el nivel
// (1-3) lo usa `elegirDeNivel` de ../_comun/nivel.js. Una frase nueva va siempre al FINAL
// de su lista (la clave de cada ítem es la posición) y con su nivel.

import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';

/**
 * Un ítem de `banco` (cada uno con su `nivel`) para esta `sesion`: { item, nivel }, donde
 * `nivel` es el del alumno (el que se enseña con `etiquetaNivel`). Sin `sesion` (una
 * llamada suelta, como las de los tests de antes de los niveles) no hay alumno que
 * adaptar: sale cualquier ítem del banco y su propio nivel.
 */
export function elegirNivel(rng, banco, sesion) {
  if (sesion === undefined) {
    const item = rng.elegir(banco);
    return { item, nivel: item.nivel };
  }
  const { item, actual } = elegirDeNivel(rng, banco, sesion, { forzado: nivelForzado() });
  return { item, nivel: actual };
}

/**
 * Las parejas de palabras. `con` es la palabra con h (en «porque» / «por qué»,
 * la de la pregunta) y `sin`, la otra; los botones salen en el orden sin, con.
 */
export const PAREJAS = {
  a_ha: {
    sin: 'a', con: 'ha',
    nombre: 'a / ha',
    frases: [
      // «ha»: del verbo haber, delante de un participio.
      ['Mi hermano ya _ llegado del instituto.', 'ha', 1],
      ['Lucía _ aprobado el examen de Matemáticas.', 'ha', 1],
      ['¿Quién _ cogido mi bolígrafo?', 'ha', 3],
      ['El perro se _ comido mi bocadillo.', 'ha', 3],
      ['Mi madre _ hecho una tarta de chocolate.', 'ha', 2],
      ['Marcos se _ roto un brazo jugando al fútbol.', 'ha', 3],
      ['Esta mañana _ llovido mucho.', 'ha', 1],
      ['La profesora nos _ puesto deberes para el lunes.', 'ha', 3],
      ['Mi abuelo _ vuelto del pueblo.', 'ha', 2],
      ['¿Te _ gustado la película?', 'ha', 3],
      ['El partido ya _ empezado.', 'ha', 1],
      ['Alguien _ dejado la puerta abierta.', 'ha', 1],
      ['Mi prima _ escrito un cuento precioso.', 'ha', 2],
      ['El tren _ salido con retraso.', 'ha', 1],
      ['Nadie _ visto mi mochila.', 'ha', 2],
      ['Mi gata _ tenido tres gatitos.', 'ha', 1],
      ['Pablo me _ dicho la verdad.', 'ha', 3],
      ['El profesor ya _ corregido los exámenes.', 'ha', 1],
      ['Mi equipo _ ganado la liga.', 'ha', 1],
      ['Se me _ olvidado el almuerzo en casa.', 'ha', 3],
      // «a»: la preposición.
      ['Mañana voy _ la playa con mis primos.', 'a', 1],
      ['En el recreo vamos _ jugar al baloncesto.', 'a', 2],
      ['Le he regalado un libro _ mi hermana.', 'a', 3],
      ['El autobús llega _ las ocho.', 'a', 2],
      ['Mi abuela vive _ dos calles del instituto.', 'a', 2],
      ['Después de clase voy _ casa de Lucía.', 'a', 1],
      ['Este fin de semana vamos _ ir al cine.', 'a', 2],
      ['Saludé _ la directora en el pasillo.', 'a', 1],
      ['El examen empieza _ las nueve y media.', 'a', 2],
      ['Aprendí _ nadar con seis años.', 'a', 2],
      ['Saqué al perro _ pasear por el parque.', 'a', 3],
      ['El sábado fuimos _ Cartagena en tren.', 'a', 1],
      ['Mi padre me enseña _ tocar la guitarra.', 'a', 3],
      ['Los sábados juego _ la consola con mi primo.', 'a', 2],
      ['El agua hierve _ cien grados.', 'a', 3],
      ['Dale las gracias _ tu abuelo.', 'a', 1],
      ['La biblioteca abre _ las diez.', 'a', 2],
      ['Siempre vamos andando _ la piscina.', 'a', 1],
      ['Mi hermana empieza _ trabajar el lunes.', 'a', 2],
      ['Llamé _ mi tía por su cumpleaños.', 'a', 1],
    ],
  },
  e_he: {
    sin: 'e', con: 'he',
    nombre: 'e / he',
    frases: [
      // «he»: yo + participio (también delante de participios que empiezan por i).
      ['Hoy _ terminado los deberes muy pronto.', 'he', 1],
      ['Ya _ leído el libro que me recomendaste.', 'he', 1],
      ['Esta mañana _ desayunado tostadas.', 'he', 1],
      ['Nunca _ estado en Francia.', 'he', 3],
      ['Creo que me _ dejado las llaves en casa.', 'he', 2],
      ['Todavía no _ visto esa película.', 'he', 3],
      ['Este año _ empezado a tocar el piano.', 'he', 1],
      ['Yo _ ido al cine con mis amigos.', 'he', 1],
      ['Le _ pedido perdón a mi hermano.', 'he', 1],
      ['Ya _ hecho la cama.', 'he', 3],
      ['Hoy _ imprimido el trabajo de Ciencias.', 'he', 2],
      ['Me _ olvidado el estuche en casa.', 'he', 2],
      ['Esta semana _ jugado tres partidos.', 'he', 1],
      ['Yo _ invitado a Lucía a mi cumpleaños.', 'he', 1],
      ['Ya _ comprado el regalo de mi madre.', 'he', 3],
      ['Nunca _ subido a una montaña tan alta.', 'he', 3],
      ['Hoy _ aprendido una canción nueva.', 'he', 1],
      ['Me _ caído en el patio.', 'he', 2],
      ['¿Dónde _ puesto mis gafas?', 'he', 2],
      ['Yo _ intentado llamarte tres veces.', 'he', 1],
      // «e»: la «y» de siempre, delante de i- o hi-.
      ['La fiesta es para padres _ hijos.', 'e', 2],
      ['Mañana tenemos Geografía _ Historia.', 'e', 2],
      ['Necesito aguja _ hilo para coser el botón.', 'e', 2],
      ['Marta _ Isabel son hermanas.', 'e', 1],
      ['Mi primo es simpático _ inteligente.', 'e', 1],
      ['En el mercado compramos uvas _ higos.', 'e', 2],
      ['El documental era largo _ interesante.', 'e', 1],
      ['Mi amiga habla español _ inglés.', 'e', 1],
      ['Pedro _ Iván juegan en el mismo equipo.', 'e', 1],
      ['El libro tiene texto _ imágenes.', 'e', 1],
      ['En el zoo vimos leones _ hipopótamos.', 'e', 2],
      ['Madre _ hija van juntas a correr.', 'e', 2],
      ['Este verano iremos a Francia _ Italia.', 'e', 1],
      ['Los niños de primaria _ infantil comparten patio.', 'e', 1],
      ['Matemáticas _ Inglés son mis asignaturas favoritas.', 'e', 1],
      ['Mi tía es médica _ investigadora.', 'e', 1],
      ['Fuimos al pueblo de mis abuelos _ hicimos una barbacoa.', 'e', 3],
      ['Llegué a casa _ hice los deberes.', 'e', 3],
      ['Abrí la caja _ hice una foto del regalo.', 'e', 3],
      ['Mi hermano es muy alto _ incluso juega al baloncesto.', 'e', 2],
      // Añadidas en la tarea 143 (nivel 3: la «e» que une dos verbos).
      ['Me levanté _ hice la cama.', 'e', 3],
      ['Salí al patio _ hice nuevos amigos.', 'e', 3],
    ],
  },
  echo_hecho: {
    sin: 'echo', con: 'hecho',
    nombre: 'echo / hecho',
    frases: [
      // «hecho»: del verbo hacer (he hecho, está hecho) y el nombre «un hecho».
      ['Ya he _ los deberes de Lengua.', 'hecho', 1],
      ['¿Has _ la cama esta mañana?', 'hecho', 1],
      ['Mi abuela ha _ croquetas para comer.', 'hecho', 1],
      ['Hemos _ un mural para la clase.', 'hecho', 1],
      ['¿Quién ha _ este dibujo tan bonito?', 'hecho', 1],
      ['Este jersey está _ a mano.', 'hecho', 2],
      ['Me gusta el filete muy _.', 'hecho', 2],
      ['¡Bien _! Has resuelto el problema.', 'hecho', 2],
      ['Todavía no he _ la maleta.', 'hecho', 1],
      ['Mi hermano se ha _ una herida en la rodilla.', 'hecho', 2],
      ['Es un _: la Tierra gira alrededor del Sol.', 'hecho', 3],
      ['La película está basada en un _ real.', 'hecho', 3],
      ['No tengo sueño; de _, me voy a quedar leyendo.', 'hecho', 3],
      ['Mis padres han _ una tortilla enorme.', 'hecho', 1],
      // «echo»: del verbo echar (yo echo).
      ['Siempre _ sal a la ensalada.', 'echo', 1],
      ['Te _ de menos cuando estás de viaje.', 'echo', 2],
      ['Ahora mismo _ la carta al buzón.', 'echo', 1],
      ['Yo _ los envases al contenedor amarillo.', 'echo', 1],
      ['Si empieza a llover, _ a correr hasta casa.', 'echo', 3],
      ['Todos los días le _ agua a las plantas.', 'echo', 1],
      ['Yo nunca _ azúcar al zumo.', 'echo', 1],
      ['Antes de entregar el examen, le _ un vistazo.', 'echo', 3],
      ['Cuando tengo frío, _ otra manta a la cama.', 'echo', 1],
      ['Si quieres, te _ una mano con los deberes.', 'echo', 3],
      ['Siempre le _ la culpa a mi hermano.', 'echo', 2],
      ['Por la noche _ el pestillo de la puerta.', 'echo', 1],
      ['Yo _ de menos a mis amigos del colegio.', 'echo', 2],
      ['Cada mañana le _ de comer al gato.', 'echo', 2],
      // Añadidas en la tarea 143 (nivel 3).
      ['Lo que dices no es un _, es una opinión.', 'hecho', 3],
      ['Si me dejas, _ un vistazo a tu dibujo.', 'echo', 3],
    ],
  },
  porque: {
    sin: 'porque', con: 'por qué',
    nombre: 'porque / por qué',
    frases: [
      // «por qué»: pregunta directa (con ¿?) o indirecta («dime por qué…»).
      ['Mamá, ¿_ no puedo ir a la excursión?', 'por qué', 1],
      ['¿Y _ no me lo dijiste antes?', 'por qué', 1],
      ['Oye, ¿_ estás tan contento hoy?', 'por qué', 1],
      ['¿Sabes _ el agua del mar es salada?', 'por qué', 2],
      ['¿Me explicas _ has borrado la pizarra?', 'por qué', 2],
      ['¿Tú sabes _ no ha venido Lucía?', 'por qué', 2],
      ['Profesora, ¿_ «hecho» se escribe con h?', 'por qué', 1],
      ['¿Y tú _ te ríes?', 'por qué', 1],
      ['Me pregunto _ el cielo es azul.', 'por qué', 3],
      ['Dime _ te ríes.', 'por qué', 3],
      ['Quiero saber _ has llegado tarde.', 'por qué', 3],
      ['Explícanos _ el resultado es negativo.', 'por qué', 3],
      ['Explícame _ has cogido mi estuche.', 'por qué', 3],
      ['Me pregunto _ los gatos ronronean.', 'por qué', 3],
      // «porque»: la causa (también dentro de una pregunta).
      ['Llego tarde _ he perdido el autobús.', 'porque', 1],
      ['Ayer no fui al cine _ estaba enfermo.', 'porque', 1],
      ['Me pongo el abrigo _ hace frío.', 'porque', 1],
      ['Estudio mucho _ quiero aprobar.', 'porque', 1],
      ['El perro ladra _ tiene hambre.', 'porque', 1],
      ['Lucía está contenta _ ha aprobado.', 'porque', 1],
      ['Cerré la ventana _ entraba mucho aire.', 'porque', 1],
      ['Me gusta el verano _ no hay clase.', 'porque', 1],
      ['No salimos al patio _ estaba lloviendo.', 'porque', 1],
      ['¿Te vas a casa _ estás cansado?', 'porque', 2],
      ['¿Lloras _ te has caído?', 'porque', 2],
      ['¿Estás enfadado _ he llegado tarde?', 'porque', 2],
      ['Bebo agua _ tengo sed.', 'porque', 1],
      ['Mi hermano no tiene hambre _ ha merendado.', 'porque', 2],
      // Añadida en la tarea 143 (nivel 2).
      ['¿Comes poco _ no tienes hambre?', 'porque', 2],
      // Añadidas en la tarea 143 (nivel 3: la pregunta indirecta con «si», donde «por qué» no cabe).
      ['Dime si estás triste _ has suspendido.', 'porque', 3],
      ['Quiero saber si llegas tarde _ pierdes el autobús.', 'porque', 3],
      ['Me pregunto si lloras _ te duele la rodilla.', 'porque', 3],
      ['Explícame si te ríes _ es gracioso.', 'porque', 3],
    ],
  },
};

export const CLAVES_PAREJAS = Object.keys(PAREJAS);

/** Las parejas que mezcla el ejercicio 4 (las de las tareas de la U3: no se cambia). */
export const PAREJAS_REVISION = ['a_ha', 'e_he', 'echo_hecho'];

/** La frase n de una pareja, partida por el hueco: { antes, despues, buena, siguiente, nivel }. */
export function partes(pareja, n) {
  const [texto, buena, nivel] = PAREJAS[pareja].frases[n];
  const [antes, despues] = texto.split('_');
  // La palabra que viene detrás del hueco, sin signos (para la explicación).
  const siguiente = (despues.match(/[a-záéíóúüñ]+/i) ?? [''])[0];
  return { antes, despues, buena, siguiente, nivel };
}

/** La frase con el hueco relleno con `palabra`. */
export function rellenar(pareja, n, palabra) {
  const { antes, despues } = partes(pareja, n);
  return `${antes}${palabra}${despues}`;
}

/** La otra palabra de la pareja. */
export function otra(pareja, palabra) {
  const p = PAREJAS[pareja];
  return palabra === p.con ? p.sin : p.con;
}

// --- Ejercicios 1-3: rellenar el hueco ------------------------------------------

/**
 * Generador del ejercicio de una pareja. Ítem: { pareja, n, nivel }. Mitad de los
 * ítems con cada palabra (si no, el que conteste siempre lo mismo acertaría
 * según cuántas frases haya de cada una); dentro de cada palabra, por niveles.
 */
export function generadorHueco(pareja) {
  const frases = PAREJAS[pareja].frases;
  const por = palabra => frases.map(([, buena, nivel], n) => ({ n, buena, nivel })).filter(f => f.buena === palabra);
  const conH = por(PAREJAS[pareja].con);
  const sinH = por(PAREJAS[pareja].sin);
  return (rng, sesion) => {
    const { item, nivel } = elegirNivel(rng, rng.azar() < 0.5 ? conH : sinH, sesion);
    return { pareja, n: item.n, nivel };
  };
}

// --- Ejercicio 4: ¿está bien escrita? -------------------------------------------

/** Ítem: { pareja, n, puesta, nivel }: la frase con `puesta` en el hueco, bien o mal (mitad y mitad). El nivel es el de la frase. */
export function generarRevision(rng, sesion) {
  const pareja = rng.elegir(PAREJAS_REVISION);
  const { n, nivel } = generadorHueco(pareja)(rng, sesion);
  const { buena } = partes(pareja, n);
  return { pareja, n, puesta: rng.azar() < 0.5 ? buena : otra(pareja, buena), nivel };
}

/** ¿Está bien escrita la frase del ítem del ejercicio 4? */
export function estaBien(item) {
  return item.puesta === partes(item.pareja, item.n).buena;
}

/**
 * Identificador del error para el panel del profesor: qué puso el alumno en
 * vez de qué («ha-por-a»: escribió «ha» donde va «a»).
 */
export function idError(pareja, n, puso) {
  return `${slug(puso)}-por-${slug(partes(pareja, n).buena)}`;
}

/** «por qué» → «por-que»: el panel solo admite minúsculas, cifras y guiones. */
export const slug = texto => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
