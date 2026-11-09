// Ortografía: palabras que se confunden (tarea 138, 2026-11-06). Lógica: los tres bancos,
// cada ítem con `nivel: 1 | 2 | 3`, los generadores (con `elegirDeNivel` de
// ../_comun/nivel.js), las explicaciones ligadas al ítem y los `idError`. Todo puro
// (sin DOM): lo prueba tests/practicas-ortografia-palabras.test.js.
//
//   1. ¿Junto o separado?          banco JUNTAS (frase con hueco; botones junto / separado)
//   2. Suenan igual, se escriben…  banco HOMOFONOS, con los significados en SIGNIFICADOS
//   3. Números y símbolos          bancos NUMEROS y SIMBOLOS (hueco: la buena y una mala)
//
// Cada ítem tiene una sola respuesta defendible: cotejado el 2026-11-06 con el DLE y la
// 2.ª edición del Diccionario panhispánico de dudas. Lo que la RAE admite de dos maneras
// está en LISTA_NEGRA y no sale nunca como mala. Ojo, porque el DPD nuevo admite cosas
// que los libros dan por falta: «al rededor» (prefiere «alrededor») y «enmedio».
//
// Cuidado al añadir frases:
//   - Léela con todas las opciones puestas: solo una puede valer.
//   - El hueco nunca va al principio (los botones van en minúscula).
//   - Nada de porque / por qué / porqué / por que: son de la tarea 139 (ampliación).
//   - Ni «a ver» / «haber» ni «hay / ahí / ay»: son de ortografia-letras (136).
//   - «asimismo» / «a sí mismo», fuera: «también» encaja casi en cualquier frase.
//   - Homófonos solo si suenan igual en Murcia: nada de seseo (casa / caza).
//   - Números en letras del 31 al 99, nunca (treinta y uno y treintaiuno valen los dos);
//     apócopes, solo ante masculino; nunca el separador de millares.

import { elegirDeNivel } from '../_comun/nivel.js';
import { slug } from '../_comun/ortografia.js';

/**
 * Lo que nunca es distractor (docs/practicas-ortografia.md, §6, más lo que salió al cotejar):
 * parejas que la RAE admite las dos. Ninguna mala puede ser una de estas formas, y ningún ítem
 * puede enfrentar a las dos de una pareja.
 */
export const LISTA_NEGRA = [
  ['solo', 'sólo'], ['este', 'éste'], ['ese', 'ése'], ['aquel', 'aquél'], ['aun', 'aún'],
  ['guion', 'guión'], ['truhan', 'truhán'], ['hui', 'huí'], ['fie', 'fié'], ['rio', 'rió'],
  ['período', 'periodo'], ['vídeo', 'video'], ['cardíaco', 'cardiaco'], ['olimpíada', 'olimpiada'],
  ['fútbol', 'futbol'], ['chófer', 'chofer'], ['icono', 'ícono'], ['élite', 'elite'],
  ['kilómetro', 'quilómetro'], ['octógono', 'octágono'], ['cinc', 'zinc'], ['biznieto', 'bisnieto'],
  ['enseguida', 'en seguida'], ['deprisa', 'de prisa'], ['aprisa', 'a prisa'], ['enfrente', 'en frente'],
  ['asimismo', 'así mismo'], ['adonde', 'a donde'], ['entretanto', 'entre tanto'],
  ['bocabajo', 'boca abajo'], ['sobremanera', 'sobre manera'],
  // Del cotejo (DPD, 2.ª ed.): «al rededor» se admite; «enmedio» es «también válida».
  ['alrededor', 'al rededor'], ['en medio', 'enmedio'], ['enhorabuena', 'en hora buena'],
  ['tal vez', 'talvez'],
  ['treinta y uno', 'treintaiuno'], ['treinta y cinco', 'treintaicinco'], ['cuarenta y tres', 'cuarentaitrés'],
  ['undécimo', 'decimoprimero'], ['duodécimo', 'decimosegundo'],
  ['decimotercero', 'décimo tercero'], ['decimocuarto', 'décimo cuarto'], ['decimoquinto', 'décimo quinto'],
  ['decimosexto', 'décimo sexto'], ['decimoséptimo', 'décimo séptimo'], ['decimoctavo', 'décimo octavo'],
  ['decimonoveno', 'décimo noveno'], ['decimonoveno', 'decimonono'], ['onceavo', 'undécimo'], ['doceavo', 'duodécimo'],
  ['imprimido', 'impreso'], ['freído', 'frito'], ['posguerra', 'postguerra'], ['clubs', 'clubes'],
  ['l', 'L'], ['5 %', '5%'], ['5 €', '5€'], ['3 €', '3€'], ['7 €', '7€'], ['2 €', '2€'], ['1.º', '1º'], ['n.º', 'nº'], ['12 000', '12.000'],
  ['veintiún alumnas', 'veintiuna alumnas'], ['la primera vez', 'la primer vez'],
  ['casa', 'caza'], ['cocer', 'coser'], ['abrazar', 'abrasar'],
  ['hojear', 'ojear'],
];

/** Sin tildes ni espacios, en minúsculas: para comparar «a veces» con «aveces». */
export const plano = texto => String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '');

/** La frase partida por el hueco. */
export function partes(frase) {
  const [antes, despues] = frase.split('_');
  return { antes, despues };
}

/** La frase con el hueco relleno. */
export const rellenar = (frase, palabra) => frase.replace('_', palabra);

/** `idError` de una confusión: qué puso en vez de qué («si-no-por-sino»). */
export const idConfusion = (puso, buena) => `${slug(puso)}-por-${slug(buena)}`.replace(/^-+|-+$/g, '').slice(0, 40);

// --- Ejercicio 1: ¿junto o separado? ---------------------------------------------------------

/**
 * Malas de las palabras que, con este sentido, solo se escriben de una manera: la forma que
 * escriben los alumnos → la buena. Algunas coinciden por casualidad con una forma rara de un
 * verbo («aveces», de avezar; «osea», de osear; «asique», de asicar), así que la explicación
 * nunca dice «no existe»: dice cómo se escribe.
 */
export const INEXISTENTES = {};

const NUMERO_PALABRAS = ['', 'una sola palabra', 'dos palabras', 'tres palabras'];
const palabrasDe = texto => texto.trim().split(/\s+/).length;

