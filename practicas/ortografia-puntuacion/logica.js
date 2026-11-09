// Ortografía: puntuación y mayúsculas. Lógica (tarea 137, 2026-11-06): los bancos de
// ítems, cada uno con `nivel: 1 | 2 | 3`, los generadores (con `elegirDeNivel` de
// ../_comun/nivel.js), las explicaciones ligadas al ítem y los `idError`. Todo puro
// (sin DOM): lo prueba tests/practicas-ortografia-puntuacion.test.js.
//
//   1. MAYUSCULAS     tocar las palabras con la mayúscula o la minúscula mal puesta
//   2. PUNTO_COMA     «¿Cuál está bien escrita?»: el punto y la coma
//   3. DOS_PUNTOS     igual: dos puntos, puntos suspensivos, saludo, raya y comillas
//   4. CORREOS        igual, con mensajes de dos o tres líneas; y ASUNTO_CUERPO, dos botones
//
// Las malas de los ejercicios 2-4 son la buena con UN cambio de signos, espacios,
// mayúsculas, tildes o abreviaturas (las mismas letras): lo comprueba el test. Cada
// mala lleva el `idError` de su confusión (estable, no por frase) y el motivo sale de
// MOTIVOS. Lo que `ortografia` ya practica (vocativo, comas que cambian el significado,
// ¿? ¡! y espacios, coma entre sujeto y verbo) no se repite como ejercicio.

import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';
import { barajarOpciones } from '../_comun/ortografia.js';

const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const html = t => esc(t).replace(/\n/g, '<br>');
const limpia = palabra => palabra.replace(/[.,;:¿?¡!«»]/g, '');

// --- 1. Mayúsculas -----------------------------------------------------------------

/** Cómo se explica cada palabra mal escrita, según su `tipo` (que es también su `idError`). */
export const REGLAS_MAYUSCULAS = {
  'minuscula-tras-punto': c => `«${c}» empieza una frase (la primera o la que sigue a un punto): va con mayúscula.`,
  'minuscula-en-nombre-propio': c => `«${c}» es un nombre propio, de persona o de lugar: va con mayúscula.`,
  'mayuscula-en-nombre-comun': c => `«${c}» es un nombre común: va con minúscula aunque no sea la primera palabra.`,
  'mayuscula-en-dia': c => `«${c}» es un día de la semana: los días van con minúscula.`,
  'mayuscula-en-mes': c => `«${c}» es un mes: los meses van con minúscula.`,
  'mayuscula-en-estacion': c => `«${c}» es una estación del año: las estaciones van con minúscula.`,
  'mayuscula-en-gentilicio': c => `«${c}» dice de dónde es alguien o es un idioma: va con minúscula.`,
  'minuscula-en-asignatura': c => `«${c}» es aquí una asignatura, una materia que se estudia: va con mayúscula.`,
  'minuscula-en-festividad': c => `«${c}» forma parte del nombre de una fiesta: va con mayúscula.`,
  'mayuscula-en-profesion': c => `«${c}» es una profesión: los nombres de profesiones van con minúscula.`,
  'mayuscula-en-generico-geografico': c => `«${c}» dice qué clase de lugar es (río, mar, monte, isla): va con minúscula; el nombre propio que lo sigue, con mayúscula.`,
  'minuscula-en-institucion': c => `«${c}» forma parte del nombre de una institución: lleva mayúscula.`,
  'mayuscula-en-titulo': c => `«${c}» está dentro del título de una obra: solo la primera palabra del título lleva mayúscula (y los nombres propios).`,
  'mayuscula-en-yo': c => `«${c}» se escribe siempre con minúscula en español (no es el «I» del inglés).`,
};

/** `tipos`: una entrada por palabra cambiada, en el orden de la frase. */
const may = (nivel, texto, correcto, ...tipos) => ({ nivel, texto, correcto, tipos });

