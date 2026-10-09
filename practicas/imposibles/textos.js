// Práctica «Detector de imposibles»: textos propios y los bancos de
// enunciados.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·»; GCD/LCM en inglés, m.c.d./m.c.m. en español;
// inglés sencillo; nada de «×», «HCF» ni letras como incógnita; el 0 es
// múltiplo de todo número y el 1 es divisor de todo número.

import { mcd } from '../_comun/aritmetica.js';

export const TX = {
  nombre: {
    puede: { es: '¿Puede ser?', en: 'Can that be right?' },
    producto: { es: 'La comprobación del producto', en: 'The product check' },
    nombrar: { es: 'Nómbralo', en: 'Name it' },
  },
  detalle: {
    puede: { es: 'Rechaza de golpe un m.c.d. o un m.c.m. imposible', en: 'Spot an impossible GCD or LCM straight away' },
    producto: { es: 'm.c.d. · m.c.m. tiene que ser igual al producto de los dos números', en: 'GCD · LCM has to equal the product of the two numbers' },
    nombrar: { es: 'Es el m.c.d. o el m.c.m. de los datos: ¿cuál?', en: 'It is the GCD or the LCM of the data: which one?' },
  },
  etiquetaExpr: {
    mcd: { es: (x, y) => `m.c.d.(${x}, ${y})`, en: (x, y) => `GCD(${x}, ${y})` },
    mcm: { es: (x, y) => `m.c.m.(${x}, ${y})`, en: (x, y) => `LCM(${x}, ${y})` },
  },
  puedeSer: { es: '¿Puede ser?', en: 'Can that be right?' },
  contextos: {
    mcd: [
      {
        es: (a, b, n) => `Tienes ${a} lápices y ${b} gomas y quieres hacer el mayor número posible de grupos iguales, todos con el mismo número de lápices y todos con el mismo número de gomas, sin que sobre nada. ¿${n === 1 ? 'Puede' : 'Pueden'} salir ${n} ${n === 1 ? 'grupo' : 'grupos'}?`,
        en: (a, b, n) => `You have ${a} pencils and ${b} erasers and want to make the largest possible number of identical groups, all with the same number of pencils and all with the same number of erasers, with nothing left over. Can there be ${n} ${n === 1 ? 'group' : 'groups'}?`,
      },
      {
        es: (a, b, n) => `${a} canicas y ${b} cuentas se reparten en el mayor número posible de bolsas iguales, sin que sobre ninguna. ¿${n === 1 ? 'Puede' : 'Pueden'} salir ${n} ${n === 1 ? 'bolsa' : 'bolsas'}?`,
        en: (a, b, n) => `${a} marbles and ${b} beads are shared into the largest possible number of identical bags with none left over. Can there be ${n} ${n === 1 ? 'bag' : 'bags'}?`,
      },
    ],
    mcm: [
      {
        es: (a, b, n) => `Un autobús pasa cada ${a} minutos y otro cada ${b} minutos. Si ahora acaban de pasar juntos, ¿pueden volver a coincidir por primera vez dentro de ${n} ${n === 1 ? 'minuto' : 'minutos'}?`,
        en: (a, b, n) => `One bus goes by every ${a} minutes and another every ${b} minutes. If they have just gone by together now, can they coincide again for the first time in ${n} ${n === 1 ? 'minute' : 'minutes'}?`,
      },
      {
        es: (a, b, n) => `Una luz parpadea cada ${a} segundos y otra cada ${b} segundos. Si ahora parpadean juntas, ¿pueden volver a parpadear juntas por primera vez dentro de ${n} ${n === 1 ? 'segundo' : 'segundos'}?`,
        en: (a, b, n) => `One light blinks every ${a} seconds and another every ${b} seconds. If they blink together now, can they blink together again for the first time in ${n} ${n === 1 ? 'second' : 'seconds'}?`,
      },
    ],
  },
  feedbackPuede: {
    // Los enunciados con contexto no nombran el m.c.d. ni el m.c.m.: se dice primero cuál es.
    contexto: {
      // `contexto` es el índice de la plantilla de contextos.mcd: el feedback nombra lo que dice el enunciado.
      mcd: {
        es: (a, b, contexto) => `Aquí se busca el m.c.d.(${a}, ${b}), que es el mayor número de ${contexto === 1 ? 'bolsas' : 'grupos'}.`,
        en: (a, b, contexto) => `Here we look for the GCD(${a}, ${b}), which is the largest number of ${contexto === 1 ? 'bags' : 'groups'}.`,
      },
      mcm: { es: (a, b) => `Aquí se busca el m.c.m.(${a}, ${b}), que es la primera vez que coinciden.`, en: (a, b) => `Here we look for the LCM(${a}, ${b}), which is the first time they coincide.` },
    },
    correcto: {
      mcd: {
        es: (n, a, b) => `Sí: ${n} divide a ${a} y a ${b}, y no pasa del menor (${Math.min(a, b)}).`,
        en: (n, a, b) => `Yes: ${n} divides ${a} and ${b}, and it is not bigger than the smaller one (${Math.min(a, b)}).`,
      },
      mcm: {
        es: (n, a, b) => `Sí: ${n} es múltiplo de ${a} y de ${b}, y no es menor que el mayor (${Math.max(a, b)}).`,
        en: (n, a, b) => `Yes: ${n} is a multiple of ${a} and ${b}, and it is not smaller than the bigger one (${Math.max(a, b)}).`,
      },
    },
    cero: {
      es: 'No: 0 no puede ser, porque el 1 siempre es divisor común, así que el m.c.d. nunca vale 0.',
      en: 'No: it cannot be 0, because 1 is always a common divisor, so the GCD is never 0.',
    },
    mayor: {
      es: (propuesto, minimo) => `${propuesto} > ${minimo}: el m.c.d. es un divisor de los dos datos y no puede pasar del menor (${minimo}).`,
      en: (propuesto, minimo) => `${propuesto} > ${minimo}: the GCD is a divisor of both numbers and cannot be bigger than the smaller one (${minimo}).`,
    },
    menor: {
      es: (propuesto, maximo) => `${propuesto} < ${maximo}: el m.c.m. es múltiplo de los dos datos y no puede ser menor que el mayor (${maximo}).`,
      en: (propuesto, maximo) => `${propuesto} < ${maximo}: the LCM is a multiple of both numbers and cannot be smaller than the bigger one (${maximo}).`,
    },
  },
  producto: {
    boton: { cuadra: { es: 'Cuadra', en: 'It checks out' }, noCuadra: { es: 'No cuadra', en: "It doesn't check out" } },
    instruccionDos: { es: 'Comprueba si cuadra:', en: 'Check whether it works out:' },
    instruccionTres: { es: '¿Vale la comprobación del producto con tres números?', en: 'Does the product check work with three numbers?' },
    feedbackCuadra: {
      es: (a, b, g, m) => `${g} · ${m} = ${g * m} = ${a} · ${b} ✓`,
      en: (a, b, g, m) => `${g} · ${m} = ${g * m} = ${a} · ${b} ✓`,
    },
    feedbackNoCuadra: {
      es: (a, b, g, m) => `${g} · ${m} = ${g * m} ≠ ${a * b}: uno de los dos está mal.`,
      en: (a, b, g, m) => `${g} · ${m} = ${g * m} ≠ ${a * b}: one of the two is wrong.`,
    },
    feedbackTres: {
      es: (a, b, c, g, m) => `No: con tres números el m.c.d. · m.c.m. ya no coincide con el producto. Ejemplo: m.c.d.(2, 4, 8) · m.c.m.(2, 4, 8) = 2 · 8 = 16 ≠ 64. Aquí: ${g} · ${m} = ${g * m} ≠ ${a * b * c}.`,
      en: (a, b, c, g, m) => `No: with three numbers, GCD · LCM no longer matches the product. Example: GCD(2, 4, 8) · LCM(2, 4, 8) = 2 · 8 = 16 ≠ 64. Here: ${g} · ${m} = ${g * m} ≠ ${a * b * c}.`,
    },
  },
  nombrar: {
    elEsEs: { es: n => `El ${n} es…`, en: n => `The ${n} is…` },
    valorDe: { es: (expr, v) => `${expr} = ${v}`, en: (expr, v) => `${expr} = ${v}` },
    yLaRespuestaEra: { es: 'y la respuesta era', en: 'but the answer was' },
    bienElEraRespuesta: { es: '✓ Es la respuesta.', en: '✓ That is the answer.' },
  },
};

