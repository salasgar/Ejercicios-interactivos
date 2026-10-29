// «La fracción de una cantidad»: textos propios, siempre { es, en }. Las frases de cada
// contexto se construyen con los números del ítem; la fracción se pinta con raya
// (`htmlFraccion`), nunca con barra. Producto con «·», división con «:».
//
// Vocabulario de la unidad 4: la palabra no matemática que decide la respuesta lleva su
// aclaración entre paréntesis en el texto inglés (tank (depósito), felt-tip pens
// (rotuladores)…). Las fracciones de los enunciados en inglés se pintan con raya y se leen
// con ordinales («three fifths») en la introducción.

import { fraccion, htmlFraccion } from '../_comun/fracciones.js';
import { CONTEXTOS, ESCENARIOS, F } from './logica.js';

const fr = (n, d) => htmlFraccion(fraccion(n, d));
const frItem = x => fr(x.n, x.d);
const cuenta = c => `<span class="cuenta">${c}</span>`;

/** «T : d · n = r» (o «T : d = r» si el numerador es 1), para el paso a paso. */
export const cuentaDe = (total, n, d) => (n === 1 ? `${total} : ${d} = ${total / d}` : `${total} : ${d} · ${n} = ${(total / d) * n}`);

// ─── Ejercicio 2: los contextos ────────────────────────────────────────────────

/** Texto y pregunta de cada contexto del ejercicio 2, en los dos idiomas (T = total, F = la fracción en HTML). */
export const FRASES = {
  deposito: {
    es: { texto: (T, F) => `Un depósito de coche tiene ${T} litros de capacidad y está lleno hasta ${F} de su capacidad.`, pregunta: () => '¿Cuántos litros hay en el depósito?' },
    en: { texto: (T, F) => `A car tank (depósito) holds ${T} litres. It is ${F} full.`, pregunta: () => 'How many litres are in the tank?' },
  },
  garrafa: {
    es: { texto: (T, F) => `Una garrafa tiene ${T} litros de agua y se han usado ${F} de esa agua.`, pregunta: () => '¿Cuántos litros se han usado?' },
    en: { texto: (T, F) => `A large water container (garrafa) has ${T} litres of water and ${F} of the water has been used.`, pregunta: () => 'How many litres have been used?' },
  },
  botella: {
    es: { texto: (T, F) => `Una botella de ${T} mililitros está llena hasta ${F} de su capacidad.`, pregunta: () => '¿Cuántos mililitros hay?' },
    en: { texto: (T, F) => `A bottle holds ${T} millilitres. It is ${F} full.`, pregunta: () => 'How many millilitres are in it?' },
  },
  clase: {
    es: { texto: (T, F) => `En una clase de ${T} alumnos, ${F} de los alumnos van al instituto en bici.`, pregunta: () => '¿Cuántos alumnos van en bici?' },
    en: { texto: (T, F) => `In a class of ${T} students, ${F} of the students ride a bike (van en bici) to school.`, pregunta: () => 'How many students ride a bike?' },
  },
  instituto: {
    es: { texto: (T, F) => `Un instituto tiene ${T} alumnos y ${F} de ellos van a la excursión de fin de curso.`, pregunta: () => '¿Cuántos alumnos van a la excursión?' },
    en: { texto: (T, F) => `A school has ${T} students and ${F} of them go on the end-of-year trip (excursión).`, pregunta: () => 'How many students go on the trip?' },
  },
  pizza: {
    es: { texto: (T, F) => `Una pizza tiene ${T} trozos iguales y Marta se come ${F} de la pizza.`, pregunta: () => '¿Cuántos trozos se come?' },
    en: { texto: (T, F) => `A pizza has ${T} equal slices (trozos). Marta eats ${F} of the pizza.`, pregunta: () => 'How many slices does she eat?' },
  },
  ahorro: {
    es: { texto: (T, F) => `Una familia ha ahorrado ${T} € para un viaje y ya ha gastado ${F} de ese dinero.`, pregunta: () => '¿Cuántos euros han gastado?' },
    en: { texto: (T, F) => `A family has saved €${T} for a trip and has already spent ${F} of that money.`, pregunta: () => 'How many euros have they spent?' },
  },
  bici: {
    es: { texto: (T, F) => `Una ciclista tiene que recorrer ${T} km y ya ha hecho ${F} del recorrido.`, pregunta: () => '¿Cuántos kilómetros ha hecho?' },
    en: { texto: (T, F) => `A cyclist has to ride ${T} km and has already done ${F} of the route (recorrido).`, pregunta: () => 'How many kilometres has she done?' },
  },
  coche: {
    es: { texto: (T, F) => `Un viaje en coche es de ${T} km y ya hemos hecho ${F} del camino.`, pregunta: () => '¿Cuántos kilómetros hemos hecho?' },
    en: { texto: (T, F) => `A car journey is ${T} km long and we have already done ${F} of the way (camino).`, pregunta: () => 'How many kilometres have we done?' },
  },
  hora: {
    es: { texto: () => 'Una hora tiene 60 minutos.', pregunta: (T, F) => `¿Cuántos minutos son ${F} de una hora?` },
    en: { texto: () => 'One hour has 60 minutes.', pregunta: (T, F) => `How many minutes are ${F} of an hour?` },
  },
};

