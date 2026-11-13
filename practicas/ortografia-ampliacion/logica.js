// Ortografía: ampliación (tarea 139, 2026-11-06). Lógica: los cuatro bancos, cada ítem con
// `nivel: 1 | 2 | 3`, los generadores (con `elegirDeNivel` de ../_comun/nivel.js), las
// explicaciones ligadas al ítem y los `idError`. Todo puro (sin DOM): lo prueba
// tests/practicas-ortografia-ampliacion.test.js. Es lo que va más allá de 1.º ESO; nunca es ★.
//
//   1. PORQUES   porque, por qué, porqué, por que (frase con hueco; los cuatro botones siempre)
//   2. VERBOS    formas verbales mal escritas (frase con hueco; la buena y la mala de ERRORES)
//   3. SIGLAS    siglas, abreviaturas y prefijos («¿cuál está bien escrita?»)
//   4. AVANZADA  puntuación avanzada («¿cuál está bien escrita?»)
//
// Cada ítem tiene una sola respuesta defendible: cotejado el 2026-11-06 con el Diccionario
// panhispánico de dudas, 2.ª edición (rae.es/dpd, desde Chrome). Lo que salió del cotejo:
//   - «porque» final (= para que) con subjuntivo admite también «por que» (DPD «porque», 1b y 3):
//     tras preocuparse, esforzarse, luchar, votar, rogar o abogar valen las dos. Por eso «por que»
//     solo sale tras verbos de elegir (optar, inclinarse, decidirse, decantarse, apostar) y tras
//     «caracterizarse» (DPD «porque», 2b: «se caracterizan por que…»). «Distinguirse» sale: también va sin
//     complemento («se distinguen porque…») y entonces cabe el «porque» causal.
//   - Las formas con -stes (dijistes) son voseo etimológico «con valoración negativa» (DPD
//     «voseo»): en el ejercicio 2 salen siempre con «tú» delante.
//   - «sin embargo» entre comas es una recomendación (DPD «sin embargo»): ninguna mala es la
//     coma de menos detrás del conector, ni la coma en lugar del punto y coma delante.
//   - El punto va detrás de las comillas de cierre aunque dentro haya ? o ! (DPD «comillas», 2d).
//
// Cuidado al añadir ítems:
//   - El hueco nunca va al principio (los botones van en minúscula).
//   - Ejercicio 1: léela con los cuatro botones. «por qué» indirecto solo si con «porque» no
//     tiene sentido («Me pregunto _»; no «Le pregunté _», que con «porque» también se entiende).
//   - Ejercicios 3 y 4: cada mala es la buena con un solo cambio de signos, espacios o
//     mayúsculas (o el de su idError: una r, la tilde, la terminación del plural).

import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';
import { barajarOpciones, slug } from '../_comun/ortografia.js';

const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * Lo que nunca es distractor (docs/practicas-ortografia.md, §6), y lo propio de este bloque:
 * parejas que la RAE admite las dos. Ninguna opción puede enfrentar a las dos de una pareja.
 */
export const LISTA_NEGRA = [
  ['solo', 'sólo'], ['este', 'éste'], ['ese', 'ése'], ['aquel', 'aquél'], ['aun', 'aún'],
  ['guion', 'guión'], ['truhan', 'truhán'], ['hui', 'huí'], ['fie', 'fié'], ['rio', 'rió'],
  ['período', 'periodo'], ['vídeo', 'video'], ['cardíaco', 'cardiaco'], ['olimpíada', 'olimpiada'],
  ['fútbol', 'futbol'], ['chófer', 'chofer'], ['icono', 'ícono'], ['élite', 'elite'],
  ['kilómetro', 'quilómetro'], ['octógono', 'octágono'], ['cinc', 'zinc'], ['biznieto', 'bisnieto'],
  ['enseguida', 'en seguida'], ['deprisa', 'de prisa'], ['enfrente', 'en frente'], ['asimismo', 'así mismo'],
  ['adonde', 'a donde'], ['entretanto', 'entre tanto'], ['bocabajo', 'boca abajo'],
  ['undécimo', 'decimoprimero'], ['duodécimo', 'decimosegundo'],
  ['imprimido', 'impreso'], ['freído', 'frito'], ['proveído', 'provisto'], ['iros', 'idos'],
  ['posguerra', 'postguerra'], ['posventa', 'postventa'], ['clubs', 'clubes'], ['OVNI', 'ovni'],
  ['wasap', 'WhatsApp'], ['güisqui', 'whisky'], ['1.º', '1º'], ['n.º', 'nº'], ['5 %', '5%'],
  // Del cotejo de este bloque (DPD, 2.ª ed.).
  ['porque', 'por que'], // con sentido final y subjuntivo valen las dos (DPD «porque», 3)
  ['currículos', 'currículums'], ['pósteres', 'pósters'], ['álbumes', 'álbums'],
  ['Sres.', 'Srs.'], ['a. m.', 'a.m.'], ['súper bien', 'superbién'],
];

/** Palabras que no pueden salir en ninguna opción (dobles formas válidas o dudosas). */
export const FUERA = ['iros', 'idos', 'freído', 'imprimido', 'proveído', 'callaros', 'sentaros', 'posguerra', 'postguerra',
  'posventa', 'postventa', 'clubs', 'clubes', 'ovni', 'OVNI', 'wasap', 'güisqui', 'pósters', 'pósteres', 'álbums', 'sólo',
  'currículos', 'superbién', 'contrarreloj', 'rompido'];

/** La frase partida por el hueco. */
export function partes(frase) {
  const [antes, despues] = frase.split('_');
  return { antes, despues };
}

/** La frase con el hueco relleno. */
export const rellenar = (frase, palabra) => frase.replace('_', palabra);

// --- 1. porque, por qué, porqué, por que ---------------------------------------------

/** Los cuatro botones, siempre en este orden. */
export const FORMAS = ['porque', 'por qué', 'porqué', 'por que'];

/** El identificador de cada forma en los idError (slug('por qué') y slug('por que') coincidirían). */
export const ID_FORMA = { porque: 'porque', 'por qué': 'por-que', porqué: 'porque-nombre', 'por que': 'por-que-prep' };

/** Lo que va delante de «porqué» (es un nombre: lleva determinante). */
export const DETERMINANTES = ['el', 'un', 'su', 'ese', 'este', 'cada', 'algún', 'ningún', 'otro', 'mi', 'tu'];

/** Verbos (y nombres) que piden una pregunta indirecta: detrás va «por qué» si su hueco está libre. */
export const MARCAS_INDIRECTA = ['pregunto', 'pregunta', 'preguntes', 'preguntó', 'sabe', 'sé', 'saber', 'averigua', 'dices',
  'decir', 'explicarme', 'explico', 'explicó'];

/** Lo que rige «por» y, con «que» detrás, se escribe «por que»: el texto de la explicación. */
export const RIGEN_POR = {
  optó: 'optar', optaron: 'optar', inclina: 'inclinarse', inclinan: 'inclinarse', decidimos: 'decidirse',
  decantó: 'decantarse', apuesta: 'apostar', apostamos: 'apostar', caracteriza: 'caracterizarse', caracterizan: 'caracterizarse',
};
/** De esos, los que admiten el indicativo detrás («se caracteriza por que tiene…»): los demás, subjuntivo. */
export const RIGEN_CON_INDICATIVO = ['caracteriza', 'caracterizan'];
/** Los subjuntivos que siguen a «por que» en el banco (lo comprueba el test). */
export const SUBJUNTIVOS = ['fuera', 'estudiara', 'juegue', 'hagamos', 'ganara', 'celebremos', 'haga'];

const pq = (nivel, frase, buena) => ({ nivel, frase, buena });