/** Dos o tres formas que existen; la frase decide. `motivos[buena]` explica la de cada frase. */
const par = (nivel, opciones, motivos, frases) =>
  frases.map(([frase, buena]) => ({ nivel, frase, opciones, buena, motivo: motivos[buena] }));

/** Una palabra que se escribe siempre igual; `mala`, la forma que escriben mal. */
function siempre(nivel, buena, mala, frase) {
  INEXISTENTES[mala] = buena;
  const junta = !buena.includes(' ');
  const motivo = junta
    ? `<b>${buena}</b> se escribe siempre en una sola palabra; separado («${mala}») es una falta.`
    : `<b>${buena}</b> se escribe siempre en ${NUMERO_PALABRAS[palabrasDe(buena)]}; junto («${mala}») es una falta.`;
  return { nivel, frase, opciones: junta ? [buena, mala] : [mala, buena], buena, motivo };
}

export const JUNTAS = [
  // --- Nivel 1: lo que más falla en los textos de 1.º ESO -------------------------------
  ...par(1, ['sino', 'si no'], {
    sino: '<b>sino</b>, junto, contrapone dos ideas: «no es esto, <b>sino</b> aquello».',
    'si no': '<b>si no</b>, separado, es una condición: «<b>si no</b> pasa esto…» (en caso de que no pase).',
  }, [
    ['No quiero agua, _ zumo de naranja.', 'sino'],
    ['Lucía no es mi prima, _ mi vecina.', 'sino'],
    ['El examen no es el lunes, _ el martes.', 'sino'],
    ['No lo rompió Pablo, _ su hermano.', 'sino'],
    ['Date prisa; _, perderemos el autobús.', 'si no'],
    ['Llámame _ puedes venir a la fiesta.', 'si no'],
    ['Mañana iremos al parque _ llueve.', 'si no'],
  ]),
  ...par(1, ['también', 'tan bien'], {
    'también': '<b>también</b>, junto, quiere decir «además, igualmente».',
    'tan bien': '<b>tan bien</b>, separado, es «tan» + «bien», de una forma tan buena (lo contrario sería «tan mal»).',
  }, [
    ['Yo _ quiero ir a la excursión.', 'también'],
    ['¿Tú _ tienes hambre?', 'también'],
    ['A mi abuela _ le gusta el fútbol.', 'también'],
    ['Marcos _ ha traído su balón.', 'también'],
    ['Lo has explicado _ que todos lo han entendido.', 'tan bien'],
    ['Nunca había dormido _ como esta noche.', 'tan bien'],
    ['Mi primo dibuja _ que parece una foto.', 'tan bien'],
  ]),
  ...par(1, ['tampoco', 'tan poco'], {
    tampoco: '<b>tampoco</b>, junto, es lo contrario de «también» en una frase negativa: «yo <b>tampoco</b>».',
    'tan poco': '<b>tan poco</b>, separado, es «tan» + «poco» (lo contrario sería «tanto»).',
  }, [
    ['Yo _ he visto esa película.', 'tampoco'],
    ['Ayer no llovió y hoy _.', 'tampoco'],
    ['A mí _ me gustan las espinacas.', 'tampoco'],
    ['Si tú no vas, yo _.', 'tampoco'],
    ['Ha comido _ que ya tiene hambre otra vez.', 'tan poco'],
    ['Queda _ tiempo que no podemos jugar otro partido.', 'tan poco'],
    ['Duerme _ que siempre está cansado.', 'tan poco'],
  ]),
  siempre(1, 'a veces', 'aveces', 'Mi abuelo _ se queda dormido en el sofá.'),
  siempre(1, 'o sea', 'osea', 'Vuelvo dentro de dos días, _, el jueves.'),
  siempre(1, 'en serio', 'enserio', '¿Lo dices _ o es una broma?'),
  siempre(1, 'de repente', 'derepente', 'Estábamos en el patio y _ empezó a llover.'),
  siempre(1, 'por favor', 'porfavor', '¿Me pasas la sal, _?'),
  siempre(1, 'a lo mejor', 'alomejor', 'No veo a Lucía; _ ya se ha ido a casa.'),
  siempre(1, 'por fin', 'porfin', 'Hoy, _, empiezan las vacaciones.'),
  siempre(1, 'de acuerdo', 'deacuerdo', 'Estoy _ contigo: es una buena idea.'),
  siempre(1, 'a pesar de', 'apesar de', 'Salimos al patio _ la lluvia.'),
  siempre(1, 'así que', 'asique', 'Está lloviendo, _ cogeré el paraguas.'),
  siempre(1, 'adelante', 'a delante', 'Siéntate más _, que desde ahí no ves la pizarra.'),
  siempre(1, 'atrás', 'a trás', 'Mi mochila está en la fila de _.'),
  siempre(1, 'detrás', 'de trás', 'El perro se escondió _ del sofá.'),
  siempre(1, 'afuera', 'a fuera', 'Ya ha salido el sol: sal _ a jugar.'),
  siempre(1, 'adentro', 'a dentro', 'Hace mucho frío: pasa _ y cierra la puerta.'),
  siempre(1, 'conmigo', 'con migo', '¿Quieres venir al cine _ el sábado?'),
  siempre(1, 'contigo', 'con tigo', 'Mañana voy _ a la biblioteca.'),

  // --- Nivel 2: el resto de 1.º ESO ------------------------------------------------------
  ...par(2, ['aparte', 'a parte'], {
    aparte: '<b>aparte</b>, junto, quiere decir «a un lado, por separado» o, con «de», «además de».',
    'a parte': '<b>a parte</b>, separado, es «a» + el nombre «parte»: a una parte de algo.',
  }, [
    ['Pon los libros de Inglés _, que no se mezclen.', 'aparte'],
    ['Este verano, _ de ir a la playa, iremos al pueblo.', 'aparte'],
    ['Eso lo hablamos luego _, tú y yo.', 'aparte'],
    ['El sábado invité _ de mis amigos; al resto, el domingo.', 'a parte'],
  ]),
  ...par(2, ['demás', 'de más'], {
    'demás': '<b>demás</b>, junto, son «los otros, el resto»: <i>los demás</i>.',
    'de más': '<b>de más</b>, separado, es «de sobra, más de la cuenta» (lo contrario, «de menos»).',
  }, [
    // Nunca «los _» con el nombre sobrentendido: «deja los de más» (los que sobran) también vale.
    ['Hoy Marcos y los _ alumnos de la clase van de excursión.', 'demás'],
    ['Tú pon la mesa; de lo _ me encargo yo.', 'demás'],
    ['En la tienda me cobraron dos euros _.', 'de más'],
    ['Hay una silla _: sobra una.', 'de más'],
  ]),
  ...par(2, ['sobretodo', 'sobre todo'], {
    'sobre todo': '<b>sobre todo</b>, separado, quiere decir «especialmente».',
    sobretodo: '<b>sobretodo</b>, junto, es un abrigo que se pone encima de la ropa.',
  }, [
    ['Me gusta la fruta, _ las fresas.', 'sobre todo'],
    ['Estudia mucho, _ antes de los exámenes.', 'sobre todo'],
    ['Hacía frío y el abuelo se puso el _ encima de la chaqueta.', 'sobretodo'],
  ]),
  ...par(2, ['mediodía', 'medio día'], {
    'mediodía': '<b>mediodía</b>, junto, es la hora de en medio del día, hacia las doce o la hora de comer.',
    'medio día': '<b>medio día</b>, separado, es la mitad de un día.',
  }, [
    ['A _ el sol está en lo más alto.', 'mediodía'],
    ['Los domingos comemos a _ en casa de mis abuelos.', 'mediodía'],
    ['Tardamos _ en llegar: salimos por la mañana y llegamos por la tarde.', 'medio día'],
    ['Mi madre trabaja solo _: por las tardes está en casa.', 'medio día'],
  ]),
  ...par(2, ['entorno', 'en torno'], {
    entorno: '<b>entorno</b>, junto, es un nombre: lo que nos rodea, el ambiente.',
    'en torno': '<b>en torno</b>, separado, quiere decir «alrededor» o, con números, «más o menos».',
  }, [
    ['Nos sentamos _ a la hoguera.', 'en torno'],
    ['Llegaremos _ a las diez de la noche.', 'en torno'],
    ['Hay que cuidar el _ natural del río.', 'entorno'],
    ['El instituto tiene un _ muy tranquilo.', 'entorno'],
  ]),
  ...par(2, ['sinvergüenza', 'sin vergüenza'], {
    'sinvergüenza': '<b>sinvergüenza</b>, junto, es quien engaña o se porta mal sin que le importe.',
    'sin vergüenza': '<b>sin vergüenza</b>, separado, es «sin» + «vergüenza»: sin sentir vergüenza.',
  }, [
    ['El ladrón que robó la bici es un _.', 'sinvergüenza'],
    ['Pablo canta delante de todos _ ninguna.', 'sin vergüenza'],
    ['Lucía habló en la asamblea _, muy tranquila.', 'sin vergüenza'],
  ]),
  ...par(2, ['siquiera', 'si quiera'], {
    siquiera: '«ni <b>siquiera</b>» (ni tan solo) lleva «siquiera» en una sola palabra.',
  }, [
    ['Se fue y ni _ me dijo adiós.', 'siquiera'],
    ['No tengo ni _ un lápiz para el examen.', 'siquiera'],
  ]),
  ...par(2, ['acerca', 'a cerca'], {
    acerca: '<b>acerca de</b>, junto, quiere decir «sobre, de qué trata».',
    'a cerca': '<b>a cerca de</b> es «a» + «cerca de», que quiere decir «casi».',
  }, [
    ['Hicimos un mural _ de los volcanes.', 'acerca'],
    ['La profesora nos habló _ de la excursión.', 'acerca'],
    ['A la función de Navidad invitaron _ de cien familias.', 'a cerca'],
  ]),
  siempre(2, 'al menos', 'almenos', 'Necesito _ dos horas para terminar el trabajo.'),
  siempre(2, 'a menudo', 'amenudo', 'Voy _ a casa de mis abuelos.'),
  siempre(2, 'de pronto', 'depronto', 'Íbamos en bici y _ se pinchó una rueda.'),
  siempre(2, 'en fin', 'enfin', 'Hemos perdido el partido; _, otra vez será.'),
  siempre(2, 'a gusto', 'agusto', 'En casa de mi tía estoy muy _.'),
  siempre(2, 'a través', 'através', 'El gato entró _ de la ventana.'),
  siempre(2, 'sin embargo', 'sinembargo', 'Estudié mucho; _, el examen me salió mal.'),
  siempre(2, 'de verdad', 'deverdad', '¿Te ha gustado _ o lo dices por quedar bien?'),
  siempre(2, 'en vez', 'envez', 'Hoy he merendado fruta _ de galletas.'),
  siempre(2, 'a tiempo', 'atiempo', 'Corrimos y llegamos _ para coger el tren.'),

  // --- Nivel 3: más allá de 1.º ESO ------------------------------------------------------
  ...par(3, ['conque', 'con que', 'con qué'], {
    conque: '<b>conque</b>, junto, quiere decir «así que»: saca una consecuencia.',
    'con que': '<b>con que</b>, separado y sin tilde, es «con» + «que»: <i>basta con que…</i>, <i>me conformo con que…</i>',
    'con qué': '<b>con qué</b>, con tilde, pregunta: ¿con qué cosa?',
  }, [
    ['Ya has terminado los deberes, _ puedes salir a jugar.', 'conque'],
    ['Está lloviendo mucho, _ coge el paraguas.', 'conque'],
    ['Basta _ lo digas una vez.', 'con que'],
    ['Me conformo _ apruebes todas.', 'con que'],
    ['No sé _ pegar esta pieza rota.', 'con qué'],
  ]),
  ...par(3, ['sinfín', 'sin fin'], {
    'sinfín': '<b>sinfín</b>, junto, es un nombre: una cantidad enorme (<i>un sinfín de</i>).',
    'sin fin': '<b>sin fin</b>, separado, quiere decir «que no se acaba».',
  }, [
    ['Tengo un _ de deberes para el lunes.', 'sinfín'],
    ['Esta noche se ve un _ de estrellas.', 'sinfín'],
    ['La cinta _ de la caja del supermercado no para de girar.', 'sin fin'],
    ['Fue una espera _: parecía que no iba a acabar nunca.', 'sin fin'],
  ]),
  ...par(3, ['sinnúmero', 'sin número'], {
    'sinnúmero': '<b>sinnúmero</b>, junto, es un nombre: una cantidad enorme (<i>un sinnúmero de</i>).',
    'sin número': '<b>sin número</b>, separado, es «sin» + «número»; va detrás del nombre.',
  }, [
    ['Recibió un _ de felicitaciones por su cumpleaños.', 'sinnúmero'],
    ['El cartero no encontraba la casa: era la única _.', 'sin número'],
  ]),
  ...par(3, ['malentendido', 'mal entendido'], {
    malentendido: '<b>malentendido</b>, junto, es un nombre: una confusión al entender algo.',
    'mal entendido': '<b>mal entendido</b>, separado, es «mal» + «entendido»: que se ha entendido mal.',
  }, [
    ['Todo fue un _: nadie quería ofenderte.', 'malentendido'],
    ['Perdona, ha sido un _ por mi culpa.', 'malentendido'],
  ]),
  ...par(3, ['porvenir', 'por venir'], {
    porvenir: '<b>porvenir</b>, junto, es un nombre: el futuro.',
    'por venir': '<b>por venir</b>, separado, es «por» + «venir»: que todavía no ha llegado.',
  }, [
    ['Mis padres se preocupan por mi _.', 'porvenir'],
    ['Lo mejor de las vacaciones está aún _.', 'por venir'],
    ['Quedan dos invitados _ y empezamos a cenar.', 'por venir'],
  ]),
  ...par(3, ['abordo', 'a bordo'], {
    'a bordo': '<b>a bordo</b>, separado, quiere decir «dentro de un barco, un avión o un tren».',
    abordo: '<b>abordo</b>, junto, es del verbo abordar: yo <b>abordo</b> un problema, me pongo con él.',
  }, [
    ['Ya estamos todos _ del barco.', 'a bordo'],
    ['En el avión, la comida de _ estaba muy buena.', 'a bordo'],
    ['Cuando un problema es difícil, lo _ paso a paso.', 'abordo'],
  ]),
  ...par(3, ['quehacer', 'que hacer'], {
    quehacer: '<b>quehacer</b>, junto, es un nombre: una tarea, una ocupación.',
    'que hacer': '<b>que hacer</b>, separado, es «que» + el verbo «hacer»: <i>tengo que hacer</i>.',
  }, [
    ['Ayudar en casa es un _ de todos.', 'quehacer'],
    ['Mañana tengo _ un trabajo de Ciencias.', 'que hacer'],
    ['Hay _ la cama antes de ir al instituto.', 'que hacer'],
  ]),
  ...par(3, ['quehaceres', 'que haceres'], {
    quehaceres: '<b>quehaceres</b>, junto, es el plural del nombre «quehacer»: las tareas.',
  }, [
    ['Mis abuelos se reparten los _ de la casa.', 'quehaceres'],
  ]),
];