// ─── Ejercicio 3: los grupos ───────────────────────────────────────────────────

/** Texto y pregunta de cada grupo (p = la parte, t = el total, o = la otra parte). */
export const GRUPOS_TX = {
  andando: {
    es: { texto: (p, t) => `${p} de los ${t} alumnos de una clase van andando al instituto.`, pregunta: () => '¿Qué fracción de la clase va andando?' },
    en: { texto: (p, t) => `${p} of the ${t} students in a class walk to school.`, pregunta: () => 'What fraction of the class walks to school?' },
  },
  gafas: {
    es: { texto: (p, t) => `${p} de los ${t} alumnos de una clase llevan gafas.`, pregunta: () => '¿Qué fracción de la clase lleva gafas?' },
    en: { texto: (p, t) => `${p} of the ${t} students in a class wear glasses (gafas).`, pregunta: () => 'What fraction of the class wears glasses?' },
  },
  partidos: {
    es: { texto: (p, t) => `Un equipo ha jugado ${t} partidos y ha ganado ${p}.`, pregunta: () => '¿Qué fracción de los partidos ha ganado?' },
    en: { texto: (p, t) => `A team has played ${t} matches and has won ${p}.`, pregunta: () => 'What fraction of the matches has it won?' },
  },
  pegatinas: {
    es: { texto: (p, t) => `Un álbum tiene ${t} huecos y ya hay pegadas ${p} pegatinas.`, pregunta: () => '¿Qué fracción del álbum está completa?' },
    en: { texto: (p, t) => `An album has ${t} spaces and ${p} stickers (pegatinas) are already stuck in.`, pregunta: () => 'What fraction of the album is complete?' },
  },
  preguntas: {
    es: { texto: (p, t) => `En un examen de ${t} preguntas, Lucía ha acertado ${p}.`, pregunta: () => '¿Qué fracción de las preguntas ha acertado?' },
    en: { texto: (p, t) => `In a test with ${t} questions, Lucía got ${p} right.`, pregunta: () => 'What fraction of the questions did she get right?' },
  },
  rotuladores: {
    es: { texto: (p, t, o) => `En una bolsa hay ${p} rotuladores azules y ${o} rojos.`, pregunta: () => '¿Qué fracción de los rotuladores son azules?' },
    en: { texto: (p, t, o) => `In a bag there are ${p} blue felt-tip pens (rotuladores) and ${o} red ones.`, pregunta: () => 'What fraction of the pens are blue?' },
  },
  equipo: {
    es: { texto: (p, t, o) => `En un club de ajedrez hay ${o} chicos y ${p} chicas.`, pregunta: () => '¿Qué fracción del club son chicas?' },
    en: { texto: (p, t, o) => `In a chess club there are ${o} boys and ${p} girls.`, pregunta: () => 'What fraction of the club are girls?' },
  },
};

// ─── Ejercicio 4: los problemas ────────────────────────────────────────────────

