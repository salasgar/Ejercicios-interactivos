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
      ['Mi hermano ya _ llegado del instituto.', 'ha'],
      ['Lucía _ aprobado el examen de Matemáticas.', 'ha'],
      ['¿Quién _ cogido mi bolígrafo?', 'ha'],
      ['El perro se _ comido mi bocadillo.', 'ha'],
      ['Mi madre _ hecho una tarta de chocolate.', 'ha'],
      ['Marcos se _ roto un brazo jugando al fútbol.', 'ha'],
      ['Esta mañana _ llovido mucho.', 'ha'],
      ['La profesora nos _ puesto deberes para el lunes.', 'ha'],
      ['Mi abuelo _ vuelto del pueblo.', 'ha'],
      ['¿Te _ gustado la película?', 'ha'],
      ['El partido ya _ empezado.', 'ha'],
      ['Alguien _ dejado la puerta abierta.', 'ha'],
      ['Mi prima _ escrito un cuento precioso.', 'ha'],
      ['El tren _ salido con retraso.', 'ha'],
      ['Nadie _ visto mi mochila.', 'ha'],
      ['Mi gata _ tenido tres gatitos.', 'ha'],
      ['Pablo me _ dicho la verdad.', 'ha'],
      ['El profesor ya _ corregido los exámenes.', 'ha'],
      ['Mi equipo _ ganado la liga.', 'ha'],
      ['Se me _ olvidado el almuerzo en casa.', 'ha'],
      // «a»: la preposición.
      ['Mañana voy _ la playa con mis primos.', 'a'],
      ['En el recreo vamos _ jugar al baloncesto.', 'a'],
      ['Le he regalado un libro _ mi hermana.', 'a'],
      ['El autobús llega _ las ocho.', 'a'],
      ['Mi abuela vive _ dos calles del instituto.', 'a'],
      ['Después de clase voy _ casa de Lucía.', 'a'],
      ['Este fin de semana vamos _ ir al cine.', 'a'],
      ['Saludé _ la directora en el pasillo.', 'a'],
      ['El examen empieza _ las nueve y media.', 'a'],
      ['Aprendí _ nadar con seis años.', 'a'],
      ['Saqué al perro _ pasear por el parque.', 'a'],
      ['El sábado fuimos _ Cartagena en tren.', 'a'],
      ['Mi padre me enseña _ tocar la guitarra.', 'a'],
      ['Los sábados juego _ la consola con mi primo.', 'a'],
      ['El agua hierve _ cien grados.', 'a'],
      ['Dale las gracias _ tu abuelo.', 'a'],
      ['La biblioteca abre _ las diez.', 'a'],
      ['Siempre vamos andando _ la piscina.', 'a'],
      ['Mi hermana empieza _ trabajar el lunes.', 'a'],
      ['Llamé _ mi tía por su cumpleaños.', 'a'],
    ],
  },
  e_he: {
    sin: 'e', con: 'he',
    nombre: 'e / he',
    frases: [
      // «he»: yo + participio (también delante de participios que empiezan por i).
      ['Hoy _ terminado los deberes muy pronto.', 'he'],
      ['Ya _ leído el libro que me recomendaste.', 'he'],
      ['Esta mañana _ desayunado tostadas.', 'he'],
      ['Nunca _ estado en Francia.', 'he'],
      ['Creo que me _ dejado las llaves en casa.', 'he'],
      ['Todavía no _ visto esa película.', 'he'],
      ['Este año _ empezado a tocar el piano.', 'he'],
      ['Yo _ ido al cine con mis amigos.', 'he'],
      ['Le _ pedido perdón a mi hermano.', 'he'],
      ['Ya _ hecho la cama.', 'he'],
      ['Hoy _ imprimido el trabajo de Ciencias.', 'he'],
      ['Me _ olvidado el estuche en casa.', 'he'],
      ['Esta semana _ jugado tres partidos.', 'he'],
      ['Yo _ invitado a Lucía a mi cumpleaños.', 'he'],
      ['Ya _ comprado el regalo de mi madre.', 'he'],
      ['Nunca _ subido a una montaña tan alta.', 'he'],
      ['Hoy _ aprendido una canción nueva.', 'he'],
      ['Me _ caído en el patio.', 'he'],
      ['¿Dónde _ puesto mis gafas?', 'he'],
      ['Yo _ intentado llamarte tres veces.', 'he'],
      // «e»: la «y» de siempre, delante de i- o hi-.
      ['La fiesta es para padres _ hijos.', 'e'],
      ['Mañana tenemos Geografía _ Historia.', 'e'],
      ['Necesito aguja _ hilo para coser el botón.', 'e'],
      ['Marta _ Isabel son hermanas.', 'e'],
      ['Mi primo es simpático _ inteligente.', 'e'],
      ['En el mercado compramos uvas _ higos.', 'e'],
      ['El documental era largo _ interesante.', 'e'],
      ['Mi amiga habla español _ inglés.', 'e'],
      ['Pedro _ Iván juegan en el mismo equipo.', 'e'],
      ['El libro tiene texto _ imágenes.', 'e'],
      ['En el zoo vimos leones _ hipopótamos.', 'e'],
      ['Madre _ hija van juntas a correr.', 'e'],
      ['Este verano iremos a Francia _ Italia.', 'e'],
      ['Los niños de primaria _ infantil comparten patio.', 'e'],
      ['Matemáticas _ Inglés son mis asignaturas favoritas.', 'e'],
      ['Mi tía es médica _ investigadora.', 'e'],
      ['Fuimos al pueblo de mis abuelos _ hicimos una barbacoa.', 'e'],
      ['Llegué a casa _ hice los deberes.', 'e'],
      ['Abrí la caja _ hice una foto del regalo.', 'e'],
      ['Mi hermano es muy alto _ incluso juega al baloncesto.', 'e'],
    ],
  },
  echo_hecho: {
    sin: 'echo', con: 'hecho',
    nombre: 'echo / hecho',
    frases: [
      // «hecho»: del verbo hacer (he hecho, está hecho) y el nombre «un hecho».
      ['Ya he _ los deberes de Lengua.', 'hecho'],
      ['¿Has _ la cama esta mañana?', 'hecho'],
      ['Mi abuela ha _ croquetas para comer.', 'hecho'],
      ['Hemos _ un mural para la clase.', 'hecho'],
      ['¿Quién ha _ este dibujo tan bonito?', 'hecho'],
      ['Este jersey está _ a mano.', 'hecho'],
      ['Me gusta el filete muy _.', 'hecho'],
      ['¡Bien _! Has resuelto el problema.', 'hecho'],
      ['Todavía no he _ la maleta.', 'hecho'],
      ['Mi hermano se ha _ una herida en la rodilla.', 'hecho'],
      ['Es un _: la Tierra gira alrededor del Sol.', 'hecho'],
      ['La película está basada en un _ real.', 'hecho'],
      ['No tengo sueño; de _, me voy a quedar leyendo.', 'hecho'],
      ['Mis padres han _ una tortilla enorme.', 'hecho'],
      // «echo»: del verbo echar (yo echo).
      ['Siempre _ sal a la ensalada.', 'echo'],
      ['Te _ de menos cuando estás de viaje.', 'echo'],
      ['Ahora mismo _ la carta al buzón.', 'echo'],
      ['Yo _ los envases al contenedor amarillo.', 'echo'],
      ['Si empieza a llover, _ a correr hasta casa.', 'echo'],
      ['Todos los días le _ agua a las plantas.', 'echo'],
      ['Yo nunca _ azúcar al zumo.', 'echo'],
      ['Antes de entregar el examen, le _ un vistazo.', 'echo'],
      ['Cuando tengo frío, _ otra manta a la cama.', 'echo'],
      ['Si quieres, te _ una mano con los deberes.', 'echo'],
      ['Siempre le _ la culpa a mi hermano.', 'echo'],
      ['Por la noche _ el pestillo de la puerta.', 'echo'],
      ['Yo _ de menos a mis amigos del colegio.', 'echo'],
      ['Cada mañana le _ de comer al gato.', 'echo'],
    ],
  },
  porque: {
    sin: 'porque', con: 'por qué',
    nombre: 'porque / por qué',
    frases: [
      // «por qué»: pregunta directa (con ¿?) o indirecta («dime por qué…»).
      ['Mamá, ¿_ no puedo ir a la excursión?', 'por qué'],
      ['¿Y _ no me lo dijiste antes?', 'por qué'],
      ['Oye, ¿_ estás tan contento hoy?', 'por qué'],
      ['¿Sabes _ el agua del mar es salada?', 'por qué'],
      ['¿Me explicas _ has borrado la pizarra?', 'por qué'],
      ['¿Tú sabes _ no ha venido Lucía?', 'por qué'],
      ['Profesora, ¿_ «hecho» se escribe con h?', 'por qué'],
      ['¿Y tú _ te ríes?', 'por qué'],
      ['Me pregunto _ el cielo es azul.', 'por qué'],
      ['Dime _ te ríes.', 'por qué'],
      ['Quiero saber _ has llegado tarde.', 'por qué'],
      ['Explícanos _ el resultado es negativo.', 'por qué'],
      ['Explícame _ has cogido mi estuche.', 'por qué'],
      ['Me pregunto _ los gatos ronronean.', 'por qué'],
      // «porque»: la causa (también dentro de una pregunta).
      ['Llego tarde _ he perdido el autobús.', 'porque'],
      ['Ayer no fui al cine _ estaba enfermo.', 'porque'],
      ['Me pongo el abrigo _ hace frío.', 'porque'],
      ['Estudio mucho _ quiero aprobar.', 'porque'],
      ['El perro ladra _ tiene hambre.', 'porque'],
      ['Lucía está contenta _ ha aprobado.', 'porque'],
      ['Cerré la ventana _ entraba mucho aire.', 'porque'],
      ['Me gusta el verano _ no hay clase.', 'porque'],
      ['No salimos al patio _ estaba lloviendo.', 'porque'],
      ['¿Te vas a casa _ estás cansado?', 'porque'],
      ['¿Lloras _ te has caído?', 'porque'],
      ['¿Estás enfadado _ he llegado tarde?', 'porque'],
      ['Bebo agua _ tengo sed.', 'porque'],
      ['Mi hermano no tiene hambre _ ha merendado.', 'porque'],
    ],
  },
};

