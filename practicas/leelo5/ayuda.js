// «No lo sé» de «Léelo en inglés» (unidad 5): la explicación de cada ejercicio. Los cuatro son de elegir,
// así que se pone un consejo corto de cómo atacar ese tipo, la explicación que el ítem ya trae
// (`item.solucion`, en los dos idiomas) y la respuesta buena. Funciones puras; se prueban en
// `tests/practicas-ayuda-leelo5.test.js`.

const CONSEJOS = {
  palabra: {
    es: 'Es vocabulario: busca la opción que significa lo mismo; si dudas, descarta primero las que no pueden ser.',
    en: 'This is vocabulary: look for the option that means the same; if you are not sure, rule out the ones that cannot be.',
  },
  leelo: {
    es: 'Se lee el número de antes del «point» y, después, las cifras una a una; el 0 es «nought» o «zero».',
    en: 'Read the number before the “point” and then the digits one by one; 0 is “nought” or “zero”.',
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

/** La opción buena tal como se ve en pantalla (HTML si lo lleva, texto escapado si no). */
export const opcionBuena = (item, esc = x => x) => {
  const o = item.opciones.find(x => x.correcta);
  return o.html ?? esc(o.texto);
};

const explica = clave => (item, { idioma, tt, esc }) => {
  const respuesta = `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${opcionBuena(item, esc)}.</strong></p>`;
  return `<p>${tt(item.solucion)}</p><p class="consejo">${CONSEJOS[clave][idioma]}</p>${respuesta}`;
};

export const explicaPalabra = explica('palabra');
export const explicaLeelo = explica('leelo');
export const explicaConsigna = explica('consigna');
export const explicaCompleta = explica('completa');