/** Texto y pregunta de cada escenario (T = total, F1 y F2 = fracciones en HTML, D = el dato). */
export const PROBLEMAS = {
  queda: {
    clase: {
      es: { texto: (T, F1) => `En una clase de ${T} alumnos, ${F1} de los alumnos van a la excursión.`, pregunta: () => '¿Cuántos alumnos NO van a la excursión?' },
      en: { texto: (T, F1) => `In a class of ${T} students, ${F1} of the students go on the trip (excursión).`, pregunta: () => 'How many students do NOT go on the trip?' },
    },
    ahorro: {
      es: { texto: (T, F1) => `Irene tiene ${T} € ahorrados y gasta ${F1} de ese dinero en un regalo.`, pregunta: () => '¿Cuántos euros le quedan?' },
      en: { texto: (T, F1) => `Irene has €${T} saved and spends ${F1} of that money on a present (regalo).`, pregunta: () => 'How many euros does she have left?' },
    },
    deposito: {
      es: { texto: (T, F1) => `Un depósito de coche tiene ${T} litros y se ha gastado ${F1} de la gasolina.`, pregunta: () => '¿Cuántos litros quedan?' },
      en: { texto: (T, F1) => `A car tank (depósito) holds ${T} litres and ${F1} of the petrol (gasolina) has been used.`, pregunta: () => 'How many litres are left?' },
    },
    viaje: {
      es: { texto: (T, F1) => `Un viaje en coche es de ${T} km y ya hemos hecho ${F1} del camino.`, pregunta: () => '¿Cuántos kilómetros faltan?' },
      en: { texto: (T, F1) => `A car journey is ${T} km and we have already done ${F1} of the way (camino).`, pregunta: () => 'How many kilometres are left (faltan)?' },
    },
    pizza: {
      es: { texto: (T, F1) => `Una pizza tiene ${T} trozos y Mario se come ${F1} de la pizza.`, pregunta: () => '¿Cuántos trozos NO se come?' },
      en: { texto: (T, F1) => `A pizza has ${T} slices and Mario eats ${F1} of the pizza.`, pregunta: () => 'How many slices does he NOT eat?' },
    },
  },
  dos: {
    clase: {
      es: { texto: (T, F1, F2) => `En una clase de ${T} alumnos, ${F1} van al instituto en autobús y ${F2} van en bici. Los demás van andando.`, pregunta: () => '¿Cuántos alumnos van andando?' },
      en: { texto: (T, F1, F2) => `In a class of ${T} students, ${F1} go to school by bus and ${F2} ride a bike. The rest (los demás) walk.`, pregunta: () => 'How many students walk?' },
    },
    ahorro: {
      es: { texto: (T, F1, F2) => `Irene gasta ${F1} de sus ${T} € en un libro y ${F2} en un regalo. El resto lo guarda en el banco.`, pregunta: () => '¿Cuántos euros guarda en el banco?' },
      en: { texto: (T, F1, F2) => `Irene spends ${F1} of her €${T} on a book and ${F2} on a present. She puts the rest (el resto) in the bank.`, pregunta: () => 'How many euros does she put in the bank?' },
    },
    viaje: {
      es: { texto: (T, F1, F2) => `Un camión tiene que recorrer ${T} km. Por la mañana hace ${F1} del camino y por la tarde, ${F2}.`, pregunta: () => '¿Cuántos kilómetros le faltan?' },
      en: { texto: (T, F1, F2) => `A lorry has to travel ${T} km. In the morning it does ${F1} of the way and in the afternoon, ${F2}.`, pregunta: () => 'How many kilometres are left?' },
    },
  },
  parte: {
    clase: {
      es: { texto: (T, F1, F2, D) => `${F1} de los alumnos de una clase son chicas, y son ${D} chicas.`, pregunta: () => '¿Cuántos alumnos tiene la clase?' },
      en: { texto: (T, F1, F2, D) => `${F1} of the students in a class are girls, and that is ${D} girls.`, pregunta: () => 'How many students are in the class?' },
    },
    libro: {
      es: { texto: (T, F1, F2, D) => `Alba ha leído ${F1} de un libro, y son ${D} páginas.`, pregunta: () => '¿Cuántas páginas tiene el libro?' },
      en: { texto: (T, F1, F2, D) => `Alba has read ${F1} of a book, and that is ${D} pages.`, pregunta: () => 'How many pages does the book have?' },
    },
    ahorro: {
      es: { texto: (T, F1, F2, D) => `Marcos ha gastado ${F1} de sus ahorros, y son ${D} €.`, pregunta: () => '¿Cuántos euros tenía?' },
      en: { texto: (T, F1, F2, D) => `Marcos has spent ${F1} of his savings, and that is €${D}.`, pregunta: () => 'How many euros did he have?' },
    },
  },
  restante: {
    deposito: {
      es: { texto: (T, F1, F2, D) => `He llenado ${F1} de un depósito de coche y faltan ${D} litros.`, pregunta: () => '¿Cuántos litros caben en el depósito?' },
      en: { texto: (T, F1, F2, D) => `I have filled ${F1} of a car tank (depósito) and ${D} litres are missing (faltan).`, pregunta: () => 'How many litres does the tank hold?' },
    },
    clase: {
      es: { texto: (T, F1, F2, D) => `${F1} de los alumnos de una clase ya han entregado el trabajo. Faltan ${D} alumnos por entregarlo.`, pregunta: () => '¿Cuántos alumnos tiene la clase?' },
      en: { texto: (T, F1, F2, D) => `${F1} of the students in a class have already handed in the work. ${D} students still have to hand it in.`, pregunta: () => 'How many students are in the class?' },
    },
  },
};

