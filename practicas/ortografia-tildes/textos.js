// Ortografía: las tildes. Textos propios (tarea 135). La práctica va siempre en español
// (`idioma: 'es'` en `arrancar`); solo `nombre` y `detalle` de cada ejercicio llevan también
// inglés («Spanish spelling: …»), porque los usan la portada y la tarea semanal.
// Los textos comunes de la ortografía están en ../_comun/ortografia.js (TXO). Las
// explicaciones de cada ítem, que usan su palabra, están en logica.js.

const mismo = texto => ({ es: texto, en: texto });

export const TX = {
  tonica: {
    nombre: { es: 'La sílaba tónica', en: 'Spanish spelling: the stressed syllable' },
    detalle: { es: 'pa-PEL, CA-sa, TÉ-le-fo-no: aguda, llana o esdrújula', en: 'pa-PEL, CA-sa, TÉ-le-fo-no: aguda, llana or esdrújula' },
    introduccion: mismo(`<p>Toda palabra tiene una sílaba que se pronuncia con más fuerza: la <b>tónica</b>. Según dónde esté, la palabra es:</p>
      <p><b>aguda</b> (la última): <i>pa-PEL, ca-LOR</i> · <b>llana</b> (la penúltima): <i>CA-sa, ven-TA-na</i> · <b>esdrújula</b> (la antepenúltima): <i>SÁ-ba-do, mú-si-ca</i>.</p>
      <p>Primero toca la sílaba que más se oye; si aciertas, di cómo es la palabra. Saber cuál es la tónica es lo que luego decide si lleva tilde.</p>`),
    paso1: 'Toca la sílaba tónica, la que más se oye.',
    paso2: '¿Cómo es la palabra?',
  },
  tilde: {
    nombre: { es: '¿Lleva tilde?', en: 'Spanish spelling: does it take an accent?' },
    detalle: { es: 'camión, examen, lápiz, reloj: ¿en qué sílaba va la tilde?', en: 'camión, examen, lápiz, reloj: which syllable takes the accent?' },
    introduccion: mismo(`<p>Para saber si una palabra lleva <b>tilde</b>, busca su sílaba tónica y mira cómo es:</p>
      <p><b>Aguda</b>: lleva tilde si acaba en vocal, <b>n</b> o <b>s</b>: <i>camión, sofá, jamás</i>. <i>Reloj, verdad</i> no.</p>
      <p><b>Llana</b>: lleva tilde si <b>no</b> acaba en vocal, n ni s: <i>lápiz, árbol</i>. <i>Examen, casa</i> no.</p>
      <p><b>Esdrújula</b>: lleva tilde <b>siempre</b>: <i>música, sábado</i>.</p>
      <p>Toca la sílaba que lleva la tilde. Si la palabra no la lleva, toca «Ninguna».</p>`),
    instruccion: 'Toca la sílaba que lleva la tilde. Si la palabra no lleva tilde, toca «Ninguna».',
  },
  vocales: {
    nombre: { es: 'Diptongos e hiatos', en: 'Spanish spelling: diphthongs and hiatuses' },
    detalle: { es: 'día, ruido, también, poeta: dos vocales juntas', en: 'día, ruido, también, poeta: two vowels together' },
    introduccion: mismo(`<p>Las vocales <b>a, e, o</b> son abiertas; <b>i, u</b>, cerradas.</p>
      <p><b>Diptongo</b>: cerrada + abierta (o dos cerradas) en la <b>misma</b> sílaba: <i>ruido, cuidado, tam-bién</i>. Se acentúa con las reglas de siempre, y la tilde va en la vocal abierta (o en la segunda de dos cerradas: <i>cuí-da-te</i>).</p>
      <p><b>Hiato</b>: dos vocales que se separan. Si una <b>i o u tónica</b> va junto a una abierta, la tilde se pone <b>siempre</b> en ella: <i>dí-a, ra-íz, bú-ho</i>. Dos abiertas (<i>po-e-ta</i>) siguen las reglas de siempre.</p>
      <p>Toca la letra que lleva la tilde. Si no la lleva, toca «Ninguna».</p>`),
    instruccion: 'Toca la vocal que lleva la tilde. Si la palabra no lleva tilde, toca «Ninguna».',
    hueco: '¿Aún o aun?',
  },
  mates: {
    nombre: { es: 'Las palabras de Matemáticas', en: 'Spanish spelling: the words of Maths' },
    detalle: { es: 'número, división, área, raíz: con tilde o sin ella', en: 'número, división, área, raíz: with or without an accent' },
    introduccion: mismo(`<p>Muchas palabras de clase de Matemáticas llevan tilde: <i>número, división, múltiplo, perímetro, ecuación</i>. Pero no todas: <i>examen, divisor, cociente, potencia</i> no la llevan.</p>
      <p>Elige la forma bien escrita para completar la frase. Si dudas, busca la sílaba tónica y aplica las reglas de las agudas, las llanas y las esdrújulas.</p>`),
  },
};