export const PORQUES = [
  // --- Nivel 1: porque dentro de una pregunta, por qué indirecto, y los más claros de porqué y por que.
  pq(1, '¿Has llegado tarde _ había atasco?', 'porque'),
  pq(1, '¿Te has enfadado _ no te llamé?', 'porque'),
  pq(1, 'Mi hermano estudia por la noche _ por la tarde entrena.', 'porque'),
  pq(1, 'No he traído el libro _ lo dejé en casa de mi abuela.', 'porque'),
  pq(1, 'Me resbalé en el patio _ el suelo estaba mojado.', 'porque'),
  pq(1, 'Oye, ¿_ llevas paraguas si hace sol?', 'por qué'),
  pq(1, 'Me pregunto _ Lucía no ha venido hoy a clase.', 'por qué'),
  pq(1, 'Mi hermano pequeño quiere saber _ la luna cambia de forma.', 'por qué'),
  pq(1, 'Nadie sabe _ el gato duerme siempre en mi mochila.', 'por qué'),
  pq(1, '¿Y vosotros _ habéis llegado tan tarde?', 'por qué'),
  pq(1, 'El profesor nos explicó el _ de la regla.', 'porqué'),
  pq(1, 'No entiendo el _ de tantos deberes.', 'porqué'),
  pq(1, 'Todo tiene su _.', 'porqué'),
  pq(1, 'Al final, la clase optó _ la excursión fuera al museo.', 'por que'),
  pq(1, 'Mis padres optaron _ estudiara en este instituto.', 'por que'),
  pq(1, 'El entrenador se inclina _ juegue Hugo de portero.', 'por que'),
  // --- Nivel 2: más porqué; por qué al final o sin ¿?; porque tras «es».
  pq(2, 'Si te lo cuento, es _ confío en ti.', 'porque'),
  pq(2, '¿Estás triste _ se ha mudado tu prima?', 'porque'),
  pq(2, 'Abrimos las ventanas _ hacía mucho calor en clase.', 'porque'),
  pq(2, '¿Te vas ya _ tienes entrenamiento?', 'porque'),
  pq(2, 'No sé _ ha faltado Hugo; quizá esté enfermo.', 'por qué'),
  pq(2, 'Averigua _ no funciona la impresora.', 'por qué'),
  pq(2, '¿Me dices _ te has enfadado conmigo?', 'por qué'),
  pq(2, 'Se fue de la fiesta sin decir _.', 'por qué'),
  pq(2, 'Me gustaría conocer el _ de tu decisión.', 'porqué'),
  pq(2, 'Nadie ha sabido explicarme el _ de este resultado.', 'porqué'),
  pq(2, 'Sin un _ claro, no pienso cambiarme de sitio.', 'porqué'),
  pq(2, 'Ese _ no me convence nada.', 'porqué'),
  pq(2, 'Cada norma del instituto tiene su _.', 'porqué'),
  pq(2, 'Al final, nos decidimos _ la fiesta fuera el sábado.', 'por que'),
  pq(2, 'La profesora apuesta _ hagamos el trabajo en grupo.', 'por que'),
  pq(2, 'El jurado se decantó _ ganara el dibujo de Marta.', 'por que'),
  // --- Nivel 3: más por que (también con indicativo); porque tras un verbo de preguntar ya completo.
  pq(3, 'Si suspendí, fue _ no estudié nada.', 'porque'),
  pq(3, 'Me lo preguntó _ no se acordaba de la fecha.', 'porque'),
  pq(3, 'Te lo explico otra vez _ no lo has entendido.', 'porque'),
  pq(3, 'Lo sé _ estaba delante cuando pasó.', 'porque'),
  pq(3, 'Vamos al cine esta tarde, ¿_ no?', 'por qué'),
  pq(3, 'Sin saber _, se echó a llorar.', 'por qué'),
  pq(3, 'Ya no viene con nosotros, pero no sé _.', 'por qué'),
  pq(3, 'No me preguntes _; simplemente me apetece.', 'por qué'),
  pq(3, 'Habrá algún _, digo yo.', 'porqué'),
  pq(3, 'No le encuentro el _ a este ejercicio.', 'porqué'),
  pq(3, 'Los científicos buscan el _ de los terremotos.', 'porqué'),
  pq(3, 'Un cuadrado se caracteriza _ tiene cuatro lados iguales y cuatro ángulos rectos.', 'por que'),
  pq(3, 'Los números primos se caracterizan _ solo tienen dos divisores.', 'por que'),
  pq(3, 'Mis abuelos se inclinan _ celebremos la Navidad en su casa.', 'por que'),
  pq(3, 'Al final, el equipo optó _ Elena fuera la capitana.', 'por que'),
  pq(3, 'Todos apostamos _ el concierto se haga en el patio.', 'por que'),
];

const palabrasDe = texto => texto.trim().split(/\s+/).filter(Boolean);
/** La última palabra antes del hueco, sin signos y en minúsculas. */
export const anterior = frase => (palabrasDe(partes(frase).antes).at(-1) ?? '').replace(/[¿¡,;:]/g, '').toLowerCase();

/** Ítem: { i, nivel }. Los cuatro botones son siempre FORMAS. */
export function generarPorques(rng, sesion, forzado = nivelForzado()) {
  const { item, actual } = elegirDeNivel(rng, PORQUES, sesion, { forzado });
  return { i: PORQUES.indexOf(item), nivel: actual };
}

/** Por qué va esa forma en esa frase, con la frase rellena delante. */
export function explicacionPorque(item) {
  const { antes, despues } = partes(item.frase);
  const frase = `<i>${esc(antes)}<b>${item.buena}</b>${esc(despues)}</i>`;
  const previa = anterior(item.frase);
  const regla = {
    porque: '<b>porque</b>, junto y sin tilde, da la causa: es la respuesta a «¿por qué?».',
    'por qué': antes.includes('¿') && !MARCAS_INDIRECTA.includes(previa)
      ? '<b>por qué</b>, separado y con tilde, pregunta por la causa: aquí, en una pregunta directa.'
      : '<b>por qué</b>, separado y con tilde, pregunta por la causa: aquí es una pregunta indirecta (depende de «' + previa + '»; no lleva sus propios signos ¿?). Se puede cambiar por «por qué motivo».',
    porqué: `<b>porqué</b>, junto y con tilde, es un nombre, «el motivo»: lleva delante «${previa}».`,
    'por que': `<b>por que</b>, separado y sin tilde, es la preposición «por» que pide «${RIGEN_POR[previa]}» («${RIGEN_POR[previa]} por algo») y la palabra «que».`,
  }[item.buena];
  return `${frase}<br>${regla}`;
}

/** «porque-por-por-que»: puso «porque» donde iba «por qué». */
export const idErrorPorque = (item, puso) => `${ID_FORMA[puso]}-por-${ID_FORMA[item.buena]}`;

// --- 2. Formas verbales mal escritas -------------------------------------------------

const STE = 'con «tú», el pretérito acaba en -ste, sin -s al final: tú dijiste, tú comiste (la -s va en los demás tiempos: tú dices, tú decías; en el pretérito, no).';
const PARTICIPIO = (verbo, buena) => `el participio de «${verbo}» es irregular: he ${buena}, nunca con -ido.`;
const DUCIR = 'los verbos en -ducir (conducir, traducir, producir) hacen el pretérito con j: conduje, tradujo, produjo.';
const JERON = 'detrás de j, el pretérito acaba en -jeron, sin i: dijeron, trajeron, tradujeron.';
const HABER = 'cuando «haber» dice que algo existe (hay, había, hubo, habrá), no tiene sujeto y va siempre en singular, aunque lo que sigue sea plural.';

