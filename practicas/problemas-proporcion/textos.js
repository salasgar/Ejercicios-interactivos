// «Problemas de toda la unidad»: textos propios, siempre { es, en }. Producto con «·», división con «:». Sin velocidad,
// moneda ni inversa mientras el acta de la 02 de la U7 no los admita. El inglés, sencillo, y la palabra no matemática
// que decide la respuesta, aclarada entre paréntesis.

import {
  enunciado, cantidad, aTexto, numeroATexto, proporcionDirecta, porcentajeDe, aplicarPorcentaje, realidad,
} from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';
import { ctxPorId, datosDe, PRODUCTOS, REDONDEO, valorBueno } from './logica.js';

const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };
const cuentaHtml = c => `<span class="cuenta">${c}</span>`;
const pasosHtml = (lineas, idioma) => `<ol class="pasos-ayuda">${lineas.map(l => `<li>${cuentaHtml(typeof l === 'string' ? l : l[idioma])}</li>`).join('')}</ol>`;
const dinero = (f, idioma) => aTexto(cantidad(f, '€'), idioma);
const fr = (a, b) => fraccion(a, b).simplificar();
const t2 = (idioma, es, en) => (idioma === 'es' ? es : en);

// ─── Ejercicio 1: ¿qué tipo de problema es? ────────────────────────────────────

export const TIPO = {
  directa: { es: 'Proporcionalidad directa (sin porcentajes ni escalas)', en: 'Direct proportion (no percentages or scales)' },
  porcentaje: { es: 'Un porcentaje: el enunciado lleva un %', en: 'A percentage: the problem has a %' },
  reparto: { es: 'Un reparto: se reparte un total en partes proporcionales', en: 'A share-out: a total is shared in proportional parts (share-out = reparto)' },
  escala: { es: 'Una escala: el enunciado lleva una escala o un plano', en: 'A scale: the problem has a scale or a plan' },
};
const PORQUE = {
  directa: { es: 'Si hay el doble, sale el doble, y el enunciado no lleva ni un %, ni una escala, ni un reparto.', en: 'If there is twice as much, you get twice as much, and the problem has no %, no scale and no share-out.' },
  porcentaje: { es: 'El enunciado lleva un %: se pide una parte de un total (o un total a partir de su parte).', en: 'The problem has a %: it asks for a part of a total.' },
  reparto: { es: 'Hay un total que se reparte en partes proporcionales a unos números.', en: 'A total is shared out in parts that are proportional to some numbers.' },
  escala: { es: 'El enunciado lleva una escala (un plano, un mapa o una maqueta): lo del dibujo y lo real están en proporción.', en: 'The problem has a scale (a plan, a map or a model): the drawing and the real thing are in proportion.' },
};
export const enunciadoTipo = (item, idioma) => enunciado(ctxPorId(item.ctx), datosDe(item), idioma);
export const explicaTipo = (item, idioma) => `${t2(idioma, 'Es', 'It is')} «<strong>${TIPO[item.tipo][idioma]}</strong>». ${PORQUE[item.tipo][idioma]}`;
export const feedbackTipo = (item, elegida, idioma) =>
  `${t2(idioma, 'Has elegido', 'You chose')} «${TIPO[elegida][idioma]}», ${t2(idioma, 'pero no es esa.', 'but it is not that one.')} ${explicaTipo(item, idioma)}`;

// ─── Ejercicio 4: la mejor oferta ──────────────────────────────────────────────