/** Generador del ejercicio 1: { i, nivel } (`nivel`, el del alumno, para la etiqueta). */
export function generarJuntas(rng, sesion, { forzado = null } = {}) {
  const { item, actual } = elegirDeNivel(rng, JUNTAS, sesion, { forzado });
  return { i: JUNTAS.indexOf(item), nivel: actual };
}

export const explicacionJuntas = item => item.motivo;
export const idErrorJuntas = (item, puso) => idConfusion(puso, item.buena);

// --- Ejercicio 2: suenan igual, se escriben distinto -----------------------------------------

/**
 * Qué es cada palabra, para la explicación: «“tuvo” es <significado>». Las dos de cada par
 * existen y significan cosas distintas; ninguna depende del seseo (en Murcia c/z y s suenan
 * distinto). Las de ll / y sí son homófonas aquí (yeísmo).
 */
export const SIGNIFICADOS = {
  hola: 'el saludo',
  ola: 'la onda grande que se forma en el mar',
  tubo: 'un cilindro hueco, como el de la pasta de dientes',
  tuvo: 'del verbo tener (él tuvo, ella tuvo)',
  hasta: 'la palabra que marca un límite: hasta mañana, hasta las cinco',
  asta: 'el palo de una bandera o el cuerno de un animal',
  vaya: 'del verbo ir (que yo vaya, que él vaya)',
  valla: 'una cerca o una barrera, como la del jardín',
  baya: 'un fruto pequeño y jugoso, como el arándano o la uva',
  hizo: 'del verbo hacer (él hizo, ella hizo)',
  izo: 'del verbo izar, subir una bandera o una vela (yo izo)',
  hierba: 'la planta verde de los prados y el césped',
  hierva: 'del verbo hervir (que el agua hierva)',
  haya: 'del verbo haber (que haya), y también un árbol',
  halla: 'del verbo hallar, encontrar (ella halla)',
  rallar: 'desmenuzar con un rallador, como el queso',
  rayar: 'hacer rayas o arañazos',
  callado: 'que no habla, del verbo callar',
  cayado: 'el bastón de los pastores',
  bello: 'hermoso, bonito',
  vello: 'el pelo fino que sale en el cuerpo',
  honda: 'profunda, o la tira con la que se lanzan piedras',
  onda: 'cada una de las ondulaciones del agua, o la forma en que viajan el sonido y la luz',
  huso: 'en «huso horario», cada franja de la Tierra con la misma hora',
  uso: 'la acción de usar algo',
  deshecho: 'del verbo deshacer, o muy cansado',
  desecho: 'lo que se tira, un residuo',
  bienes: 'las cosas que alguien tiene, lo que posee',
  vienes: 'del verbo venir (tú vienes)',
  sabia: 'que sabe mucho',
  savia: 'el líquido que circula por dentro de las plantas',
  grabar: 'registrar imagen o sonido, o marcar un dibujo o unas letras',
  gravar: 'poner un impuesto',
  rebelar: 'levantarse contra alguien (rebelarse)',
  revelar: 'contar un secreto',
  abría: 'del verbo abrir (ella abría)',
  habría: 'del verbo haber (habría venido)',
  cabo: 'un trozo de tierra que entra en el mar, o el final de algo (al cabo de)',
  cavo: 'del verbo cavar, hacer un hoyo (yo cavo)',
  errar: 'fallar o equivocarse',
  herrar: 'poner herraduras a un caballo',
  basto: 'tosco, áspero, poco fino',
  vasto: 'muy grande, muy extenso',
  bota: 'del verbo botar, dar botes (la pelota bota), o un calzado',
  vota: 'del verbo votar (ella vota)',
  bacilo: 'un tipo de bacteria con forma de bastón',
  vacilo: 'del verbo vacilar, dudar (yo vacilo)',
  baca: 'la parrilla de encima del coche para llevar equipaje',
  vaca: 'el animal que da leche',
};

