// «No lo sé» de «Léelo en inglés» (unidad 5): la explicación de cada ejercicio. Los cuatro son de elegir:
// la explicación que el ítem ya trae (`item.solucion`, en los dos idiomas), como mucho una regla corta que
// sea verdad para ESA plantilla y la opción buena entre comillas. Funciones puras; se prueban en
// `tests/practicas-ayuda-leelo5.test.js`.

import { aTexto, deTexto } from '../_comun/decimales.js';

const CONSEJOS = {
  palabra: {
    es: 'Es vocabulario: busca la opción que significa lo mismo; si dudas, descarta primero las que no pueden ser.',
    en: 'This is vocabulary: look for the option that means the same; if you are not sure, rule out the ones that cannot be.',
  },
  consigna: {
    es: 'No hay que calcular: busca la palabra que decide qué piden y elige la traducción que dice lo mismo.',
    en: 'You do not have to calculate: find the word that decides what is asked and choose the translation that says the same.',
  },
  completa: {
    es: 'Lee la frase entera y elige la palabra que encaja por el significado y por la gramática.',
    en: 'Read the whole sentence and choose the word that fits by meaning and by grammar.',
  },
};

/**
 * La regla de cada plantilla de «Léelo» (ejercicio 2), delante de la explicación del ítem. Donde la
 * explicación del ítem ya dice la regla (leer_decimal, leer_en_espanol) no se repite.
 */
const REGLAS_LEELO = {
  leer_dinero: {
    es: 'Con dinero no se dice «point»: se dicen los euros y después los céntimos como un número.',
    en: 'With money you do not say “point”: say the euros and then the cents as one number.',
  },
  cifras_de_palabras_en: {
    es: 'Lo que va antes de «point» es la parte entera; después, cada palabra es una cifra («nought» o «zero» es 0).',
    en: 'What comes before “point” is the whole part; after it, each word is one digit (“nought” or “zero” is 0).',
  },
  cifras_de_palabras_es_coma: {
    es: 'Lo que va antes de «coma» es la parte entera; cada «cero» de después de la coma es un 0.',
    en: 'What comes before “coma” is the whole part; each “cero” after the “coma” is a 0.',
  },
  cifras_de_palabras_es_ordenes: {
    es: 'El nombre del final dice cuántas cifras decimales hay: décimas, 1; centésimas, 2; milésimas, 3. Si faltan, ceros delante.',
    en: 'The last word tells you how many decimal places there are: décimas, 1; centésimas, 2; milésimas, 3. If digits are missing, put zeros in front.',
  },
  leer_cuenta: {
    es: 'Cada número se lee con «point» y las cifras una a una; el signo da la palabra: + plus, − minus, · times, : divided by.',
    en: 'Read each number with “point” and the digits one by one; the sign gives the word: + plus, − minus, · times, : divided by.',
  },
};

function reglaLeelo(item) {
  if (item.plantilla.startsWith('leer_cuenta')) return REGLAS_LEELO.leer_cuenta;
  if (item.plantilla === 'cifras_de_palabras_es') {
    return /\bcoma\b/.test(item.solucion.es) ? REGLAS_LEELO.cifras_de_palabras_es_coma : REGLAS_LEELO.cifras_de_palabras_es_ordenes;
  }
  return REGLAS_LEELO[item.plantilla] ?? null;
}

const ES_NUMERO = /^−?\d+([.,]\d+)?$/;

/**
 * La opción buena tal como se ve en pantalla (HTML si lo lleva, texto escapado si no). Con `idioma`, como
 * se escribe en la tarjeta: un número, con la coma o el punto de ese idioma (como la explicación del ítem),
 * y un texto, entre las comillas de ese idioma.
 */
export const opcionBuena = (item, esc = x => x, idioma = null) => {
  const o = item.opciones.find(x => x.correcta);
  if (o.html) return o.html;
  // «Pasa <fracción> a decimal»: el texto ya lleva la fracción como HTML (htmlFraccion) y no se escapa.
  const texto = /<span class="frac/.test(o.texto) ? o.texto : esc(o.texto);
  if (!idioma) return texto;
  if (ES_NUMERO.test(o.texto)) return aTexto(deTexto(o.texto), idioma);
  return idioma === 'en' ? `“${texto}”` : `«${texto}»`;
};

const respuesta = (item, idioma, esc) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${opcionBuena(item, esc, idioma)}.</strong></p>`;

const explica = clave => (item, { idioma, tt, esc }) => `<p>${tt(item.solucion)}</p><p class="consejo">${CONSEJOS[clave][idioma]}</p>${respuesta(item, idioma, esc)}`;

export const explicaPalabra = explica('palabra');
export const explicaConsigna = explica('consigna');
export const explicaCompleta = explica('completa');

/** Ejercicio 2 · Léelo: la regla de la plantilla (si la explicación del ítem no la dice ya), la explicación y la respuesta. */
export function explicaLeelo(item, { idioma, tt, esc }) {
  const regla = reglaLeelo(item);
  return `${regla ? `<p>${regla[idioma]}</p>` : ''}<p>${tt(item.solucion)}</p>${respuesta(item, idioma, esc)}`;
}