/** Cada confusión: la buena, la mala habitual y la regla. La clave es la que citan los ítems de VERBOS. */
export const ERRORES = {
  dijiste: { buena: 'dijiste', mala: 'dijistes', regla: STE },
  hiciste: { buena: 'hiciste', mala: 'hicistes', regla: STE },
  fuiste: { buena: 'fuiste', mala: 'fuistes', regla: STE },
  estuviste: { buena: 'estuviste', mala: 'estuvistes', regla: STE },
  viniste: { buena: 'viniste', mala: 'vinistes', regla: STE },
  tuviste: { buena: 'tuviste', mala: 'tuvistes', regla: STE },
  llamaste: { buena: 'llamaste', mala: 'llamastes', regla: STE },
  comiste: { buena: 'comiste', mala: 'comistes', regla: STE },
  anduve: { buena: 'anduve', mala: 'andé', regla: '«andar» es irregular en el pretérito: anduve, anduviste, anduvo, como tuve y estuve.' },
  anduvo: { buena: 'anduvo', mala: 'andó', regla: '«andar» es irregular en el pretérito: anduve, anduviste, anduvo, como tuve y estuve.' },
  anduviste: { buena: 'anduviste', mala: 'andaste', regla: '«andar» es irregular en el pretérito: anduve, anduviste, anduvo, como tuve y estuve.' },
  haya: { buena: 'haya', mala: 'haiga', regla: 'el subjuntivo de «haber» es haya (que haya, ojalá haya); «haiga» es un vulgarismo.' },
  escrito: { buena: 'escrito', mala: 'escribido', regla: PARTICIPIO('escribir', 'escrito') },
  abierto: { buena: 'abierto', mala: 'abrido', regla: PARTICIPIO('abrir', 'abierto') },
  vuelto: { buena: 'vuelto', mala: 'volvido', regla: PARTICIPIO('volver', 'vuelto') },
  puesto: { buena: 'puesto', mala: 'ponido', regla: PARTICIPIO('poner', 'puesto') },
  resuelto: { buena: 'resuelto', mala: 'resolvido', regla: PARTICIPIO('resolver', 'resuelto') },
  devuelto: { buena: 'devuelto', mala: 'devolvido', regla: PARTICIPIO('devolver', 'devuelto') },
  cupo: { buena: 'cupo', mala: 'cabió', regla: '«caber» es irregular: quepo, cupe, cupo, cabré; nunca «cabo», «cabió» ni «caberé».' },
  quepo: { buena: 'quepo', mala: 'cabo', regla: '«caber» es irregular: quepo, cupe, cupo, cabré; nunca «cabo», «cabió» ni «caberé».' },
  cupiera: { buena: 'cupiera', mala: 'cabiera', regla: '«caber» es irregular: quepo, cupe, cupo, cupiera; nunca «cabió» ni «cabiera».' },
  conduje: { buena: 'conduje', mala: 'conducí', regla: DUCIR },
  condujo: { buena: 'condujo', mala: 'condució', regla: DUCIR },
  tradujo: { buena: 'tradujo', mala: 'tradució', regla: DUCIR },
  produjo: { buena: 'produjo', mala: 'produció', regla: DUCIR },
  dijeron: { buena: 'dijeron', mala: 'dijieron', regla: JERON },
  trajeron: { buena: 'trajeron', mala: 'trajieron', regla: JERON },
  tradujeron: { buena: 'tradujeron', mala: 'tradujieron', regla: JERON },
  aprieta: { buena: 'aprieta', mala: 'apreta', regla: '«apretar» cambia e por ie cuando el acento cae en la raíz: aprieto, aprietas, aprieta (pero apretamos).' },
  aprietas: { buena: 'aprietas', mala: 'apretas', regla: '«apretar» cambia e por ie cuando el acento cae en la raíz: aprieto, aprietas, aprieta (pero apretamos).' },
  friega: { buena: 'friega', mala: 'frega', regla: '«fregar» cambia e por ie cuando el acento cae en la raíz: friego, friegas, friega (pero fregamos).' },
  friego: { buena: 'friego', mala: 'frego', regla: '«fregar» cambia e por ie cuando el acento cae en la raíz: friego, friegas, friega (pero fregamos).' },
  suelda: { buena: 'suelda', mala: 'solda', regla: '«soldar» cambia o por ue cuando el acento cae en la raíz, como contar: sueldo, suelda (pero soldamos).' },
  se: { buena: 'sé', mala: 'sabo', regla: 'el presente de «saber» es irregular en la primera persona: yo sé (con tilde), tú sabes.' },
  anduviera: { buena: 'anduviera', mala: 'andara', regla: '«andar» es irregular también en el subjuntivo: anduviera, como tuviera y estuviera.' },
  hubo: { buena: 'hubo', mala: 'hubieron', regla: HABER },
  habia: { buena: 'había', mala: 'habían', regla: HABER },
  habra: { buena: 'habrá', mala: 'habrán', regla: HABER },
  'ha-habido': { buena: 'ha habido', mala: 'han habido', regla: HABER },
  'puede-haber': { buena: 'puede haber', mala: 'pueden haber', regla: `${HABER} También con «puede haber», «va a haber» o «suele haber».` },
  'va-a-haber': { buena: 'va a haber', mala: 'van a haber', regla: `${HABER} También con «puede haber», «va a haber» o «suele haber».` },
  'haya-imp': { buena: 'haya', mala: 'hayan', regla: HABER },
  prever: { buena: 'prever', mala: 'preveer', regla: '«prever» es «ver antes» y se conjuga como «ver»: prever, prevé, previó; nunca como «leer» (preveer, prevee).' },
  preve: { buena: 'prevé', mala: 'prevee', regla: '«prever» es «ver antes» y se conjuga como «ver»: prever, prevé, previó; nunca como «leer» (preveer, prevee).' },
  previo: { buena: 'previó', mala: 'preveyó', regla: '«prever» es «ver antes» y se conjuga como «ver»: prever, prevé, previó; nunca como «leer» (preveer, preveyó).' },
  satisfizo: { buena: 'satisfizo', mala: 'satisfació', regla: '«satisfacer» se conjuga como «hacer»: satisfizo como hizo, satisfaré como haré.' },
  satisfaras: { buena: 'satisfarás', mala: 'satisfacerás', regla: '«satisfacer» se conjuga como «hacer»: satisfizo como hizo, satisfarás como harás.' },
  deshizo: { buena: 'deshizo', mala: 'deshació', regla: '«deshacer» se conjuga como «hacer»: deshizo como hizo.' },
  cabran: { buena: 'cabrán', mala: 'caberán', regla: '«caber» es irregular también en el futuro: cabré, cabrás, cabrán.' },
  yendo: { buena: 'yendo', mala: 'llendo', regla: 'el gerundio de «ir» es yendo, con y: se escribe con y, como cayendo o leyendo.' },
  ve: { buena: 've', mala: 'vé', regla: 'el imperativo de «ir» con «tú» es ve: es de una sílaba y no lleva tilde (como «da» o «fue»).' },
};

const vb = (nivel, frase, error) => ({ nivel, frase, error, buena: ERRORES[error].buena, mala: ERRORES[error].mala });