export const MAYUSCULAS = [
  // Nivel 1: inicio de frase, nombres de persona y de lugar, y la mayúscula de más en un nombre común.
  may(1, 'mañana viene marta a mi casa.', 'Mañana viene Marta a mi casa.', 'minuscula-tras-punto', 'minuscula-en-nombre-propio'),
  may(1, 'Mi Perro se llama Coco.', 'Mi perro se llama Coco.', 'mayuscula-en-nombre-comun'),
  may(1, 'vivo en cartagena, cerca del mar.', 'Vivo en Cartagena, cerca del mar.', 'minuscula-tras-punto', 'minuscula-en-nombre-propio'),
  may(1, 'He comprado pan. luego fui a casa de pablo.', 'He comprado pan. Luego fui a casa de Pablo.', 'minuscula-tras-punto', 'minuscula-en-nombre-propio'),
  may(1, 'Mi Hermana estudia en Madrid.', 'Mi hermana estudia en Madrid.', 'mayuscula-en-nombre-comun'),
  may(1, 'lucía y marcos juegan al baloncesto.', 'Lucía y Marcos juegan al baloncesto.', 'minuscula-en-nombre-propio', 'minuscula-en-nombre-propio'),
  may(1, 'Mis abuelos viven en lorca.', 'Mis abuelos viven en Lorca.', 'minuscula-en-nombre-propio'),
  may(1, 'Hoy hace Calor en Murcia.', 'Hoy hace calor en Murcia.', 'mayuscula-en-nombre-comun'),
  may(1, 'mi tío viaja a francia en tren.', 'Mi tío viaja a Francia en tren.', 'minuscula-tras-punto', 'minuscula-en-nombre-propio'),
  may(1, 'Ayer vi una Película muy buena.', 'Ayer vi una película muy buena.', 'mayuscula-en-nombre-comun'),
  may(1, 'el segura pasa por murcia.', 'El Segura pasa por Murcia.', 'minuscula-tras-punto', 'minuscula-en-nombre-propio', 'minuscula-en-nombre-propio'),
  may(1, 'Mi prima vive en españa.', 'Mi prima vive en España.', 'minuscula-en-nombre-propio'),
  may(1, 'Pablo tiene un Libro nuevo.', 'Pablo tiene un libro nuevo.', 'mayuscula-en-nombre-comun'),
  may(1, 'Hola. me llamo carmen.', 'Hola. Me llamo Carmen.', 'minuscula-tras-punto', 'minuscula-en-nombre-propio'),
  may(1, 'Los Niños juegan en el Patio.', 'Los niños juegan en el patio.', 'mayuscula-en-nombre-comun', 'mayuscula-en-nombre-comun'),
  // Nivel 2: días, meses y estaciones; gentilicios e idiomas; asignaturas; festividades; mayúsculas con tilde.
  may(2, 'El Lunes tenemos examen de Inglés.', 'El lunes tenemos examen de Inglés.', 'mayuscula-en-dia'),
  may(2, 'mi cumpleaños es en Enero.', 'Mi cumpleaños es en enero.', 'minuscula-tras-punto', 'mayuscula-en-mes'),
  may(2, 'En Verano vamos a la playa.', 'En verano vamos a la playa.', 'mayuscula-en-estacion'),
  may(2, 'Mi amigo es Murciano y habla Inglés.', 'Mi amigo es murciano y habla inglés.', 'mayuscula-en-gentilicio', 'mayuscula-en-gentilicio'),
  may(2, 'la navidad es en Diciembre.', 'La Navidad es en diciembre.', 'minuscula-tras-punto', 'minuscula-en-festividad', 'mayuscula-en-mes'),
  may(2, 'Aprobé matemáticas y lengua.', 'Aprobé Matemáticas y Lengua.', 'minuscula-en-asignatura', 'minuscula-en-asignatura'),
  may(2, 'mañana tengo lengua a primera hora.', 'Mañana tengo Lengua a primera hora.', 'minuscula-tras-punto', 'minuscula-en-asignatura'),
  may(2, 'Mi profesora de Inglés es Inglesa.', 'Mi profesora de Inglés es inglesa.', 'mayuscula-en-gentilicio'),
  may(2, 'ángela y álvaro llegan en marzo.', 'Ángela y Álvaro llegan en marzo.', 'minuscula-en-nombre-propio', 'minuscula-en-nombre-propio'),
  may(2, 'En semana santa viajo a Lorca.', 'En Semana Santa viajo a Lorca.', 'minuscula-en-festividad', 'minuscula-en-festividad'),
  may(2, 'Hoy es Martes y hace frío.', 'Hoy es martes y hace frío.', 'mayuscula-en-dia'),
  may(2, 'Los Franceses hablan Francés.', 'Los franceses hablan francés.', 'mayuscula-en-gentilicio', 'mayuscula-en-gentilicio'),
  may(2, 'Tengo examen de matemáticas el viernes.', 'Tengo examen de Matemáticas el viernes.', 'minuscula-en-asignatura'),
  may(2, 'En Otoño las hojas caen.', 'En otoño las hojas caen.', 'mayuscula-en-estacion'),
  may(2, 'el sábado llega mi prima italiana.', 'El sábado llega mi prima italiana.', 'minuscula-tras-punto'),
  may(2, 'Mi vecino es Alemán, pero habla Español.', 'Mi vecino es alemán, pero habla español.', 'mayuscula-en-gentilicio', 'mayuscula-en-gentilicio'),
  // Nivel 3: profesiones, genéricos geográficos, instituciones, títulos de obras, «yo».
  may(3, 'Cruzamos el Río Segura en bici.', 'Cruzamos el río Segura en bici.', 'mayuscula-en-generico-geografico'),
  may(3, 'Nos bañamos en el Mar Mediterráneo.', 'Nos bañamos en el mar Mediterráneo.', 'mayuscula-en-generico-geografico'),
  may(3, 'El Monte Teide está en Tenerife.', 'El monte Teide está en Tenerife.', 'mayuscula-en-generico-geografico'),
  may(3, 'La Isla de Tabarca queda cerca de Alicante.', 'La isla de Tabarca queda cerca de Alicante.', 'mayuscula-en-generico-geografico'),
  may(3, 'Mi hermana trabaja en el ministerio de educación.', 'Mi hermana trabaja en el Ministerio de Educación.', 'minuscula-en-institucion', 'minuscula-en-institucion'),
  may(3, 'Mi libro favorito es Cien Años de Soledad.', 'Mi libro favorito es Cien años de soledad.', 'mayuscula-en-titulo', 'mayuscula-en-titulo'),
  may(3, 'Cuando Yo llegué, ya se habían ido.', 'Cuando yo llegué, ya se habían ido.', 'mayuscula-en-yo'),
  may(3, 'Mañana Yo preparo la cena.', 'Mañana yo preparo la cena.', 'mayuscula-en-yo'),
  may(3, 'Mi tía es Enfermera.', 'Mi tía es enfermera.', 'mayuscula-en-profesion'),
  may(3, 'Su padre trabaja de Cocinero.', 'Su padre trabaja de cocinero.', 'mayuscula-en-profesion'),
  may(3, 'Lucía quiere ser Veterinaria.', 'Lucía quiere ser veterinaria.', 'mayuscula-en-profesion'),
  may(3, 'Subimos a la Sierra de Espuña.', 'Subimos a la sierra de Espuña.', 'mayuscula-en-generico-geografico'),
  may(3, 'Navegamos por el Río Guadalquivir.', 'Navegamos por el río Guadalquivir.', 'mayuscula-en-generico-geografico'),
  may(3, 'Mi tío trabaja en el ministerio de sanidad.', 'Mi tío trabaja en el Ministerio de Sanidad.', 'minuscula-en-institucion', 'minuscula-en-institucion'),
  may(3, 'Mi padre trabaja en el congreso de los diputados.', 'Mi padre trabaja en el Congreso de los Diputados.', 'minuscula-en-institucion', 'minuscula-en-institucion'),
  may(3, 'Mi madre es voluntaria de cruz roja.', 'Mi madre es voluntaria de Cruz Roja.', 'minuscula-en-institucion', 'minuscula-en-institucion'),
  may(3, 'Mi tío trabaja en el tribunal supremo.', 'Mi tío trabaja en el Tribunal Supremo.', 'minuscula-en-institucion', 'minuscula-en-institucion'),
  may(3, 'Leí La Isla del Tesoro en verano.', 'Leí La isla del tesoro en verano.', 'mayuscula-en-titulo', 'mayuscula-en-titulo'),
  may(3, 'Mi libro favorito es Harry Potter y la Piedra Filosofal.', 'Mi libro favorito es Harry Potter y la piedra filosofal.', 'mayuscula-en-titulo', 'mayuscula-en-titulo'),
];

/** Las palabras de la frase, como piezas para tocar. */
export const piezasMayusculas = item => item.texto.split(' ');

/** Los índices de las palabras que están mal (las que cambian entre `texto` y `correcto`). */
export function buenasMayusculas(item) {
  const corregida = item.correcto.split(' ');
  return item.texto.split(' ').flatMap((p, i) => (p !== corregida[i] ? [i] : []));
}

/** La frase corregida con las palabras cambiadas en `<b>`, el porqué de cada una y, si tocó de más, cuáles. */
export function explicacionMayusculas(item, tocadas) {
  const buenas = buenasMayusculas(item);
  const puesta = item.texto.split(' ');
  const corregida = item.correcto.split(' ');
  const frase = corregida.map((p, i) => (buenas.includes(i) ? `<b>${esc(p)}</b>` : esc(p))).join(' ');
  const motivos = buenas.map((i, k) => esc(REGLAS_MAYUSCULAS[item.tipos[k]](limpia(corregida[i])))).join(' ');
  const sobran = tocadas.filter(i => !buenas.includes(i));
  const de_mas = sobran.length
    ? ` Has tocado ${sobran.map(i => `«${esc(limpia(puesta[i]))}»`).join(' y ')}, que ${sobran.length === 1 ? 'estaba' : 'estaban'} bien escrit${sobran.length === 1 ? 'a' : 'as'}.`
    : '';
  return `Bien escrita: ${frase} ${motivos}${de_mas}`;
}

/** `tocadas-de-mas` si tocó una que estaba bien; si no, el tipo de la primera que se dejó sin tocar. */
export function idErrorMayusculas(item, tocadas) {
  const buenas = buenasMayusculas(item);
  if (tocadas.some(i => !buenas.includes(i))) return 'tocadas-de-mas';
  const falta = buenas.findIndex(i => !tocadas.includes(i));
  return item.tipos[falta < 0 ? 0 : falta];
}

// --- Motivos de las malas (ejercicios 2-4) ------------------------------------------