const PROD = {
  zumo: { es: { pack: q => `${q} L de zumo de naranja`, por: 'litro', suf: '/L' }, en: { pack: q => `${q} L of orange juice`, por: 'litre', suf: '/L' } },
  leche: { es: { pack: q => `${q} L de leche`, por: 'litro', suf: '/L' }, en: { pack: q => `${q} L of milk`, por: 'litre', suf: '/L' } },
  arroz: { es: { pack: q => `${q} kg de arroz`, por: 'kilo', suf: '/kg' }, en: { pack: q => `${q} kg of rice`, por: 'kilo', suf: '/kg' } },
  manzanas: { es: { pack: q => `${q} kg de manzanas`, por: 'kilo', suf: '/kg' }, en: { pack: q => `${q} kg of apples`, por: 'kilo', suf: '/kg' } },
  yogures: { es: { pack: q => `${q} yogures`, por: 'yogur', suf: ' cada uno' }, en: { pack: q => `${q} yoghurts`, por: 'yoghurt', suf: ' each' } },
  cuadernos: { es: { pack: q => `${q} cuadernos`, por: 'cuaderno', suf: ' cada uno' }, en: { pack: q => `${q} notebooks`, por: 'notebook', suf: ' each' } },
};

export function enunciadoOferta(item, idioma) {
  const P = PROD[item.prod][idioma];
  const [[q1, p1], [q2, p2]] = item.e;
  const precio = p => dinero(fr(p, 100), idioma);
  const texto = t2(idioma,
    `En el supermercado venden ${P.pack(q1)} por ${precio(p1)}, o ${P.pack(q2)} por ${precio(p2)}.`,
    `The supermarket sells ${P.pack(q1)} for ${precio(p1)}, or ${P.pack(q2)} for ${precio(p2)}.`);
  const pregunta = t2(idioma,
    `¿Cuál es la mejor oferta, es decir, la que sale más barata por ${P.por}?`,
    `Which is the best buy, that is, the cheapest per ${P.por}? (best buy = mejor oferta)`);
  return { texto, pregunta };
}

export function opcionesOferta(item, idioma) {
  const P = PROD[item.prod][idioma];
  return [
    t2(idioma, 'La primera oferta', 'The first offer'),
    t2(idioma, 'La segunda oferta', 'The second offer'),
    t2(idioma, `Cuestan lo mismo por ${P.por}`, `They cost the same per ${P.por}`),
  ];
}

export function pasosOferta(item, idioma) {
  const P = PROD[item.prod][idioma];
  return item.e.map(([q, p]) => {
    const pu = fr(p, 100 * q);
    return `${dinero(fr(p, 100), idioma)} : ${q} = ${dinero(pu, idioma)}${P.suf}`;
  });
}

export function explicaOferta(item, idioma) {
  const P = PROD[item.prod][idioma];
  const [[q1, p1], [q2, p2]] = item.e;
  const u1 = dinero(fr(p1, 100 * q1), idioma), u2 = dinero(fr(p2, 100 * q2), idioma);
  const intro = t2(idioma, `Se compara lo que cuesta cada ${P.por}, porque los dos envases no son del mismo tamaño.`,
    `Compare what each ${P.por} costs, because the two packs are not the same size.`);
  let cierre;
  if (item.buena === 2) cierre = t2(idioma, `Los dos salen a ${u1}${P.suf}: cuestan lo mismo por ${P.por}.`, `Both cost ${u1}${P.suf}: they cost the same per ${P.por}.`);
  else {
    const gana = item.buena === 0 ? [u1, u2] : [u2, u1];
    const cual = item.buena === 0 ? t2(idioma, 'la primera', 'the first') : t2(idioma, 'la segunda', 'the second');
    cierre = t2(idioma, `${gana[0]} es menos que ${gana[1]}: sale mejor la ${cual.replace('la ', '')} oferta.`, `${gana[0]} is less than ${gana[1]}: ${cual} offer is the best buy.`);
  }
  return `${intro}${pasosHtml(pasosOferta(item, idioma), idioma)}${cierre}`;
}