export const CLAVES_PAREJAS = Object.keys(PAREJAS);

/** Las parejas que mezcla el ejercicio 4 (las de las tareas de la U3: no se cambia). */
export const PAREJAS_REVISION = ['a_ha', 'e_he', 'echo_hecho'];

/** La frase n de una pareja, partida por el hueco: { antes, despues, buena, siguiente }. */
export function partes(pareja, n) {
  const [texto, buena] = PAREJAS[pareja].frases[n];
  const [antes, despues] = texto.split('_');
  // La palabra que viene detrás del hueco, sin signos (para la explicación).
  const siguiente = (despues.match(/[a-záéíóúüñ]+/i) ?? [''])[0];
  return { antes, despues, buena, siguiente };
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
 * Generador del ejercicio de una pareja. Ítem: { pareja, n }. Mitad de los
 * ítems con cada palabra (si no, el que conteste siempre lo mismo acertaría
 * según cuántas frases haya de cada una).
 */
export function generadorHueco(pareja) {
  const frases = PAREJAS[pareja].frases;
  const por = palabra => frases.map((f, n) => (f[1] === palabra ? n : -1)).filter(n => n >= 0);
  const conH = por(PAREJAS[pareja].con);
  const sinH = por(PAREJAS[pareja].sin);
  return rng => ({ pareja, n: rng.elegir(rng.azar() < 0.5 ? conH : sinH) });
}

// --- Ejercicio 4: ¿está bien escrita? -------------------------------------------

/** Ítem: { pareja, n, puesta }: la frase con `puesta` en el hueco, bien o mal (mitad y mitad). */
export function generarRevision(rng) {
  const pareja = rng.elegir(PAREJAS_REVISION);
  const { n } = generadorHueco(pareja)(rng);
  const { buena } = partes(pareja, n);
  return { pareja, n, puesta: rng.azar() < 0.5 ? buena : otra(pareja, buena) };
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
export const slug = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
