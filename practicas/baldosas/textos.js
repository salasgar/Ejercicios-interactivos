// Práctica «Baldosas y cuerdas»: textos propios, siempre { es, en }. Los
// comunes (Comprobar, Siguiente, ¡Bien!…) están en `../_comun/textos.js` y
// llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·», nunca con aspa; división con «:»; inglés sencillo;
// el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.

export const TX = {
  baldosa: {
    nombre: { es: 'La baldosa más grande', en: 'The biggest tile' },
    detalle: { es: 'Cubre el suelo sin cortar ninguna baldosa', en: 'Cover the floor without cutting any tile' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Tienes un suelo rectangular y baldosas cuadradas. Prueba lados: si el lado
        <strong>divide</strong> a los dos del rectángulo, las baldosas cubren el suelo sin
        cortar ninguna. Busca el lado más grande con el que eso pase.</p>
        <p>Ese lado es el <strong>m.c.d.</strong> de los dos lados del rectángulo.</p>`,
      en: `<h2>How it works</h2>
        <p>You have a rectangular floor and square tiles. Try side lengths: if the side
        <strong>divides</strong> both sides of the rectangle, the tiles cover the floor
        without cutting any. Find the largest side for which that happens.</p>
        <p>That side is the <strong>GCD</strong> of the two sides of the rectangle.</p>`,
    },
    instruccion: { es: (a, b) => `Suelo de ${a} dm por ${b} dm. Prueba lados y busca la <strong>baldosa más grande</strong> que cubra sin cortar.`, en: (a, b) => `A floor of ${a} dm by ${b} dm. Try side lengths and find the <strong>biggest tile</strong> that covers it without cutting.` },
    lado: { es: 'Lado de la baldosa', en: 'Tile side' },
    cabe: { es: (a, b, s) => `Lado ${s}: cabe exacta en los dos lados (${a} y ${b}).`, en: (a, b, s) => `Side ${s}: it fits exactly on both sides (${a} and ${b}).` },
    // La cuenta de un lado que no cabe, sin prefijo ni conclusión: «40 : 7 = 5, sobran 5 dm».
    resto_en: { es: (dim, s, c, sobra) => `${dim} : ${s} = ${c}, ${sobra === 1 ? 'sobra' : 'sobran'} ${sobra} dm`, en: (dim, s, c, sobra) => `${dim} : ${s} = ${c}, ${sobra} dm left over` },
    sobra_una: { es: (dim, s, c, sobra) => `Lado ${s}: ${dim} : ${s} = ${c}, ${sobra === 1 ? 'sobra' : 'sobran'} ${sobra} dm: no cabe.`, en: (dim, s, c, sobra) => `Side ${s}: ${dim} : ${s} = ${c}, ${sobra} dm left over: it does not fit.` },
    sobra_dos: { es: (s, fa, fb) => `Lado ${s}: ${fa}; ${fb}. No cabe en ninguno de los dos.`, en: (s, fa, fb) => `Side ${s}: ${fa}; ${fb}. It fits on neither.` },
    boton_es_esta: { es: 'Esta es la más grande', en: 'This is the biggest one' },
    correcto_simple: { es: (a, b, g) => `Correcto: lado = m.c.d.(${a}, ${b}) = ${g}.`, en: (a, b, g) => `Correct: side = GCD(${a}, ${b}) = ${g}.` },
    correcto_factorizado: { es: (a, b, g, fa, fb) => `Correcto: ${a} = ${fa}; ${b} = ${fb}; m.c.d.(${a}, ${b}) = ${g} (los primos comunes con el menor exponente).`, en: (a, b, g, fa, fb) => `Correct: ${a} = ${fa}; ${b} = ${fb}; GCD(${a}, ${b}) = ${g} (the common primes with the smallest exponent).` },
    incorrecto_no_cabe: { es: (s, cuenta) => `${s} no vale: ${cuenta}, así que hay que cortar baldosas.`, en: (s, cuenta) => `${s} does not work: ${cuenta}, so tiles would have to be cut.` },
    incorrecto_no_mayor: { es: (s, g) => `${s} sí cabe, pero ${g} también cabe y es más grande.`, en: (s, g) => `${s} does fit, but ${g} also fits and is bigger.` },
    y_el_mcd: { es: (a, b, g) => `El lado más grande es m.c.d.(${a}, ${b}) = ${g}.`, en: (a, b, g) => `The biggest side is GCD(${a}, ${b}) = ${g}.` },
  },
  cuantas: {
    nombre: { es: '¿Cuántas baldosas?', en: 'How many tiles?' },
    detalle: { es: 'Con la baldosa más grande ya elegida', en: 'With the biggest tile already chosen' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El suelo ya está cubierto con la baldosa más grande posible, la del m.c.d. de sus
        dos lados. ¿Cuántas baldosas hacen falta? Ejemplo: un suelo de 40 dm por 56 dm,
        con baldosas de 8 dm de lado. A lo largo caben <span class="numero">40 : 8 = 5</span>
        y a lo ancho <span class="numero">56 : 8 = 7</span>. Las filas de baldosas <strong>se
        multiplican</strong>, no se suman: 7 filas de 5 baldosas son 35, no 12.</p>`,
      en: `<h2>How it works</h2>
        <p>The floor is already covered with the biggest possible tile, the one given by the
        GCD of its two sides. How many tiles are needed? Example: a floor 40 dm by 56 dm,
        with tiles with a side of 8 dm. Along the length there are <span class="numero">40 : 8 = 5</span>
        and along the width <span class="numero">56 : 8 = 7</span>. The rows of tiles
        <strong>multiply</strong>, they do not add up: 7 rows of 5 tiles is 35, not 12.</p>`,
    },
    instruccion: { es: (a, b, g) => `Suelo de ${a} dm por ${b} dm cubierto con baldosas de ${g} dm de lado. ¿Cuántas baldosas hacen falta?`, en: (a, b, g) => `A floor of ${a} dm by ${b} dm covered with tiles with a side of ${g} dm. How many tiles are needed?` },
    respuesta_label: { es: 'Número de baldosas', en: 'Number of tiles' },
    cuenta: { es: (a, b, g, p, q, cuantas) => `A lo largo: ${a} : ${g} = ${p}; a lo ancho: ${b} : ${g} = ${q}; ${p} · ${q} = ${cuantas}.`, en: (a, b, g, p, q, cuantas) => `Along the length: ${a} : ${g} = ${p}; along the width: ${b} : ${g} = ${q}; ${p} · ${q} = ${cuantas}.` },
    // p = baldosas a lo largo (por fila), q = a lo ancho (filas): el dibujo tiene q filas de p.
    error_suma: { es: (p, q, cuantas) => `Has sumado ${p} + ${q}; las baldosas se multiplican: ${q} filas de ${p} son ${cuantas}.`, en: (p, q, cuantas) => `You added ${p} + ${q}; tiles multiply: ${q} rows of ${p} is ${cuantas}.` },
    error_lado: { es: g => `${g} es el lado de la baldosa, no cuántas hay.`, en: g => `${g} is the side of the tile, not how many there are.` },
  },
  cuerdas: {
    nombre: { es: 'Cuerdas', en: 'Ropes' },
    detalle: { es: 'Trozos iguales lo más largos posible', en: 'Equal pieces, as long as possible' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cortas varias cuerdas en trozos iguales, lo más largos posible, sin que sobre
        nada en ninguna. Esa longitud es el <strong>m.c.d.</strong> de todas las cuerdas.</p>
        <p>Cada cuerda da <span class="numero">longitud : trozo</span> trozos; como son
        cuerdas distintas, el número total de trozos <strong>se suma</strong>, no se
        multiplica.</p>`,
      en: `<h2>How it works</h2>
        <p>You cut several ropes into equal pieces, as long as possible, with nothing left
        over in any of them. That length is the <strong>GCD</strong> of all the ropes.</p>
        <p>Each rope gives <span class="numero">length : piece</span> pieces; since they are
        different ropes, the total number of pieces <strong>adds up</strong>, it is not
        multiplied.</p>`,
    },
    instruccion: {
      es: longitudes => `Cortamos ${longitudes.length === 2 ? 'estas dos cuerdas' : 'estas tres cuerdas'} (${longitudes.join(', ')} dm) en trozos iguales, <strong>lo más largos posible</strong>, sin que sobre nada.`,
      en: longitudes => `We cut ${longitudes.length === 2 ? 'these two ropes' : 'these three ropes'} (${longitudes.join(', ')} dm) into equal pieces, <strong>as long as possible</strong>, with nothing left over.`,
    },
    pregunta_a: { es: '¿Cuánto mide <strong>cada trozo</strong> (en dm)?', en: 'How long is <strong>each piece</strong> (in dm)?' },
    pregunta_b: { es: '¿Cuántos trozos salen <strong>en total</strong>?', en: 'How many pieces are there <strong>in total</strong>?' },
    etiqueta_a: { es: 'Longitud del trozo', en: 'Piece length' },
    etiqueta_b: { es: 'Trozos en total', en: 'Total pieces' },
    cuenta: { es: (longitudes, g, porCuerda, total) => `Trozo = m.c.d.(${longitudes.join(', ')}) = ${g}. ${longitudes.map((l, i) => `${l} : ${g} = ${porCuerda[i]}`).join('; ')}: ${porCuerda.join(' + ')} = ${total} trozos.`, en: (longitudes, g, porCuerda, total) => `Piece = GCD(${longitudes.join(', ')}) = ${g}. ${longitudes.map((l, i) => `${l} : ${g} = ${porCuerda[i]}`).join('; ')}: ${porCuerda.join(' + ')} = ${total} pieces.` },
    pista_trozo_mal: { es: g => `El trozo mide ${g} dm, lo más largo posible sin que sobre nada en ninguna cuerda.`, en: g => `The piece is ${g} dm long, the longest possible with nothing left over in any rope.` },
    pista_total_coherente: { es: (t, porCuerda, total) => `Con tu trozo de ${t} dm la suma está bien hecha (${porCuerda.join(' + ')} = ${total}); el fallo está en el trozo, que no es el más largo.`, en: (t, porCuerda, total) => `With your ${t} dm piece the addition is right (${porCuerda.join(' + ')} = ${total}); the mistake is the piece, which is not the longest.` },
    pista_total_mal: { es: (porCuerda, total) => `Aquí sí se suman, porque son cuerdas distintas: ${porCuerda.join(' + ')} = ${total} trozos.`, en: (porCuerda, total) => `Here you do add them up, because they are different ropes: ${porCuerda.join(' + ')} = ${total} pieces.` },
  },
  // «No lo sé» (revisión 193): qué se pide, las cuentas con sus unidades y la frase de respuesta. El m.c.d. con el
  // método de los apuntes de la U2: listas de divisores con números pequeños (hasta 50, como el feedback de acierto
  // del ejercicio 1) y factorización con los grandes y con las cuerdas.
  ayuda: {
    respuesta: { es: 'La respuesta es', en: 'The answer is' },
    pide_baldosa: {
      es: (a, b) => `Se pide el lado de la baldosa cuadrada más grande que cubre el suelo sin cortar ninguna: el mayor número que divide a ${a} y a ${b}, su m.c.d.`,
      en: (a, b) => `You need the side of the biggest square tile that covers the floor without cutting any: the biggest number that divides ${a} and ${b}, their GCD.`,
    },
    divisores: { es: (n, lista) => `Divisores de ${n}: ${lista.join(', ')}.`, en: (n, lista) => `Divisors of ${n}: ${lista.join(', ')}.` },
    comunes: {
      es: (a, b, lista, g) => `Los que dividen a los dos: ${lista.join(', ')}. El mayor es el ${g}: <span class="cuenta">m.c.d.(${a}, ${b}) = ${g} dm</span>.`,
      en: (a, b, lista, g) => `The ones that divide both: ${lista.join(', ')}. The biggest is ${g}: <span class="cuenta">GCD(${a}, ${b}) = ${g} dm</span>.`,
    },
    descompon: {
      es: igualdades => `Descompón en factores primos: ${igualdades}.`,
      en: igualdades => `Write them as products of primes: ${igualdades}.`,
    },
    mcd_fact: {
      es: (datos, cuenta) => `Para el m.c.d., solo los primos comunes, con el menor exponente: <span class="cuenta">m.c.d.(${datos}) = ${cuenta} dm</span>.`,
      en: (datos, cuenta) => `For the GCD, take only the common primes, with the lowest power: <span class="cuenta">GCD(${datos}) = ${cuenta} dm</span>.`,
    },
    fin_baldosa: {
      es: g => `La respuesta es <strong>${g} dm</strong>: es el lado de la baldosa más grande.`,
      en: g => `The answer is <strong>${g} dm</strong>: that is the side of the biggest tile.`,
    },
    pide_cuantas: {
      es: g => `Se pide cuántas baldosas de ${g} dm de lado cubren el suelo: se cuenta cuántas caben a lo largo y a lo ancho, y se multiplica.`,
      en: g => `You need how many tiles of side ${g} dm cover the floor: count how many fit along the length and along the width, and multiply.`,
    },
    a_lo_largo: { es: (a, g, p) => `A lo largo: <span class="cuenta">${a} : ${g} = ${p}</span> baldosas.`, en: (a, g, p) => `Along the length: <span class="cuenta">${a} : ${g} = ${p}</span> tiles.` },
    a_lo_ancho: { es: (b, g, q) => `A lo ancho: <span class="cuenta">${b} : ${g} = ${q}</span> baldosas.`, en: (b, g, q) => `Along the width: <span class="cuenta">${b} : ${g} = ${q}</span> tiles.` },
    filas: {
      es: (p, q, n) => `Son ${q} ${q === 1 ? 'fila' : 'filas'} de ${p}: <span class="cuenta">${p} · ${q} = ${n}</span> baldosas.`,
      en: (p, q, n) => `That is ${q} ${q === 1 ? 'row' : 'rows'} of ${p}: <span class="cuenta">${p} · ${q} = ${n}</span> tiles.`,
    },
    fin_cuantas: {
      es: n => `La respuesta es <strong>${n} baldosas</strong>: son las que hacen falta para cubrir el suelo.`,
      en: n => `The answer is <strong>${n} tiles</strong>: that is how many you need to cover the floor.`,
    },
    consejo_cuantas: {
      es: 'Consejo: las filas de baldosas se multiplican, no se suman.',
      en: 'Tip: the rows of tiles multiply, they do not add up.',
    },
    pide_cuerdas: {
      es: 'Se piden dos cosas: cuánto mide cada trozo (lo más largo que cabe en todas las cuerdas sin que sobre nada, el m.c.d.) y cuántos trozos salen (se suman los de cada cuerda).',
      en: 'You need two things: how long each piece is (the longest length that goes into every rope with nothing left over, the GCD) and how many pieces there are (add up the pieces of each rope).',
    },
    trozos: {
      es: (divisiones, porCuerda, total) => `Trozos de cada cuerda: ${divisiones}. En total, <span class="cuenta">${porCuerda.join(' + ')} = ${total}</span> trozos.`,
      en: (divisiones, porCuerda, total) => `Pieces from each rope: ${divisiones}. In total, <span class="cuenta">${porCuerda.join(' + ')} = ${total}</span> pieces.`,
    },
    fin_cuerdas: {
      es: (g, t) => `La respuesta es <strong>${g} dm</strong> cada trozo y <strong>${t} trozos</strong> en total.`,
      en: (g, t) => `The answer is <strong>${g} dm</strong> for each piece and <strong>${t} pieces</strong> in total.`,
    },
    y: { es: 'y', en: 'and' },
  },
};