/** Por qué está mal una mala, según su `idError`: la explicación dice «En <mala> <motivo>». */
export const MOTIVOS = {
  // 2. El punto y la coma
  'coma-antes-de-y-final': 'sobra la coma antes de la «y» (o la «o») del final: en una enumeración, esa última coma la sustituye la «y»',
  'sin-coma-enumeracion': 'faltan las comas que separan los elementos de la enumeración',
  'minuscula-tras-punto': 'después de un punto la frase siguiente empieza con mayúscula',
  'falta-punto': 'falta un punto: son dos frases y la primera tiene que acabar en punto',
  'sin-coma-pero': 'falta la coma delante de «pero» o de «sino»: separa dos ideas que se oponen',
  'sin-coma-conector': 'falta la coma detrás del conector con el que empieza la frase',
  'sin-coma-respuesta': 'falta la coma detrás de «sí» o de «no» cuando se está contestando',
  'coma-de-mas': 'sobra una coma que separa palabras que van juntas',
  'coma-criminal': 'sobra la coma entre el sujeto y el verbo: no se separan nunca con una coma',
  'coma-inciso-incompleta': 'al inciso le falta una de sus dos comas: se abre con una coma y se cierra con otra',
  'coma-conector-incompleta': 'un conector en medio de la frase va entre dos comas, y aquí falta una',
  'sin-coma-etc': 'falta la coma delante de «etc.»',
  'etc-sin-punto': '«etc.» es una abreviatura y se escribe siempre con su punto',
  'punto-dentro-parentesis': 'el punto de la frase va fuera del paréntesis, no dentro',
  'coma-y-mal-puesta': 'la coma está donde no corresponde: va delante de la «y» que empieza otra idea, no entre dos elementos de la lista',
  // 3. Dos puntos, puntos suspensivos, saludo, raya y comillas
  'coma-tras-saludo': 'tras el saludo de una carta o de un correo van dos puntos, no coma (la coma es un calco del inglés)',
  'sin-coma-vocativo-saludo': 'falta la coma que separa el saludo de la persona a quien te diriges',
  'minuscula-tras-saludo': 'después de los dos puntos del saludo se empieza con mayúscula',
  'punto-y-coma-tras-saludo': 'tras el saludo van dos puntos, no punto y coma',
  'dos-puntos-mal-puestos': 'los dos puntos van justo después de lo que anuncia la lista o la cita, no en medio de la frase',
  'punto-y-coma-por-dos-puntos': 'para anunciar una lista o una cita se usan dos puntos, no punto y coma',
  'puntos-suspensivos-mal': 'los puntos suspensivos son exactamente tres y van pegados a la palabra anterior',
  'etc-con-puntos-suspensivos': '«etc.» ya significa «y lo demás»: nunca lleva puntos suspensivos detrás',
  'sin-punto-y-coma-lista': 'cuando cada elemento de la lista lleva comas dentro, los elementos se separan con punto y coma',
  'punto-y-coma-mal-puesto': 'el punto y coma separa un elemento de otro, no cada nombre de su explicación',
  'guion-por-raya': 'el diálogo se escribe con raya (—), que es más larga que el guion (-)',
  'espacio-tras-raya': 'la raya con la que empieza el diálogo va pegada a la primera palabra, sin espacio',
  'falta-espacio-raya': 'la raya que abre el comentario del narrador va separada de la palabra anterior por un espacio',
  'coma-dentro-comillas': 'la coma va fuera de las comillas, no dentro',
  'sin-coma-tras-cita': 'tras la cita hay que poner coma antes de decir quién habla',
  // 4. El correo al profesor
  'abreviatura-de-chat': 'hay abreviaturas del chat (q, k, xq, tb, porfa…): en un correo se escribe la palabra entera',
  'sin-mayuscula-inicial': 'el mensaje y cada frase empiezan con mayúscula',
  'sin-mayuscula-nombre': 'los nombres de persona empiezan con mayúscula',
  'sin-signo-apertura': 'falta el signo de apertura (¿ o ¡): en español se abre y se cierra',
  'sin-tilde-correo': 'faltan tildes: «qué», «cuándo», «explicación»… se escriben con ellas',
  'sin-saludo-dos-puntos': 'tras el saludo de un correo van dos puntos, no coma',
};

/** Una mala: [texto, idError]. */
const ps = (nivel, bien, ...malas) => ({ nivel, bien, malas });

// --- 2. El punto y la coma -----------------------------------------------------------