/** El enunciado completo de un ítem del ejercicio 4. */
export function enunciadoProblema(item, idioma) {
  const p = PROBLEMAS[item.variante][item.esc][idioma];
  const F1 = frItem(item.f1), F2 = item.f2 ? frItem(item.f2) : '';
  return { texto: p.texto(item.total, F1, F2, item.dato), pregunta: p.pregunta() };
}

/** Los números del ítem del ejercicio 4 que usa el paso a paso. */
function numeros(item) {
  const { n, d } = item.f1;
  const T = item.total;
  if (item.variante === 'queda') return { n, d, T, s: (T / d) * n, c: T - (T / d) * n };
  if (item.variante === 'dos') {
    const a = F(item.f1).multiplicar(T).aEntero(), b = F(item.f2).multiplicar(T).aEntero();
    return { n, d, T, a, b, c: T - a - b };
  }
  const m = item.variante === 'parte' ? n : d - n;
  return { n, d, T, m, k: T / d, dato: item.dato };
}

/** El paso a paso de la respuesta buena, en un idioma. */
export function solucionProblema(item, idioma) {
  const es = idioma === 'es';
  const x = numeros(item);
  const F1 = frItem(item.f1);
  if (item.variante === 'queda') {
    return es
      ? `${F1} de ${x.T}: ${cuentaDe(x.T, x.n, x.d)}. Lo que no es esa parte: ${x.T} − ${x.s} = ${cuenta(x.c)}.`
      : `${F1} of ${x.T}: ${cuentaDe(x.T, x.n, x.d)}. What is not that part: ${x.T} − ${x.s} = ${cuenta(x.c)}.`;
  }
  if (item.variante === 'dos') {
    const F2 = frItem(item.f2);
    return es
      ? `${F1} de ${x.T} = ${x.a} y ${F2} de ${x.T} = ${x.b}. Lo que queda: ${x.T} − ${x.a} − ${x.b} = ${cuenta(x.c)}.`
      : `${F1} of ${x.T} = ${x.a} and ${F2} of ${x.T} = ${x.b}. What is left: ${x.T} − ${x.a} − ${x.b} = ${cuenta(x.c)}.`;
  }
  const unidad = fr(1, x.d);
  const parte = item.variante === 'parte' ? F1 : fr(x.d - x.n, x.d);
  const previo = item.variante === 'parte'
    ? ''
    : (es ? `Si he hecho ${F1}, falta ${parte}. ` : `If I have done ${F1}, ${parte} is missing. `);
  const divide = x.m === 1 ? '' : (es ? `${x.dato} : ${x.m} = ${x.k}, que es ${unidad}. ` : `${x.dato} : ${x.m} = ${x.k}, which is ${unidad}. `);
  return es
    ? `${previo}${parte} son ${x.dato}. ${divide}El total: ${x.k} · ${x.d} = ${cuenta(x.T)}.`
    : `${previo}${parte} is ${x.dato}. ${divide}The whole: ${x.k} · ${x.d} = ${cuenta(x.T)}.`;
}