/** Pares (o tríos) de homófonos: las palabras en el orden de los botones. */
export const PARES = {
  hola: ['hola', 'ola'], tubo: ['tubo', 'tuvo'], hasta: ['hasta', 'asta'], vaya: ['vaya', 'valla'],
  hizo: ['hizo', 'izo'], hierba: ['hierba', 'hierva'],
  haya: ['haya', 'halla'], rallar: ['rallar', 'rayar'], callado: ['callado', 'cayado'], bello: ['bello', 'vello'],
  baya: ['vaya', 'valla', 'baya'], honda: ['honda', 'onda'], huso: ['huso', 'uso'], deshecho: ['deshecho', 'desecho'],
  bienes: ['bienes', 'vienes'], sabia: ['sabia', 'savia'], grabar: ['grabar', 'gravar'], rebelar: ['rebelar', 'revelar'],
  habria: ['abría', 'habría'], cabo: ['cabo', 'cavo'], errar: ['errar', 'herrar'], basto: ['basto', 'vasto'],
  bota: ['bota', 'vota'], bacilo: ['bacilo', 'vacilo'], baca: ['baca', 'vaca'],
};

const hom = (nivel, par, frases) => frases.map(([frase, buena]) => ({ nivel, par, frase, buena }));

export const HOMOFONOS = [
  // --- Nivel 1 -------------------------------------------------------------------------
  ...hom(1, 'hola', [
    ['Al entrar en clase, Lucía nos dijo _ a todos.', 'hola'],
    ['Siempre que veo a mi vecino le digo _.', 'hola'],
    ['Una _ enorme nos mojó las toallas.', 'ola'],
    ['Mi primo hace surf y siempre coge la _ más alta.', 'ola'],
  ]),
  ...hom(1, 'tubo', [
    ['El fontanero cambió el _ del lavabo.', 'tubo'],
    ['Se ha acabado el _ de pasta de dientes.', 'tubo'],
    ['Mi tía _ gemelos el año pasado.', 'tuvo'],
    ['Ayer Marcos _ fiebre y no vino a clase.', 'tuvo'],
  ]),
  ...hom(1, 'hasta', [
    ['Te espero en la puerta _ las cinco.', 'hasta'],
    ['Mi hermano pequeño ya sabe contar _ cien.', 'hasta'],
    ['Hoy la bandera del ayuntamiento está a media _.', 'asta'],
    ['El ciervo tiene un _ rota.', 'asta'],
  ]),
  ...hom(1, 'vaya', [
    ['Ojalá mi amiga _ a la fiesta.', 'vaya'],
    ['Mi madre quiere que _ a por el pan.', 'vaya'],
    ['El balón saltó la _ del campo.', 'valla'],
    ['Han pintado de verde la _ del jardín.', 'valla'],
  ]),
  ...hom(1, 'hizo', [
    ['Mi padre _ una tortilla de patatas.', 'hizo'],
    ['El viernes Lucía _ un dibujo precioso.', 'hizo'],
    ['En el campamento, yo _ la bandera cada mañana.', 'izo'],
    ['Cuando salgo a navegar con mi tío, yo _ la vela.', 'izo'],
  ]),
  ...hom(1, 'hierba', [
    ['Las vacas comen _ en el prado.', 'hierba'],
    ['No pises la _ recién cortada.', 'hierba'],
    ['Echa la pasta cuando el agua _.', 'hierva'],
    ['Espera a que la leche _ y apaga el fuego.', 'hierva'],
  ]),
  // --- Nivel 2 -------------------------------------------------------------------------
  ...hom(2, 'haya', [
    ['Ojalá _ sol el sábado.', 'haya'],
    ['Quizá no _ clase el viernes.', 'haya'],
    ['Cuando pierde algo, mi abuela siempre lo _.', 'halla'],
    ['El tesoro se _ dentro de una cueva.', 'halla'],
  ]),
  ...hom(2, 'rallar', [
    ['Ayúdame a _ el queso para la pizza.', 'rallar'],
    ['Vamos a _ zanahoria para la ensalada.', 'rallar'],
    ['Cuidado con el compás, que vas a _ la mesa.', 'rayar'],
    ['No guardes las llaves con el móvil: lo pueden _.', 'rayar'],
  ]),
  ...hom(2, 'callado', [
    ['Hoy Marcos está muy _: no ha dicho nada.', 'callado'],
    ['Quédate _ mientras habla la profesora.', 'callado'],
    ['El pastor caminaba apoyado en su _.', 'cayado'],
  ]),
  ...hom(2, 'bello', [
    ['Desde el mirador se ve un paisaje muy _.', 'bello'],
    ['Mi abuelo tiene mucho _ en los brazos.', 'vello'],
    ['Al crecer, a los chicos les sale _ en la cara.', 'vello'],
  ]),
  ...hom(2, 'baya', [
    ['El arándano es una _ de color azul.', 'baya'],
    ['La uva también es una _.', 'baya'],
    ['El caballo saltó la _ sin tocarla.', 'valla'],
    ['Espero que no _ a llover durante la excursión.', 'vaya'],
  ]),
  ...hom(2, 'honda', [
    ['Esa parte de la piscina es muy _: cubre.', 'honda'],
    ['David lanzó la piedra con una _.', 'honda'],
    ['Al tirar una piedra al estanque se forma una _.', 'onda'],
    ['El sonido viaja por el aire como una _.', 'onda'],
  ]),
  ...hom(2, 'huso', [
    ['El _ del móvil está prohibido en clase.', 'uso'],
    ['Este cuaderno es de _ personal.', 'uso'],
    ['Canarias tiene una hora menos porque está en otro _ horario.', 'huso'],
  ]),
  ...hom(2, 'deshecho', [
    ['El nudo de la zapatilla se ha _ solo.', 'deshecho'],
    ['Volví del partido _: no podía ni andar.', 'deshecho'],
    ['El aceite usado es un _ que no se tira por el fregadero.', 'desecho'],
    ['Cada _ tiene que ir a su contenedor.', 'desecho'],
  ]),
  // --- Nivel 3 -------------------------------------------------------------------------
  ...hom(3, 'bienes', [
    ['Oye, ¿_ a mi casa esta tarde?', 'vienes'],
    ['Si _ pronto, jugamos un rato a la consola.', 'vienes'],
    ['Mis abuelos repartieron sus _ entre sus hijos.', 'bienes'],
  ]),
  ...hom(3, 'sabia', [
    ['La _ lleva el alimento por dentro de la planta.', 'savia'],
    ['Mi bisabuela ha leído muchísimo y es muy _.', 'sabia'],
    ['Lucía tomó una decisión muy _.', 'sabia'],
  ]),
  ...hom(3, 'grabar', [
    ['Vamos a _ una canción para el festival.', 'grabar'],
    ['El joyero va a _ mi nombre en la pulsera.', 'grabar'],
    ['Ese impuesto va a _ los billetes de avión.', 'gravar'],
  ]),
  ...hom(3, 'rebelar', [
    ['No te puedo _ el final de la película.', 'revelar'],
    ['Un buen mago nunca quiere _ sus trucos.', 'revelar'],
    ['Los esclavos se quisieron _ contra el emperador.', 'rebelar'],
  ]),
  ...hom(3, 'habria', [
    ['Con más tiempo, _ terminado el dibujo.', 'habría'],
    ['Yo que tú no _ dicho nada.', 'habría'],
    ['Cada mañana, mi abuelo _ la tienda a las nueve.', 'abría'],
    ['De pequeña, Lucía _ los regalos muy despacio.', 'abría'],
  ]),
  ...hom(3, 'cabo', [
    ['Al _ de un rato, dejó de llover.', 'cabo'],
    ['Fuimos de excursión al faro del _ de Palos.', 'cabo'],
    ['En la playa, yo _ un hoyo muy hondo.', 'cavo'],
  ]),
  ...hom(3, 'errar', [
    ['El herrero tiene que _ al caballo.', 'herrar'],
    ['Desde tan lejos es fácil _ el tiro.', 'errar'],
  ]),
  ...hom(3, 'basto', [
    ['Este jersey es muy _ y me pica.', 'basto'],
    ['Los romanos tuvieron un imperio muy _.', 'vasto'],
  ]),
  ...hom(3, 'bota', [
    ['Este balón no _ nada: está desinflado.', 'bota'],
    ['Mi hermana mayor _ por primera vez en las elecciones.', 'vota'],
    ['En la asamblea, cada alumno _ levantando la mano.', 'vota'],
  ]),
  ...hom(3, 'bacilo', [
    ['Un _ es una bacteria con forma de bastón.', 'bacilo'],
    ['Cuando tengo que elegir postre, siempre _.', 'vacilo'],
  ]),
  ...hom(3, 'baca', [
    ['Llevamos las bicis en la _ del coche.', 'baca'],
    ['La _ estaba pastando en el prado.', 'vaca'],
  ]),
];