export const VERBOS = [
  // --- Nivel 1: el pretérito con «tú», andar, haya y los participios irregulares de siempre.
  vb(1, '¿Tú me _ que el examen era hoy?', 'dijiste'),
  vb(1, 'Tú _ los deberes muy deprisa.', 'hiciste'),
  vb(1, '¿Tú _ ayer a la fiesta de Marta?', 'fuiste'),
  vb(1, 'Tú _ en el cumpleaños de Pablo, ¿verdad?', 'estuviste'),
  vb(1, '¿Tú _ al instituto en bici?', 'viniste'),
  vb(1, 'Tú _ mucha suerte en el sorteo.', 'tuviste'),
  vb(1, '¿Tú _ a la abuela por teléfono?', 'llamaste'),
  vb(1, 'Tú te _ el último trozo de tarta.', 'comiste'),
  vb(1, 'Ayer _ diez kilómetros con mi padre.', 'anduve'),
  vb(1, 'Mi abuelo _ por la playa toda la mañana.', 'anduvo'),
  vb(1, '¿Tú _ hasta el instituto con este frío?', 'anduviste'),
  vb(1, 'Ojalá _ tortilla para cenar.', 'haya'),
  vb(1, 'Espero que no _ examen el lunes.', 'haya'),
  vb(1, 'Cuando _ terminado, avísame.', 'haya'),
  vb(1, 'Ya he _ la redacción de Lengua.', 'escrito'),
  vb(1, '¿Quién ha _ la ventana?', 'abierto'),
  vb(1, 'Mi hermana todavía no ha _ del viaje.', 'vuelto'),
  vb(1, '¿Dónde has _ mis llaves?', 'puesto'),
  vb(1, 'Ya he _ el libro a la biblioteca.', 'devuelto'),
  // --- Nivel 2: caber, los verbos en -ducir, -jeron, los que cambian la vocal de la raíz.
  vb(2, 'La tarta no _ en la nevera.', 'cupo'),
  vb(2, 'Yo no _ en el asiento de atrás.', 'quepo'),
  vb(2, 'Si el balón _ en la mochila, me lo llevaría.', 'cupiera'),
  vb(2, 'El sábado _ un kart por primera vez.', 'conduje'),
  vb(2, 'Mi padre _ cinco horas sin parar.', 'condujo'),
  vb(2, 'Mi prima _ el cuento del inglés al español.', 'tradujo'),
  vb(2, 'Aquella tormenta _ muchos daños en el pueblo.', 'produjo'),
  vb(2, 'Mis padres me _ que llegarían tarde.', 'dijeron'),
  vb(2, 'Los vecinos _ comida para todos.', 'trajeron'),
  vb(2, 'Los alumnos _ la canción al inglés.', 'tradujeron'),
  vb(2, 'Este zapato me _ un poco.', 'aprieta'),
  vb(2, 'Si no _ bien el tapón, se sale el agua.', 'aprietas'),
  vb(2, 'Mi hermano _ los platos los domingos.', 'friega'),
  vb(2, 'Hoy yo _ el suelo de la cocina.', 'friego'),
  vb(2, 'Mi tío _ las piezas de la bici en su taller.', 'suelda'),
  vb(2, 'Todavía no me _ la lección de Ciencias.', 'se'),
  vb(2, 'Si _ más, estaría en forma.', 'anduviera'),
  vb(2, 'Ya hemos _ el problema de la pizarra.', 'resuelto'),
  // --- Nivel 3: haber impersonal, prever, satisfacer, deshacer, yendo, ve.
  vb(3, 'Ayer _ dos accidentes en la autovía.', 'hubo'),
  vb(3, 'En la excursión _ muchos mosquitos.', 'habia'),
  vb(3, 'En el concierto _ más de mil personas.', 'habia'),
  vb(3, 'Mañana _ exámenes de recuperación.', 'habra'),
  vb(3, 'Este año _ muchas quejas por el ruido.', 'ha-habido'),
  vb(3, 'Con esta lluvia, _ goteras en el gimnasio.', 'puede-haber'),
  vb(3, 'Esta tarde _ juegos en el patio.', 'va-a-haber'),
  vb(3, 'Ojalá _ más días de vacaciones.', 'haya-imp'),
  vb(3, 'Nadie podía _ lo que iba a pasar.', 'prever'),
  vb(3, 'El pronóstico _ lluvia para mañana.', 'preve'),
  vb(3, 'La profesora ya _ que habría dudas.', 'previo'),
  vb(3, 'El resultado no me _ nada.', 'satisfizo'),
  vb(3, 'Si apruebas, _ a tus padres.', 'satisfaras'),
  vb(3, 'Mi hermano _ la maleta en cinco minutos.', 'deshizo'),
  vb(3, 'En mi mochila no _ tantos libros.', 'cabran'),
  vb(3, 'Estábamos _ al parque cuando nos llamaste.', 'yendo'),
  vb(3, 'Por favor, _ a por pan antes de que cierren.', 've'),
];

/** Ítem: { i, nivel, orden } (`orden`: 0 = la buena va primero; 1 = la mala). */
export function generarVerbos(rng, sesion, forzado = nivelForzado()) {
  const { item, actual } = elegirDeNivel(rng, VERBOS, sesion, { forzado });
  return { i: VERBOS.indexOf(item), nivel: actual, orden: rng.azar() < 0.5 ? 0 : 1 };
}

export const opcionesVerbo = (item, orden) => (orden === 0 ? [item.buena, item.mala] : [item.mala, item.buena]);

/** «<b>dijiste</b>, no «dijistes»: con «tú», el pretérito…». */
export const explicacionVerbo = item => `<b>${item.buena}</b>, no «${item.mala}»: ${ERRORES[item.error].regla}`;

/** «dijistes-por-dijiste»: estable por confusión, no por frase. */
export const idErrorVerbo = item => `${slug(item.mala)}-por-${slug(item.buena)}`.slice(0, 40);

// --- 3 y 4. «¿Cuál está bien escrita?» ------------------------------------------------

/** Por qué está mal una mala, según su `idError`: la explicación dice «En <mala> <motivo>». */
export const MOTIVOS = {
  // 3. Siglas, abreviaturas y prefijos
  'puntos-en-sigla': 'sobran los puntos: las siglas se escriben sin puntos ni espacios (DNI, ONG, ESO)',
  'sigla-en-minuscula': 'la sigla va en mayúsculas: cada letra es la inicial de una palabra',
  'plural-en-sigla': 'la sigla no lleva -s (ni \'s) en plural: el plural lo dice el artículo (las ONG, los DVD)',
  'abreviatura-sin-punto': 'a la abreviatura le falta su punto: las abreviaturas acaban en punto',
  'abreviatura-sin-tilde': 'a la abreviatura le falta la tilde: la abreviatura conserva la de la palabra (página → pág.)',
  'etc-con-puntos-suspensivos': '«etc.» ya quiere decir «y lo demás»: nunca lleva puntos suspensivos detrás',
  'prefijo-separado': 'el prefijo va pegado a la palabra: no se separa con un espacio',
  'prefijo-con-guion': 'el prefijo va pegado a la palabra: no lleva guion delante de una palabra en minúscula',
  'guion-ante-varias-palabras': 'ante dos o más palabras el prefijo va separado y sin guion (ex primer ministro)',
  'espacio-ante-cifra': 'delante de una cifra o de una mayúscula, el prefijo va con guion y no con un espacio (sub-16, anti-OTAN)',
  'prefijo-pegado-a-dos-palabras': 'el prefijo va separado cuando afecta a dos o más palabras que forman una unidad (ex primer ministro)',
  'sin-guion-ante-cifra': 'delante de una cifra o de una mayúscula, el prefijo lleva guion (sub-21, anti-OTAN)',
  'r-simple-tras-prefijo': 'cuando el prefijo acaba en vocal y la palabra empieza por r, se escribe rr para que suene fuerte',
  'plural-curriculum': 'el plural de «currículum» es currículums (o currículos), no «currícula»',
  'plural-comic': 'falta el plural: cómic → cómics',
  'plural-album': 'falta el plural: álbum → álbumes',
  'plural-album-n': 'el plural de «álbum» es álbumes, con m como en el singular',
  // 4. Puntuación avanzada
  'guion-por-raya': 'el diálogo se escribe con raya (—), que es más larga que el guion (-)',
  'espacio-tras-raya': 'la raya con la que empieza el diálogo va pegada a la primera palabra, sin espacio',
  'falta-espacio-raya': 'la raya que abre o cierra el comentario del narrador va separada por un espacio de lo que queda fuera',
  'mayuscula-tras-raya': 'el comentario del narrador con «dijo», «preguntó»… empieza en minúscula, aunque vaya detrás de ? o !',
  'punto-antes-de-raya': 'delante del comentario del narrador con «dijo», «preguntó»… no va punto',
  'inciso-narrador-mal': 'si el personaje sigue hablando después del comentario del narrador, ese comentario se cierra con otra raya',
  'punto-dentro-parentesis': 'el punto de la frase va fuera del paréntesis, no dentro',
  'espacio-dentro-parentesis': 'el paréntesis va pegado a la primera y a la última palabra que encierra, sin espacios',
  'coma-por-punto-y-coma': 'cuando cada parte de la enumeración lleva su coma dentro, las partes se separan con punto y coma',
  'punto-y-coma-mal-puesto': 'el punto y coma separa una parte de otra, no el nombre de lo que le corresponde',
  'punto-dentro-comillas': 'el punto de la frase va fuera de las comillas, no dentro',
  'coma-dentro-comillas': 'la coma va fuera de las comillas, no dentro',
  'espacio-dentro-comillas': 'las comillas van pegadas a la primera y a la última palabra que encierran, sin espacios',
  'sin-punto-tras-comillas': 'falta el punto final: va detrás de las comillas de cierre aunque dentro haya ? o !',
  'punto-y-coma-por-dos-puntos': 'para anunciar lo que viene después («una cosa», «lo siguiente») se usan dos puntos, no punto y coma',
  'dos-puntos-mal-puestos': 'los dos puntos van justo detrás de lo que anuncian, no en medio',
  'punto-y-coma-tras-conector': 'el punto y coma va delante del conector («sin embargo», «no obstante», «por tanto»), no detrás',
  'sin-signo-antes-del-conector': 'son dos frases: delante del conector que las une tiene que ir un punto y coma (o un punto)',
};

/** Un ítem de «¿cuál está bien escrita?»: la buena y sus malas, cada una [texto, idError]. */
const el = (nivel, bien, ...malas) => ({ nivel, bien, malas });

