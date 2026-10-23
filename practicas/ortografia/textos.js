// Ortografía española: textos propios. La práctica va siempre en español
// (`idioma: 'es'` en `arrancar`); solo `nombre` y `detalle` llevan también
// inglés, porque los usan la portada y la página de la tarea.
//
// Las explicaciones usan la frase de ese ítem: el truco de «había» se prueba
// con ella, no con un ejemplo genérico.

import { PAREJAS, partes, rellenar } from './logica.js';

const mismo = texto => ({ es: texto, en: texto });

export const TX = {
  a_ha: {
    nombre: { es: '¿a o ha?', en: 'Spanish spelling: a or ha?' },
    detalle: { es: 'Voy … casa; mi hermano … llegado', en: 'Voy … casa; mi hermano … llegado' },
    introduccion: mismo(`<p><b>ha</b> es del verbo <b>haber</b>, y lleva h como él: <i>ha llegado, ha comido, ha hecho</i>.</p>
      <p><b>a</b> no es un verbo: <i>voy a casa, vamos a jugar, a las ocho</i>.</p>
      <p><b>Truco:</b> si en su sitio puedes poner <b>había</b>, se escribe <b>ha</b>.</p>`),
  },
  e_he: {
    nombre: { es: '¿e o he?', en: 'Spanish spelling: e or he?' },
    detalle: { es: 'padres … hijos; yo … terminado', en: 'padres … hijos; yo … terminado' },
    introduccion: mismo(`<p><b>he</b> es del verbo <b>haber</b>, y lleva h como él: <i>he comido, he ido, he hecho</i>.</p>
      <p><b>e</b> une dos cosas: es la <b>y</b> de siempre, que se escribe <b>e</b> delante de una palabra que empieza por <b>i</b> o <b>hi</b>: <i>Marta e Isabel, padres e hijos</i>.</p>
      <p><b>Truco:</b> si en su sitio puedes poner <b>había</b>, se escribe <b>he</b>.</p>`),
  },
  echo_hecho: {
    nombre: { es: '¿echo o hecho?', en: 'Spanish spelling: echo or hecho?' },
    detalle: { es: 'He … los deberes; te … de menos', en: 'He … los deberes; te … de menos' },
    introduccion: mismo(`<p><b>hecho</b> viene de <b>hacer</b>, y lleva h como él: <i>he hecho, está hecho, un hecho, ¡bien hecho!</i></p>
      <p><b>echo</b> viene de <b>echar</b>, que no lleva h: <i>yo echo sal, te echo de menos, te echo una mano</i>.</p>
      <p><b>Truco:</b> detrás de <i>he, has, ha, hemos, han</i> nunca va «echo»: es <i>hecho</i> (de hacer) o <i>echado</i> (de echar).</p>`),
  },
  revision: {
    nombre: { es: '¿Está bien escrita?', en: 'Spanish spelling: is it right?' },
    detalle: { es: 'Mezcla de a / ha, e / he y echo / hecho', en: 'Mixed: a / ha, e / he, echo / hecho' },
    pregunta: 'La palabra marcada, ¿está bien escrita?',
    bien: 'Bien escrita',
    mal: 'Mal escrita',
    esta_bien: 'Está bien escrita.',
    esta_mal: (puesta, buena) => `Está mal: no es «${puesta}», es «${buena}».`,
  },
  porque: {
    nombre: { es: '¿porque o por qué?', en: 'Spanish spelling: porque or por qué?' },
    detalle: { es: '¿… no vienes?; no voy … llueve', en: '¿… no vienes?; no voy … llueve' },
    introduccion: mismo(`<p><b>por qué</b>, separado y con tilde, <b>pregunta</b>: <i>¿Por qué no vienes?</i> También dentro de una frase sin signos de interrogación: <i>Dime por qué no vienes</i>.</p>
      <p><b>porque</b>, junto y sin tilde, <b>da la causa</b>: <i>No voy porque llueve</i>. Es lo que se contesta a un «¿por qué?».</p>
      <p><b>Truco:</b> si en su sitio puedes poner <b>ya que</b>, se escribe <b>porque</b>.</p>`),
  },
  vocativo: {
    nombre: { es: 'La coma del vocativo', en: 'Spanish spelling: the vocative comma' },
    detalle: { es: '«Vamos a comer, niños» no es «Vamos a comer niños»', en: '«Vamos a comer, niños» no es «Vamos a comer niños»' },
    introduccion: mismo(`<p>El <b>vocativo</b> es el nombre de la persona a la que hablas: <i>Lucía, ven aquí</i>.</p>
      <p>Se separa con <b>coma</b> del resto de la frase. Si va en medio, lleva <b>dos comas</b>: <i>Oye, Marcos, ¿me dejas un lápiz?</i></p>
      <p>Sin la coma, la frase puede decir otra cosa: <i>Vamos a comer, niños</i> (llamas a los niños) no es <i>Vamos a comer niños</i> (¡los niños son la comida!).</p>`),
  },
  comas: {
    nombre: { es: 'Comas que cambian el significado', en: 'Spanish spelling: commas that change the meaning' },
    detalle: { es: '«No, tengo hambre» no es «No tengo hambre»', en: '«No, tengo hambre» no es «No tengo hambre»' },
    introduccion: mismo(`<p>Una coma puede cambiar lo que dice una frase:</p>
      <p><i>—¿Has comido? —No, tengo hambre.</i> (No he comido, y tengo hambre.)<br><i>—No tengo hambre.</i> (No tengo hambre.)</p>
      <p><i>Los alumnos, que estudiaron, aprobaron.</i> (Todos estudiaron.)<br><i>Los alumnos que estudiaron aprobaron.</i> (Solo los que estudiaron.)</p>`),
    escrita: '¿Cuál está bien escrita?',
    significado: '¿Qué frase dice esto?',
  },
  hueco: {
    pregunta: '¿Qué palabra va en el hueco?',
  },
};