/** Los botones de un ítem del ejercicio 2, en el orden de su par. */
export const opcionesHomofono = item => PARES[item.par];

export function generarHomofonos(rng, sesion, { forzado = null } = {}) {
  const { item, actual } = elegirDeNivel(rng, HOMOFONOS, sesion, { forzado });
  return { i: HOMOFONOS.indexOf(item), nivel: actual };
}

/** «Aquí va <b>tuvo</b>, del verbo tener. «Tubo» es un cilindro hueco…». */
export function explicacionHomofono(item) {
  const otras = opcionesHomofono(item).filter(p => p !== item.buena);
  return `Aquí va <b>${item.buena}</b>: ${SIGNIFICADOS[item.buena]}. ${otras.map(o => `«${o}» es ${SIGNIFICADOS[o]}`).join('; ')}.`;
}

export const idErrorHomofono = (item, puso) => idConfusion(puso, item.buena);

// --- Ejercicio 3: números y símbolos ---------------------------------------------------------

const sinTildes = texto => texto.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Símbolos mal escritos que no son ni un plural ni una mayúscula: la buena → sus malas. */
export const SIMBOLOS_MALOS = { m: ['mts'], h: ['hrs'], g: ['grs'], s: ['seg', 'sg'], 'km/h': ['km/hr'] };

