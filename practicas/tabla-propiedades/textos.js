// Tabla de propiedades: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, ¡Bien!…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor» y no «factor»
// para la relación entre números; producto con «·»; división con «:» en español y
// «÷» en inglés; inglés sencillo.

/** El signo de dividir: «:» en español y «÷» en inglés. */
export const ENTRE = { es: ':', en: '÷' };

const sn = (cuantos, uno, varios) => (cuantos === 1 ? uno : varios);

export const TX = {
  y: { es: 'y', en: 'and' },

  // El nombre de cada etiqueta, con su parámetro. Mayúscula inicial, uniforme.
  etiquetas: {
    par: { es: () => 'Par', en: () => 'Even' },
    impar: { es: () => 'Impar', en: () => 'Odd' },
    mayor: { es: p => `Mayor que ${p}`, en: p => `Greater than ${p}` },
    menor: { es: p => `Menor que ${p}`, en: p => `Less than ${p}` },
    multiplo: { es: p => `Múltiplo de ${p}`, en: p => `Multiple of ${p}` },
    primo: { es: () => 'Primo', en: () => 'Prime' },
    compuesto: { es: () => 'Compuesto', en: () => 'Composite' },
    cuadrado: { es: () => 'Cuadrado perfecto', en: () => 'Perfect square' },
    divisor: { es: p => `Divisor de ${p}`, en: p => `Divisor of ${p}` },
    ndivisores: { es: p => `Tiene ${p} divisores`, en: p => `Has ${p} divisors` },
    triangular: { es: () => 'Triangular', en: () => 'Triangular number' },
  },

  // Por qué un número NO cumple una propiedad (con sus números).
  razones: {
    par: { es: (n, u) => `${n} no es par: acaba en ${u}`, en: (n, u) => `${n} is not even: it ends in ${u}` },
    impar: { es: (n, u) => `${n} no es impar: acaba en ${u}`, en: (n, u) => `${n} is not odd: it ends in ${u}` },
    mayor: {
      es: (n, p, igual) => `${n} no es mayor que ${p}: ${igual ? `es igual que ${p}` : `${n} < ${p}`}`,
      en: (n, p, igual) => `${n} is not greater than ${p}: ${igual ? `it is equal to ${p}` : `${n} < ${p}`}`,
    },
    menor: {
      es: (n, p, igual) => `${n} no es menor que ${p}: ${igual ? `es igual que ${p}` : `${n} > ${p}`}`,
      en: (n, p, igual) => `${n} is not less than ${p}: ${igual ? `it is equal to ${p}` : `${n} > ${p}`}`,
    },
    multiplo: {
      es: (n, p, q, r, e) => `${n} no es múltiplo de ${p}: ${n} ${e} ${p} no es exacta${q === 0 ? ` (${n} es menor que ${p})` : ` (da ${q} y sobran ${r})`}`,
      en: (n, p, q, r, e) => `${n} is not a multiple of ${p}: ${n} ${e} ${p} is not exact${q === 0 ? ` (${n} is less than ${p})` : ` (${q} remainder ${r})`}`,
    },
    primo: { es: (n, d, c) => `${n} no es primo: ${n} = ${d} · ${c}`, en: (n, d, c) => `${n} is not prime: ${n} = ${d} · ${c}` },
    compuesto: {
      es: n => `${n} no es compuesto: es primo, solo se puede dividir entre 1 y entre ${n}`,
      en: n => `${n} is not composite: it is prime, it can only be divided by 1 and by ${n}`,
    },
    uno: {
      es: n => `${n} no es primo ni compuesto: solo tiene un divisor, el 1`,
      en: n => `${n} is neither prime nor composite: it has only one divisor, 1`,
    },
    cuadrado: {
      es: (n, k, a, k1, b) => `${n} no es un cuadrado perfecto: está entre ${k} · ${k} = ${a} y ${k1} · ${k1} = ${b}`,
      en: (n, k, a, k1, b) => `${n} is not a perfect square: it is between ${k} · ${k} = ${a} and ${k1} · ${k1} = ${b}`,
    },
    divisor: {
      es: (n, p, e) => `${n} no es divisor de ${p}: ${p} ${e} ${n} no es exacta`,
      en: (n, p, e) => `${n} is not a divisor of ${p}: ${p} ${e} ${n} is not exact`,
    },
    ndivisores: {
      es: (n, k, m, l) => `${n} no tiene ${k} divisores: tiene ${m} ${sn(m, 'divisor', 'divisores')} (${l})`,
      en: (n, k, m, l) => `${n} does not have ${k} divisors: it has ${m} ${sn(m, 'divisor', 'divisors')} (${l})`,
    },
    triangular: {
      es: (n, l) => `${n} no es triangular: los triangulares hasta 100 son ${l}`,
      en: (n, l) => `${n} is not triangular: the triangular numbers up to 100 are ${l}`,
    },
  },

  ejercicio: {
    nombre: { es: 'Tabla de propiedades (reto)', en: 'Properties table (challenge)' },
    detalle: {
      es: 'Reto opcional por niveles: etiquetas en las cabeceras y cada número en su casilla. Sin vidas: comprobar no cuesta nada',
      en: 'Optional challenge with levels: labels in the headings and each number in its cell. No lives: checking costs nothing',
    },
    sinAyuda: 'Es un reto que se comprueba sin coste, y el feedback dice qué no encaja: no lleva «No lo sé».',
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una tabla tiene <strong>etiquetas</strong> con propiedades de los números (por ejemplo «Primo» o «Par») en las cabeceras de las filas y de las columnas. Cada <strong>número</strong> va en una casilla en la que cumpla <strong>las dos</strong> propiedades: la de su fila y la de su columna.</p>
        <p>Hay muchas soluciones: tú decides dónde van las etiquetas y dónde los números. Toca una pieza y después un hueco, o arrástrala.</p>
        <p>Es un <strong>reto</strong>: no hace falta para cumplir la tarea. Cada tabla completa da 1 punto por cada pieza colocada, y comprobar no cuesta nada.</p>`,
      en: `<h2>How it works</h2>
        <p>A table has <strong>labels</strong> with properties of numbers (for example "Prime" or "Even") in the headings of the rows and the columns. Each <strong>number</strong> goes in a cell where it has <strong>both</strong> properties: the one of its row and the one of its column.</p>
        <p>There are many solutions: you decide where the labels go and where the numbers go. Tap a piece and then a space, or drag it.</p>
        <p>This is a <strong>challenge</strong>: you do not need it to complete the task. A finished table gives 1 point for each piece you place, and checking costs nothing.</p>`,
    },
  },

  pantalla: {
    instruccion_fijas: {
      es: 'Coloca cada número en una casilla en la que cumpla las dos propiedades: la de su fila y la de su columna.',
      en: 'Put each number in a cell where it has both properties: the one of its row and the one of its column.',
    },
    instruccion: {
      es: 'Coloca las etiquetas en las cabeceras de las filas y de las columnas, y cada número en una casilla en la que cumpla las dos propiedades.',
      en: 'Put the labels in the headings of the rows and the columns, and each number in a cell where it has both properties.',
    },
    nivel: { es: n => `Nivel ${n} de 4`, en: n => `Level ${n} of 4` },
    etiquetas: { es: 'Etiquetas', en: 'Labels' },
    numeros: { es: 'Números', en: 'Numbers' },
    hueco: { es: 'hueco', en: 'space' },
    faltan: {
      es: k => `Faltan ${k} ${sn(k, 'pieza', 'piezas')} por colocar.`,
      en: k => `${k} ${sn(k, 'piece is', 'pieces are')} still to be placed.`,
    },
    listo: { es: 'Todo colocado: pulsa «Comprobar».', en: 'Everything is placed: press "Check".' },
    elegida: { es: 'Ahora toca un hueco (o la bandeja para devolverla).', en: 'Now tap a space (or the tray to put it back).' },
    fallo_titulo: {
      es: k => `Hay ${k} ${sn(k, 'cosa que no encaja', 'cosas que no encajan')}. Las casillas en rojo tienen un número que no cumple una de sus dos propiedades:`,
      en: k => `${k} ${sn(k, 'thing does not fit', 'things do not fit')}. The red cells have a number that does not have one of its two properties:`,
    },
    fallo_mas: { es: k => `…y ${k} más.`, en: k => `…and ${k} more.` },
    fallo_pie: { es: 'No pierdes nada: cambia lo que haga falta y vuelve a comprobar.', en: 'You lose nothing: change what you need to and check again.' },
    bien: {
      es: (puntos, piezas) => `¡Tabla completa! ${piezas} piezas bien colocadas: +${puntos} ${sn(puntos, 'punto', 'puntos')}.`,
      en: (puntos, piezas) => `Table complete! ${piezas} pieces correctly placed: +${puntos} ${sn(puntos, 'point', 'points')}.`,
    },
    bien_extra: { es: 'Es una de las muchas soluciones posibles: vale cualquiera que cumpla las propiedades.', en: 'This is one of the many possible solutions: any one that has the properties is fine.' },
    sube: { es: n => `Pasas al nivel ${n}.`, en: n => `You move on to level ${n}.` },
    final: { es: '¡Has completado los cuatro niveles!', en: 'You have completed all four levels!' },
    dejar: { es: 'Quitar de aquí', en: 'Remove from here' },
  },

  // Infografías: cada familia con una tiene `pregunta`, `corta` y `larga` (HTML) y, si hace falta, un dibujo.
  infografias: {
    triangular: {
      titulo: { es: 'Números triangulares', en: 'Triangular numbers' },
      corta: {
        es: `<p>Un número es <strong>triangular</strong> si con esa cantidad de puntos se puede formar un triángulo:</p>`,
        en: `<p>A number is <strong>triangular</strong> if that many dots can form a triangle:</p>`,
      },
      pie_corta: { es: '<p>Son 1, 3, 6, 10, 15…</p>', en: '<p>They are 1, 3, 6, 10, 15…</p>' },
      pregunta: { es: '¿Sabes ya lo que es un número triangular?', en: 'Do you already know what a triangular number is?' },
      larga: {
        es: `<p>Cada triángulo se hace añadiendo <strong>una fila más</strong> al anterior: la primera fila tiene 1 punto, la segunda 2, la tercera 3…</p>
          <p class="tp-cuentas"><span class="cuenta">1</span><br><span class="cuenta">1 + 2 = 3</span><br><span class="cuenta">1 + 2 + 3 = 6</span><br><span class="cuenta">1 + 2 + 3 + 4 = 10</span><br><span class="cuenta">1 + 2 + 3 + 4 + 5 = 15</span></p>
          <p>Los números triangulares hasta 100 son: <strong>1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78 y 91</strong>. Cualquier otro número no lo es.</p>`,
        en: `<p>Each triangle is made by adding <strong>one more row</strong> to the one before: the first row has 1 dot, the second 2, the third 3…</p>
          <p class="tp-cuentas"><span class="cuenta">1</span><br><span class="cuenta">1 + 2 = 3</span><br><span class="cuenta">1 + 2 + 3 = 6</span><br><span class="cuenta">1 + 2 + 3 + 4 = 10</span><br><span class="cuenta">1 + 2 + 3 + 4 + 5 = 15</span></p>
          <p>The triangular numbers up to 100 are: <strong>1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78 and 91</strong>. Any other number is not.</p>`,
      },
    },
    si: { es: 'Sí, ya lo sé', en: 'Yes, I know' },
    no: { es: 'No', en: 'No' },
    entendido: { es: 'Entendido: al puzle', en: 'Got it: to the puzzle' },
  },
};
