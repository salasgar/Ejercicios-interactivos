// Práctica «Del enunciado a la expresión»: textos propios { es, en } y el BANCO
// DE ENUNCIADOS. Puro: ni DOM ni red (lo importa `logica.js`).
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): producto con «·»,
// nunca «×»; inglés sencillo, con la palabra que decide aclarada entre
// paréntesis; sin letras ni ecuaciones; y el feedback habla de LOS NÚMEROS DE
// ESE ÍTEM.

/** [3, 4, 5] → «3, 4 y 5» / «3, 4 and 5». */
const enumerar = (lista, y) => (lista.length > 1 ? `${lista.slice(0, -1).join(', ')} ${y} ${lista.at(-1)}` : String(lista[0]));

export const TX = {
  sin: {
    nombre: { es: 'Dos operaciones', en: 'Two operations' },
    detalle: { es: 'Monta la expresión del problema, sin calcularla', en: 'Build the expression for the problem, without calculating it' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lee el problema y <strong>monta la expresión</strong> que lo resuelve tocando las fichas. No hay que calcular nada.</p>
        <p>Por ejemplo, «3 cajas de 12 botes y 5 cajas de 8 botes» es <strong>3 · 12 + 5 · 8</strong>.</p>
        <p>Si te equivocas, toca una ficha de la línea para quitarla. Recuerda: la multiplicación y la división se hacen antes que la suma y la resta.</p>`,
      en: `<h2>How it works</h2>
        <p>Read the problem and <strong>build the expression</strong> that solves it. Tap the buttons. You do not need to calculate anything.</p>
        <p>For example, “3 boxes of 12 tins and 5 boxes of 8 tins” is <strong>3 · 12 + 5 · 8</strong>.</p>
        <p>If you make a mistake, tap it in the line to remove it. Remember: multiplication and division come before addition and subtraction.</p>`,
    },
  },
  con: {
    nombre: { es: '¿Hace falta el paréntesis?', en: 'Do you need brackets?' },
    detalle: { es: 'Agrupa con paréntesis lo que va junto, y solo si hace falta', en: 'Use brackets for what goes together, and only when you need them' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Monta la expresión del problema. Ahora, a veces, hay que hacer <strong>antes</strong> una suma o una resta: entonces hace falta un <strong>paréntesis</strong>.</p>
        <p>«7 más 3, <strong>todo</strong> multiplicado por 2» es <strong>(7 + 3) · 2</strong>. Sin «todo» sería 7 + 3 · 2.</p>
        <p>Otras veces el paréntesis no hace falta: puedes ponerlo o no.</p>`,
      en: `<h2>How it works</h2>
        <p>Build the expression for the problem. Now, sometimes, an addition or a subtraction comes <strong>first</strong>: then you need <strong>brackets</strong>.</p>
        <p>“7 plus 3, <strong>all</strong> multiplied by 2” is <strong>(7 + 3) · 2</strong>. Without “all” it is 7 + 3 · 2.</p>
        <p>Sometimes you do not need brackets: you can use them or not.</p>`,
    },
  },
  potencias: {
    nombre: { es: 'Cuadrados y raíces', en: 'Squares and square roots' },
    detalle: { es: 'El cuadrado de la suma no es la suma de los cuadrados', en: 'The square of the sum is not the sum of the squares' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Ahora tienes también las fichas <strong>²</strong> y <strong>√</strong>. La ficha ² va <strong>después</strong> de lo que se eleva al cuadrado; la ficha √, <strong>antes</strong>.</p>
        <p>«El cuadrado de la suma de 3 y 4» es <strong>(3 + 4)<sup>2</sup></strong>. «La suma de los cuadrados de 3 y 4» es <strong>3<sup>2</sup> + 4<sup>2</sup></strong>.</p>
        <p>A veces no hay que montar nada: solo elegir entre dos expresiones.</p>`,
      en: `<h2>How it works</h2>
        <p>Now you also have the buttons <strong>²</strong> and <strong>√</strong>. The ² button goes <strong>after</strong> the thing that is squared; the √ button goes <strong>before</strong>.</p>
        <p>“The square of the sum of 3 and 4” is <strong>(3 + 4)<sup>2</sup></strong>. “The sum of the squares of 3 and 4” is <strong>3<sup>2</sup> + 4<sup>2</sup></strong>.</p>
        <p>Sometimes you do not build anything: you only choose between two expressions.</p>`,
    },
  },

  instruccion_montar: { es: 'Monta la expresión con las fichas. No hace falta calcularla.', en: 'Build the expression with the buttons. You do not need to calculate it.' },
  instruccion_elegir: { es: '¿Cuál es la expresión de este enunciado?', en: 'Which expression matches this text?' },
  linea_vacia: { es: 'Toca las fichas para escribir aquí', en: 'Tap the buttons to write here' },
  linea_nombre: { es: 'Tu expresión', en: 'Your expression' },
  quitar: { es: 'Quitar', en: 'Remove' },
  quitar_ultima: { es: 'Quitar la última ficha', en: 'Remove the last one' },
  no_cuenta: { es: 'No cuenta como fallo: arréglalo y comprueba otra vez.', en: 'This is not a mistake yet: fix it and check again.' },
  malformada: {
    vacia: { es: 'Todavía no has puesto ninguna ficha.', en: 'You have not written anything yet.' },
    llena: { es: 'No caben más fichas en la línea.', en: 'Nothing more fits in the line.' },
    falta_numero: { es: 'Falta un número: hay un signo que no tiene un número a cada lado.', en: 'A number is missing: one sign does not have a number on each side.' },
    falta_operador: { es: 'Falta un signo entre dos números, o entre un número y un paréntesis.', en: 'A sign is missing between two numbers, or between a number and a bracket.' },
    sin_cerrar: { es: 'Hay un paréntesis sin cerrar.', en: 'One bracket is not closed.' },
    sin_abrir: { es: 'Hay un paréntesis que se cierra sin haberse abierto.', en: 'One bracket closes, but it was never opened.' },
    parentesis_vacio: { es: 'Hay un paréntesis vacío.', en: 'There is a pair of brackets with nothing inside.' },
    raiz_ambigua: { es: 'Pon un paréntesis para que se vea si el cuadrado va dentro o fuera de la raíz.', en: 'Use brackets to show if the square is inside or outside the root.' },
  },
  has_escrito: { es: 'Has escrito', en: 'You wrote' },
  has_elegido: { es: 'Has elegido', en: 'You chose' },
  la_expresion_es: { es: 'La expresión es', en: 'The expression is' },
  sobraba: {
    es: n => (n === 1 ? 'El paréntesis no hacía falta: sin él vale lo mismo,' : 'Esos paréntesis no hacían falta: sin ellos vale lo mismo,'),
    en: () => 'You did not need those brackets: without them it is the same,',
  },
  faltan: {
    es: lista => `No has usado ${lista.length > 1 ? 'los números' : 'el'} ${enumerar(lista, 'y')}.`,
    en: lista => `You did not use ${enumerar(lista, 'and')}.`,
  },
  repetida: {
    es: lista => `Está bien: sumar varias veces lo mismo es multiplicar. Con ${lista.length > 1 ? 'los números' : 'el'} ${enumerar(lista, 'y')} se escribe más corto:`,
    en: lista => `Correct: adding the same thing several times is multiplying. With ${enumerar(lista, 'and')} it is shorter:`,
  },
  casualidad: {
    es: 'Da el mismo resultado solo por casualidad: con otros números no saldría.',
    en: 'It gives the same result only by chance: with other numbers it would not.',
  },
  error: {
    par_falta: { es: 'Falta un paréntesis: sin él, se hace antes otra operación.', en: 'The brackets are missing: without them, a different operation comes first.' },
    par_sitio: { es: 'Ese paréntesis junta números que aquí no van juntos.', en: 'Those brackets group numbers that do not go together here.' },
    operacion: { es: 'Alguna operación no es la que pide el enunciado.', en: 'One of the operations is not the one in the text.' },
    orden: { es: 'Está al revés: en la resta y en la división el orden importa.', en: 'It is the wrong way round: in subtraction and division the order matters.' },
    cuadrado: { es: 'El cuadrado no está sobre lo que debe: fíjate en qué se eleva al cuadrado.', en: 'The square is not on the right thing: look at what is squared.' },
    raiz: { es: 'La raíz no está sobre lo que debe: fíjate en de qué se hace la raíz.', en: 'The root is not on the right thing: look at what is under the root.' },
  },
};

// ─── Banco de enunciados ─────────────────────────────────────────────────────────
//
// Cada plantilla:
//   id        no se cambia (viaja en el ítem)
//   ej        ejercicio (1, 2 o 3)
//   familia   su estructura: el modelo y los errores típicos están en
//             FAMILIAS (logica.js), con las letras a, b, c, d de `numeros`
//   sobra     true en las del ejercicio 2 donde el paréntesis NO hace falta
//   numeros   rng → { a, b, … }; `logica.js` descarta los que no valgan
//             (repetidos, resultado no natural, un error que dé lo mismo)
//   es, en    el enunciado, función de los números
//   explica   { es, en }: por qué la expresión es esa, con los números
//
// REGLA DE ORO: ningún enunciado admite dos modelos distintos. Los verbales
// siguen la convención de la unidad: sin «todo» / «all» no hay paréntesis.

const cuadrados = [16, 25, 36, 49, 64, 81, 100, 121, 144];
/** Parejas de cuadrados cuya suma también es un cuadrado. */
const ternas = [[9, 16], [16, 9], [36, 64], [64, 36], [25, 144], [144, 25], [81, 144], [144, 81], [64, 225], [225, 64]];
const pareja = rng => { const [a, b] = rng.elegir(ternas); return { a, b }; };

export const PLANTILLAS = [
  // ── Ejercicio 1: dos operaciones, sin paréntesis ───────────────────────────────
  {
    id: 'cuadernos', ej: 1, familia: 'suma_productos',
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 9), c: rng.entero(2, 9), d: rng.entero(2, 9) }),
    es: n => `Compras ${n.a} cuadernos a ${n.b} € cada uno y ${n.c} bolígrafos a ${n.d} € cada uno. ¿Cuánto pagas en total?`,
    en: n => `You buy ${n.a} notebooks at ${n.b} euros each (cada uno) and ${n.c} pens at ${n.d} euros each. How much do you pay altogether?`,
    explica: {
      es: n => `Los cuadernos cuestan ${n.a} · ${n.b} y los bolígrafos, ${n.c} · ${n.d}. Se suman los dos productos:`,
      en: n => `The notebooks cost ${n.a} · ${n.b} and the pens cost ${n.c} · ${n.d}. Add the two products:`,
    },
  },
  {
    id: 'cajas_botes', ej: 1, familia: 'suma_productos',
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.elegir([6, 10, 12, 20, 24]), c: rng.entero(2, 9), d: rng.elegir([8, 15, 25, 30, 50]) }),
    es: n => `En un almacén hay ${n.a} cajas de ${n.b} botes y ${n.c} cajas de ${n.d} botes. ¿Cuántos botes hay?`,
    en: n => `In a shop there are ${n.a} boxes of ${n.b} tins and ${n.c} boxes of ${n.d} tins. How many tins are there?`,
    explica: {
      es: n => `En las primeras cajas hay ${n.a} · ${n.b} botes y en las otras, ${n.c} · ${n.d}. Se suman los dos productos:`,
      en: n => `The first boxes have ${n.a} · ${n.b} tins and the other boxes have ${n.c} · ${n.d}. Add the two products:`,
    },
  },
  {
    id: 'entradas', ej: 1, familia: 'suma_productos',
    numeros: rng => ({ a: rng.entero(2, 6), b: rng.elegir([8, 9, 10, 12, 15]), c: rng.entero(2, 6), d: rng.elegir([3, 4, 5, 6, 7]) }),
    es: n => `Una familia compra ${n.a} entradas de adulto a ${n.b} € y ${n.c} entradas de niño a ${n.d} €. ¿Cuánto cuestan todas las entradas?`,
    en: n => `A family buys ${n.a} adult tickets at ${n.b} euros each and ${n.c} child tickets at ${n.d} euros each. How much do all the tickets cost?`,
    explica: {
      es: n => `Las de adulto cuestan ${n.a} · ${n.b} y las de niño, ${n.c} · ${n.d}. Se suman los dos productos:`,
      en: n => `The adult tickets cost ${n.a} · ${n.b} and the child tickets cost ${n.c} · ${n.d}. Add the two products:`,
    },
  },
  {
    id: 'huevos', ej: 1, familia: 'producto_mas',
    numeros: rng => ({ a: rng.entero(3, 9), b: rng.elegir([6, 10, 12, 24, 30]), c: rng.entero(2, 5) }),
    es: n => `Hay ${n.a} cajas de ${n.b} huevos y, además, ${n.c} huevos sueltos. ¿Cuántos huevos hay?`,
    en: n => `There are ${n.a} boxes of ${n.b} eggs and ${n.c} more eggs that are not in a box. How many eggs are there?`,
    explica: {
      es: n => `En las cajas hay ${n.a} · ${n.b} huevos. Los ${n.c} sueltos se suman después:`,
      en: n => `The boxes have ${n.a} · ${n.b} eggs. Then add the other ${n.c} eggs:`,
    },
  },
  {
    id: 'autobuses', ej: 1, familia: 'producto_mas',
    numeros: rng => ({ a: rng.entero(2, 5), b: rng.elegir([40, 45, 50, 52, 55]), c: rng.entero(6, 12) }),
    es: n => `A una excursión van ${n.a} autobuses con ${n.b} alumnos en cada uno. Además, ${n.c} profesores van en coche. ¿Cuántas personas van a la excursión?`,
    en: n => `${n.a} buses go on a school trip with ${n.b} students in each bus. Also, ${n.c} teachers go by car. How many people go on the trip?`,
    explica: {
      es: n => `En los autobuses van ${n.a} · ${n.b} alumnos. Los ${n.c} profesores se suman después:`,
      en: n => `There are ${n.a} · ${n.b} students in the buses. Then add the ${n.c} teachers:`,
    },
  },
  {
    id: 'libros', ej: 1, familia: 'cantidad_menos_producto',
    numeros: rng => ({ a: rng.elegir([50, 80, 100, 120, 150, 200]), b: rng.entero(2, 6), c: rng.elegir([7, 8, 9, 12, 15, 18]) }),
    es: n => `Marta tiene ${n.a} € y compra ${n.b} libros de ${n.c} € cada uno. ¿Cuánto dinero le queda?`,
    en: n => `Marta has ${n.a} euros and she buys ${n.b} books at ${n.c} euros each. How much money is left (le queda)?`,
    explica: {
      es: n => `Los libros cuestan ${n.b} · ${n.c}. Eso es lo que se resta de los ${n.a} €:`,
      en: n => `The books cost ${n.b} · ${n.c}. Subtract that from the ${n.a} euros:`,
    },
  },
  {
    id: 'sillas', ej: 1, familia: 'cantidad_menos_producto',
    numeros: rng => ({ a: rng.elegir([100, 120, 150, 200, 250]), b: rng.entero(2, 6), c: rng.elegir([8, 10, 12, 15]) }),
    es: n => `En una sala hay ${n.a} sillas. Se retiran ${n.b} filas de ${n.c} sillas. ¿Cuántas sillas quedan?`,
    en: n => `There are ${n.a} chairs in a hall. We take away ${n.b} rows of ${n.c} chairs. How many chairs are left (quedan)?`,
    explica: {
      es: n => `Se retiran ${n.b} · ${n.c} sillas. Eso es lo que se resta de las ${n.a}:`,
      en: n => `We take away ${n.b} · ${n.c} chairs. Subtract that from the ${n.a} chairs:`,
    },
  },
  {
    id: 'frase_menos_por', ej: 1, familia: 'cantidad_menos_producto',
    numeros: rng => ({ a: rng.entero(20, 60), b: rng.entero(2, 9), c: rng.entero(2, 6) }),
    es: n => `«${n.a} menos ${n.b} multiplicado por ${n.c}»`,
    en: n => `“${n.a} minus ${n.b} multiplied by ${n.c}”`,
    explica: {
      es: n => `La frase no dice «todo», así que no hay paréntesis: solo el ${n.b} se multiplica por ${n.c}.`,
      en: n => `The sentence does not say “all”, so there are no brackets: only ${n.b} is multiplied by ${n.c}.`,
    },
  },
  {
    id: 'cine', ej: 1, familia: 'producto_menos',
    numeros: rng => ({ a: rng.entero(8, 15), b: rng.elegir([10, 12, 20, 25]), c: rng.entero(16, 60) }),
    es: n => `Un cine tiene ${n.a} filas de ${n.b} butacas. Hay ${n.c} butacas ocupadas. ¿Cuántas butacas quedan libres?`,
    en: n => `A cinema has ${n.a} rows of ${n.b} seats. ${n.c} seats are taken (ocupadas). How many seats are free?`,
    explica: {
      es: n => `El cine tiene ${n.a} · ${n.b} butacas. A ese producto se le restan las ${n.c} ocupadas:`,
      en: n => `The cinema has ${n.a} · ${n.b} seats. Subtract the ${n.c} taken seats from that product:`,
    },
  },
  {
    id: 'vasos', ej: 1, familia: 'producto_menos',
    numeros: rng => ({ a: rng.entero(3, 9), b: rng.elegir([6, 12, 24, 30]), c: rng.entero(2, 9) }),
    es: n => `Llegan ${n.a} cajas de ${n.b} vasos, pero ${n.c} vasos están rotos. ¿Cuántos vasos se pueden usar?`,
    en: n => `${n.a} boxes of ${n.b} glasses arrive, but ${n.c} glasses are broken (rotos). How many glasses can we use?`,
    explica: {
      es: n => `Llegan ${n.a} · ${n.b} vasos. A ese producto se le restan los ${n.c} rotos:`,
      en: n => `${n.a} · ${n.b} glasses arrive. Subtract the ${n.c} broken glasses from that product:`,
    },
  },
  {
    id: 'tienda', ej: 1, familia: 'cadena',
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.elegir([6, 10, 12, 20, 24]), c: rng.entero(2, 5) }),
    es: n => `Una tienda compra ${n.a} cajas de ${n.b} botes. Cada bote cuesta ${n.c} €. ¿Cuánto paga la tienda?`,
    en: n => `A shop buys ${n.a} boxes of ${n.b} tins. Each tin costs ${n.c} euros. How much does the shop pay?`,
    explica: {
      es: n => `Hay ${n.a} · ${n.b} botes, y cada uno cuesta ${n.c} €: se multiplica todo.`,
      en: n => `There are ${n.a} · ${n.b} tins, and each tin costs ${n.c} euros: multiply everything.`,
    },
  },
  {
    id: 'excursion_clases', ej: 1, familia: 'cadena',
    numeros: rng => ({ a: rng.entero(3, 8), b: rng.elegir([20, 22, 24, 25, 28, 30]), c: rng.entero(2, 9) }),
    es: n => `Un colegio tiene ${n.a} clases, con ${n.b} alumnos en cada clase. Cada alumno paga ${n.c} € para una excursión. ¿Cuánto dinero se junta?`,
    en: n => `A school has ${n.a} classes, with ${n.b} students in each class. Each student pays ${n.c} euros for a trip. How much money is there altogether?`,
    explica: {
      es: n => `Hay ${n.a} · ${n.b} alumnos, y cada uno paga ${n.c} €: se multiplica todo.`,
      en: n => `There are ${n.a} · ${n.b} students, and each student pays ${n.c} euros: multiply everything.`,
    },
  },
  {
    id: 'caramelos_bolsas', ej: 1, familia: 'por_entre_por',
    numeros: rng => ({ a: rng.entero(2, 6), b: rng.elegir([12, 20, 24, 30, 36, 40]), c: rng.elegir([4, 5, 8, 10]), d: rng.entero(2, 3) }),
    es: n => `Hay ${n.a} cajas de ${n.b} caramelos. Con todos los caramelos se hacen bolsas de ${n.c} caramelos, y cada bolsa se vende a ${n.d} €. ¿Cuánto dinero se saca?`,
    en: n => `There are ${n.a} boxes of ${n.b} sweets. All the sweets go into bags of ${n.c} sweets, and each bag costs ${n.d} euros. How much money do the bags cost altogether?`,
    explica: {
      es: n => `Hay ${n.a} · ${n.b} caramelos; divididos entre ${n.c} dan las bolsas, y cada bolsa vale ${n.d} €. Las operaciones se hacen de izquierda a derecha:`,
      en: n => `There are ${n.a} · ${n.b} sweets; divide by ${n.c} to get the bags, and each bag costs ${n.d} euros. Work from left to right:`,
    },
  },
  {
    id: 'feria', ej: 1, familia: 'mas_producto',
    numeros: rng => ({ a: rng.entero(5, 12), b: rng.entero(3, 8), c: rng.entero(2, 4) }),
    es: n => `La entrada a la feria cuesta ${n.a} € y cada atracción, ${n.c} €. Lucía paga la entrada y monta en ${n.b} atracciones. ¿Cuánto gasta?`,
    en: n => `The ticket for the fair costs ${n.a} euros and each ride (atracción) costs ${n.c} euros. Lucía pays for the ticket and goes on ${n.b} rides. How much does she spend?`,
    explica: {
      es: n => `Las atracciones cuestan ${n.b} · ${n.c}. La entrada (${n.a} €) se paga una sola vez y se suma:`,
      en: n => `The rides cost ${n.b} · ${n.c}. She pays for the ticket (${n.a} euros) only once, so add it:`,
    },
  },
  {
    id: 'frase_mas_por', ej: 1, familia: 'mas_producto',
    numeros: rng => ({ a: rng.entero(2, 20), b: rng.entero(2, 9), c: rng.entero(2, 9) }),
    es: n => `«${n.a} más ${n.b} multiplicado por ${n.c}»`,
    en: n => `“${n.a} plus ${n.b} multiplied by ${n.c}”`,
    explica: {
      es: n => `La frase no dice «todo», así que no hay paréntesis: solo el ${n.b} se multiplica por ${n.c}.`,
      en: n => `The sentence does not say “all”, so there are no brackets: only ${n.b} is multiplied by ${n.c}.`,
    },
  },
  {
    id: 'frase_mas_entre', ej: 1, familia: 'mas_cociente',
    numeros: rng => { const c = rng.entero(2, 9); return { a: rng.entero(2, 20), b: c * rng.entero(2, 9), c }; },
    es: n => `«${n.a} más ${n.b} dividido entre ${n.c}»`,
    en: n => `“${n.a} plus ${n.b} divided by ${n.c}”`,
    explica: {
      es: n => `La frase no dice «todo», así que no hay paréntesis: solo el ${n.b} se divide entre ${n.c}.`,
      en: n => `The sentence does not say “all”, so there are no brackets: only ${n.b} is divided by ${n.c}.`,
    },
  },

  // ── Ejercicio 2: el paréntesis es imprescindible ───────────────────────────────
  {
    id: 'pizza', ej: 2, familia: 'reparto',
    numeros: rng => ({ a: rng.entero(8, 30), b: rng.entero(3, 15), c: rng.entero(2, 6) }),
    es: n => `${n.c} amigos compran pizzas por ${n.a} € y bebidas por ${n.b} €. Lo pagan todo a partes iguales. ¿Cuánto paga cada uno?`,
    en: n => `${n.c} friends buy pizzas for ${n.a} euros and drinks for ${n.b} euros. They share the cost equally (a partes iguales). How much does each friend pay?`,
    explica: {
      es: n => `Primero se junta lo que cuesta todo, ${n.a} + ${n.b}, y ese total se reparte entre ${n.c}. El paréntesis hace que la suma vaya antes:`,
      en: n => `First find the total cost, ${n.a} + ${n.b}, and then share that total among ${n.c}. The brackets make the addition come first:`,
    },
  },
  {
    id: 'cromos', ej: 2, familia: 'reparto',
    numeros: rng => ({ a: rng.entero(12, 40), b: rng.entero(8, 30), c: rng.entero(2, 6) }),
    es: n => `Ana tiene ${n.a} cromos y Luis tiene ${n.b}. Los juntan todos y los guardan en ${n.c} sobres, con los mismos cromos en cada sobre. ¿Cuántos cromos hay en cada sobre?`,
    en: n => `Ana has ${n.a} stickers and Luis has ${n.b}. They put all the stickers together in ${n.c} envelopes, with the same number in each envelope. How many stickers are there in each envelope?`,
    explica: {
      es: n => `Primero se juntan los cromos, ${n.a} + ${n.b}, y ese total se reparte en ${n.c} sobres. El paréntesis hace que la suma vaya antes:`,
      en: n => `First put the stickers together, ${n.a} + ${n.b}, and then share that total into ${n.c} envelopes. The brackets make the addition come first:`,
    },
  },
  {
    id: 'frase_todo_entre', ej: 2, familia: 'reparto',
    numeros: rng => ({ a: rng.entero(2, 30), b: rng.entero(2, 30), c: rng.entero(2, 9) }),
    es: n => `«${n.a} más ${n.b}, todo dividido entre ${n.c}»`,
    en: n => `“${n.a} plus ${n.b}, all divided by ${n.c}”`,
    explica: {
      es: n => `«Todo» obliga al paréntesis: se divide la suma entera, ${n.a} + ${n.b}, y no solo el ${n.b}.`,
      en: n => `“All” means brackets: we divide the whole sum, ${n.a} + ${n.b}, not only ${n.b}.`,
    },
  },
  {
    id: 'menu', ej: 2, familia: 'todo_por',
    numeros: rng => ({ a: rng.entero(8, 15), b: rng.entero(2, 4), c: rng.entero(3, 7) }),
    es: n => `Un menú cuesta ${n.a} € y una bebida, ${n.b} €. Comen ${n.c} personas, y cada una pide un menú y una bebida. ¿Cuánto pagan en total?`,
    en: n => `A set meal costs ${n.a} euros and a drink costs ${n.b} euros. ${n.c} people eat, and each person has one set meal and one drink. How much do they pay altogether?`,
    explica: {
      es: n => `Cada persona gasta ${n.a} + ${n.b}, y son ${n.c} personas: se multiplica la suma entera.`,
      en: n => `Each person spends ${n.a} + ${n.b}, and there are ${n.c} people: multiply the whole sum.`,
    },
  },
  {
    id: 'correr', ej: 2, familia: 'todo_por',
    numeros: rng => ({ a: rng.elegir([10, 15, 20, 25, 30]), b: rng.elegir([12, 18, 35, 40, 45]), c: rng.entero(3, 7) }),
    es: n => `Cada día, Pablo corre ${n.a} minutos por la mañana y ${n.b} minutos por la tarde. ¿Cuántos minutos corre en ${n.c} días?`,
    en: n => `Every day, Pablo runs for ${n.a} minutes in the morning and ${n.b} minutes in the afternoon. How many minutes does he run in ${n.c} days?`,
    explica: {
      es: n => `Cada día corre ${n.a} + ${n.b} minutos, y son ${n.c} días: se multiplica la suma entera.`,
      en: n => `Each day he runs for ${n.a} + ${n.b} minutes, and there are ${n.c} days: multiply the whole sum.`,
    },
  },
  {
    id: 'frase_todo_por', ej: 2, familia: 'todo_por',
    numeros: rng => ({ a: rng.entero(2, 12), b: rng.entero(2, 12), c: rng.entero(2, 9) }),
    es: n => `«${n.a} más ${n.b}, todo multiplicado por ${n.c}»`,
    en: n => `“${n.a} plus ${n.b}, all multiplied by ${n.c}”`,
    explica: {
      es: n => `«Todo» obliga al paréntesis: se multiplica la suma entera, ${n.a} + ${n.b}, y no solo el ${n.b}.`,
      en: n => `“All” means brackets: we multiply the whole sum, ${n.a} + ${n.b}, not only ${n.b}.`,
    },
  },
  {
    id: 'libro_estuche', ej: 2, familia: 'menos_suma',
    numeros: rng => ({ a: rng.elegir([30, 40, 50]), b: rng.entero(8, 20), c: rng.entero(3, 7) }),
    es: n => `Tienes ${n.a} €. Compras un libro de ${n.b} € y un estuche de ${n.c} €. ¿Cuánto dinero te queda?`,
    en: n => `You have ${n.a} euros. You buy a book for ${n.b} euros and a pencil case for ${n.c} euros. How much money is left (te queda)?`,
    explica: {
      es: n => `Gastas ${n.b} + ${n.c}, y eso es lo que se resta de ${n.a}. (Restar una cosa y después la otra también vale.)`,
      en: n => `You spend ${n.b} + ${n.c}, and you subtract that from ${n.a}. (Subtracting one thing and then the other is also correct.)`,
    },
  },
  {
    id: 'frase_menos_suma', ej: 2, familia: 'menos_suma',
    numeros: rng => ({ a: rng.entero(20, 50), b: rng.entero(2, 9), c: rng.entero(2, 9) }),
    es: n => `«${n.a} menos la suma de ${n.b} y ${n.c}»`,
    en: n => `“${n.a} minus the sum of ${n.b} and ${n.c}”`,
    explica: {
      es: n => `Se resta la suma entera, ${n.b} + ${n.c}: sin paréntesis, el ${n.c} se sumaría en vez de restarse.`,
      en: n => `We subtract the whole sum, ${n.b} + ${n.c}: without brackets, ${n.c} would be added, not subtracted.`,
    },
  },
  {
    id: 'camisetas', ej: 2, familia: 'resta_por',
    numeros: rng => ({ a: rng.elegir([12, 15, 18, 20, 25]), b: rng.entero(2, 5), c: rng.entero(2, 6) }),
    es: n => `Una camiseta cuesta ${n.a} €, pero hoy cada camiseta tiene ${n.b} € de descuento. Compras ${n.c} camisetas. ¿Cuánto pagas?`,
    en: n => `A T-shirt costs ${n.a} euros, but today each T-shirt is ${n.b} euros cheaper (más barata). You buy ${n.c} T-shirts. How much do you pay?`,
    explica: {
      es: n => `Hoy cada camiseta cuesta ${n.a} − ${n.b}, y compras ${n.c}: se multiplica la resta entera.`,
      en: n => `Today each T-shirt costs ${n.a} − ${n.b}, and you buy ${n.c}: multiply the whole subtraction.`,
    },
  },
  {
    id: 'frase_resta_por', ej: 2, familia: 'resta_por',
    numeros: rng => ({ a: rng.entero(8, 20), b: rng.entero(2, 7), c: rng.entero(2, 9) }),
    es: n => `«${n.a} menos ${n.b}, todo multiplicado por ${n.c}»`,
    en: n => `“${n.a} minus ${n.b}, all multiplied by ${n.c}”`,
    explica: {
      es: n => `«Todo» obliga al paréntesis: se multiplica la resta entera, ${n.a} − ${n.b}, y no solo el ${n.b}.`,
      en: n => `“All” means brackets: we multiply the whole subtraction, ${n.a} − ${n.b}, not only ${n.b}.`,
    },
  },
  {
    id: 'excursion_precio', ej: 2, familia: 'entre_suma',
    numeros: rng => { const b = rng.entero(2, 5), c = rng.entero(2, 7); return { a: (b + c) * rng.entero(5, 15), b, c }; },
    es: n => `Una excursión cuesta ${n.a} € en total. Van ${n.b} adultos y ${n.c} niños, y todos pagan lo mismo. ¿Cuánto paga cada persona?`,
    en: n => `A trip costs ${n.a} euros altogether. ${n.b} adults and ${n.c} children go, and everybody pays the same. How much does each person pay?`,
    explica: {
      es: n => `Primero hay que saber cuántas personas van, ${n.b} + ${n.c}, y los ${n.a} € se dividen entre todas. El paréntesis hace que la suma vaya antes:`,
      en: n => `First find how many people go, ${n.b} + ${n.c}, and then divide the ${n.a} euros by that number. The brackets make the addition come first:`,
    },
  },
  {
    id: 'caramelos_reparto', ej: 2, familia: 'entre_suma',
    numeros: rng => { const b = rng.entero(2, 6), c = rng.entero(2, 6); return { a: (b + c) * rng.entero(3, 9), b, c }; },
    es: n => `Hay ${n.a} caramelos para repartir, a partes iguales, entre ${n.b} niñas y ${n.c} niños. ¿Cuántos caramelos recibe cada uno?`,
    en: n => `There are ${n.a} sweets to share equally (a partes iguales) among ${n.b} girls and ${n.c} boys. How many sweets does each child get?`,
    explica: {
      es: n => `Primero hay que saber cuántos son, ${n.b} + ${n.c}, y los ${n.a} caramelos se dividen entre todos. El paréntesis hace que la suma vaya antes:`,
      en: n => `First find how many children there are, ${n.b} + ${n.c}, and then divide the ${n.a} sweets by that number. The brackets make the addition come first:`,
    },
  },
  {
    id: 'lapices', ej: 2, familia: 'cajas_y_reparto',
    numeros: rng => ({ a: rng.entero(3, 8), b: rng.elegir([10, 12, 20, 24]), c: rng.entero(2, 15), d: rng.entero(2, 6) }),
    es: n => `Hay ${n.a} cajas de ${n.b} lápices y, además, ${n.c} lápices sueltos. Todos los lápices se reparten, a partes iguales, entre ${n.d} clases. ¿Cuántos lápices recibe cada clase?`,
    en: n => `There are ${n.a} boxes of ${n.b} pencils and ${n.c} more pencils that are not in a box. We share all the pencils equally (a partes iguales) among ${n.d} classes. How many pencils does each class get?`,
    explica: {
      es: n => `Primero se cuentan todos los lápices, ${n.a} · ${n.b} + ${n.c}, y ese total se divide entre ${n.d}. El paréntesis junta el total:`,
      en: n => `First count all the pencils, ${n.a} · ${n.b} + ${n.c}, and then divide that total by ${n.d}. The brackets keep the total together:`,
    },
  },
  {
    id: 'frase_resta_entre', ej: 2, familia: 'resta_entre',
    numeros: rng => { const b = rng.entero(2, 12), c = rng.entero(2, 9); return { a: b + c * rng.entero(2, 9), b, c }; },
    es: n => `«${n.a} menos ${n.b}, todo dividido entre ${n.c}»`,
    en: n => `“${n.a} minus ${n.b}, all divided by ${n.c}”`,
    explica: {
      es: n => `«Todo» obliga al paréntesis: se divide la resta entera, ${n.a} − ${n.b}, y no solo el ${n.b}.`,
      en: n => `“All” means brackets: we divide the whole subtraction, ${n.a} − ${n.b}, not only ${n.b}.`,
    },
  },
  {
    id: 'galletas', ej: 2, familia: 'resta_entre',
    numeros: rng => { const b = rng.entero(2, 6), c = rng.entero(2, 6); return { a: b + c * rng.entero(3, 9), b, c }; },
    es: n => `Hay ${n.a} galletas, pero ${n.b} se rompen. Las demás se reparten, a partes iguales, entre ${n.c} amigos. ¿Cuántas galletas recibe cada uno?`,
    en: n => `There are ${n.a} biscuits, but ${n.b} of them break. ${n.c} friends share the other biscuits equally (a partes iguales). How many biscuits does each friend get?`,
    explica: {
      es: n => `Primero se quitan las rotas, ${n.a} − ${n.b}, y lo que queda se divide entre ${n.c}. El paréntesis hace que la resta vaya antes:`,
      en: n => `First take away the broken biscuits, ${n.a} − ${n.b}, and then divide the rest by ${n.c}. The brackets make the subtraction come first:`,
    },
  },
  // Ejercicio 2, variante: el paréntesis NO hace falta (se puede poner o no).
  {
    id: 'frase_mas_producto', ej: 2, sobra: true, familia: 'mas_producto',
    numeros: rng => ({ a: rng.entero(2, 20), b: rng.entero(2, 9), c: rng.entero(2, 9) }),
    es: n => `«${n.a} más el producto de ${n.b} y ${n.c}»`,
    en: n => `“${n.a} plus the product of ${n.b} and ${n.c}”`,
    explica: {
      es: n => `El producto ${n.b} · ${n.c} ya se hace antes que la suma: no hace falta paréntesis.`,
      en: n => `The product ${n.b} · ${n.c} already comes before the addition: you do not need brackets.`,
    },
  },
  {
    id: 'frase_menos_producto', ej: 2, sobra: true, familia: 'cantidad_menos_producto',
    numeros: rng => { const b = rng.entero(2, 6), c = rng.entero(2, 9); return { a: b * c + rng.entero(1, 30), b, c }; },
    es: n => `«${n.a} menos el producto de ${n.b} y ${n.c}»`,
    en: n => `“${n.a} minus the product of ${n.b} and ${n.c}”`,
    explica: {
      es: n => `El producto ${n.b} · ${n.c} ya se hace antes que la resta: no hace falta paréntesis.`,
      en: n => `The product ${n.b} · ${n.c} already comes before the subtraction: you do not need brackets.`,
    },
  },
  {
    id: 'frase_suma_productos', ej: 2, sobra: true, familia: 'suma_productos',
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 9), c: rng.entero(2, 9), d: rng.entero(2, 9) }),
    es: n => `«Suma el producto de ${n.a} y ${n.b} con el producto de ${n.c} y ${n.d}»`,
    en: n => `“Add the product of ${n.a} and ${n.b} to the product of ${n.c} and ${n.d}”`,
    explica: {
      es: n => `Los dos productos, ${n.a} · ${n.b} y ${n.c} · ${n.d}, ya se hacen antes que la suma: no hace falta paréntesis.`,
      en: n => `The two products, ${n.a} · ${n.b} and ${n.c} · ${n.d}, already come before the addition: you do not need brackets.`,
    },
  },
  {
    id: 'frase_mas_cociente', ej: 2, sobra: true, familia: 'mas_cociente',
    numeros: rng => { const c = rng.entero(2, 9); return { a: rng.entero(2, 20), b: c * rng.entero(2, 9), c }; },
    es: n => `«Suma ${n.a} al resultado de dividir ${n.b} entre ${n.c}»`,
    en: n => `“Add ${n.a} to the result of ${n.b} divided by ${n.c}”`,
    explica: {
      es: n => `La división de ${n.b} entre ${n.c} ya se hace antes que la suma: no hace falta paréntesis.`,
      en: n => `The division of ${n.b} by ${n.c} already comes before the addition: you do not need brackets.`,
    },
  },
  {
    id: 'entradas_cambio', ej: 2, sobra: true, familia: 'cantidad_menos_producto',
    numeros: rng => ({ a: rng.elegir([50, 60, 80, 100]), b: rng.entero(2, 5), c: rng.elegir([6, 7, 8, 9, 12]) }),
    es: n => `Tienes ${n.a} €. Compras ${n.b} entradas de ${n.c} € cada una. ¿Cuánto dinero te queda?`,
    en: n => `You have ${n.a} euros. You buy ${n.b} tickets at ${n.c} euros each. How much money is left (te queda)?`,
    explica: {
      es: n => `Las entradas cuestan ${n.b} · ${n.c}, y ese producto ya se hace antes que la resta: no hace falta paréntesis.`,
      en: n => `The tickets cost ${n.b} · ${n.c}, and that product already comes before the subtraction: you do not need brackets.`,
    },
  },

  // ── Ejercicio 3: cuadrados y raíces ────────────────────────────────────────────
  {
    id: 'frase_cuadrado_suma', ej: 3, familia: 'cuadrado_suma',
    numeros: rng => ({ a: rng.entero(2, 12), b: rng.entero(2, 12) }),
    es: n => `«El cuadrado de la suma de ${n.a} y ${n.b}»`,
    en: n => `“The square of the sum of ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se suma, ${n.a} + ${n.b}, y lo que se eleva al cuadrado es esa suma entera:`,
      en: n => `First add, ${n.a} + ${n.b}, and then square that whole sum:`,
    },
  },
  {
    id: 'patio', ej: 3, familia: 'cuadrado_suma',
    numeros: rng => ({ a: rng.entero(5, 15), b: rng.entero(2, 6) }),
    es: n => `El lado de un patio cuadrado mide ${n.a} m. Lo amplían y ahora cada lado mide ${n.b} m más. ¿Qué área tiene el patio nuevo?`,
    en: n => `The side of a square playground is ${n.a} m long. They make it bigger and now each side is ${n.b} m longer. What is the area of the new playground?`,
    explica: {
      es: n => `El lado nuevo mide ${n.a} + ${n.b}, y el área de un cuadrado es el lado al cuadrado: se eleva la suma entera.`,
      en: n => `The new side is ${n.a} + ${n.b}, and the area of a square is the side squared: square the whole sum.`,
    },
  },
  {
    id: 'frase_suma_cuadrados', ej: 3, familia: 'suma_cuadrados',
    numeros: rng => ({ a: rng.entero(2, 12), b: rng.entero(2, 12) }),
    es: n => `«La suma de los cuadrados de ${n.a} y ${n.b}»`,
    en: n => `“The sum of the squares of ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se eleva al cuadrado cada número, ${n.a} y ${n.b}, y después se suman los dos cuadrados:`,
      en: n => `First square each number, ${n.a} and ${n.b}, and then add the two squares:`,
    },
  },
  {
    id: 'parcelas', ej: 3, familia: 'suma_cuadrados',
    numeros: rng => ({ a: rng.entero(3, 12), b: rng.entero(3, 12) }),
    es: n => `Hay dos parcelas cuadradas: una de ${n.a} m de lado y otra de ${n.b} m de lado. ¿Cuánta área tienen entre las dos?`,
    en: n => `There are two square fields: one has sides of ${n.a} m and the other has sides of ${n.b} m. What is the area of the two fields together?`,
    explica: {
      es: n => `Cada parcela tiene de área su lado al cuadrado. Se suman las dos áreas:`,
      en: n => `The area of each field is its side squared. Add the two areas:`,
    },
  },
  {
    id: 'frase_raiz_suma', ej: 3, familia: 'raiz_suma',
    numeros: pareja,
    es: n => `«La raíz cuadrada de la suma de ${n.a} y ${n.b}»`,
    en: n => `“The square root of the sum of ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se suma, ${n.a} + ${n.b}, y la raíz es de esa suma entera: hace falta el paréntesis.`,
      en: n => `First add, ${n.a} + ${n.b}, and then take the root of that whole sum: you need the brackets.`,
    },
  },
  {
    id: 'baldosas_cuadrado', ej: 3, familia: 'raiz_suma',
    numeros: pareja,
    es: n => `Con ${n.a} baldosas y otras ${n.b} baldosas se forma un solo cuadrado grande, sin que sobre ninguna. ¿Cuántas baldosas hay en cada lado del cuadrado?`,
    en: n => `With ${n.a} tiles and ${n.b} more tiles we make one big square, and we use all the tiles. How many tiles are there on each side of the square?`,
    explica: {
      es: n => `En total hay ${n.a} + ${n.b} baldosas, y el lado del cuadrado es la raíz de ese total: la raíz es de la suma entera.`,
      en: n => `There are ${n.a} + ${n.b} tiles altogether, and the side of the square is the root of that total: take the root of the whole sum.`,
    },
  },
  {
    id: 'frase_suma_raices', ej: 3, familia: 'suma_raices',
    numeros: rng => (rng.azar() < 0.5 ? pareja(rng) : { a: rng.elegir(cuadrados), b: rng.elegir(cuadrados) }),
    es: n => `«La suma de las raíces cuadradas de ${n.a} y ${n.b}»`,
    en: n => `“The sum of the square roots of ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se hace la raíz de cada número, ${n.a} y ${n.b}, y después se suman las dos raíces:`,
      en: n => `First take the root of each number, ${n.a} and ${n.b}, and then add the two roots:`,
    },
  },
  {
    id: 'frase_por_cuadrado', ej: 3, familia: 'por_cuadrado',
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 10) }),
    es: n => `«${n.a} multiplicado por el cuadrado de ${n.b}»`,
    en: n => `“${n.a} multiplied by the square of ${n.b}”`,
    explica: {
      es: n => `Solo el ${n.b} se eleva al cuadrado; el ${n.a} multiplica después. La potencia ya se hace antes que el producto:`,
      en: n => `Only ${n.b} is squared; then multiply by ${n.a}. The power already comes before the multiplication:`,
    },
  },
  {
    id: 'suelo', ej: 3, familia: 'por_cuadrado',
    numeros: rng => ({ a: rng.elegir([6, 8, 10, 12, 20]), b: rng.entero(2, 5) }),
    es: n => `Un suelo se cubre con ${n.a} baldosas cuadradas. Cada baldosa mide ${n.b} dm de lado. ¿Cuántos dm² cubren entre todas?`,
    en: n => `${n.a} square tiles cover a floor. Each tile has sides of ${n.b} dm. How many dm² do all the tiles cover?`,
    explica: {
      es: n => `Cada baldosa tiene de área su lado al cuadrado, y hay ${n.a} baldosas: solo el ${n.b} se eleva al cuadrado.`,
      en: n => `The area of each tile is its side squared, and there are ${n.a} tiles: only ${n.b} is squared.`,
    },
  },
  {
    id: 'frase_cuadrado_producto', ej: 3, familia: 'cuadrado_producto',
    numeros: rng => ({ a: rng.entero(2, 6), b: rng.entero(2, 6) }),
    es: n => `«El cuadrado del producto de ${n.a} y ${n.b}»`,
    en: n => `“The square of the product of ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se multiplica, ${n.a} · ${n.b}, y lo que se eleva al cuadrado es ese producto entero:`,
      en: n => `First multiply, ${n.a} · ${n.b}, and then square that whole product:`,
    },
  },
  {
    id: 'lados', ej: 3, familia: 'por_raiz',
    numeros: rng => ({ a: rng.entero(2, 4), b: rng.elegir([25, 36, 49, 64, 81, 100, 144]) }),
    es: n => `Un cuadrado tiene ${n.b} cm² de área. ¿Cuánto miden ${n.a} de sus lados, puestos uno detrás de otro?`,
    en: n => `A square has an area of ${n.b} cm². How long are ${n.a} of its sides, one after the other?`,
    explica: {
      es: n => `El lado es la raíz del área, y son ${n.a} lados: la raíz es solo del ${n.b}.`,
      en: n => `The side is the root of the area, and there are ${n.a} sides: the root is only for ${n.b}.`,
    },
  },
  {
    id: 'cuerda', ej: 3, familia: 'raiz_menos',
    numeros: rng => ({ a: rng.elegir([64, 81, 100, 121, 144, 196, 225]), b: rng.entero(2, 6) }),
    es: n => `Una cuerda mide lo mismo que el lado de un cuadrado de ${n.a} cm² de área. Se le cortan ${n.b} cm. ¿Cuánto mide ahora la cuerda?`,
    en: n => `A rope is as long as the side of a square with an area of ${n.a} cm². We cut ${n.b} cm off the rope. How long is the rope now?`,
    explica: {
      es: n => `La cuerda mide la raíz del área, y a esa raíz se le restan ${n.b} cm: la raíz es solo del ${n.a}.`,
      en: n => `The rope is as long as the root of the area, and then we subtract ${n.b} cm: the root is only for ${n.a}.`,
    },
  },
  {
    id: 'frase_cuadrado_diferencia', ej: 3, familia: 'cuadrado_diferencia',
    numeros: rng => { const b = rng.entero(2, 9); return { a: b + rng.entero(2, 9), b }; },
    es: n => `«El cuadrado de la diferencia de ${n.a} y ${n.b}»`,
    en: n => `“The square of the difference between ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se resta, ${n.a} − ${n.b}, y lo que se eleva al cuadrado es esa diferencia entera:`,
      en: n => `First subtract, ${n.a} − ${n.b}, and then square that whole difference:`,
    },
  },
  {
    id: 'frase_diferencia_cuadrados', ej: 3, familia: 'diferencia_cuadrados',
    numeros: rng => { const b = rng.entero(2, 9); return { a: b + rng.entero(2, 9), b }; },
    es: n => `«La diferencia de los cuadrados de ${n.a} y ${n.b}»`,
    en: n => `“The difference between the squares of ${n.a} and ${n.b}”`,
    explica: {
      es: n => `Primero se eleva al cuadrado cada número, ${n.a} y ${n.b}, y después se restan los dos cuadrados:`,
      en: n => `First square each number, ${n.a} and ${n.b}, and then subtract the two squares:`,
    },
  },
  {
    id: 'salon', ej: 3, familia: 'cuadrado_menos',
    numeros: rng => ({ a: rng.entero(8, 20), b: rng.entero(2, 7) }),
    es: n => `En un salón hay ${n.a} filas de ${n.a} sillas. De ellas, ${n.b} sillas están rotas. ¿Cuántas sillas se pueden usar?`,
    en: n => `In a hall there are ${n.a} rows of ${n.a} chairs. ${n.b} of the chairs are broken (rotas). How many chairs can we use?`,
    explica: {
      es: n => `Hay ${n.a} · ${n.a} sillas, que es el cuadrado de ${n.a}, y a ese cuadrado se le restan las ${n.b} rotas:`,
      en: n => `There are ${n.a} · ${n.a} chairs, which is ${n.a} squared, and then we subtract the ${n.b} broken chairs:`,
    },
  },
];