function enteros(rng, min, max) {
  let a = rng.entero(min, max);
  let b = rng.entero(min, max);
  while (b === a) b = rng.entero(min, max);
  return [a, b];
}

// Para el banco de m.c.d.: evita pares coprimos (el "m.c.d. = 1" daría
// grupos de una sola pieza, poco ilustrativo).
function enterosMcd(rng, min, max) {
  let [a, b] = enteros(rng, min, max);
  while (mcd(a, b) === 1) [a, b] = enteros(rng, min, max);
  return [a, b];
}

export const BANCO_NOMBRAR = [
  {
    clase: 'mcm',
    numeros: rng => enteros(rng, 2, 9),
    es: (a, b, r) => `Los autobuses salen cada ${a} y cada ${b} minutos y coinciden cada ${r} minutos. El ${r} es…`,
    en: (a, b, r) => `The buses leave every ${a} and every ${b} minutes and they coincide every ${r} minutes. The ${r} is…`,
  },
  {
    clase: 'mcm',
    numeros: rng => enteros(rng, 2, 9),
    es: (a, b, r) => `Un tren sale cada ${a} minutos y otro cada ${b} minutos: vuelven a salir juntos a los ${r} minutos. El ${r} es…`,
    en: (a, b, r) => `One train leaves every ${a} minutes and another every ${b} minutes: they leave together again after ${r} minutes. The ${r} is…`,
  },
  {
    clase: 'mcm',
    numeros: rng => enteros(rng, 2, 9),
    es: (a, b, r) => `Una luz parpadea cada ${a} segundos y otra cada ${b} segundos: vuelven a parpadear juntas a los ${r} segundos. El ${r} es…`,
    en: (a, b, r) => `One light blinks every ${a} seconds and another every ${b} seconds: they blink together again after ${r} seconds. The ${r} is…`,
  },
  {
    clase: 'mcm',
    numeros: rng => enteros(rng, 2, 9),
    es: (a, b, r) => `Una campana suena cada ${a} minutos y otra cada ${b} minutos: suenan juntas cada ${r} minutos. El ${r} es…`,
    en: (a, b, r) => `One bell rings every ${a} minutes and another every ${b} minutes: they ring together every ${r} minutes. The ${r} is…`,
  },
  {
    clase: 'mcm',
    numeros: rng => enteros(rng, 2, 9),
    es: (a, b, r) => `Una alarma suena cada ${a} minutos y otra cada ${b} minutos: vuelven a sonar juntas a los ${r} minutos. El ${r} es…`,
    en: (a, b, r) => `One alarm goes off every ${a} minutes and another every ${b} minutes: they go off together again after ${r} minutes. The ${r} is…`,
  },
  {
    clase: 'mcm',
    numeros: rng => enteros(rng, 2, 9),
    es: (a, b, r) => `Un corredor pasa por la meta cada ${a} segundos y otro cada ${b} segundos: pasan juntos cada ${r} segundos. El ${r} es…`,
    en: (a, b, r) => `One runner passes the finish line every ${a} seconds and another every ${b} seconds: they pass together every ${r} seconds. The ${r} is…`,
  },
  {
    clase: 'mcd',
    numeros: rng => enterosMcd(rng, 12, 60),
    es: (a, b, r) => `Cortas dos cintas, una de ${a} cm y otra de ${b} cm, en trozos iguales lo más largos posible, sin que sobre nada. Cada trozo mide ${r} cm. El ${r} es…`,
    en: (a, b, r) => `You cut two ribbons, one ${a} cm long and the other ${b} cm long, into identical pieces as long as possible, with nothing left over. Each piece is ${r} cm. The ${r} is…`,
  },
  {
    clase: 'mcd',
    numeros: rng => enterosMcd(rng, 12, 60),
    es: (a, b, r) => `Tienes ${a} lápices y ${b} gomas y haces el mayor número posible de bolsas iguales, sin que sobre nada: salen ${r} bolsas. El ${r} es…`,
    en: (a, b, r) => `You have ${a} pencils and ${b} erasers and make the largest possible number of identical bags, with nothing left over: you get ${r} bags. The ${r} is…`,
  },
  {
    clase: 'mcd',
    numeros: rng => enterosMcd(rng, 12, 60),
    es: (a, b, r) => `Dos paneles, uno de ${a} cm de ancho y otro de ${b} cm de ancho, se cubren de lado a lado con la misma baldosa cuadrada en los dos, lo más grande posible, sin recortar ninguna. El lado de la baldosa mide ${r} cm. El ${r} es…`,
    en: (a, b, r) => `Two panels, one ${a} cm wide and the other ${b} cm wide, are covered from side to side with the same square tile in both, as large as possible, with none cut. The tile side is ${r} cm. The ${r} is…`,
  },
  {
    clase: 'mcd',
    numeros: rng => enterosMcd(rng, 12, 60),
    es: (a, b, r) => `${a} manzanas y ${b} naranjas se reparten en el mayor número posible de cestas iguales, sin que sobre nada: salen ${r} cestas. El ${r} es…`,
    en: (a, b, r) => `${a} apples and ${b} oranges are shared into the largest possible number of identical baskets, with nothing left over: you get ${r} baskets. The ${r} is…`,
  },
  {
    clase: 'mcd',
    numeros: rng => enterosMcd(rng, 12, 60),
    es: (a, b, r) => `${a} bombones y ${b} caramelos se reparten en el mayor número posible de cajas iguales, sin que sobre nada: salen ${r} cajas. El ${r} es…`,
    en: (a, b, r) => `${a} chocolates and ${b} sweets are shared into the largest possible number of identical boxes, with nothing left over: you get ${r} boxes. The ${r} is…`,
  },
  {
    clase: 'mcd',
    numeros: rng => enterosMcd(rng, 12, 60),
    es: (a, b, r) => `${a} canicas y ${b} cuentas se reparten en el mayor número posible de pulseras iguales, sin que sobre nada: salen ${r} pulseras. El ${r} es…`,
    en: (a, b, r) => `${a} marbles and ${b} beads are shared into the largest possible number of identical bracelets, with nothing left over: you get ${r} bracelets. The ${r} is…`,
  },
];