export const PUNTO_COMA = [
  // Nivel 1: la coma de las enumeraciones y el punto y seguido con mayúscula.
  ps(1, 'Compré pan, leche, huevos y fruta.', ['Compré pan, leche, huevos, y fruta.', 'coma-antes-de-y-final'], ['Compré pan leche huevos y fruta.', 'sin-coma-enumeracion']),
  ps(1, 'En mi mochila llevo libros, cuadernos y un estuche.', ['En mi mochila llevo libros, cuadernos, y un estuche.', 'coma-antes-de-y-final'], ['En mi mochila llevo libros cuadernos y un estuche.', 'sin-coma-enumeracion']),
  ps(1, 'Llegué tarde. El profesor ya había empezado.', ['Llegué tarde. el profesor ya había empezado.', 'minuscula-tras-punto'], ['Llegué tarde el profesor ya había empezado.', 'falta-punto']),
  ps(1, 'Ayer fuimos al parque, al cine y a casa de Marta.', ['Ayer fuimos al parque, al cine, y a casa de Marta.', 'coma-antes-de-y-final'], ['Ayer fuimos al parque al cine y a casa de Marta.', 'sin-coma-enumeracion']),
  ps(1, 'Hoy tengo clase de Lengua. Mañana tengo Música.', ['Hoy tengo clase de Lengua. mañana tengo Música.', 'minuscula-tras-punto'], ['Hoy tengo clase de Lengua mañana tengo Música.', 'falta-punto']),
  ps(1, 'Necesito una regla, un compás, un lápiz y una goma.', ['Necesito una regla, un compás, un lápiz, y una goma.', 'coma-antes-de-y-final'], ['Necesito una regla un compás un lápiz y una goma.', 'sin-coma-enumeracion']),
  ps(1, 'Mi hermano come manzanas, peras y uvas.', ['Mi hermano come manzanas, peras, y uvas.', 'coma-antes-de-y-final'], ['Mi hermano come manzanas peras y uvas.', 'sin-coma-enumeracion']),
  ps(1, 'Hace frío. Ponte el abrigo.', ['Hace frío. ponte el abrigo.', 'minuscula-tras-punto'], ['Hace frío ponte el abrigo.', 'falta-punto']),
  ps(1, 'Pablo, Lucía y Marcos juegan al baloncesto.', ['Pablo, Lucía, y Marcos juegan al baloncesto.', 'coma-antes-de-y-final'], ['Pablo Lucía y Marcos juegan al baloncesto.', 'sin-coma-enumeracion']),
  ps(1, 'Estudié Lengua, Inglés y Matemáticas.', ['Estudié Lengua, Inglés, y Matemáticas.', 'coma-antes-de-y-final'], ['Estudié Lengua Inglés y Matemáticas.', 'sin-coma-enumeracion']),
  ps(1, 'Terminó la clase. Salimos al patio.', ['Terminó la clase. salimos al patio.', 'minuscula-tras-punto'], ['Terminó la clase Salimos al patio.', 'falta-punto']),
  ps(1, 'En la nevera hay leche, queso, jamón y yogures.', ['En la nevera hay leche, queso, jamón, y yogures.', 'coma-antes-de-y-final'], ['En la nevera hay leche queso jamón y yogures.', 'sin-coma-enumeracion']),
  ps(1, 'Mi madre trabaja en un hospital. Mi padre es profesor.', ['Mi madre trabaja en un hospital. mi padre es profesor.', 'minuscula-tras-punto'], ['Mi madre trabaja en un hospital Mi padre es profesor.', 'falta-punto']),
  ps(1, 'Vimos leones, monos, jirafas y elefantes.', ['Vimos leones, monos, jirafas, y elefantes.', 'coma-antes-de-y-final'], ['Vimos leones monos jirafas y elefantes.', 'sin-coma-enumeracion']),
  ps(1, 'Ha llovido toda la noche. Hay charcos por todas partes.', ['Ha llovido toda la noche. hay charcos por todas partes.', 'minuscula-tras-punto'], ['Ha llovido toda la noche Hay charcos por todas partes.', 'falta-punto']),
  ps(1, 'Prefiero el rojo, el azul o el verde.', ['Prefiero el rojo, el azul, o el verde.', 'coma-antes-de-y-final'], ['Prefiero el rojo el azul o el verde.', 'sin-coma-enumeracion']),
  // Nivel 2: pero y sino, conectores al principio, sí y no al contestar, el inciso de dos lados.
  ps(2, 'Quería ir al cine, pero llovía mucho.', ['Quería ir al cine pero llovía mucho.', 'sin-coma-pero'], ['Quería ir al cine, pero, llovía mucho.', 'coma-de-mas']),
  ps(2, 'Sin embargo, no pude ir.', ['Sin embargo no pude ir.', 'sin-coma-conector'], ['Sin embargo, no pude, ir.', 'coma-de-mas']),
  ps(2, 'Además, tengo que estudiar Lengua.', ['Además tengo que estudiar Lengua.', 'sin-coma-conector'], ['Además, tengo que, estudiar Lengua.', 'coma-de-mas']),
  ps(2, 'Por ejemplo, el seis es par.', ['Por ejemplo el seis es par.', 'sin-coma-conector'], ['Por ejemplo, el seis, es par.', 'coma-criminal']),
  ps(2, 'Es decir, hay que repetirlo.', ['Es decir hay que repetirlo.', 'sin-coma-conector'], ['Es decir, hay, que repetirlo.', 'coma-de-mas']),
  ps(2, 'Por último, cierra la puerta.', ['Por último cierra la puerta.', 'sin-coma-conector'], ['Por último, cierra, la puerta.', 'coma-de-mas']),
  ps(2, 'No, no he terminado.', ['No no he terminado.', 'sin-coma-respuesta'], ['No no, he terminado.', 'coma-de-mas']),
  ps(2, 'No quiero agua, sino zumo.', ['No quiero agua sino zumo.', 'sin-coma-pero'], ['No quiero, agua sino zumo.', 'coma-de-mas']),
  ps(2, 'No es lunes, sino martes.', ['No es lunes sino martes.', 'sin-coma-pero'], ['No es, lunes sino martes.', 'coma-de-mas']),
  ps(2, 'Estudié mucho, pero suspendí.', ['Estudié mucho pero suspendí.', 'sin-coma-pero'], ['Estudié, mucho pero suspendí.', 'coma-de-mas']),
  ps(2, 'Me duele la cabeza, pero iré a clase.', ['Me duele la cabeza pero iré a clase.', 'sin-coma-pero'], ['Me duele, la cabeza pero iré a clase.', 'coma-de-mas']),
  ps(2, 'En primer lugar, abre el libro.', ['En primer lugar abre el libro.', 'sin-coma-conector'], ['En primer lugar, abre, el libro.', 'coma-de-mas']),
  ps(2, 'En resumen, hay que practicar más.', ['En resumen hay que practicar más.', 'sin-coma-conector'], ['En resumen, hay que, practicar más.', 'coma-de-mas']),
  ps(2, 'En cambio, mi hermana prefiere el té.', ['En cambio mi hermana prefiere el té.', 'sin-coma-conector'], ['En cambio, mi hermana, prefiere el té.', 'coma-criminal']),
  ps(2, 'Mi vecina, la del tercero, trabaja en Lorca.', ['Mi vecina, la del tercero trabaja en Lorca.', 'coma-inciso-incompleta'], ['Mi vecina la del tercero, trabaja en Lorca.', 'coma-inciso-incompleta']),
  ps(2, 'Mi profesor, el de Lengua, es de Cartagena.', ['Mi profesor, el de Lengua es de Cartagena.', 'coma-inciso-incompleta'], ['Mi profesor el de Lengua, es de Cartagena.', 'coma-inciso-incompleta']),
  // Nivel 3: «etc.», conectores en medio, el punto fuera del paréntesis, la coma delante de la «y» que abre otra idea.
  ps(3, 'En el estuche llevo lápices, gomas, etc.', ['En el estuche llevo lápices, gomas etc.', 'sin-coma-etc'], ['En el estuche llevo lápices, gomas, etc', 'etc-sin-punto']),
  ps(3, 'Compré cuadernos, bolígrafos, rotuladores, etc.', ['Compré cuadernos, bolígrafos, rotuladores etc.', 'sin-coma-etc'], ['Compré cuadernos, bolígrafos, rotuladores, etc', 'etc-sin-punto']),
  ps(3, 'En la granja hay vacas, cerdos, gallinas, etc.', ['En la granja hay vacas, cerdos, gallinas etc.', 'sin-coma-etc'], ['En la granja hay vacas, cerdos, gallinas, etc', 'etc-sin-punto']),
  ps(3, 'En la nevera tengo yogures, fruta, queso, etc.', ['En la nevera tengo yogures, fruta, queso etc.', 'sin-coma-etc'], ['En la nevera tengo yogures, fruta, queso, etc', 'etc-sin-punto']),
  ps(3, 'Iremos, sin embargo, por la tarde.', ['Iremos sin embargo, por la tarde.', 'coma-conector-incompleta'], ['Iremos, sin embargo por la tarde.', 'coma-conector-incompleta']),
  ps(3, 'Mi hermano, por ejemplo, nunca llega tarde.', ['Mi hermano por ejemplo, nunca llega tarde.', 'coma-conector-incompleta'], ['Mi hermano, por ejemplo nunca llega tarde.', 'coma-conector-incompleta']),
  ps(3, 'El examen, además, fue muy largo.', ['El examen además, fue muy largo.', 'coma-conector-incompleta'], ['El examen, además fue muy largo.', 'coma-conector-incompleta']),
  ps(3, 'Tu idea, sin embargo, me parece buena.', ['Tu idea sin embargo, me parece buena.', 'coma-conector-incompleta'], ['Tu idea, sin embargo me parece buena.', 'coma-conector-incompleta']),
  ps(3, 'Esta calle, por cierto, está cortada.', ['Esta calle por cierto, está cortada.', 'coma-conector-incompleta'], ['Esta calle, por cierto está cortada.', 'coma-conector-incompleta']),
  ps(3, 'Marta, en cambio, prefiere el campo.', ['Marta en cambio, prefiere el campo.', 'coma-conector-incompleta'], ['Marta, en cambio prefiere el campo.', 'coma-conector-incompleta']),
  ps(3, 'La profesora, además, nos dio tarea.', ['La profesora además, nos dio tarea.', 'coma-conector-incompleta'], ['La profesora, además nos dio tarea.', 'coma-conector-incompleta']),
  ps(3, 'Llegó tarde (como siempre).', ['Llegó tarde (como siempre.)', 'punto-dentro-parentesis'], ['Llegó tarde (como siempre)', 'falta-punto']),
  ps(3, 'Mi tío vive en Lorca (Murcia).', ['Mi tío vive en Lorca (Murcia.)', 'punto-dentro-parentesis'], ['Mi tío vive en Lorca (Murcia)', 'falta-punto']),
  ps(3, 'Fuimos a la playa (otra vez).', ['Fuimos a la playa (otra vez.)', 'punto-dentro-parentesis'], ['Fuimos a la playa (otra vez)', 'falta-punto']),
  ps(3, 'Ganó el equipo de Ana (por poco).', ['Ganó el equipo de Ana (por poco.)', 'punto-dentro-parentesis'], ['Ganó el equipo de Ana (por poco)', 'falta-punto']),
  ps(3, 'Compré pan y leche, y después fui al cine.', ['Compré pan, y leche y después fui al cine.', 'coma-y-mal-puesta'], ['Compré pan y leche y, después fui al cine.', 'coma-y-mal-puesta']),
  ps(3, 'Pedí agua y pan, y después pagué.', ['Pedí agua, y pan y después pagué.', 'coma-y-mal-puesta'], ['Pedí agua y pan y, después pagué.', 'coma-y-mal-puesta']),
];

// --- 3. Dos puntos, puntos suspensivos y el saludo ------------------------------------