export const SIGLAS = [
  // --- Nivel 1: siglas sin puntos, sin plural y en mayúsculas; abreviaturas con su punto; «etc.».
  el(1, 'Para el viaje hace falta el DNI.', ['Para el viaje hace falta el D.N.I.', 'puntos-en-sigla'], ['Para el viaje hace falta el dni.', 'sigla-en-minuscula']),
  el(1, 'Mi tía trabaja en una ONG de Murcia.', ['Mi tía trabaja en una O.N.G. de Murcia.', 'puntos-en-sigla'], ['Mi tía trabaja en una ong de Murcia.', 'sigla-en-minuscula']),
  el(1, 'Las ONG ayudan a mucha gente.', ['Las ONGs ayudan a mucha gente.', 'plural-en-sigla'], ['Las ONG\'s ayudan a mucha gente.', 'plural-en-sigla']),
  el(1, 'En casa tenemos muchos DVD antiguos.', ['En casa tenemos muchos DVDs antiguos.', 'plural-en-sigla'], ['En casa tenemos muchos DVD\'s antiguos.', 'plural-en-sigla']),
  el(1, 'Mi padre tiene varios CD de música.', ['Mi padre tiene varios CDs de música.', 'plural-en-sigla'], ['Mi padre tiene varios C.D. de música.', 'puntos-en-sigla']),
  el(1, 'Envíame los PDF de los apuntes.', ['Envíame los PDFs de los apuntes.', 'plural-en-sigla'], ['Envíame los PDF\'s de los apuntes.', 'plural-en-sigla']),
  el(1, 'Este verano renovamos los DNI de toda la familia.', ['Este verano renovamos los DNIs de toda la familia.', 'plural-en-sigla'], ['Este verano renovamos los D.N.I. de toda la familia.', 'puntos-en-sigla']),
  el(1, 'La ESO dura cuatro cursos.', ['La E.S.O. dura cuatro cursos.', 'puntos-en-sigla'], ['La eso dura cuatro cursos.', 'sigla-en-minuscula']),
  el(1, 'En Tecnología usamos mucho las TIC.', ['En Tecnología usamos mucho las TICs.', 'plural-en-sigla'], ['En Tecnología usamos mucho las T.I.C.', 'puntos-en-sigla']),
  el(1, 'Haced los ejercicios de la pág. 23.', ['Haced los ejercicios de la pág 23.', 'abreviatura-sin-punto'], ['Haced los ejercicios de la pag. 23.', 'abreviatura-sin-tilde']),
  el(1, 'Lee el resumen de la pág. 40.', ['Lee el resumen de la pag. 40.', 'abreviatura-sin-tilde'], ['Lee el resumen de la pág 40.', 'abreviatura-sin-punto']),
  el(1, 'La carta es para el Sr. Martínez.', ['La carta es para el Sr Martínez.', 'abreviatura-sin-punto']),
  el(1, 'La Sra. López es la nueva directora.', ['La Sra López es la nueva directora.', 'abreviatura-sin-punto']),
  el(1, 'Mi tía vive en la avda. de la Libertad.', ['Mi tía vive en la avda de la Libertad.', 'abreviatura-sin-punto']),
  el(1, 'Mi madre trabaja en el dpto. de ventas.', ['Mi madre trabaja en el dpto de ventas.', 'abreviatura-sin-punto']),
  el(1, 'En el armario hay balones, conos, petos, etc.', ['En el armario hay balones, conos, petos, etc...', 'etc-con-puntos-suspensivos'], ['En el armario hay balones, conos, petos, etc', 'abreviatura-sin-punto']),
  el(1, 'Trae lápices, gomas, tijeras, etc.', ['Trae lápices, gomas, tijeras, etc....', 'etc-con-puntos-suspensivos'], ['Trae lápices, gomas, tijeras, etc', 'abreviatura-sin-punto']),
  // --- Nivel 2: los prefijos, pegados a una palabra y separados de dos o más.
  el(2, 'Hoy viene a la charla una exalumna del instituto.', ['Hoy viene a la charla una ex alumna del instituto.', 'prefijo-separado'], ['Hoy viene a la charla una ex-alumna del instituto.', 'prefijo-con-guion']),
  el(2, 'Un exjugador de baloncesto vino a clase.', ['Un ex-jugador de baloncesto vino a clase.', 'prefijo-con-guion'], ['Un ex jugador de baloncesto vino a clase.', 'prefijo-separado']),
  el(2, 'Mi exprofesora de Inglés vive en Lorca.', ['Mi ex profesora de Inglés vive en Lorca.', 'prefijo-separado'], ['Mi ex-profesora de Inglés vive en Lorca.', 'prefijo-con-guion']),
  el(2, 'Instala un antivirus en el ordenador.', ['Instala un anti virus en el ordenador.', 'prefijo-separado'], ['Instala un anti-virus en el ordenador.', 'prefijo-con-guion']),
  el(2, 'La vicepresidenta del club entregó las medallas.', ['La vice-presidenta del club entregó las medallas.', 'prefijo-con-guion'], ['La vice presidenta del club entregó las medallas.', 'prefijo-separado']),
  el(2, 'Dibuja un semicírculo con el compás.', ['Dibuja un semi círculo con el compás.', 'prefijo-separado'], ['Dibuja un semi-círculo con el compás.', 'prefijo-con-guion']),
  el(2, 'Calienta la leche en el microondas.', ['Calienta la leche en el micro-ondas.', 'prefijo-con-guion'], ['Calienta la leche en el micro ondas.', 'prefijo-separado']),
  el(2, 'Mi primo es el subcampeón de ajedrez.', ['Mi primo es el sub campeón de ajedrez.', 'prefijo-separado'], ['Mi primo es el sub-campeón de ajedrez.', 'prefijo-con-guion']),
  el(2, 'Mi superhéroe favorito puede volar.', ['Mi super-héroe favorito puede volar.', 'prefijo-con-guion'], ['Mi super héroe favorito puede volar.', 'prefijo-separado']),
  el(2, 'Esta sartén es antiadherente.', ['Esta sartén es anti adherente.', 'prefijo-separado'], ['Esta sartén es anti-adherente.', 'prefijo-con-guion']),
  el(2, 'El equipo marcó en un contraataque.', ['El equipo marcó en un contra-ataque.', 'prefijo-con-guion'], ['El equipo marcó en un contra ataque.', 'prefijo-separado']),
  el(2, 'Fuimos de compras al hipermercado.', ['Fuimos de compras al hiper mercado.', 'prefijo-separado'], ['Fuimos de compras al hiper-mercado.', 'prefijo-con-guion']),
  el(2, 'Mañana empieza el torneo interescolar.', ['Mañana empieza el torneo inter-escolar.', 'prefijo-con-guion'], ['Mañana empieza el torneo inter escolar.', 'prefijo-separado']),
  el(2, 'Mi hermana tiene la autoestima por las nubes.', ['Mi hermana tiene la auto estima por las nubes.', 'prefijo-separado'], ['Mi hermana tiene la auto-estima por las nubes.', 'prefijo-con-guion']),
  el(2, 'Vino a la charla un ex primer ministro.', ['Vino a la charla un exprimer ministro.', 'prefijo-pegado-a-dos-palabras'], ['Vino a la charla un ex-primer ministro.', 'guion-ante-varias-palabras']),
  el(2, 'En la reunión había un ex alto cargo.', ['En la reunión había un exalto cargo.', 'prefijo-pegado-a-dos-palabras'], ['En la reunión había un ex-alto cargo.', 'guion-ante-varias-palabras']),
  el(2, 'Hicimos carteles pro derechos humanos.', ['Hicimos carteles proderechos humanos.', 'prefijo-pegado-a-dos-palabras'], ['Hicimos carteles pro-derechos humanos.', 'guion-ante-varias-palabras']),
  // --- Nivel 3: guion ante cifra o mayúscula, rr tras prefijo, plurales difíciles, prefijo y complemento.
  el(3, 'Mi primo juega en el equipo sub-16.', ['Mi primo juega en el equipo sub16.', 'sin-guion-ante-cifra'], ['Mi primo juega en el equipo sub 16.', 'espacio-ante-cifra']),
  el(3, 'La selección sub-21 ganó la final.', ['La selección sub 21 ganó la final.', 'espacio-ante-cifra'], ['La selección sub21 ganó la final.', 'sin-guion-ante-cifra']),
  el(3, 'El torneo es para la categoría sub-12.', ['El torneo es para la categoría sub12.', 'sin-guion-ante-cifra'], ['El torneo es para la categoría sub 12.', 'espacio-ante-cifra']),
  el(3, 'Mi hermana juega en la liga sub-18 de balonmano.', ['Mi hermana juega en la liga sub 18 de balonmano.', 'espacio-ante-cifra'], ['Mi hermana juega en la liga sub18 de balonmano.', 'sin-guion-ante-cifra']),
  el(3, 'En los años ochenta hubo marchas anti-OTAN.', ['En los años ochenta hubo marchas antiOTAN.', 'sin-guion-ante-cifra'], ['En los años ochenta hubo marchas anti OTAN.', 'espacio-ante-cifra']),
  el(3, 'Lucía se hizo un autorretrato en Plástica.', ['Lucía se hizo un autoretrato en Plástica.', 'r-simple-tras-prefijo'], ['Lucía se hizo un auto retrato en Plástica.', 'prefijo-separado']),
  el(3, 'El coche de mi tía tiene alarma antirrobo.', ['El coche de mi tía tiene alarma antirobo.', 'r-simple-tras-prefijo'], ['El coche de mi tía tiene alarma anti robo.', 'prefijo-separado']),
  el(3, 'Han puesto ventanas antirruido en la biblioteca.', ['Han puesto ventanas anti ruido en la biblioteca.', 'prefijo-separado'], ['Han puesto ventanas antiruido en la biblioteca.', 'r-simple-tras-prefijo']),
  el(3, 'Dibuja una semirrecta desde el punto A.', ['Dibuja una semirecta desde el punto A.', 'r-simple-tras-prefijo'], ['Dibuja una semi recta desde el punto A.', 'prefijo-separado']),
  el(3, 'El mando de la tele funciona con infrarrojos.', ['El mando de la tele funciona con infra rojos.', 'prefijo-separado'], ['El mando de la tele funciona con infrarojos.', 'r-simple-tras-prefijo']),
  el(3, 'Hoy visita el instituto el vicerrector de la universidad.', ['Hoy visita el instituto el vicerector de la universidad.', 'r-simple-tras-prefijo'], ['Hoy visita el instituto el vice rector de la universidad.', 'prefijo-separado']),
  el(3, 'Vino a vernos una exjugadora de la selección.', ['Vino a vernos una ex jugadora de la selección.', 'prefijo-separado'], ['Vino a vernos una ex-jugadora de la selección.', 'prefijo-con-guion']),
  el(3, 'Firmaron un manifiesto anti pena de muerte.', ['Firmaron un manifiesto antipena de muerte.', 'prefijo-pegado-a-dos-palabras'], ['Firmaron un manifiesto anti-pena de muerte.', 'guion-ante-varias-palabras']),
  el(3, 'Mi madre ha enviado tres currículums esta semana.', ['Mi madre ha enviado tres currícula esta semana.', 'plural-curriculum']),
  el(3, 'En mi casa hay muchos cómics de aventuras.', ['En mi casa hay muchos cómic de aventuras.', 'plural-comic']),
  el(3, 'Tengo dos álbumes de cromos.', ['Tengo dos álbunes de cromos.', 'plural-album-n'], ['Tengo dos álbum de cromos.', 'plural-album']),
];