const AUXILIARES = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];

/**
 * La explicación de la frase n de una pareja, con esa frase (HTML, en español).
 * Dice qué palabra va, de dónde viene y el truco, probado en la frase.
 */
export function explicacion(pareja, n, esc) {
  const { buena, siguiente, antes } = partes(pareja, n);
  const conHabia = `<i>${esc(rellenar(pareja, n, 'había'))}</i>`;
  const p = PAREJAS[pareja];
  if (pareja === 'a_ha') {
    return buena === p.con
      ? `Va <b>ha</b>, del verbo <b>haber</b> (ha ${esc(siguiente)}): haber lleva h, y ha también. Se puede cambiar por «había»: ${conHabia} ✓`
      : `Va <b>a</b>, sin h: aquí no es el verbo haber. Si lo cambias por «había», no tiene sentido: ${conHabia} ✗`;
  }
  if (pareja === 'e_he') {
    if (buena === p.con) {
      return `Va <b>he</b>, del verbo <b>haber</b> (yo he ${esc(siguiente)}): haber lleva h, y he también. Se puede cambiar por «había»: ${conHabia} ✓`;
    }
    const empieza = /^h/i.test(siguiente) ? 'hi' : 'i';
    return `Va <b>e</b>, sin h: une dos cosas, como la «y», que se escribe «e» porque «${esc(siguiente)}» empieza por ${empieza}. No es el verbo haber: con «había» no tiene sentido (${conHabia} ✗).`;
  }
  if (pareja === 'porque') {
    if (buena === p.sin) {
      return `Va <b>porque</b>, junto y sin tilde: da la causa, el motivo. Se puede cambiar por «ya que»: <i>${esc(rellenar(pareja, n, 'ya que'))}</i> ✓`;
    }
    return /[¿]\s*$/.test(antes) || antes.includes('¿')
      ? `Va <b>por qué</b>, separado y con tilde: es una pregunta, y no da la causa (la causa sería la respuesta: «porque…»).`
      : `Va <b>por qué</b>, separado y con tilde: aunque no lleve ¿?, es una pregunta metida dentro de la frase. La respuesta empezaría por «porque…».`;
  }
  // echo / hecho
  if (buena === p.con) {
    const anterior = (antes.trim().split(/\s+/).at(-1) ?? '').toLowerCase().replace(/^[¿¡]/, '');
    const tras = AUXILIARES.includes(anterior)
      ? ` Fíjate: detrás de «${esc(anterior)}» nunca va «echo» (de echar sería «${esc(anterior)} echado»).`
      : '';
    return `Va <b>hecho</b>, de la familia de <b>hacer</b> (he hecho, está hecho, un hecho, ¡bien hecho!): hacer lleva h, y hecho también.${tras}`;
  }
  return `Va <b>echo</b>, del verbo <b>echar</b> (yo echo, tú echas, él echa): echar no lleva h, y echo tampoco.`;
}