export const DOS_PUNTOS = [
  // Nivel 1: el saludo de carta y de correo, con la mayúscula en la línea siguiente.
  ps(1, 'Hola, Juan Luis:\nHe terminado la tarea.', ['Hola, Juan Luis,\nHe terminado la tarea.', 'coma-tras-saludo'], ['Hola, Juan Luis:\nhe terminado la tarea.', 'minuscula-tras-saludo']),
  ps(1, 'Hola, Marta:\n¿Vienes a mi casa?', ['Hola Marta,\n¿Vienes a mi casa?', 'coma-tras-saludo'], ['Hola, Marta;\n¿Vienes a mi casa?', 'punto-y-coma-tras-saludo']),
  ps(1, 'Buenos días, profesor:\nNo puedo venir mañana.', ['Buenos días profesor:\nNo puedo venir mañana.', 'sin-coma-vocativo-saludo'], ['Buenos días, profesor,\nNo puedo venir mañana.', 'coma-tras-saludo']),
  ps(1, 'Querida Lucía:\nGracias por tu regalo.', ['Querida Lucía,\nGracias por tu regalo.', 'coma-tras-saludo'], ['Querida Lucía:\ngracias por tu regalo.', 'minuscula-tras-saludo']),
  ps(1, 'Hola, Pablo:\nMañana jugamos a las cinco.', ['Hola Pablo:\nMañana jugamos a las cinco.', 'sin-coma-vocativo-saludo'], ['Hola, Pablo:\nmañana jugamos a las cinco.', 'minuscula-tras-saludo']),
  ps(1, 'Buenas tardes:\nQuería preguntarle una duda.', ['Buenas tardes,\nQuería preguntarle una duda.', 'coma-tras-saludo'], ['Buenas tardes:\nquería preguntarle una duda.', 'minuscula-tras-saludo']),
  ps(1, 'Hola, Marcos:\nTe paso los apuntes.', ['Hola, Marcos,\nTe paso los apuntes.', 'coma-tras-saludo'], ['Hola Marcos:\nTe paso los apuntes.', 'sin-coma-vocativo-saludo']),
  ps(1, 'Estimada profesora:\nLe escribo por la tarea.', ['Estimada profesora,\nLe escribo por la tarea.', 'coma-tras-saludo'], ['Estimada profesora;\nLe escribo por la tarea.', 'punto-y-coma-tras-saludo']),
  ps(1, 'Querido Pablo:\nFeliz cumpleaños.', ['Querido Pablo,\nFeliz cumpleaños.', 'coma-tras-saludo'], ['Querido Pablo:\nfeliz cumpleaños.', 'minuscula-tras-saludo']),
  ps(1, 'Hola, Lucía:\n¿Qué hay de deberes?', ['Hola Lucía,\n¿Qué hay de deberes?', 'coma-tras-saludo'], ['Hola, Lucía:\n¿qué hay de deberes?', 'minuscula-tras-saludo']),
  ps(1, 'Buenos días:\nSoy Marcos, de primero.', ['Buenos días,\nSoy Marcos, de primero.', 'coma-tras-saludo'], ['Buenos días:\nsoy Marcos, de primero.', 'minuscula-tras-saludo']),
  ps(1, 'Hola, Juan Luis:\n¿Puede repetirme la explicación?', ['Hola Juan Luis:\n¿Puede repetirme la explicación?', 'sin-coma-vocativo-saludo'], ['Hola, Juan Luis,\n¿Puede repetirme la explicación?', 'coma-tras-saludo']),
  ps(1, 'Hola, Marta:\nGracias por tu ayuda.', ['Hola, Marta;\nGracias por tu ayuda.', 'punto-y-coma-tras-saludo'], ['Hola Marta,\nGracias por tu ayuda.', 'coma-tras-saludo']),
  ps(1, 'Querida abuela:\nEstoy muy bien.', ['Querida abuela,\nEstoy muy bien.', 'coma-tras-saludo'], ['Querida abuela:\nestoy muy bien.', 'minuscula-tras-saludo']),
  ps(1, 'Hola, Álvaro:\nMe he dejado el libro en clase.', ['Hola Álvaro:\nMe he dejado el libro en clase.', 'sin-coma-vocativo-saludo'], ['Hola, Álvaro,\nMe he dejado el libro en clase.', 'coma-tras-saludo']),
  ps(1, 'Hola, Ángela:\nVoy a llegar tarde.', ['Hola, Ángela;\nVoy a llegar tarde.', 'punto-y-coma-tras-saludo'], ['Hola Ángela,\nVoy a llegar tarde.', 'coma-tras-saludo']),
  // Nivel 2: dos puntos antes de una lista o de una cita, puntos suspensivos y «etc.».
  ps(2, 'Necesitas tres cosas: regla, compás y lápiz.', ['Necesitas tres cosas; regla, compás y lápiz.', 'punto-y-coma-por-dos-puntos'], ['Necesitas: tres cosas regla, compás y lápiz.', 'dos-puntos-mal-puestos']),
  ps(2, 'Tengo dos hermanos: Marcos y Lucía.', ['Tengo dos hermanos; Marcos y Lucía.', 'punto-y-coma-por-dos-puntos'], ['Tengo: dos hermanos Marcos y Lucía.', 'dos-puntos-mal-puestos']),
  ps(2, 'Traed lo siguiente: bocadillo, agua y gorra.', ['Traed lo siguiente; bocadillo, agua y gorra.', 'punto-y-coma-por-dos-puntos'], ['Traed: lo siguiente bocadillo, agua y gorra.', 'dos-puntos-mal-puestos']),
  ps(2, 'Ingredientes: harina, huevos y azúcar.', ['Ingredientes; harina, huevos y azúcar.', 'punto-y-coma-por-dos-puntos'], ['Ingredientes harina: huevos y azúcar.', 'dos-puntos-mal-puestos']),
  ps(2, 'En la mochila llevo tres cosas: libro, estuche y agenda.', ['En la mochila llevo tres cosas; libro, estuche y agenda.', 'punto-y-coma-por-dos-puntos'], ['En la mochila llevo: tres cosas libro, estuche y agenda.', 'dos-puntos-mal-puestos']),
  ps(2, 'Marta dijo: «Mañana no hay clase».', ['Marta dijo; «Mañana no hay clase».', 'punto-y-coma-por-dos-puntos'], ['Marta: dijo «Mañana no hay clase».', 'dos-puntos-mal-puestos']),
  ps(2, 'El profesor gritó: «¡Silencio!».', ['El profesor gritó; «¡Silencio!».', 'punto-y-coma-por-dos-puntos'], ['El profesor: gritó «¡Silencio!».', 'dos-puntos-mal-puestos']),
  ps(2, 'Mi madre me preguntó: «¿Has comido?».', ['Mi madre me preguntó; «¿Has comido?».', 'punto-y-coma-por-dos-puntos'], ['Mi madre: me preguntó «¿Has comido?».', 'dos-puntos-mal-puestos']),
  ps(2, 'No sé qué decir...', ['No sé qué decir..', 'puntos-suspensivos-mal'], ['No sé qué decir....', 'puntos-suspensivos-mal']),
  ps(2, 'Pues... no lo sé.', ['Pues.. no lo sé.', 'puntos-suspensivos-mal'], ['Pues .... no lo sé.', 'puntos-suspensivos-mal']),
  ps(2, 'Quizá... pero no estoy seguro.', ['Quizá.... pero no estoy seguro.', 'puntos-suspensivos-mal'], ['Quizá .. pero no estoy seguro.', 'puntos-suspensivos-mal']),
  ps(2, 'Me dijo que sí... y luego se fue.', ['Me dijo que sí.. y luego se fue.', 'puntos-suspensivos-mal'], ['Me dijo que sí .... y luego se fue.', 'puntos-suspensivos-mal']),
  ps(2, 'Si es que... bueno, da igual.', ['Si es que.. bueno, da igual.', 'puntos-suspensivos-mal'], ['Si es que .... bueno, da igual.', 'puntos-suspensivos-mal']),
  ps(2, 'Llegué a casa... Estaba todo oscuro.', ['Llegué a casa.... Estaba todo oscuro.', 'puntos-suspensivos-mal'], ['Llegué a casa.. Estaba todo oscuro.', 'puntos-suspensivos-mal']),
  ps(2, 'Se oyó un ruido... Nadie se movió.', ['Se oyó un ruido .... Nadie se movió.', 'puntos-suspensivos-mal'], ['Se oyó un ruido.. Nadie se movió.', 'puntos-suspensivos-mal']),
  ps(2, 'Hay frutas, verduras, legumbres, etc.', ['Hay frutas, verduras, legumbres, etc...', 'etc-con-puntos-suspensivos'], ['Hay frutas, verduras, legumbres, etc....', 'etc-con-puntos-suspensivos']),
  ps(2, 'Lleva abrigo, bufanda, guantes, etc.', ['Lleva abrigo, bufanda, guantes, etc...', 'etc-con-puntos-suspensivos'], ['Lleva abrigo, bufanda, guantes, etc....', 'etc-con-puntos-suspensivos']),
  // Nivel 3: punto y coma en listas con comas dentro, raya de diálogo, coma fuera de las comillas.
  ps(3, 'Participan Pablo, de Murcia; Marta, de Lorca; Lucía, de Cartagena.', ['Participan Pablo, de Murcia, Marta, de Lorca, Lucía, de Cartagena.', 'sin-punto-y-coma-lista'], ['Participan Pablo; de Murcia, Marta; de Lorca, Lucía; de Cartagena.', 'punto-y-coma-mal-puesto']),
  ps(3, 'Vinieron Hugo, el portero; Elena, la capitana; Carmen, la entrenadora.', ['Vinieron Hugo, el portero, Elena, la capitana, Carmen, la entrenadora.', 'sin-punto-y-coma-lista'], ['Vinieron Hugo; el portero, Elena; la capitana, Carmen; la entrenadora.', 'punto-y-coma-mal-puesto']),
  ps(3, 'Han ganado Ángela, de primero; Álvaro, de segundo; Marcos, de tercero.', ['Han ganado Ángela, de primero, Álvaro, de segundo, Marcos, de tercero.', 'sin-punto-y-coma-lista'], ['Han ganado Ángela; de primero, Álvaro; de segundo, Marcos; de tercero.', 'punto-y-coma-mal-puesto']),
  ps(3, 'Presentan Lucía, con su poema; Pablo, con su cuento; Marta, con su dibujo.', ['Presentan Lucía, con su poema, Pablo, con su cuento, Marta, con su dibujo.', 'sin-punto-y-coma-lista'], ['Presentan Lucía; con su poema, Pablo; con su cuento, Marta; con su dibujo.', 'punto-y-coma-mal-puesto']),
  ps(3, '—Hola —dijo Ana.', ['-Hola -dijo Ana.', 'guion-por-raya'], ['— Hola —dijo Ana.', 'espacio-tras-raya']),
  ps(3, '—Mañana no hay clase —dijo el profesor.', ['-Mañana no hay clase -dijo el profesor.', 'guion-por-raya'], ['—Mañana no hay clase—dijo el profesor.', 'falta-espacio-raya']),
  ps(3, '—¿Dónde vives? —preguntó Lucía.', ['— ¿Dónde vives? —preguntó Lucía.', 'espacio-tras-raya'], ['—¿Dónde vives?—preguntó Lucía.', 'falta-espacio-raya']),
  ps(3, '—No lo sé —respondió Pablo.', ['-No lo sé -respondió Pablo.', 'guion-por-raya'], ['— No lo sé —respondió Pablo.', 'espacio-tras-raya']),
  ps(3, '—Gracias —dijo Marta con una sonrisa.', ['—Gracias—dijo Marta con una sonrisa.', 'falta-espacio-raya'], ['-Gracias -dijo Marta con una sonrisa.', 'guion-por-raya']),
  ps(3, '—Ven aquí —ordenó la directora.', ['— Ven aquí —ordenó la directora.', 'espacio-tras-raya'], ['-Ven aquí -ordenó la directora.', 'guion-por-raya']),
  ps(3, '—¡Corre! —gritó Marcos.', ['—¡Corre!—gritó Marcos.', 'falta-espacio-raya'], ['-¡Corre! -gritó Marcos.', 'guion-por-raya']),
  ps(3, '—Ya voy —dijo Hugo.', ['— Ya voy —dijo Hugo.', 'espacio-tras-raya'], ['—Ya voy—dijo Hugo.', 'falta-espacio-raya']),
  ps(3, '«Mañana no hay clase», dijo el profesor.', ['«Mañana no hay clase,» dijo el profesor.', 'coma-dentro-comillas'], ['«Mañana no hay clase» dijo el profesor.', 'sin-coma-tras-cita']),
  ps(3, '«Estoy listo», respondió Pablo.', ['«Estoy listo,» respondió Pablo.', 'coma-dentro-comillas'], ['«Estoy listo» respondió Pablo.', 'sin-coma-tras-cita']),
  ps(3, '«Vamos a ganar», gritó el capitán.', ['«Vamos a ganar,» gritó el capitán.', 'coma-dentro-comillas'], ['«Vamos a ganar» gritó el capitán.', 'sin-coma-tras-cita']),
  ps(3, '«Tengo hambre», dijo Marta.', ['«Tengo hambre,» dijo Marta.', 'coma-dentro-comillas'], ['«Tengo hambre» dijo Marta.', 'sin-coma-tras-cita']),
  ps(3, '«No lo olvides», me avisó mi madre.', ['«No lo olvides,» me avisó mi madre.', 'coma-dentro-comillas'], ['«No lo olvides» me avisó mi madre.', 'sin-coma-tras-cita']),
];