/**
 * Cada error del ejercicio 3: la regla (para la explicación) y cómo sale la mala de la buena.
 * El test comprueba que cada mala del banco es su buena con el cambio de su error, y nada más.
 */
export const ERRORES = {
  'numeral-separado': {
    regla: 'del 16 al 29, los números se escriben en una sola palabra.',
    comprueba: (b, m) => /^(diez|veinte) y /.test(m) && sinTildes(m).replace(/^diez y /, 'dieci').replace(/^veinte y /, 'veinti') === sinTildes(b),
  },
  'centena-mal': {
    regla: 'las centenas se escriben en una sola palabra, y quinientos, setecientos y novecientos tienen forma propia.',
    comprueba: (b, m) => /ient[oa]s$/.test(b) && /ient[oa]s$/.test(m) && m !== b
      && (m.replace(' ', '') === b || { quinientos: 'cincocientos', setecientos: 'sietecientos', novecientas: 'nuevecientas', novecientos: 'nuevecientos' }[b] === m),
  },
  'cien-por-ciento': {
    regla: 'delante de otro número más pequeño (veinte, tres…) se escribe «ciento»: ciento veinte.',
    comprueba: (b, m) => b === 'ciento' && m === 'cien',
  },
  'ciento-por-cien': {
    regla: 'delante de un nombre o de «mil» y «millones» se escribe «cien» (cien euros, cien mil).',
    comprueba: (b, m) => b === 'cien' && m === 'ciento',
  },
  'mil-en-plural': {
    regla: '«mil» no cambia en plural (dos mil, tres mil); «miles» es un nombre: miles de personas.',
    comprueba: (b, m) => b === 'mil' && m === 'miles',
  },
  'y-tras-mil': {
    regla: 'la «y» solo va entre las decenas y las unidades (treinta y uno); detrás de «mil» no se pone.',
    comprueba: (b, m) => b.includes('mil ') && m === b.replace('mil ', 'mil y '),
  },
  'sin-apocope': {
    regla: 'delante de un nombre masculino se escribe la forma corta: primer, tercer, algún, ningún, veintiún.',
    comprueba: (b, m) => ['primer', 'tercer', 'algún', 'ningún', 'veintiún'].includes(b)
      && sinTildes(m) === `${sinTildes(b)}o`,
  },
  'cualquier-sin-apocope': {
    regla: 'delante de un nombre, masculino o femenino, se escribe «cualquier»: cualquier día, cualquier persona.',
    comprueba: (b, m) => b === 'cualquier' && m === 'cualquiera',
  },
  'millon-sin-plural': {
    regla: 'con dos o más, «millones», en plural.',
    comprueba: (b, m) => b === 'millones' && m === 'millón',
  },
  'millones-sin-de': {
    regla: 'detrás de «millones» va «de» cuando sigue un nombre: dos millones de visitas.',
    comprueba: (b, m) => b === 'millones de' && m === 'millones',
  },
  'porciento-junto': {
    regla: 'en los porcentajes, «por ciento» se escribe siempre en dos palabras.',
    comprueba: (b, m) => b === 'por ciento' && m === 'porciento',
  },
  'punto-en-ano': {
    regla: 'los años se escriben sin punto, aunque tengan cuatro cifras.',
    comprueba: (b, m) => /^\d{4}$/.test(b) && m === `${b[0]}.${b.slice(1)}`,
  },
  'simbolo-en-plural': {
    regla: 'los símbolos no tienen plural: 5 kg, 3 km, 30 min.',
    comprueba: (b, m) => m === `${b}s`,
  },
  'simbolo-en-mayuscula': {
    regla: 'los símbolos se escriben siempre igual, con sus minúsculas: kg, km, cm, min, km/h.',
    comprueba: (b, m) => m !== b && m.toLowerCase() === b,
  },
  'simbolo-con-punto': {
    regla: 'los símbolos no llevan punto detrás (solo el punto con que acaba la frase): no son abreviaturas.',
    comprueba: (b, m) => m === `${b}.`,
  },
  'simbolo-mal': {
    regla: 'ese no es el símbolo: metro es «m», hora «h», gramo «g», segundo «s» y kilómetro por hora «km/h».',
    comprueba: (b, m) => (SIMBOLOS_MALOS[b] ?? []).includes(m),
  },
  'simbolo-delante': {
    regla: 'en español, el símbolo va detrás del número, con un espacio.',
    comprueba: (b, m) => /^\d+ €$/.test(b) && m === `€${b.slice(0, -2)}`,
  },
  'tilde-en-compuesto': {
    regla: 'en una sola palabra, «décimo» pierde la tilde (separado sí la lleva: décimo tercero).',
    comprueba: (b, m) => /^decimo/.test(b) && m === b.replace(/^decimo/, 'décimo'),
  },
};