export function feedbackOferta(item, error, idioma) {
  const P = PROD[item.prod][idioma];
  const causa = {
    'mas-barato-en-total': t2(idioma, 'Has mirado lo que cuesta cada envase entero, y son de distinto tamaño.', 'You looked at the price of each whole pack, but they are different sizes.'),
    'el-grande-siempre': t2(idioma, `El envase grande no siempre sale mejor: hay que ver lo que cuesta cada ${P.por}.`, `The big pack is not always the best buy: you have to see what each ${P.por} costs.`),
    'cree-que-cuestan-lo-mismo': t2(idioma, `No cuestan lo mismo por ${P.por}.`, `They do not cost the same per ${P.por}.`),
    otro: '',
  }[error];
  return `${causa} ${explicaOferta(item, idioma)}`.trim();
}

// ─── Ejercicio 5: ¿tiene sentido la respuesta? ─────────────────────────────────

export const MOTIVO = {
  ok: { es: 'Sí, está bien', en: 'Yes, it is right' },
  unidad: { es: 'La unidad está mal', en: 'The unit is wrong' },
  redondeo: { es: 'El número no puede ser decimal: hay que redondearlo', en: 'The number cannot have decimals: it has to be rounded' },
  absurdo: { es: 'La cuenta está mal: el resultado es absurdo', en: 'The working is wrong: the result makes no sense' },
};

const ENUNCIADO_REDONDEO = {
  autobuses: {
    es: (t, c) => `Un colegio lleva a ${t} alumnos de excursión en autobuses de ${c} plazas. ¿Cuántos autobuses hacen falta?`,
    en: (t, c) => `A school takes ${t} pupils on a trip in buses with ${c} seats each. How many buses are needed?`,
  },
  coches: {
    es: (t, c) => `${t} personas viajan en coches de ${c} plazas cada uno. ¿Cuántos coches hacen falta para llevarlas a todas?`,
    en: (t, c) => `${t} people travel in cars with ${c} seats each. How many cars are needed to take everybody? (seats = plazas)`,
  },
  cajas: {
    es: (t, c) => `Una tienda tiene ${t} rotuladores y los guarda en cajas de ${c}. ¿Cuántas cajas necesita?`,
    en: (t, c) => `A shop has ${t} felt pens and keeps them in boxes of ${c}. How many boxes does it need? (felt pens = rotuladores)`,
  },
};

const etiquetaTxt = (spec, f, idioma) => `${numeroATexto(f, idioma)} ${spec.etiqueta[idioma][f.equals(fraccion(1)) ? 0 : 1]}`;
/** Un valor con la unidad de la clave del contexto (o con otra, si se pasa `unidad`). */
function valorConUnidad(ctx, clave, f, idioma, unidad = undefined) {
  const spec = ctx.datos[clave];
  if (unidad !== undefined && unidad !== null) return aTexto(cantidad(f, unidad), idioma);
  if (spec.etiqueta) return etiquetaTxt(spec, f, idioma);
  return aTexto(cantidad(f, spec.unidad ?? null), idioma);
}
const COSA = (id, f, idioma) => REDONDEO[id].cosa[idioma][f.equals(fraccion(1)) ? 0 : 1];
const CLAVE = { directa: 'd', descuento: 'final', porcentaje: 'parte', escala: 'real' };

/** La respuesta que da el compañero, con su unidad. */
export function respuestaDada(item, idioma) {
  const f = val(item.mostrado);
  if (item.kind === 'redondeo') return `${numeroATexto(f, idioma)} ${COSA(item.ctx, f, idioma)}`;
  const ctx = ctxPorId(item.ctx);
  if (item.motivo === 'unidad') {
    if (item.kind === 'escala') return aTexto(cantidad(f, item.unidad), idioma);
    return valorConUnidad(ctx, 'a', f, idioma);
  }
  return valorConUnidad(ctx, CLAVE[item.kind], f, idioma);
}
/** La respuesta buena, con su unidad. */
export function respuestaBuena(item, idioma) {
  const f = valorBueno(item);
  if (item.kind === 'redondeo') return `${numeroATexto(f, idioma)} ${COSA(item.ctx, f, idioma)}`;
  return valorConUnidad(ctxPorId(item.ctx), CLAVE[item.kind], f, idioma);
}