// --- 4. El correo al profesor ---------------------------------------------------------

/** Las abreviaturas del chat de las malas y la palabra que sustituyen (el test las deshace para comparar). */
export const ABREVIATURAS = { q: 'que', k: 'que', xq: 'porque', pq: 'porque', tb: 'también', x: 'por', porfa: 'por favor', wapo: 'guapo', kiero: 'quiero', bn: 'bien' };

const ABREV = 'abreviatura-de-chat';
const MAYUS = 'sin-mayuscula-inicial';
const APERT = 'sin-signo-apertura';
const TILDE = 'sin-tilde-correo';
const NOMBRE = 'sin-mayuscula-nombre';

/** Nivel 3 (estructura y registro): se monta con piezas, para que cada correo sea distinto y esté bien escrito. */
const SALUDOS = [
  ['Hola, Juan Luis:', 'Hola Juan Luis,'],
  ['Buenos días, Juan Luis:', 'Buenos días Juan Luis,'],
  ['Buenas tardes:', 'Buenas tardes,'],
  ['Estimado profesor:', 'Estimado profesor,'],
  ['Hola, profesor:', 'Hola profesor,'],
];
const DESPEDIDAS = ['Un saludo,', 'Gracias,', 'Muchas gracias,', 'Saludos,'];
const FIRMAS = ['Marta', 'Lucía', 'Pablo', 'Marcos', 'Ángela', 'Álvaro', 'Hugo', 'Elena', 'Carmen'];
const CUERPOS = [
  '¿Puede indicarme dónde están los ejercicios de la semana?',
  'Le escribo para avisarle de que el viernes no podré asistir.',
  'No he podido entregar la tarea a tiempo. ¿Puedo enviársela hoy?',
  'Tengo una duda sobre el problema de los autobuses.',
  'Quería pedirle los apuntes de ayer, porque estuve enfermo.',
  '¿Podría repasar con nosotros el criterio de divisibilidad por tres?',
  'Le adjunto el trabajo de esta semana. Si hay algún fallo, dígamelo.',
  '¿A qué hora puedo pasar mañana por su despacho?',
  'Mi compañera y yo queremos repetir el examen. ¿Es posible?',
  'No tengo claro qué hay que estudiar para la prueba.',
  'Ya he corregido la tarea. ¿Puede revisarla de nuevo?',
  'Quisiera saber si puedo entregar la hoja el lunes.',
  'Gracias por la explicación de hoy; me ha ayudado mucho.',
  '¿Puede decirme qué nota he sacado en el trabajo?',
  'Me gustaría saber cuándo es la recuperación.',
  'Hemos quedado para estudiar el jueves. ¿Podemos usar el aula?',
];
// Qué dos fallos lleva cada correo del nivel 3 (por turnos, sin repetir id en el mismo correo).
// Solo fallos inequívocos: la puntuación de la despedida y de la firma no se regula, así que no se usa.
const FALLOS = [['saludo', 'tilde'], ['saludo', 'mayuscula'], ['mayuscula', 'tilde'], ['saludo', 'mayuscula'], ['saludo', 'tilde'], ['mayuscula', 'tilde'], ['saludo', 'tilde'], ['mayuscula', 'apertura'],
  ['saludo', 'apertura'], ['saludo', 'tilde'], ['mayuscula', 'apertura'], ['saludo', 'mayuscula'], ['saludo', 'tilde'], ['mayuscula', 'apertura'], ['saludo', 'tilde'], ['saludo', 'apertura']];