const num = (nivel, error, lista) => lista.map(([frase, buena, mala]) => ({ nivel, frase, buena, mala, error }));

export const NUMEROS = [
  // --- Nivel 1: los numerales en letras --------------------------------------------------
  ...num(1, 'numeral-separado', [
    ['Mi hermano mayor tiene _ años.', 'dieciséis', 'diez y seis'],
    ['En mi clase somos _ alumnos.', 'veinticinco', 'veinte y cinco'],
    ['Si el año no es bisiesto, febrero tiene _ días.', 'veintiocho', 'veinte y ocho'],
    ['El autobús tarda _ minutos en llegar.', 'diecisiete', 'diez y siete'],
    ['Mi prima cumple _ años en mayo.', 'dieciocho', 'diez y ocho'],
    ['El libro de aventuras tiene _ capítulos.', 'diecinueve', 'diez y nueve'],
    ['Hoy hemos corregido _ ejercicios.', 'veintidós', 'veinte y dos'],
    ['La excursión al museo costó _ euros.', 'veintitrés', 'veinte y tres'],
    ['Mi abuela vive en el número _ de esta calle.', 'veinticuatro', 'veinte y cuatro'],
    ['El equipo marcó _ puntos en la primera parte.', 'veintisiete', 'veinte y siete'],
    ['Faltan _ días para mi cumpleaños.', 'veintinueve', 'veinte y nueve'],
    ['Ya tengo _ cromos repetidos.', 'veintiséis', 'veinte y seis'],
  ]),
  ...num(1, 'centena-mal', [
    ['En el instituto hay _ alumnos.', 'quinientos', 'cincocientos'],
    ['El viaje en coche es de _ kilómetros.', 'setecientos', 'sietecientos'],
    ['En el concierto había _ personas.', 'novecientas', 'nuevecientas'],
    ['El libro tiene _ páginas.', 'trescientas', 'tres cientas'],
    ['El salón de actos tiene _ butacas.', 'doscientas', 'dos cientas'],
    ['Este año mi tío ha recorrido _ kilómetros en bici.', 'seiscientos', 'seis cientos'],
  ]),
  ...num(1, 'ciento-por-cien', [
    ['En mi hucha ya tengo _ euros.', 'cien', 'ciento'],
    ['En Educación Física corrimos los _ metros.', 'cien', 'ciento'],
    ['En ese estadio caben _ mil personas.', 'cien', 'ciento'],
  ]),
  ...num(1, 'cien-por-ciento', [
    ['El libro tiene _ veinte páginas.', 'ciento', 'cien'],
    ['En el pueblo de mi abuelo viven _ cincuenta personas.', 'ciento', 'cien'],
  ]),
  ...num(1, 'mil-en-plural', [
    ['El coche nuevo costó doce _ euros.', 'mil', 'miles'],
    ['En la carrera popular corrieron tres _ personas.', 'mil', 'miles'],
  ]),
  ...num(1, 'y-tras-mil', [
    ['Mi prima nació en el año _.', 'dos mil diez', 'dos mil y diez'],
    ['Mi hermano nació en el _.', 'dos mil quince', 'dos mil y quince'],
  ]),
  // --- Nivel 2: apócopes, millones, porcentajes y años -------------------------------------
  ...num(2, 'sin-apocope', [
    ['En el equipo de fútbol hay _ jugadores.', 'veintiún', 'veintiuno'],
    ['La media maratón tiene algo más de _ kilómetros.', 'veintiún', 'veintiuno'],
    ['Me gustaría ir a Japón _ día.', 'algún', 'alguno'],
    ['¿Tienes _ lápiz que me prestes?', 'algún', 'alguno'],
    ['No hay _ problema: te ayudo yo.', 'ningún', 'ninguno'],
    ['Hoy no he cometido _ error.', 'ningún', 'ninguno'],
    ['Hoy es el _ día de clase.', 'primer', 'primero'],
    ['Mi amiga ganó el _ premio del concurso.', 'primer', 'primero'],
    ['Vivimos en el _ piso.', 'tercer', 'tercero'],
    ['El _ capítulo es el más divertido.', 'tercer', 'tercero'],
  ]),
  ...num(2, 'cualquier-sin-apocope', [
    ['Puedes venir a casa _ día de la semana.', 'cualquier', 'cualquiera'],
  ]),
  ...num(2, 'millon-sin-plural', [
    ['En Madrid viven más de tres _ de personas.', 'millones', 'millón'],
    ['En el mundo viven más de ocho mil _ de personas.', 'millones', 'millón'],
  ]),
  ...num(2, 'millones-sin-de', [
    ['La canción del verano ya tiene dos _ visitas.', 'millones de', 'millones'],
  ]),
  ...num(2, 'porciento-junto', [
    ['Ha aprobado el noventa _ de la clase.', 'por ciento', 'porciento'],
    ['Las rebajas son del veinte _.', 'por ciento', 'porciento'],
    ['El cincuenta _ de algo es la mitad.', 'por ciento', 'porciento'],
  ]),
  ...num(2, 'punto-en-ano', [
    ['Colón llegó a América en _.', '1492', '1.492'],
    ['Los Juegos Olímpicos de Barcelona fueron en _.', '1992', '1.992'],
    ['El ser humano llegó a la Luna en _.', '1969', '1.969'],
    ['Mi madre nació en _.', '1985', '1.985'],
    ['Mi hermana pequeña nació en _.', '2019', '2.019'],
    ['La biblioteca del barrio se inauguró en _.', '2008', '2.008'],
  ]),
];