export function enunciadoSentido(item, idioma) {
  let texto;
  if (item.kind === 'redondeo') texto = ENUNCIADO_REDONDEO[item.ctx][idioma](numeroATexto(fraccion(item.total), idioma), item.cap);
  else texto = enunciado(ctxPorId(item.ctx), datosDe(item), idioma);
  const dado = t2(idioma, `Una compañera contesta: «${respuestaDada(item, idioma)}».`, `A classmate answers: “${respuestaDada(item, idioma)}”.`);
  const pregunta = t2(idioma, '¿Qué le dirías?', 'What would you tell her?');
  return { texto, dado, pregunta };
}

/** La cuenta bien hecha, como líneas { es, en } (o null). */
function lineasDeSentido(item) {
  if (item.kind === 'redondeo') {
    const n = (x, idioma) => numeroATexto(fraccion(x), idioma);
    const q = fraccion(item.total, item.cap).simplificar();
    return [{ es: `${n(item.total, 'es')} : ${item.cap} = ${numeroATexto(q, 'es')}`, en: `${n(item.total, 'en')} : ${item.cap} = ${numeroATexto(q, 'en')}` }];
  }
  const d = datosDe(item);
  if (item.kind === 'directa') return proporcionDirecta({ a: d.a, b: d.b, c: d.c }, 'unidad').pasos;
  if (item.kind === 'descuento') return aplicarPorcentaje(d.precio, d.p, 'descuento').pasosDosPasos;
  if (item.kind === 'porcentaje') return porcentajeDe(d.p, d.total, 'fraccion').pasos;
  return realidad(d.plano, d.escala.valor, ctxPorId(item.ctx).datos.real.unidad).pasos;
}

function frasesDeSentido(item, idioma) {
  const dado = respuestaDada(item, idioma), bien = respuestaBuena(item, idioma);
  switch (item.motivo) {
    case 'ok':
      return item.kind === 'redondeo'
        ? t2(idioma, `Está bien: el cociente no es entero, y como no puede haber una parte de ${COSA(item.ctx, fraccion(1), 'es')}, se redondea hacia arriba. Hacen falta ${bien}.`,
          `It is right: the quotient is not a whole number, and there cannot be part of a ${COSA(item.ctx, fraccion(1), 'en')}, so it is rounded up. You need ${bien}.`)
        : t2(idioma, `Está bien: la cuenta da ${bien}, que es lo que contesta.`, `It is right: the working gives ${bien}, which is what she says.`);
    case 'unidad':
      return t2(idioma, `El número es el correcto, pero la unidad no: no son ${dado}, son ${bien}.`, `The number is right, but the unit is not: it is not ${dado}, it is ${bien}.`);
    case 'redondeo': {
      const f = fraccion(item.total, item.cap).simplificar();
      const sin = Math.floor(f.num / f.den), sobran = item.total - sin * item.cap;
      return t2(idioma,
        `No puede haber ${dado}: con ${sin} ${COSA(item.ctx, fraccion(sin), 'es')} se quedarían ${sobran} sin sitio. Se redondea hacia arriba: ${bien}.`,
        `There cannot be ${dado}: with ${sin} ${COSA(item.ctx, fraccion(sin), 'en')} there would be ${sobran} left over. It is rounded up: ${bien}.`);
    }
    default: {
      const porque = {
        descuento: t2(idioma, 'Con un descuento el precio baja, y aquí sube.', 'With a discount the price goes down, and here it goes up.'),
        porcentaje: t2(idioma, 'Un porcentaje de un total no puede ser más grande que el total.', 'A percentage of a total cannot be bigger than the total.'),
        escala: t2(idioma, 'Falta cambiar de unidad: las dos medidas de la escala están en la misma unidad.', 'The unit has not been changed: both numbers of a scale are in the same unit.'),
        directa: t2(idioma, 'Con unas pocas unidades más no sale un precio tan enorme.', 'A few more units do not make the price that huge.'),
      }[item.kind];
      return t2(idioma, `${dado} no es creíble aquí. ${porque} La cuenta bien hecha da ${bien}.`, `${dado} is not believable here. ${porque} The right working gives ${bien}.`);
    }
  }
}