export const AVANZADA = [
  // --- Nivel 1: la raya de diálogo y el punto fuera del paréntesis.
  el(1, '—¿Has terminado? —le preguntó su madre.', ['-¿Has terminado? -le preguntó su madre.', 'guion-por-raya'], ['— ¿Has terminado? —le preguntó su madre.', 'espacio-tras-raya']),
  el(1, '—Tengo frío —dijo Lucía.', ['— Tengo frío —dijo Lucía.', 'espacio-tras-raya'], ['-Tengo frío -dijo Lucía.', 'guion-por-raya']),
  el(1, '—Me voy a casa —anunció Pablo.', ['-Me voy a casa -anunció Pablo.', 'guion-por-raya'], ['—Me voy a casa—anunció Pablo.', 'falta-espacio-raya']),
  el(1, '—¡Qué susto! —gritó mi hermana.', ['—¡Qué susto! —Gritó mi hermana.', 'mayuscula-tras-raya'], ['-¡Qué susto! -gritó mi hermana.', 'guion-por-raya']),
  el(1, '—¿Quién falta? —preguntó la profesora.', ['— ¿Quién falta? —preguntó la profesora.', 'espacio-tras-raya'], ['—¿Quién falta? —Preguntó la profesora.', 'mayuscula-tras-raya']),
  el(1, '—Ya está la cena —dijo mi abuela.', ['—Ya está la cena. —dijo mi abuela.', 'punto-antes-de-raya'], ['-Ya está la cena -dijo mi abuela.', 'guion-por-raya']),
  el(1, '—Hoy no hay recreo —explicó el conserje.', ['—Hoy no hay recreo—explicó el conserje.', 'falta-espacio-raya'], ['-Hoy no hay recreo -explicó el conserje.', 'guion-por-raya']),
  el(1, '—Pásame la pelota —pidió Hugo.', ['—Pásame la pelota —Pidió Hugo.', 'mayuscula-tras-raya'], ['— Pásame la pelota —pidió Hugo.', 'espacio-tras-raya']),
  el(1, 'Nos vemos a las cinco (en el parque).', ['Nos vemos a las cinco (en el parque.)', 'punto-dentro-parentesis'], ['Nos vemos a las cinco ( en el parque ).', 'espacio-dentro-parentesis']),
  el(1, 'Mi abuela es de Cieza (Murcia).', ['Mi abuela es de Cieza ( Murcia ).', 'espacio-dentro-parentesis'], ['Mi abuela es de Cieza (Murcia.)', 'punto-dentro-parentesis']),
  el(1, 'El examen es el lunes (a primera hora).', ['El examen es el lunes (a primera hora.)', 'punto-dentro-parentesis'], ['El examen es el lunes ( a primera hora ).', 'espacio-dentro-parentesis']),
  el(1, 'Hemos ganado el partido (por fin).', ['Hemos ganado el partido (por fin.)', 'punto-dentro-parentesis'], ['Hemos ganado el partido ( por fin ).', 'espacio-dentro-parentesis']),
  el(1, 'Trae el compás (el de punta fina).', ['Trae el compás ( el de punta fina ).', 'espacio-dentro-parentesis'], ['Trae el compás (el de punta fina.)', 'punto-dentro-parentesis']),
  el(1, 'Mi gata se llama Luna (como la de mi prima).', ['Mi gata se llama Luna (como la de mi prima.)', 'punto-dentro-parentesis'], ['Mi gata se llama Luna ( como la de mi prima ).', 'espacio-dentro-parentesis']),
  el(1, 'Llegamos a casa a las diez (más o menos).', ['Llegamos a casa a las diez (más o menos.)', 'punto-dentro-parentesis'], ['Llegamos a casa a las diez ( más o menos ).', 'espacio-dentro-parentesis']),
  el(1, 'El concierto empieza a las ocho (si no llueve).', ['El concierto empieza a las ocho ( si no llueve ).', 'espacio-dentro-parentesis'], ['El concierto empieza a las ocho (si no llueve.)', 'punto-dentro-parentesis']),
  // --- Nivel 2: el punto y coma en enumeraciones con comas dentro, y el punto y la coma fuera de las comillas.
  el(2, 'Hugo lleva la comida; Marta, el agua; yo, la sombrilla.', ['Hugo lleva la comida, Marta, el agua, yo, la sombrilla.', 'coma-por-punto-y-coma'], ['Hugo lleva la comida, Marta; el agua, yo; la sombrilla.', 'punto-y-coma-mal-puesto']),
  el(2, 'El primer premio, para Lucía; el segundo, para Pablo.', ['El primer premio, para Lucía, el segundo, para Pablo.', 'coma-por-punto-y-coma'], ['El primer premio; para Lucía, el segundo; para Pablo.', 'punto-y-coma-mal-puesto']),
  el(2, 'Ana es de Lorca; Hugo, de Cieza; Marcos, de Totana.', ['Ana es de Lorca, Hugo, de Cieza, Marcos, de Totana.', 'coma-por-punto-y-coma'], ['Ana es de Lorca, Hugo; de Cieza, Marcos; de Totana.', 'punto-y-coma-mal-puesto']),
  el(2, 'Mi padre trabaja de mañana; mi madre, de tarde.', ['Mi padre trabaja de mañana, mi madre, de tarde.', 'coma-por-punto-y-coma'], ['Mi padre trabaja; de mañana, mi madre; de tarde.', 'punto-y-coma-mal-puesto']),
  el(2, 'Unos traen bocadillos; otros, refrescos; otros, fruta.', ['Unos traen bocadillos, otros, refrescos, otros, fruta.', 'coma-por-punto-y-coma'], ['Unos traen bocadillos, otros; refrescos, otros; fruta.', 'punto-y-coma-mal-puesto']),
  el(2, 'Marta es la delegada; Pablo, el subdelegado.', ['Marta es la delegada, Pablo, el subdelegado.', 'coma-por-punto-y-coma'], ['Marta es la delegada, Pablo; el subdelegado.', 'punto-y-coma-mal-puesto']),
  el(2, 'El lunes toca Lengua; el martes, Inglés; el jueves, Música.', ['El lunes toca Lengua, el martes, Inglés, el jueves, Música.', 'coma-por-punto-y-coma'], ['El lunes toca Lengua, el martes; Inglés, el jueves; Música.', 'punto-y-coma-mal-puesto']),
  el(2, 'Los de primero van al museo; los de segundo, al teatro.', ['Los de primero van al museo, los de segundo, al teatro.', 'coma-por-punto-y-coma'], ['Los de primero van al museo, los de segundo; al teatro.', 'punto-y-coma-mal-puesto']),
  el(2, 'La profesora dijo: «Traed el compás».', ['La profesora dijo: «Traed el compás.»', 'punto-dentro-comillas'], ['La profesora dijo: « Traed el compás ».', 'espacio-dentro-comillas']),
  el(2, 'Mi abuelo siempre dice: «Más vale tarde que nunca».', ['Mi abuelo siempre dice: « Más vale tarde que nunca ».', 'espacio-dentro-comillas'], ['Mi abuelo siempre dice: «Más vale tarde que nunca.»', 'punto-dentro-comillas']),
  el(2, 'En la puerta pone: «Prohibido el paso».', ['En la puerta pone: «Prohibido el paso.»', 'punto-dentro-comillas'], ['En la puerta pone: « Prohibido el paso ».', 'espacio-dentro-comillas']),
  el(2, 'El cartel decía: «Cerrado por vacaciones».', ['El cartel decía: «Cerrado por vacaciones.»', 'punto-dentro-comillas'], ['El cartel decía: « Cerrado por vacaciones ».', 'espacio-dentro-comillas']),
  el(2, '«Ya voy», contestó Marta desde su cuarto.', ['«Ya voy,» contestó Marta desde su cuarto.', 'coma-dentro-comillas'], ['« Ya voy », contestó Marta desde su cuarto.', 'espacio-dentro-comillas']),
  el(2, '«Hace frío», dijo mi hermano al salir.', ['« Hace frío », dijo mi hermano al salir.', 'espacio-dentro-comillas'], ['«Hace frío,» dijo mi hermano al salir.', 'coma-dentro-comillas']),
  el(2, '«No lo sé», respondió Hugo.', ['«No lo sé,» respondió Hugo.', 'coma-dentro-comillas'], ['« No lo sé », respondió Hugo.', 'espacio-dentro-comillas']),
  el(2, '«Vuelvo ahora», dijo el camarero.', ['«Vuelvo ahora,» dijo el camarero.', 'coma-dentro-comillas'], ['« Vuelvo ahora », dijo el camarero.', 'espacio-dentro-comillas']),
  // --- Nivel 3: el comentario del narrador en medio, los dos puntos que anuncian, el punto y coma
  //     delante de «sin embargo», y el punto tras las comillas aunque dentro haya ? o !.
  el(3, '—Mañana —dijo Hugo— vamos a la playa.', ['—Mañana —dijo Hugo vamos a la playa.', 'inciso-narrador-mal'], ['—Mañana —dijo Hugo—vamos a la playa.', 'falta-espacio-raya']),
  el(3, '—Lo principal —añadió la profesora— es leer bien.', ['—Lo principal —añadió la profesora—es leer bien.', 'falta-espacio-raya'], ['—Lo principal —añadió la profesora es leer bien.', 'inciso-narrador-mal']),
  el(3, '—Este año —contó mi abuelo— ha llovido poco.', ['—Este año —contó mi abuelo ha llovido poco.', 'inciso-narrador-mal'], ['—Este año —Contó mi abuelo— ha llovido poco.', 'mayuscula-tras-raya']),
  el(3, '—Ya voy —dijo Marta—. Espérame en la puerta.', ['—Ya voy —dijo Marta. Espérame en la puerta.', 'inciso-narrador-mal'], ['—Ya voy. —dijo Marta—. Espérame en la puerta.', 'punto-antes-de-raya']),
  el(3, '—No tengo hambre —dijo Lucía—. Cenaré luego.', ['—No tengo hambre. —dijo Lucía—. Cenaré luego.', 'punto-antes-de-raya'], ['—No tengo hambre —dijo Lucía. Cenaré luego.', 'inciso-narrador-mal']),
  el(3, '—¡Qué frío! —exclamó Hugo—. Cierra la ventana.', ['—¡Qué frío! —Exclamó Hugo—. Cierra la ventana.', 'mayuscula-tras-raya'], ['—¡Qué frío! —exclamó Hugo. Cierra la ventana.', 'inciso-narrador-mal']),
  el(3, 'Solo quiero una cosa: que aprobéis todos.', ['Solo quiero una cosa; que aprobéis todos.', 'punto-y-coma-por-dos-puntos'], ['Solo quiero: una cosa que aprobéis todos.', 'dos-puntos-mal-puestos']),
  el(3, 'Te voy a decir la verdad: no he estudiado.', ['Te voy a decir: la verdad no he estudiado.', 'dos-puntos-mal-puestos']),
  el(3, 'Solo te hago una pregunta: ¿vienes o no?', ['Solo te hago: una pregunta ¿vienes o no?', 'dos-puntos-mal-puestos']),
  el(3, 'Pasó lo que temíamos: se suspendió la excursión.', ['Pasó: lo que temíamos se suspendió la excursión.', 'dos-puntos-mal-puestos']),
  el(3, 'Repasé toda la tarde; sin embargo, el examen me salió mal.', ['Repasé toda la tarde, sin embargo; el examen me salió mal.', 'punto-y-coma-tras-conector'], ['Repasé toda la tarde sin embargo, el examen me salió mal.', 'sin-signo-antes-del-conector']),
  el(3, 'Llovía a cántaros; no obstante, salimos al patio.', ['Llovía a cántaros no obstante, salimos al patio.', 'sin-signo-antes-del-conector'], ['Llovía a cántaros, no obstante; salimos al patio.', 'punto-y-coma-tras-conector']),
  el(3, 'No me gusta el brócoli; por tanto, no lo pido.', ['No me gusta el brócoli, por tanto; no lo pido.', 'punto-y-coma-tras-conector'], ['No me gusta el brócoli por tanto, no lo pido.', 'sin-signo-antes-del-conector']),
  el(3, 'El partido estaba perdido; sin embargo, remontamos.', ['El partido estaba perdido sin embargo, remontamos.', 'sin-signo-antes-del-conector'], ['El partido estaba perdido, sin embargo; remontamos.', 'punto-y-coma-tras-conector']),
  el(3, 'Mi madre me preguntó: «¿Has cenado?».', ['Mi madre me preguntó: «¿Has cenado?»', 'sin-punto-tras-comillas'], ['Mi madre me preguntó: «¿Has cenado?.»', 'punto-dentro-comillas']),
  el(3, 'El árbitro gritó: «¡Fuera de juego!».', ['El árbitro gritó: «¡Fuera de juego!.»', 'punto-dentro-comillas'], ['El árbitro gritó: «¡Fuera de juego!»', 'sin-punto-tras-comillas']),
  el(3, 'Le pregunté a Hugo: «¿Vienes al cine?».', ['Le pregunté a Hugo: «¿Vienes al cine?»', 'sin-punto-tras-comillas'], ['Le pregunté a Hugo: « ¿Vienes al cine? ».', 'espacio-dentro-comillas']),
];