export const SIMBOLOS = [
  // --- Nivel 3: símbolos y ordinales -----------------------------------------------------
  ...num(3, 'simbolo-en-plural', [
    ['La sandía pesa 5 _ y cuesta cuatro euros.', 'kg', 'kgs'],
    ['De mi casa al instituto hay 2 _ andando.', 'km', 'kms'],
    ['Mi regla mide 30 _ de largo.', 'cm', 'cms'],
    ['El recreo dura 30 _ cada día.', 'min', 'mins'],
    ['El viaje en autobús dura 2 _ 15 min.', 'h', 'hs'],
  ]),
  ...num(3, 'simbolo-en-mayuscula', [
    ['Mi mochila pesa 6 _ con todos los libros.', 'kg', 'Kg'],
    ['El maratón tiene un poco más de 42 _ de recorrido.', 'km', 'Km'],
    ['Tardé 45 _ en hacer los deberes.', 'min', 'Min'],
    ['El tren rápido va a 300 _ por la vía nueva.', 'km/h', 'Km/h'],
    ['El lápiz nuevo mide 18 _ de largo.', 'cm', 'Cm'],
  ]),
  ...num(3, 'simbolo-con-punto', [
    ['Compramos 2 _ de naranjas en el mercado.', 'kg', 'kg.'],
    ['Corta una tira de papel de 10 _ de largo.', 'cm', 'cm.'],
    ['Hicimos una ruta de 8 _ por la sierra.', 'km', 'km.'],
  ]),
  ...num(3, 'simbolo-mal', [
    ['Una vuelta a la pista de atletismo son 400 _ exactos.', 'm', 'mts'],
    ['La piscina del barrio mide 25 _ de largo.', 'm', 'mts'],
    ['La excursión empieza a las 9 h y acaba a las 14 _.', 'h', 'hrs'],
    ['Para el bizcocho hacen falta 200 _ de harina.', 'g', 'grs'],
    ['El semáforo se queda en rojo 40 _ cada vez.', 's', 'seg'],
    ['Lucía corrió los 100 m en 16 _ en la prueba.', 's', 'sg'],
    ['En la ciudad, los coches no pueden pasar de 50 _.', 'km/h', 'km/hr'],
  ]),
  ...num(3, 'simbolo-delante', [
    ['El bocadillo de la cantina cuesta _ con la bebida.', '3 €', '€3'],
    ['La entrada del cine cuesta _ los miércoles.', '7 €', '€7'],
    ['Esta libreta cuesta _ en la papelería.', '2 €', '€2'],
  ]),
  ...num(3, 'tilde-en-compuesto', [
    ['Lucía quedó en el puesto _ de la carrera.', 'decimotercero', 'décimotercero'],
    ['Mi equipo terminó la liga en el puesto _.', 'decimoctavo', 'décimoctavo'],
    ['Vivimos en el piso _ de un edificio muy alto.', 'decimocuarto', 'décimocuarto'],
    ['Hoy celebramos el _ aniversario del instituto.', 'decimoquinto', 'décimoquinto'],
    ['El siglo XIX es el siglo _.', 'decimonoveno', 'décimonoveno'],
    ['El corredor de mi pueblo llegó en _ lugar.', 'decimoséptimo', 'décimoséptimo'],
    ['Mi hermano mayor celebró su _ cumpleaños en la playa.', 'decimosexto', 'décimosexto'],
  ]),
];

/** El banco del ejercicio 3: los números y, detrás, los símbolos (el índice va a esta lista). */
export const NUMEROS_Y_SIMBOLOS = [...NUMEROS, ...SIMBOLOS];

/** Ítem: { i, nivel, orden } (`orden`: 0 = la buena va primero; 1 = la mala). */
export function generarNumeros(rng, sesion, { forzado = null } = {}) {
  const { item, actual } = elegirDeNivel(rng, NUMEROS_Y_SIMBOLOS, sesion, { forzado });
  return { i: NUMEROS_Y_SIMBOLOS.indexOf(item), nivel: actual, orden: rng.azar() < 0.5 ? 0 : 1 };
}

export const opcionesNumero = (item, orden) => (orden === 0 ? [item.buena, item.mala] : [item.mala, item.buena]);

/** «<b>veinticinco</b>, no «veinte y cinco»: del 16 al 29, los números…». */
export const explicacionNumero = item => `<b>${item.buena}</b>, no «${item.mala}»: ${ERRORES[item.error].regla}`;

export const idErrorNumero = item => item.error;