const sinAcentos = t => t.replace(/[áéíóú]/g, c => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }[c]));
const minusculaInicial = t => t.replace(/\p{L}/u, c => c.toLowerCase());

function correoNivel3(i) {
  const [bienSaludo, malSaludo] = SALUDOS[i % SALUDOS.length];
  const despedida = DESPEDIDAS[i % DESPEDIDAS.length];
  const firma = FIRMAS[i % FIRMAS.length];
  const cuerpo = CUERPOS[i];
  const correo = ({ saludo = bienSaludo, texto = cuerpo, cierre = `${despedida}\n${firma}` } = {}) => `${saludo}\n${texto}\n${cierre}`;
  const fallo = {
    saludo: [correo({ saludo: malSaludo }), 'sin-saludo-dos-puntos'],
    tilde: [correo({ texto: sinAcentos(cuerpo) }), TILDE],
    apertura: [correo({ texto: cuerpo.replace('¿', '') }), APERT],
    mayuscula: [correo({ texto: minusculaInicial(cuerpo) }), MAYUS],
  };
  return ps(3, correo(), ...FALLOS[i % FALLOS.length].map(k => fallo[k]));
}

export const CORREOS = [
  // Nivel 1: abreviaturas del chat, falta de ¿ ¡ y de mayúscula inicial, en una o dos líneas.
  ps(1, '¿Puede decirme qué ejercicio hay que hacer, por favor?', ['puede decirme q ejercicio hay k hacer porfa', ABREV], ['Puede decirme qué ejercicio hay que hacer, por favor?', APERT]),
  ps(1, 'Hola, profe. ¿Qué tengo que traer mañana?', ['hola profe q tengo q traer mañana', ABREV], ['hola, profe. ¿Qué tengo que traer mañana?', MAYUS]),
  ps(1, '¡Gracias, profe! Ya lo he entendido.', ['Gracias, profe! Ya lo he entendido.', APERT], ['¡gracias, profe! Ya lo he entendido.', MAYUS]),
  ps(1, 'No puedo venir porque estoy enfermo.', ['no puedo venir xq estoy enfermo', ABREV], ['no puedo venir porque estoy enfermo.', MAYUS]),
  ps(1, 'Yo también he terminado la tarea.', ['yo tb he terminado la tarea', ABREV], ['Yo tambien he terminado la tarea.', TILDE]),
  ps(1, '¿Por qué no hay clase hoy?', ['x q no hay clase hoy', ABREV], ['¿Por que no hay clase hoy?', TILDE]),
  ps(1, 'Hola. ¿Qué tal estás?', ['hola q tal estas', ABREV], ['Hola. Qué tal estás?', APERT]),
  ps(1, 'Quiero que me ayudes con la tarea.', ['kiero q me ayudes con la tarea', ABREV], ['quiero que me ayudes con la tarea.', MAYUS]),
  ps(1, 'Nos vemos mañana en clase, ¿vale?', ['Nos vemos mañana en clase, vale?', APERT], ['nos vemos mañana en clase, ¿vale?', MAYUS]),
  ps(1, 'Mi hermano también viene a la fiesta.', ['mi hermano tb viene a la fiesta', ABREV], ['Mi hermano tambien viene a la fiesta.', TILDE]),
  ps(1, '¡Qué guapo es tu perro!', ['q wapo es tu perro', ABREV], ['Qué guapo es tu perro!', APERT]),
  ps(1, 'Hoy no voy porque me duele la cabeza.', ['hoy no voy xq me duele la cabeza', ABREV], ['hoy no voy porque me duele la cabeza.', MAYUS]),
  ps(1, 'Dime qué ejercicio toca, por favor.', ['dime q ejercicio toca porfa', ABREV], ['Dime que ejercicio toca, por favor.', TILDE]),
  ps(1, 'Sé que hoy hay examen, pero no estoy preparado.', ['se k hoy hay examen pero no estoy preparado', ABREV], ['Se que hoy hay examen, pero no estoy preparado.', TILDE]),
  ps(1, '¿Puedes enviarme los apuntes, por favor?', ['puedes enviarme los apuntes porfa', ABREV], ['Puedes enviarme los apuntes, por favor?', APERT]),
  ps(1, 'Te llamo luego porque ahora no puedo.', ['te llamo luego xq ahora no puedo', ABREV], ['te llamo luego porque ahora no puedo.', MAYUS]),
  // Nivel 2: tildes, mayúsculas, signos y nombres en mensajes con saludo, pregunta y «Gracias».
  ps(2, 'Hola, Juan Luis:\n¿Puede decirme qué nota he sacado en el examen?\nGracias.', ['Hola, Juan Luis:\n¿Puede decirme que nota he sacado en el examen?\nGracias.', TILDE], ['Hola, Juan Luis:\nPuede decirme qué nota he sacado en el examen?\nGracias.', APERT]),
  ps(2, 'Buenos días, Juan Luis:\nMañana no podré venir a clase porque tengo médico.\nGracias.', ['Buenos días, Juan Luis:\nMañana no podré venir a clase porque tengo medico.\nGracias.', TILDE], ['Buenos días, juan luis:\nMañana no podré venir a clase porque tengo médico.\nGracias.', NOMBRE]),
  ps(2, 'Hola, Juan Luis:\n¿Hay que entregar la tarea el lunes o el martes?\nGracias.', ['Hola, Juan Luis:\nHay que entregar la tarea el lunes o el martes?\nGracias.', APERT], ['Hola, Juan Luis:\n¿hay que entregar la tarea el lunes o el martes?\nGracias.', MAYUS]),
  ps(2, 'Hola, Juan Luis:\nNo he entendido el ejercicio cuatro. ¿Puede explicármelo?\nGracias.', ['Hola, Juan Luis:\nNo he entendido el ejercicio cuatro. ¿Puede explicarmelo?\nGracias.', TILDE], ['Hola, Juan Luis:\nNo he entendido el ejercicio cuatro. ¿puede explicármelo?\nGracias.', MAYUS]),
  ps(2, 'Buenas tardes, Juan Luis:\nQuería preguntarle cuándo es la próxima prueba.\nMuchas gracias.', ['Buenas tardes, Juan Luis:\nQuería preguntarle cuando es la proxima prueba.\nMuchas gracias.', TILDE], ['Buenas tardes, Juan Luis:\nquería preguntarle cuándo es la próxima prueba.\nMuchas gracias.', MAYUS]),
  ps(2, 'Hola, Juan Luis:\nLe adjunto la tarea de esta semana. Si hay algún fallo, dígamelo.\nGracias.', ['Hola, Juan Luis:\nLe adjunto la tarea de esta semana. Si hay algun fallo, digamelo.\nGracias.', TILDE], ['Hola, Juan Luis:\nLe adjunto la tarea de esta semana. si hay algún fallo, dígamelo.\nGracias.', MAYUS]),
  ps(2, 'Hola, Juan Luis:\n¿Puede repetir la explicación de los divisores?\nGracias.', ['Hola, Juan Luis:\n¿Puede repetir la explicacion de los divisores?\nGracias.', TILDE], ['Hola, Juan Luis:\nPuede repetir la explicación de los divisores?\nGracias.', APERT]),
  ps(2, 'Buenos días, Juan Luis:\nPerdone, ¿me puede decir a qué hora es la tutoría?\nGracias.', ['Buenos días, Juan Luis:\nPerdone, ¿me puede decir a que hora es la tutoria?\nGracias.', TILDE], ['Buenos días, Juan Luis:\nPerdone, me puede decir a qué hora es la tutoría?\nGracias.', APERT]),
  ps(2, 'Hola, Juan Luis:\nSe me ha olvidado el libro. ¿Puedo traerlo mañana?\nGracias.', ['Hola, Juan Luis:\nSe me ha olvidado el libro. Puedo traerlo mañana?\nGracias.', APERT], ['Hola, Juan Luis:\nSe me ha olvidado el libro. ¿puedo traerlo mañana?\nGracias.', MAYUS]),
  ps(2, 'Hola, Juan Luis:\nTengo una duda: ¿la tarea es para hoy?\nGracias.', ['Hola, Juan Luis:\nTengo una duda: la tarea es para hoy?\nGracias.', APERT], ['hola, Juan Luis:\nTengo una duda: ¿la tarea es para hoy?\nGracias.', MAYUS]),
  ps(2, 'Buenos días, Juan Luis:\nMi madre me ha dicho que le pregunte cuándo es la reunión.\nGracias.', ['Buenos días, Juan Luis:\nMi madre me ha dicho que le pregunte cuando es la reunion.\nGracias.', TILDE], ['buenos días, Juan Luis:\nMi madre me ha dicho que le pregunte cuándo es la reunión.\nGracias.', MAYUS]),
  ps(2, 'Hola, Juan Luis:\n¿Podría darme más ejercicios para practicar?\nMuchas gracias.', ['Hola, Juan Luis:\n¿Podria darme mas ejercicios para practicar?\nMuchas gracias.', TILDE], ['Hola, Juan Luis:\nPodría darme más ejercicios para practicar?\nMuchas gracias.', APERT]),
  ps(2, 'Hola, Juan Luis:\nEstoy enfermo y no podré hacer el examen. ¿Puedo repetirlo?\nGracias.', ['Hola, Juan Luis:\nEstoy enfermo y no podre hacer el examen. ¿Puedo repetirlo?\nGracias.', TILDE], ['Hola, Juan Luis:\nEstoy enfermo y no podré hacer el examen. Puedo repetirlo?\nGracias.', APERT]),
  ps(2, 'Buenas tardes, Juan Luis:\nNo encuentro la hoja de ejercicios. ¿Dónde está?\nGracias.', ['Buenas tardes, Juan Luis:\nNo encuentro la hoja de ejercicios. ¿Donde esta?\nGracias.', TILDE], ['Buenas tardes, juan luis:\nNo encuentro la hoja de ejercicios. ¿Dónde está?\nGracias.', NOMBRE]),
  ps(2, 'Hola, Juan Luis:\n¿Qué temas entran en el examen del viernes?\nGracias.', ['Hola, Juan Luis:\n¿Que temas entran en el examen del viernes?\nGracias.', TILDE], ['Hola, Juan Luis:\nQué temas entran en el examen del viernes?\nGracias.', APERT]),
  ps(2, 'Hola, Juan Luis:\nAyer falté a clase. ¿Qué hicimos?\nGracias.', ['Hola, Juan Luis:\nAyer falte a clase. ¿Que hicimos?\nGracias.', TILDE], ['Hola, Juan Luis:\nAyer falté a clase. ¿qué hicimos?\nGracias.', MAYUS]),
  ...CUERPOS.map((_, i) => correoNivel3(i)),
];