/** Un generador para un banco de «¿cuál está bien escrita?»: `{ i, nivel, opciones }` (k = 0 es la buena). */
function generadorElegir(banco) {
  return (rng, sesion, forzado = nivelForzado()) => {
    const { item, actual } = elegirDeNivel(rng, banco, sesion, { forzado });
    return { i: banco.indexOf(item), nivel: actual, opciones: barajarOpciones(rng, [item.bien, ...item.malas.map(m => m[0])]) };
  };
}
export const generarSiglas = generadorElegir(SIGLAS);
export const generarAvanzada = generadorElegir(AVANZADA);

/** La buena y, si eligió una mala, qué le falla a esa; si acertó, qué le falla a las otras. */
export function explicacionElegir(item, k) {
  const bien = `Bien escrita: <b>${esc(item.bien)}</b>`;
  const fallo = ([texto, id]) => `En <i>${esc(texto)}</i> ${esc(MOTIVOS[id])}.`;
  if (Number(k) > 0) return `${bien}<br>${fallo(item.malas[k - 1])}`;
  return `${bien}<br>${item.malas.map(fallo).join(' ')}`;
}

/** El `idError` de la mala elegida (nada si acertó). */
export const idErrorElegir = (item, k) => (Number(k) > 0 ? item.malas[k - 1][1] : null);