/** Por qué está mal una opción del ejercicio 4 (con los números del ítem), en un idioma. */
export function explicaOpcion(item, opcion, idioma) {
  const es = idioma === 'es';
  const x = numeros(item);
  const v = opcion.tipo === 'cantidad' ? opcion.v : null;
  const unidad = ESCENARIOS[item.variante][item.esc].unidad[idioma];
  const F1 = frItem(item.f1);
  switch (opcion.error) {
    case 'gastado-como-queda':
      if (item.variante === 'dos') return es ? `${v} es lo que suman las dos partes del enunciado, no lo que queda.` : `${v} is what the two parts in the problem add up to, not what is left.`;
      return es ? `${v} es la parte que dice el enunciado, no lo que queda.` : `${v} is the part in the problem, not what is left.`;
    case 'se-queda-en-la-unitaria':
      return es ? `${x.T} : ${x.d} = ${v} es solo una de las ${x.d} partes; lo que queda son ${x.d - x.n} partes.` : `${x.T} : ${x.d} = ${v} is only one of the ${x.d} parts; what is left is ${x.d - x.n} parts.`;
    case 'resta-el-numerador':
      return es ? `${x.T} − ${x.n} resta el ${x.n} del numerador como si fueran ${x.n} ${unidad}; hay que restar ${F1} de ${x.T}, que son ${x.s}.` : `${x.T} − ${x.n} subtracts the numerator ${x.n} as if it were ${x.n} ${unidad}; you have to subtract ${F1} of ${x.T}, which is ${x.s}.`;
    case 'da-la-fraccion-en-vez-de-la-cantidad':
      return es ? `Eso es la fracción que queda, y la pregunta pide cuántos ${unidad} son.` : `That is the fraction that is left, and the question asks how many ${unidad} it is.`;
    case 'olvida-restar-la-primera':
      return es ? `${v} = ${x.T} − ${x.b}: has olvidado restar la primera parte (${x.a}).` : `${v} = ${x.T} − ${x.b}: you forgot to subtract the first part (${x.a}).`;
    case 'olvida-restar-la-segunda':
      return es ? `${v} = ${x.T} − ${x.a}: has olvidado restar la segunda parte (${x.b}).` : `${v} = ${x.T} − ${x.a}: you forgot to subtract the second part (${x.b}).`;
    case 'cuenta-una-parte-de-menos':
      return es ? `${v} son ${x.d - 1} partes de ${x.k}: el total tiene las ${x.d} partes.` : `${v} is ${x.d - 1} parts of ${x.k}: the whole has all ${x.d} parts.`;
    case 'cuenta-una-parte-de-mas':
      return es ? `${v} son ${x.d + 1} partes de ${x.k}, y el total tiene solo ${x.d} partes.` : `${v} is ${x.d + 1} parts of ${x.k}, and the whole has only ${x.d} parts.`;
    case 'duplica-el-dato':
      return es ? `${v} = 2 · ${x.dato} solo valdría si ${x.dato} fuera la mitad del total; aquí ${x.dato} son ${x.m} partes de ${x.d}.` : `${v} = 2 · ${x.dato} would only work if ${x.dato} were half of the whole; here ${x.dato} is ${x.m} parts out of ${x.d}.`;
    case 'multiplica-el-dato-por-el-denominador':
      return es ? `${x.dato} son ${x.m} partes de ${x.d}, no una: primero se divide ${x.dato} : ${x.m} = ${x.k}.` : `${x.dato} is ${x.m} parts out of ${x.d}, not one: first divide ${x.dato} : ${x.m} = ${x.k}.`;
    case 'da-el-resto':
      return es ? `${v} es lo que falta (lo que no es esa parte), no el total.` : `${v} is what is missing (what is not that part), not the whole.`;
    case 'da-la-parte-ya-hecha':
      return es ? `${v} es lo que ya hay (${x.n} partes de ${x.k}), no el total.` : `${v} is what is already there (${x.n} parts of ${x.k}), not the whole.`;
    default:
      return '';
  }
}

// ─── Los textos de los cuatro ejercicios ───────────────────────────────────────