/** ¿Dónde va esto, en el asunto o en el cuerpo? Un título corto va en el asunto; lo que se cuenta o se pregunta, en el cuerpo. */
const ac = (texto, donde) => ({ nivel: 3, tipo: 'ac', texto, donde });

export const ASUNTO_CUERPO = [
  ac('Tarea de la semana 3', 'asunto'),
  ac('No puedo entregar la tarea porque estoy enfermo.', 'cuerpo'),
  ac('Duda del ejercicio 4', 'asunto'),
  ac('¿Puede decirme la nota del examen?', 'cuerpo'),
  ac('Examen del viernes', 'asunto'),
  ac('Tengo una duda con el segundo problema.', 'cuerpo'),
  ac('Justificante del lunes', 'asunto'),
  ac('Ayer no pude venir a clase porque tenía médico.', 'cuerpo'),
  ac('Nota del trabajo', 'asunto'),
  ac('Gracias por su ayuda; ya lo he entendido.', 'cuerpo'),
  ac('Hoja de problemas 2', 'asunto'),
  ac('Le adjunto la hoja resuelta.', 'cuerpo'),
  ac('Cambio de tutoría', 'asunto'),
  ac('Quería preguntarle cuándo es la recuperación.', 'cuerpo'),
  ac('Entrega de la tarea 5', 'asunto'),
  ac('No sé en qué página está el ejercicio.', 'cuerpo'),
];

/** Los dos ejercicios del correo, en un solo banco: los correos y los ítems asunto / cuerpo. */
export const BANCO_CORREOS = [...CORREOS, ...ASUNTO_CUERPO];

export const esAsuntoCuerpo = item => item.tipo === 'ac';

// --- Generadores ---------------------------------------------------------------------

/** Ejercicio 1: `{ i, nivel }` (nivel = el del alumno, el que se enseña en la etiqueta). */
export function generarMayusculas(rng, sesion, forzado = nivelForzado()) {
  const { item, actual } = elegirDeNivel(rng, MAYUSCULAS, sesion, { forzado });
  return { i: MAYUSCULAS.indexOf(item), nivel: actual };
}

/** Un generador para un banco de «¿cuál está bien escrita?»: `{ i, nivel, opciones }`. */
function generadorElegir(banco) {
  return (rng, sesion, forzado = nivelForzado()) => {
    const { item, actual } = elegirDeNivel(rng, banco, sesion, { forzado });
    const opciones = esAsuntoCuerpo(item)
      ? [{ k: 'asunto', texto: 'En el asunto' }, { k: 'cuerpo', texto: 'En el cuerpo' }]
      : barajarOpciones(rng, [item.bien, ...item.malas.map(m => m[0])]);
    return { i: banco.indexOf(item), nivel: actual, opciones };
  };
}
export const generarPuntoComa = generadorElegir(PUNTO_COMA);
export const generarDosPuntos = generadorElegir(DOS_PUNTOS);
export const generarCorreos = generadorElegir(BANCO_CORREOS);

// --- Explicaciones e idError de «¿cuál está bien escrita?» (k = 0 es la buena) --------

/** La buena y, si eligió una mala, qué le falla a esa; si acertó, qué le falla a las otras. */
export function explicacionElegir(item, k) {
  if (esAsuntoCuerpo(item)) {
    return item.donde === 'asunto'
      ? `«${esc(item.texto)}» es un título corto que dice de qué trata el correo: va en el <b>asunto</b>. Lo que se cuenta o se pregunta va en el cuerpo.`
      : `«${esc(item.texto)}» es lo que le cuentas o le preguntas al profesor: va en el <b>cuerpo</b>. El asunto es un título corto.`;
  }
  const bien = `Bien escrita: <b>${html(item.bien)}</b>`;
  const fallo = ([texto, id]) => `En <i>${html(texto)}</i> ${esc(MOTIVOS[id])}.`;
  if (Number(k) > 0) return `${bien}<br>${fallo(item.malas[k - 1])}`;
  return `${bien}<br>${item.malas.map(fallo).join(' ')}`;
}

/** El `idError` de la mala elegida (nada si acertó). */
export function idErrorElegir(item, k) {
  if (esAsuntoCuerpo(item)) return item.donde === 'asunto' ? 'cuerpo-por-asunto' : 'asunto-por-cuerpo';
  return Number(k) > 0 ? item.malas[k - 1][1] : null;
}