// --- «No lo sé»: la explicación de cada ejercicio (regla delante, solución al final) ---

// El consejo nombra los cuatro casos: sin el cuarto («por» que pide el verbo), en los ítems de «por que» llevaba a otra.
export const ayudaPorque = item => `<p>Mira la palabra de antes y qué hace la frase: ¿pregunta, da una causa, nombra un motivo o lleva un «por» que pide el verbo (optar por)?</p>
  <p>${explicacionPorque(item)}</p><p>La respuesta es <b>${item.buena}</b>.</p>`;

/**
 * La frase entre comillas, sin su punto final: el punto va detrás de las comillas de cierre y no se duplica
 * («… muy deprisa». y no «… muy deprisa.».), como enseña el ejercicio 4. Los signos ? y ! se quedan dentro.
 */
export const fraseCitada = frase => frase.replace(/\.$/, '');

export const ayudaVerbo = item => `<p>Una de las dos formas es una falta típica de los verbos. Comprueba cuál con la regla.</p>
  <p>${explicacionVerbo(item)}</p><p>Con la forma puesta: «${esc(fraseCitada(rellenar(item.frase, item.buena)))}». La respuesta es <b>${item.buena}</b>.</p>`;

/**
 * Ejercicios 3 y 4, para la tarjeta de «No lo sé»: la regla que cumple la buena, dicha en positivo, por cada
 * `idError` de sus malas. Las confusiones que salen juntas en un ítem y dicen lo mismo (prefijo separado / con
 * guion, sin guion / con espacio ante cifra…) llevan el mismo texto, y la tarjeta no lo repite.
 */
export const REGLA_ELEGIR = {
  // 3. Siglas, abreviaturas y prefijos
  'puntos-en-sigla': 'Las siglas se escriben sin puntos ni espacios: DNI, ONG, ESO.',
  'sigla-en-minuscula': 'Estas siglas van en mayúsculas: cada letra es la inicial de una palabra.',
  'plural-en-sigla': 'Las siglas no llevan -s (ni \'s) en plural: el plural lo dice el artículo (las ONG, los DVD).',
  'abreviatura-sin-punto': 'Las abreviaturas acaban en punto: pág., Sr., etc.',
  'abreviatura-sin-tilde': 'La abreviatura conserva la tilde de la palabra: página → pág.',
  'etc-con-puntos-suspensivos': 'Detrás de «etc.» no van puntos suspensivos: ya quiere decir «y lo demás».',
  'prefijo-separado': 'Delante de una sola palabra en minúscula, el prefijo va pegado: sin espacio y sin guion.',
  'prefijo-con-guion': 'Delante de una sola palabra en minúscula, el prefijo va pegado: sin espacio y sin guion.',
  'guion-ante-varias-palabras': 'Si el prefijo afecta a dos o más palabras que forman una unidad, va separado y sin guion: ex primer ministro.',
  'prefijo-pegado-a-dos-palabras': 'Si el prefijo afecta a dos o más palabras que forman una unidad, va separado y sin guion: ex primer ministro.',
  'espacio-ante-cifra': 'Delante de una cifra o de una mayúscula, el prefijo lleva guion: sub-16, anti-OTAN.',
  'sin-guion-ante-cifra': 'Delante de una cifra o de una mayúscula, el prefijo lleva guion: sub-16, anti-OTAN.',
  'r-simple-tras-prefijo': 'Si el prefijo acaba en vocal y la palabra empieza por r, se escribe rr para que suene fuerte: antirrobo.',
  'plural-curriculum': 'El plural de «currículum» es «currículums» (o «currículos»).',
  'plural-comic': 'El plural de «cómic» es «cómics».',
  'plural-album': 'El plural de «álbum» es «álbumes», con m como en el singular.',
  'plural-album-n': 'El plural de «álbum» es «álbumes», con m como en el singular.',
  // 4. Puntuación avanzada
  'guion-por-raya': 'El diálogo se escribe con raya (—), que es más larga que el guion (-).',
  'espacio-tras-raya': 'La raya con la que empieza a hablar el personaje va pegada a la primera palabra.',
  'falta-espacio-raya': 'La raya que abre o cierra el comentario del narrador va separada por un espacio de lo que queda fuera.',
  'mayuscula-tras-raya': 'El comentario del narrador con «dijo», «preguntó»… empieza en minúscula, aunque vaya detrás de un signo de interrogación o de exclamación.',
  'punto-antes-de-raya': 'Delante del comentario del narrador con «dijo», «preguntó»… no va punto.',
  'inciso-narrador-mal': 'Si el personaje sigue hablando después del comentario del narrador, ese comentario se cierra con otra raya.',
  'punto-dentro-parentesis': 'El punto de la frase va detrás del paréntesis de cierre, no dentro.',
  'espacio-dentro-parentesis': 'El paréntesis va pegado a la primera y a la última palabra que encierra.',
  'coma-por-punto-y-coma': 'Cuando cada parte lleva su coma dentro, las partes se separan con punto y coma.',
  'punto-y-coma-mal-puesto': 'El punto y coma separa una parte de otra; la coma, dentro de cada parte, separa el nombre de lo que le corresponde.',
  'punto-dentro-comillas': 'El punto final va detrás de las comillas de cierre, no dentro, y se pone aunque dentro haya un signo de interrogación o de exclamación.',
  'sin-punto-tras-comillas': 'El punto final va detrás de las comillas de cierre, no dentro, y se pone aunque dentro haya un signo de interrogación o de exclamación.',
  'coma-dentro-comillas': 'La coma va detrás de las comillas de cierre, no dentro.',
  'espacio-dentro-comillas': 'Las comillas van pegadas a la primera y a la última palabra que encierran.',
  'punto-y-coma-por-dos-puntos': 'Para anunciar lo que viene después («una cosa», «lo siguiente») se usan dos puntos.',
  'dos-puntos-mal-puestos': 'Los dos puntos van justo detrás de lo que anuncian, no en medio.',
  'punto-y-coma-tras-conector': 'Cuando «sin embargo», «no obstante» o «por tanto» unen dos frases, delante va punto y coma (o punto) y detrás, coma.',
  'sin-signo-antes-del-conector': 'Cuando «sin embargo», «no obstante» o «por tanto» unen dos frases, delante va punto y coma (o punto) y detrás, coma.',
};

/** Las reglas de un ítem de los ejercicios 3 y 4, sin repetir (dos malas con la misma confusión dan una sola). */
export const reglasElegir = item => [...new Set(item.malas.map(([, id]) => REGLA_ELEGIR[id]))];

// Ejercicios 3 y 4: la buena y por qué (docs/no-lo-se.md, «Elegir»). No se copian las malas enteras, como hace
// `explicacionElegir`: alargaban la tarjeta, repetían el motivo cuando dos malas fallan en lo mismo y dejaban
// «En <i>… el D.N.I.</i> sobran…», con el punto de la frase mala en medio.
export const ayudaElegir = item => `<p>Compara las opciones y busca qué cambia de una a otra: solo una respeta la norma.</p>
  <p>${reglasElegir(item).map(esc).join(' ')}</p>
  <p>La respuesta es <b>${esc(item.bien)}</b></p>`;
