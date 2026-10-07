// Práctica «Baldosas y cuerdas»: textos propios, siempre { es, en }. Los
// comunes (Comprobar, Siguiente, ¡Bien!…) están en `../_comun/textos.js` y
// llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·», nunca «×»; división con «:»; inglés sencillo;
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
    instruccion: { es: (a, b) => `Suelo de ${a} × ${b} dm. Prueba lados y busca la baldosa más grande que cubra sin cortar.`, en: (a, b) => `${a} × ${b} dm floor. Try side lengths and find the biggest tile that covers it without cutting.` },
    lado: { es: 'Lado de la baldosa', en: 'Tile side' },
    cabe: { es: (a, b, s) => `Lado ${s}: cabe exacta en los dos lados (${a} y ${b}).`, en: (a, b, s) => `Side ${s}: it fits exactly on both sides (${a} and ${b}).` },
    sobra_una: { es: (dim, s, c, sobra) => `Lado ${s}: ${dim} : ${s} = ${c}, sobran ${sobra} dm: no cabe.`, en: (dim, s, c, sobra) => `Side ${s}: ${dim} : ${s} = ${c}, ${sobra} dm left over: it does not fit.` },
    sobra_dos: { es: (a, b, s, fa, fb) => `Lado ${s}: ${fa}${fb}no cabe.`, en: (a, b, s, fa, fb) => `Side ${s}: ${fa}${fb}it does not fit.` },
    boton_es_esta: { es: 'Esta es la más grande', en: 'This is the biggest one' },
    correcto_simple: { es: (a, b, g) => `Correcto: lado = m.c.d.(${a}, ${b}) = ${g}.`, en: (a, b, g) => `Correct: side = GCD(${a}, ${b}) = ${g}.` },
    correcto_factorizado: { es: (a, b, g, fa, fb) => `Correcto: ${a} = ${fa}; ${b} = ${fb}; m.c.d.(${a}, ${b}) = ${g} (los primos comunes con el menor exponente).`, en: (a, b, g, fa, fb) => `Correct: ${a} = ${fa}; ${b} = ${fb}; GCD(${a}, ${b}) = ${g} (the common primes with the smallest exponent).` },
    incorrecto_no_cabe: { es: s => `${s} no vale: con ese lado no cabe sin cortar.`, en: s => `${s} does not work: that side does not fit without cutting.` },
    incorrecto_no_mayor: { es: (s, g) => `${s} sí cabe, pero ${g} también cabe y es más grande.`, en: (s, g) => `${s} does fit, but ${g} also fits and is bigger.` },
    y_el_mcd: { es: (a, b, g) => `El lado más grande es m.c.d.(${a}, ${b}) = ${g}.`, en: (a, b, g) => `The biggest side is GCD(${a}, ${b}) = ${g}.` },
  },
  cuantas: {
    nombre: { es: '¿Cuántas baldosas?', en: 'How many tiles?' },
    detalle: { es: 'Con la baldosa más grande ya elegida', en: 'With the biggest tile already chosen' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El suelo ya está cubierto con la baldosa más grande posible: m.c.d.(a, b) de
        lado. ¿Cuántas baldosas hacen falta? A lo largo caben <span class="numero">a : lado</span>
        y a lo ancho <span class="numero">b : lado</span>. Las filas de baldosas <strong>se
        multiplican</strong>, no se suman: 5 filas de 7 baldosas son 35, no 12.</p>`,
      en: `<h2>How it works</h2>
        <p>The floor is already covered with the biggest possible tile: side GCD(a, b).
        How many tiles are needed? Along the length there are <span class="numero">a : side</span>
        and along the width <span class="numero">b : side</span>. The rows of tiles
        <strong>multiply</strong>, they do not add up: 5 rows of 7 tiles is 35, not 12.</p>`,
    },
    instruccion: { es: (a, b, g) => `Suelo de ${a} × ${b} dm cubierto con baldosas de lado ${g}. ¿Cuántas baldosas hacen falta?`, en: (a, b, g) => `${a} × ${b} dm floor covered with side-${g} tiles. How many tiles are needed?` },
    respuesta_label: { es: 'Número de baldosas', en: 'Number of tiles' },
    cuenta: { es: (a, b, g, p, q, cuantas) => `A lo largo: ${a} : ${g} = ${p}; a lo ancho: ${b} : ${g} = ${q}; ${p} · ${q} = ${cuantas}.`, en: (a, b, g, p, q, cuantas) => `Along the length: ${a} : ${g} = ${p}; along the width: ${b} : ${g} = ${q}; ${p} · ${q} = ${cuantas}.` },
    error_suma: { es: (p, q, cuantas) => `Has sumado ${p} + ${q}; las baldosas se multiplican: ${p} filas de ${q} son ${cuantas}.`, en: (p, q, cuantas) => `You added ${p} + ${q}; tiles multiply: ${p} rows of ${q} is ${cuantas}.` },
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
      es: longitudes => `Cortamos ${longitudes.length === 2 ? 'estas dos cuerdas' : 'estas tres cuerdas'} (${longitudes.join(', ')} dm) en trozos iguales, lo más largos posible, sin que sobre nada.`,
      en: longitudes => `We cut ${longitudes.length === 2 ? 'these two ropes' : 'these three ropes'} (${longitudes.join(', ')} dm) into equal pieces, as long as possible, with nothing left over.`,
    },
    pregunta_a: { es: '¿Cuánto mide cada trozo (en dm)?', en: 'How long is each piece (in dm)?' },
    pregunta_b: { es: '¿Cuántos trozos salen en total?', en: 'How many pieces are there in total?' },
    etiqueta_a: { es: 'Longitud del trozo', en: 'Piece length' },
    etiqueta_b: { es: 'Trozos en total', en: 'Total pieces' },
    cuenta: { es: (longitudes, g, porCuerda, total) => `Trozo = m.c.d.(${longitudes.join(', ')}) = ${g}. ${longitudes.map((l, i) => `${l} : ${g} = ${porCuerda[i]}`).join('; ')}: ${porCuerda.join(' + ')} = ${total} trozos.`, en: (longitudes, g, porCuerda, total) => `Piece = GCD(${longitudes.join(', ')}) = ${g}. ${longitudes.map((l, i) => `${l} : ${g} = ${porCuerda[i]}`).join('; ')}: ${porCuerda.join(' + ')} = ${total} pieces.` },
    pista_trozo_mal: { es: g => `El trozo mide ${g} dm, lo más largo posible sin que sobre nada en ninguna cuerda.`, en: g => `The piece is ${g} dm long, the longest possible with nothing left over in any rope.` },
    pista_total_mal: { es: (porCuerda, total) => `Aquí sí se suman, porque son cuerdas distintas: ${porCuerda.join(' + ')} = ${total} trozos.`, en: (porCuerda, total) => `Here you do add them up, because they are different ropes: ${porCuerda.join(' + ')} = ${total} pieces.` },
  },
};