export const TX = {
  pista: { es: 'Pista', en: 'Hint' },

  calculo: {
    nombre: { es: 'Calcula', en: 'Work it out' },
    detalle: { es: 'Calcula la fracción de una cantidad', en: 'Work out a fraction of an amount' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para calcular <strong>una fracción de una cantidad</strong>: <strong>divides</strong> la cantidad entre el <strong>denominador</strong> (así sale lo que vale una parte) y <strong>multiplicas</strong> por el <strong>numerador</strong> (las partes que te piden).</p>
        <p>Por ejemplo, ${fr(3, 5)} de 40: <strong>40 : 5 = 8</strong> y <strong>8 · 3 = 24</strong>. Si la fracción es ${fr(1, 4)}, basta dividir: ${fr(1, 4)} de 36 es <strong>36 : 4 = 9</strong>.</p>
        <p>Si te atascas, el botón <strong>Pista</strong> te da los pasos uno a uno (y cuenta como ayuda).</p>`,
      en: `<h2>How it works</h2>
        <p>To work out <strong>a fraction of an amount</strong>: <strong>divide</strong> the amount by the <strong>denominator</strong> (that gives the value of one part) and <strong>multiply</strong> by the <strong>numerator</strong> (the parts you are asked for).</p>
        <p>For example, ${fr(3, 5)} of 40: <strong>40 : 5 = 8</strong> and <strong>8 · 3 = 24</strong>. If the fraction is ${fr(1, 4)}, just divide: ${fr(1, 4)} of 36 is <strong>36 : 4 = 9</strong>.</p>
        <p>If you get stuck, the <strong>Hint</strong> button gives you the steps one by one (and it counts as help).</p>`,
    },
    instruccion: { es: 'Calcula y escribe el resultado.', en: 'Work it out and write the result.' },
    de: { es: 'de', en: 'of' },
    nombre_campo: { es: 'Resultado', en: 'Result' },
    // Las dos pistas, en orden: dividir y multiplicar.
    pista1: { es: item => `Primero divide entre el denominador: ${item.total} : ${item.d} = ${item.total / item.d}.`, en: item => `First divide by the denominator: ${item.total} : ${item.d} = ${item.total / item.d}.` },
    pista2: { es: item => `Después multiplica por el numerador: ${item.total / item.d} · ${item.n} = ${item.resultado}.`, en: item => `Then multiply by the numerator: ${item.total / item.d} · ${item.n} = ${item.resultado}.` },
    razon: {
      es: item => `${frItem(item)} de ${item.total}: ${cuentaDe(item.total, item.n, item.d)}. La respuesta es ${cuenta(item.resultado)}.`,
      en: item => `${frItem(item)} of ${item.total}: ${cuentaDe(item.total, item.n, item.d)}. The answer is ${cuenta(item.resultado)}.`,
    },
    escribio: { es: v => `Has escrito ${v}.`, en: v => `You wrote ${v}.` },
    fallo: {
      'fraccion-de-al-reves': {
        es: item => `Has dividido entre el numerador (${item.n}) y multiplicado por el denominador (${item.d}), al revés. Se divide entre el denominador y se multiplica por el numerador.`,
        en: item => `You divided by the numerator (${item.n}) and multiplied by the denominator (${item.d}), the wrong way round. Divide by the denominator and multiply by the numerator.`,
      },
      'se-queda-en-la-unitaria': {
        es: item => `${item.total / item.d} es solo ${fr(1, item.d)} de ${item.total}: falta multiplicar por el numerador (${item.n}).`,
        en: item => `${item.total / item.d} is only ${fr(1, item.d)} of ${item.total}: you still have to multiply by the numerator (${item.n}).`,
      },
      'multiplica-por-el-denominador': {
        es: item => `Has multiplicado por el denominador (${item.d}); para hallar una parte hay que dividir entre ${item.d}.`,
        en: item => `You multiplied by the denominator (${item.d}); to find one part you have to divide by ${item.d}.`,
      },
      'multiplica-sin-dividir': {
        es: item => `Has multiplicado ${item.total} por el numerador (${item.n}) sin dividir antes entre el denominador (${item.d}).`,
        en: item => `You multiplied ${item.total} by the numerator (${item.n}) without dividing by the denominator (${item.d}) first.`,
      },
      'otro-error': { es: () => '', en: () => '' },
    },
  },

  contexto: {
    nombre: { es: 'Con contexto', en: 'In context' },
    detalle: { es: 'La fracción de una cantidad en un problema', en: 'A fraction of an amount in a problem' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Es la misma cuenta, pero dentro de un problema: <strong>«de»</strong> quiere decir <strong>multiplicar</strong>. Lees el texto, calculas la fracción de la cantidad y escribes cuántos hay.</p>
        <p>Por ejemplo: un depósito de 120 litros está lleno hasta ${fr(3, 4)}. <strong>120 : 4 = 30</strong> y <strong>30 · 3 = 90</strong>: hay <strong>90 litros</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>It is the same calculation, but inside a problem: <strong>“of”</strong> means <strong>multiply</strong>. You read the text, work out the fraction of the amount and write how many there are.</p>
        <p>For example: a 120-litre tank is ${fr(3, 4)} full. <strong>120 : 4 = 30</strong> and <strong>30 · 3 = 90</strong>: there are <strong>90 litres</strong>.</p>`,
    },
    nombre_campo: { es: 'Resultado', en: 'Result' },
    razon: {
      es: item => `${frItem(item)} de ${item.total}: ${cuentaDe(item.total, item.n, item.d)}. La respuesta es ${cuenta(item.resultado)}.`,
      en: item => `${frItem(item)} of ${item.total}: ${cuentaDe(item.total, item.n, item.d)}. The answer is ${cuenta(item.resultado)}.`,
    },
  },

  parte: {
    nombre: { es: '¿Qué fracción es?', en: 'What fraction is it?' },
    detalle: { es: 'Escribe la fracción simplificada que representa una parte', en: 'Write the simplest fraction that a part represents' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>La fracción que representa una parte es <strong>la parte arriba y el total abajo</strong>. Después se <strong>simplifica</strong>: se divide arriba y abajo entre el mismo número.</p>
        <p>Por ejemplo: 18 de los 30 alumnos van andando. Es ${fr(18, 30)}; dividiendo arriba y abajo entre 6, queda <strong>${fr(3, 5)}</strong>.</p>
        <p>A veces el enunciado da <strong>las dos partes</strong> y no el total: 6 azules y 18 rojas son 24 en total, y los azules son ${fr(6, 24)} = <strong>${fr(1, 4)}</strong>.</p>
        <p>Escribes el numerador en la casilla de arriba y el denominador en la de abajo.</p>`,
      en: `<h2>How it works</h2>
        <p>The fraction that a part represents is <strong>the part on top and the whole on the bottom</strong>. Then you <strong>simplify</strong>: you divide top and bottom by the same number.</p>
        <p>For example: 18 of the 30 students walk. That is ${fr(18, 30)}; dividing top and bottom by 6 gives <strong>${fr(3, 5)}</strong>.</p>
        <p>Sometimes the text gives <strong>both parts</strong> and not the whole: 6 blue and 18 red make 24 in total, and the blue ones are ${fr(6, 24)} = <strong>${fr(1, 4)}</strong>.</p>
        <p>Write the numerator in the top box and the denominator in the bottom box.</p>`,
    },
    instruccion: { es: 'Escribe la fracción, simplificada al máximo.', en: 'Write the fraction in its simplest form.' },
    arriba: { es: 'Numerador', en: 'Numerator' },
    abajo: { es: 'Denominador', en: 'Denominator' },
    razon: {
      es: item => {
        const total = item.tipo === 'partes' ? `El total es ${item.parte} + ${item.otra} = ${item.total}. ` : '';
        const r = respuesta(item);
        const g = item.parte && mcdLocal(item.parte, item.total);
        const simp = g > 1
          ? `Dividiendo arriba y abajo entre ${g}: ${item.parte} : ${g} = ${item.parte / g} y ${item.total} : ${g} = ${item.total / g}.`
          : `${fr(item.parte, item.total)} ya no se simplifica: su único divisor común es 1.`;
        return `${total}${fr(item.parte, item.total)}. ${simp} La respuesta es ${cuenta(r)}.`;
      },
      en: item => {
        const total = item.tipo === 'partes' ? `The whole is ${item.parte} + ${item.otra} = ${item.total}. ` : '';
        const r = respuesta(item);
        const g = item.parte && mcdLocal(item.parte, item.total);
        const simp = g > 1
          ? `Dividing top and bottom by ${g}: ${item.parte} : ${g} = ${item.parte / g} and ${item.total} : ${g} = ${item.total / g}.`
          : `${fr(item.parte, item.total)} cannot be simplified: its only common divisor is 1.`;
        return `${total}${fr(item.parte, item.total)}. ${simp} The answer is ${cuenta(r)}.`;
      },
    },
    escribio: { es: f => `Has escrito ${f}.`, en: f => `You wrote ${f}.` },
    fallo: {
      'parte-entre-el-resto': {
        es: item => (item.tipo === 'partes'
          ? `Has comparado una parte con la otra (${item.parte} y ${item.otra}). Hay que compararla con el total: ${item.parte} + ${item.otra} = ${item.total}.`
          : `Has puesto la parte entre lo que no es de esa parte (${item.parte} y ${item.total - item.parte}). Hay que ponerla entre el total, ${item.total}.`),
        en: item => (item.tipo === 'partes'
          ? `You compared one part with the other (${item.parte} and ${item.otra}). It has to be compared with the whole: ${item.parte} + ${item.otra} = ${item.total}.`
          : `You put the part over what is not that part (${item.parte} and ${item.total - item.parte}). It has to go over the whole, ${item.total}.`),
      },
      'sin-simplificar': {
        es: () => 'Vale lo mismo, pero se pedía la fracción simplificada al máximo.',
        en: () => 'It has the same value, but the fraction had to be in its simplest form.',
      },
      'otro-error': { es: () => '', en: () => '' },
    },
  },

  problema: {
    nombre: { es: 'El problema', en: 'The problem' },
    detalle: { es: 'Problemas de dos pasos: elige la respuesta', en: 'Two-step problems: choose the answer' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cada problema tiene dos pasos y <strong>cuatro respuestas</strong>: solo una es buena. Lee bien la <strong>pregunta</strong>: a veces pide lo que <strong>queda</strong> o lo que <strong>NO</strong> es, y a veces pide el <strong>total</strong>.</p>
        <p>Por ejemplo: en una clase de 24 alumnos, ${fr(3, 4)} van a la excursión. ¿Cuántos <strong>NO</strong> van? <strong>24 : 4 · 3 = 18</strong> van, así que no van <strong>24 − 18 = 6</strong>.</p>
        <p>Y si ${fr(3, 5)} de los alumnos de otra clase son 15 chicas, ${fr(1, 5)} son <strong>15 : 3 = 5</strong> y el total es <strong>5 · 5 = 25</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Each problem has two steps and <strong>four answers</strong>: only one is right. Read the <strong>question</strong> carefully: sometimes it asks for what is <strong>left</strong> or what is <strong>NOT</strong>, and sometimes it asks for the <strong>whole</strong>.</p>
        <p>For example: in a class of 24 students, ${fr(3, 4)} go on the trip. How many do <strong>NOT</strong> go? <strong>24 : 4 · 3 = 18</strong> go, so <strong>24 − 18 = 6</strong> do not.</p>
        <p>And if ${fr(3, 5)} of the students in another class are 15 girls, ${fr(1, 5)} is <strong>15 : 3 = 5</strong> and the whole is <strong>5 · 5 = 25</strong>.</p>`,
    },
    instruccion: { es: 'Lee el problema y elige la respuesta.', en: 'Read the problem and choose the answer.' },
  },
};

const mcdLocal = (a, b) => (b === 0 ? a : mcdLocal(b, a % b));
const respuesta = item => fr(item.parte / mcdLocal(item.parte, item.total), item.total / mcdLocal(item.parte, item.total));

/** El HTML del enunciado de un ítem del ejercicio 2 en un idioma. */
export function enunciadoContexto(item, idioma) {
  const f = FRASES[item.ctx][idioma];
  const Fr = frItem(item);
  return { texto: f.texto(item.total, Fr), pregunta: f.pregunta(item.total, Fr), unidad: CONTEXTOS[item.ctx].unidad[idioma] };
}

/** El HTML del enunciado de un ítem del ejercicio 3 en un idioma. */
export function enunciadoParte(item, idioma) {
  const g = GRUPOS_TX[item.ctx][idioma];
  return { texto: g.texto(item.parte, item.total, item.otra), pregunta: g.pregunta() };
}