export function explicaSentido(item, idioma) {
  const lineas = lineasDeSentido(item);
  return `${frasesDeSentido(item, idioma)}${lineas ? pasosHtml(lineas, idioma) : ''}`;
}

// ─── Lo común ──────────────────────────────────────────────────────────────────

export const TX = {
  tipo: {
    nombre: { es: '¿Qué tipo de problema es?', en: 'What kind of problem is it?' },
    detalle: { es: 'Lee el problema, sin resolverlo, y di qué tipo es.', en: 'Read the problem, without solving it, and say what kind it is.' },
    introduccion: {
      es: 'Un porcentaje, una escala o un reparto también son proporcionalidad, pero aquí se separan: <strong>directa</strong> si no lleva ni %, ni escala, ni reparto; <strong>porcentaje</strong> si lleva un %; <strong>escala</strong> si lleva un plano o una escala; <strong>reparto</strong> si se reparte un total en partes proporcionales. Ejemplo: «Una camiseta de 45,00 € tiene un 20 % de descuento» es un porcentaje.',
      en: 'A percentage, a scale or a share-out are also proportion, but here they are kept apart: <strong>direct</strong> if it has no %, no scale and no share-out; <strong>percentage</strong> if it has a %; <strong>scale</strong> if it has a plan or a scale; <strong>share-out</strong> if a total is shared in proportional parts. Example: “A T-shirt of €45.00 has a 20% discount” is a percentage.',
    },
    pregunta: { es: '¿Qué tipo de problema es?', en: 'What kind of problem is it?' },
  },
  oferta: {
    nombre: { es: 'La mejor oferta', en: 'Best buy' },
    detalle: { es: 'Dos envases del mismo producto: ¿cuál sale mejor de precio?', en: 'Two packs of the same product: which one is the better price?' },
    introduccion: {
      es: 'Para saber qué oferta es mejor se compara el precio de <strong>una</strong> unidad (un litro, un kilo, un yogur). Ejemplo: 2 L por 3,00 € son 1,50 € el litro y 5 L por 7,00 € son 1,40 € el litro: sale mejor la segunda.',
      en: 'To find the best buy, compare the price of <strong>one</strong> unit (a litre, a kilo, a yoghurt). Example: 2 L for €3.00 is €1.50 a litre and 5 L for €7.00 is €1.40 a litre: the second one is the best buy.',
    },
  },
  sentido: {
    nombre: { es: '¿Tiene sentido la respuesta?', en: 'Does the answer make sense?' },
    detalle: { es: 'Una compañera ha contestado un problema: ¿está bien?', en: 'A classmate has answered a problem: is it right?' },
    introduccion: {
      es: 'Antes de dar una respuesta por buena, mira si tiene sentido: la <strong>unidad</strong> tiene que ser la de lo que se pide, el número tiene que ser <strong>creíble</strong> y, si cuentas personas o cosas, tiene que ser <strong>entero</strong>. Ejemplo: «300 alumnos en autobuses de 40 plazas: 7,5 autobuses» no puede ser; hacen falta 8.',
      en: 'Before accepting an answer, check that it makes sense: the <strong>unit</strong> must be the one the question asks for, the number must be <strong>believable</strong> and, if you count people or things, it must be a <strong>whole number</strong>. Example: “300 pupils in buses with 40 seats: 7.5 buses” is impossible; you need 8.',
    },
  },
  no_se_hacerlo: { es: 'No sé hacerlo', en: 'I don’t know how' },
};
